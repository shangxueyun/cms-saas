<template>
  <div class="activityHtml">
      <div class="tableList" :style="{height:heights}">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="活动图片" align="center" width="150px">
            <template slot-scope="scope">
              <img :src="formatImgURL(scope.row)" alt="" style="width:112px;height:88px">
            </template>
          </el-table-column>
          <el-table-column prop="name" label="活动名称" align="center"></el-table-column>
          <el-table-column label="活动时间" align="center" :formatter="formatTime" width="200px"></el-table-column>
          <el-table-column prop="projectRefferd" label="项目" align="center"></el-table-column>
          <el-table-column prop="place" label="活动地点" align="center"></el-table-column>
          <el-table-column prop="tenantName" label="活动举办方" align="center"></el-table-column>
          <el-table-column label="操作"  align="center">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)" class="el-button--primary operation-btn" size="mini">查看</el-button>  
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
                       :current-page.sync="currentPage"
                       @current-change="current_change">
        </el-pagination>
      </div>
      <ActivityDtails 
        :detailsdrawershow="detailsdrawershow"
        :detailsData="detailsData"
        @heiahtAuto="heiahtAuto"
        @queryUpdate="query"
        @drawerClose="drawerClose"
      />
  </div>
</template>
<script>
import context from '@/service'
import ActivityDtails from '../../../operations/eventsPlanner/businessActivities/components/ActivityDtails'
export default {
  props: {
    tenantDetail: {

    }
  },
  components: {
    ActivityDtails
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
    this.query()
    console.log(this.tenantDetail.id)
  },
  methods: {
    heiahtAuto () {
      this.heights = 'auto'
    },
    drawerClose () {
      this.detailsdrawershow = false
    },
    formatImgURL (row) {
      if (row.images.length) {
        return row.images[0]
      }
      return ''
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
      if (projectId === '') {
        return
      }
      context.http.get(`/cms/api/tenant/projectManagement/${projectId}`).then(res => {
        this.tenantList = []
        this.tenantList = res.data.map(item => {
          return {value: item.teantName, id: item.id}
        })
      }).catch(error => {
        console.log(error)
      })
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
    formatTime (row, column) {
      return row.startDate + ' - ' + row.endDate
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
    async query () {
      let param = {
        projectManagementId: this.projectManagementId,
        startDate: this.startDate,
        endDate: this.endDate,
        name: this.name,
        tenantId: this.tenantDetail.id,
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'createdDate,desc'
      }
      let result = await context.http.get('/cms/api/plan-activities/tenant', param)
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
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
        activityType: 'SHOP',
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
    handleEdit (index, row) { // 查看
      context.http.get(`/cms/api/plan-activities/${row.id}`).then(res => {
        this.detailsData = res.data
        this.detailsdrawershow = true
        this.heights = '100px'
      }).catch(error => {
        console.log(error)
      })
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
    toProjectActivitiess () {
      this.$router.push({name: 'projectActivities'})
    }
  },
  data () {
    return {
      heights: 'auto',
      autocompleteText: '',
      addStartEndTime: [],
      detailsData: {
        annexes: [],
        images: []
      },
      detailsdrawershow: false,
      addData: {
        activityType: 'SHOP',
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
          { required: true, message: '请选择活项目', trigger: 'change' }
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
      name: '',
      startDate: '',
      endDate: ''
    }
  }
}
</script>
<style lang="scss" scoped>
  .tableList{
    width: 100%;
    overflow: hidden;
  }
</style>
