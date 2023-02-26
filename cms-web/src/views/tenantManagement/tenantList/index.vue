<template>
  <div :class="[hourseList === 'on' ? 'tenant paddingLeft' : 'tenant', hourseList === 'off' ? 'tenant paddingRight' : 'tenant']">
    <p>客户列表</p>
    <div class="hourse_container">
      <div class="hourse_search">
        <div class="search-top clearing">
          <el-input v-model="tenantName"
                    placeholder="品牌/客户名称"></el-input>
          <div @click="search"
               class="query-btn">查询</div>
          <div @click="hourseVisible = true"
               class="addbtn"
               v-if="hasAuthority('02030101')"><i class="iconfont icon-edit"></i>新增客户</div>
        </div>
        <div v-if="buildsList.length"
             class="search-bottom">
          <dl>
            <dt>选择楼宇：</dt>
            <dd v-for="(item, index) in buildsList"
                :key="index">
              <span>{{item.buildingName}}</span><span @click="deleBuild(index)"
                    class="iconfont icon-jinakangbaoicons18"></span>
            </dd>
          </dl>
        </div>
      </div>
      <div class="hourse_statistical">
        <div class="statistical_top">客户统计</div>
        <ul class="statistical_bot">
          <li>
            <p>客户数量</p>
            <p v-if="tableData.statisics">{{tableData.statisics.tenantNumber}}</p>
          </li>
          <li>
            <p>合同数量</p>
            <p v-if="tableData.statisics">{{tableData.statisics.contractNumber}}</p>
          </li>
        </ul>
      </div>
      <div class="hourse-table">
        <div class="table">
          <el-table :data="tableData.content"
                    style="width: 100%">
            <el-table-column prop="referred"
                             label="品牌"
                             align="center"></el-table-column>
            <el-table-column prop="teantName"
                             label="客户名称"
                             align="center"></el-table-column>
            <el-table-column prop="industry"
                             label="业态"
                             align="center"></el-table-column>
            <el-table-column prop="projectReferred"
                             label="项目简称"
                             align="center"></el-table-column>
            <el-table-column prop="building"
                             label="楼宇"
                             align="center"></el-table-column>
            <el-table-column prop="shopNo"
                             label="房源号"
                             align="center">
                <template slot-scope="scope">
                  {{formatShopNo(scope.row.shopNo)}}
                </template>
            </el-table-column>
            <el-table-column prop="contact"
                             label="联系人"
                             align="center"></el-table-column>
            <el-table-column prop="telephone"
                             label="手机号"
                             align="center"></el-table-column>
            <el-table-column label="操作"
                             align="center">
              <template slot-scope="scope">
                <el-button @click="handleEdit(scope.$index, scope.row)"
                           class="el-button--primary operation-btn"
                           size="mini"
                           v-if="hasAuthority('02030103')">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
      </div>
      <div class="ctc-foot">
        <div class="page">
          <div class="pagingnum">显示 
            <select v-model="pager.pgSize" @change="currentSel">
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
    <el-dialog class="addHourse"
               title="新增客户信息"
               :visible.sync="hourseVisible"
               :close-on-click-modal="false">
      <addTenant ref="addTenant" @query="query" @dialogClose="hourseVisible = false" :addDataFromPotClienDtl="addDataFromPotClienDtl"/>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="hourseVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button @click="addTenant('addData')"
                   type="primary"
                   class="defaultbtn dialog-confirmBtn">确 认</el-button>
      </div>
    </el-dialog>
    <!-- <div :class="[hourseList === 'on' ? 'hourseList marginLeft' : 'hourseList', hourseList === 'off' ? 'hourseList marginRight' : 'hourseList']">
      <div @click="changeHourse"
           class="closeHourse">
        <span v-if="hourseList !== 'on'"
              class="iconfont icon-rili"></span>
        <span v-if="hourseList === 'on'"
              class="iconfont icon-cha"></span>
      </div>
      <div class="content">
        <div class="list">
          <dl v-for="(item, i) in fieldsList"
              :key="i">
            <dt :class="item.show ? 'act' : ''"
                @click="spread(i)">
              <img v-if="!item.show"
                   :src="item.previewImage" />
              <span class="over-hiden">{{item.projectName}}</span>
              <span v-if="!item.show"
                    class="iconfont icon-bottom"></span>
              <span v-if="item.show"
                    class="iconfont icon-top"></span>
            </dt>
            <dd v-if="item.show">
              <div class="ddbox"
                   @click="chooseSoread(i, inx)"
                   v-for="(items, inx) in item.buildingListDTOSet"
                   :class="[items.choose ? 'active' : '', item.show ? 'animateDown' : '']"
                   :key="inx">
                <img :src="items.buildingImage" />
                <p>
                  <span>{{items.buildingName}}</span>
                  <span>面积：{{items.managerArea}}㎡</span>
                </p>
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div> -->
    <tenantDetails :detailsdrawershow="detailsShow"
                   :tenantDetail="detailData"
                   ref="tenantDetails"
                   @affirmDialog="affirmDialog"
                   @drawerClose="detailsClose"
                   @query="query" 
                   v-if="detailsShow"/>
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      class="turnoverDialog"
      width="30%"
      center>
      <span>该客户目前可能未租赁房源，是否继续导入</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <span class="UpBtn1">
          <i>确 定</i>
          <input type="file" @change="imageChange('addapp', $event)" id="imageChange">
        </span>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import addTenant from './components/addTenant'
