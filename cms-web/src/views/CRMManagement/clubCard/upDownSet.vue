
<template>
  <div class="clubCardSet">
    <span style="font-size: 16px;color:#333">会员卡管理</span>
    <div class="menu">
      <span @click="switchover('clubCardSet')">会员卡设置</span>
      <span @click="switchover('upDownSet')"
            class="active">会员卡升降级设置</span>
    </div>
    <div class="pl-content">
      <div class="plc-search">
        <div>
          <el-input placeholder="会员卡名称"
                    style="width:200px"></el-input>
          <el-select>
            <el-option value="1">使用中</el-option>
            <el-option value="2">已停用</el-option>
          </el-select>
          <el-button class="bzan bzan2">查询</el-button>
        </div>
        <div>
          <el-button class="tban tban1"><i class="iconfont icon-cms_xinzeng-"></i> 新增会员卡</el-button>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%"
                  ref="multipleTable">
          <el-table-column prop="name"
                           label="会员卡名称"
                           align="center"></el-table-column>
          <el-table-column prop="levl"
                           label="会员卡等级"
                           align="center"></el-table-column>
          <el-table-column prop="status"
                           label="状态"
                           align="center"></el-table-column>
          <el-table-column width="120"
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
      <div class="ctc-foot">
        <div class="pagingnum">
          显示 <select v-model="pgSize"
                  @change="currentSel">
            <option v-for="item in pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </option>
          </select>
          条目 <span style="padding-left: 30px">显示从{{pgSize*(currentPage - 1) + 1}}到{{pgSize*currentPage}}项结果，共<span class="style: red">{{total}}</span>条</span>
        </div>
        <el-pagination v-if="total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size=pgSize
                       :total="total"
                       :current-page="currentPage"
                       @current-change="current_change">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
export default {
  name: 'clubCard',
  components: {

  },
  data () {
    return {
      tableData: [
        { name: '预享卡', levl: '1', status: '使用中' }
      ],
      currentPage: 1,
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
  mounted () {

  },
  methods: {
    async query (type, index) {
      if (index) this.currentPage = index
      let result = await context.http.get('cms/api/bills/v1?sort=finalPaymentDate,asc&sort=id,desc', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        referred: this.referred,
        projectManagementId: this.projectManagementId,
        startDate: this.startDate,
        endDate: this.endDate,
        feeType: this.feeType,
        billStatus: this.billStatus
      })
      this.tableData = result.data

      this.total = Number(result.headers['x-total-count'])
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
<style lang="scss">
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
