<template>
  <div class="riskDetails">
    <app-header :title="title"
                class="retitle"
                :onBackCallBack="backFun">
    </app-header>
    <div class="content">
      <!-- 失信数据0 -->
      <div class="DISHONESTY"
           v-for="(item,index) in detailsData"
           :key="index"
           v-if="dataType==='DISHONESTY'">
        <div class="item">
          <p>案号：</p>
          <div>{{item.Anno}}</div>
        </div>
        <div class="item">
          <p>执行法院：</p>
          <div>{{item.Executegov}}</div>
        </div>
        <div class="item">
          <p>执行依据文号：</p>
          <div>{{item.Executeno}}</div>
        </div>
        <div class="item">
          <p>被执行人履行情况：</p>
          <div>{{item.Executestatus}}</div>
        </div>
        <div class="item">
          <p>立案时间：</p>
          <div>{{item.Liandate}}</div>
        </div>
        <div class="item">
          <p>发布时间：</p>
          <div>{{item.Publicdate}}</div>
        </div>
      </div>
      <!-- 被执行数据1 -->
      <div class="EXECUTED"
           v-for="(item,index) in detailsData"
           :key="index"
           v-if="dataType==='EXECUTED'">
        <div class="item">
          <p>案号：</p>
          <div>{{item.Anno}}</div>
        </div>
        <div class="item">
          <p>执行法院：</p>
          <div>{{item.ExecuteGov}}</div>
        </div>
        <div class="item">
          <p>执行标的(元)：</p>
          <div>{{item.Biaodi}}</div>
        </div>
        <div class="item">
          <p>立案时间：</p>
          <div>{{item.Liandate}}</div>
        </div>
      </div>
      <!-- 裁判文书2 -->
      <div class="REFEREE "
           v-for="(item,index) in detailsData"
           :key="index"
           v-if="dataType==='REFEREE'">
        <div class="item">
          <p>裁判文书名字：</p>
          <div>{{item.CaseName}}</div>
        </div>
        <div class="item">
          <p>裁判书编号：</p>
          <div>{{item.CaseNo}}</div>
        </div>
        <div class="item">
          <p>案由：</p>
          <div>{{item.CaseReason}}</div>
        </div>
        <div class="item">
          <p>执行法院：</p>
          <div>{{item.Court}}</div>
        </div>
        <div class="item">
          <p>涉案人员角色：</p>
          <div>{{toJSONCaseRole(item.CaseRole)}}</div>
        </div>
        <div class="item">
          <p>案件金额：</p>
          <div>{{item.Amount}}</div>
        </div>
        <div class="item">
          <p>审判日期：</p>
          <div>{{item.UpdateDate}}</div>
        </div>
        <div class="item">
          <p>发布日期：</p>
          <div>{{item.SubmitDate}}</div>
        </div>
      </div>
      <!-- 经营异常3 -->
      <div class="MANAGEMENT"
           v-for="(item,index) in detailsData"
           :key="index"
           v-if="dataType==='MANAGEMENT'">
        <div class="item">
          <p>列入经营异常名录原因：</p>
          <div>{{item.AddReason}}</div>
        </div>
        <div class="item">
          <p>列入日期：</p>
          <div>{{item.AddDate}}</div>
        </div>
        <div class="item">
          <p>作出决定机关：</p>
          <div>{{item.DecisionOffice}}</div>
        </div>
        <div class="item">
          <p>移除经营异常名录原因：</p>
          <div>{{item.RomoveReason}}</div>
        </div>
        <div class="item">
          <p>移出日期：</p>
          <div>{{item.RemoveDate}}</div>
        </div>
        <div class="item">
          <p>移除决定机关：</p>
          <div>{{item.RemoveDecisionOffice}}</div>
        </div>
      </div>
      <!-- 行政处罚4 -->
      <div class="ADMINISTRATION"
           v-for="(item,index) in detailsData"
           :key="index"
           v-if="dataType==='ADMINISTRATION'">
        <div class="item">
          <p>处罚事由：</p>
          <div>{{item.PunishReason}}</div>
        </div>
        <div class="item">
          <p>处罚结果：</p>
          <div>{{item.Result}}</div>
        </div>
        <div class="item">
          <p>处罚单位：</p>
          <div>{{item.PunishOffice}}</div>
        </div>
        <div class="item">
          <p>处罚决定文书：</p>
          <div>{{item.DocNo}}</div>
        </div>
        <div class="item">
          <p>处罚日期：</p>
          <div>{{item.PunishDate}}</div>
        </div>
        <div class="item">
          <p>数据来源：</p>
          <div>{{SourceCodeFormat(item.SourceCode)}}</div>
        </div>
      </div>
      <!-- 环保处罚5 -->
      <div class="ENVIRONMENT"
           v-for="(item,index) in detailsData"
           :key="index"
           v-if="dataType==='ENVIRONMENT'">
        <div class="item">
          <p>决定书文号：</p>
          <div>{{item.CaseNo}}</div>
        </div>
        <div class="item">
          <p>处罚单位：</p>
          <div>{{item.PunishGov}}</div>
        </div>
        <div class="item">
          <p>处罚日期：</p>
          <div>{{item.PunishDate}}</div>
        </div>
        <div class="item">
          <p>违法类型：</p>
          <div>{{item.IllegalType}}</div>
        </div>
      </div>
      <!-- 欠税公告6 -->
      <div class="TAXARREARS"
           v-for="(item,index) in detailsData"
           :key="index"
           v-if="dataType==='TAXARREARS'">
        <div class="item">
          <p>欠税余额：</p>
          <div>{{item.Balance}}</div>
        </div>
        <div class="item">
          <p>欠税税种：</p>
          <div>{{item.Category}}</div>
        </div>
        <div class="item">
          <p>发布单位：</p>
          <div>{{item.IssuedBy}}</div>
        </div>
        <div class="item">
          <p>当前新发生的欠税余额：</p>
          <div>{{item.NewBal}}</div>
        </div>
        <div class="item">
          <p>发布日期：</p>
          <div>{{item.PublishDate}}</div>
        </div>
      </div>
      <!-- 税收违法7 -->
      <div class="TAXVIOLATION"
           v-for="(item,index) in detailsData"
           :key="index"
           v-if="dataType==='TAXVIOLATION'">
        <div class="item">
          <p>案件性质：</p>
          <div>{{item.CaseNature}}</div>
        </div>
        <div class="item">
          <p>所属税务机关：</p>
          <div>{{item.TaxGov}}</div>
        </div>
        <div class="item">
          <p>发布日期：</p>
          <div>{{item.PublishDate}}</div>
        </div>
      </div>
      <div class="loadAll contractLoadAll"
           v-if="detailsData.length>0"
           style="margin-bottom:0">
        <span>-</span>
        <p>已经到底了</p>
        <span>-</span>
      </div>
    </div>

  </div>
