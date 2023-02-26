<template>
  <div :class="[hourseList === 'on' ? 'houring paddingLeft' : 'houring', hourseList === 'off' ? 'houring paddingRight' : 'houring']">
    <p>意向合同列表</p>
    <div class="intention_container">
    	<div class="contract_search">
    	  <div class="search-top clearing">
    	  	<el-input v-model="queryShopNumber" placeholder="合同编号/合同名称"></el-input>
          <div @click="search" class="query-btn">查询</div>
          <div @click="addHoursing" class="addbtn" v-if="hasAuthority('02040101')"><i class="iconfont icon-edit"></i>新增意向合同</div>
    	  </div>
    		<div v-if="buildsList.length" class="search-bottom">
    			<dl>
    				<dt>选择楼宇：</dt>
    				<dd v-for="(item, index) in buildsList" :key="index"><span>{{item.buildingName}}</span><span @click="deleBuild(index)" class="iconfont icon-jinakangbaoicons18"></span></dd>
    			</dl>
    		</div>
    	</div>
      <div class="hourse-table">
      	<div class="table">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="yxContractNo" label="意向合同编号" width="110px;" align="center"></el-table-column>
            <!-- <el-table-column prop="floor.name" label="意向合同名称" width="110px;" align="center"></el-table-column> -->
            <el-table-column prop="itContractStatusStr" label="意向合同状态" width="120px;" align="center"
              :filters="[{text: '暂存', value: '暂存'}, {text: '待确认', value: '待确认'}, {text: '已确认', value: '已确认'}, {text: '已转为合同', value: '已转为合同'}, {text: '已作废', value: '已作废'}]"
              :filter-method="filterHandler"
            ></el-table-column>
            <el-table-column prop="tenantName" label="品牌" align="center"></el-table-column>
            <el-table-column prop="date" label="意向时间" align="center"></el-table-column>
            <el-table-column prop="shopNo" label="房源号" width="110px;" align="center"></el-table-column>
            <el-table-column label="租赁数量" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.area | toLocaleFixed }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="priceAndUnit" label="意向单价" align="center"></el-table-column>
            <el-table-column label="意向定金/元" width="110px;" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.yxDeposit | toLocaleString }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="跟进人" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button @click="handleEdit(scope.$index, scope.row)" class="el-button--primary operation-btn" size="mini" v-if="hasAuthority('02040102')">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page">
          <div class="pagingnum">显示 <select v-model="pager.pgSize" @change="pgSizeSelectFn">
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
                         :current-page="pager.currentPage"
                         @current-change="current_change">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog class="addintentionContracts" title="添加意向合同" :visible.sync="addVisible" :close-on-click-modal="false">
      <addIntentionContracts :projectList='projectList' @addDialogClose="addDialogClose" @query="query"/>
    </el-dialog>
    <projectSidebar @hourseList="setpdleft" @buildsList="setBuildsList" @query="query" ref="projectSidebar"/>
    <intentionDetails :detailsdrawershow="detailsShow"
                 :detailData="detailData"
                 ref="hourseDetails"
                 @drawerClose="detailsClose"
                 @handleEdit="handleEdit"
                 @query="query" />
  </div>  
