
<template>
  <div class="clubCardSet">
    <span class="page_head_title">优惠券审核</span>
    <div class="pl-content">
      <div class="search-bar">
        <div>
          <el-select v-model="seachParam.projectId"
                     clearable
                     placeholder="项目">
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-input placeholder="品牌名称"
                    v-model="seachParam.brandName"
                    style="width:200px"></el-input>
          <el-input placeholder="优惠券名称"
                    v-model="seachParam.couponName"
                    style="width:200px"></el-input>
          <el-select v-model="seachParam.couponType"
                     placeholder="优惠券类型"
                     clearable>
            <el-option v-for="(item,index) in couponList"
                       :key="index"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="seachParam.reviewStatus"
                     placeholder="审核状态"
                     clearable>
            <el-option v-for="(item,index) in statusList"
                       :key="index"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
          <span class="query-btn"
                @click="currentSel">查询</span>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%"
                  ref="multipleTable">
          <el-table-column label="项目简称"
                           align="center">
            <template slot-scope="scope">
              <span style="display: inline-block; width: 20px;">
                <i v-if="scope.row.reviewStatus==='REVIEWING'||scope.row.reviewStatus==='APPLY_DISABLE'"
                   style="display: inline-block; width: 6px; height: 6px; background-color: #CF2C37; border-radius: 50%;"></i>
              </span>
              <span>{{scope.row.projectName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="brandName"
                           label="品牌名称"
                           align="center"></el-table-column>
          <el-table-column prop="name"
                           label="优惠券名称"
                           align="center"></el-table-column>
          <el-table-column :formatter="typeFormatter"
                           label="优惠券类型"
                           align="center"></el-table-column>
          <el-table-column :formatter="periodFormatter"
                           width="300px"
                           label="发放周期"
                           align="center"></el-table-column>
          <el-table-column prop="totalLimit"
                           label="发布数量"
                           align="center"></el-table-column>
          <el-table-column prop="receivedAmount"
                           label="已领数量"
                           align="center"></el-table-column>
          <el-table-column prop="verifiedAmount"
                           label="核销数量"
                           align="center"></el-table-column>
          <el-table-column :formatter="lastUpdateTimeFormatter"
                           width="140px"
                           label="更新时间"
                           align="center"></el-table-column>
          <el-table-column prop="statusName"
                           label="审核状态"
                           align="center"></el-table-column>
          <el-table-column width="120"
                           v-if="hasAuthority('05070101')"
                           label="操作"
                           align="center">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)"
                         class="el-button--primary operation-btn"
                         size="mini">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot1">
        <span><span style="margin-right:10px">{{currentPage}}/{{totalPages}}页</span> 共{{total}}条记录</span>
        <el-pagination v-if="total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size=pgSize
                       :total="total"
                       :current-page="currentPage"
                       @current-change="current_change">
        </el-pagination>
        <div class="pagingnum">
          显示 <select v-model="pgSize"
                  @change="currentSel">
            <option v-for="item in pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </option>
          </select>
          条目
          <!-- <span style="padding-left: 30px">显示从{{pgSize*(currentPage - 1) + 1}}到{{pgSize*currentPage}}项结果，</span> -->
        </div>
      </div>
    </div>
    <!-- 优惠券详情 -->
    <couponDetailis :detailisShow="detailisShow"
                    :detailData="detailData"
                    :statusList="statusList"
                    @auditSuccess='queryRules'
                    @drawerClose="drawerClose"
                    ref="couponDetailis" />
  </div>
</template>
<script>
import context from '@/service'
import couponDetailis from './components/couponDetailis'
export default {
  name: 'coupon',
  components: {
    couponDetailis
  },
  data () {
    return {
      seachParam: {
        projectId: '',
        brandName: '',
        couponName: '',
        couponType: '',
        reviewStatus: ''
      },
      statusList: [],
      couponList: [
        { name: '代金券', id: 'MONEY_OFF' },
        { name: '折扣券', id: 'PERCENTAGE_OFF' }
      ],
      detailisShow: false,
      detailData: {

      },
      options1: [],
      status: '1',
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
    this.getStatusList()
    // this.projectId = this.$route.params.projectId ? this.$route.params.projectId : this.$store.state.projectManagementsList[0].id
  },
  watch: {
    statusList: {
      handler (newValue, oldValue) {
        if (newValue.length) {
          this.query()
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {

  },
  methods: {
    queryRules () {
      this.currentPage = 1
      this.pgSize = 15
      this.query()
    },
    lastUpdateTimeFormatter (row, column) {
      return row.lastUpdateTime.replace('T', '  ')
    },
    getStatusList () {
      context.http.get(`crm/api/review/statusList`, { businessType: 'COUPON' }).then(res => {
        if (res) {
          this.statusList = res.data
        }
      })
    },
    lockUnLockSuccess (res) {
      this.currentPage = 1
      this.query()
      this.detailData = res
    },
    periodFormatter (row, column) { // 发放周期
      return row.startTime.replace('T', '  ') + ' —— ' + row.endTime.replace('T', '  ')
    },
    typeFormatter (row, column) {
      switch (row.type) {
        case 'MONEY_OFF':
          return '代金券'
        case 'PERCENTAGE_OFF':
          return '折扣券'
      }
    },
    useStatusFormat (row, column) {
      // switch (row.reviewStatus) {
      //   case 'PENDING':
      //     return '暂存'
      //   case 'PENDING_WITH_REJECT':
      //     return '暂存已驳回'
      //   case 'REVIEWING':
      //     return '待审核'
      //   case 'USING':
      //     return '使用中'
      //   case 'USING_WITH_REJECT':
      //     return '使用中(已驳回)'
      //   case 'APPLY_DISABLE':
      //     return '申请停用'
      //   case 'ENDING':
      //     return '结束'
      // }
    },
    handleEdit (index, row) {
      context.http.get(`crm/api/coupons/${row.id}`).then(res => {
        if (res) {
          this.detailData = res.data
          this.detailisShow = true
        }
      })
    },
    drawerClose () {
      this.detailisShow = false
    },
    async query () {
      let result = await context.http.get('crm/api/coupons/query', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'lastModifiedDate,desc',
        projectId: this.seachParam.projectId,
        brandName: this.seachParam.brandName,
        couponName: this.seachParam.couponName,
        couponType: this.seachParam.couponType,
        reviewStatus: this.seachParam.reviewStatus
      })
      let list = result.data.content
      list.forEach((item, index) => {
        this.statusList.forEach((itm, idx) => {
          if (itm.value === item.reviewStatus) {
            item.statusName = itm.name
          }
        })
      })
      this.tableData = list
      this.total = Number(result.data.totalElements)
      this.totalPages = Number(result.data.totalPages)
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
    },
    switchover (state) {
      if (state === 'clubCardSet') {
        this.$router.push({ name: 'clubCardSet' })
      } else if (state === 'upDownSet') {
        this.$router.push({ name: 'upDownSet' })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.clubCardSet {
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
}
.menu {
  height: 62px;
  line-height: 62px;
  border-bottom: 1px solid #eeeeee;
  margin-top: 15px;
  margin-bottom: 20px;
  background-color: #ffffff;
  // padding-left: 20px;
  span {
    display: inline-block;
    width: 200px;
    height: 62px;
    text-align: center;
    cursor: pointer;
    &.active {
      border-bottom: 3px solid #3577f6;
      color: #3577f6;
    }
  }
}
</style>