</template>
<script>
import context from '@/service'
import AppHeader from '@/components/appHead'
export default {
  components: { AppHeader },
  data () {
    return {
      tenantDetail: {},
      drawerTitle: '风险详情',
      detailsData: [],
      dataType: '',
      title: ''
    }
  },
  created () {
    this.tenantDetail = this.$route.params.tenantDetail
    this.dataType = this.$route.params.dataType
    this.headerTitle(this.dataType)
    console.log(this.tenantDetail, this.dataType)
  },
  mounted () {
    this.getList()
  },
  methods: {
    headerTitle (type) {
      switch (type) {
        case 'REFEREE':
          this.title = '裁判文书'
          break
        case 'DISHONESTY':
          this.title = '失信数据'
          break
        case 'EXECUTED':
          this.title = '被执行数据'
          break
        case 'MANAGEMENT':
          this.title = '经营异常'
          break
        case 'ADMINISTRATION':
          this.title = '行政处罚'
          break
        case 'ENVIRONMENT':
          this.title = '环保处罚'
          break
        case 'TAXARREARS':
          this.title = '欠税公告'
          break
        case 'TAXVIOLATION':
          this.title = '税收违法'
          break
      }
    },
    backFun () {
      this.$router.go(-1)
    },
    getList () {
      // let params = {
      //   tenantId: 655,
      //   tenantName: '上海爱尚鲜花股份有限公司'
      // }
      let params = {
        tenantId: this.tenantDetail.id,
        tenantName: this.tenantDetail.teantName
      }
      context.http.get('cms/api/tenantRisk/list', params).then(res => {
        if (res.status === 200) {
          let data = res.data
          for (let key in data) {
            if (data[key].length) {
              data[key] = data[key].map((item, index) => {
                return JSON.parse(item)
              })
            }
          }
          this.detailsData = data[this.dataType]
          // console.log(this.detailsData)
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
<style lang="scss" scoped>
@import "../../../style/config";
.riskDetails {
  .content {
    margin-top: rem(40);
    > div {
      background-color: #fff;
      padding: rem(14);
      margin-bottom: rem(14);
      .item {
        display: flex;
        font-size: rem(15);
        color: #858c94;
        justify-content: space-between;
        margin-bottom: rem(14);
        // padding: 0 rem(5);
        > p {
          white-space: pre;
        }
        > div {
          color: #18191a;
        }
      }
    }
  }
}
</style>