</template>
<script>
import context from '@/service'
import intentionDetails from './components/intentionContractsDetials'
import addIntentionContracts from './components/addIntentionContracts'
import projectSidebar from '@/components/projectSidebar'
export default {
  name: 'intentionContractsList',
  components: {
    addIntentionContracts,
    projectSidebar,
    intentionDetails
  },
  data () {
    return {
      navList: [{label: '未租房源', value: true}, {label: '已租房源', value: false}, {label: '所有房源', value: false}],
      checkList: ['USING'],
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
      addVisible: false,
      selProject: false,
      selHourse: false,
      hourseList: '',
      detailsShow: false,
      detailData: {},
      projectList: [],
      hourList: [],
      buildingList: [],
      onRent: false,
      statisicsData: {},
      queryShopNumber: '',
      queryShopNumber_: '',
      projectArr: [],
      buildsList: []
    }
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[inx].value = true
      if (inx === 0) {
        this.onRent = false
      } else if (inx === 1) {
        this.onRent = true
      } else {
        this.onRent = null
      }
      this.pager.currentPage = 1
      this.query()
    },
    search () {
      this.pager.currentPage = 1
      this.queryShopNumber_ = this.queryShopNumber
      this.query()
    },
    filterHandler (value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    detailsClose () {
      this.detailsShow = false
    },
    handleEdit (index, row) {
      context.http.get('/cms/api/yx-contracts/' + row.id).then(res => {
        this.detailData = res.data
        this.detailsShow = true
      })
    },
    bindCheckBox (value) {
      this.checkList = []
      this.checkList.push(value[1])
      this.pager.currentPage = 1
      this.query(this.idsArray)
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.query(this.idsArray)
    },
    pgSizeSelectFn () { // 切换显示条数
      this.pager.currentPage = 1
      this.query(this.idsArray)
    },
    addHoursing () {
      context.http.get('/cms/api/project-managements', {useStatus: 'USING'}).then(res => {
        this.projectList = res.data
      })
      this.addVisible = true
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
    chooseItem (state, item) {
      if (state === 'project') {
        this.selProject = !this.selProject
        this.addData.projectManagement = item
        this.addData.building = {}
        this.buildingList = []
        if (this.addData.floor) {
          this.addData.floor = null
        }
        context.http.get('/cms/api/buildings', {projectId: item.id, useStatus: 'USING'}).then(res => {
//        this.addData.building = res.data.buildingListDTOS[0]
          this.hourList = res.data.buildingListDTOS
        })
      } else {
        this.selHourse = !this.selHourse
        this.addData.building = item
        if (this.addData.floor) {
          this.addData.floor = null
        }
        context.http.get('/cms/api/floors/building/' + this.addData.building.id).then(res => {
          this.buildingList = res.data
        })
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
    addHourse (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let addData = JSON.parse(JSON.stringify(this.addData))
          this.buildingList.forEach(item => {
            if (item.id === addData.floor) {
              addData.floor = item
            }
          })
          context.http.post('/cms/api/rooms', addData).then(res => {
            this.addVisible = false
            this.pager.currentPage = 1
            this.query()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deleBuild (index) {
      this.$refs.projectSidebar.deleBuild(index)
    },
    query (ids) {
      let idArray = []
      if (ids && ids.length > 0) {
        this.pager.currentPage = 1
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
      context.http.get('/cms/api/yx-contracts?' + typeArr, {name: this.queryShopNumber_, page: (this.pager.currentPage - 1), size: this.pager.pgSize, sort: 'desc'}).then(res => {
        res.data.forEach(item => {
          item.date = item.startDate + '-' + item.endDate
          if (item.itContractStatus === 'STORAGE') {
            item.itContractStatusStr = '暂存'
          } else if (item.itContractStatus === 'TO_BE_CONFIRMED') {
            item.itContractStatusStr = '待确认'
          } else if (item.itContractStatus === 'CONFIRMED') {
            item.itContractStatusStr = '已确认'
          } else if (item.itContractStatus === 'TO_CONTRACT') {
            item.itContractStatusStr = '已转为合同'
          } else if (item.itContractStatus === 'INVALID') {
            item.itContractStatusStr = '已作废'
          }
          if (item.priceUnit === 'DAY') {
            item.priceAndUnit = item.yxUnitPrice + '元/天'
          } else if (item.priceUnit === 'MONTH') {
            item.priceAndUnit = item.yxUnitPrice + '元/月'
          } else if (item.priceUnit === 'M2DAYS') {
            item.priceAndUnit = item.yxUnitPrice + '元/㎡天'
          } else if (item.priceUnit === 'M2MONTH') {
            item.priceAndUnit = item.yxUnitPrice + '元/㎡月'
          }
        })
        this.tableData = res.data
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
    },
    addDialogClose () {
      this.addVisible = false
    }
  },
  mounted () {
    this.query()
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
ul, li{
  list-style: none;
}
.contract_search .el-input .el-input__inner{
  width:180px;
  height:32px;
  line-height: 32px;
  position: absolute;
  left:0;
  top:0;
}
.houring{
  font-size: 16px;
  background-color: #f9f9f9;
  .intention_container{
    background-color: #f9f9f9;
    .contract_search{
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
        .addbtn {
          cursor: pointer;
          font-size: 12px;
          width: 120px;
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
  .addintentionContracts {
    .el-dialog {
      width: 1000px !important;
      margin-top: 3vh !important;
    }
    .dl-head {
      display: flex;
      justify-content: space-start;
      margin-top: 20px;
    }
    .step {
      display: inline-block;
      width: 49%;
      height: 40px;
      line-height: 40px;
      padding-left: 14px;
      font-size: 16px;
      background-color: #f9f9f9;
      color: #777;
      border-radius: 6px;
      margin-right: 20px;
      &:last-child{
        margin-right: 0;
      }
    }
    .stepActive {
      color: #fff;
      background-color: #3175d2;
    }
    .stepActivePast {
      color: #fff;
      background-color: #789ed2;
    }
    .drawer-content {
      margin-top: 10px;
    }
    .el-textarea__inner {
      height: 100px;
    }
    .checkAll {
      font-size: 16px;
      .el-checkbox__label {
        font-size: 16px;
      }
    }
    .cttitle {
      margin-bottom: 10px;
    }
    .el-select {
      width: 100%;
    }
    .el-form-item__content {
      .el-cascader {
        width: 100%;
      }
      span {
        color: #666;
      }
    }
    .dl-content {
      width: 100%;
      margin-bottom: 20px;
      .head-portrait {
        padding-top: 36px;
        text-align: center;
        .hp-img {
          width: 100px;
          height: 100px;
          border: 1px dashed #dfdfdf;
          border-radius: 50%;
          margin-left: 22%;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .upload {
          vertical-align: top;
          position: relative;
          .uploadbtn {
            display: inline-block;
            width: 88px;
            height: 34px;
            line-height: 34px;
            text-align: center;
            border: 1px solid #5e72e4;
            border-radius: 8px;
            color: #5e72e4;
            margin-top: 14px;
            cursor: pointer;
            .icon-upload {
              background: url(../../../assets/upload.png) no-repeat;
              position: relative;
              top: 2px;
              width: 14px;
            }
          }
          input {
            position: absolute;
            top: 14px;
            right: 41px;
            width: 88px;
            height: 34px;
            opacity: 0;
            cursor: pointer;
          }
        }
        p {
          font-size: 12px;
          margin-top: 10px;
          color: #666;
        }
      }
      .dc-left {
        width:30%;
        text-align: center;
        border: 1px solid #e7e7e7;
        margin-top: 20px;
        .dr-head {
          background-color: #fafafa;
          height: 40px;
          line-height: 40px;
          padding-left: 12px;
          font-size: 16px;
          margin-bottom: 24px;
        }
        .buildList{
          width:95%;
          margin:10px auto;
          li{
            width:100%;
            p{
              width:100%;
              display: flex;
              justify-content: space-between;
              background: #fafafa;
              padding:0 15px;
              span{
                display: block;
                height:30px;
                line-height: 30px;
              }
            }
            dl{
              width:100%;
              padding:0 15px;
              dd{
                width:100%;
                border-bottom:1px solid #e7e7e7;
                .select{
                  width:100%;
                  .el-checkbox{
                    width:100%;
                    margin:0;
                    display: flex;
                    padding-top:10px;
                    .el-checkbox__input{
                      margin-left:20px;
                      margin-top:4px;
                    }
                    .el-checkbox__label{
                      span{
                        width: 66px;
                        height: auto;
                        display: inline-block;
                        text-align: center;
                        vertical-align: top;
                        white-space: normal;
                      }
                    }
                  }
                }
                
              }
            }
          }
        }
      }
      .tenantinfo{
        .el-form-item {
          width: 29%!important;
          margin-right: 0;
        }
        .cttitle  + span{
          display: inline-block;
          height: 25px;
          line-height: 40px;
        }
      }
      .dc-right {
        width: 68%;
        border: 1px solid #e7e7e7;
        margin-top: 20px;
        .dr-head {
          background-color: #fafafa;
          height: 40px;
          line-height: 40px;
          padding-left: 12px;
          font-size: 16px;
          margin-bottom: 24px;
        }
        .el-form-item {
          display: inline-block;
          width: 45%;
          margin-left: 16px;
          margin-right: 10px;
          &:nth-of-type(odd) {
            margin-right: 0;
          }
        }
        .dc-right_div {
          border: 1px solid #e7e7e7;
          margin-top: 20px;
          .cttitle span:nth-of-type(2) {
            color: #0f75ff;
            font-size: 12px;
            float: right;
            cursor: pointer;
          }
          .psotmaster span {
            color: #666 !important;
          }
        }
      }
    }
  }
  .el-dialog__body{
    color: #333;
  }
  .el-date-editor{
    width: 100%!important;
  }
  .basic-select{
    position: relative;
    cursor: pointer;
    width: 95%;
    margin: 0 auto;
    .selectInput{
      height: 40px;
      border:1px solid #e7e7e7;
      border-radius:5px;
      padding:0 15px;
      &.selectActive{
        border:1px solid #6473cb;
      }
      img{
        float: left;
        display: block;
        width: 60px;
        height: 30px;
        margin-top:10px;
      }
      span{
        float: left;
        color:#666666;
        display: block;
        line-height: 50px;
        font-size: 14px;
        &:last-child{
          float: right;
          // color: #6473cb;
        }
      }
    }
    .selectBox{
      width:100%;
      border:1px solid #e7e7e7;
      border-radius: 3px;
      background: #fff;
      position: absolute;
      left:0;
      top:45px;
      z-index: 9;
      padding:15px 0px;
      box-shadow: 1px 2px 5px #ddd;
      overflow-y: auto;
      li{
        border-bottom:1px solid #e7e7e7;
        padding:10px 15px;
        display: flex;
        &:hover{
          background: #eee;
        }
        img{
          display: block;
          width:50px;
          height:21.3px;
          margin-right:20px;
        }
        span{
          display: block;
          line-height: 20px;
          font-size: 14px;
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
