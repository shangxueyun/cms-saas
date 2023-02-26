/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
import Vue from 'vue'
import Router from 'vue-router'
import NoNetwork from '../components/NoNetwork.vue'
import Login from '../views/login/Index.vue'
import registered from '../views/registered/index.vue'
import index from '../views/home/index.vue'
import approvalCenter from '../views/home/approvalCenter/approvalCenter.vue'
import provisionalApproval from '../views/home/approvalCenter/provisionalApproval.vue'
import selectApprover from '../components/selectApprover/index.vue'
import messageCenter from '../views/home/messageCenter/index.vue'
import Notice from '../views/home/messageCenter/Notice/index.vue'
import AddNotice from '../views/home/messageCenter/Notice/AddNotice.vue'
import noticeDetails from '../views/home/messageCenter/Notice/NoticeDetails.vue'
import AddMessage from '../views/home/messageCenter/messageDetails/AddMessage.vue'
import messageDetails from '../views/home/messageCenter/messageDetails/messageDetails.vue'
import contact from '../views/contact/index.vue'
import mine from '../views/mine/index.vue'
import userInfo from '../views/mine/userInfo/index.vue'
import setName from '../views/mine/userInfo/setName/index.vue'
import setPhone from '../views/mine/userInfo/setPhone/index.vue'
import password from '../views/password/index.vue'
import selectRecipients from '../views/home/messageCenter/selectRecipients/index.vue'
import FilePreview from '../components/FilePreview.vue'
import policyAgreement from '../components/policyAgreement.vue'
import reportCenter from '../views/home/reportCenter/index.vue'
import addReport from '../views/home/reportCenter/addReport.vue'
import reportList from '../views/home/reportCenter/reportList.vue'
import dataSummary from '../views/home/dataSummary/index.vue'
// import ProjectComparison from '../views/home/dataSummary/ProjectComparison.vue'
// import ProjectData from '../views/home/dataSummary/ProjectData.vue'
import approvalList from '../views/home/approvalCenter/approvalList.vue'
import approvalDetails from '../views/home/approvalCenter/approvalDetails.vue'
import followRecordData from '../views/home/approvalCenter/followRecordData.vue'
import recordData from '../views/home/approvalCenter/recordData.vue'
import contractTenancy from '../views/home/approvalCenter/contractTenancy.vue'
import customApproval from '../views/home/approvalCenter/customApproval.vue'
import addApprovalList from '../views/home/approvalCenter/addApprovalList.vue'
import addApproval from '../views/home/approvalCenter/addApproval.vue'
import flowChart from '../views/home/approvalCenter/flowChart/flowChart.vue'
import rentControlChart from '../views/home/rentControlChart/index.vue'
import customerPlan from '../views/home/rentControlChart/customerPlan.vue'
import TenantDetails from '../views/home/rentControlChart/TenantDetails.vue'
import riskDetails from '../views/home/rentControlChart/riskDetails.vue'
import WriteFollowup from '../views/home/rentControlChart/TenantComponents/WriteFollowup'
import feesCollected from '../views/home/feesCollected/index.vue'
import tenantBillsList from '../views/home/feesCollected/tenantBillsList.vue'
import tenantBills from '../views/home/feesCollected/tenantBills.vue'
import billDetails from '../views/home/feesCollected/billDetails.vue'
import storeList from '../views/home/storeManagement/storeList.vue'
import housingHome from '../views/home/storeManagement/housingHome.vue'
import storeDetails from '../views/home/storeManagement/storeDetails.vue'
import enteAddEdit from '../views/home/storeManagement/enteAddEdit.vue'
import shopFollow from '../views/home/storeManagement/shopFollow.vue'
import interestedList from '../views/home/interestedBuyers/interestedList.vue'
import interestedFollow from '../views/home/interestedBuyers/interestedFollow.vue'
import contractList from '../views/home/contract/contractList.vue'
import addIntentionCustomers from '../views/home/interestedBuyers/addIntentionCustomers.vue'
import CustomersDetails from '../views/home/interestedBuyers/CustomersDetails.vue'
import RentRules from '../views/home/contract/RentRules.vue'
import PropertyfeeRules from '../views/home/contract/PropertyfeeRules.vue'
import contractBasicInfo from '../views/home/contract/contractBasicInfo.vue'
import contractBillDetails from '../views/home/contract/contractBillDetails.vue'
import repairList from '../views/home/propertyManagement/repairList.vue'
import repairDetails from '../views/home/propertyManagement/repairDetails.vue'
import maintainList from '../views/home/propertyManagement/maintainList.vue'
import maintainDetails from '../views/home/propertyManagement/maintainDetails.vue'
import addRepairs from '../views/home/propertyManagement/addRepairs.vue'
import addWeixiu from '../views/home/propertyManagement/addWeixiu.vue'
import addMaintain from '../views/home/propertyManagement/addMaintain.vue'
import selectEquirement from '../views/home/propertyManagement/components/selectEquirement.vue'
import ProjectInformation from '../views/home/ProjectManagement/ProjectInformation.vue'
import competentDepartmentList from '../views/home/ProjectManagement/competentDepartmentList.vue'
import addCompetentDepartment from '../views/home/ProjectManagement/addCompetentDepartment.vue'
import competentDepartmentDel from '../views/home/ProjectManagement/competentDepartmentDel.vue'
import competentWriteFollow from '../views/home/ProjectManagement/competentWriteFollow.vue'
import engineeringList from '../views/home/ProjectManagement/engineeringList.vue'
import engineeringDetails from '../views/home/ProjectManagement/engineeringDetails.vue'
import ProjectDetail from '../views/home/ProjectManagement/ProjectDetail.vue'
import Building from '../views/home/ProjectManagement/Building.vue'
import BuildingDetails from '../views/home/ProjectManagement/BuildingDetails.vue'
import RelatedInformation from '../views/home/ProjectManagement/RelatedInformation.vue'
import RIinterestedFollow from '../views/home/ProjectManagement/RIinterestedFollow.vue'
import workingSchedule from '../views/home/propertyManagement/securityCleaning/workingSchedule.vue'
import personList from '../views/home/propertyManagement/securityCleaning/personList.vue'
import personDetails from '../views/home/propertyManagement/securityCleaning/personDetails.vue'
import emergencyList from '../views/home/propertyManagement/emergency/emergencyList.vue'
import emergencyDetails from '../views/home/propertyManagement/emergency/emergencyDetails.vue'
import emergencyAdd from '../views/home/propertyManagement/emergency/emergencyAdd.vue'
import classes from '../views/home/propertyManagement/securityCleaning/classes.vue'
import tenantList from '../views/home/operationsManagement/tenantList/index.vue'
import clientListHome from '../views/home/operationsManagement/tenantList/clientListHome.vue'
import repairsInfo from '../views/home/operationsManagement/repairsInfo/index.vue'
import storeChart from '../views/home/storeChart/index.vue'
import NewTurnover from '../views/home/rentControlChart/TenantComponents/NewTurnover.vue'
import context from '@/service'

