
<template>
  <div class="clubCardSet1">
    <span class="page_head_title">会员卡管理</span>
    <!-- <div class="menu">
      <span @click="switchover('clubCardSet')"
            class="active">会员卡设置</span>
      <span @click="switchover('upDownSet')">会员卡升降级设置</span>
    </div> -->
    <div class="pl-content"
         style="margin-top: 10px;">
      <div class="plc-search"
           v-if="tableData.length === 0 && hasAuthority('05010101')">
        <!-- <div> -->
        <div>
          <!-- <el-input placeholder="会员卡名称"
                    style="width:200px"></el-input>
          <el-select>
            <el-option value="1">使用中</el-option>
            <el-option value="2">已停用</el-option>
          </el-select>
          <el-button class="bzan bzan2">查询</el-button> -->
        </div>
        <div>
          <el-button class="tban tban1"
                     @click="showAddDialog = true"><i class="iconfont icon-cms_xinzeng-"></i> 新增会员卡</el-button>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%"
                  ref="multipleTable">
          <el-table-column prop="name"
                           label="会员卡名称/会员卡等级"
                           align="center"></el-table-column>
          <el-table-column prop="useStatusName"
                           label="状态"
                           align="center"></el-table-column>
          <el-table-column label="操作"
                           align="center">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)"
                         v-if="hasAuthority('05010102')"
                         class="el-button--primary operation-btn"
                         size="mini">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="ctc-foot">
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
      </div> -->
    </div>

    <el-dialog title="新增会员卡"
               :close-on-click-modal="false"
               :visible.sync="showAddDialog"
               class="addProjectdialog">
      <addCard @dialogHide="dialogHide"
               @query='query' />
      <!-- <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="adddialogVisible = false"
                   class="close-button"
                   >关闭</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   @click="confirm('addData2')">确 定</el-button>
      </div> -->
    </el-dialog>

    <el-drawer :visible.sync="detailsdrawershow"
               :append-to-body="true"
               size="700px"
               @close="onHide"
               class="jobOrerDetails">
      <div slot="title"
           class="drawerTitle">
        <p style="font-size: 16px">{{title}}会员卡信息</p>
        <span class="editBtn"
              @click="onEdit"
              v-if="hasAuthority('05010103') && readOnly">
          <i data-v-9c1f67fc=""
             aria-hidden="true"
             class="icon icon-edit2"></i>
          编辑
        </span>
      </div>
      <div class="drawBody content">
        <cardDetail v-if="detailsdrawershow"
                    :cardsData='cardsData'
                    @onHide='onHide'
                    @query='query'
                    @changeStep='changeStep'
                    ref="cardDetail" />
        <div class="btndiv"
             style="margin-top: 50px; display: flex; flex-direction: row-reverse">
          <el-button type="primary"
                     @click="nextStep"
                     style="width:100px;margin-left: 10px;background-color: #3575f6;"
                     v-if="!readOnly && !step2">下一步</el-button>
          <el-button type="primary"
                     @click="saveEdit"
                     style="width:100px;margin-left: 10px;background-color: #3575f6"
                     v-if="!readOnly && step2">保 存</el-button>
          <el-button type="primary"
                     @click="previousStep"
                     style="width:100px;margin-left: 10px;background-color: #3575f6"
                     v-if="!readOnly && step2">上一步</el-button>
          <el-button style="width:100px"
                     @click="onHide"
                     v-if="readOnly">关闭</el-button>
          <el-button style="width:100px"
                     @click="onHide"
                     v-else>取消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import context from '@/service'
import addCard from './components/addCard'
import cardDetail from './components/cardDetail'
export default {
  name: 'clubCard',
  components: {
    addCard,
    cardDetail
  },
  data () {
    return {
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
      showAddDialog: false,
      detailsdrawershow: false,
      readOnly: true,
      cardsData: {},
      step2: false,
      title: '查看'
    }
  },
  mounted () {
    this.query()
  },
  methods: {
    async query (type, index) {
      if (index) this.currentPage = index
      let result = await context.http.get('crm/api/memberCards?sort=createDate,asc&sort=id,desc', {
        page: (this.currentPage - 1),
        size: this.pgSize
      })
      if (result.status !== 200) return
      let nameArr = []
      result.data.forEach(ele => {
        nameArr.push(ele.name + '/' + ele.memberCardLevelName + '级')
      })
      nameArr = nameArr.join('、')
      this.tableData = [{ 'name': nameArr, 'useStatusName': result.data[0].useStatusName }]
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
    changeStep (index) {
      if (index === 0) {
        this.step2 = false
      } else {
        this.step2 = true
      }
    },
    switchover (state) {
      if (state === 'clubCardSet') {
        this.$router.push({ name: 'clubCardSet' })
      } else if (state === 'upDownSet') {
        this.$router.push({ name: 'upDownSet' })
      }
    },
    dialogHide () {
      this.showAddDialog = false
      this.detailsdrawershow = false
    },
    handleEdit (i, row) {
      context.http.get(`crm/api/memberCards/detail`).then(res => {
        if (res.status === 200) {
          this.title = '查看'
          this.cardsData = res.data
          this.detailsdrawershow = true
        }
      })
    },
    onEdit () {
      this.$refs.cardDetail.onEdit()
      this.readOnly = false
      this.title = '编辑'
    },
    onHide () {
      this.$refs.cardDetail.onClose()
      this.detailsdrawershow = false
      this.readOnly = true
      this.step2 = false
    },
    nextStep () {
      this.$refs.cardDetail.nextStep()
    },
    previousStep () {
      this.step2 = false
      this.$refs.cardDetail.previousStep()
    },
    saveEdit () {
      this.$refs.cardDetail.saveEdit()
    }
  }
}
</script>
<style lang="scss">
.clubCardSet1 {
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
  .addProjectdialog .el-dialog {
    width: 900px;
    margin-top: 5vh !important;
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
.btndiv {
  border-top: 1px solid #e5e5e5;
  button {
    margin-top: 10px;
  }
}
</style>
