<template>
  <div :class="[hourseList === 'on' ? 'approvalCenter paddingLeft' : 'approvalCenter', hourseList === 'off' ? 'approvalCenter paddingRight' : 'approvalCenter']">
    <p v-if="!homeReference">合同到期列表</p>
    <div class="hourse_container">
    	<div class="hourse_search" v-if="!homeReference">
    	  <div class="search-top clearing">
    	  	<el-input v-model="queryName" placeholder="合同编号/合同名称"></el-input>
          <div @click="search" class="query-btn">查询</div>
    	  </div>
    		<div v-if="buildsList.length" class="search-bottom">
    			<dl>
    				<dt>选择楼宇：</dt>
    				<dd v-for="(item, index) in buildsList" :key="index"><span>{{item.buildingName}}</span><span @click="deleBuild(index)" class="iconfont icon-jinakangbaoicons18"></span></dd>
    			</dl>
    		</div>
    	</div>
      <div v-else class="projectChange">
        <span>项目选择：</span>
        <el-select v-model="projectManagementId" placeholder="项目" @change='projectChanged'>
          <el-option
            v-for="item in options2"
            :key="item.id"
            :label="item.projectName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="hourse-table">
      	<div class="table">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="buildingName[0]" label="项目" align="center" v-if="homeReference"></el-table-column>
            <el-table-column prop="contractNo" label="合同编号" align="center"></el-table-column>
            <el-table-column prop="tenantName" label="品牌" align="center"></el-table-column>
            <el-table-column prop="projectManagementName" label="楼宇" align="center" v-if="homeReference"></el-table-column>
            <el-table-column prop="shopNo" label="房源号" align="center"></el-table-column>
            <el-table-column prop="time" label="合同到期时间" align="center">
              <template slot-scope="scope">
                {{scope.row.time}}<span v-if="scope.row.remark" style="color: red">({{scope.row.remark}})</span>
              </template>
            </el-table-column>
            <el-table-column  label="初始单价" align="center"  v-if="homeReference">
              <template slot-scope="scope">
                {{scope.row.contractPrice | toLocaleString}}
              </template>
            </el-table-column>
            <el-table-column prop="realPrice" label="实时单价" align="center"  v-if="homeReference">
              <template slot-scope="scope">
                {{scope.row.realPrice | toLocaleString}}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button @click="handleEdit(scope.$index, scope.row)" class="el-button--primary" size="mini" >查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page">
          <div class="pagingnum">显示 <select v-model="pager.pgSize">
              <option v-for="item in pager.pgNumoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </option>
            </select>
            条目 <span style="padding-left: 30px">显示从{{pager.pgSize*(pager.currentPage - 1) + 1}}到{{pager.pgSize*pager.currentPage}}项结果，共<span class="style: red">{{pager.total}}</span>条</span>
          </div>
          <el-pagination v-if="pager.total > 0"
                         background
                         layout="prev, pager, next"
                         :page-size=pager.pgSize
                         :total="pager.total"
                         @current-change="current_change">
          </el-pagination>
        </div>
      </div>
    </div>
    <projectSidebar :isHomeReference="homeReference" @hourseList="setpdleft" @buildsList="setBuildsList" @query="query" ref="projectSidebar"/>
    <!-- <hourseDetails :detailsdrawershow="detailsShow"
                 :detailData="detailData"
                 ref="hourseDetails"
                 @drawerClose="detailsClose"
                 @query="query" /> -->
  </div>  
