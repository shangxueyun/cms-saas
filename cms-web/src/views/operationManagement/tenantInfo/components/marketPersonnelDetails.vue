<template>
  <div>
    <drawer :show="detailsShow"
            title="人员详情"
            @on-hide="onHide">
      <div class="marketPersonnelDetails"
           slot="drawer">
        <div class="content">
          <div class="left">
            <div class="personInfo">
              <div class="title">
                <span>
                  <i></i>
                  <span>{{detailData.name}}</span>
                </span>
                <span class="icons"
                      @click="editTenantPersonnel"><i class="iconfont icon-edit1"></i> 编辑</span>
              </div>
              <div class="main">
                <div> <span>身份证</span> <span>{{detailData.idCard}}</span></div>
                <div> <span>性别</span> <span>{{detailData.sex}}</span></div>
                <div> <span>居住地址</span> <span>{{detailData.address}}</span></div>
                <div> <span>联系电话</span> <span>{{detailData.telephone}}</span></div>
                <div> <span>状态</span> <span>{{detailData.useStatus==='USING'?'使用中':'停用'}}</span></div>
              </div>
            </div>
            <div class="tenant">
              <div class="title">
                <span>
                  <i></i>
                  <span>所属客户</span>
                </span>
              </div>
              <div class="main">
                <div> <span>客户名称</span> <span>{{tenantDetail.teantName}}</span></div>
                <div> <span>岗位 / 职务</span> <span>{{detailData.post}}</span></div>
                <div> <span>备注</span> <span>{{detailData.remake}}</span></div>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="title">
              <span>
                <i></i>
                <span>跟进记录</span>
              </span>
            </div>
            <div class="main">
              <!-- <div class="seach">
                <el-date-picker v-model="seachDate"
                                type="month"
                                placeholder="选择月">
                </el-date-picker>
                <div class="query-btn"
                     style="height: 32px;line-height: 32px;width:70px;margin-top: 0px"
                     @click="query">查询</div>
              </div> -->
              <div class="datePick">
                <el-calendar :first-day-of-week="7"
                             v-if="detailsShow"
                             v-model="value"
                             ref="calendar">
                  <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
                  <template slot="dateCell"
                            slot-scope="{ date, data }">
                    <div class="dateCell"
                         :class="{'normal':formatStatus(data.day)==='true','abnormal':formatStatus(data.day)==='异常'||formatStatus(data.day)==='未上传'}"
                         v-if="data.type==='current-month'">
                      <p :class="data.isSelected ? 'is-selected' : ''">{{ formatDay(data.day)}}</p>
                      <p v-if="formatStatus(data.day)">
                        <span v-if="formatStatus(data.day).normal"><i class="iconfont icon-cms_chenggong"></i></span>
                        <span class="warn"
                              v-else><i class="iconfont icon-cms_ciyaojinggao"></i>{{formatStatus(data.day).describe}}</span>
                      </p>
                    </div>
                  </template>
                </el-calendar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </drawer>
  </div>
