<template>
  <el-row class="container menuContainerNew">
    <el-col :span="24"
            class="header">
      <el-col :span="10"
              class="logo clearfix"
              :class="collapsed?'logo-collapse-width':'logo-width'">
        <img src="../../assets/logo2.png">
        <img src="../../assets/logo2-small.png">
      </el-col>
      <el-col :span="10"
              style="width:50px"
              class="userinfo">
        <div class="tools"
             @click.prevent="collapse">
          <i class="fa fa-bars"></i>
        </div>
      </el-col>
      <div class=""
           style="margin-left:20px;float: left;height: 50px;display: flex;align-items: center;">
        <Seach />
      </div>
      <div class="head-right">
        <img :src="logoUrl"
             alt=""
             class="logoUrl">
        <div class="companyName">{{companyName}}</div>
        <el-menu :default-active="messageIndex"
                 class="el-menu-demo"
                 mode="horizontal"
                 background-color="#fff"
                 text-color="#333"
                 active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <el-badge :hidden="messageCount <= 0"
                        @click.native="$router.push({name: 'messageManagement'})"
                        :value="messageCount"
                        :max="99"
                        class="item">
                <i class="iconfont icon-crm_xiaoxi-"></i>
              </el-badge>
            </template>
            <el-menu-item v-if="messageList.length"
                          @click.native="toMessageCenter(item)"
                          v-for="(item, index) in messageList"
                          :key="index">
              <span v-if="!item.readed"
                    class="mark"></span>
              <!-- 发版公告 -->
              <div v-if="item.message">
                <div class="title">{{item.message.title}}</div>
                <p>{{item.message.sendTime.replace('T',' ')}}</p>
                <p>{{item.message.overview}}</p>
              </div>
              <!-- 消息、跟进、通知 -->
              <div v-else>
                <div class="title">{{item.messageCenter.title}}</div>
                <p class="text">{{item.messageCenter.sendTime.replace('T',' ')}}</p>
                <p v-html="item.messageCenter.content"
                   class="content text"></p>
                <!-- <p>...</p> -->
              </div>
              <!-- <div>{{item.message.title}}</div> -->
              <!-- <p>{{item.message.sendTime.substring(0, 16).replace('T', ' ')}}</p> -->
              <!-- <p>{{item.message.overview}}</p> -->
            </el-menu-item>
            <el-menu-item v-if="messageList.length">
              <p @click="$router.push({name: 'messageCenter'})">查看更多消息 >></p>
            </el-menu-item>
            <el-menu-item v-if="!messageList.length">
              <p style="color: #656565">暂无更多消息</p>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <el-dropdown :show-timeout="10"
                     placement="bottom"
                     trigger="hover"
                     style="width:50px;height:50px;margin-right:30px;">
          <span class="el-dropdown-link userinfo-inner">
            <img :src="userInfo.facialPhoto"
                 alt="">
          </span>
          <el-dropdown-menu class="home-drop"
                            slot="dropdown">
            <!-- <el-dropdown-item disabled>{{userInfo.name}}</el-dropdown-item> -->
            <el-dropdown-item divided>
              <router-link to="/home/personalCenter">个人中心</router-link>
            </el-dropdown-item>
            <!-- <el-dropdown-item @click.native="showDialog = true">修改密码</el-dropdown-item> -->
            <el-dropdown-item divided
                              @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>
    <el-col :span="24"
            class="main">
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'"
             v-if="hasMenu">
        <!--导航菜单-->
        <el-menu :default-active="defaultActive"
                 id="lastclass"
                 class="el-menu-vertical-demo open"
                 :default-openeds="openeds"
                 @open="handleopen"
                 @close="handleclose"
                 @select="handleselect"
                 :unique-opened="true"
                 :router=false
                 v-show="!collapsed"
                 background-color="#333743"
                 text-color="#777d89"
                 active-text-color="#fff">
          <el-menu-item index="0-0"
                        class="firstItem"
                        @click="routePath(leftMenu[0].children[0])"
                        v-if="leftMenu[0]"><i :class="leftMenu[0].iconCls"></i>{{leftMenu[0].children[0].name}}</el-menu-item>
          <template v-for="(item,index) in leftMenu"
                    v-if="!item.hidden && index>0">
            <el-submenu :class="item.name === '可视化平台' ? 'submenuRight': ''"
                        :index="index+''"
                        v-if="!item.leaf && item.authorities === '000' ? true : hasAuthority(item.authorities)"
                        :key="index">
              <template slot="title">
                <div class="menuRight"
                     @click="menuRoutePath(item)">
                  <i :class="item.iconCls"
                     aria-hidden="true"></i>{{item.name}}
                  <!-- <i v-if="item.name === '可视化平台'" class="el-icon-arrow-right"></i> -->
                </div>
              </template>
              <el-menu-item v-for="(child, cdIndex) in item.children"
                            :index="index + '-' + cdIndex"
                            :key="child.path"
                            @click="routePath(child)"
                            v-if="!child.hidden && child.authorities === '000' ? true : hasAuthority(child.authorities)"><i :class="child.iconCls"
                   aria-hidden="true"></i>{{child.name}}</el-menu-item>
            </el-submenu>
            <el-menu-item v-if="item.leaf&&item.children.length>0"
                          :index="item.children[0].path"
                          :key="index"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
          </template>
        </el-menu>
        <!--导航菜单-折叠后-->
        <ul class="el-menu el-menu-vertical-demo collapsed"
            v-show="collapsed"
            ref="menuCollapsed">
          <li v-for="(item,index) in leftMenu"
              v-if="!item.hidden && hasAuthority(item.authorities)"
              class="el-submenu item"
              :key="index"
              @click="menuRoutePath(item)">
            <template v-if="!item.leaf">
              <div :class="index === collapsedIndex?'el-submenu__title bgColor':'el-submenu__title'"
                   style="padding-left: 20px;"
                   @mouseover="showMenu(index,true)"
                   @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
              <ul class="el-menu submenu"
                  :class="'submenu-hook-'+index"
                  @mouseover="showMenu(index,true)"
                  @mouseout="showMenu(index,false)">
                <li v-for="child in item.children"
                    v-if="!child.hidden && hasAuthority(child.authorities)"
                    :key="child.path"
                    class="el-menu-item"
                    style="padding-left: 40px;"
                    :class="$route.path==child.path?'is-active':''"
                    @click="routePath(child)">{{child.name}}</li>
              </ul>
            </template>
            <template v-else>
          <li class="el-submenu">
            <div class="el-submenu__title el-menu-item"
                 style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;"
                 :class="$route.path==item.children[0].path?'is-active':''"
                 @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
          </li>
