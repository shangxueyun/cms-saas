<template>
  <el-row class="container menuContainer">
    <el-col :span="24"
            class="header">
      <el-col :span="10"
              class="logo clearfix"
              :class="collapsed?'logo-collapse-width':'logo-width'">
        <img src="../../assets/n-logo.png">
        <!-- <div class="cams-title">
          <p>小象商管</p>
          <p>ecams.pro</p>
        </div> -->
        <div class="tools"
             @click.prevent="collapse">
          <i class="fa fa-bars"></i>
        </div>
      </el-col>
      <el-col :span="16"
              class="userinfo">
        <span class="el-dropdown-link userinfo-inner"
              v-for="(item, index) in navigationBar"
              :key="index"
              v-if="hasAuthority(item.authorities)"
              @click="selectNav(index)"
              :class="{navSelected: index === tabIndex}">
          {{item.value}}
        </span>
      </el-col>
      <el-dropdown trigger="hover"
                   style="float: right">
        <span class="el-dropdown-link userinfo-inner">
          <i class="fa fa-user-circle-o"
             aria-hidden="true"></i>
          <span>{{userInfo.name}}</span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/home/personalCenter">个人中心</router-link>
          </el-dropdown-item>
          <el-dropdown-item @click.native="showDialog = true">修改密码</el-dropdown-item>
          <el-dropdown-item divided
                            @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
                 :unique-opened="false"
                 :router=false
                 v-show="!collapsed"
                 background-color="#333743"
                 text-color="#777d89"
                 active-text-color="#fff">
          <template v-for="(item,index) in leftMenu"
                    v-if="!item.hidden">
            <el-submenu :index="index+''"
                        v-if="!item.leaf && hasAuthority(item.authorities)"
                        :key="index">
              <template slot="title"><i :class="item.iconCls"
                   aria-hidden="true"></i>{{item.name}}</template>
              <el-menu-item v-for="(child, cdIndex) in item.children"
                            :index="index + '-' + cdIndex"
                            :key="child.path"
                            @click="$router.push(child.path)"
                            v-if="!child.hidden && hasAuthority(child.authorities)">{{child.name}}</el-menu-item>
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
              :key="index">
            <template v-if="!item.leaf">
              <div class="el-submenu__title"
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
                    @click="$router.push(child.path)">{{child.name}}</li>
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
      <router-view :scrollTop="scrollTop" @viewScroll="viewScroll" :key="key" v-if="commData && usersData" @menuActiveIndex="menuActiveIndex"></router-view>
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
</el-row>
</template>