</template>
<script>
import Drawer from '@/components/drawer.vue'
import moment from 'moment'
import context from '@/service'
export default {
  name: 'marketPersonnelDetails',
  components: {
    Drawer
  },
  props: {
    detailsShow: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object,
      default: {}
    },
    tenantDetail: {
      type: Object,
      default: {}
    }
  },
  watch: {
    'detailsShow' (newValue, oldValue) {
      if (newValue) {
        this.bindButton()
        this.calendarList(this.parseTime(this.value))
      }
    }
  },
  created () {
  },
  mounted () {

  },
  data () {
    return {
      dataArr: [],
      value: new Date(),
      seachDate: '',
      readOnly: true
    }
  },
  beforeDestroy () { // 销毁绑定事件
    let prevBtnPre = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(1)')
    let prevBtnNext = document.querySelector('.el-calendar__button-group .el-button-group>button:last-child')
    if (!prevBtnPre || !prevBtnNext) return
    prevBtnPre.removeEventListener('click', () => {
      this.calendarList(this.parseTime(this.value))
    })
    prevBtnNext.removeEventListener('click', () => {
      this.calendarList(this.parseTime(this.value))
    })
  },
  methods: {
    calendarList (date) { // YYYY-MM-DD
      context.http.get('/gos/api/nucleicAcidRecord/' + this.detailData.id, { queryTime: date }).then(res => {
        this.dataArr = res.data
      })
    },
    bindButton () {
      this.$nextTick(() => {
        // 点击前一个月
        let prevBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(1)')
        if (prevBtn) {
          prevBtn.addEventListener('click', () => {
            this.calendarList(this.parseTime(this.value))
          })
        }
      })
      this.$nextTick(() => {
        // 点击后一个月
        let prevBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:last-child')
        if (prevBtn) {
          prevBtn.addEventListener('click', () => {
            this.calendarList(this.parseTime(this.value))
          })
        }
      })
    },
    editTenantPersonnel () {
      this.$emit('editTenantPersonnel')
    },
    formatStatus (date) {
      let len = this.dataArr.length
      let res = ''
      for (let i = 0; i < len; i++) {
        if (this.dataArr[i].uploadDate === date) {
          res = this.dataArr[i]
          break
        }
      }
      return res
      // if (res) {
      //   if (!res.normal) {
      //     return res.describe
      //   } else {
      //     return res.normal
      //   }
      // }

      // let dayData = this.dataArr.filter((item, index) => {
      //   return item.uploadDate === date
      // })[0]
      // console.log(dayData)
      // if (dayData) {
      //   if (dayData.normal) {
      //     return dayData.normal
      //   } else {
      //     return dayData.describe
      //   }
      // }
    },
    formatDay (date) {
      return moment(date).format('D')
    },
    parseTime (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    onHide () {
      this.$emit('drawerClose')
    }
  }
}
</script>
<style lang="scss" scoped>
.marketPersonnelDetails {
  margin: 0;
  height: calc(100% - 60px);
  overflow: hidden;
  width: 1000px;
  .content {
    margin-top: 10px;
    display: flex;
    height: calc(100% - 0px);
    justify-content: space-between;
    overflow-y: auto;
    padding: 0 15px;
    &::-webkit-scrollbar {
      width: 4px !important;
      height: 4px !important;
    }
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px #fafafa;
      background-color: #fafafa;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 6px #cccccc;
    }
    .left {
      width: 290px;
      margin-bottom: 30px;
      .personInfo,
      .tenant {
        border-radius: 4px;
        position: relative;
        background-color: #ffffff;
        .main {
          padding: 5px 10px;
          > div {
            margin-bottom: 18px;
            > span {
              &:first-child {
                color: #777777;
                font-size: 14px;
                display: inline-block;
                width: 100px;
              }
              &:last-child {
                color: #262626;
                font-size: 14px;
                vertical-align: middle;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                width: 150px;
                display: inline-block;
              }
            }
          }
        }
      }
      .tenant {
        margin-top: 10px;
      }
    }
    .right {
      font-size: 14px;
      color: #666;
      width: calc(100% - 300px);
      background-color: #ffffff;
    }
    .main {
      .seach {
        display: flex;
        padding: 0 15px;
        margin-top: 15px;
      }
      .datePick {
        padding: 15px;
      }
    }
    .title {
      height: 36px;
      background-color: #ffffff;
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      color: #262626;
      padding: 0 10px;
      font-weight: bold;
      align-items: center;
      border-bottom: 1px solid #eee;
      > span {
        &:first-child {
          display: flex;
          align-items: center;
          > i {
            display: inline-block;
            width: 4px;
            height: 16px;
            background: rgba(53, 117, 246, 1);
            border-radius: 2px;
            margin-right: 5px;
          }
        }
      }
      .icons {
        font-weight: normal;
        cursor: pointer;
        font-size: 12px;
        color: #3575f6;
      }
    }
  }
}
</style>
<style lang="scss">
.el-calendar {
  .el-calendar__header {
    // background: #e8f5f5;
    height: 64px;
    line-height: 64px;
    padding: 15px 0;
    border-bottom: none;
    .el-calendar__title {
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #2b2b2b;
    }
  }
  .el-calendar-table__row {
    .prev,
    .next {
      .day {
        display: none;
      }
      .day[show] {
        display: block;
      }
    }
  }
  .el-calendar-table {
    width: 100%;
    height: 100%;
    &:not(.is-range) {
      //使不是本月的日期不可点击，不会跳转到其他月份
      td.next {
        pointer-events: none;
      }
      td.prev {
        pointer-events: none;
      }
    }
  }

  .el-calendar-table td.is-selected {
    background-color: transparent;
  }
  .el-calendar__button-group {
    width: 100%;
    padding: 10px 15px;

    .el-button-group {
      display: flex;
      align-content: center;
      justify-content: space-between;
    }
    .el-button-group::after,
    .el-button-group::before {
      content: unset;
    }
    .el-button {
      padding: 0;
    }
    .el-button-group > .el-button:not(:first-child):not(:last-child) {
      display: none;
    }

    .el-button-group > .el-button:first-child {
      border: none;
      align-self: center;
      width: 22px;
      height: 22px;
      background: url("~@/assets/iconleft.png") no-repeat center;
      background-size: contain;
      // &:hover {
      //   // background: url("~@/assets/contest/next.png") no-repeat center;
      //   background-size: 100% 100%;
      //   transform: rotate(-180deg);
      // }
    }
    .el-button-group > .el-button:last-child {
      border: none;
      align-self: center;
      width: 22px;
      height: 22px;
      background: url("~@/assets/iconright.png") no-repeat center;
      background-size: contain;
      // &:hover {
      //   // background: url("~@/assets/contest/next.png") no-repeat center;
      //   background-size: 100% 100%;
      //   transform: rotate(360deg);
      // }
    }

    .el-button-group > .el-button:first-child span,
    .el-button-group > .el-button:last-child span {
      display: none;
    }
  }
  .el-calendar__body {
    padding: 0;
    .el-calendar-table {
      thead {
        height: 40px;
        // background: #cfebec;
        th {
          &:first-child {
            border-left: 1px solid #ebeef5;
          }
          &:last-child {
            border-right: 1px solid #ebeef5;
          }
          border-top: 1px solid #ebeef5;
          // border-right: 1px solid #ebeef5;
        }
        th:before {
          // content: "周";
        }
      }
      td {
        .get-day {
          text-align: center;
          font-weight: 500;
          color: #9a9a9a;
        }
      }
      .is-today {
        .get-day {
          color: #ff8f2e;
          font-weight: 500;
        }
      }
    }
  }
  .el-calendar-day:hover {
    background-color: transparent;
  }
  .el-calendar-day {
    background-color: transparent;
    min-height: 85px;
    height: 100%;
    padding: 0 !important;
    .dateCell {
      padding: 8px;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      p {
        font-size: 14px;
        &:first-child {
          text-align: left;
        }
        text-align: center;
        > span {
          font-size: 12px;
          &.warn {
            color: #c2341c;
            background: #f7e9e6;
            border-radius: 10px;
            padding: 2px 5px;
          }
          i {
            &.icon-cms_chenggong {
              font-size: 20px;
              color: #6bcb80;
            }
            &.icon-cms_ciyaojinggao {
              color: #c2341c;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
  .el-calendar-table td.is-today {
    background: #fff;
    .itemdate {
      background: #fff5eb;

      i {
        background: #ff8f2e;
      }
    }
    .item {
      &::before {
        content: "今日";
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ff8f2e;
        text-align: center;
        margin-bottom: 10px;
      }
    }
    .day {
      display: none;
    }
  }
  .el-calendar-table td {
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }
  // .el-calendar-table:not(.is-range) td.next {
  //   /*隐藏下个月的日期*/
  //   visibility: hidden;
  // }

  // .el-calendar-table:not(.is-range) td.prev {
  //   /*隐藏上个月的日期*/
  //   visibility: hidden;
  // }
}
</style>