</template>
</li>
</ul>
</aside>
<section class="content-container" id="content-container" @scroll="handleScroll" ref="content">
  <div class="grid-content bg-purple-light">
    <el-col :span="24" class="content-wrapper content-wrapper">
      <router-view :scrollTop="scrollTop" @viewScroll="viewScroll" :key="key" v-if="commData" @menuActiveIndex="menuActiveIndex" @getUserInfo="getUserInfo"></router-view>
    </el-col>
  </div>
</section>
</el-col>
<el-dialog title="修改密码"
             :close-on-click-modal = false
             :close-on-press-escape = false
             :visible.sync="showDialog">
  <changePassword  @closeDialog="closeDialog" ref="changepwd" />
  <div slot="footer"
          class="dialog-footer">
    <el-button @click="showDialog = false"
                class="close-button">关 闭</el-button>
    <el-button type="primary"
                @click="confirm('ruleForm')"
                class="defaultbtn dialog-confirmBtn">确 认</el-button>
  </div>
</el-dialog>

<NewsDetails :showDrawer="showDetails"
              :newsId="newsId"
              @drawClose='drawHandleClose'>
</NewsDetails>

</el-row>
</template>

<script>
import service from '@/service'
import changePassword from './components/changePassword'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import * as hub from '@/service/eventHub'
import NewsDetails from '../messageCenter/components/NewsDetails'
import Seach from './components/seach'
import logo from '@/assets/hq.png'
export default {
  name: 'home',
  path: '/',
  components: {
    changePassword,
    Seach,
    NewsDetails
  },
  data () {
    return {
      logoUrl: logo,
      defaultActive: '0-0',
      scrollTop: 0, // 中间内容部分滚动距离
      hasMenu: true,
      collapsed: false,
      showDialog: false,
      input: '',
      tabIndex: 0,
      openeds: ['0'],
      leftMenu: [],
      key: 0,
      commData: false, // 公共数据是否请求完成
      usersData: false, // 公共员工列表是否请求成功
      userInfo: {},
      collapsedIndex: 0,
      messageIndex: '1',
      messageList: [],
      messageCount: 0,
      showDetails: false,
      newsId: null,
      SOCKET: {}
    }
  },
  methods: {
    handleScroll (el) {
      this.scrollTop = this.$refs.content.scrollTop
      // console.log(this.scrollTop)
    },
    viewScroll (val) {
      // console.log('viewScroll  ' + val)
      document.getElementById('content-container').scrollTop = val
    },
    hasAuthority1 (code) {
      return service.user.hasAuthority(code)
    },
    hasAuthority (code) { // 工作台权限代码‘00’特殊处理
      if (code === '00') {
        return true
      } else {
        return service.user.hasAuthority(code)
      }
    },
    closeDialog () {
      this.showDialog = false
    },
    confirm (ruleForm) {
      this.$refs.changepwd.changePwd(ruleForm)
    },
    onSubmit () {
      console.log('submit!')
    },
    menuActiveIndex (index) {
      console.log(index)
      this.defaultActive = index
    },
    menuRoutePath (item) {
      if (item.name === '可视化平台') {
        let origin = window.location.origin
        // window.open(origin + '/dv/#/park?id=10&dataType=NOTCJPNOTP&name=楼宇经济', '_blank')
        window.open(origin + '/dv/#/visualization?id=10&dataType=NOTCJPNOTP&name=楼宇经济', '_blank')
      }
    },
    routePath (child) {
      if (child.name === '物联网管理') {
        this.goThingsManagement()
      } else {
        this.$router.push(child.path)
        this.getcollapsedIndex(child)
      }
    },
    getcollapsedIndex (child) {
      this.leftMenu.forEach((item, index) => {
        item.children.forEach((items, i) => {
          if (items.name === child.name) {
            this.collapsedIndex = index
            this.defaultActive = index + '-' + i
          }
        })
      })
      console.log(this.defaultActive)
    },
    selectNav () {
      // 房源招商动态路由
      let industryPath = '/home/charts'
      // let industryPath = '/home/industryCAD'
      // if (this.hasAuthority('02020204')) {
      //   industryPath = '/home/industryCAD'
      // } else
      if (this.hasAuthority('02020205')) {
        industryPath = '/home/charts'
      } else if (this.hasAuthority('02020201') || this.hasAuthority('02020202') || this.hasAuthority('02020203')) {
        industryPath = '/home/housingList'
      }
      // 客户运营动态路由
      let tenantPath = '/home/tenantInfo'
      if (this.hasAuthority('02030101')) {
        tenantPath = '/home/tenantCAD'
      } else if (this.hasAuthority('02030106')) {
        tenantPath = '/home/tenantOverview'
      } else if (this.hasAuthority('02030102')) {
        tenantPath = '/home/tenantInfo'
      }
      // 费用收缴动态路由
      let financialPath = '/home/financialState'
      if (this.hasAuthority('02030301')) {
        financialPath = '/home/financialState'
      } else if (this.hasAuthority('02030302')) {
        financialPath = '/home/billList'
      } else if (this.hasAuthority('02030323')) {
        financialPath = '/home/flow'
      } else if (this.hasAuthority('02030320')) {
        financialPath = '/home/tenantBills'
      } else if (this.hasAuthority('02030314')) {
        financialPath = '/home/flowBank'
      }
      // 企划活动动态路由
      let projectActivitiesPath = '/home/projectActivities'
      if (this.hasAuthority('02030401')) {
        projectActivitiesPath = '/home/projectActivities'
      } else if (this.hasAuthority('02030402')) {
        projectActivitiesPath = '/home/businessActivities'
      }
      // 多种经营动态路由
      let incomeListPath = '/home/incomeList'
      if (this.hasAuthority('02030501')) {
        incomeListPath = '/home/incomeList'
      } else if (this.hasAuthority('02030510')) {
        incomeListPath = '/home/MultipleContract'
      } else if (this.hasAuthority('02030515')) {
        incomeListPath = '/home/point'
      }
      // 设备设施动态路由
      let devicePath = '/home/deviceCAD'
      if (this.hasAuthority('03040101')) {
        devicePath = '/home/deviceCAD'
      } else if (this.hasAuthority('03040102')) {
        devicePath = '/home/deviceList'
      }
      // 能耗系统动态路由
      let energyPath = '/home/energy'
      if (this.hasAuthority('03010101')) {
        energyPath = '/home/energy'
      } else if (this.hasAuthority('03010102')) {
        energyPath = '/home/energyEquipment'
      }
      // else if (this.hasAuthority('03030102')) {
      //   energyPath = '/home/energyData'
      // }
      // 消防系统
      let firecontrolPath = '/home/firecontrolChart'
      if (this.hasAuthority('03020101')) {
        firecontrolPath = '/home/firecontrolChart'
      } else if (this.hasAuthority('03020102')) {
        firecontrolPath = '/home/firecontrolEquipment'
      }
      // 弱电系统
      let weakPath = '/home/weakCAD'
      if (this.hasAuthority('03030101')) {
        weakPath = '/home/weakCAD'
      } else if (this.hasAuthority('03030102')) {
        weakPath = '/home/weakEquipment'
      }
      // 维护管理
      let patrolPollingPath = '/home/patrolPollingRecord'
      if (this.hasAuthority('03050101')) {
        patrolPollingPath = '/home/patrolPollingRecord'
      } else if (this.hasAuthority('03050106')) {
        patrolPollingPath = '/home/firecontrolChecklist'
      } else if (this.hasAuthority('03050111')) {
        patrolPollingPath = '/home/maintain'
      }
      let patrolPollingAuth = '0305'
      if (this.hasAuthority('0305') && (this.hasAuthority('03050101') || this.hasAuthority('03050106') || this.hasAuthority('03050111'))) {
        patrolPollingAuth = '0305'
      } else {
        patrolPollingAuth = ''
      }
      let selfConfigAuthor = '030801'
      if (this.hasAuthority('030801') && (this.hasAuthority('03080101') || this.hasAuthority('03080106') || this.hasAuthority('03080111') || this.hasAuthority('03080116') || this.hasAuthority('03080121'))) {
        selfConfigAuthor = '030801'
      } else {
        selfConfigAuthor = ''
      }

      // 会员动态路由
      let membershipPath = ''
      if (this.hasAuthority('050101')) {
        membershipPath = '/home/membershipList'
      } else if (this.hasAuthority('050102')) {
        membershipPath = '/home/membershipLevel'
      } else if (this.hasAuthority('050103')) {
        membershipPath = '/home/membershipTag'
      }
      console.log(membershipPath)
      // 项目设计
      let industryPlanningPath = '/home/industryPlanning'
      if (this.hasAuthority('02010301')) {
        industryPlanningPath = '/home/industryPlanning'
      } else if (this.hasAuthority('02010304')) {
        industryPlanningPath = '/home/attractPosition'
      }
      // 品牌信息
      let brandPath = '/home/brandManagement'
      if (this.hasAuthority('050601')) {
        brandPath = '/home/brandManagement'
      } else if (this.hasAuthority('050602')) {
        brandPath = '/home/brandAudit'
      }
      // 小程序设置
      let appSetPath = '/home/AppletSetup'
      if (this.hasAuthority('050801')) {
        appSetPath = '/home/AppletSetup'
      } else if (this.hasAuthority('050802')) {
        appSetPath = '/home/BasicSettings'
      }
      // 工程条件
      let engSpecificationsPath = '/home/engSpecifications'
      if (this.hasAuthority('02010404')) {
        engSpecificationsPath = '/home/engSpecifications'
      } else if (this.hasAuthority('02010405')) {
        engSpecificationsPath = '/home/shopEngineer'
      }
      // 农贸管理
      let goodsmanagement = '/home/farmerGoods'
      if (this.hasAuthority('02050101')) {
        goodsmanagement = '/home/farmerGoods'
      } else if (this.hasAuthority('02050104')) {
        goodsmanagement = '/home/tenantGoods'
      }
      // 流水报表
      let billManagement = '/home/orderBill'
      if (this.hasAuthority('02050201')) {
        billManagement = '/home/orderBill'
      } else if (this.hasAuthority('02050205')) {
        billManagement = '/home/orderBillOnline'
      } else if (this.hasAuthority('02050202')) {
        billManagement = '/home/tradeBill'
      } else if (this.hasAuthority('02050203')) {
        billManagement = '/home/tradeFrom'
      } else if (this.hasAuthority('02050204')) {
        billManagement = '/home/weighingBill'
      }
      // 账号配置
      let accountManage = '/home/accountManage'
      if (this.hasAuthority('01020303')) {
        accountManage = '/home/accountManage'
      } else if (this.hasAuthority('01020304')) {
        accountManage = '/home/teantAccountSet'
      }
      // 客户通知
      let projectNotice = '/home/projectNotice'
      if (this.hasAuthority('02030601')) {
        projectNotice = '/home/projectNotice'
      } else if (this.hasAuthority('02030604')) {
        projectNotice = '/home/activityNotice'
      }
      // 库存管理
      let stockPath = '/home/InventoryQuery'
      if (this.hasAuthority('02050301')) {
        stockPath = '/home/InventoryQuery'
      } else if (this.hasAuthority('02050302')) {
        stockPath = '/home/WarehouseDetails'
      }
      // 溯源管理
      let traceabilityPath = '/home/warehousing'
      if (this.hasAuthority('02050405')) {
        traceabilityPath = '/home/warehousing'
      } else if (this.hasAuthority('02050406')) {
        traceabilityPath = '/home/sellData'
      } else if (this.hasAuthority('02050407')) {
        traceabilityPath = '/home/traceabilitySet'
      } else if (this.hasAuthority('02050404')) {
        traceabilityPath = '/home/SupplierManagement'
      }
      // 配送管理
      let distributionPath = '/home/foodMarket'
      if (this.hasAuthority('02050701')) {
        distributionPath = '/home/foodMarket'
      } else if (this.hasAuthority('02050705')) {
        distributionPath = '/home/deliveryman'
      }
      // 营销管理
      let marketingManagementPath = '/home/specialActivity'
      if (this.hasAuthority('02050801')) {
        marketingManagementPath = '/home/specialActivity'
      } else if (this.hasAuthority('02050805')) {
        marketingManagementPath = '/home/useRecord'
      }
      this.leftMenu = [
        {
          name: '工作台',
          path: '/home',
          authorities: '00',
          iconCls: 'iconfont icon-gongzuotai',
          children: [
            { path: '/home/workbench', authorities: '00', iconCls: 'iconfont icon-gongzuotai', name: '工作台' }
          ]
        }, {
          name: '项目管理',
          path: '/home',
          authorities: '0201',
          iconCls: 'iconfont icon-xiangmuguanli',
          children: [
            { path: '/home/projectList', authorities: '020101', iconCls: '', name: '项目信息' },
            { path: industryPlanningPath, authorities: '020103', iconCls: '', name: '项目设计' },
            { path: '/home/planDesign', authorities: '020102', iconCls: '', name: '平面图编辑' },
            { path: engSpecificationsPath, authorities: '020104', iconCls: '', name: '工程条件' },
            { path: '/home/revenueForecast', authorities: '020601', iconCls: '', name: '资产评估' }
          ]
        }, {
          name: '招商管理',
          path: '/home',
          authorities: '0202',
          iconCls: 'iconfont icon-zhaoshangguanli',
          children: [
            { path: '/home/formatPlan', authorities: '020201', iconCls: '', name: '招商指导图' },
            { path: industryPath, authorities: '020202', iconCls: '', name: '房源招租' },
            { path: '/home/potlClients', authorities: '020204', iconCls: '', name: '意向客户' },
            { path: '/home/govContractsList', authorities: '020205', iconCls: '', name: '合同列表' },
            { path: '/home/contractCalculator', authorities: '020206', iconCls: '', name: '合同金额计算器' }
          ]
        }, {
          name: '运营管理',
          path: '/home',
          authorities: '0203',
          iconCls: 'iconfont icon-yunyingguanli',
          children: [
            { path: tenantPath, authorities: '020301', iconCls: '', name: '客户管理' },
            { path: financialPath, authorities: '020303', iconCls: '', name: '费用收缴' },
            { path: '/home/repairManagement', authorities: '02030203', iconCls: '', name: '报修信息' },
            { path: projectActivitiesPath, authorities: '020304', iconCls: '', name: '企划活动' },
            { path: incomeListPath, authorities: '020305', iconCls: '', name: '多种经营' },
            { path: '/home/projectNotice', authorities: '020306', iconCls: '', name: '客户通知' }
          ]
        }, {
          name: '物业管理',
          path: '/home',
          authorities: '03',
          iconCls: 'iconfont icon-wuyeguanli',
          children: [
            { path: energyPath, authorities: '0301', iconCls: '', name: '能耗系统' },
            { path: firecontrolPath, authorities: '0302', iconCls: '', name: '消防系统' },
            { path: weakPath, authorities: '0303', iconCls: '', name: '弱电系统' },
            // { path: '/home/emergency', authorities: '0302', iconCls: '', name: '应急事项' },
            { path: devicePath, authorities: '0304', iconCls: '', name: '设施设备' },
            { path: '/home/selfControlManagement', authorities: selfConfigAuthor, iconCls: '', name: '自控管理' },
            { path: patrolPollingPath, authorities: patrolPollingAuth, iconCls: '', name: '维护管理' }, // 0305 巡更巡检03050101 消防检查03050106 保养列表03050111
            { path: '/home/repairManagement1', authorities: '0306', iconCls: '', name: '维修管理' },
            { path: '/home/security', authorities: '0307', iconCls: '', name: '保安保洁' },
            { path: '', authorities: '04', iconCls: '', name: '物联网管理' }
          ]
        }, {
          name: '人事管理',
          path: '/home',
          authorities: '0101',
          iconCls: 'iconfont icon-renshiguanli',
          children: [
            { path: '/home/organizationManage', authorities: '010101', iconCls: '', name: '组织架构' },
            { path: '/home/postManage', authorities: '010102', iconCls: '', name: '岗位职责' },
            { path: '/home/staffManage', authorities: '010103', iconCls: '', name: '员工档案' }
          ]
        }, {
          name: '农贸管理',
          path: '/home',
          authorities: '0205',
          iconCls: 'iconfont icon-cms_nongmaoshichang',
          children: [
            { path: goodsmanagement, authorities: '020501', iconCls: '', name: '商品管理' },
            { path: billManagement, authorities: '020502', iconCls: '', name: '流水报表' },
            { path: stockPath, authorities: '020503', iconCls: '', name: '库存管理' },
            // { path: '/home/SupplierManagement', authorities: '020504', iconCls: '', name: '供应商管理' },
            { path: traceabilityPath, authorities: '020504', iconCls: '', name: '溯源管理' },
            { path: '/home/foodSafeTest', authorities: '020506', iconCls: '', name: '食安检测' },
            { path: '/home/visualSet', authorities: '020505', iconCls: '', name: '可视化配置' },
            { path: distributionPath, authorities: '020507', iconCls: '', name: '菜场管理' },
            { path: marketingManagementPath, authorities: '020508', iconCls: '', name: '营销管理' }
          ]
        }, {
          name: 'O2O管理',
          path: '/home',
          authorities: '06',
          iconCls: 'iconfont icon-ooguanli',
          children: [
            { path: '/home/shopList', authorities: '060101', iconCls: '', name: '店铺信息' },
            { path: '/home/commodityList', authorities: '060201', iconCls: '', name: '商品信息' },
            { path: '/home/orderList', authorities: '060301', iconCls: '', name: '订单信息' },
            { path: '/home/DiliverymanList', authorities: '060401', iconCls: '', name: '配送员信息' }
          ]
        }, {
          name: 'CRM管理',
          path: '/home',
          authorities: '05',
          iconCls: 'iconfont icon-CRMguanli',
          children: [
            { path: '/home/clubCardSet', authorities: '0501', iconCls: '', name: '会员卡管理' },
            { path: '/home/integralRule', authorities: '0502', iconCls: '', name: '积分规则管理' },
            { path: '/home/memberInfo', authorities: '0503', iconCls: '', name: '会员信息' },
            { path: '/home/integralAudit', authorities: '0504', iconCls: '', name: '积分审核' },
            { path: '/home/floorManagement', authorities: '0505', iconCls: '', name: '楼层管理' },
            { path: brandPath, authorities: '0506', iconCls: '', name: '品牌管理' },
            { path: '/home/coupon', authorities: '0507', iconCls: '', name: '优惠券审核' },
            { path: appSetPath, authorities: '0508', iconCls: '', name: '小程序设置' }
          ]
        }, {
          name: '可视化平台',
          path: '/home',
          authorities: '0701',
          iconCls: 'iconfont icon-keshihuapingtai',
          children: []
        }, {
          name: '商业决策系统',
          path: '/home',
          authorities: '0802',
          iconCls: 'iconfont icon-shangyejuecexitong',
          children: [
            { path: '/home/brandLibrary', authorities: '080201', iconCls: '', name: '品牌库' },
            { path: '/home/projectLibrary', authorities: '080202', iconCls: '', name: '项目库' }
          ]
        }, {
          name: '系统配置',
          path: '/home',
          authorities: '0102',
          iconCls: 'iconfont icon-xitongpeizhi',
          children: [
            { path: '/home/applist', authorities: '010201', iconCls: '', name: '应用商店' },
            { path: '/home/roleManage', authorities: '010202', iconCls: '', name: '角色配置' },
            { path: accountManage, authorities: '010203', iconCls: '', name: '账号配置' },
            { path: '/home/parameter', authorities: '010204', iconCls: '', name: '参数配置' },
            { path: '/home/jobOrder', authorities: '010206', iconCls: '', name: '通知单配置' },
            { path: '/home/approvalProcessManagement', authorities: '010205', iconCls: '', name: '审批流程配置' },
            { path: '/home/contractAllocation', authorities: '010207', iconCls: '', name: '项目设置' },
            { path: '/home/operationalAudit', authorities: '010208', iconCls: '', name: '操作审计' },
            { path: '/home/messageManagement', authorities: '000', iconCls: '', name: '发版公告' }
          ]
        }
      ]
      if (window.location.href.includes('192.168') || window.location.href.includes('localhost')) {
        let API = {
          name: 'API',
          path: '/home',
          authorities: '00',
          iconCls: 'iconfont icon-keshihuapingtai',
          children: [
            { path: '/home/docs', authorities: '00', iconCls: '', name: 'DOCS' }
          ]
        }
        this.leftMenu.push(API)
      }
      this.hasMenu = true
      let router = this.hasAuthMenu(this.leftMenu)
      this.$router.push({ path: router })
    },
    hasAuthMenu (leftMenu) {
      let menu = leftMenu
      let router
      for (let i = 0; i < menu.length; i++) {
        if (this.hasAuthority(menu[i].authorities)) {
          for (let j = 0; j < menu[i].children.length; j++) {
            if (this.hasAuthority(menu[i].children[j].authorities)) {
              router = menu[i].children[j].path
              return router
            }
          }
        }
      }
      return router
    },
    handleopen () {
    },
    handleclose () {
      // console.log('handleclose');
    },
    handleselect: function (a, b) {
    },
    // 退出登录
    logout: function () {
      var _this = this
      this.$confirm('确认退出吗?', '提示', {
        // type: 'warning'
      }).then(() => {
        _this.SOCKET.disconnect()
        service.user.logout()
        _this.$router.push('/login')
      }).catch(() => {
      })
    },
    // 折叠导航栏
    collapse: function () {
      this.collapsed = !this.collapsed
      var uiwidth = document.getElementById('lastclass')
      if (uiwidth.offsetWidth === 0) {
        uiwidth.style.width = '230px'
      }
    },
    showMenu (i, status) {
      this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none'
    },
    async getUserInfo () {
      let result = await service.http.get('uaa/api/account/user')
      this.userInfo = result.data
      this.userInfo.facialPhoto = this.userInfo.facialPhoto ? this.userInfo.facialPhoto : require('../../assets/person-default.png')
      // this.userInfo.facialPhoto = this.userInfo.facialPhoto ? this.userInfo.facialPhoto : 'http://dev-img.yunwutech.com/null/file/zCZzAHUzLOQNOFPg8cUm'
      this.$store.dispatch('staffInfoAction', this.userInfo) // store储存用户信息
    },
    promiseAll () {
      var a = new Promise(function (resolve, reject) {
        service.http.get('cms/api/project-managements', { page: 0, size: 100, sort: 'desc', useStatus: 'USING' }).then((response) => {

        })
      })
      var all = Promise.all([a, b])
      all.then(function (val) {
        console.log(val)
      })// 结果:['aaa','bbb']
    },
    goThingsManagement () {
      let user = JSON.parse(window.sessionStorage.getItem('user'))
      service.http.post('/tmg/rest/account/login', { 'account': user.xfUserName, 'password': user.xfPassword }).then(res => {
        let data = res.data
        if (res.data.ret.success === true) {
          // //#endregionvar func = data.func
          var account = data.args.account
          // var message = data.ret.message
          // var name = data.ret.value.name
          // var role = data.ret.value.role
          // var expires = data.ret.value.expires
          sessionStorage.removeItem('indexeuid')
          let loginUser = data.ret.value
          loginUser['account'] = account /**/
          sessionStorage.setItem('account', account)
          service.local.setCookie('loginUser', JSON.stringify(loginUser))
          /* document.cookie='loginUser'+'='+JSON.stringify(loginUser) */
          sessionStorage.setItem('isLogin', JSON.stringify(loginUser))
          // window.location.href = '/FirePM/html/home.html'
          let origin = window.location.origin
          window.open(origin + '/tmg/FirePM/html/home.html', '_blank')
        }
      })
    },
    getDataAuthorityOptions () { // 统一请求项目列表
      service.http.get('cms/api/project-managements', { page: 0, size: 100, sort: 'desc', useStatus: 'USING' }).then(res => {
        this.commData = true // 数据请求完成
        this.$store.dispatch('projectManagementsAction', res.data)
        this.initSocket()
      })
    },
    async getUserList () { // 统一请求员工列表
      let result = await service.http.get('uaa/api/users/all/allStatus', { page: 0, size: 20000 })
      this.usersData = true
      this.$store.dispatch('usersAction', result.data)
      // this.uesrName = result.data
    },
    async industry () { // 统一请求行业列表
      let result = await service.http.get('/uaa/api/paramet-managements/name?name=行业')
      this.$store.dispatch('industryAction', result.data)
    },
    async getProjectList () {
      let result = await service.http.get('uaa/api/paramet-managements/name?name=工程条件')
      this.$store.dispatch('projectAction', result.data)
    },
    drawHandleClose () {
      this.showDetails = false
      hub.eventHub.$emit('messageCome')
    },
    toMessageCenter (item) {
      if (item.message) { // 发版公告
        if (this.$route.name === 'messageManagement') {
          hub.eventHub.$emit('handleEdit', item.id)
        } else {
          this.$router.push({ name: 'messageManagement', query: { id: item.id } })
        }
      } else { // 消息、跟进、通知
        if (this.$route.name === 'messageCenter') {
          let obj = { messageCenterType: item.messageCenter.messageCenterType, id: item.messageCenter.id }
          hub.eventHub.$emit('messageCenter_messageCome', obj)
        } else {
          this.$router.push({ name: 'messageCenter', query: { messageCenterType: item.messageCenter.messageCenterType, id: item.messageCenter.id } })
        }
      }
    },
    getMessage () {
      // service.http.get('/mps/api/messageUsers?sort=message.sendTime,desc&sort=createdDate,desc', { page: 0, size: 3 }).then(res => {
      service.http.get('/mps/api/messageUsers/new?sort=message.sendTime,desc&sort=createdDate,desc').then(res => {
        this.messageList = res.data
        this.messageCount = res.headers['noreadedcount']
      })
    },
    openMessageDetail (v) {
      this.newsId = v
      this.showDetails = true
    },
    initSocket () {
      let token
      if (sessionStorage.getItem('token')) token = JSON.parse(sessionStorage.getItem('token'))['access_token']
      let tenantKey = localStorage.getItem('tenantKey')
      this.SOCKET = new this.$Socket({}, tenantKey, token)
      this.SOCKET.connect()
    }
  },
  computed: {
    companyName () {
      return service.local.get('companyName')
    }
  },
  created () {
    hub.eventHub.$on('openMessageDetail', (v) => {
      this.openMessageDetail(v)
    })
    hub.eventHub.$on('initSocket', () => {
      this.initSocket()
    })
    hub.eventHub.$on('getMessage', () => {
      this.getMessage()
    })
    this.getMessage()
    this.getDataAuthorityOptions()
    // this.getUserList()
    this.industry()
    this.getProjectList()
  },
  mounted () {
    this.getUserInfo()
    // this.tabIndex = Number(localStorage.navId)
    // this.selectNav(Number(localStorage.navId), 'reload')
    // if (this.$route.path === '/home/workbench') {
    //   this.hasMenu = false
    // }
    this.selectNav()
  }
}
</script>
<style lang="scss">
.messageNotify {
  z-index: 1998 !important;
  cursor: pointer;
  .el-icon-info {
    color: #feb728 !important;
  }
}
.home-drop {
  .is-disabled {
    color: #606266 !important;
  }
  .el-dropdown-menu__item {
    text-align: center;
  }
}
.menuContainerNew.container {
  .el-menu {
    .submenuRight {
      > .el-submenu__title {
        > .el-submenu__icon-arrow {
          display: none;
        }
        // >.menuRight{
        //   position: relative;
        //   >.el-icon-arrow-right{
        //     position: absolute;
        //     top: 50%;
        //     right: 0px;
        //     margin-top: -9px;
        //   }
        // }
      }
    }
    .item {
      > .el-submenu__title {
      }
      > .bgColor {
        background: #283558 !important;
      }
    }
  }
}
.el-menu--horizontal {
  .el-menu-item {
    height: auto !important;
    padding: 15px 20px 5px !important;
    position: relative;
    border-bottom: 1px solid #f6f6f6;
    span {
      &.mark {
        position: absolute;
        left: 8px;
        top: 20px;
        width: 7px;
        height: 7px;
        background: #eb605b;
        border-radius: 50%;
      }
    }
    div,
    p {
      width: 350px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;
    }
    > div {
      div {
        color: #333333;
        font-size: 14px;
        font-weight: bolder;
        line-height: 16px;
        margin-bottom: 7px;
      }
      p {
        &.text {
          font-size: 12px;
          line-height: 16px;
          color: #656565;
          margin-bottom: 7px;
        }
        &.content {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          height: 32px;
        }
      }
    }
  }
  .el-menu-item:last-child {
    border-top: 1px solid #f5f5f5;
    p {
      text-align: center;
      color: #3575f6;
    }
  }
  .el-menu-item:hover {
    background: #f8f9fa !important;
  }
  .el-menu-item:last-child:hover {
    background: none !important;
  }
}
.head-right {
  .el-menu {
    border: 0;
    margin-right: 10px;

    .el-submenu .el-submenu__title {
      height: 50px;
      line-height: 50px;
      border: none;
      padding: 0;
      background: #4767c7 !important;
      .el-icon-arrow-down {
        display: none;
      }
      .el-badge {
        display: block;
        width: 100px;
        height: 50px;
        margin: 0 auto;
        text-align: center;
        color: #fff;
        .el-badge__content {
          background: #eb605b;
        }
        .el-badge__content.is-fixed {
          border: 0;
          top: 15px;
          right: 50px;
        }
        i {
          margin: 0;
          font-size: 24px !important;
        }
        .el-icon-bell {
          margin-right: 0;
        }
      }
    }
    .is-active .el-submenu__title {
      border: none !important;
    }
    .el-submenu__title:hover {
      background: #2b4aa7 !important;
    }
  }
}
</style>
<style lang="scss" scoped>
$color-primary: #4767c7; // #18c79c
.menuContainerNew.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  .head-right {
    float: right;
    display: flex;
    align-items: center;
    color: #fff;
    .companyName {
      margin-right: 20px;
      font-size: 20px;
      font-weight: bold;
    }
    .logoUrl {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
  }
  .icon-bsgl {
    background: url(../../assets/admin.png) no-repeat;
    background-size: contain;
  }
  .icon-project {
    background: url(../../assets/project-manage.png) no-repeat;
    background-size: contain;
  }
  .icon-zuke {
    background: url(../../assets/zidianguanli.png) no-repeat;
    background-size: contain;
  }
  .icon-htong {
    background: url(../../assets/icon-project.png) no-repeat;
    background-size: contain;
  }
  .icon-caiwu {
    background: url(../../assets/caiwu.png) no-repeat;
    background-size: contain;
  }
  .icon-app {
    background: url(../../assets/personnel.png) no-repeat;
    background-size: contain;
  }
  .icon-system {
    background: url(../../assets/personnel.png) no-repeat;
    background-size: contain;
  }
  .el-menu-item {
    height: 40px;
    line-height: 40px;
    background-color: #333e5f !important;
    color: #ebebeb !important;
    font-size: 12px;
    padding-left: 51px !important;
  }
  .el-menu-item.is-active {
    background-color: #364a78 !important;
    color: #fff !important;
    font-weight: bolder;
  }
  .el-menu-item:hover {
    background-color: #364a78 !important;
  }
  .firstItem {
    height: 56px;
    line-height: 56px;
    font-size: 14px;
    padding-left: 20px !important;
    i.iconfont {
      font-size: 20px !important;
      color: #ebebeb !important;
      margin-right: 10px;
    }
  }
  .firstItem.is-active {
    i.iconfont {
      font-weight: lighter;
    }
  }
  > .header {
    height: 50px;
    // line-height: 50px;
    background: $color-primary;
    .cams-title {
      float: left;
      line-height: 20px;
      font-size: 14px;
      margin-left: 15px;
      p:first-child {
        margin-top: 5px;
        font-size: 16px;
      }
      p:last-child {
        font-size: 12px;
      }
    }
    .userinfo {
      // margin-left: 40px;
    }
    .userinfo-inner {
      cursor: pointer;
      color: #fff;
      img {
        width: 36px;
        height: 36px;
        border-radius: 36px;
        margin: 7px 0px 0px 0px;
        object-fit: cover;
      }
      span {
        vertical-align: top;
      }
    }
    .logo {
      //width:230px;
      height: 50px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      img {
        width: 137px;
        float: left;
        margin: 9px 0 0 18px;
        display: block;
        &:nth-child(2) {
          display: none;
        }
      }
      .txt {
        color: #fff;
      }
    }
    .logo-width {
      width: 230px;
      background-color: #3f5fbf;
    }
    .logo-collapse-width {
      width: 60px;
      background-color: #3f5fbf;
      img {
        margin: 10px 0 0 0;
      }
    }
    .logo-collapse-width.logo {
      padding-left: 15px;
      img {
        width: 25px;
        display: block;
        &:nth-child(1) {
          display: none;
        }
      }
    }
    .tools {
      padding: 0px;
      width: 14px;
      height: 50px;
      line-height: 53px;
      cursor: pointer;
      i {
        margin-left: 20px;
        display: inline-block;
        width: 20px;
        height: 15px;
        background: url(../../assets/bars.png) no-repeat;
        background-size: contain;
      }
    }
  }
  .el-dropdown-link {
    font-size: 12px;
    width: 50px;
    height: 50px;
    display: block;
    text-align: center;
    i {
      text-align: center;
    }
    .icon-news {
      width: 24px;
      height: 30px;
      background: url(../../assets/news.png) no-repeat;
      background-size: contain;
    }
    margin-right: 20px;
  }

  .main {
    display: flex;
    // background: #324057;
    position: absolute;
    top: 50px;
    bottom: 0px;
    // overflow: hidden;

    aside {
      flex: 0 0 230px;
      width: 230px;
      // position: absolute;
      // top: 0px;
      // bottom: 0px;
      .el-menu {
        height: 100%;
        background-color: #333e5f !important;
      }
      .open {
        -moz-box-shadow: 2px 0px 0 #e5e5e5;
        -webkit-box-shadow: 2px 0px 0 #e5e5e5;
        box-shadow: 2px 0px 0 #e5e5e5;
      }
      .collapsed {
        background-color: #333743;
        // width:60px;
        .item {
          position: relative;
        }
        .submenu {
          position: absolute;
          top: 0px;
          left: 59px;
          z-index: 99999;
          height: auto;
          display: none;
          box-shadow: 0px 2px 4px 0px rgba(90, 90, 90, 0.35);
          border-radius: 2px;
          .el-menu-item {
            background-color: #fff !important;
            color: #333 !important;
          }
          .el-menu-item:hover {
            color: #3575f6 !important;
          }
          .is-active {
            background-color: #f1fbff !important;
            color: #3575f6 !important;
          }
        }
      }
    }
    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }
    .menu-expanded {
      flex: 0 0 230px;
      width: 230px;
      height: 100%;
      overflow-x: hidden;
      > .el-menu {
        height: 100%;
        overflow-y: auto !important;
        border-right: 0;
      }
      > .el-menu::-webkit-scrollbar {
        width: 4px !important;
        height: 4px !important;
      }
      > .el-menu::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px #fff;
        background-color: #fff;
      }
      > .el-menu::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 6px #3f51b5;
      }
    }

    .content-container {
      background: #f9f9f9;
      flex: 1;
      // position: absolute;
      // right: 0px;
      // top: 0px;
      // bottom: 0px;
      // left: 230px;
      overflow-y: scroll;
      padding: 12px 20px 20px;
      overflow-x: hidden;
      .breadcrumb-container {
        //margin-bottom: 15px;
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner {
          float: right;
        }
      }
      .content-wrapper {
        box-sizing: border-box;
      }
    }
  }
  .el-dialog {
    width: 624px;
  }
  .el-form-item__content {
    .el-input {
      font-size: 12px;
    }
  }
  .el-dialog__header {
    padding-left: 0;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-input-group__append,
  .el-input-group__prepend {
    background-color: #fff;
  }
  .verificationCode {
    margin-left: 3%;
  }
  .navSelected {
    background-color: #435fb2;
    height: 30px;
    line-height: 30px;
    border-radius: 4px;
  }
}
</style>
