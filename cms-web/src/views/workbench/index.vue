<template>
  <div class="workbench" @click="showDialog = false">
    <!-- <div class="jobContent" id="jobContent">
      <div class="sidebar"> -->
        <!-- <el-steps  direction="vertical" :active="activeStep">
          <el-step title="工作台"  @click.native="jump(0)"></el-step> 
          <el-step 
            v-for="(item,index) in anchorList"
            :key="index"
            :title="item.name"
            @click.native="jump(index + 1)"
          ></el-step>
        </el-steps> -->
        <!-- <p :class="{'active':activeIndex===0}"><i aria-hidden="true" class="icon icon-project"></i>工作台</p> -->
        <!-- <p :class="{'active':activeIndex===index + 1}"
          v-for="(item,index) in anchorList"
          :key="index"
          @click="jump(index + 1)"
        ><i aria-hidden="true" class="icon" :class="{'icon-project':index===0,'icon-zuke':index===1,'icon-htong':index===2,'icon-caiwu':index===3}"></i>{{item.name}}</p> -->
      <!-- </div>
    </div> -->
    <div class="contentInner">
      <div class="nav-List">
        <div class="nav-bar">
          <router-link :to="{ name: 'approvalCenter'}">
            <!-- <div class="task-number blue-color">{{resData.processTaskNumber + resData.processCcTaskNumber}}</div> -->
            <img src="../../assets/home-approval.png" alt="">
            <span>
              <p>审批中心</p>
              <p>待审批：{{resData.processTaskNumber + resData.processCcTaskNumber}}</p>
            </span>
          </router-link>
        </div>
        <!-- <div class="nav-bar">
          <router-link :to="{ name: 'contractExpiration'}">
            <div class="task-number pink-color">{{resData.contractNumber}}</div>
            <span>
              <p style="color: #EA6C82">合同到期</p>
              <p>待处理：{{resData.contractNumber}}</p>
            </span>
          </router-link>
        </div>
        <div class="nav-bar">
          <router-link :to="{ name: 'billMaturity'}">
            <div class="task-number orange-color">{{resData.billingNumber}}</div>
            <span>
              <p style="color: #F4B861">账单到期/逾期</p>
              <p>待处理：{{resData.billingNumber}}</p>
            </span>
          </router-link>
        </div> -->
        <div class="nav-bar">
          <router-link :to="{ name: 'reportingCenter'}">
            <!-- <div class="task-number green-color">{{resData.workReportNumber}}</div> -->
            <img src="../../assets/home-report.png" alt="">
            <span>
              <p>汇报中心</p>
              <p>待查看：{{resData.workReportNumber}}</p>
            </span>
          </router-link>
        </div>
        <div class="nav-bar">
            <router-link :to="{ name: 'messageCenter'}">
              <img src="../../assets/home-message.png" alt="">
              <span>
                <p>消息中心</p>
                <p>待查看：{{messageNumber}}</p>
              </span>
            </router-link>
            <!-- <div class="message-tip">
              <p>消息通知</p>
              <div v-if="news && news.message">
                <div>
                  <p><span>{{news.message.title}}</span><span v-if="news.message.sendTime">{{news.message.sendTime.substring(0, 16).replace('T', ' ')}}</span></p>
                  <p><span>{{news.message.overview}}</span><span @click.stop="$router.push({name: 'messageManagement', query: {id: news.id}})" style="color:#56AB2F">查看详情</span></p>
                </div>
              </div>
            </div> -->
        </div>
      </div>
      <!-- <div class="content" style="margin-top:30px">
        <transition name="fade"  mode="out-in">
          <router-view @targetOffTopArr="targetOffTopArr" :anchorList="anchorListArr" @subscriptionSuc="subscriptionSuc" ref="jobContent" ></router-view>
        </transition>
      </div> -->
      <!-- 新版工作台 -->
      <div class="content">
        <!-- <div class="custom-form" @click.stop="showDialog = !showDialog;getUserSubscribe()" v-if="hasAuthority('09010101') || hasAuthority('09010201') || hasAuthority('09010301')">自定义表单</div> -->
        <!-- <div class="step_tab">
          <ul class="nav">
            <li @click="changeNav(index)" v-for="(item, index) in navList" :key="index" :class="item.value ? 'select_active' : ''" v-if="hasAuthority(item.code)">{{item.label}}</li>
          </ul>
        </div> -->
        <!-- <div class="pj-search search-bar">
          <div>
            <el-select v-model="projectId" placeholder="管理企业" size="small">
              <el-option
                v-for="item in projectOptions"
                :key="item.id"
                :label="item.referred"
                :value="item.id">
              </el-option>
            </el-select>
            <div @click="search" class="query-btn">查询</div>
          </div>
        </div> -->
        <component :is="selectComp" ref="componentss" @getProject="getProject" :projectIdSelected="projectId" :anchorList="selectArr" :projectOptions="projectOptions" @menuActiveIndex="menuActiveIndex"></component>
        <!-- 自定义表单弹框 -->
        <!-- <div class="custom-form-dialog" v-show="showDialog">
          <div class="cfd-div" v-if="hasAuthority('09010401')">
            <p>项目对比</p>
            <div>
              <span v-for="(item, index) in xmdbList" :key="index" @click.stop="cfdselect(item)" :class="{'selected': item.onSubscribe}">{{item.name}}</span>
            </div>
          </div>
          <div class="cfd-div" v-if="hasAuthority('09010101')">
            <p>项目概览</p>
            <div>
              <span v-for="(item, index) in xmglList" :key="index" @click.stop="cfdselect(item)" :class="{'selected': item.onSubscribe}">{{item.name}}</span>
            </div>
          </div>
          <div class="cfd-div" v-if="hasAuthority('09010201')">
            <p>招商模块</p>
            <div>
              <span v-for="(item, index) in zsmkList" :key="index" @click.stop="cfdselect(item)" :class="{'selected': item.onSubscribe}">{{item.name}}</span>
            </div>
          </div>
          <div class="cfd-div" v-if="hasAuthority('09010301')">
            <p>运营模块</p>
            <div>
              <span v-for="(item, index) in yymkList" :key="index" @click.stop="cfdselect(item)" :class="{'selected': item.onSubscribe}">{{item.name}}</span>
            </div>
          </div>
          <div class="dl-bottom">
            <div class="dialog-footer">
              <el-button @click.stop="showDialog = false"
                        class="close-button">取 消</el-button>
              <el-button type="primary"
                        @click.stop="addSave()"
                        class="defaultbtn dialog-confirmBtn">确 定</el-button>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import * as hub from '@/service/eventHub'