<script>
import service from '@/service'
import changePassword from './components/changePassword'
export default {
  name: 'home',
  path: '/',
  components: {
    changePassword
  },
  data () {
    return {
      defaultActive: '0-0',
      scrollTop: 0, // 中间内容部分滚动距离
      hasMenu: true,
      collapsed: false,
      userInfo: {},
      showDialog: false,
      input: '',
      tabIndex: 0,
      openeds: ['0'],
      navigationBar: [{ value: '首页', index: 0, authorities: '00' },
      { value: '企业内部管理', index: '', authorities: '01' },
      { value: '商业管理', index: '', authorities: '02' },
      { value: '物业管理', index: '', authorities: '03' },
      { value: '物联网管理', index: '', authorities: '04' },
      { value: 'O2O管理', index: '', authorities: '06' },
      { value: 'CRM管理', index: '', authorities: '05' },
      { value: '可视化平台', index: '', authorities: '07' },
      { value: '商业决策系统', index: '', authorities: '08' }
      ],
      leftMenu: [],
      key: 0,
      commData: false, // 公共数据是否请求完成
      usersData: false // 公共员工列表是否请求成功
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
      this.tabIndex = 2
      this.hasMenu = true
      this.defaultActive = index
      this.businessManagement()
    },
    selectNav (index, type) {
      this.defaultActive = '0-0'
      this.tabIndex = index
      if (index === 0) {
        this.key = Math.random() * 1000
        this.$router.push({ name: 'workbench' })
        this.leftMenu = []
        this.hasMenu = false
      }
      if (index === 1) {
        this.leftMenu = [{
          name: '人事管理',
          path: '/home',
          authorities: '0101',
          iconCls: 'icon icon-app',
          children: [
            { path: '/home/organizationManage', authorities: '010101', iconCls: '', name: '组织架构' },
            { path: '/home/postChart', authorities: '010102', iconCls: '', name: '岗位信息' },
            { path: '/home/staffManage', authorities: '010103', iconCls: '', name: '员工档案' }
          ]
        }, {
          name: '管理员管理',
          path: '/home',
          authorities: '0102',
          iconCls: 'icon icon-bsgl',
          children: [
            { path: '/home/applist', authorities: '010201', iconCls: '', name: 'APPS库' },
            { path: '/home/roleManage', authorities: '010202', iconCls: '', name: '角色管理' },
            { path: '/home/accountManage', authorities: '010203', iconCls: '', name: '账号管理' },
            { path: '/home/parameter', authorities: '010204', iconCls: '', name: '参数管理' },
            { path: '/home/jobOrder', authorities: '010206', iconCls: '', name: '通知单管理' },
            { path: '/home/approvalProcessManagement', authorities: '010205', iconCls: '', name: '审批流程管理' }
          ]
        }]
        this.hasMenu = true
        let router = this.hasAuthMenu(this.leftMenu)
        if (type !== 'reload') {
          this.$router.push({ path: router })
        }
      }
      if (index === 2) {
        this.businessManagement()
        let router = this.hasAuthMenu(this.leftMenu)
        this.$router.push({ path: router })
      }
      if (index === 3) {
        let deviceCADPath = '/home/deviceCAD'
        if (this.hasAuthority('03010103')) {
          deviceCADPath = '/home/deviceCAD'
        } else if (
          this.hasAuthority('03010101') ||
          this.hasAuthority('03010102') ||
          this.hasAuthority('03010103') ||
          this.hasAuthority('03010105') ||
          this.hasAuthority('03010106') ||
          this.hasAuthority('03010107') ||
          this.hasAuthority('03010108') ||
          this.hasAuthority('03010109')
        ) {
          deviceCADPath = '/home/deviceList'
        } else if (
          this.hasAuthority('03010110')
        ) {
          deviceCADPath = '/home/repairManagement1'
        } else if (this.hasAuthority('03010114')) {
          deviceCADPath = '/home/maintain'
        } else if (
          this.hasAuthority('03010118')
        ) {
          deviceCADPath = '/home/deviceRepair'
        }
        let energyPath = '/home/energy'
        if (this.hasAuthority('03030101')) {
          energyPath = '/home/energy'
        } else if (this.hasAuthority('03030102')) {
          energyPath = '/home/energyData'
        } else if (this.hasAuthority('03030106')) {
          energyPath = '/home/energyEquipment'
        }
        // 消防
        let firecontrolPath = ''
        if (this.hasAuthority('03050101')) {
          firecontrolPath = '/home/firecontrolChart'
        } else if (this.hasAuthority('03050102')) {
          firecontrolPath = '/home/firecontrolEquipment'
        } else if (this.hasAuthority('03050103')) {
          firecontrolPath = '/home/firecontrolTest'
        } else if (this.hasAuthority('03050106')) {
          firecontrolPath = '/home/firecontrolChecklist'
        }
        this.leftMenu = [{
          name: '设备设施',
          path: '/home',
          authorities: '030101',
          iconCls: 'icon icon-project',
          children: [
            { path: deviceCADPath, authorities: '030101', iconCls: '', name: '设备设施' }
            // { path: '/home/emergency', authorities: '030201', iconCls: '', name: '应急事项' }
          ]
        },
        {
          name: '保安保洁',
          path: '/home',
          authorities: '0304',
          iconCls: 'icon icon-project',
          children: [
            { path: '/home/security', authorities: '030401', iconCls: '', name: '保安保洁' }
          ]
        },
        {
          name: '能耗系统',
          path: '/home',
          authorities: '0303',
          iconCls: 'icon icon-project',
          children: [
            { path: energyPath, authorities: '030301', iconCls: '', name: '能耗系统' }
          ]
        },
        {
          name: '消防系统',
          path: '/home',
          authorities: '0305',
          iconCls: 'icon icon-project',
          children: [
            { path: firecontrolPath, authorities: '030501', iconCls: '', name: '消防系统' }
          ]
        },
        {
          name: '应急事项',
          path: '/home',
          authorities: '0302',
          iconCls: 'icon icon-project',
          children: [
            { path: '/home/emergency', authorities: '030201', iconCls: '', name: '应急事项' }
          ]
        }
          // {
          //   name: '报修管理',
          //   path: '/home',
          //   authorities: '00',
          //   iconCls: 'icon icon-zuke',
          //   children: [
          //   { path: '/home/deviceRepair', authorities: '00', iconCls: '', name: '报修管理' }
          //   ]
          // }
        ]
        this.hasMenu = true
        let router = this.hasAuthMenu(this.leftMenu)
        this.$router.push({ path: router })
      }
      if (index === 4) {
        this.goThingsManagement()
      }
      if (index === 5) {
        this.leftMenu = [
          {
            name: '商户管理',
            path: '/home',
            authorities: '0601',
            iconCls: 'icon icon-project',
            children: [
              { path: '/home/shopList', authorities: '060101', iconCls: '', name: '店铺列表' }
            ]
          },
          {
            name: '商品管理',
            path: '/home',
            authorities: '0602',
            iconCls: 'icon icon-zuke',
            children: [
              { path: '/home/commodityList', authorities: '060201', iconCls: '', name: '商品列表' }
            ]
          },
          {
            name: '订单管理',
            path: '/home',
            authorities: '0603',
            iconCls: 'icon icon-htong',
            children: [
              { path: '/home/orderList', authorities: '060301', iconCls: '', name: '订单列表' }
            ]
          },
          {
            name: '配送员管理',
            path: '/home',
            authorities: '0604',
            iconCls: 'icon icon-caiwu',
            children: [
              { path: '/home/DiliverymanList', authorities: '060401', iconCls: '', name: '配送员列表' }
            ]
          }
        ]
        this.hasMenu = true
        let router = this.hasAuthMenu(this.leftMenu)
        this.$router.push({ path: router })
      }
      if (index === 6) {
        this.leftMenu = [{
          name: '会员管理',
          path: '/home',
          authorities: '0501',
          iconCls: 'icon icon-project',
          children: [
            { path: '/home/membershipList', authorities: '050101', iconCls: '', name: '会员列表' },
            { path: '/home/membershipLevel', authorities: '050102', iconCls: '', name: '会员等级' },
            { path: '/home/membershipTag', authorities: '050103', iconCls: '', name: '会员标签' }
          ]
        }, {
          name: '服务管理',
          path: '/home',
          authorities: '0502',
          iconCls: 'icon icon-zuke',
          children: [
            { path: '/home/serviceManagement', authorities: '050201', iconCls: '', name: '服务管理' }
          ]
        }, {
          name: '营销管理',
          path: '/home',
          authorities: '0503',
          iconCls: 'icon icon-htong',
          children: [
            { path: '/home/marketingManagement', authorities: '050301', iconCls: '', name: '营销管理' }
          ]
        }, {
          name: '支持管理',
          path: '/home',
          authorities: '0504',
          iconCls: 'icon icon-caiwu',
          children: [
            { path: '/home/customerServiceRecords', authorities: '050401', iconCls: '', name: '客服记录' }
          ]
        }]
        this.hasMenu = true
        let router = this.hasAuthMenu(this.leftMenu)
        this.$router.push({ path: router })
      }
      if (index === 7) {
        let origin = window.location.origin
        window.open(origin + '/dv/#/switchScreen', '_blank')
      }
      if (index === 8) {
        this.leftMenu = [
          {
            name: '数据开放平台',
            path: '/home',
            authorities: '0802',
            iconCls: 'icon icon-caiwu',
            children: [
              { path: '/home/brandLibrary', authorities: '080201', iconCls: '', name: '品牌库' },
              { path: '/home/projectLibrary', authorities: '080202', iconCls: '', name: '项目库' }
            ]
          }
        ]
        this.hasMenu = true
        let router = this.hasAuthMenu(this.leftMenu)
        this.$router.push({ path: router })
      }
      localStorage.navId = index
      this.openeds = ['0']
      this.$forceUpdate()
    },
    businessManagement () {
      let industryPath = '/home/industryCAD'
      if (this.hasAuthority('02020204')) {
        industryPath = '/home/industryCAD'
      } else if (this.hasAuthority('02020205')) {
        industryPath = '/home/charts'
      } else if (this.hasAuthority('02020201') || this.hasAuthority('02020202') || this.hasAuthority('02020203')) {
        industryPath = '/home/housingList'
      }
      let tenantPath = '/home/tenantCAD'
      if (this.hasAuthority('02030101')) {
        tenantPath = '/home/tenantCAD'
      } else if (this.hasAuthority('02030106')) {
        tenantPath = '/home/tenantOverview'
      } else if (this.hasAuthority('02030102')) {
        tenantPath = '/home/tenantInfo'
      }
      let financialPath = '/home/financialState'
      if (this.hasAuthority('02030301')) {
        financialPath = '/home/financialState'
      } else if (this.hasAuthority('02030302')) {
        financialPath = '/home/billList'
      } else if (this.hasAuthority('02030314')) {
        financialPath = '/home/flow'
      } else if (this.hasAuthority('02030320')) {
        financialPath = '/home/tenantBills'
      }
      let projectActivitiesPath = '/home/projectActivities'
      if (this.hasAuthority('02030401')) {
        projectActivitiesPath = '/home/projectActivities'
      } else if (this.hasAuthority('02030402')) {
        projectActivitiesPath = '/home/businessActivities'
      }
      let incomeListPath = '/home/incomeList'
      if (this.hasAuthority('02030501')) {
        incomeListPath = '/home/incomeList'
      } else if (this.hasAuthority('02030510')) {
        incomeListPath = '/home/MultipleContract'
      } else if (this.hasAuthority('02030515')) {
        incomeListPath = '/home/point'
      }
      this.leftMenu = [
        {
          name: '项目管理',
          path: '/home',
          authorities: '0201',
          iconCls: 'icon icon-project',
          children: [
            { path: '/home/projectList', authorities: '020101', iconCls: '', name: '项目信息' },
            { path: '/home/planDesign', authorities: '020102', iconCls: '', name: '平面图配置' },
            { path: '/home/attractPosition', authorities: '020103', iconCls: '', name: '项目设计' },
            { path: '/home/engSpecifications', authorities: '020304', iconCls: '', name: '工程条件' }
          ]
        }, {
          name: '招商管理',
          path: '/home',
          authorities: '0202',
          iconCls: 'icon icon-caiwu',
          children: [
            { path: '/home/formatPlan', authorities: '020201', iconCls: '', name: '项目规划图' },
            { path: industryPath, authorities: '020202', iconCls: '', name: '房源招租' },
            { path: '/home/potlClients', authorities: '020204', iconCls: '', name: '意向客户' },
            { path: '/home/contractsList', authorities: '020205', iconCls: '', name: '合同信息' },
            { path: '/home/contractCalculator', authorities: '020206', iconCls: '', name: '合同金额计算器' }
          ]
        }, {
          name: '运营管理',
          path: '/home',
          authorities: '0203',
          iconCls: 'icon icon-caiwu',
          children: [
            { path: tenantPath, authorities: '020301', iconCls: '', name: '客户运营' },
            { path: financialPath, authorities: '020303', iconCls: '', name: '费用收缴' },
            { path: '/home/repairManagement', authorities: '02030203', iconCls: '', name: '报修信息' },
            { path: projectActivitiesPath, authorities: '020304', iconCls: '', name: '企划活动' },
            { path: incomeListPath, authorities: '020305', iconCls: '', name: '多种经营' }
          ]
        }, {
          name: '合同管理',
          path: '/home',
          authorities: '0204',
          iconCls: 'icon icon-htong',
          children: [
            { path: '/home/intentionContractsList', authorities: '020401', iconCls: '', name: '意向合同列表' }
          ]
        }, {
          name: '财务管理',
          path: '/home',
          authorities: '0205',
          iconCls: 'icon icon-caiwu',
          children: [
          ]
        }, {
          name: '资产评估',
          path: '/home',
          authorities: '0206',
          iconCls: 'icon icon-htong',
          children: [
            { path: '/home/revenueForecast', authorities: '020601', iconCls: '', name: '收益预测' }
          ]
        }
      ]
      this.hasMenu = true
      // let router = this.hasAuthMenu(this.leftMenu)
      // this.$router.push({path: router})
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
      })
    },
    async getUserList () { // 统一请求员工列表
      let result = await service.http.get('uaa/api/users/allOnGroupPersonnel', { page: 0, size: 20000 })
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
    }
  },
  created () {
    this.getDataAuthorityOptions()
    this.getUserList()
    this.industry()
    this.getProjectList()
  },
  mounted () {
    this.getUserInfo()
    // this.tabIndex = Number(localStorage.navId)
    this.selectNav(Number(localStorage.navId), 'reload')
    if (this.$route.path === '/home/workbench') {
      this.hasMenu = false
    }
  }
}
</script>

