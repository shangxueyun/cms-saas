
<template>
  <div class="useRecord">
    <span class="page_head_title">营销管理</span>
    <div class="pl-content">
      <ul class="default_tab_block">
        <li @click="changeTab('specialActivity')"
            v-if="hasAuthority('02050801')">
          <span>优惠活动管理</span>
        </li>
        <li class="active"
            v-if="hasAuthority('02050805')">
          <span>优惠券使用记录</span>
        </li>
      </ul>
      <div class="search-bar">
        <div>
          <el-select v-model="seachParam.projectManagementId"
                     clearable
                     placeholder="项目简称">
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-input placeholder="活动名称"
                    v-model="seachParam.activityName"
                    style="width:200px"></el-input>
          <el-input placeholder="优惠券名称/客户电话"
                    v-model="seachParam.couponNameOrTelephone"
                    style="width:200px"></el-input>
          <span class="query-btn"
                @click="queryRules">查询</span>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%"
                  ref="multipleTable">
          <el-table-column prop="projectManagementName"
                           label="项目简称"
                           align="center" />
          <el-table-column prop="activityName"
                           label="活动名称"
                           align="center" />
          <el-table-column prop="couponName"
                           label="优惠券名称"
                           align="center" />
          <el-table-column prop="denomination"
                           label="面额"
                           align="center" />
          <el-table-column prop="telephone"
                           label="客户电话"
                           align="center" />
          <el-table-column label="领取时间"
                           :formatter="dateFormat"
                           align="center" />
          <el-table-column :formatter="dateFormat1"
                           label="使用时间"
                           align="center" />
          <el-table-column prop="orderNumber"
                           label="总订单号"
                           align="center" />
        </el-table>
      </div>
      <div v-if="total > 0"
           class="ctc-foot1">
        <span>
          <span style="margin-right:10px">{{currentPage}}/{{totalPages}}页</span> 共{{total}}条记录
        </span>
        <el-pagination background
                       layout="prev, pager, next"
                       :page-size=pgSize
                       :total="total"
                       :current-page="currentPage"
                       @current-change="current_change" />

        <div class="pagingnum">
          显示
          <select v-model="pgSize"
                  @change="currentSel">
            <option v-for="item in pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </option>
          </select>
          条目
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import moment from 'moment'
export default {
  name: 'useRecord',
  components: {

  },
  data () {
    return {
      seachParam: {
        projectManagementId: '',
        couponNameOrTelephone: '',
        activityName: ''
      },
      tableData: [],
      currentPage: 1,
      totalPages: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      pgNumoptions: [
        {
          value: 15,
          label: '15'
        },
        {
          value: 30,
          label: '30'
        },
        {
          value: 50,
          label: '50'
        }
      ]
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
    let projectManagementId = this.$route.params.projectManagementId
    this.seachParam.projectManagementId = projectManagementId || ''
    this.query()
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    async query () {
      let result = await context.http.get('ord/api/couponUsedRecords', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'usedTime,desc',
        activityName: this.seachParam.activityName,
        couponNameOrTelephone: this.seachParam.couponNameOrTelephone,
        projectManagementId: this.seachParam.projectManagementId
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    dateFormat (row, column) {
      let time = moment(row.receiveTime).format('YYYY-MM-DD HH:mm:ss')
      return time
    },
    dateFormat1 (row, column) {
      let time = moment(row.usedTime).format('YYYY-MM-DD HH:mm:ss')
      return time
    },
    changeTab (type) {
      this.$router.push({
        name: type,
        params: { projectManagementId: this.seachParam.projectManagementId }
      })
    },
    queryRules () {
      this.currentPage = 1
      this.pgSize = 15
      this.query()
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    }
  }
}
</script>
<style lang="scss">
.useRecord {
  .el-input-number .el-input__inner {
    text-align: left;
  }
  .deviceDetails {
    width: 140px;
    height: 120px;
    margin-right: 0px !important;
    .oss_file {
      width: 100%;
      height: 100%;
      border: none;
      background-color: #eaeaea;
      border: 1px solid rgba(234, 234, 234, 1);
      border-radius: 4px;
      color: #3575f6;
      > i {
        font-size: 32px;
        position: absolute;
        top: 8px;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
      }
      > span {
        position: absolute;
        top: 40px;
        left: 0px;
      }
    }
  }
  .el-dialog__wrapper {
    &.addGoodsDialog {
      .el-dialog {
        .el-dialog__header {
          margin-bottom: 0px;
        }
        .el-dialog__body {
          background-color: #faf7fa;
          .steps {
            height: 60px;
            padding: 0 15px;
            border-top: 1px solid #f6f6f6;
            background-color: #ffffff;
            margin-bottom: 15px;
          }
          .dialog_content {
            background-color: #ffffff;
            margin-top: 0px;
            .checkbox-group {
              width: 100%;
              .el-checkbox {
                width: 20%;
                margin-top: 10px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.useRecord {
  .addAddressContent {
    padding: 12px 20px;
    > p {
      margin-bottom: 10px;
    }
    .addressList {
      min-height: 50px;
      .el-tag {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }
  .editBtn {
    position: absolute;
    right: 5px;
    bottom: 0;
    > span {
      display: inline-block;
      height: 28px;
      line-height: 28px;
      background-color: #0d9bf2;
      color: #fff;
      border: 0;
      outline: none;
      padding-left: 5px;
      padding-right: 5px;
      border-radius: 3px;
      margin-bottom: 4px;
      cursor: pointer;
    }
  }
  #container {
    width: 100%;
    height: 500px;
  }
  .psScope {
    display: inline-block;
    width: 56px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border: 1px solid #f3af2c;
    border-radius: 3px;
    color: #f3af2c;
    cursor: pointer;
    &:hover {
      background: #f3af2c;
      color: #fff;
    }
  }
  .addGoodsDialog {
    .slotfooter {
      .save {
        margin-right: 12px;
        height: 32px;
        line-height: 32px;
        color: #3577f6;
        border: 1px solid #3577f6;
        background: rgba(53, 119, 246, 0.05);
      }
    }
    .el-form {
      padding: 0 !important;
      .content {
        padding: 15px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 100%;
        .el-form-item {
          width: 32%;
          .el-form-item__content {
            > span {
              margin-bottom: 5px;
              display: inline-block;
              height: 25px;
              display: -ms-flexbox;
              display: flex;
              -ms-flex-align: center;
              align-items: center;
              font-size: 14px;
              color: #777777;
            }
            > p {
              color: #666666;
              font-size: 12px;
              height: 40px;
              line-height: 40px;
            }
            .tips {
              font-size: 12px;
              color: #999999;
              margin-top: 10px;
            }
            // .imgBox {
            //   width: 140px;
            //   height: 120px;
            //   position: relative;
            //   background: rgba(255, 255, 255, 1);
            //   border: 1px solid rgba(234, 234, 234, 1);
            //   border-radius: 4px;
            //   > .bottomTips {
            //     height: 25px;
            //     position: absolute;
            //     left: 0px;
            //     bottom: 0px;
            //     width: 140px;
            //     background-color: #fdffff;
            //     display: flex;
            //     align-items: center;
            //     font-size: 12px;
            //     justify-content: space-between;
            //     padding: 0 5px;
            //     > span {
            //       display: inline-block;
            //       width: 60%;
            //       overflow: hidden;
            //       text-overflow: ellipsis;
            //       white-space: nowrap;
            //       padding: 0 5px;
            //     }
            //     > i {
            //       cursor: pointer;
            //     }
            //   }
            // }
          }
        }
      }
    }
  }
  .plc-table {
    .onlineBtn {
      display: inline-block;
      width: 56px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border: 1px solid rgba(68, 175, 105, 1);
      border-radius: 3px;
      color: #44af69;
      cursor: pointer;
    }
    .offlineBtn {
      display: inline-block;
      width: 56px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border: 1px solid #eb605b;
      border-radius: 3px;
      color: #eb605b;
      cursor: pointer;
    }
  }
  .plc-search {
    min-height: 70px;
    line-height: 0;
    background-color: #fff;
    margin: 20px 0;
    padding-left: 18px;
    padding-right: 18px;
    box-shadow: 1px 2px 5px #eee;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -ms-flex-pack: justify;
    justify-content: space-between;
    align-items: center;
    position: relative;
    > div {
      > div {
        margin-right: 15px;
      }
    }
  }
  .typeTab {
    height: 60px;
    line-height: 60px;
    background-color: #ffffff;
    margin-top: 15px;
    box-shadow: 4px 4px 4px 1px #eee;
    > span {
      display: inline-block;
      width: 120px;
      text-align: center;
      cursor: pointer;
      &.active {
        color: #3175d2;
        border-bottom: 2px solid #3175d2;
      }
    }
  }
}
</style>
<style lang="less">
.useRecord .el-input__suffix {
  line-height: 32px;
}
</style>
