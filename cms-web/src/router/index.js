/* eslint-disable indent */
import Vue from 'vue'
import Router from 'vue-router'
import CAMSMenu from '../views/home/CAMS-Menu.vue'
import CAMSMenuNew from '../views/home/CAMS-MenuNew.vue'
import Login from '../views/login/Index.vue'
import applist from '../views/administrator/APPS/applist.vue'
import jobOrder from '../views/administrator/jobOrder/index.vue'
import roleManage from '../views/administrator/roleManagement/index.vue'
import accountManage from '../views/administrator/accountManagement/index.vue'
import teantAccountSet from '../views/administrator/accountManagement/teantAccountSet.vue'
import approvalProcessManagement from '../views/administrator/approvalProcessManagement/index.vue'
import addProcess from '../views/administrator/approvalProcessManagement/addProcess.vue'
import personalCenter from '../views/personalCenter/index.vue'
import organizationManage from '../views/humanResource/organizationManagement/index.vue'
import postManage from '../views/humanResource/postManagement/index.vue'
import postChart from '../views/humanResource/postChart/index.vue'
import staffManage from '../views/humanResource/staffManagement/index.vue'
import personalDetail from '../views/humanResource/staffManagement/components/personalDetail.vue'
import parameter from '../views/administrator/systemManagement/parameter.vue'
import housingList from '../views/project/housingList/index.vue'
import projectList from '../views/project/projectList/index.vue'
import charts from '../views/project/charts/index.vue'
import buildingList from '../views/project/projectList/buildingList/index.vue'
import tenantList from '../views/tenantManagement/tenantList/index.vue'
import intentionContractsList from '../views/contractManagement/intentionContractsList/index.vue'
import contractsList from '../views/contractManagement/contractsList/index.vue'
import govContractsList from '../views/contractManagement/gov-contractList/index.vue'
import contractCalculator from '../views/contractManagement/contractCalculator/index.vue'
import workbench from '../views/workbench/index.vue'
import jobContent from '../views/workbench/jobContent/index.vue'
import approvalCenter from '../views/workbench/approvalCenter/index.vue'
import approverCenterDetails from '../views/workbench/approvalCenter/approverCenterDetails.vue'
import contractTenancy from '../views/workbench/approvalCenter/contractTenancy.vue'
import derate from '../views/workbench/approvalCenter/derate.vue'
import customApproval from '../views/workbench/approvalCenter/customApproval.vue'
import relaunch from '../views/workbench/approvalCenter/relaunch.vue'
import launchApproval from '../views/workbench/approvalCenter/launchApproval.vue'
import provisionalApproval from '../views/workbench/approvalCenter/provisionalApproval.vue'
import contractExpiration from '../views/workbench/contractExpiration/index.vue'
import billMaturity from '../views/workbench/billMaturity/index.vue'
import reportingCenter from '../views/workbench/reportingCenter/index.vue'
import billList from '../views/operations/costCollection/billList/index.vue'
import flow from '../views/operations/costCollection/flow/index.vue'
import flowBank from '../views/operations/costCollection/flowBank/index.vue'
import shopList from '../views/o2oManage/BusinessManagement/shopList.vue'
import commodityList from '../views/o2oManage/commodityManagement/commodityList.vue'
import DiliverymanList from '../views/o2oManage/DiliverymanManagement/DiliverymanList.vue'
import orderList from '../views/o2oManage/orderManagement/orderList.vue'
import membershipLevel from '../views/CRMManage/membershipManagement/membershipLevel.vue'
import membershipList from '../views/CRMManage/membershipManagement/membershipList.vue'
import membershipTag from '../views/CRMManage/membershipManagement/membershipTag.vue'
import serviceManagement from '../views/CRMManage/serviceManagement/serviceManagement.vue'
import marketingManagement from '../views/CRMManage/marketingManagement/marketingManagement.vue'
import customerServiceRecords from '../views/CRMManage/customerServiceRecords/customerServiceRecords.vue'
import deviceList from '../views/deviceManagement/deviceList/index.vue'
import deviceRepair from '../views/deviceManagement/deviceRepair/index.vue'
import maintain from '../views/deviceManagement/maintain/index.vue'
import patrolPollingRecord from '../views/deviceManagement/patrolPollingRecord/index.vue'
import patrolPollingForm from '../views/deviceManagement/patrolPollingForm/index.vue'
import brandLibrary from '../views/financialManagement/brandLibrary/index.vue'
import addBrand from '../views/financialManagement/brandLibrary/componets/addBrand'
import recordInfo from '../views/financialManagement/brandLibrary/componets/recordInfo'
import shopInfo from '../views/financialManagement/brandLibrary/componets/shopInfo'
import news from '../views/financialManagement/brandLibrary/componets/news'
import addShop from '../views/financialManagement/brandLibrary/componets/addShop'
import planDesign from '../views/project/planDesign/index.vue'
import adminUnit from '../views/project/adminUnit/index.vue'
import projectLibrary from '../views/financialManagement/projectLibrary/index.vue'
import addProject from '../views/financialManagement/projectLibrary/componets/addProject.vue'
import projectInfo from '../views/financialManagement/projectLibrary/componets/projectInfo.vue'
import enterBrand from '../views/financialManagement/projectLibrary/componets/enterBrand.vue'
import projectNews from '../views/financialManagement/projectLibrary/componets/projectNews.vue'
import attractCAD from '../views/financialManagement/mnangement/attractCAD.vue'
import potlClients from '../views/financialManagement/mnangement/potlClientsList/potlClients.vue'
import potlClientsList from '../views/financialManagement/mnangement/potlClientsList/potlClientsList.vue'
import industryCAD from '../views/financialManagement/mnangement/industryCAD.vue'
import industryCAD2 from '../views/financialManagement/mnangement/industryCAD2.vue'
import deviceCAD from '../views/deviceManagement/industryCAD/index.vue'
import energy from '../views/deviceManagement/energySystem/index.vue'
import energyData from '../views/deviceManagement/energySystem/energyData.vue'
import energyEquipment from '../views/deviceManagement/energySystem/energyEquipment.vue'
import firecontrolChart from '../views/deviceManagement/firecontrol/firecontrolChart.vue'
import firecontrolEquipment from '../views/deviceManagement/firecontrol/firecontrolEquipment.vue'
import weakCAD from '../views/deviceManagement/weakSystem/weakCAD.vue'
import weakEquipment from '../views/deviceManagement/weakSystem/weakEquipment.vue'
import firecontrolTest from '../views/deviceManagement/firecontrol/firecontrolTest.vue'
import firecontrolChecklist from '../views/deviceManagement/firecontrol/firecontrolChecklist.vue'
import selfControlManagement from '../views/deviceManagement/selfControlManagement/index.vue'
import emergency from '../views/deviceManagement/emergency/index.vue'
import revenueForecast from '../views/assetsAppraisal/revenueForecast/index.vue'
import attractPosition from '../views/financialManagement/mnangement/attractPosition/index.vue'
import industryPlanning from '../views/financialManagement/mnangement/attractPosition/industryPlanning.vue'
import formatPlan from '../views/financialManagement/mnangement/formatPlan.vue'
import engSpecifications from '../views/financialManagement/engSpecifications/index.vue'
import shopEngineer from '../views/financialManagement/engSpecifications/shopEngineer.vue'
import tenantInfo from '../views/operationManagement/tenantInfo/index.vue'
import tenantCAD from '../views/operationManagement/tenantInfo/tenantCAD.vue'
import repairManagement from '../views/operations/repairManagement/index.vue'
import repairManagement1 from '../views/operations/repairManagement/index1.vue'
import projectActivities from '../views/operations/eventsPlanner/projectActivities/index.vue' /* 项目活动 */
import businessActivities from '../views/operations/eventsPlanner/businessActivities/index.vue' /* 商家活动 */
import financialState from '../views/operations/costCollection/financialStatements/index.vue'
import tenantBills from '../views/operations/costCollection/tenantBills/index.vue'
import incomeList from '../views/operations/varietyBusiness/income/index.vue'
import point from '../views/operations/varietyBusiness/point/index.vue'
import MultipleContract from '../views/operations/varietyBusiness/contract/index.vue'
import tenantOverview from '../views/operationManagement/tenantInfo/tenantOverview.vue'
import messageManagement from '../views/workbench/messageManagement/index.vue'
import security from '../views/deviceManagement/security/index.vue'
import docs from '../views/docs/index.vue'
import contractAllocation from '../views/administrator/contractAllocation/index.vue'
import messageCenter from '../views/messageCenter/index.vue'
import clubCardSet from '../views/CRMManagement/clubCard/clubCardSet.vue'
import upDownSet from '../views/CRMManagement/clubCard/upDownSet.vue'
import integralRule from '../views/CRMManagement/integralRule/index.vue'
import integralAudit from '../views/CRMManagement/integralAudit/index.vue'
import memberInfo from '../views/CRMManagement/memberInfo/index.vue'
import brandManagement from '../views/CRMManagement/brandManagement/index.vue'
import brandAudit from '../views/CRMManagement/brandManagement/brandAudit.vue'
import floorManagement from '../views/CRMManagement/floorManagement/index.vue'
import coupon from '../views/CRMManagement/coupon/index.vue'
import AppletSetup from '../views/CRMManagement/AppletSetup/Rotationchart.vue'
import BasicSettings from '../views/CRMManagement/AppletSetup/BasicSettings.vue'
import uidemoHhm from '../views/z_UIdemo/uidemoHhm.vue'
import uidemoCK from '../views/z_UIdemo/uidemoCK.vue'
import uidemoZK from '../views/z_UIdemo/uidemoZK.vue'
import operationalAudit from '../views/administrator/operationalAudit/index.vue'
import farmerGoods from '../views/farmerManagement/commodityInfo/farmerGoods.vue'
import tenantGoods from '../views/farmerManagement/commodityInfo/tenantGoods.vue'
import orderBill from '../views/farmerManagement/billFrom/orderBill.vue'
import orderBillOnline from '../views/farmerManagement/billFrom/orderBillOnline.vue'
import tradeBill from '../views/farmerManagement/billFrom/tradeBill.vue'
import tradeFrom from '../views/farmerManagement/billFrom/tradeFrom.vue'
import weighingBill from '../views/farmerManagement/billFrom/weighingBill.vue'
import InventoryQuery from '../views/farmerManagement/InventoryManagement/InventoryQuery.vue'
import WarehouseDetails from '../views/farmerManagement/InventoryManagement/WarehouseDetails.vue'
import warehousing from '../views/farmerManagement/traceabilityManagement/warehousing.vue' // 入库信息上报
import sellData from '../views/farmerManagement/traceabilityManagement/sellData.vue' // 销售数据上报
import traceabilitySet from '../views/farmerManagement/traceabilityManagement/traceabilitySet.vue' // 溯源配置
import SupplierManagement from '../views/farmerManagement/InventoryManagement/SupplierManagement.vue' // 供应商管理
import foodSafeTest from '../views/farmerManagement/foodSafeTest/index.vue' // 食安检测
import visualSet from '../views/farmerManagement/visualSet/visualSet.vue'
import projectNotice from '../views/operationManagement/tenantNotice/projectNotice.vue'
import activityNotice from '../views/operationManagement/tenantNotice/activityNotice.vue'
import deliveryman from '../views/distribution/deliveryman/index.vue'
import foodMarket from '../views/distribution/foodMarket/index.vue'
import specialActivity from '../views/marketingCenter/specialActivity.vue'
import useRecord from '../views/marketingCenter/useRecord.vue'
// import Layout from '@/views/layout/Layout'
// import context from '../service'

