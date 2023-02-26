<template>
  <div class="riskDetails">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide"
            :showEditBtn="false">
      <div class="details-content clearfix"
           id="scrollContent"
           slot="drawer"
           style="padding-bottom: 0">
        <div class="item"
             v-for="(item,index) in tableData"
             :key="index">
          <div class="title">
            <i></i>
            {{item.title}}
          </div>
          <div class="tableContent">
            <table border="1"
                   cellpadding="0"
                   cellspacing="0"
                   width="100%">
              <thead>
                <tr class="tableTitle">
                  <th style="width:80px">序号</th>
                  <th v-for="(itm,idx) in item.tableTitle"
                      :key="idx">{{itm}}</th>
                </tr>
              </thead>
              <tbody>
                <tr class="list"
                    v-for="(t,i) in item.list"
                    :key="i">
                  <td>{{i+1}}</td>
                  <td v-for="(k,j) in item.list[i]"
                      :key="j">{{k}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </drawer>
  </div>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
export default {
  components: {
    Drawer
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    tenantDetail: {
      type: Object,
      default: {}
    },
    riskTab: {
      type: Number,
      default: 0
    }
  },
  watch: {
    detailsdrawershow: {
      handler: function (val, oldval) {
        if (val) {
          this.getList()
          $('#scrollContent').animate({
            scrollTop: $('#scrollContent .item').eq(this.riskTab).offset().top - 60
          }, 10)
        }
      }
    }
  },
  data () {
    return {
      drawerTitle: '风险详情',
      tableData: [
        {
          title: '失信数据',
          tableTitle: ['案号', '执行法院', '执行依据文号', '被执行人履行情况', '立案时间', '发布时间'],
          list: []
        },
        {
          title: '被执行数据',
          tableTitle: ['案号', '执行法院', '执行标的（元）', '立案时间'],
          list: []
        },
        {
          title: '裁判文书',
          tableTitle: ['案由', '执行法院', '裁判文书名字', '裁判文书编号', '裁判文书类型', '发布时间', '审判时间', '是否原告', '是否被告', '涉案人员角色', '案件金额', '开庭时间'],
          list: []
        },
        {
          title: '经营异常',
          tableTitle: ['列入经营异常名录原因', '列入日期', '作出决定机关', '移除经营异常名录原因', '移出日期', '移除决定机关'],
          list: []
        },
        {
          title: '行政处罚',
          tableTitle: ['处罚结果', '数据来源', '处罚单位', '处罚决定文书', '处罚事由', '数据来源', '处罚日期'],
          list: []
        },
        {
          title: '环保处罚',
          tableTitle: ['处罚单位', '决定书文号', '处罚日期', '违法类型'],
          list: []
        },
        {
          title: '欠税公告',
          tableTitle: ['欠税余额', '欠税税种', '发布单位', '当前新发生的欠税余额', '发布日期'],
          list: []
        },
        {
          title: '税收违法',
          tableTitle: ['发布日期', '所属税务机关', '案件性质'],
          list: []
        }
      ]
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    getList () {
      let params = {
        tenantId: this.tenantDetail.id,
        tenantName: this.tenantDetail.teantName
      }
      context.http.get('/cms/api/tenantRisk/list', params).then(res => {
        if (res.status === 200) {
          let data = res.data
          for (let key in data) {
            if (data[key].length) {
              data[key] = data[key].map((item, index) => {
                return JSON.parse(item)
              })
            }
          }
          // console.log(data)
          // 失信数据
          let DISHONESTY = data.DISHONESTY
          DISHONESTY = DISHONESTY.map((item, index) => {
            let arr = []
            arr.push(DISHONESTY[index].Anno, DISHONESTY[index].Executegov, DISHONESTY[index].Executeno, DISHONESTY[index].Executestatus, DISHONESTY[index].Liandate, DISHONESTY[index].Publicdate)
            return arr
          })
          this.tableData[0].list = DISHONESTY
          // 被执行数据
          let EXECUTED = data.EXECUTED
          EXECUTED = EXECUTED.map((item, index) => {
            let arr = []
            arr.push(EXECUTED[index].Anno, EXECUTED[index].ExecuteGov, EXECUTED[index].Biaodi, EXECUTED[index].Liandate)
            return arr
          })
          this.tableData[1].list = EXECUTED
          // 裁判文书
          let REFEREE = data.REFEREE
          REFEREE = REFEREE.map((item, index) => {
            let arr = []
            arr.push(
              REFEREE[index].CaseReason,
              REFEREE[index].Court,
              REFEREE[index].CaseName,
              REFEREE[index].CaseNo,
              REFEREE[index].CaseType,
              REFEREE[index].SubmitDate,
              REFEREE[index].UpdateDate,
              REFEREE[index].IsProsecutor ? '是' : '否',
              REFEREE[index].IsDefendant ? '是' : '否',
              this.toJSONCaseRole(REFEREE[index].CaseRole),
              REFEREE[index].Amount,
              REFEREE[index].CourtMonth
            )
            return arr
          })
          this.tableData[2].list = REFEREE
          // 经营异常
          let MANAGEMENT = data.MANAGEMENT
          MANAGEMENT = MANAGEMENT.map((item, index) => {
            let arr = []
            arr.push(
              MANAGEMENT[index].AddReason,
              MANAGEMENT[index].AddDate,
              MANAGEMENT[index].DecisionOffice,
              MANAGEMENT[index].RomoveReason,
              MANAGEMENT[index].RemoveDate,
              MANAGEMENT[index].RemoveDecisionOffice
            )
            return arr
          })
          this.tableData[3].list = MANAGEMENT
          // 行政处罚
          let ADMINISTRATION = data.ADMINISTRATION
          ADMINISTRATION = ADMINISTRATION.map((item, index) => {
            let arr = []
            arr.push(
              ADMINISTRATION[index].Result,
              ADMINISTRATION[index].Source,
              ADMINISTRATION[index].PunishOffice,
              ADMINISTRATION[index].DocNo,
              ADMINISTRATION[index].PunishReason,
              this.SourceCodeFormat(ADMINISTRATION[index].SourceCode),
              ADMINISTRATION[index].PunishDate
            )
            return arr
          })
          this.tableData[4].list = ADMINISTRATION
          // 环保处罚
          let ENVIRONMENT = data.ENVIRONMENT
          ENVIRONMENT = ENVIRONMENT.map((item, index) => {
            let arr = []
            arr.push(
              ENVIRONMENT[index].PunishGov,
              ENVIRONMENT[index].CaseNo,
              ENVIRONMENT[index].PunishDate,
              ENVIRONMENT[index].IllegalType
            )
            return arr
          })
          this.tableData[5].list = ENVIRONMENT
          // 欠税公告
          let TAXARREARS = data.TAXARREARS
          TAXARREARS = TAXARREARS.map((item, index) => {
            let arr = []
            arr.push(
              TAXARREARS[index].Balance,
              TAXARREARS[index].Category,
              TAXARREARS[index].IssuedBy,
              TAXARREARS[index].NewBal,
              TAXARREARS[index].PublishDate
            )
            return arr
          })
          this.tableData[6].list = TAXARREARS
          // 税收违法
          let TAXVIOLATION = data.TAXVIOLATION
          TAXVIOLATION = TAXVIOLATION.map((item, index) => {
            let arr = []
            arr.push(
              TAXVIOLATION[index].PublishDate,
              TAXVIOLATION[index].TaxGov,
              TAXVIOLATION[index].CaseNature
            )
            return arr
          })
          this.tableData[7].list = TAXVIOLATION
        }
      })
    },
    SourceCodeFormat (str) {
      let s = Number(str)
      // 1 - 工商局，2 - 信用中国，3 - 税务局，4 - 其他
      if (s === 1) {
        return '工商局'
      } else if (s === 2) {
        return '信用中国'
      } else if (s === 3) {
        return '税务局'
      } else if (s === 4) {
        return '其他'
      }
    },
    toJSONCaseRole (str) {
      let obj = JSON.parse(str)
      let tex = ''
      obj.map((item, index) => {
        tex += item.R + '：' + item.P + '；'
      })
      return tex
    },
    onHide () {
      $('#scrollContent').animate({
        scrollTop: 0
      }, 10)
      this.$emit('drawerClose')
    }
  }
}
</script>
<style lang="scss" >
.el-table__header thead tr th {
  background-color: #f7f8fa !important;
  color: #777777 !important;
}
.riskDetails {
  > div {
    &.vue-drawer {
      background-color: #faf7fa !important;
      .drawer {
        overflow-y: hidden;
        overflow-x: hidden;
      }
      .wrap {
        height: 100%;
        background-color: #faf7fa !important;
      }
      .drawer-head {
        padding: 0;
        margin: 0;
        height: 50px;
        line-height: 50px;
        background-color: #ffffff;
        padding-left: 15px;
        font-weight: bold;
        border: none;
        .el-dialog__close {
          font-size: 24px;
          color: #b9b9b9;
          margin-top: 10px;
        }

        .el-dialog__title {
          color: #262626;
          font-size: 16px;
        }
      }

      .details-content {
        margin: 0;
        height: calc(100vh - 50px);
        overflow: auto;
        &::-webkit-scrollbar {
          width: 4px !important;
          height: 4px !important;
        }
        &::-webkit-scrollbar-track {
          box-shadow: inset 0 0 6px #fff;
          background-color: #fff;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          box-shadow: inset 0 0 6px #cccccc;
        }
        .shopList {
          padding: 10px;
          border-top: 1px solid #f2f2f2;
          margin: 0;
          background-color: #ffffff;
        }
      }
      .el-dialog__footer {
        padding: 0;
        background-color: #ffffff;
        margin-top: 15px;

        .dialog-footer {
          height: 80px;
          display: flex;
          flex-direction: row-reverse;
          align-items: center;

          > span {
            display: inline-block;
            width: 90px;
            height: 34px;
            line-height: 34px;
            text-align: center;
            cursor: pointer;
            color: #666666;

            &.subBtn {
              background-color: #3577f6;
              color: #ffffff;
              border-radius: 4px;
            }
          }
        }
      }
    }
  }

  .ctc-foot {
    justify-content: normal;
    flex-direction: row-reverse;
    align-items: center;
    color: #3f5fbf;
    font-size: 12px;
    padding: 60px 20px 30px 20px;

    .pagingnum {
      color: #3f5fbf;
      font-size: 12px;

      select {
        width: 65px;
        height: 28px;
        border-radius: 2px;
        border-color: #f6f6f7;
        color: #3577f6;
      }
    }

    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .el-pager li {
      margin: 0 5px;
      background-color: transparent;
      color: #3f5fbf;
      min-width: 30px;
      border-radius: 2px;
      font-size: 14px;
    }

    .el-pagination.is-background .el-pager li:not(.disabled).active {
      border-radius: 50%;
      background-color: #3f5fbf !important;
      color: #fff !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.riskDetails {
  width: 100%;
  height: 100%;
  .details-content {
    width: 1520px;
    position: relative;
    padding: 15px;
    > .item {
      background-color: #ffffff;
      margin-bottom: 12px;
      border-radius: 4px;
      padding-bottom: 15px;
      .title {
        border-bottom: 1px solid #f6f6f6;
        height: 40px;
        display: flex;
        align-items: center;
        padding-left: 15px;
        font-size: 16px;
        color: #272727;
        font-weight: bold;
        > i {
          display: inline-block;
          background-color: #3676f6;
          width: 4px;
          height: 16px;
          margin-right: 7px;
        }
      }
      .tableContent {
        margin: 15px;
        border: 1px solid #eff3f5;
        min-height: 100px;
        > table {
          table-layout: fixed;
          word-break: break-all;
        }
        .tableTitle {
          font-size: 14px;
          color: #787878;
          background-color: #f4f9fd;
          height: 40px;
          line-height: 40px;
          > li {
          }
        }
      }
      .list {
        font-size: 12px;
        color: #272727;
        > td {
          text-align: center;
          padding: 12px 5px;
          border-right: 1px solid #eee;
          vertical-align: middle;
          // border-bottom: 1px solid #eee;
        }
      }
    }
  }
  .dialog-footer {
    // margin-right: 30px;
  }
}
</style>
