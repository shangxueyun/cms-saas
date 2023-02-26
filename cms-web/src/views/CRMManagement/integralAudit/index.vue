
<template>
  <div class="clubCardSet">
    <span class="page_head_title">积分审核</span>
    <div class="pl-content">
      <div class="search-bar">
        <div>
          <el-select v-model="projectManagementId"
                     placeholder="项目">
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-input placeholder="品牌"
                    v-model="tenantName"
                    style="width:200px"></el-input>
          <el-select v-model="approvalStatus">
            <el-option value="APPROVAL"
                       label="审核中"></el-option>
            <el-option value="OK"
                       label="审核通过"></el-option>
            <el-option value="NO"
                       label="审核失败"></el-option>
          </el-select>
          <span class="query-btn"
                @click="currentSel">查询</span>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%"
                  ref="multipleTable">
          <el-table-column prop="projectName"
                           label="项目简称"
                           align="center"></el-table-column>
          <el-table-column prop="tenantName"
                           label="品牌"
                           align="center"></el-table-column>
          <el-table-column prop="memberName"
                           label="会员名称"
                           align="center"></el-table-column>
          <el-table-column prop="telephone"
                           label="手机号"
                           align="center"></el-table-column>
          <el-table-column prop="memberCardNo"
                           label="会员卡号"
                           align="center"></el-table-column>
          <el-table-column prop="memberCardName"
                           label="会员等级"
                           align="center"></el-table-column>
          <el-table-column :formatter="uploadTimeFormat"
                           label="小票上传时间"
                           align="center"></el-table-column>
          <el-table-column prop="approvalUserName"
                           label="审核人"
                           align="center"></el-table-column>
          <el-table-column :formatter="approvalStatusFormat"
                           label="状态"
                           align="center"></el-table-column>
          <el-table-column width="120"
                           v-if="hasAuthority('05040101')"
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
        </div>
      </div>
    </div>
    <!-- 积分审核详情 -->
    <intAudit ref="intAudit"
              :detailData="detailData"
              :intAuditShow="intAuditShow"
              :options1="options1"
              @auditSuccess="auditSuccess"
              @drawerClose="drawerClose" />
  </div>
</template>
<script>
import context from '@/service'
import intAudit from './components/intAudit'
export default {
  name: 'clubCard',
  components: {
    intAudit
  },
  data () {
    return {
      detailData: {

      },
      approvalStatus: 'APPROVAL',
      tenantName: '',
      intAuditShow: false,
      projectManagementId: '',
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
    this.projectManagementId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.$store.state.projectManagementsList[0].id
    this.query()
  },
  mounted () {

  },
  methods: {
    auditSuccess (data) { // 审核成功emit数据
      this.currentPage = 1
      this.query()
      this.detailData = data
    },
    approvalStatusFormat (row, column) {
      if (row.approvalStatus === 'APPROVAL') {
        return '审核中'
      } else if (row.approvalStatus === 'OK') {
        return '审核通过'
      } else if (row.approvalStatus === 'NO') {
        return '审核失败'
      }
    },
    async query () {
      let result = await context.http.get('crm/api/integralApproval/page', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        projectId: this.projectManagementId,
        tenantName: this.tenantName,
        approvalStatus: this.approvalStatus
      })
      this.tableData = result.data.content
      this.total = Number(result.data.totalElements)
      this.totalPages = Number(result.data.totalPages)
    },
    uploadTimeFormat (row, column) {
      if (row.uploadTime) {
        return row.uploadTime.substring(0, 10)
      }
    },
    handleEdit (index, row) {
      context.http.get(`crm/api/integralApproval/${row.id}`).then(res => {
        if (res) {
          this.detailData = res.data
          this.intAuditShow = true
        }
      })
    },
    drawerClose () {
      this.intAuditShow = false
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