</template>
<script>
import context from '@/service'
// import hourseDetails from './components/hourseDetails'
import projectSidebar from '@/components/projectSidebar'
export default {
  name: 'contractExpiration',
  props: ['homeReference'], // 是否被首页当子组件引用
  components: {
    // hourseDetails,
    projectSidebar
  },
  data () {
    return {
      projectManagementId: '',
      options2: [],
      idsArray: [],
      navList: [{label: '我发起的', value: true}, {label: '待处理', value: false}, {label: '已处理', value: false}],
      pager: {
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
        ]
      },
      tableData: [],
      addData: {
        projectManagement: {},
        building: {},
        floor: null,
        industry: null,
        decorationId: null,
        investmentStatus: null,
        expectedUnitPrice: null,
        priceUnit: 'M2DAYS'
      },
      addDataRules: {
        floor: [
          { required: true, message: '请选择楼层', trigger: 'change' }
        ],
        shopNumber: [
          { required: true, message: '请输入房源号', trigger: 'blur' }
        ],
        industry: [
          { required: true, message: '请选择预期业态', trigger: 'change' }
        ],
        buildingArea: [
          { required: true, message: '请输入建筑面积', trigger: 'blur' }
        ],
        expectedUnitPrice: [
          { required: true, message: '请输入预期单价', trigger: 'blur' }
        ]
      },
      fieldsList: [],
      formLabelWidth: '120px',
      hourseVisible: false,
      selProject: false,
      selHourse: false,
      hourseList: '',
      detailsShow: false,
      detailData: {},
      projectList: [],
      hourList: [],
      decorate: '',
      buildingList: [],
      onRent: false,
      statisicsData: {},
      queryName: '',
      projectArr: [],
      buildsList: []
    }
  },
  methods: {
    projectChanged () {
      this.query(this.idsArray)
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    search () {
      this.pager.currentPage = 1
      this.query(this.idsArray)
    },
    detailsClose () {
      this.detailsShow = false
    },
    handleEdit (index, row) {
      this.$router.push({path: '/home/contractsList', query: {contractIdForDetails: row.id}})
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.query(this.idsArray)
    },
    choose (state) {
      if (state === 'project') {
        this.selHourse = false
        this.selProject = !this.selProject
      } else {
        this.selProject = false
        this.selHourse = !this.selHourse
      }
    },
    addLabel (e) {
      if (!e.target.value) return
      this.addData.label.push(e.target.value)
      e.target.value = ''
    },
    deleteLabel (inx) {
      this.addData.label.splice(inx, 1)
    },
    deleBuild (index) {
      this.$refs.projectSidebar.deleBuild(index)
    },
    query (ids) {
      let idArray = []
      if (ids && ids.length > 0) {
        // this.pager.currentPage = 1
        idArray = ids
      }
      let typeArr = ''
      idArray.forEach((item, index) => {
        if (index === idArray.length - 1) {
          typeArr += 'buildingId=' + item
        } else {
          typeArr += 'buildingId=' + item + '&'
        }
      })
      context.http.get('/cms/api/contracts/overtime?' + typeArr, {projectManagementId: this.projectManagementId, name: this.queryName, page: (this.pager.currentPage - 1), size: this.pager.pgSize, sort: 'desc'}).then(res => {
        this.tableData = res.data
        this.statisicsData = res.data.statisics
        this.pager.total = Number(res.headers['x-total-count'])
      })
    },
    setpdleft (val) {
      this.hourseList = val
    },
    setBuildsList (val) {
      this.buildsList = val
      let idsArray = []
      this.buildsList.forEach(ele => {
        idsArray.push(ele.id)
      })
      this.idsArray = idsArray
      this.pager.currentPage = 1
    }
  },
  created () {
    // this.getDataAuthorityOptions()
    this.options2 = this.$store.state.projectManagementsList
  },
  mounted () {
    this.query()
  }
}
</script>
<style lang="scss">
@import "../../../style/config";
ul, li{
  list-style: none;
}
.hourse_search .el-input .el-input__inner{
  width:180px;
  height:32px;
  line-height: 32px;
  position: absolute;
  left:0;
  top:0;
}
.approvalCenter{
  background-color: #f9f9f9;
  .hourse_container{
    .projectChange{
      background-color: #fff;
      margin: 20px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      padding: 15px 15px;
      border: 1px solid #f8fafd;
    }
    background-color: #f9f9f9;
    .hourse_search{
      background-color: #fff;
      margin: 20px 0 0px 0;
      box-shadow:1px 2px 5px #eee;
      border-radius:3px;
      .search-top{
        border-bottom:1px solid #ecedef;
        padding-bottom:18px;
        padding-left:18px;
        .el-input {
          width:180px;
          height:32px;
          display:block;
          margin-top:18px;
        }
        div {
          float: left;
          display: inline-block;
        }
        div {
          cursor: pointer;
        }
      }
      .search-bottom{
        padding-left:18px;
        padding:20px 18px 20px;
        dl{
          display: flex;
          font-size: 12px;
          line-height: 18px;
          dt{
            color:#333333;
          }
          dd{
            display: flex;
            color:#666;
            margin-right:16px;
            span{
              display: block;
              &:first-child{
                margin-right:5px;
              }
              &:last-child{
                font-size: 18px;
                cursor:pointer;
              }
            }
          }
        }
      }
    }
    .hourse-table{
      background-color: #fff;
      margin: 10px 0 0px 0;
      box-shadow:1px 2px 5px #eee;
      border-radius:3px;
      .page{
        background-color: #ffffff;
        display: flex;
        justify-content: space-between;
        padding: 60px 30px 30px 30px;
        .el-pagination.is-background .el-pager li:not(.disabled).active {
          background-color: #2f3f48;
          color: #fff;
        }
        .el-pagination.is-background .el-pager li:not(.disabled):hover {
          color: #999;
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
    }
  }
}
@keyframes cloud-in{
    0% {
      padding-right:0;
    }
    100%{
      padding-right:350px;
    }
  }
  @keyframes cloud-in2{
    0%{
      padding-right:350px;
    }
    100%{
      padding-right:0;
    }
  }
.paddingLeft{
  animation: cloud-in .2s 0s ease-out forwards;
}
.paddingRight{
  animation: cloud-in2 .2s 0s ease-out forwards;
}
</style>
