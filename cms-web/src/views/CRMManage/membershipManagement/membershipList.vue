<template>
  <div class="membershipList">
    会员信息
    <div class="menuTab">
      <div>
        <span class="active">会员列表</span>
        <span @click="roterTo('membershipLevel')" v-if="hasAuthority('050102')">会员等级</span>
        <span @click="roterTo('membershipTag')" v-if="hasAuthority('050103')">会员标签</span>
      </div>
      <div></div>
    </div>
    <div class="ct-content">
      <div class="ctc-search">
        <el-select v-model="screenValue" placeholder="全部" class="screen" size="small">
          <el-option
            v-for="item in screenOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="queryValue" style="width: 140px;" size="small"
                  placeholder=""></el-input>
        性别：<el-select v-model="sexValue" placeholder="全部" class="screen" size="small">
                <el-option
                  v-for="item in sexOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
        等级：<el-select v-model="levelValue" placeholder="全部" class="screen" size="small">
                <el-option
                  v-for="item in levelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
        标签：<el-input v-model="labelName" style="width: 140px;" size="small"
                  placeholder="标签名称"></el-input>
        <div class="query-btn"
             @click="queryList">查询</div>
      </div>
      <div class="ms-operation">
        <div v-if="hasAuthority('05010104')">
          <span class="operation-btn" @click="batchLabeling"><i class="iconfont icon-biaoqian"></i>批量打标签</span>
        </div>
        <div>
          <span class="operation-btn" @click="manualEntryVisible = true" v-if="hasAuthority('05010101')">
            <i class="iconfont icon-shouzhi"></i>人工录入
          </span>
          <span class="operation-btn" @click="weChatImport" v-if="hasAuthority('05010102')">
            <i class="iconfont icon-weixin"></i> 微信录入
          </span>
        </div>
      </div>
      <div class="ctc-table">
        <el-table :data="tableData"
                  @selection-change="handleSelectionChange"
                  style="width: 100%">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column prop="nickName"
                           label="会员昵称"
                           align="center">
          </el-table-column>
          <el-table-column prop="level"
                           label="会员等级"
                           align="center">
          </el-table-column>
          <el-table-column prop="sex"
                           label="性别"
                           :formatter="sexFormat"
                           align="center">
          </el-table-column>
          <el-table-column prop="telephone"
                           label="手机号"
                           align="center">
          </el-table-column>
          <el-table-column prop="id"
                           label="微信ID"
                           align="center">
          </el-table-column>
          <el-table-column prop="score"
                           label="积分数"
                           align="center">
          </el-table-column>
          <el-table-column prop="followTime"
                           label="注册日期"
                           align="center">
          </el-table-column>
          <el-table-column label="操作"
                           width="200px"
                           align="center">
            <template slot-scope="scope" v-if="hasAuthority('05010105') || hasAuthority('05010103')">
              <el-button class="el-button--primary editbtn labelbtn"
                         size="mini"
                         @click="labeling(scope.$index, scope.row)" v-if="hasAuthority('05010105')">标签</el-button>
              <el-button class="el-button--primary editbtn"
                         size="mini"
                         @click="handleEdit(scope.$index, scope.row)" v-if="hasAuthority('05010103')">查看档案</el-button>
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

    <el-dialog class="manualEntry"
               title="人工录入"
               :visible.sync="manualEntryVisible"
               :close-on-click-modal="false">
      <manualEntry ref="addTenant" @query="query" @dialogClose="manualEntryVisible = false"/>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="manualEntryVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button @click="addTenant('addData')"
                   type="primary"
                   class="defaultbtn dialog-confirmBtn">确 认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="微信导入" :visible.sync="weChatImporVisible">
      <el-form v-if="setp1">
        <div style="padding: 15px 0 10px 0">选择公众号</div>
        <el-form-item style="padding-bottom: 20px;">
          <el-select v-model="wechatPublicId" placeholder="请选择活动区域" style="width: 100%">
            <el-option
              v-for="item in publicOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div v-if="setp2" style="padding: 20px 0 50px;">
        共搜索到{{publicTotal}}条数据
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="weChatImporVisible = false">取 消</el-button>
        <el-button type="primary" @click="weChatSure">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="dialogLabelName" :visible.sync="labelVisible" :show-close='false' :close-on-click-modal='false' :close-on-press-escape='false'>
      <div v-if="dialogLabelName === '批量打标签'" style="margin-top: 10px;">所有被选中的{{this.ids.length}}位会员将批量添加标签</div>
      <el-form>
        <div style="padding: 15px 0 10px 0">标签名称</div>
        <el-form-item style="padding-bottom: 20px;">
          <el-select v-model="labelValue" multiple placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in labelOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="labelVisible = false;memberId = []">取 消</el-button>
        <el-button @click="putLabel" type="primary">确 定</el-button>
      </div>
    </el-dialog>

    <membershipFiles :detailsdrawershow="detailsShow"
                  @drawerClose="detailsClose"
                  :detailsInfo="detailsInfo"
                  @handleEdit="handleEdit"
                  @query="query" />
  </div>