Vue.use(Router)
const router = new Router({
  routes: [{
      path: '/networkError',
      component: NoNetwork,
      name: 'networkError',
      meta: {
        title: '网络异常'
      }
    }, {
      path: '/FilePreview',
      name: 'FilePreview',
      component: FilePreview,
      meta: {
        title: '文件预览'
      }
    },
    {
      path: '/policyAgreement',
      name: 'policyAgreement',
      component: policyAgreement,
      meta: {
        title: '协议'
      }
    },
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/login',
      redirect: '/ids/login'
    },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: Login,
    //   meta: {
    //     title: '登录'
    //   }
    // },
    {
      path: '/registered',
      name: 'registered',
      component: registered,
      meta: {
        title: '注册'
      }
    },
    {
      path: '/index',
      name: 'index',
      meta: {
        title: '首页',
        footVisible: true
      },
      component: index,
      children: []
    },
    {
      path: '/searchHistory',
      name: 'searchHistory',
      meta: {
        title: '搜索历史',
        footVisible: false
      },
      component: () => import('@/views/home/homeSearch/searchHistory.vue'),
      children: []
    },
    {
      path: '/searchList',
      name: 'searchList',
      meta: {
        title: '搜索列表',
        keepAlive: true,
        footVisible: false
      },
      component: () => import('@/views/home/homeSearch/searchList.vue'),
      children: []
    },
    {
      path: '/index/approvalCenter',
      name: 'approvalCenter',
      meta: {
        title: '审批中心',
        footVisible: false
      },
      component: approvalCenter,
      children: []
    },
    {
      path: '/index/messageCenter',
      name: 'messageCenter',
      meta: {
        title: '消息中心',
        keepAlive: true,
        footVisible: false
      },
      component: messageCenter,
      children: []
    },
    {
      path: '/index/Notice',
      name: 'Notice',
      meta: {
        title: '通知',
        keepAlive: true,
        footVisible: false
      },
      component: Notice,
      children: []
    },
    {
      path: '/index/addNotice',
      name: 'AddNotice',
      meta: {
        title: '通知',
        footVisible: false
      },
      component: AddNotice
    },
    {
      path: '/index/noticeDetails',
      name: 'noticeDetails',
      meta: {
        title: '通知',
        footVisible: false
      },
      component: noticeDetails
    },
    {
      path: '/index/AddMessage',
      name: 'AddMessage',
      meta: {
        title: '新增消息',
        footVisible: false
      },
      component: AddMessage
    },
    {
      path: '/index/messageCenter/messageDetails/:id',
      name: 'messageDetails',
      meta: {
        title: '详情',
        footVisible: false
      },
      component: messageDetails,
      children: []
    },
    {
      path: '/index/reportCenter',
      name: 'reportCenter',
      meta: {
        title: '汇报中心',
        footVisible: false
      },
      component: reportCenter
    },
    {
      path: '/addReport/:addType',
      name: 'addReport',
      meta: {
        title: '新增汇报',
        footVisible: false
      },
      component: addReport
    },
    {
      path: '/index/reportList/:reportType/:onMy',
      name: 'reportList',
      meta: {
        title: '所有汇报',
        footVisible: false
      },
      component: reportList
    },
    {
      path: '/contact',
      name: 'contact',
      meta: {
        title: '通讯录',
        footVisible: true
      },
      component: contact,
      children: []
    },
    {
      path: '/mine',
      name: 'mine',
      meta: {
        title: '个人中心',
        footVisible: true
      },
      component: mine,
      children: []
    },
    {
      path: '/userInfo',
      name: 'userInfo',
      meta: {
        title: '个人信息',
        footVisible: false
      },
      component: userInfo,
      children: []
    },
    {
      path: '/setName',
      name: 'setName',
      meta: {
        title: '英文名',
        footVisible: false
      },
      component: setName,
      children: []
    },
    {
      path: '/setPhone',
      name: 'setPhone',
      meta: {
        title: '手机号',
        footVisible: false
      },
      component: setPhone,
      children: []
    },
    {
      path: '/password',
      name: 'password',
      meta: {
        title: '忘记密码',
        footVisible: false
      },
      component: password,
      children: []
    },
    {
      path: '/selectRecipients',
      name: 'selectRecipients',
      meta: {
        title: '选择收件人',
        footVisible: false
      },
      component: selectRecipients,
      children: []
    },
    {
      path: '/dataSummary',
      name: 'dataSummary',
      meta: {
        title: '数据汇总',
        footVisible: false
      },
      component: dataSummary,
      children: [{
          path: '/dataSummary/ProjectComparison',
          name: 'ProjectComparison',
          meta: {
            title: '企业对比',
            footVisible: false
          },
          component: () => import('@/views/home/dataSummary/ProjectComparison.vue')
        },
        {
          path: '/dataSummary/ProjectData',
          name: 'ProjectData',
          meta: {
            title: '项目数据',
            footVisible: false
          },
          component: () => import('@/views/home/dataSummary/ProjectData.vue')
        },
        {
          path: '/dataSummary/ComparisonData',
          name: 'ComparisonData',
          meta: {
            title: '企业数据',
            footVisible: false
          },
          component: () => import('@/views/home/dataSummary/ComparisonData.vue')
        }
      ]
    },
    {
      path: '/approvalDetails',
      name: 'approvalDetails',
      meta: {
        title: '合同签订审批详情',
        footVisible: false
      },
      component: approvalDetails,
      children: []
    },
    {
      path: '/followRecordData',
      name: 'followRecordData',
      meta: {
        title: '审批跟进记录',
        footVisible: false
      },
      component: followRecordData,
      children: []
    },
    {
      path: '/recordData',
      name: 'recordData',
      meta: {
        title: '审批写跟进',
        footVisible: false
      },
      component: recordData,
      children: []
    },
    {
      path: '/contractTenancy',
      name: 'contractTenancy',
      meta: {
        title: '合同退租审批详情',
        footVisible: false
      },
      component: contractTenancy,
      children: []
    },
    {
      path: '/customApproval',
      name: 'customApproval',
      meta: {
        title: '非标通用审批详情',
        footVisible: false
      },
      component: customApproval,
      children: []
    },
    {
      path: '/approvalList',
      name: 'approvalList',
      meta: {
        title: '审批列表',
        keepAlive: true,
        footVisible: false
      },
      component: approvalList,
      children: []
    },
    {
      path: '/addApprovalList',
      name: 'addApprovalList',
      meta: {
        title: '新建审批',
        keepAlive: true,
        footVisible: false
      },
      component: addApprovalList,
      children: []
    },
    {
      path: '/addApproval',
      name: 'addApproval',
      meta: {
        title: '新建审批详情',
        footVisible: false
      },
      component: addApproval,
      children: []
    },
    {
      path: '/flowChart',
      name: 'flowChart',
      meta: {
        title: '流程图',
        footVisible: false
      },
      component: flowChart,
      children: []
    },
    {
      path: '/provisionalApproval',
      name: 'provisionalApproval',
      meta: {
        title: '新建非标审批',
        footVisible: false
      },
      component: provisionalApproval,
      children: [{
        path: '/provisionalApproval/selectApprover',
        name: 'selectApprover',
        meta: {
          title: '选择审批人',
          footVisible: false
        },
        component: selectApprover
      }]
    },
    // {
    //   path: '/selectApprover',
    //   name: 'selectApprover',
    //   meta: {
    //     title: '选择审批人',
    //     footVisible: false
    //   },
    //   component: selectApprover
    // },
    {
      path: '/rentControlChart',
      name: 'rentControlChart',
      meta: {
        title: '租控图',
        footVisible: false,
        keepAlive: true,
        isBack: false
      },
      component: rentControlChart,
      children: []
    },
    {
      path: '/customerPlan',
      name: 'customerPlan',
      meta: {
        title: '客户平面图',
        footVisible: false,
        keepAlive: true
      },
      component: customerPlan,
      children: []
    },
    {
      path: '/feesCollected',
      name: 'feesCollected',
      meta: {
        title: '费用收缴',
        footVisible: false
      },
      component: feesCollected,
      children: []
    },
    {
      path: '/tenantDetails',
      name: 'TenantDetails',
      meta: {
        title: '客户详情',
        footVisible: false
      },
      component: TenantDetails
    },
    {
      path: '/riskDetails',
      name: 'riskDetails',
      meta: {
        title: '风险详情',
        footVisible: false
      },
      component: riskDetails
    },
    {
      path: '/writeFollowup',
      name: 'WriteFollowup',
      meta: {
        title: '写跟进',
        footVisible: false
      },
      component: WriteFollowup
    },
    {
      path: '/tenantBillsList',
      name: 'tenantBillsList',
      meta: {
        title: '客户账单列表',
        footVisible: false,
        keepAlive: true,
        isBack: false
      },
      component: tenantBillsList,
      children: []
    },
    {
      path: '/billDetails/:billId',
      name: 'billDetails',
      meta: {
        title: '账单详情',
        footVisible: false
      },
      component: billDetails,
      children: []
    },
    {
      path: '/tenantBills/:id',
      name: 'tenantBills',
      meta: {
        title: '客户账单',
        footVisible: false
      },
      component: tenantBills,
      children: []
    },
    {
      path: '/storeList',
      name: 'storeList',
      meta: {
        title: '客户列表',
        keepAlive: true,
        footVisible: false
      },
      component: storeList,
      children: []
    },
    {
      path: '/housingHome',
      name: 'housingHome',
      meta: {
        title: '租赁房源',
        footVisible: false
      },
      component: housingHome,
      children: []
    },
    {
      path: '/storeDetails/:id',
      name: 'storeDetails',
      meta: {
        title: '房源详情',
        footVisible: false
      },
      component: storeDetails,
      children: []
    },
    {
      path: '/enteAddEdit',
      name: 'enteAddEdit',
      meta: {
        title: '房源详情',
        footVisible: false
      },
      component: enteAddEdit,
      children: []
    },
    {
      path: '/shopFollow',
      name: 'shopFollow',
      meta: {
        title: '房源跟进',
        footVisible: false
      },
      component: shopFollow,
      children: []
    },
    {
      path: '/interestedList',
      name: 'interestedList',
      meta: {
        title: '意向客户',
        keepAlive: true,
        footVisible: false
      },
      component: interestedList,
      children: []
    },
    {
      path: '/interestedFollow',
      name: 'interestedFollow',
      meta: {
        title: '写跟进',
        footVisible: false
      },
      component: interestedFollow,
      children: []
    },
    {
      path: '/contractList',
      name: 'contractList',
      meta: {
        title: '合同列表',
        footVisible: false,
        keepAlive: true,
        isBack: false
      },
      component: contractList,
      children: []
    },
    {
      path: '/addIntentionCustomers',
      name: 'addIntentionCustomers',
      meta: {
        title: '新增意向客户',
        footVisible: false
      },
      component: addIntentionCustomers,
      children: []
    },
    {
      path: '/CustomersDetails',
      name: 'CustomersDetails',
      meta: {
        title: '意向客户详情',
        footVisible: false
      },
      component: CustomersDetails,
      children: []
    },
    {
      path: '/RentRules',
      name: 'RentRules',
      meta: {
        title: '租金规则',
        footVisible: false
      },
      component: RentRules,
      children: []
    },
    {
      path: '/PropertyfeeRules',
      name: 'PropertyfeeRules',
      meta: {
        title: '物业费规则',
        footVisible: false
      },
      component: PropertyfeeRules,
      children: []
    },
    {
      path: '/contractBasicInfo',
      name: 'contractBasicInfo',
      meta: {
        title: '基本信息',
        footVisible: false
      },
      component: contractBasicInfo,
      children: []
    },
    {
      path: '/contractBillDetails',
      name: 'contractBillDetails',
      meta: {
        title: '账单信息',
        footVisible: false
      },
      component: contractBillDetails,
      children: []
    },
    {
      path: '/Inspection',
      name: 'Inspection',
      meta: {
        title: '检查',
        keepAlive: true,
        footVisible: false
      },
      component: () => import('@/views/home/propertyManagement/components/Inspection.vue'),
      children: []
    },
    {
      path: '/InspectionDetails',
      name: 'InspectionDetails',
      meta: {
        title: '详情',
        keepAlive: true,
        footVisible: false
      },
      component: () => import('@/views/home/propertyManagement/components/InspectionDetails.vue'),
      children: []
    },
    {
      path: '/addInspection',
      name: 'addInspection',
      meta: {
        title: '新增检查',
        footVisible: false
      },
      component: () => import('@/views/home/propertyManagement/components/addInspection.vue'),
      children: []
    },
    {
      path: '/RecordDetail',
      name: 'RecordDetail',
      meta: {
        title: '记录详情检查',
        footVisible: false
      },
      component: () => import('@/views/home/propertyManagement/components/RecordDetail.vue'),
      children: []
    },
    {
      path: '/repairList',
      name: 'repairList',
      meta: {
        title: '维修列表',
        keepAlive: true,
        footVisible: false
      },
      component: repairList,
      children: []
    },
    {
      path: '/repairDetails',
      name: 'repairDetails',
      meta: {
        title: '维修详情',
        footVisible: false
      },
      component: repairDetails,
      children: []
    },
    {
      path: '/maintainList',
      name: 'maintainList',
      meta: {
        title: '保养列表',
        keepAlive: true,
        footVisible: false
      },
      component: maintainList,
      children: []
    },
    {
      path: '/maintainDetails',
      name: 'maintainDetails',
      meta: {
        title: '保养详情',
        footVisible: false
      },
      component: maintainDetails,
      children: []
    },
    {
      path: '/addRepairs',
      name: 'addRepairs',
      meta: {
        title: '新增报修',
        footVisible: false
      },
      component: addRepairs,
      children: []
    },
    {
      path: '/addMaintain',
      name: 'addMaintain',
      meta: {
        title: '新增保养',
        footVisible: false
      },
      component: addMaintain,
      children: []
    },
    {
      path: '/addWeixiu',
      name: 'addWeixiu',
      meta: {
        title: '新增维修',
        footVisible: false
      },
      component: addWeixiu,
      children: []
    },
    {
      path: '/illuminatingSystem',
      name: 'illuminatingSystem',
      meta: {
        title: '照明系统',
        keepAlive: true,
        footVisible: false
      },
      component: () => import('@/views/home/propertyManagement/illuminatingSystem/index.vue'),
      children: []
    },
    {
      path: '/loop',
      name: 'loop',
      meta: {
        title: '回路',
        footVisible: false
      },
      component: () => import('@/views/home/propertyManagement/illuminatingSystem/loop/index.vue'),
      children: []
    },
    {
      path: '/addLoop',
      name: 'addLoop',
      meta: {
        title: '新增回路',
        footVisible: false
      },
      component: () => import('@/views/home/propertyManagement/illuminatingSystem/loop/components/addLoop.vue'),
      children: []
    },
    {
      path: '/detailsLoop',
      name: 'detailsLoop',
      meta: {
        title: '回路详情',
        footVisible: false
      },
      component: () => import('@/views/home/propertyManagement/illuminatingSystem/loop/components/detailsLoop.vue'),
      children: []
    },
    {
      path: '/group',
      name: 'group',
      meta: {
        title: '群组',
        footVisible: false
      },
      component: () => import('@/views/home/propertyManagement/illuminatingSystem/group/index.vue'),
      children: [

      ]
    },
    {
      path: '/addGroup',
      name: 'addGroup',
      meta: {
        title: '新增群组',
        footVisible: false
      },
      component: () => import('@/views/home/propertyManagement/illuminatingSystem/group/components/addGroup.vue'),
      children: []
    },
    {
      path: '/detailsGroup',
      name: 'detailsGroup',
      meta: {
        title: '群组详情',
        footVisible: false
      },
      component: () => import('@/views/home/propertyManagement/illuminatingSystem/group/components/detailsGroup.vue'),
      children: []
    },
    {
      path: '/lightingPlan',
      name: 'lightingPlan',
      meta: {
        title: '照明计划',
        footVisible: false
      },
      component: () => import('@/views/home/propertyManagement/illuminatingSystem/lightingPlan/index.vue'),
      children: []
    },
    {
      path: '/addLightingPlan',
      name: 'addLightingPlan',
      meta: {
        title: '新增照明计划',
        footVisible: false
      },
      component: () => import('@/views/home/propertyManagement/illuminatingSystem/lightingPlan/components/addLightingPlan.vue'),
      children: []
    },
    {
      path: '/detailsLightingPlan',
      name: 'detailsLightingPlan',
      meta: {
        title: '照明计划详情',
        footVisible: false
      },
      component: () => import('@/views/home/propertyManagement/illuminatingSystem/lightingPlan/components/detailsLightingPlan.vue'),
      children: []
    },
    {
      path: '/selectEquirement',
      name: 'selectEquirement',
      meta: {
        title: '选择设备',
        footVisible: false
      },
      component: selectEquirement,
      children: []
    },
    {
      path: '/projectInformation',
      name: 'projectInformation',
      meta: {
        title: '项目信息',
        footVisible: false,
        keepAlive: true,
        isBack: false
      },
      component: ProjectInformation
    },
    {
      path: '/competentDepartmentList',
      name: 'competentDepartmentList',
      meta: {
        title: '主管部门列表',
        footVisible: false
      },
      component: competentDepartmentList
    },
    {
      path: '/addCompetentDepartment',
      name: 'addCompetentDepartment',
      meta: {
        title: '新增主管部门',
        footVisible: false
      },
      component: addCompetentDepartment
    },
    {
      path: '/competentDepartmentDel',
      name: 'competentDepartmentDel',
      meta: {
        title: '查看主管部门',
        footVisible: false
      },
      component: competentDepartmentDel
    },
    {
      path: '/competentWriteFollow',
      name: 'competentWriteFollow',
      meta: {
        title: '主管部门写跟进',
        footVisible: false
      },
      component: competentWriteFollow
    },
    {
      path: '/engineeringList',
      name: 'engineeringList',
      meta: {
        title: '房源工程',
        keepAlive: true,
        footVisible: false
      },
      component: engineeringList
    },
    {
      path: '/engineeringDetails',
      name: 'engineeringDetails',
      meta: {
        title: '房源工程详情',
        footVisible: false
      },
      component: engineeringDetails
    },
    {
      path: '/projectDetail',
      name: 'projectDetail',
      meta: {
        title: '项目信息详情',
        footVisible: false
      },
      component: ProjectDetail
    },
    {
      path: '/building',
      name: 'building',
      meta: {
        title: '楼宇',
        footVisible: false,
        keepAlive: true,
        isBack: false
      },
      component: Building
    },
    {
      path: '/buildingDetails',
      name: 'buildingDetails',
      meta: {
        title: '楼宇',
        footVisible: false
      },
      component: BuildingDetails
    },
    {
      path: '/relatedInformation',
      name: 'relatedInformation',
      meta: {
        title: '',
        footVisible: false
      },
      component: RelatedInformation
    },
    {
      path: '/rIinterestedFollow',
      name: 'rIinterestedFollow',
      meta: {
        title: '',
        footVisible: false
      },
      component: RIinterestedFollow
    },
    {
      path: '/workingSchedule',
      name: 'workingSchedule',
      meta: {
        title: '',
        keepAlive: true,
        footVisible: false
      },
      component: workingSchedule
    },
    {
      path: '/personList',
      name: 'personList',
      meta: {
        title: '',
        keepAlive: true,
        footVisible: false
      },
      component: personList
    },
    {
      path: '/emergencyList',
      name: 'emergencyList',
      meta: {
        title: '',
        footVisible: false
      },
      component: emergencyList
    },
    {
      path: '/emergencyDetails/:id',
      name: 'emergencyDetails',
      meta: {
        title: '',
        footVisible: false
      },
      component: emergencyDetails
    },
    {
      path: '/emergencyAdd',
      name: 'emergencyAdd',
      meta: {
        title: '',
        footVisible: false
      },
      component: emergencyAdd
    },
    {
      path: '/classes',
      name: 'classes',
      meta: {
        title: '',
        footVisible: false
      },
      component: classes
    },
    {
      path: '/personDetails/:id',
      name: 'personDetails',
      meta: {
        title: '',
        footVisible: false
      },
      component: personDetails
    },
    {
      path: '/tenantList',
      name: 'tenantList',
      meta: {
        title: '',
        keepAlive: true,
        footVisible: false
      },
      component: tenantList
    },
    {
      path: '/clientListHome',
      name: 'clientListHome',
      meta: {
        title: '',
        keepAlive: true,
        footVisible: false
      },
      component: clientListHome
    },
    {
      path: '/repairsInfo',
      name: 'repairsInfo',
      meta: {
        title: '',
        keepAlive: true,
        footVisible: false
      },
      component: repairsInfo
    },
    {
      path: '/storeChart',
      name: 'storeChart',
      meta: {
        title: '',
        keepAlive: true,
        footVisible: false
      },
      component: storeChart
    },
    {
      path: '/NewTurnover',
      name: 'NewTurnover',
      meta: {
        title: '',
        footVisible: false
      },
      component: NewTurnover
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})
router.beforeEach((to, from, next) => {
  // 登录验证
  if (localStorage.getItem('user') || to.name === 'login' || to.name === 'password' || to.name === 'registered' || to.name === 'policyAgreement') {
    next()
  } else {
    next({
      path: '/login'
    })
  }
})
router.afterEach(route => {
  context.system.footVisible = route.meta.footVisible
  window.scrollTo(0, 0)
})
export default router
