<template>
    <div id="projectActivities" class="projectActivities">
      <span class="page_head_title">企划活动</span>
      <ul class="default_tab_block">
        <li class="active" v-if="hasAuthority('02030401')">
          <span>项目活动</span>
        </li>
        <li @click="toBusinessActivities" v-if="hasAuthority('02030402')">
          <span>商家活动</span>
        </li>
      </ul>
      <div class="search-bar">
        <div class="searbar-left">
          <span style="margin-right:10px;">
            <el-select v-model="projectManagementId" placeholder="选择项目" style="width:150px;margin-right:0;" clearable size="small">
              <el-option
                v-for="item in options1"
                :key="item.id"
                :label="item.referred"
                :value="item.id">
              </el-option>
            </el-select>
          </span>
          <span>
            <el-date-picker style="width:250px;"
              size="small"
              v-model="startEndTime"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              clearable
              :editable="false"
              :picker-options="pickerOptions"
              @change="startEndTimeChange"
              >
            </el-date-picker>
          </span>
          <span>
            <el-input placeholder="活动名称" style="width:150px" v-model="name" size="small"></el-input>
          </span>
          <span>
            <el-select style="width:150px" clearable v-model="activityStatus" size="small">
              <el-option label="筹备执行中" value="EXECUTING"></el-option>
              <el-option label="评估" value="ASSESS"></el-option>
              <el-option label="存档" value="ARCHIVE"></el-option>
              <el-option label="已关闭" value="CLOSED"></el-option>
            </el-select>
          </span>
          <div class="query-btn" @click="querySeach">查询</div>
        </div>
        <el-button class="tban tban1"
                       @click="addActivity" v-if="hasAuthority('02030403')"><i class="iconfont icon-crm_xinzeng-"></i> 新增活动</el-button>
      </div>
      <div class="tableList">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="活动图片" align="center">
            <template slot-scope="scope">
              <img :src="formatImgURL(scope.row)" alt="" style="max-width:112px;max-height:88px">
            </template>
          </el-table-column>
          <el-table-column prop="projectRefferd" label="项目简称" align="center"></el-table-column>
          <el-table-column prop="name" label="活动名称" align="center"></el-table-column>
          <el-table-column label="活动时间" align="center" :formatter="formatTime" width="200px"></el-table-column>
          <el-table-column prop="place" label="活动地点" align="center"></el-table-column>
          <el-table-column prop="organizer" label="活动举办方" align="center"></el-table-column>
          <el-table-column prop="amount" label="活动预算" align="center"></el-table-column>
          <el-table-column prop="activityStatus" label="活动状态" align="center" :formatter="formatStatus"></el-table-column>
          <el-table-column label="操作"  width="300px" align="center" v-if="hasAuthority('02030405')">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)" class="el-button--primary operation-btn" size="mini">查看</el-button>  
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
                       :current-page.sync="currentPage"
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
      <el-dialog title="新增活动" :visible.sync="addActivityDialogVisible"  class="addActivityDialog" width="650px" @close="addActivityClose" :close-on-click-modal="false">
        <el-form :model="addData" :rules="addFlowRules" ref="addData">
          <div class="content">
            <div class="item">
              <span>活动类型<i class="required">*</i></span>
              <el-form-item prop="activityType" >
                <el-select style="width:240px" v-model="addData.activityType">
                  <el-option label="项目活动" value="PROJECT"></el-option>
                  <!-- <el-option label="商家活动" value="SHOP"></el-option> -->
                </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <span>活动名称<i class="required">*</i></span>
              <el-form-item prop="name">
                <el-input style="width:240px" v-model="addData.name" placeholder="请输入" maxlength="20"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <span>活动时间<i class="required">*</i></span>
              <el-form-item prop="startDate">
              <el-date-picker
                style="width:240px"
                v-model="addStartEndTime"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                value-format="yyyy-MM-dd"
                @change="addStartEndTimeChange"
                end-placeholder="结束日期">
              </el-date-picker>
              </el-form-item>
            </div>
            <div class="item">
              <span>所属项目<i class="required">*</i></span>
              <el-form-item prop="projectId">
              <el-select v-model="addData.projectId" placeholder="选择项目" style="width:240px" clearable @change="projectIdChange">
                <el-option
                  v-for="item in options1"
                  :key="item.id"
                  :label="item.referred"
                  :value="item.id">
                </el-option>
              </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <span>活动地点<i class="required">*</i></span>
              <el-form-item prop="place">
                <el-input style="width:240px" v-model="addData.place" maxlength="20" placeholder="请输入内容"></el-input>
              </el-form-item>
            </div>
            <div class="item" v-if="addData.activityType==='PROJECT'">
              <span>举办方</span>
              <el-form-item prop="organizer">
                <el-input style="width:240px" v-model="addData.organizer" maxlength="20" placeholder="请输入内容"></el-input>
              </el-form-item>
            </div>
            <div class="item" v-else>
              <span>客户名称<i class="required">*</i></span>
              <el-form-item prop="tenantId">
                <!-- <el-select v-model="addData.tenantName" style="width:240px">
                  <el-option label="1" value="1"></el-option>
                </el-select> -->
                <el-autocomplete
                  style="width:240px"
                  class="inline-input"
                  v-model="autocompleteText"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容"
                  @select="handleSelect"
                ></el-autocomplete>
              </el-form-item>
            </div>
            <div class="item">
              <span>负责人</span>
              <el-form-item prop="principal">
                <el-input style="width:240px" v-model="addData.principal" maxlength="20" placeholder="请输入内容"></el-input>
              </el-form-item>
            </div>
            <div class="item" v-if="addData.activityType==='PROJECT'">
              <span>预计费用/元<i class="required">*</i></span>
              <el-form-item prop="amount">
                <el-input style="width:240px" v-model="addData.amount" placeholder="请输入金额" maxlength="15"  onkeyup="value=value.replace(/[^\0-9\.]/g,'')" onpaste="value=value.replace(/[^\0-9\.]/g,'')" oncontextmenu = "value=value.replace(/[^\0-9\.]/g,'')"></el-input>
              </el-form-item>
            </div>
            <div class="item" style="width:100%">
              <span>活动描述</span>
              <el-form-item prop="description">
                <el-input type="textarea" :rows="3" placeholder="请输入内容"  v-model="addData.description" maxlength="500"></el-input>
              </el-form-item>
            </div>
            <div class="item" style="width:100%" v-if="addData.activityType==='PROJECT'">
              <span>原因/初衷</span>
              <el-form-item prop="reason">
                <el-input type="textarea" :rows="3" placeholder="请输入内容"  v-model="addData.reason" maxlength="500"></el-input>
              </el-form-item>
            </div>
            <div class="item" style="width:100%" v-if="addData.activityType==='PROJECT'">
              <span>目标设定<i class="required">*</i></span>
              <el-form-item prop="target">
                <el-input type="textarea" :rows="3" placeholder="请输入内容"  v-model="addData.target" maxlength="500"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addActivityClose" class="close-button">关 闭</el-button>
          <el-button type="primary" @click="saveaddActivityFrom('addData')" class="defaultbtn dialog-confirmBtn">确 定</el-button>
        </div>
      </el-dialog>
      <ActivityDtails 
        :detailsdrawershow="detailsdrawershow"
        :detailsData="detailsData"
        @detailsUpdate="detailsUpdate"
        @queryUpdate="query"
        @drawerClose="drawerClose"
      />
    </div>