import ProjectOverview from './components/ProjectOverview'
// import InvestmentModule from './components/InvestmentModule'
// import OperationModule from './components/OperationModule'
export default {
  name: 'workbench',
  props: ['scrollTop'],
  components: {
    ProjectOverview
    // InvestmentModule,
    // OperationModule
  },
  watch: {
    scrollTop (val) {
      this.pageTop = val
    }
  },
  data () {
    return {
      navList: [{label: '项目概览', value: true, code: '09010101'}, {label: '招商模块', value: false, code: '09010201'}, {label: '运营模块', value: false, code: '09010301'}],
      resData: {workReportNumber: 0, processTaskNumber: 0, processCcTaskNumber: 0},
      xmdbList: [{name: '两费收缴', subscribeId: 1, code: '0401', onSubscribe: false}, {name: '出租率', subscribeId: 12, code: '0402', onSubscribe: false}, {name: '平均租金', subscribeId: 13, code: '0403', onSubscribe: false}],
      xmglList: [{name: '出租率', subscribeId: 2, code: '0101', onSubscribe: false}, {name: '费用收缴', subscribeId: 11, code: '0102', onSubscribe: false}, {name: '业态分析', subscribeId: 14, code: '0103', onSubscribe: false}, {name: '平均租金', subscribeId: 15, code: '0104', onSubscribe: false}], // {name: '业态分析', subscribeId: 3, code: '0103', onSubscribe: false}, {name: '新签约用户', subscribeId: 4, code: '0104', onSubscribe: false}
      zsmkList: [ {name: '未租房源', subscribeId: 5, code: '0201', onSubscribe: false}, {name: '当前意向客户', subscribeId: 6, code: '0202', onSubscribe: false} ], // {name: '房源单价占比', subscribeId: 7, code: '0203', onSubscribe: false}, {name: '招商需求面积分析', subscribeId: 8, code: '0204', onSubscribe: false}
      yymkList: [{name: '当前账单', subscribeId: 9, code: '0301', onSubscribe: false}], //, {name: '跟进时间', subscribeId: 10, code: '0302', onSubscribe: false}, {name: '合同到期日分析', subscribeId: 12, code: '0304', onSubscribe: false}
      selectComp: 'ProjectOverview',
      projectId: '',
      pageTop: 0,
      anchorList: [
          // {id: 0, name: '工作台', onSubscribe: true, subscribeId: 0}
      ],
      activeStep: 0,
      anchorListArr: [],
      activeIndex: 0,
      selectArr: [],
      checkList: [],
      showDialog: false,
      news: '',
      projectOptions: [],
      messageNumber: 0
    }
  },
  created () {
    hub.eventHub.$on('messageCome', v => {
      this.messageCount()
    })
    this.getProjectOptions()
    this.$nextTick(() => {
      this.pageTop = this.scrollTop
    })
    this.query()
    this.messageCount()
    this.getNews()
    this.getUserSubscribe()
    if (this.hasAuthority('09010101')) {
      // this.selectComp = 'ProjectOverview'
    } else if (this.hasAuthority('09010201')) {
      // this.selectComp = 'InvestmentModule'
    } else if (this.hasAuthority('09010301')) {
      // this.selectComp = 'OperationModule'
    }
  },
  beforeDestroy () {
    hub.eventHub.$off('messageCome')
  },
  mounted () {
    let vm = this
    this.$nextTick(() => {
      vm.search()
    })
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    menuActiveIndex (index) {
      this.$emit('menuActiveIndex', index)
    },
    search () {
      // this.$refs.componentss.queryProject(this.projectId)
    },
    getProjectOptions () {
      // this.getProjectList()
    },
    getProject (projectId) {
      this.projectId = projectId
    },
    async getProjectList () {
      let result = await context.http.get('cms/api/getOrganiz/infoByids', { useStatus: 'USING', ids: '' })
      this.projectOptions = result.data
      if (this.projectOptions.length > 0) {
        this.projectId = this.projectOptions[0].id
      }
    },
    getNews () {
      context.http.get('/mps/api/messageUsers?sort=message.sendTime,desc&sort=createdDate,desc', {page: 0, size: 1}).then(res => {
        this.news = res.data[0]
      })
    },
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      if (inx === 0) {
        this.navList[inx].value = true
        this.selectComp = 'ProjectOverview'
      } else if (inx === 1) {
        this.navList[inx].value = true
        this.selectComp = 'InvestmentModule'
      } else {
        this.navList[inx].value = true
        this.selectComp = 'OperationModule'
      }
    },
    cfdselect (item) {
      item.onSubscribe = !item.onSubscribe
      let selectArr = this.checkList.slice(0)
      // let selectArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      if (selectArr.includes(item.subscribeId)) {
        let index = selectArr.indexOf(item.subscribeId)
        selectArr.splice(index, 1)
      } else {
        selectArr.push(item.subscribeId)
      }
      this.checkList = selectArr
    },
    addSave () {
      if (this.checkList.length === 0) {
        this.$message.error('最少选择一项！')
        return
      }
      this.selectArr = this.checkList
      this.subscription()
    },
    async getUserSubscribe () {
      this.selectArr = []
      let result = await context.http.get('cms/api/userSubscribe')
      // this.xmglList = result.data.slice(0, 3)
      // this.zsmkList = result.data.slice(4, 7)
      // this.yymkList = result.data.slice(8, 11)
      for (var i = 0; i < result.data.length; i++) {
        if (result.data[i].onSubscribe) {
          this.selectArr.push(result.data[i].subscribeId)
        }
      }
      this.checkList = this.selectArr
      this.getArrEqual(this.xmdbList, this.selectArr)
      this.getArrEqual(this.xmglList, this.selectArr)
      this.getArrEqual(this.zsmkList, this.selectArr)
      this.getArrEqual(this.yymkList, this.selectArr)
    },
    getArrEqual (arr1, arr2) {
      for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arr1.length; j++) {
          if (arr1[j].subscribeId === arr2[i]) {
            arr1[j].onSubscribe = true
          }
        }
      }
    },
    subscriptionSuc () {
      this.getUserSubscribe()
    },
    subscription () { // 订阅
      context.http.post('/cms/api/userSubscribe', {subscribeIds: this.selectArr}).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.showDialog = false
          this.getUserSubscribe()
        }
      })
    },
    query () {
      context.http.get('/cms/api/staging').then(res => {
        this.resData = res.data
        // this.$router.push({name: 'jobContent'})
      })
    },
    messageCount () {
      context.http.get('/mps/api/messageCenters/notReadCount').then(res => {
        this.messageNumber = res.data
      })
    }
  }
}
</script>
<style lang="scss" >
  .workbench{
    .nav-List{
      display: flex;
      .nav-bar{
          display: block;
          width:33%;
          height:140px;
          background:#ddd;
          box-shadow:0px 4px 12px 1px rgba(158,162,166,0.2);
          border-radius:8px;
          margin-right: 1%;
          margin-bottom: 10px;
          position: relative;
          cursor: pointer;
          background:linear-gradient(90deg,rgba(0,82,212,1) 0%,rgba(111,177,252,1) 100%);
          box-shadow:0px 2px 6px 1px rgba(243,156,41,0.2);
          a{
            display: block;
            width:100%;
            height:100%;
            >img{
              display: block;
              width:120px;
              height:auto;
              position: absolute;
              right:20px;
              top:0;
              z-index: 2;
            }
          }
          .task-number{
            position: absolute;
            width:40px;
            height:40px;
            line-height: 40px;
            text-align: center;
            color: #fff;
            border-radius:4px;
            top: -10px;
            left: 20px;
          }
          a{
            >span{
              text-align: left;
              position: absolute;
              left:0;
              top:0;
              z-index: 3;
              p{
                margin: 20px 0px 30px 20px;
                font-size: 14px;
                color:#fff;
                &:last-child{
                  margin-top: 10px;
                  font-size: 18px;
                }
              }
            }
          }
          .blue-color{
            background-color: #5482F7;
          }
          .pink-color{
            background-color: #EA6C82;
          }
          .orange-color{
            background-color: #F4B861;
          }
          .green-color{
            background-color: #9CBC61;
          }
          &:last-child{
            margin-right:0;
          }
          >img{
            display: block;
            width:120px;
            height:auto;
            position: absolute;
            right:20px;
            top:0;
            z-index: 2;
          }
          .message-tip{
            width:100%;
            position: absolute;
            left:0;
            top:0;
            z-index: 3;
            padding:0 14px;
            
            p{
              margin: 20px 0px 30px 6px;
              font-size: 14px;
              color:#fff;
            }
            >div{
                width:100%;
                height:50px;
                background: rgba(255,255,255,.1);
                border-radius: 4px;
                >div{
                  width:100%;
                  height:50px;
                  background:rgba(255,217,215,0);
                  border-radius: 50px;
                  padding:6px 15px 0;
                  p{
                    margin:0;
                    width:100%;
                    height:16px;
                    display: flex;
                    justify-content: space-between;
                    span{
                      display: block;
                      font-size: 12px;
                      line-height: 14px;
                    }
                    &:nth-child(1){
                      margin-bottom:7px;
                      span{
                        &:first-child{
                          flex: 1;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                          margin-right:10px;
                        }
                      }
                    }
                    &:nth-child(2){
                      span{
                        &:first-child{
                          flex: 1;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                          margin-right:10px;
                        }
                      }
                    }
                  }
                }
            }
          }
          &:nth-child(2){
            background:linear-gradient(90deg,rgba(243,155,42,1) 0%,rgba(255,180,0,1) 100%);
          }
          &:nth-child(3){
            background:linear-gradient(90deg,rgba(86,171,47,1) 0%,rgba(168,224,99,1) 100%);
          }
        }
      }
    }
    
  .workbench{
  min-height: 500px;
  display: flex;
  // .sidebar{
  //    width: 180px;
  //   height: 200px;
  //   background-color: #ffffff;
  //   padding: 15px;
  //   border-radius: 5px;
  //   box-shadow: 0px 4px 12px 1px rgba(158, 162, 166, 0.2);
  //   top: 50px;
  //   left: 0;
  // }
  .contentInner{
    width: 100%;
    // padding-left: 230px;
  }
  .el-step__title{
    font-size:12px; 
  }
  .anchorItem{
    // height: 550px;
  }
  .el-step__head.is-finish{
    color: #c0c4cc;
    border-color: #c0c4cc;
  }
  .el-step__title.is-finish{
    color: #c0c4cc;
  }
  .content{
    position: relative;
    .custom-form{
      position: absolute;
      right: 20px;
      top: 20px;
      cursor: pointer;
      z-index: 2;
      color: #3175F6;
    }
    .custom-form-dialog{
      position: absolute;
      right: 40px;
      top: 40px;
      z-index: 1000;
      width: 460px;
      height: 470px;
      box-shadow: 0px 2px 4px 0px rgba(181,181,181,0.72);
      border-radius: 2px;
      background-color: #fff;
      .cfd-div{
        margin: 20px 20px;
        p{
          font-size: 16px;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }
        span {
          display: inline-block;
          min-width: 80px;
          height: 24px;
          line-height: 14px;
          border: 1px solid rgba(231,231,231,1);
          margin: 0 9px 8px 0;
          padding: 4px 10px;
          color: #333;
          cursor: pointer;
          font-size: 12px;
          text-align: center;
        }
        div {
          display: flex;
          flex-wrap: wrap;
        }
        .selected{
          background:rgba(15,117,255,1);
          color: #fff;
        }
      }
    }
    .dl-bottom{
      width: 90%;
      margin: 0 auto;
      margin-top: 60px;
      border-top: 1px solid rgba(229,229,229,1);
      position: absolute;
      bottom: 20px;
      margin-left: 5%;
      .dialog-footer{
        text-align: right;
        margin-top: 30px;
      }
    }
  }
  .step_tab{
    height:60px;
    display: flex;
    background-color: #fff;
    margin: 10px 0 0px 0;
    box-shadow:1px 2px 5px #eee;
    border-radius:3px;
    justify-content: space-between;
    align-items: center;
    padding-right:44px;
    border-bottom:1px solid #ecedef;
    .nav{
      display: flex;
      li{
        width:160px;
        text-align: center;
        font-size: 14px;
        color:#666;
        height:58px;
        line-height: 58px;
        border-bottom: 2px solid #fff;
        cursor: pointer;
        &.select_active{
          border-bottom: 2px solid #3175F6;
          color:#3175F6;
          font-weight: bolder;
        }
      }
      .icon-right{
        -webkit-transform: rotate(180deg);
        -moz-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        transform: rotate(180deg);
        line-height: 58px;
        width: 50px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  .pj-search {
    background-color: #fff;
    margin: 10px 0 0 0;
    box-shadow: 1px 2px 5px #eee;
    border-radius: 3px;
    div {
    }
  }
}
</style>
