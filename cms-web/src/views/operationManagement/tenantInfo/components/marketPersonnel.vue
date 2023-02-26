<template>
  <div class="marketPersonnel">
    <div class="history">
      <div class="title">
        <span>
          <!-- <i></i>
          <span>入驻信息</span> -->
        </span>
        <div class="dweditbtn delAction"
             @click="showoDialog"><i class="iconfont icon-crm_xinzeng-"></i>
          <span>新增</span>
        </div>
      </div>
      <div>
        <div class="details_table">
          <el-table :data="tableData"
                    style="width: 100%">
            <el-table-column prop="name"
                             label="姓名"
                             align="center"></el-table-column>
            <el-table-column prop="sex"
                             label="性别"
                             align="center"></el-table-column>
            <el-table-column label="岗位 / 职务"
                             prop="post"
                             align="center"></el-table-column>
            <el-table-column prop="address"
                             label="居住地址"
                             align="center"></el-table-column>
            <el-table-column prop="telephone"
                             label="联系电话"
                             align="center"></el-table-column>
            <el-table-column width="60px"
                             label="操作"
                             align="center">
              <template slot-scope="scope">
                <span class="details_cheackBtn"
                      @click="view(scope.$index, scope.row)">查看</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div class="ctc-foot1">
        <el-pagination v-if="pager.total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size="pager.pgSize"
                       :total="pager.total"
                       :current-page.sync="pager.currentPage"
                       @current-change="current_change">
        </el-pagination>
      </div>
    </div>
    <!-- 菜场人员详情 -->
    <marketPersonnelDetails :detailsShow="detailsShow"
                            :detailData="detailData"
                            :tenantDetail="tenantDetail"
                            @editTenantPersonnel="editTenantPersonnel"
                            @drawerClose="drawerClose" />
    <!-- 新增菜场人员 -->
    <addMarketPersonnel :addMarketPersonnelShow="addMarketPersonnelShow"
                        :detailData="detailData"
                        :tenantDetail="tenantDetail"
                        :addType="addType"
                        :checkData="checkData"
                        @query="query"
                        @updateDetailsData="updateDetailsData"
                        @addDialogClose="addDialogClose" />
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import addMarketPersonnel from './addMarketPersonnel.vue'
import marketPersonnelDetails from './marketPersonnelDetails.vue'
export default {
  name: 'marketPersonnel',
  components: {
    marketPersonnelDetails,
    addMarketPersonnel
  },
  props: {
    tenantDetail: {
      type: Object,
      default: {}
    },
    checkData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  watch: {

  },
  data () {
    return {
      addType: 'add',
      detailData: {}, // 人员详情
      detailsShow: false,
      addMarketPersonnelShow: false,
      tableData: [],
      pager: {
        currentPage: 1,
        pgNum: 1,
        total: 0,
        pgSize: 15
      }
    }
  },
  created () {
    this.query()
  },
  methods: {
    async query () {
      let result = await context.http.get('/gos/api/tenantPersonnel', {
        page: (this.pager.currentPage - 1),
        size: this.pager.pgSize,
        tenantId: this.tenantDetail.id
      })
      this.tableData = result.data
      this.pager.total = Number(result.headers['x-total-count'])
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.query()
    },
    view (index, row) {
      this.detailData = row
      this.detailsShow = true
      // context.http.get('/gos/api/tenantPersonnel/' + row.id).then(res => {
      //   this.detailData = res.data
      //   this.detailsShow = true
      // })
    },
    updateDetailsData (data) {
      this.detailData = data
      console.log(this.detailData)
    },
    editTenantPersonnel () {
      this.addType = 'edit'
      this.addMarketPersonnelShow = true
    },
    drawerClose () {
      this.detailsShow = false
    },
    addDialogClose () {
      this.addMarketPersonnelShow = false
    },
    showoDialog () {
      this.addType = 'add'
      this.addMarketPersonnelShow = true
    }
  }
}
</script>
<style lang="scss">
.marketPersonnel {
  .cell {
    color: #262626;
  }
}
</style>
<style lang="scss" scoped>
.marketPersonnel {
  .history {
    min-height: 500px;
    overflow: auto;
    padding-bottom: 50px;
    width: 100%;
    background-color: #ffffff;
    border-radius: 4px;
    > .title {
      height: 45px;
      font-size: 16px;
      font-weight: bold;
      color: #262626;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f6f6f6;
      background-color: #ffffff;
      justify-content: space-between;
      padding: 0 10px;
      span {
        > i {
          display: inline-block;
          width: 4px;
          height: 16px;
          background: #3575f6;
          border-radius: 2px;
          margin-right: 5px;
        }
      }
      .dweditbtn {
        font-weight: normal;
        cursor: pointer;
        color: #44af69 !important;
        font-size: 14px !important;
      }
    }
    .details_table {
      padding: 0 10px;
      margin-top: 10px;
    }
  }
}
</style>