</template>

<script>
import context from '@/service'
import ActivityDtails from './components/ActivityDtails'
import { error } from 'util'
export default {
  name: 'projectActivities',
  components: {
    ActivityDtails
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
    this.query()
  },
  data () {
    return {
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.choiceDate = minDate.getTime()
          if (maxDate) {
            this.choiceDate = ''
          }
        },
        disabledDate: (time) => {
          if (this.choiceDate) {
            const one = 365 * 24 * 3600 * 1000
            const minTime = this.choiceDate - one
            const maxTime = this.choiceDate + one
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        }
      },
      choiceDate: '',
      autocompleteText: '',
      addStartEndTime: [],
      detailsData: {
        annexes: [],
        images: []
      },
      detailsdrawershow: false,
      addData: {
        activityType: 'PROJECT',
        name: null,
        startDate: null,
        endDate: null,
        projectId: null,
        place: null,
        organizer: null,
        principal: null,
        amount: null,
        description: null,
        reason: null,
        target: null,
        tenantId: null
      },
      addFlowRules: {
        activityType: [
          { required: true, message: '请选择活动类型', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入活动名称', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择活动时间', trigger: 'change' }
        ],
        projectId: [
          { required: true, message: '请选择活动项目', trigger: 'change' }
        ],
        place: [
          { required: true, message: '请输入活动地点', trigger: 'change' }
        ],
        amount: [
          { required: true, message: '请输入预计费用', trigger: 'change' }
        ],
        target: [
          { required: true, message: '请输入目标设定', trigger: 'change' }
        ],
        tenantId: [
          { required: true, message: '请输入客户名称', trigger: 'change' }
        ]
      },
      addActivityDialogVisible: false,
      tableData: [],
      options1: [],
      projectManagementId: '',
      startDate: '',
      endDate: '',
      name: '',
      activityStatus: '',
      startEndTime: '',
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
      tenantList: []// 客户列表
    }
  },
  methods: {
    formatImgURL (row) {
      if (row.images.length) {
        return row.images[0]
      }
      return ''
    },
    detailsUpdate (id) { // 更新查看详情数据
      let row = { 'id': id }
      this.handleEdit('', row)
    },
    handleEdit (index, row) { // 查看
      context.http.get(`/cms/api/plan-activities/${row.id}`).then(res => {
        this.detailsData = res.data
        this.detailsdrawershow = true
      }).catch(error => {
        console.log(error)
      })
    },
    querySearch (queryString, callback) {
      var restaurants = this.tenantList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
        // 调用 callback 返回建议列表的数据
      callback(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) { // 模糊搜索项目下商户
      this.addData.tenantId = item.id
      console.log(item)
    },
    projectIdChange (projectId) {
      console.log(projectId)
      context.http.get(`/cms/api/tenant/projectManagement/${projectId}`).then(res => {
        this.tenantList = []
        this.tenantList = res.data.map(item => {
          return {value: item.teantName, id: item.id}
        })
        this.addData.tenantId = null
        this.autocompleteText = ''
      }).catch(error => {
        console.log(error)
      })
    },
    formatStatus (row, column) {
      switch (row.activityStatus) {
        case 'EXECUTING':
          return '筹备执行'
        case 'ASSESS':
          return '评估'
        case 'ARCHIVE':
          return '存档'
        case 'CLOSED':
          return '已关闭'
      }
    },
    formatTime (row, column) {
      return row.startDate + ' - ' + row.endDate
    },
    async query () {
      let param = {
        projectManagementId: this.projectManagementId,
        startDate: this.startDate,
        endDate: this.endDate,
        name: this.name,
        page: (this.currentPage - 1),
        size: this.pgSize,
        activityStatus: this.activityStatus,
        sort: 'startDate,id,desc'
      }
      let result = await context.http.get('/cms/api/plan-activities/projectManagement', param)
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
    },
    addStartEndTimeChange (time) {
      if (time) {
        this.addData.startDate = time[0]
        this.addData.endDate = time[1]
      } else {
        this.addData.startDate = null
        this.addData.endDate = null
      }
    },
    startEndTimeChange (time) {
      if (time) {
        this.startDate = time[0]
        this.endDate = time[1]
      } else {
        this.startDate = null
        this.endDate = null
      }
    },
    saveaddActivityFrom (formName) { // 提交活动
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          context.http.post('/cms/api/plan-activities', this.addData).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '新增成功'
              })
              _this.addActivityClose()
              _this.query()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addActivityClose () {
      this.addStartEndTime = []
      this.addData = { // 编辑新增计划入参
        activityType: 'PROJECT',
        name: null,
        startDate: null,
        endDate: null,
        projectId: null,
        place: null,
        organizer: null,
        principal: null,
        amount: null,
        description: null,
        reason: null,
        target: null,
        tenantId: null
      }
      this.addActivityDialogVisible = false
      this.$refs['addData'].resetFields()
    },
    addActivity () { // 新增活动
      this.addActivityDialogVisible = true
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
      // return true
    },
    querySeach () {
      this.currentPage = 1
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    toBusinessActivities () {
      this.$router.push({name: 'businessActivities'})
    },
    drawerClose () {
      this.detailsdrawershow = false
    }
  }
}
</script>
<style lang="scss">
.projectActivities{
  .addActivityDialog{
    .content{
      .item{
        >.el-date-editor,>.el-select,>.el-textarea{
          margin-bottom: 22px;
        }
        .el-textarea textarea{
          height: auto!important;
        }
      }
    }
  }
  .showImg{
    text-align: center;
  }
  .bigImg{
    width: auto;
    height: auto;
    max-width: 600px;
    max-height: 600px;
    min-width: 300px;
    min-height: 300px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
}
</style>

<style lang="scss" scoped>
.projectActivities{
  .addActivityDialog{
    .content{
      padding: 20px 0;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .item{
        flex-direction:column;
        >span{
          display: block;
          margin-bottom: 5px;
        }
      }
    }
  }
  .tableList{
    margin-top: 10px;
    border-top: 1px solid #eee;
  }
  .addbtn{
    margin-top: 0;
    width: 100px;
  }
  .query-btn{
    display: inline-block;
  }
  .menuTab{
    height: 60px;
    margin-top: 15px;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 4px 4px 4px 1px #eee;
    >span{
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
    }
  }
  .seachDiv{
    background-color: #ffffff;
    margin-top: 15px;
    border-radius:5px; 
    box-shadow: 4px 4px 4px 1px #eee;
    display: flex;
    align-items: center;
    padding-left: 20px;
    justify-content: space-between;
    flex-wrap: wrap;
    span{
      margin-right: 20px;
    }
  }
  @media screen and (max-width: 1600px) {
    .seachDiv {
      padding-bottom: 15px;
    }
  }
}
</style>
