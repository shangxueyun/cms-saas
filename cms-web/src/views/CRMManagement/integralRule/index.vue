
<template>
  <div class="clubCardSetr">
    <span class="page_head_title">积分规则管理</span>
    <div class="pl-content">
      <div class="search-bar">
        <div>
          <el-select v-model="projectManagementId"
                     clearable
                     placeholder="项目">
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="useStatus">
            <el-option v-for="item in statusOptions"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
          <span class="query-btn"
                @click="queryRules">查询</span>
        </div>
        <div v-if="hasAuthority('05020101')">
          <el-button class="tban tban1"
                     @click="addRule"><i class="iconfont icon-crm_xinzeng-"></i> 新增积分规则</el-button>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%"
                  ref="multipleTable">
          <el-table-column prop="referred"
                           label="项目简称"
                           align="center"></el-table-column>
          <el-table-column prop="name"
                           label="积分规则名称"
                           align="center"></el-table-column>
          <el-table-column label="适用于会员卡"
                           align="center">
            <template slot-scope="scope">
              <span v-for="(item, i) in scope.row.integralRuleMemberCards"
                    :key="i">
                {{item.memberCardName}}<span v-if="i !== scope.row.integralRuleMemberCards.length - 1">、</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="ruleTypeName"
                           label="积分规则适用范围"
                           align="center"></el-table-column>
          <el-table-column prop="useStatusName"
                           label="状态"
                           align="center"></el-table-column>
          <el-table-column width="120"
                           label="操作"
                           align="center">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)"
                         class="el-button--primary operation-btn"
                         v-if="hasAuthority('05020102')"
                         size="mini">查看</el-button>
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
          <!-- <span style="padding-left: 30px">显示从{{pgSize*(currentPage - 1) + 1}}到{{pgSize*currentPage}}项结果，</span> -->
        </div>
      </div>
    </div>

    <el-dialog title="新增积分规则"
               :visible.sync="dialogVisible"
               width="1000px"
               class="createaccount">
      <addRule ref="addRule"
               @close='close' />
      <div slot="footer"
           class="dialog-footers">
        <el-button @click="dialogVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   :disabled="disabledPost"
                   @click="confirm('createaccount')"
                   class="defaultbtn dialog-confirmBtn">确 认</el-button>
      </div>
    </el-dialog>

    <el-drawer :visible.sync="detailsdrawershow"
               :append-to-body="true"
               size="1000px"
               @close="onHide"
               class="jobOrerDetails">
      <div slot="title"
           class="drawerTitle">
        <p style="font-size: 16px">{{title}}积分规则</p>
        <span class="editBtn"
              @click="onEdit"
              v-if="hasAuthority('05020103') && readOnly">
          <i data-v-9c1f67fc=""
             aria-hidden="true"
             class="icon icon-edit2"></i>
          编辑
        </span>
      </div>
      <div class="drawBody content">
        <ruleDetail v-if="detailsdrawershow"
                    :cardsData='cardsData'
                    @onHide='onHide'
                    @query='query'
                    style="flex: 1;height: 100%;"
                    ref="ruleDetail" />
        <div class="btndiv"
             style="margin-top: 50px; display: flex; flex-direction: row-reverse;padding-right: 30px;">
          <el-button type="primary"
                     @click="saveEdit"
                     style="width:100px;margin-left: 25px;"
                     v-if="!readOnly">保 存</el-button>
          <el-button style="width:100px"
                     v-if="!readOnly"
                     @click="onHide">取 消</el-button>
          <el-button style="width:100px"
                     v-else
                     @click="onHide">关 闭</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import context from '@/service'
import Pagination from '@/components/pagination'
import addRule from './components/addRule'
import ruleDetail from './components/ruleDetail'
export default {
  name: 'clubCard',
  components: {
    Pagination,
    addRule,
    ruleDetail
  },
  data () {
    return {
      statusOptions: [
        { name: '使用中', value: 'USING' },
        { name: '已停用', value: 'DISABLE' },
        { name: '全部', value: '' }
      ],
      useStatus: 'USING',
      projectManagementId: '',
      options1: [],
      tableData: [],
      currentPage: 1,
      totalPages: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      pager: {
        page: 1,
        currentPage: 1,
        total: 0,
        pgSize: 15
      },
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
      dialogVisible: false,
      disabledPost: false,
      detailsdrawershow: false,
      readOnly: true,
      title: '查看'
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
  },
  mounted () {
    this.query()
  },
  methods: {
    queryRules () {
      this.pager.page = 1
      this.pager.pgSize = 15
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    handleEdit (i, row) {
      context.http.get(`crm/api/integralRules/${row.id}`).then(res => {
        if (res.status === 200) {
          this.title = '查看'
          this.cardsData = res.data
          this.detailsdrawershow = true
        }
      })
    },
    onEdit () {
      this.$refs.ruleDetail.onEdit()
      this.readOnly = false
      this.title = '编辑'
    },
    onHide () {
      // this.$refs.ruleDetail.onClose()
      this.detailsdrawershow = false
      this.readOnly = true
    },
    close () {
      this.query()
      this.dialogVisible = false
    },
    addRule () {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.addRule.restform()
      })
    },
    confirm () {
      this.$refs.addRule.confirm()
    },
    saveEdit () {
      this.$refs.ruleDetail.saveEdit()
    },
    async query () {
      let result = await context.http.get('crm/api/integralRules', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        projectId: this.projectManagementId,
        useStatus: this.useStatus
      })
      this.tableData = result.data
      this.pager.total = Number(result.headers['x-total-count'])
      this.total = Number(result.headers['x-total-count'])
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    // current_change (Page) {
    //   this.pager.pgSize = Page.pgSize
    //   this.pager.currentPage = Page.page
    //   this.query()
    // },
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
.clubCardSetr {
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
.createaccount {
  .el-dialog {
    width: 80%;
    .el-form-item {
      width: 22%;
      display: inline-block;
      margin-right: 33px;
      &:nth-of-type(4n) {
        margin-right: 0;
      }
    }
  }
}
.jobOrerDetails {
  .aliDownLoad2 {
    width: auto !important;
    height: auto !important;
    color: #999;
    .icon-xiazaidaoru {
      display: block;
      width: 100%;
      height: 100%;
      color: #3a8ee6;
    }
    .icon-xiazaidaoru::before {
      content: "\e8c6";
    }
  }
}
.editBtn {
  font-size: 12px;
}
.drawBody {
  display: flex;
  height: 100%;
  flex-direction: column;
}
</style>
<style lang="scss">
.clubCardSetr {
  .el-dialog__header {
    padding: 20px 20px 10px 0;
  }
  .el-dialog__footer {
    padding-top: 20px;
  }
}
</style>
