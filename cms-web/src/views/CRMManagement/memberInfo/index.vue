
<template>
  <div class="clubCardSet">
    <span class="page_head_title">会员信息</span>
    <div class="pl-content">
      <div class="search-bar">
        <div>
          <el-input placeholder="会员名称"
                    v-model="seachParam.memberName"
                    style="width:200px"></el-input>
          <el-select v-model="seachParam.memberCardLevel"
                     clearable>
            <el-option v-for="(item,index) in memberList"
                       :key="index"
                       :label="item.name"
                       :value="item.memberCardLevel">
            </el-option>
          </el-select>
          <el-input placeholder="手机号"
                    v-model="seachParam.telephone"
                    style="width:200px"></el-input>
          <el-select v-model="seachParam.useStatus"
                     clearable>
            <el-option value="USING"
                       label="使用中"></el-option>
            <el-option value="DISABLE"
                       label="已冻结"></el-option>
          </el-select>
          <span class="query-btn"
                @click="currentSel">查询</span>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%"
                  ref="multipleTable">
          <el-table-column prop="memberName"
                           label="会员名称"
                           align="center"></el-table-column>
          <el-table-column prop="memberCard.name"
                           label="会员等级"
                           align="center"></el-table-column>
          <el-table-column prop="score"
                           label="当前积分"
                           align="center"></el-table-column>
          <el-table-column prop="telephone"
                           label="手机号"
                           align="center"></el-table-column>
          <el-table-column prop="cradNumber"
                           label="会员卡号"
                           align="center"></el-table-column>
          <el-table-column :formatter="memberRegisterTimeFormat"
                           label="注册会员时间"
                           align="center"></el-table-column>
          <el-table-column :formatter="useStatusFormat"
                           label="状态"
                           align="center"></el-table-column>
          <el-table-column width="120"
                           v-if="hasAuthority('05030101')"
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
      <!-- 查看会员资料 -->
      <memberDetailis :memberDetailisShow="memberDetailisShow"
                      :detailData="detailData"
                      @lockUnLockSuccess="lockUnLockSuccess"
                      @drawerClose="drawerClose"
                      ref="memberDetailis" />
    </div>
  </div>
</template>
<script>
import context from '@/service'
import memberDetailis from './components/memberDetailis'
export default {
  name: 'clubCard',
  components: {
    memberDetailis
  },
  data () {
    return {
      seachParam: {
        memberName: '',
        memberCardLevel: '',
        telephone: '',
        useStatus: 'USING'
      },
      memberDetailisShow: false,
      detailData: {
        memberCard: {
          imageUrl: '',
          memberCardLevel: '',
          name: '',
          useStatus: ''
        }
      },
      memberList: [],
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
    this.getMemberList()
    this.query()
  },
  mounted () {

  },
  methods: {
    lockUnLockSuccess (res) {
      this.currentPage = 1
      this.query()
      this.detailData = res
    },
    useStatusFormat (row, column) {
      if (row.useStatus === 'USING') {
        return '使用中'
      } else {
        return '已冻结'
      }
    },
    memberRegisterTimeFormat (row, column) {
      if (row.memberRegisterTime) {
        return row.memberRegisterTime.substring(0, 10)
      }
    },
    async getMemberList () {
      let result = await context.http.get('crm/api/memberCards')
      this.memberList = result.data
      // console.log(this.memberList)
    },
    handleEdit (index, row) {
      context.http.get(`crm/api/members/${row.id}`).then(res => {
        if (res) {
          this.recordType = '1'
          this.detailData = res.data
          this.memberDetailisShow = true
        }
      })
    },
    drawerClose () {
      this.memberDetailisShow = false
    },
    async query () {
      let result = await context.http.get('crm/api/members/page', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'createdDate,desc',
        memberName: this.seachParam.memberName,
        memberCardLevel: this.seachParam.memberCardLevel,
        telephone: this.seachParam.telephone,
        useStatus: this.seachParam.useStatus
      })
      this.tableData = result.data.content
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
