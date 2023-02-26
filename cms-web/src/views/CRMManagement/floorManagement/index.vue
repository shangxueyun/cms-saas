
<template>
  <div class="floorManagement">
    <span class="page_head_title">楼层管理</span>
    <ul class="default_tab_block">
      <li :class="item.value ? 'active' : ''"
          @click="changeNav(index)"
          v-for="(item, index) in navList"
          :key="index"
          v-if="hasAuthority(item.hasAuthority)"><span>{{item.label}}</span></li>
    </ul>
    <div class="search-bar">
      <div>
        <el-select v-model="projectManagementId"
                   @change="getfloor"
                   clearable
                   placeholder="选择项目">
          <el-option v-for="item in options1"
                     :key="item.id"
                     :label="item.referred"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="floorName"
                   clearable
                   placeholder="选择楼层">
          <el-option v-for="item in floorOptions"
                     :key="item.name"
                     :label="item.name"
                     :value="item.name">
          </el-option>
        </el-select>
        <el-select v-model="useStatus"
                   clearable
                   placeholder="状态"
                   v-if="step1">
          <el-option v-for="item in statusOptions"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value">
          </el-option>
        </el-select>
        <span class="query-btn"
              @click="queryList2()">查询</span>
      </div>
      <div v-if="hasAuthority('05050101') && step1">
        <el-button class="tban tban1"
                   @click="addFloor"><i class="iconfont icon-crm_xinzeng-"></i> 新增楼层信息</el-button>
      </div>
    </div>
    <div class="plc-table">
      <el-table :data="tableData"
                style="width: 100%"
                ref="multipleTable">
        <el-table-column prop="projectManagementReferred"
                         label="项目简称"
                         align="center"></el-table-column>
        <el-table-column prop="floorName"
                         label="楼层"
                         align="center"></el-table-column>
        <el-table-column label="楼层主题"
                         align="center">
          <template slot-scope="scope">
            <span>{{scope.row.theme}}</span>
          </template>
        </el-table-column>
        <el-table-column :formatter="formatTime"
                         label="更新时间"
                         align="center">
        </el-table-column>
        <el-table-column label="状态"
                         align="center">
          <template slot-scope="scope">
            <span>{{reviewStatus(scope.row.reviewStatus)}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="useStatusName"
                           label="在线状态"
                           align="center"></el-table-column> -->
        <el-table-column width="200"
                         label="操作"
                         style="padding-left: 50px;"
                         align="left">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)"
                       class="el-button--primary operation-btn"
                       v-if="hasAuthority('05050102') || hasAuthority('05050201')"
                       size="mini">查看</el-button>
            <el-button @click="goOnline(scope.$index, scope.row)"
                        style="margin-left:0px;"
                       type="success"
                       plain
                       v-if="(scope.row.reviewStatus === 'REVIEWED' || scope.row.reviewStatus === 'OFFLINE') && step1"
                       size="mini">上线</el-button>
            <span class="offlineBtn"
                  @click="offline(scope.$index, scope.row)"
                  v-if="scope.row.reviewStatus === 'ONLINE' && step1">下线</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="ctc-foot1">
      <span><span style="margin-right:10px">{{currentPage}}/{{Math.ceil(total/pgSize)}}页</span> 共{{total}}条记录</span>
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

    <el-dialog title="新增楼层信息"
               :visible.sync="dialogVisible"
               width="730px"
               class="createaccount">
      <addFloor ref="addRule"
                @close='close' />
      <div slot="footer"
           class="dialog-footers">
        <el-button @click="dialogVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button @click="confirm('storage')"
                   class="close-button storage-button">暂 存</el-button>
        <el-button type="primary"
                   @click="confirm('createaccount')"
                   class="defaultbtn dialog-confirmBtn">保存并提交</el-button>
      </div>
    </el-dialog>

    <el-drawer :visible.sync="detailsdrawershow"
               :append-to-body="true"
               size="700px"
               @close="onHide"
               class="jobOrerDetails">
      <div slot="title"
           class="drawerTitle">
        <p style="font-size: 16px">{{title}}楼层信息</p>
        <span class="editBtn"
              @click="onEdit"
              v-if="hasAuthority('05050103') && readOnly && floorData.reviewStatus === 'PENDING'">
          <i data-v-9c1f67fc=""
             aria-hidden="true"
             class="icon icon-edit2"></i>
          编辑
        </span>
      </div>
      <div class="drawBody content">
        <floorDetail v-if="detailsdrawershow"
                     :floorData='floorData'
                     @onHide='onHide'
                     @queryList='queryList'
                     @changeStep='changeStep'
                     :isToExamine='isToExamine'
                     style="flex: 1;height: 100%"
                     ref="floorDetail" />
        <div class="btndiv"
             v-if="step1"
             style="margin-top: 50px; display: flex; flex-direction: row-reverse">
          <el-button v-if="readOnly && floorData.reviewStatus === 'PENDING'"
                     type="primary"
                     @click="saveEdit('submit')"
                     style="width:100px;margin-left: 10px;background-color: #3575f6">
            提交审核
          </el-button>
          <el-button v-if="!readOnly && floorData.reviewStatus === 'PENDING'"
                     type="primary"
                     @click="saveEdit('submit')"
                     style="width:100px;margin-left: 10px;background-color: #3575f6">
            保存并提交
          </el-button>
          <el-button v-if="!readOnly && floorData.reviewStatus === 'PENDING'"
                     @click="saveEdit('storage')"
                     style="width:70px;margin-left: 10px;border: 1px solid #3575F6;color: #3575F6">
            暂 存
          </el-button>
          <el-button v-if="!readOnly && !dialogStep1"
                     @click="previousStep"
                     style="margin-left: 10px;width:74px;background-color: #fff">上一步</el-button>
          <el-button v-if="!readOnly && dialogStep1"
                     @click="nextStep"
                     style="margin-left: 10px;width:74px;background-color: #fff">下一步</el-button>
          <el-button style="width:70px;"
                     @click="onHide">关 闭</el-button>
        </div>
        <div v-else
             class="btndiv"
             style="margin-top: 50px; display: flex; flex-direction: row-reverse">
          <el-button v-if="dialogStep1"
                     @click="nextStep"
                     style="width:100px;margin-left: 10px;background-color: #3575f6;color: #fff">下一步</el-button>
          <el-button v-if="dialogStep1"
                     @click="onHide"
                     style="width:70px;">关 闭</el-button>
          <el-button v-if="!dialogStep1"
                     @click="adopt"
                     style="width:100px;margin-left: 10px;background-color: #3575f6;color: #fff">通 过</el-button>
          <el-button v-if="!dialogStep1"
                     @click="Reject"
                     style="width:70px;margin-left: 10px;background-color: #FDEBED;color: #E0434E">驳 回</el-button>
          <el-button v-if="!dialogStep1"
                     @click="previousStep"
                     style="width:70px;">上一步</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import context from '@/service'