<style lang="scss" scoped>
$color-primary: #5364c5; // #18c79c
.menuContainer.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
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
  .el-menu-item.is-active {
    background-color: #3e4c76 !important;
    color: #fff !important;
  }
  .el-menu-item {
    height: 40px;
    line-height: 40px;
    background-color: #333e5f !important;
    color: #fff !important;
    font-size: 12px;
    padding-left: 51px !important;
  }
  .header {
    height: 50px;
    line-height: 50px;
    background: $color-primary;
    color: #fff;
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
      margin-left: 40px;
    }
    .userinfo-inner {
      cursor: pointer;
      color: #fff;
      img {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        margin: 10px 0px 10px 10px;
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
        width: 110px;
        float: left;
        margin: 5px 0 0 10px;
      }
      .txt {
        color: #fff;
      }
    }
    .logo-width {
      width: 230px;
      background-color: #3f51b5;
    }
    .logo-collapse-width {
      width: 60px;
      background-color: #3f51b5;
      img {
        margin: 10px 0 0 0;
      }
      .fa-bars {
        margin-left: 0;
      }
    }
    .logo-collapse-width.logo {
      padding-left: 6px;
      img {
        width: 0;
      }
    }
    .tools {
      padding: 0px 23px;
      width: 14px;
      height: 50px;
      line-height: 50px;
      cursor: pointer;
      i {
        margin-left: 25px;
        display: inline-block;
        width: 16px;
        height: 12px;
        background: url(../../assets/bars.png) no-repeat;
        background-size: contain;
      }
    }
  }
  .el-dropdown-link {
    font-size: 12px;
    width: 90px;
    display: inline-block;
    text-align: center;
    i {
      font-size: 30px;
      vertical-align: middle;
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
          left: 60px;
          z-index: 99999;
          height: auto;
          display: none;
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
      padding: 20px;
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