</template>
<script>
import context from '@/service'
import membershipFiles from './components/membershipFiles'
import manualEntry from './components/manualEntry'
export default {
  name: 'membershipList',
  components: {
    membershipFiles,
    manualEntry
  },
  data () {
    return {
      setp1: true,
      setp2: false,
      manualEntryVisible: false,
      weChatImporVisible: false,
      labelVisible: false,
      dialogLabelName: '打标签',
      detailsShow: false,
      publicTotal: 0,
      wechatPublicId: '',
      labelValue: [],
      labelOptions: [],
      checkList: [''],
      addData: {
        onOnly: 'false'
      },
      queryValue: '',
      sexValue: '',
      screenValue: 'queryString',
      publicOptions: [],
      screenOptions: [
        {
          label: '全部',
          value: 'queryString'
        },
        {
          label: '手机号',
          value: 'telephone'
        },
        {
          label: '会员昵称',
          value: 'nickName'
        }
      ],
      sexOptions: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 'MALE',
          label: '男'
        },
        {
          value: 'FEMALE',
          label: '女'
        }
      ],
      levelValue: '',
      levelOptions: [],
      labelName: '',
      pgNumoptions: [{
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
      }],
      tableData: [],
      addDataRules: {
        name: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入岗位代码', trigger: 'blur' }
        ],
        organizeId: [
          { required: true, message: '请选择所属组织', trigger: 'change' }
        ]
      },
      name: '',
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      formLabelWidth: '120px',
      detailsInfo: {
        facialPhoto: '',
        organizeDTO: {
          name: '',
          userPost: '',
          parent: { name: '' }
        },
        userPostManagements: [{
          organizeId: [],
          userPostId: '',
          onMaster: true
        }],
        userDynamics: [{
          user: { workPlace: { name: '' } }
        }]
      },
      ids: [],
      memberId: []
    }
  },
  created () {
    this.getLevels()
    this.query()
  },
  methods: {
    roterTo (name) {
      this.$router.push({name: name, params: {projectManagementId: this.projectManagementId}})
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    batchLabeling () {
      if (this.ids.length === 0) {
        this.$message.error('请选择会员')
        return
      }
      this.queryLabel()
      this.labelVisible = true
      this.dialogLabelName = '批量打标签'
    },
    labeling (index, row) {
      this.memberId = [row.id]
      this.labelVisible = true
      this.dialogLabelName = '打标签'
      this.queryLabel()
    },
    async queryLabel () {
      let result = await context.http.get('/crm/api/member-labels'
        , { page: 0, size: 100, sort: 'desc', eagerload: false })
      this.labelOptions = result.data
    },
    putLabel () {
      if (this.labelValue.length < 1) {
        return
      }
      let ids = []
      if (this.dialogLabelName === '打标签') {
        ids = this.memberId
      } else {
        ids = this.ids
      }
      let labels = this.labelValue
      context.http.put(`/crm/api/members/label?ids=${ids}&labels=${labels}`).then(res => {
        if (res.status === 200) {
          this.labelVisible = false
          this.ids = []
          this.labelValue = []
        }
      })
    },
    stateFormat (row, column) {
      return row.useStatus === 'USING' ? '使用中' : '停用'
    },
    sexFormat (row, column) {
      return row.sex === 'MALE' ? '男' : '女'
    },
    detailsClose () {
      this.detailsShow = false
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    queryList () {
      this.currentPage = 1
      this.query()
    },
    addTenant () {
      this.$refs.addTenant.manualInput()
    },
    getLevels () {
      context.http.get('crm/api/member-levels').then(res => {
        if (res.status === 200) {
          let levelOptions = [{label: '全部', value: ''}]
          res.data.forEach(ele => {
            levelOptions.push({label: ele.name, value: ele.name})
          })
          this.levelOptions = levelOptions
        }
      })
    },
    async handleEdit (index, row) {
      this.detailsShow = true
      let result = await context.http.get(`crm/api/members/${row.id}`)
      this.detailsInfo = result.data
      // this.$refs.postDetails.getLeaderName()
    },
    async query () {
      let queryName = this.screenValue
      let result = await context.http.get('/crm/api/members', { page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'desc',
        label: this.labelName,
        level: this.levelValue,
        sex: this.sexValue,
        [queryName]: this.queryValue
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
    },
    handleSelectionChange (val) {
      console.log('val', val)
      let ids = []
      val.forEach(ele => {
        ids.push(ele.id)
      })
      this.ids = ids
      console.log('ids', this.ids)
    },
    weChatImport () {
      this.setp1 = true
      this.setp2 = false
      this.weChatImporVisible = true
      context.http.get(`crm/api/wechat-publics`).then(res => {
        let publicOptions = []
        res.data.forEach(ele => {
          publicOptions.push({label: ele.name, value: ele.id})
        })
        this.publicOptions = publicOptions
      })
    },
    weChatSure () {
      if (!this.wechatPublicId) {
        return
      }
      if (this.setp1) {
        context.http.get(`crm/api/members/public-total`, {wechatPublicId: this.wechatPublicId}).then(res => {
          if (res.status === 200) {
            this.publicTotal = res.data
            this.setp1 = false
            this.setp2 = true
          }
        })
      } else {
        context.http.get(`crm/api/members/public-total/save`, {wechatPublicId: this.wechatPublicId}).then(res => {
          if (res.status === 200) {
            this.weChatImporVisible = false
            this.query()
          }
        })
      }
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/config";
.membershipList {
  font-size: 16px;
  background-color: #f9f9f9;
  .menuTab{
    height: 60px;
    margin-top: 15px;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 4px 4px 4px 1px #eee;
    justify-content: space-between;
    div{
      >span{
        position: relative;
        display: inline-block;
        width: 120px;
        text-align: center;
        height: 60px;
        line-height: 60px;
        cursor: pointer;
        font-size: 14px;
        &.active{
          color: #3577F6;
          border-bottom: 2px solid #3577F6;
        }
        >span{
          display: block;
          position: absolute;
          top: 20px;
          right: 6px;
          min-width: 16px;
          height: 16px;
          line-height: 16px;
          padding: 0 3px;
          font-weight: normal;
          color: white;
          text-align: center;
          text-shadow: 0 1px rgba(0, 0, 0, 0.2);
          border-radius: 16px;
          background: #cb444a;
          font-size: 12px;
        }
      }
    }
  }
  .ct-content {
    width: 100%;
    margin: 0 auto;
    .ctc-table {
      margin-top: 20px;
    }
    .ctc-search {
      height: 70px;
      line-height: 70px;
      background-color: #fff;
      margin: 20px 0 20px 0;
      padding-left: 18px;
      font-size: 14px;
      .el-input {
        width: 200px;
        input {
          // height: 32px;
          // line-height: 32px;
        }
      }
      div {
        display: inline-block;
        margin-right: 10px;
      }
      .swbtn {
        margin-left: 16px;
        font-size: 18px;
        width: 100px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-size: 18px;
        color: #000;
        background-color: #fff;
        margin-left: 16px;
        border-radius: 10px;
        cursor: pointer;
      }
      .btnselect {
        color: #fff;
        background-color: #42506c;
      }
      div {
        cursor: pointer;
      }
    }
    .ctc-list {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      padding-top: 15px;
      .list-item {
        width: 375px;
        height: 190px;
        background-color: #fff;
        border: 1px solid #fff;
        border-radius: 8px;
        margin-bottom: 30px;
        margin-right: 44px;
        -moz-box-shadow: 2px 2px 4px #e5e5e5;
        -webkit-box-shadow: 2px 2px 4px #e5e5e5;
        box-shadow: 2px 2px 4px #e5e5e5;
        &:hover {
          border: 1px solid #5e72e4;
        }
        &:nth-child(4n) {
          margin-right: 0;
        }
      }
      .li-head {
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span:first-child {
          display: inline-block;
          font-size: 18px;
          margin-left: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 250px;
        }
        span:last-child {
          font-size: 18px;
          margin-right: 16px;
          width: 76px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border-radius: 5px;
          font-size: 14px;
          cursor: pointer;
        }
        .apply {
          border: 1px solid #5e72e4;
          color: #5e72e4;
          &:hover {
            background-color: #3349c8;
            border-color: #3349c8;
            color: #fff;
          }
        }
        .install {
          background-color: #92cf48;
          color: #fff;
        }
        .alyinstalled {
          color: #000;
          font-size: 14px;
          margin-right: 16px;
        }
        border-bottom: 1px solid #e5e5e5;
      }
      .li-content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 14px;
        div:first-child {
          margin: 16px 20px 0 16px;
        }
        div:nth-of-type(2) {
          height: 100px;
          margin-right: 4px;
          position: relative;
          margin-top: 10px;
          span {
            display: inline-block;
            height: 72px;
            line-height: 25px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          p {
            position: absolute;
            bottom: 0;
            span {
              background-color: #3577f6;
              border-color: #3577f6;
              color: #fff;
              width: 76px;
              height: 30px;
              line-height: 30px;
              text-align: center;
              border-radius: 5px;
              font-size: 14px;
              position: relative;
              top: 10px;
              cursor: pointer;
            }
          }
        }
        // div:nth-of-type(2)::after {
        //   content:"...";
        //   font-weight:bold;
        //   position:absolute;
        //   bottom:0;
        //   right:0;
        //   padding:0 20px 1px 45px;
        //   background:url(http://lidada.org/wp-content/uploads/2017/11/overflow_bg.png) repeat-y;
        // }
        img {
          width: 100px;
          height: 100px;
          border-radius: 10px;
          border: 1px solid #ddd;
        }
        .operation {
          height: 100px;
          p {
            width: 48px;
            height: 30px;
            line-height: 30px;
            border: 1px solid #99a4b8;
            border-radius: 4px;
            text-align: center;
            position: relative;
            cursor: pointer;
            &:hover {
              background-color: #f6f6f6;
            }
          }
          p:first-child {
            left: 24px;
            top: 5px;
          }
          p:last-child {
            left: 24px;
            bottom: -50px;
          }
        }
      }
    }
    .ms-operation{
      display: flex;
      justify-content: space-between;
      height: 50px;
      line-height: 50px;
      background-color: #fff;
      margin: 20px 0 20px 0;
      padding-left: 18px;
      font-size: 12px;
      .operation-btn{
        display: inline-block;
        width: 80px;
        height: 30px;
        line-height: 26px;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 20px;
      }
      div{
        &:first-child {
          span{
            width: 90px;
            background-color: #48b061;
            color: #fff;
            i {
              position: relative;
              top: 2px;
            }
          }
        }
        &:last-child{
          // padding-right: 20px;
          span:first-child{
            background-color: #fff;
            color: #3175D2;
            border: 1px solid #3175D2;
          }
          span:last-child{
            background-color: #fff;
            color: #48b061;
            border: 1px solid #48b061;
          }
        }
      }
    }
    .el-pagination {
      width: 446px;
      margin-right: 20px;
    }
    .ctc-foot {
      background-color: #ffffff;
      display: flex;
      justify-content: space-between;
      padding: 60px 0 30px 20px;
      .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #2f3f48;
        color: #fff;
      }
      .el-pagination.is-background .el-pager li:not(.disabled):hover {
        color: #999;
      }
    }
    .pagingnum {
      font-size: 14px;
      text-align: center;
      color: #777;
      select {
        width: 70px;
        height: 28px;
        border-radius: 2px;
      }
    }
  }
  .el-dialog__header,
  .el-dialog__body {
    margin: 0 40px;
    padding-left: 0;
  }
  .el-dialog__body {
    padding: 10px 0 0 0;
    height: 85%;
  }
  .el-form-item {
    display: inline-block;
    width: 100%;
  }
  .line {
    display: inline-block;
    width: 36px;
    border-bottom: 1px solid #bbbbbd;
    margin-left: 36px;
  }

  .el-form-item {
    margin-bottom: 14px;
  }
  .el-form-item__content {
    line-height: inherit;
  }
  .defaultbtn {
    background-color: #3577f6 !important;
    border-color: #5e72e4 !important;
  }
  .dl-subtitle {
    font-size: 16px;
  }
  .el-dialog__body {
    color: #000;
  }
  .required {
    color: $color-red-1;
    font-size: 16px;
    position: relative;
    top: 4px;
    left: 1px;
  }
  .applogo {
    margin-bottom: 10px;
    div {
      display: inline-block;
    }
    .logo {
      width: 100px;
      min-height: 100px;
      border: 1px dashed #cccccc;
      border-radius: 10px;
      img {
        width: 100%;
        height: auto;
      }
    }
    .upload {
      vertical-align: top;
      margin-left: 14px;
      position: relative;
      input {
        position: absolute;
        top: 34px;
        right: 18px;
        width: 88px;
        height: 34px;
        opacity: 0;
        cursor: pointer;
      }
      .uploadbtn {
        display: inline-block;
        width: 88px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        border: 1px solid #5e72e4;
        border-radius: 8px;
        color: #5e72e4;
        margin: 34px 0 10px 0;
        cursor: pointer;
        .icon-upload {
          background: url(../../../assets/upload.png) no-repeat;
          position: relative;
          top: 2px;
        }
      }
      p {
        font-size: 12px;
      }
    }
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: #5e72e4;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #5e72e4;
    background: #5e72e4;
  }
  .el-radio__label {
    color: #777;
  }
  .readonly {
    margin: 10px 0 20px 0;
    color: #666666;
  }
  .errorTip {
    color: red !important;
    width: 150px !important;
    left: 13px;
    position: relative;
    bottom: -75px;
  }
  .el-radio__inner {
    width: 18px;
    height: 18px;
  }
  .el-radio__inner::after {
    width: 8px;
    height: 8px;
  }
  .resdialog {
    .el-dialog {
      width: 500px;
      height: 300px;
      border-radius: 8px;
    }
    .success-icon {
      text-align: center;
    }
    .rescontent {
      text-align: center;
      margin-top: 20px;
      h3 {
        color: #333;
      }
      p {
        font-size: 16px;
        margin: 20px 0;
      }
      span {
        display: inline-block;
        width: 140px;
        height: 40px;
        line-height: 40px;
        background-color: #3577f6;
        color: #fff;
        border-radius: 4px;
        margin-bottom: 10px;
        cursor: pointer;
      }
    }
  }
  .addpostdialog {
    .el-dialog {
      width: 800px;
    }
    .el-select {
      width: 100%;
    }
    .el-form-item {
      width: 30%;
      margin-bottom: 20px !important;
      margin-right: 30px;
      &:nth-of-type(3n) {
        margin-right: 0;
      }
    }
    .cttitle {
      margin-bottom: 4px;
    }
    .el-dialog__body {
      padding-top: 10px !important;
    }
    .el-textarea__inner {
      height: 100px;
    }
  }
  .editbtn {
    color: #409eff;
  }
  .el-cascader{
    width: 100%;
  }
  .manualEntry {
    .el-dialog{
      width: 1000px;
    }
  }
  .screen{
    width: 120px;
    .el-input{
      width: 120px!important;
    }
  }
  .labelbtn{
    &:hover{
      background-color: #85d234!important;
      border-color: #85d234!important;
      color: #fff;
    }
  }
}
</style>
