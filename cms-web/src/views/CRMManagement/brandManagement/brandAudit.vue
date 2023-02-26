
<template>
  <div class="brandAudit">
    <span class="page_head_title">品牌管理</span>
    <div class="pl-content">
      <ul class="default_tab_block">
        <li v-if="hasAuthority('050601')"
            @click="changeTab">
          <span>品牌信息</span>
        </li>
        <li class="active"
            v-if="hasAuthority('050602')">
          <span>品牌信息审核</span>
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
          <el-input placeholder="品牌名称"
                    v-model="seachParam.brandName"
                    style="width:200px"></el-input>
          <el-select v-model="seachParam.industry"
                     clearable
                     placeholder="选择行业">
            <el-option v-for="item in industryList"
                       :key="item"
                       :label="item"
                       :value="item">
            </el-option>
          </el-select>
          <!-- <el-select v-model="seachParam.statusId"
                     clearable
                     placeholder="状态">
            <el-option v-for="item in statusList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select> -->
          <span class="query-btn"
                @click="queryRules">查询</span>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%"
                  ref="multipleTable">
          <el-table-column prop="code"
                           label="品牌编号"
                           align="center"></el-table-column>
          <el-table-column prop="projectManagementReferred"
                           label="项目简称"
                           align="center"></el-table-column>
          <el-table-column prop="floor"
                           label="楼层"
                           align="center"></el-table-column>
          <el-table-column prop="brandName"
                           label="品牌名称"
                           align="center"></el-table-column>
          <el-table-column prop="industry"
                           label="行业"
                           align="center"></el-table-column>
          <el-table-column :formatter="formatTime"
                           label="更新时间"
                           align="center"></el-table-column>
          <el-table-column :formatter="formatstatus"
                           label="状态"
                           align="center"></el-table-column>
          <el-table-column width="200px"
                           v-if="hasAuthority('05060201')"
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
      <div class="ctc-foot1"
           v-if="total > 0">
        <span><span style="margin-right:10px">{{currentPage}}/{{totalPages}}页</span> 共{{total}}条记录</span>
        <el-pagination background
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
        </div>
      </div>
    </div>
    <!-- 品牌详情 -->
    <brandsDetails :detailsdrawershow="detailsShow"
                   ref="brandsDetails"
                   :isAudit="true"
                   :draweDetaileData="detaileData"
                   @auditSuccess='queryRules'
                   @drawerClose="drawerClose" />
  </div>
</template>
<script>
import context from '@/service'
import brandsDetails from './components/brandsDetails'
export default {
  name: 'brandAudit',
  components: {
    brandsDetails
  },
  data () {
    return {
      seachParam: {
        projectManagementId: '',
        brandName: '',
        industry: '',
        reviewStatus: ''
      },
      detailsShow: false,
      detaileData: {
        imgUrls: []
      },
      industryList: [],
      options1: [],
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
    this.query()
    this.getindustryList() // 请求行业
  },
  mounted () {

  },
  methods: {
    formatstatus (row, column) {
      switch (row.reviewStatus) {
        case 'PENDING':
          return '暂存'
        case 'REVIEWING':
          return '待审核'
        case 'REVIEWED':
          return '已审核'
        case 'ONLINE':
          return '上线'
        case 'OFFLINE':
          return '下线'
      }
    },
    formatTime (row, column) {
      if (row.updateTime) {
        return row.updateTime.replace('T', '  ')
      } else {
        return '-'
      }
    },
    getindustryList () {
      context.http.get(`crm/api/brand/industry`).then(res => {
        if (res) {
          this.industryList = []
          this.industryList = res.data
          // this.industryList.unshift('全部')
          // console.log(res)
        }
      })
    },
    drawerClose () {
      this.detailsShow = false
    },
    handleEdit (index, row) {
      context.http.get(`crm/api/brand/${row.id}`).then(res => {
        if (res) {
          this.detaileData = res.data
          this.detailsShow = true
        }
      })
    },
    changeTab () {
      this.$router.push({
        name: 'brandManagement',
        params: {}
      })
    },
    queryRules () {
      this.currentPage = 1
      this.pgSize = 15
      this.query()
    },
    async query () {
      let result = await context.http.get('crm/api/brand', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'lastModifiedDate,desc',
        projectManagementId: this.seachParam.projectManagementId,
        brandName: this.seachParam.brandName,
        industry: this.seachParam.industry,
        // reviewStatus: this.seachParam.reviewStatus
        reviewStatus: 'REVIEWING'
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
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
<style lang="scss" scoped>
.brandAudit {
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
      border: 1px solid #f3af2c;
      border-radius: 3px;
      color: #f3af2c;
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