Vue.use(Router)
const router = new Router({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/',
      name: 'home',
      component: CAMSMenuNew,
      meta: {
        title: '首页'
      },
      children: [{
          path: '/home/applist',
          name: 'applist',
          meta: {
            title: 'apps库'
          },
          component: applist
        },
        {
          path: '/home/roleManage',
          name: 'roleManage',
          meta: {
            title: '角色管理'
          },
          component: roleManage
        },
        {
          path: '/home/jobOrder',
          name: 'jobOrder',
          meta: {
            title: '通知单管理'
          },
          component: jobOrder
        },
        {
          path: '/home/accountManage',
          name: 'accountManage',
          meta: {
            title: '账号管理'
          },
          component: accountManage
        },
        {
          path: '/home/teantAccountSet',
          name: 'teantAccountSet',
          meta: {
            title: '客户账号管理'
          },
          component: teantAccountSet
        },
        {
          path: '/home/approvalProcessManagement',
          name: 'approvalProcessManagement',
          meta: {
            title: '审批流程管理'
          },
          component: approvalProcessManagement
        },
        {
          path: '/home/addProcess',
          name: 'addProcess',
          meta: {
            title: '新增审批流程'
          },
          component: addProcess
        },
        {
          path: '/home/parameter',
          name: 'parameter',
          meta: {
            title: '参数管理'
          },
          component: parameter
        },
        {
          path: '/home/organizationManage',
          name: 'organizationManage',
          meta: {
            title: '组织架构图'
          },
          component: organizationManage
        },
        {
          path: '/home/postManage',
          name: 'postManage',
          meta: {
            title: '岗位信息'
          },
          component: postManage
        },
        {
          path: '/home/postChart',
          name: 'postChart',
          meta: {
            title: '岗位关系图'
          },
          component: postChart
        },
        {
          path: '/home/staffManage',
          name: 'staffManage',
          meta: {
            title: '员工档案'
          },
          component: staffManage
        },
        {
          path: '/home/personalDetail',
          name: 'personalDetail',
          meta: {
            title: '员工信息'
          },
          component: personalDetail
        },
        {
          path: '/home/personalCenter',
          name: 'personalCenter',
          meta: {
            title: '个人中心'
          },
          component: personalCenter
        },
        {
          path: '/home/housingList',
          name: 'housingList',
          meta: {
            title: '房源列表'
          },
          component: housingList
        },
        {
          path: '/home/buildingList',
          name: 'buildingList',
          meta: {
            title: '楼宇列表'
          },
          component: buildingList
        },
        {
          path: '/home/projectList',
          name: 'projectList',
          meta: {
            title: '项目列表'
          },
          component: projectList
        },
        {
          path: '/home/charts',
          name: 'charts',
          meta: {
            title: '租控图'
          },
          component: charts
        },
        {
          path: '/home/tenantList',
          name: 'tenantList',
          meta: {
            title: '客户列表'
          },
          component: tenantList
        },
        {
          path: '/home/intentionContractsList',
          name: 'intentionContractsList',
          meta: {
            title: '意向合同列表'
          },
          component: intentionContractsList
        },
        {
          path: '/home/contractsList',
          name: 'contractsList',
          meta: {
            title: '合同列表'
          },
          component: contractsList
        },
        {
          path: '/home/govContractsList',
          name: 'govContractsList',
          meta: {
            title: '合同列表'
          },
          component: govContractsList
        },
        {
          path: '/home/contractCalculator',
          name: 'contractCalculator',
          meta: {
            title: '合同金额计算器'
          },
          component: contractCalculator
        },
        {
          path: '/home/workbench',
          name: 'workbench',
          meta: {
            title: '工作台'
          },
          component: workbench,
          children: [{
            path: '/home/workbench/jobContent',
            name: 'jobContent',
            meta: {
              title: '工作内容'
            },
            component: jobContent
          }]
        },
        {
          path: '/home/approvalCenter',
          name: 'approvalCenter',
          meta: {
            title: '审批中心',
            keepAlive: true
          },
          component: approvalCenter
        },
        {
          path: '/home/approvalCenter/approverCenterDetails',
          name: 'approverCenterDetails',
          meta: {
            title: '审批中心详情'
          },
          component: approverCenterDetails
        },
        {
          path: '/home/approvalCenter/contractTenancy',
          name: 'contractTenancy',
          meta: {
            title: '合同退租'
          },
          component: contractTenancy
        },
        {
          path: '/home/approvalCenter/derate',
          name: 'derate',
          meta: {
            title: '减免'
          },
          component: derate
        },
        {
          path: '/home/approvalCenter/customApproval',
          name: 'customApproval',
          meta: {
            title: '非标审批'
          },
          component: customApproval
        },
        {
          path: '/home/approvalCenter/relaunch',
          name: 'relaunch',
          meta: {
            title: '驳回重新发起'
          },
          component: relaunch
        },
        {
          path: '/home/approvalCenter/launchApproval',
          name: 'launchApproval',
          meta: {
            title: '发起审批'
          },
          component: launchApproval
        },
        {
          path: '/home/approvalCenter/provisionalApproval',
          name: 'provisionalApproval',
          meta: {
            title: '发起临时审批'
          },
          component: provisionalApproval
        },
        {
          path: '/home/contractExpiration',
          name: 'contractExpiration',
          meta: {
            title: '合同到期'
          },
          component: contractExpiration
        },
        {
          path: '/home/billMaturity',
          name: 'billMaturity',
          meta: {
            title: '账单到期'
          },
          component: billMaturity
        },
        {
          path: '/home/reportingCenter',
          name: 'reportingCenter',
          meta: {
            title: '汇报中心'
          },
          component: reportingCenter
        },
        {
          path: '/home/billList',
          name: 'billList',
          meta: {
            title: '账单列表'
          },
          component: billList
        },
        {
          path: '/home/flow',
          name: 'flow',
          meta: {
            title: '收支流水'
          },
          component: flow
        },
        {
          path: '/home/flowBank',
          name: 'flowBank',
          meta: {
            title: '收支流水'
          },
          component: flowBank
        },
        {
          path: '/home/shopList',
          name: 'shopList',
          meta: {
            title: '店铺列表'
          },
          component: shopList
        },
        {
          path: '/home/commodityList',
          name: 'commodityList',
          meta: {
            title: '商品列表'
          },
          component: commodityList
        },
        {
          path: '/home/DiliverymanList',
          name: 'DiliverymanList',
          meta: {
            title: '配送员列表'
          },
          component: DiliverymanList
        },
        {
          path: '/home/orderList',
          name: 'orderList',
          meta: {
            title: '订单列表'
          },
          component: orderList
        },
        {
          path: '/home/membershipLevel',
          name: 'membershipLevel',
          meta: {
            title: '会员等级'
          },
          component: membershipLevel
        },
        {
          path: '/home/membershipList',
          name: 'membershipList',
          meta: {
            title: '会员列表'
          },
          component: membershipList
        },
        {
          path: '/home/membershipTag',
          name: 'membershipTag',
          meta: {
            title: '会员标签'
          },
          component: membershipTag
        },
        {
          path: '/home/serviceManagement',
          name: 'serviceManagement',
          meta: {
            title: '服务管理'
          },
          component: serviceManagement
        },
        {
          path: '/home/marketingManagement',
          name: 'marketingManagement',
          meta: {
            title: '营销管理'
          },
          component: marketingManagement
        },
        {
          path: '/home/customerServiceRecords',
          name: 'customerServiceRecords',
          meta: {
            title: '支持管理'
          },
          component: customerServiceRecords
        },
        {
          path: '/home/deviceList',
          name: 'deviceList',
          meta: {
            title: '设备管理'
          },
          component: deviceList
        },
        {
          path: '/home/maintain',
          name: 'maintain',
          meta: {
            title: '保养列表'
          },
          component: maintain
        },
        {
          path: '/home/patrolPollingRecord',
          name: 'patrolPollingRecord',
          meta: {
            title: '巡更巡检记录'
          },
          component: patrolPollingRecord
        },
        {
          path: '/home/patrolPollingForm',
          name: 'patrolPollingForm',
          meta: {
            title: '巡更巡检表'
          },
          component: patrolPollingForm
        },
        {
          path: '/home/deviceRepair',
          name: 'deviceRepair',
          meta: {
            title: '报修管理'
          },
          component: deviceRepair
        },
        {
          path: '/home/brandLibrary',
          name: 'brandLibrary',
          meta: {
            title: '品牌库'
          },
          component: brandLibrary
        },
        {
          path: '/home/addBrand',
          name: 'addBrand',
          meta: {
            title: '增加品牌'
          },
          component: addBrand,
          children: [{
              path: '/home/brandLibrary/recordInfo',
              name: 'recordInfo',
              meta: {
                title: '档案信息'
              },
              component: recordInfo
            },
            {
              path: '/home/brandLibrary/shopInfo',
              name: 'shopInfo',
              meta: {
                title: '门店信息'
              },
              component: shopInfo
            },
            {
              path: '/home/brandLibrary/news',
              name: 'news',
              meta: {
                title: '新闻浏览'
              },
              component: news
            },
            {
              path: '/home/brandLibrary/addShop',
              name: 'addShop',
              meta: {
                title: '门店档案'
              },
              component: addShop
            }
          ]
        },
        {
          path: '/home/planDesign',
          name: 'planDesign',
          meta: {
            title: '门店档案'
          },
          component: planDesign
        },
        {
          path: '/home/adminUnit',
          name: 'adminUnit',
          meta: {
            title: '主管部门'
          },
          component: adminUnit
        },
        {
          path: '/home/projectLibrary',
          name: 'projectLibrary',
          meta: {
            title: '项目库'
          },
          component: projectLibrary
        },
        {
          path: '/home/addProject',
          name: 'addProject',
          meta: {
            title: '增加项目'
          },
          component: addProject,
          children: [{
              path: '/home/projectLibrary/projectInfo',
              name: 'projectInfo',
              meta: {
                title: '项目信息'
              },
              component: projectInfo
            },
            {
              path: '/home/projectLibrary/enterBrand',
              name: 'enterBrand',
              meta: {
                title: '入驻品牌'
              },
              component: enterBrand
            },
            {
              path: '/home/projectLibrary/projectNews',
              name: 'projectNews',
              meta: {
                title: '咨询浏览'
              },
              component: projectNews
            }
          ]
        },
        {
          path: '/home/attractCAD',
          name: 'attractCAD',
          meta: {
            title: '招商平面图'
          },
          component: attractCAD
        },
        {
          path: '/home/potlClients',
          name: 'potlClients',
          meta: {
            title: '我的意向客户列表'
          },
          component: potlClients
        },
        {
          path: '/home/attractPosition',
          name: 'attractPosition',
          meta: {
            title: '招商落位'
          },
          component: attractPosition
        },
        {
          path: '/home/industryPlanning',
          name: 'industryPlanning',
          meta: {
            title: '项目规划图'
          },
          component: industryPlanning
        },
        {
          path: '/home/potlClientsList',
          name: 'potlClientsList',
          meta: {
            title: '我的意向客户列表'
          },
          component: potlClientsList
        },
        {
          path: '/home/industryCAD',
          name: 'industryCAD',
          meta: {
            title: '行业平面图'
          },
          component: industryCAD
        },
        {
          path: '/home/industryCAD2',
          name: 'industryCAD2',
          meta: {
            title: '行业平面图'
          },
          component: industryCAD2
        },
        {
          path: '/home/engSpecifications',
          name: 'engSpecifications',
          meta: {
            title: '项目工程条件'
          },
          component: engSpecifications
        },
        {
          path: '/home/shopEngineer',
          name: 'shopEngineer',
          meta: {
            title: '房源工程条件'
          },
          component: shopEngineer
        },
        {
          path: '/home/formatPlan',
          name: 'formatPlan',
          meta: {
            title: '项目规划图'
          },
          component: formatPlan
        },
        {
          path: '/home/deviceCAD',
          name: 'deviceCAD',
          meta: {
            title: '设备平面图'
          },
          component: deviceCAD
        },
        {
          path: '/home/energy',
          name: 'energy',
          meta: {
            title: '能耗系统'
          },
          component: energy
        },
        {
          path: '/home/energyData',
          name: 'energyData',
          meta: {
            title: '能耗数据'
          },
          component: energyData
        },
        {
          path: '/home/energyEquipment',
          name: 'energyEquipment',
          meta: {
            title: '能耗设备'
          },
          component: energyEquipment
        },
        {
          path: '/home/firecontrolChart',
          name: 'firecontrolChart',
          meta: {
            title: '消防平面图'
          },
          component: firecontrolChart
        },
        {
          path: '/home/firecontrolEquipment',
          name: 'firecontrolEquipment',
          meta: {
            title: '消防设施设备列表'
          },
          component: firecontrolEquipment
        },
        {
          path: '/home/weakCAD',
          name: 'weakCAD',
          meta: {
            title: '弱电平面图'
          },
          component: weakCAD
        },
        {
          path: '/home/weakEquipment',
          name: 'weakEquipment',
          meta: {
            title: '弱电设备列表'
          },
          component: weakEquipment
        },
        {
          path: '/home/firecontrolTest',
          name: 'firecontrolTest',
          meta: {
            title: '消防检测'
          },
          component: firecontrolTest
        },
        {
          path: '/home/firecontrolChecklist',
          name: 'firecontrolChecklist',
          meta: {
            title: '消防器材检测表'
          },
          component: firecontrolChecklist
        },
        {
          path: '/home/emergency',
          name: 'emergency',
          meta: {
            title: '应急事项'
          },
          component: emergency
        },
        {
          path: '/home/repairManagement',
          name: 'repairManagement',
          meta: {
            title: '报修信息'
          },
          component: repairManagement
        },
        {
          path: '/home/repairManagement1',
          name: 'repairManagement1',
          meta: {
            title: '报修信息'
          },
          component: repairManagement1
        },
        {
          /* 项目活动 */
          path: '/home/projectActivities',
          name: 'projectActivities',
          meta: {
            title: '项目活动'
          },
          component: projectActivities
        },
        {
          /* 商家活动 */
          path: '/home/businessActivities',
          name: 'businessActivities',
          meta: {
            title: '项目活动'
          },
          component: businessActivities
        },
        {
          path: '/home/revenueForecast',
          name: 'revenueForecast',
          meta: {
            title: '资产评估'
          },
          component: revenueForecast
        },
        {
          path: '/home/tenantInfo',
          name: 'tenantInfo',
          meta: {
            title: '资产评估'
          },
          component: tenantInfo
        },
        {
          path: '/home/financialState',
          name: 'financialState',
          meta: {
            title: '财务报表'
          },
          component: financialState
        },
        {
          path: '/home/tenantBills',
          name: 'tenantBills',
          meta: {
            title: '客户账单'
          },
          component: tenantBills
        },
        {
          path: '/home/tenantCAD',
          name: 'tenantCAD',
          meta: {
            title: '资产评估'
          },
          component: tenantCAD
        },
        {
          path: '/home/incomeList',
          name: 'incomeList',
          meta: {
            title: '多经收入'
          },
          component: incomeList
        },
        {
          path: '/home/point',
          name: 'point',
          meta: {
            title: '多经点位'
          },
          component: point
        },
        {
          path: '/home/MultipleContract',
          name: 'MultipleContract',
          meta: {
            title: '多经合同'
          },
          component: MultipleContract
        },
        {
          path: '/home/tenantOverview',
          name: 'tenantOverview',
          meta: {
            title: '客户概览图'
          },
          component: tenantOverview
        },
        {
          path: '/home/messageManagement',
          name: 'messageManagement',
          meta: {
            title: '消息通知'
          },
          component: messageManagement
        },
        {
          path: '/home/security',
          name: 'security',
          meta: {
            title: '保安保洁'
          },
          component: security
        },
        {
          path: '/home/selfControlManagement',
          name: 'selfControlManagement',
          meta: {
            title: '自控管理'
          },
          component: selfControlManagement
        },
        {
          path: '/home/docs',
          name: 'docs',
          meta: {
            title: 'API'
          },
          component: docs
        },
        {
          path: '/home/contractAllocation',
          name: 'contractAllocation',
          meta: {
            title: '合同配置'
          },
          component: contractAllocation
        },
        {
          path: '/home/messageCenter',
          name: 'messageCenter',
          meta: {
            title: '消息中心'
          },
          component: messageCenter
        },
        // CRM------------------------------------------STARt-----------------
        {
          path: '/home/clubCardSet',
          name: 'clubCardSet',
          meta: {
            title: '会员卡管理'
          },
          component: clubCardSet
        },
        {
          path: '/home/upDownSet',
          name: 'upDownSet',
          meta: {
            title: '会员卡升降级设置'
          },
          component: upDownSet
        },
        {
          path: '/home/integralRule',
          name: 'integralRule',
          meta: {
            title: '积分规则管理'
          },
          component: integralRule
        },
        {
          path: '/home/memberInfo',
          name: 'memberInfo',
          meta: {
            title: '会员管理'
          },
          component: memberInfo
        },
        {
          path: '/home/integralAudit',
          name: 'integralAudit',
          meta: {
            title: '积分审核'
          },
          component: integralAudit
        },
        {
          path: '/home/brandManagement',
          name: 'brandManagement',
          meta: {
            title: '品牌管理'
          },
          component: brandManagement
        },
        {
          path: '/home/brandAudit',
          name: 'brandAudit',
          meta: {
            title: '品牌信息审核'
          },
          component: brandAudit
        },
        {
          path: '/home/floorManagement',
          name: 'floorManagement',
          meta: {
            title: '楼层管理'
          },
          component: floorManagement
        },
        {
          path: '/home/coupon',
          name: 'coupon',
          meta: {
            title: '优惠券审核'
          },
          component: coupon
        },
        {
          path: '/home/AppletSetup',
          name: 'AppletSetup',
          meta: {
            title: '轮播图设置'
          },
          component: AppletSetup
        },
        {
          path: '/home/BasicSettings',
          name: 'BasicSettings',
          meta: {
            title: '基本设置'
          },
          component: BasicSettings
        },
        {
          path: '/home/operationalAudit',
          name: 'operationalAudit',
          meta: {
            title: '操作审计'
          },
          component: operationalAudit
        },
        {
          path: '/home/farmerGoods',
          name: 'farmerGoods',
          meta: {
            title: '商品信息'
          },
          component: farmerGoods
        },
        {
          path: '/home/tenantGoods',
          name: 'tenantGoods',
          meta: {
            title: '客户商品'
          },
          component: tenantGoods
        },
        {
          path: '/home/productConfig',
          name: 'productConfig',
          meta: {
            title: '客户商品'
          },
          component: () => import('@/views/farmerManagement/commodityInfo/productConfig.vue')
        },
        {
          path: '/home/orderBill',
          name: 'orderBill',
          meta: {
            title: '客户线下订单流水'
          },
          component: orderBill
        },
        {
          path: '/home/orderBillOnline',
          name: 'orderBillOnline',
          meta: {
            title: '客户线上订单流水'
          },
          component: orderBillOnline
        },
        {
          path: '/home/tradeBill',
          name: 'tradeBill',
          meta: {
            title: '商品交易流水'
          },
          component: tradeBill
        },
        {
          path: '/home/tradeFrom',
          name: 'tradeFrom',
          meta: {
            title: '客户交易报表'
          },
          component: tradeFrom
        },
        {
          path: '/home/deliveryman',
          name: 'deliveryman',
          meta: {
            title: '配送员管理'
          },
          component: deliveryman
        },
        {
          path: '/home/foodMarket',
          name: 'foodMarket',
          meta: {
            title: '菜场管理'
          },
          component: foodMarket
        },
        {
          path: '/home/specialActivity',
          name: 'specialActivity',
          meta: {
            title: '优惠活动管理'
          },
          component: specialActivity
        },
        {
          path: '/home/useRecord',
          name: 'useRecord',
          meta: {
            title: '优惠券使用记录'
          },
          component: useRecord
        },
        {
          path: '/home/weighingBill',
          name: 'weighingBill',
          meta: {
            title: '称重数据报表'
          },
          component: weighingBill
        },
        {
          path: '/home/InventoryQuery',
          name: 'InventoryQuery',
          meta: {
            title: '库存查询'
          },
          component: InventoryQuery
        },
        {
          path: '/home/WarehouseDetails',
          name: 'WarehouseDetails',
          meta: {
            title: '出入库明细'
          },
          component: WarehouseDetails
        },
        {
          path: '/home/warehousing',
          name: 'warehousing',
          meta: {
            title: '入库信息上报'
          },
          component: warehousing
        },
        {
          path: '/home/sellData',
          name: 'sellData',
          meta: {
            title: '销售数据配置'
          },
          component: sellData
        },
        {
          path: '/home/traceabilitySet',
          name: 'traceabilitySet',
          meta: {
            title: '溯源配置'
          },
          component: traceabilitySet
        },
        {
          path: '/home/SupplierManagement',
          name: 'SupplierManagement',
          meta: {
            title: '供销商管理'
          },
          component: SupplierManagement
        },
        {
          path: '/home/foodSafeTest',
          name: 'foodSafeTest',
          meta: {
            title: '食安检测'
          },
          component: foodSafeTest
        },
        {
          path: '/home/visualSet',
          name: 'visualSet',
          meta: {
            title: '可视化配置'
          },
          component: visualSet
        },
        {
          path: '/home/projectNotice',
          name: 'projectNotice',
          meta: {
            title: '项目公告'
          },
          component: projectNotice
        },
        {
          path: '/home/activityNotice',
          name: 'activityNotice',
          meta: {
            title: '活动通知'
          },
          component: activityNotice
        },
        // CRM------------------------------------------end-------------------
        {
          path: '/home/uidemoHhm',
          name: 'uidemoHhm',
          meta: {
            title: 'ui测试'
          },
          component: uidemoHhm
        },
        {
          path: '/home/uidemoCK',
          name: 'uidemoCK',
          meta: {
            title: 'ui测试'
          },
          component: uidemoCK
        },
        {
          path: '/home/uidemoZK',
          name: 'uidemoZK',
          meta: {
            title: 'ui测试'
          },
          component: uidemoZK
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  // 登录验证
  if (sessionStorage.getItem('user') || to.name === 'login') {
    next()
  } else {
    next({
      path: '/login'
    })
  }
})
export default router