import addFloor from './components/addFloor'
import floorDetail from './components/floorDetail'
export default {
  name: 'floorManagement',
  components: {
    addFloor,
    floorDetail
  },
  data () {
    return {
      title: '查看',
      detailsdrawershow: false,
      dialogVisible: false,
      useStatus: '',
      options1: [],
      projectManagementId: '',
      navList: [{
        label: '楼层信息',
        value: true,
        hasAuthority: '050501'
      }, {
        label: '楼层信息审核',
        value: false,
        hasAuthority: '050502'
      }],
      tableData: [],
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
      ],
      statusOptions: [
        { name: '全部', value: '' },
        { name: '暂存', value: 'PENDING' },
        { name: '待审核', value: 'REVIEWING' },
        { name: '已审核', value: 'REVIEWED' },
        { name: '上线', value: 'ONLINE' },
        { name: '下线', value: 'OFFLINE' }
      ],
      step1: true,
      step2: false,
      readOnly: true,
      floorData: {},
      floorOptions: [],
      floorName: '',
      dialogStep1: true,
      isToExamine: false
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
    if (this.hasAuthority('050501')) {
      this.navList[0].value = true
      this.navList[1].value = false
      this.step1 = true
      this.query()
    } else if (this.hasAuthority('050502')) {
      this.navList[0].value = false
      this.navList[1].value = true
      this.step1 = false
      this.query('toexamine')
    }
  },
  mounted () {

  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      if (this.step1) {
        this.query()
      } else {
        this.query('toexamine')
      }
    },
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[inx].value = true
      if (inx === 0) {
        this.step1 = true
        this.queryList()
      } else if (inx === 1) {
        this.step1 = false
        this.queryList('toexamine')
      }
    },
    changeStep (inx) {
      if (inx === 0) {
        this.dialogStep1 = true
      } else {
        this.dialogStep1 = false
      }
    },
    nextStep () {
      this.dialogStep1 = false
      this.$refs.floorDetail.nextStep()
    },
    previousStep () {
      this.dialogStep1 = true
      this.$refs.floorDetail.previousStep()
    },
    formatTime (row, column) {
      return row.updateTime.replace('T', ' ')
    },
    reviewStatus (val) {
      let res = ''
      if (val === 'PENDING') {
        res = '暂存'
      } else if (val === 'REVIEWING') {
        res = '待审核'
      } else if (val === 'REVIEWED') {
        res = '已审核'
      } else if (val === 'ONLINE') {
        res = '上线'
      } else if (val === 'OFFLINE') {
        res = '下线'
      }
      return res
    },
    async getfloor () {
      let result = await context.http.get('cms/api/floors/svg', { projectManagementId: this.projectManagementId })
      this.floorOptions = result.data
    },
    queryList2 () {
      if (this.step1) {
        this.queryList()
      } else {
        this.queryList('toexamine')
      }
    },
    queryList (type) {
      this.currentPage = 1
      this.query(type)
    },
    async query (type) {
      let reviewStatus = ''
      if (type === 'toexamine') {
        reviewStatus = 'REVIEWING'
      } else {
        reviewStatus = this.useStatus
      }
      let result = await context.http.get('crm/api/floor?sort=lastModifiedDate,desc', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        projectManagementId: this.projectManagementId,
        floorName: this.floorName,
        reviewStatus: reviewStatus
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
    },
    addFloor () {
      this.dialogVisible = true
    },
    currentSel () {
      this.currentPage = 1
      if (this.step1) {
        this.queryList()
      } else {
        this.queryList('toexamine')
      }
    },
    close () {
      this.query()
      this.dialogVisible = false
    },
    onHide () {
      this.$refs.floorDetail.onClose()
      this.detailsdrawershow = false
      this.readOnly = true
    },
    onEdit () {
      this.$refs.floorDetail.onEdit()
      this.readOnly = false
      this.title = '编辑'
    },
    adopt () {
      this.$refs.floorDetail.adopt()
    },
    Reject () {
      this.$refs.floorDetail.Reject()
    },
    saveEdit (type) {
      this.$refs.floorDetail.saveEdit(type)
    },
    confirm (type) {
      this.$refs.addRule.confirm(type)
    },
    handleEdit (i, row) {
      if (this.step1) {
        this.isToExamine = false
      } else {
        this.isToExamine = true
      }
      context.http.get(`crm/api/floor/${row.id}`).then(res => {
        if (res.status === 200) {
          this.title = '查看'
          this.floorData = res.data
          this.detailsdrawershow = true
          this.dialogStep1 = true
        }
      })
    },
    goOnline (i, row) {
      context.http.get(`crm/api/review/approval`, {
        businessId: row.id,
        businessType: 'FLOOR',
        reviewStatus: row.reviewStatus,
        reviewType: 'FLOOR'
      }).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.queryList()
        }
      })
    },
    offline (index, row) {
      context.http.get(`crm/api/review/cancel`, {
        businessId: row.id,
        businessType: 'FLOOR',
        reviewType: 'FLOOR',
        reviewStatus: row.reviewStatus
      }).then(res => {
        if (res.status === 200) {
          this.$message.success('下线成功')
          this.queryList()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.floorManagement {
  .dl-head {
    margin-bottom: 20px !important;
  }
  .info_tab {
    height: 48px;
    display: -ms-flexbox;
    display: flex;
    background-color: #fff;
    box-shadow: 1px 2px 5px #eee;
    border-radius: 3px;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -ms-flex-align: center;
    align-items: center;
    padding-right: 44px;
    border-bottom: 1px solid #ecedef;
    margin-top: 15px;
    .nav {
      display: -ms-flexbox;
      display: flex;

      li.select_active {
        border-bottom: 2px solid #3175d2;
        color: #3175d2;
        font-weight: bolder;
      }

      li {
        width: 140px;
        text-align: center;
        font-size: 14px;
        color: #666;
        height: 46px;
        line-height: 46px;
        border-bottom: 2px solid #fff;
        cursor: pointer;
      }
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
  .storage-button {
    background: rgba(242, 245, 250, 1) !important;
    border: 1px solid #3575f6 !important;
    color: #3575f6 !important;
  }
  .btndiv {
    .storage-button {
      background: rgba(242, 245, 250, 1) !important;
      border: 1px solid #3575f6 !important;
      color: #3575f6 !important;
      margin: 0 10px;
    }
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
    // margin-top: 3px;
    // margin-left: 10px;
  }
}
.drawBody {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
<style lang="scss">
.floorManagement {
  .el-dialog__footer {
    padding-top: 20px;
  }
  .el-dialog__header {
    padding-left: 0;
  }
  .butwarp {
    .cell {
      text-align: left;
    }
  }
}
</style>