import tenantDetails from './components/tenantDetails'
export default {
  name: 'tenantList',
  components: {
    addTenant,
    tenantDetails
  },
  data () {
    return {
      centerDialogVisible: false,
      navList: [{ label: '未租房源', value: true }, { label: '已租房源', value: false }, { label: '所有房源', value: false }],
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
      tableData: {

      },
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
      addDataFromPotClienDtl: {
        teantName: null,
        referred: null
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
      tenantName: '',
      queryShopNumber: '',
      queryShopNumber_: '',
      projectArr: [],
      buildsList: [],
      ids: []
    }
  },
  mounted () {
    this.query()
    this.loadProject()
    if (this.$route.params.pageFrom === 'potClienDtl') {
      this.hourseVisible = true
      console.log('potClienDtl')
      this.addDataFromPotClienDtl.teantName = this.$route.params.addDataFromPotClienDtl.yxTenantName
      this.addDataFromPotClienDtl.referred = this.$route.params.addDataFromPotClienDtl.referred
      this.addDataFromPotClienDtl.yxTenantId = this.$route.params.addDataFromPotClienDtl.id
      this.addDataFromPotClienDtl.chooseObj = this.$route.params.addDataFromPotClienDtl.projectManagementDTO
      this.addDataFromPotClienDtl.customerType = this.$route.params.addDataFromPotClienDtl.customerType
      this.addDataFromPotClienDtl.industryId = this.$route.params.addDataFromPotClienDtl.industryId
      this.addDataFromPotClienDtl.contact = this.$route.params.addDataFromPotClienDtl.contact
      this.addDataFromPotClienDtl.telephone = this.$route.params.addDataFromPotClienDtl.telephone
    }
  },
  methods: {
    formatShopNo (val) {
      return val.join('、')
    },
    affirmDialog (contractId, tenantId) {
      this.centerDialogVisible = true
      this.contractId = contractId
      this.tenantId = tenantId
      console.log(contractId, tenantId)
    },
    imageChange (state, event) {
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      form.append('contractId', this.contractId)
      form.append('tenantId', this.tenantId)
      let name = files[0].name
      let index = name.lastIndexOf('.')
      let type = name.substr(index + 1).toLowerCase()
      if (index > 0 && type !== 'xlsx' && type !== 'xls') {
        this.$message({
          message: '格式错误，请上传xlsx格式文件',
          type: 'error'
        })
      } else {
        context.http.post('/cms/api/tenantTurnover/file', form, {headers: { 'Content-Type': 'multipart/form-data' }}).then(res => {
          this.centerDialogVisible = false
          this.$message({
            message: '导入成功！',
            type: 'success'
          })
          this.$refs.tenantDetails.getTurnoverList()// 调用子组件方法从新请求列表
          document.getElementById('imageChange').value = ''
          // this.getTurnoverList()
        }).catch(error => {
          document.getElementById('imageChange').value = ''
          console.info(error)
        })
      }
    },
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
    detailsClose () {
      this.detailsShow = false
    },
    handleEdit (index, row) {
      context.http.get('/cms/api/tenant/' + row.id).then(res => {
        this.detailData = res.data
        this.detailsShow = true
      })
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.pager.currentPage = 1
      this.query()
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
        context.http.get('/cms/api/buildings', { projectId: item.id, useStatus: 'USING' }).then(res => {
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
    changeHourse () {
      if (this.hourseList === '') {
        this.hourseList = 'on'
      } else if (this.hourseList === 'on') {
        this.hourseList = 'off'
      } else {
        this.hourseList = 'on'
      }
    },
    addTenant () {
      this.$refs.addTenant.addTenant()
      // this.$refs.addTenant.checkName()
    },
    spread (inx) {
      this.fieldsList.forEach((item, index) => {
        if (inx !== index) {
          item.show = false
        }
      })
      this.fieldsList[inx].show = !this.fieldsList[inx].show
    },
    deleBuild (index) {
      if (this.buildsList[index].id) {
        this.fieldsList.forEach(item => {
          if (item.buildingListDTOSet) {
            item.buildingListDTOSet.forEach(items => {
              if (items.id === this.buildsList[index].id) {
                items.choose = false
              }
            })
          }
        })
      }
      this.buildsList.splice(index, 1)
      let arr = []
      this.buildsList.forEach(item => {
        arr.push(item.id)
      })
      this.ids = arr
      this.pager.currentPage = 1
      this.query()
    },
    chooseSoread (i, inx) {
      this.fieldsList[i].buildingListDTOSet[inx].choose = !this.fieldsList[i].buildingListDTOSet[inx].choose
      if (this.fieldsList[i].buildingListDTOSet[inx].choose) {
        this.buildsList.push(this.fieldsList[i].buildingListDTOSet[inx])
      } else {
        this.buildsList.splice(this.buildsList.indexOf(this.fieldsList[i].buildingListDTOSet[inx]), 1)
      }
      let arr = []
      this.buildsList.forEach(item => {
        arr.push(item.id)
      })
      this.ids = arr
      this.pager.currentPage = 1
      this.query()
    },
    loadProject () {
      context.http.get('/cms/api/project-managements/listBar').then(res => {
        res.data.forEach(item => {
          item.show = false
          res.data[0].show = true
          if (item.buildingListDTOSet) {
            item.buildingListDTOSet.forEach(items => {
              items.choose = false
            })
          }
        })
        this.fieldsList = res.data
      })
    },
    async query () {
      let result = await context.http.get('/cms/api/tenant', { page: (this.pager.currentPage - 1), size: this.pager.pgSize, sort: 'id,desc', tenantName: this.tenantName })
      this.tableData = result.data
      this.pager.total = Number(result.headers['x-total-count'])
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/config";
ul,
li {
  list-style: none;
}
.hourse_search .el-input .el-input__inner {
  width: 180px;
  height: 32px;
  line-height: 32px;
  position: absolute;
  left: 0;
  top: 0;
}
.tenant {
  font-size: 16px;
  background-color: #f9f9f9;
  .hourse_container {
    background-color: #f9f9f9;
    .hourse_search {
      background-color: #fff;
      margin: 20px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      .search-top {
        border-bottom: 1px solid #ecedef;
        padding-bottom: 18px;
        padding-left: 18px;
        .el-input {
          width: 180px;
          height: 32px;
          display: block;
          margin-top: 18px;
        }
        div {
          float: left;
          display: inline-block;
        }
        div {
          cursor: pointer;
        }
      }
      .search-bottom {
        padding-left: 18px;
        padding: 20px 18px 20px;
        dl {
          display: flex;
          font-size: 12px;
          line-height: 18px;
          dt {
            color: #333333;
          }
          dd {
            display: flex;
            color: #666;
            margin-right: 16px;
            span {
              display: block;
              &:first-child {
                margin-right: 5px;
              }
              &:last-child {
                font-size: 18px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
    .hourse_statistical {
      background-color: #fff;
      margin: 15px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      .statistical_top {
        padding: 15px 30px;
        font-size: 15px;
        color: #747474;
        line-height: 15px;
        border-bottom: 1px solid #ecedef;
      }
      .statistical_bot {
        padding: 32px 30px 40px;
        display: flex;
        li {
          list-style: none;
          padding-right: 45px;
          padding-left: 20px;
          height: 45px;
          border-right: 2px solid #ecedef;
          &:first-child {
            padding-left: 0;
          }
          &:last-child {
            border-right: 0;
          }
          &:nth-child(3) {
            border-right: 0;
            margin-right: 115px;
          }
          p {
            color: #adadad;
            font-size: 14px;
            line-height: 14px;
            margin-top: -8px;
            &:last-child {
              color: #333;
              font-size: 20px;
              margin-top: 30px;
            }
          }
        }
      }
    }
    .hourse-table {
      background-color: #fff;
      margin: 10px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
    }
  }
  .hourseList {
    position: fixed;
    right: -350px;
    top: 50px;
    z-index: 10;
    width: 350px;
    height: 100%;
    background: #fff;
    box-shadow: -5px 0 20px -5px #ddd;
    .closeHourse {
      position: absolute;
      left: -40px;
      top: 50%;
      margin-top: -60px;
      width: 40px;
      height: 50px;
      background: #5482f7;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      cursor: pointer;
      z-index: 10;
      line-height: 50px;
      text-align: center;
      font-size: 18px;
      color: #fff;
    }
    .content {
      position: relative;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      .list {
        dl {
          dt {
            border-bottom: 1px solid #efefef;
            height: 90px;
            padding: 20px 16px;
            cursor: pointer;
            &.act {
              height: 50px;
              padding: 0px 16px;
              span {
                &.over-hiden {
                  width: 280px;
                  white-space: nowrap;
                  word-break: break-all;
                  text-overflow: ellipsis;
                  overflow: hidden;
                }
                margin-left: 0;
              }
            }
            img {
              display: block;
              width: 100px;
              height: 50px;
              float: left;
            }
            span {
              float: left;
              display: block;
              line-height: 50px;
              color: #333;
              margin-left: 16px;
              &.over-hiden {
                width: 180px;
                white-space: nowrap;
                word-break: break-all;
                text-overflow: ellipsis;
                overflow: hidden;
              }
              &:last-child {
                float: right;
                color: #6473cb;
                margin-left: 0;
              }
            }
          }
          dd {
            overflow: hidden;
            .ddbox {
              width: 315px;
              border: 1px solid #efefef;
              border-radius: 6px;
              margin: 0 auto;
              padding: 15px;
              display: flex;
              margin-top: 16px;
              cursor: pointer;
              &.active {
                border: 1px solid #6473cb;
                background: #f7f7f7;
              }
              &.animateDown {
                animation: slideInDown 0.4s 0s ease-out forwards;
              }
              img {
                width: 100px;
                height: 50px;
              }
              p {
                margin-left: 14px;
                span {
                  display: block;
                  color: #737373;
                  font-size: 14px;
                  line-height: 14px;
                  &:first-child {
                    margin-top: 16px;
                    margin-bottom: 6px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .marginLeft {
    animation: cloud-on 0.2s 0s ease-out forwards;
  }
  .marginRight {
    animation: cloud-on2 0.2s 0s ease-out forwards;
  }
  .addHourse {
    .el-dialog{
      width: 1000px;
    }
  }
  .page {
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
.paddingLeft {
  animation: cloud-in 0.2s 0s ease-out forwards;
}
.paddingRight {
  animation: cloud-in2 0.2s 0s ease-out forwards;
}
@keyframes cloud-in {
  0% {
    padding-right: 0;
  }
  100% {
    padding-right: 350px;
  }
}
@keyframes cloud-in2 {
  0% {
    padding-right: 350px;
  }
  100% {
    padding-right: 0;
  }
}
@keyframes cloud-on {
  0% {
    right: -350px;
  }
  100% {
    right: 0;
  }
}
@keyframes cloud-on2 {
  0% {
    right: 0;
  }
  100% {
    right: -350px;
  }
}
@-webkit-keyframes slideInDown {
  0% {
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
    visibility: visible;
  }

  100% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes slideInDown {
  0% {
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
    visibility: visible;
  }

  100% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
  .UpBtn1{
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    font-size: 14px;
    border-radius: 4px;
    width: 75px;
    height: 40px;
    line-height: 40px;
    position: relative;
       input {
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
  .turnoverDialog{
    .el-dialog--center .el-dialog__body{
          padding: 25px 25px 30px!important;
    }
  }
</style>
