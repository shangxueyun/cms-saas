<template>
  <div class="tenant-information tenantDetailsClass">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            :showEditBtn="showEdit"
            @on-edit="onEdit"
            @on-hide="onHide">
      <div class="tenant-details details-content clearfix"
           slot="drawer"
           style="padding-bottom: 0">
        <div class="tenantBillBtn"
             v-if="this.tenantDetail.usableContracts.length"
             @click="getContractsPrev">查看客户账单</div>
        <!-- <div class="add-contracts-btn">
          <el-dropdown>
            <el-button type="small"
                       class="cont-btn"
                       style="">
              发起合同<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="addshopContract"
                                v-if="addshopContractFlag">房源合同</el-dropdown-item>
              <el-dropdown-item @click.native="addMultiContract">多经合同</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div> -->
        <div class="tenantList"
             v-if="tenantList.length>1">
          <span v-for="(item,index) in tenantList"
                :key="item.id"
                :class="{'active':item.id === tenantDetail.id}"
                @click="tenantChange(item,index)">{{item.referred}}</span>
        </div>
        <div class="float-left"
             style="margin-top: 12px">
          <div class="headTabs">
            <div class="teant-name">
              <span>
                <i></i>
                <span>{{tenantDetail.teantName}}</span>
              </span>
              <!-- <span class="tip"
                    :class="tenantUseClass(tenantDetail.tenantUse)">{{tenantDetail.tenantUseDescription}}</span> -->
            </div>
            <div style="margin: 16px;margin-bottom: 0;padding-bottom:10px">
              <!-- <div class="imgwarp">
                <img v-if="tenantDetail.shopPhotos"
                     :src="tenantDetail.shopPhotos" />
                <img v-else
                     src="../../../../assets/berth-default.png" />
                <div class="project-state"
                     v-if="tenantDetail.useStatus === 'DISABLE'">
                  已停用
                </div>
              </div> -->
              <div class="tenant-title">
                <span class="tentTitle">统一社会信用代码</span><span class="tentDetail"
                      v-if="tenantDetail.creditCode">{{tenantDetail.creditCode}}</span>
              </div>
              <div class="tenant-title">
                <span class="tentTitle">企业类型</span><span class="tentDetail">{{customerTypeState(tenantDetail.customerType)}}</span>
              </div>
              <div class="tenant-title">
                <span class="tentTitle">企业性质</span><span class="tentDetail">{{tenantDetail.companyNatureDescription}}</span>
              </div>
              <div class="tenant-title">
                <span class="tentTitle">行业</span><span class="tentDetail">{{tenantDetail.standardIndustryName}}</span>
              </div>
              <div class="tenant-title">
                <span class="tentTitle">客户联系人</span><span class="tentDetail">{{tenantDetail.contact}}</span>
              </div>
              <div class="tenant-title">
                <span class="tentTitle">联系电话</span><span class="tentDetail">{{tenantDetail.telephone}}</span>
              </div>
              <!-- <div class="tenant-title">
                <span>客户名称</span><span :title="tenantDetail.teantName">{{tenantDetail.teantName}}</span>
              </div>
              <div class="tenant-title">
                <span>品牌名称</span><span>{{tenantDetail.referred}}</span>
              </div>
              <div class="tenant-title">
                <span>房源号</span>
                <span :title="shopNumber2">
                  {{formatshopNumber(tenantDetail.roomsList, 2)}}
                </span>
              </div>
              <div class="tenant-title">
                <span>用途</span><span>{{tenantDetail.tenantUseDescription}}</span>
              </div>
              <div class="tenant-title">
                <span>租赁面积</span><span v-show="tenantDetail.contractArea">{{tenantDetail.contractArea}}㎡</span>
              </div>
              <div class="tenant-title">
                <span>实时单价</span><span v-show="tenantDetail.contractPrice !== null">{{tenantDetail.contractPrice | toLocaleString}}元/㎡天</span>
              </div>
              <div class="tenant-title">
                <span>合同起止日</span><span v-show="tenantDetail.contractStartDate">{{tenantDetail.contractStartDate}}至{{tenantDetail.contractEndDate}}</span>
              </div>
              <div class="tenant-title"
                   style="padding-bottom: 10px;">
                <span>合同状态</span><span>{{formatterStatus(tenantDetail.contractStatus)}}</span>
              </div> -->
            </div>
          </div>
          <div class="headTabs headTabs2">
            <div class="teant-name clearfix">
              <span style="width:78%">
                <i></i>
                <span>客户简介</span>
              </span>
              <span class="iconfont icon-cms_bianji-"
                    @click="introEdit=!introEdit"
                    v-if="hasAuthority('02030105') && !introEdit">
                <span style="font-size:12px;margin-left:3px">编辑</span>
              </span>
            </div>
            <div class="content">
              <div class="item">
                <span>客户网站</span>
                <div>
                  <span v-if="!introEdit"
                        style="text-decoration: underline; color: #3575F6;cursor: pointer;word-break: break-all;"
                        @click="openUrl(tenantDetail.website)">
                    {{tenantDetail.website}}
                  </span>
                  <el-input v-else
                            size="small"
                            v-model="tenantDetail.website"
                            maxlength="50"></el-input>
                </div>
              </div>
              <div class="item">
                <span>客户简介</span>
                <div>
                  <div style="width:100%;word-wrap: break-word;word-break: normal;font-size: 14px;color: #262626;"
                       v-if="!introEdit"
                       v-html="formatreplace(tenantDetail.introduction)"></div>
                  <el-input v-else
                            type="textarea"
                            resize='none'
                            maxlength="200"
                            :rows='3'
                            placeholder="请输入内容(200字以内）"
                            v-model="tenantDetail.introduction">
                  </el-input>
                </div>
              </div>
              <div class="item">
                <span>档案文件</span>
                <div class="annexList">
                  <aliUpload class="aliUpload brief_intr"
                             v-if="introEdit"
                             upLoadText="上传附件"
                             businessType='project'
                             :fileType="fileType_cost"
                             :encrypt="true"
                             :iconShow="true"
                             @setAnnex="setAnnex" />
                  <div v-for="(item, index) in tenantDetail.annexes"
                       :key="index">
                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                          :title="item.annexName">{{item.annexName}}</span>
                    <span v-if="!introEdit"
                          style="display: flex;">
                      <ailPreview :ailObj="item"
                                  :encrypt="true"
                                  @setFile="setFile"
                                  style="display: inline-block;cursor: pointer;margin-bottom: 0" />
                      <aliDownLoad :item="item"
                                   :encrypt="true"
                                   style="display: inline-block;cursor: pointer;margin-bottom: 0" />
                    </span>
                    <i v-else
                       @click="deleFile(item, index)"
                       class="iconfont icon-lajixiang"></i>
                  </div>
                </div>
              </div>
              <!-- <div class="item"
                  style="flex-direction: row-reverse;flex-direction: row-reverse; min-height: auto;margin-bottom: 0;">
                <span class="intentional-cus"
                      @click="getYxTenant"
                      v-if="tenantDetail.yxTenantId">查看意向客户档案</span>
              </div> -->
              <div class="btn-wrap"
                   v-if="introEdit">
                <span class="details_cannelBtn"
                      @click="cancel()">取消</span>
                <span class="details_submitBtn"
                      @click="preservation()">保存</span>
              </div>
            </div>
          </div>
          <div class="headTabs">
            <div class="teant-name">
              <span>
                <i></i>
                <span>入驻信息</span>
              </span>
            </div>
            <div style="padding: 16px;margin-bottom: 0;padding-bottom:10px;overflow-y:auto;height: 230px"
                 class="scrollStyle">
              <div class="checkDataItem"
                   v-for="(item, index) in checkData"
                   :key="index">
                <div class="tenant-title">
                  <span class="tentTitle">管理企业</span><span class="tentDetail">{{item.enterpriseName}}</span>
                </div>
                <div class="tenant-title">
                  <span class="tentTitle">项目</span><span class="tentDetail"
                        v-if="item.projectName">{{item.projectName}}</span>
                </div>
                <div class="tenant-title">
                  <span class="tentTitle">楼宇</span><span class="tentDetail"
                        v-if="item.buildingName">{{item.buildingName}}</span>
                </div>
                <div class="tenant-title">
                  <span class="tentTitle">房源号</span><span class="tentDetail">{{item.shopNumber}}</span>
                </div>
                <div class="tenant-title">
                  <span class="tentTitle">房源面积（m²）</span><span class="tentDetail">{{item.buildingArea}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="main-content float-right">
          <div class="main-menu"
               style="margin-bottom: 10px;">
            <span v-for="item in tabArr"
                  :key="item.value"
                  @click="tabFun(item.value)"
                  v-show="tabShow(item.value)"
                  :class="tabActive === item.value ? 'active' : ''">{{item.label}}</span>
            <span class="editbtns"
                  v-if="showEditBtn && hasAuthority('02030105')">
              <i class="iconfont icon-cms_bianji-"
                 style="color:#3575F6;font-weight: normal;cursor:pointer;"
                 @click="editFn()"> 编辑</i>
            </span>
            <span @click="synchronization"
                  v-if="showSynchBtn"
                  style="cursor: pointer;float: right;margin-right: 20px;color: #3577f6;margin-top: 4px;">同步工商信息</span>
            <span @click="syncRisk"
                  v-if="showSyncRisk"
                  style="cursor: pointer;float: right;margin-right: 20px;color: #3577f6;margin-top: 4px;">同步风险信息</span>
          </div>
          <component :is="component"
                     :tenantDetail="tenantDetail"
                     :tabActive="tabActive"
                     @handleEdit="handleEdit"
                     ref="dynamicComponent"
                     v-on="$listeners"
                     v-if="tenantDetail"></component>
        </div>
        <div class="main-content float-right"
             style="height: auto">
          <div class="main-menu">
            <span v-for="item in botTabArr"
                  :key="item.value"
                  @click="botTabFun(item.value)"
                  v-show="botTab(item.value)"
                  :class="botTabActive === item.value ? 'active' : ''">{{item.label}}</span>
          </div>
          <component :is="botComponent"
                     :tenantDetail="tenantDetail"
                     :checkData='checkData'
                     :tabActive="botTabActive"
                     ref="dynamicComponent1"
                     v-on="$listeners"
                     @onHide="onHide"
                     @handleEdit="handleEdit"
                     v-if="tenantDetail"></component>
        </div>
      </div>
    </drawer>
    <!-- 图片预览 -->
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
    <potClienDtl v-if="detailsShow"
                 :detailsdrawershow="detailsShow"
                 :yxkhFrom="yxkhFrom"
                 :options2="options2"
                 :pageType="pageType"
                 :draweDetaileData="detaileData"
                 :timeLineListData="timeLineListData"
                 :isAllYXtenant="isAllYXtenant"
                 :project="project"
                 ref="potClienDtl"
                 @shopDetails="shopDetails"
                 @addFlowListSuccess="addFlowListSuccess"
                 @refreshList="refreshList"
                 @drawerClose="detailsClose" />

    <!-- 房源详情 组件 -->
    <storeDetailis :detailsdrawershow="storeDetailisShow"
                   :detailData="storeDetailisData"
                   :options1="options2"
                   @shopDetails="shopDetails"
                   ref="storeDetailis"
                   @drawerClose="storeDetailisHide" />

    <!-- |||||||||||||||||||||||||||客户账单|||||||||||||||||||||||||||||||||||||| -->
    <el-drawer :visible.sync="teantBillDrawerShow"
               :append-to-body="false"
               size="1500px"
               @close="onHide1"
               class="tenantBillsDraw">
      <div slot="title"
           class="drawerTitle">
        <p>客户账单详情</p>
      </div>
      <div class="drawBody content">
        <div class="sidebar">
          <el-collapse v-model="activeNames"
                       @change="collapseChange"
                       accordion>
            <el-collapse-item v-for="(item,index) in contractsPrevList"
                              :key="index"
                              :name="item.id+''">
              <template slot="title">
                <div class="collapseTitle">
                  <span>
                    <i></i>
                    {{item.tenant.teantName}}
                    <span v-if="item.prevId">（续）</span>
                  </span>
                </div>
              </template>
              <div class="collapseContent">
                <div class="item">
                  <div>合同编号:</div>
                  <div>{{item.contractNo}}</div>
                </div>
                <div class="item">
                  <div>合同开始时间:</div>
                  <div>{{item.startDate}}</div>
                </div>
                <div class="item">
                  <div>合同结束时间:</div>
                  <div>{{item.endDate}}</div>
                </div>
                <div class="item">
                  <div>项目:</div>
                  <div>{{item.projectManagement.referred}}</div>
                </div>
                <div class="item">
                  <div>楼宇:</div>
                  <div>{{formatBuildingName(item.buildings)}}</div>
                </div>
                <!-- <div class="item">
                  <div>房源号:</div>
                  <div :title="shopNumber">{{formatshopNumber(item.rooms, 1)}}</div>
                </div> -->
                <div class="item">
                  <div>客户联系人:</div>
                  <div>{{item.tenant.contact}}</div>
                </div>
                <div class="item">
                  <div>联系电话:</div>
                  <div>{{item.tenant.telephone}}</div>
                </div>
                <div class="item">
                  <div>开户银行:</div>
                  <div>{{item.tenant.depositBank}}</div>
                </div>
                <div class="item">
                  <div>银行账号:</div>
                  <div>{{item.tenant.bankAccount}}</div>
                </div>
                <div class="item">
                  <div>纳税人识别号:</div>
                  <div>{{item.tenant.taxNo}}</div>
                </div>
                <div class="item">
                  <div>电话:</div>
                  <div>{{item.tenant.phone}}</div>
                </div>
                <div class="item">
                  <div>开票地址:</div>
                  <div :title="item.tenant.taxAddress">{{item.tenant.taxAddress}}</div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="min_content">
          <div class="currentBill">
            <p class="title"
               style="width:100%">
              <span>
                <i></i>
                当前账单
              </span>
              <span>
                <span class="produceBtn"
                      @click="onlineNotification">在线通知</span>
                <span class="produceBtn"
                      @click="OrderListShow"
                      v-if="hasAuthority('02030321')">生成通知单</span>
              </span>
              <!-- <span class="produceBtn" @click="OrderListShow" v-if="hasAuthority('02030321')">生成通知单</span> -->
            </p>
            <div class="tableList details_table">
              <el-table :data="tableData"
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                        ref="multipleTable">
                <!-- <el-table :data="tableData"
                        style="width: 100%"
                        ref="multipleTable"> -->
                <el-table-column type="selection"
                                 width="55"></el-table-column>
                <el-table-column prop="code"
                                 label="账单编号"
                                 align="center"
                                 show-overflow-tooltip
                                 width="200px"></el-table-column>
                <el-table-column prop="feeTypeName"
                                 label="费用类型"
                                 align="center"></el-table-column>
                <el-table-column label="账单金额"
                                 align="center">
                  <template slot-scope="scope">{{ scope.row.amount | toLocaleString }}<span v-if="scope.row.remake && scope.row.feeTypeName === '租金保证金'">{{ scope.row.remake }}</span></template>
                </el-table-column>
                <el-table-column label="计费周期"
                                 align="center"
                                 width="200px">
                  <template slot-scope="scope">
                    <div>{{ scope.row.startDate }}~{{ scope.row.endDate }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="finalPaymentDate"
                                 label="应收时间"
                                 align="center"
                                 show-overflow-tooltip
                                 width="100px">
                  <template slot-scope="scope">
                    <div>{{ scope.row.finalPaymentDate }}</div>
                    <div v-if="scope.row.onExpected"
                         style="color:red">已逾期{{scope.row.expectedDay}}天</div>
                  </template>
                </el-table-column>
                <el-table-column label="账单状态"
                                 align="center"
                                 prop="billStatusName"></el-table-column>
                <el-table-column label="打印次数"
                                 align="center"
                                 prop="noticeNum"></el-table-column>
                <el-table-column label="最后推送时间"
                                 align="center"
                                 width="140px"
                                 :formatter="formatterTime"
                                 prop="pushTime"></el-table-column>
                <el-table-column width="100"
                                 label="操作"
                                 align="center">
                  <template slot-scope="scope">
                    <el-button @click="handleEdit1(scope.$index, scope.row)"
                               class="el-button--primary operation-btn"
                               size="mini">查看</el-button>
                    <!-- <el-button v-if="hasAuthority('02030321')"
                               @click="OrderListShow(scope.row)"
                               class="el-button--primary operation-btn"
                               size="mini">生成通知单</el-button> -->
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="ctc-foot">
              <span><span style="margin-right:10px">{{currentPage}}/{{totalPages}}页</span> 共{{total}}条记录</span>
              <el-pagination v-if="total > 0"
                             background
                             layout="prev, pager, next"
                             :page-size="pgSize"
                             :total="total"
                             :current-page="currentPage"
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
          </div>
          <div class="historyBill">
            <p class="title"
               style="width:100%">
              <span :class="{'active':billTime==='HISTORY'}"
                    @click="billTypeChange('HISTORY')">历史账单</span>
              <span :class="{'active':billTime==='FUTURE'}"
                    @click="billTypeChange('FUTURE')">预期账单</span>
            </p>
            <div class="seachDiv">
              <div style="display: flex;align-items: center;">
                <el-select v-model="billsType"
                           style="width:250px;margin-right:20px;"
                           clearable
                           size="small"
                           placeholder="选择费用类型">
                  <el-option v-for="item in options3"
                             :key="item.id"
                             :label="item.value"
                             :value="item.id">
                  </el-option>
                </el-select>
                <div class="marginRights marginNone">
                  <el-date-picker v-model="startDate"
                                  v-if="billTime==='HISTORY'"
                                  type="date"
                                  size="small"
                                  value-format="yyyy-MM-dd"
                                  placeholder="开始时间"
                                  :editable="false"
                                  :clearable="false"
                                  :picker-options="pickerBeginDateBefore">
                  </el-date-picker>
                  <el-date-picker v-model="startDate1"
                                  v-if="billTime==='FUTURE'"
                                  type="date"
                                  size="small"
                                  value-format="yyyy-MM-dd"
                                  placeholder="开始时间"
                                  :editable="false"
                                  :picker-options="pickerBeginDateBefore1"
                                  :clearable="false">
                  </el-date-picker>
                </div>
                <div class="split"
                     style="margin:0 4px;color:#e5e5e5">-</div>
                <div class="marginRights">
                  <el-date-picker v-model="endDate"
                                  v-if="billTime==='HISTORY'"
                                  type="date"
                                  size="small"
                                  value-format="yyyy-MM-dd"
                                  placeholder="结束时间"
                                  :editable="false"
                                  :clearable="false"
                                  :picker-options="pickerBeginDateAfter">
                  </el-date-picker>
                  <el-date-picker v-model="endDate1"
                                  type="date"
                                  size="small"
                                  v-if="billTime==='FUTURE'"
                                  value-format="yyyy-MM-dd"
                                  placeholder="结束时间"
                                  :editable="false"
                                  :clearable="false">
                  </el-date-picker>
                </div>
                <div class="query-btn"
                     @click="querySeach"
                     style="margin-top:0">查询</div>
              </div>
              <!-- <div class="btnDiv">
                  <span class="iconfont icon-liebiao401" :class="{'active':showType === 1}" title="展示表格" @click="changeShowType(1)"></span>
                  <span class="iconfont icon-tubiao" :class="{'active':showType === 2}" title="展示柱状图" @click="changeShowType(2)"></span> 
                </div> -->
            </div>
            <div class="tableList details_table"
                 style="margin-top:0"
                 v-show="showType===1">
              <el-table :data="tableData1"
                        style="width: 100%">
                <el-table-column prop="code"
                                 label="账单编号"
                                 align="center"
                                 show-overflow-tooltip
                                 width="200px"></el-table-column>
                <el-table-column prop="feeTypeName"
                                 label="费用类型"
                                 align="center"></el-table-column>
                <el-table-column label="账单金额"
                                 align="center">
                  <template slot-scope="scope">{{ scope.row.amount | toLocaleString }}<span v-if="scope.row.remake && scope.row.feeTypeName === '租金保证金'">{{ scope.row.remake }}</span></template>
                </el-table-column>
                <el-table-column label="计费周期"
                                 align="center"
                                 width="200px">
                  <template slot-scope="scope">
                    <div>{{ scope.row.startDate }}~{{ scope.row.endDate }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="finalPaymentDate"
                                 label="应收时间"
                                 align="center"
                                 width="200px"
                                 show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div>{{ scope.row.finalPaymentDate }}</div>
                    <div v-if="scope.row.onExpected"
                         style="color:red">已逾期{{scope.row.expectedDay}}天</div>
                  </template>
                </el-table-column>
                <el-table-column prop="receivedDate"
                                 v-if="billTime==='HISTORY'"
                                 label="实收时间"
                                 align="center"
                                 width="200px"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="账单状态"
                                 align="center"
                                 prop="billStatusName"></el-table-column>
                <el-table-column label="操作"
                                 align="center"
                                 v-if="hasAuthority('02030306')">
                  <template slot-scope="scope">
                    <el-button @click="handleEdit1(scope.$index, scope.row)"
                               class="el-button--primary operation-btn"
                               size="mini">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="ctc-foot"
                 v-show="showType===1">
              <span><span style="margin-right:10px">{{currentPage1}}/{{totalPages1}}页</span> 共{{total1}}条记录</span>
              <el-pagination v-if="total > 0"
                             background
                             layout="prev, pager, next"
                             :page-size="pgSize1"
                             :total="total1"
                             :current-page="currentPage1"
                             @current-change="current_change1">
              </el-pagination>
              <div class="pagingnum">
                显示 <select v-model="pgSize1"
                        @change="currentSel1">
                  <option v-for="item in pgNumoptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                  </option>
                </select>
                条目
              </div>
            </div>
            <div class="chart"
                 v-show="showType===2">
              <div id="myChart"
                   :style="{width: '100%', height: '90%'}"></div>
            </div>
            <div style="min-height:200px;position:relative"
                 v-show="chartData.length===0 && showType===2">
              <div class="nodata">暂无数据</div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
    <!-- 选择通知单-->
    <el-drawer :visible.sync="orderListdrawershow"
               :append-to-body="true"
               size="600px"
               @close="onHideOrderList"
               class="orderListdrawer">
      <div slot="title"
           class="drawerTitle">
        <p>选择通知单</p>
      </div>
      <div class="orderList_content"
           style="border:1px solid #eee;">
        <el-table :data="orderListData"
                  style="width: 100%"
                  :row-key="getRowKeys"
                  :expand-row-keys="expands">
          <el-table-column type="expand"
                           width="40px">
            <template slot-scope="props">
              <div v-for="(item,index) in props.row.custom"
                   :key=index
                   style="height:40px;padding:0 10px;margin-bottom: 10px;">
                <span>{{nameFoemat(item.name)}}<i style="color:red">*</i> ：</span>
                <el-input v-model="item.val"
                          style="width:200px"
                          onkeyup="this.value=this.value.replace(/^\s+|\s+$/g,'')"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name"
                           label="通知单名称"
                           align="center"></el-table-column>
          <el-table-column label="操作"
                           align="center">
            <template slot-scope="scope">
              <span @click="creatModel(scope.$index, scope.row)"
                    class="el-button--primary generate-btn">逐条生成</span>
              <span class="left-border"
                    v-if="scope.row.billNoticeType === 'MERGE'"></span>
              <span @click="creatModel(scope.$index, scope.row, 'merge')"
                    v-if="scope.row.billNoticeType === 'MERGE'"
                    class="el-button--primary generate-btn">合并生成</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div @click="onHideOrderList"
           class="onHideOrderList">关闭</div>
    </el-drawer>
    <!-- 账单详情 -->
    <billDetails :detailsdrawershow="billDetailsdrawershow"
                 :detailsData="builddetailsData"
                 :queryBillId="queryBillId"
                 :reductionData="reductionData"
                 @drawerClose="drawerClose"
                 @handleEdit="handleEditEmit"
                 ref="billDetail" />
    <!-- 提示 -->
    <el-dialog v-if="showNotif"
               title="提示"
               width="500px"
               :visible.sync="showNotif"
               :close-on-click-modal="false"
               class="flowDialog1 el_dialog_new">
      <div class="dialog_content">
        <div>您已选择：</div>
        <div v-for="(item, index) in multipleSelection"
             :key="index">
          {{item.feeTypeName}}，{{item.startDate}}~{{item.endDate}}，已逾期<span>{{item.expectedDay || 0}}</span>天；
        </div>
        <div>是否确认推送？</div>
      </div>
      <div slot="footer"
           class="slotfooter">
        <span @click="showNotif = false"
              class="details_cannelBtn">取消</span>
        <span @click="determineNotif"
              class="details_submitBtn">确定</span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import Drawer from '@/components/drawer.vue'
import overview from './overview.vue'
import followUpRecord from './followUpRecord.vue'
import billRecord from './billRecord.vue'
import activity from './activity.vue'
import contractInfor from './contractInfor.vue'
import businessData from './businessData.vue'
import revenueData from './revenueData.vue'
import operateData from './operateData.vue'
import tenantFiles from './tenantFiles.vue'
import businessInfor from './businessInfor.vue'
import riskAssessment from './riskAssessment.vue'
import certification from './certification.vue'
import payInfo from './payInfo.vue'
import marketData from './marketData.vue'
import marketPersonnel from './marketPersonnel.vue'
import statisticalReportForms from './statisticalReportForms.vue'
import potClienDtl from '@/views/financialManagement/mnangement/potlClientsList/components/potClienDtl.vue'
import billDetails from '@/views/operations/costCollection/billList/components/billDetails.vue'
import storeDetailis from '@/views/project/housingList/components/storeDetailis'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import ailPreview from '@/components/ailPreview.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import { decrypt } from '@/utils/validate'
export default {
  components: {
    Drawer,
    storeDetailis,
    overview,
    billDetails,
    followUpRecord,
    billRecord,
    activity,
    revenueData,
    operateData,
    contractInfor,
    businessData,
    tenantFiles,
    businessInfor,
    potClienDtl,
    statisticalReportForms,
    aliUpload,
    ailPreview,
    riskAssessment,
    picturePrevie,
    certification,
    payInfo,
    marketData,
    marketPersonnel,
    aliDownLoad
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    tenantDetail: {
      type: Object,
      default: { annexes: [] }
    },
    tenantList: {
      type: Array,
      default: function () {
        return []
      }
    },
    checkData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  watch: {
    detailsdrawershow: {
      handler: function (val, oldval) {
        if (val) {
          this.readOnly = true
          this.tabActive = 1
          this.botTabActive = 3
          this.component = 'tenantFiles'
          // this.botComponent = 'statisticalReportForms'
          this.botComponent = 'revenueData'
          this.queryContracts() // 查询是否有增加房源合同权限
        }
      }
    }
  },
  data () {
    return {
      showNotif: false,
      num: 0,
      showPicture: false,
      imgArr: [],
      roomsList: [],
      fileType_cost: [],
      introEdit: false, // 简介编辑状态
      storeDetailisData: {
        imgUrls: [],
        projectManagement: {
          projectName: ''
        },
        building: {},
        floor: {}
      },
      storeDetailisShow: false,
      billTime: 'HISTORY', // 历史未来账单
      expands: [],
      loading: false,
      jobOrderIds: [], // 生成通知单的账单对应ids
      orderListData: [],
      orderListdrawershow: false,
      multipleSelection: [],
      chartData: [],
      teantBillDrawerShow: false,
      builddetailsData: {}, // 账单详情
      billDetailsdrawershow: false,
      queryBillId: '',
      reductionData: {},
      // tenantList: [],
      yxData: { annexes: [] }, // 意向客户数据
      component: 'tenantFiles',
      // botComponent: 'statisticalReportForms',
      botComponent: 'revenueData',
      drawerTitle: '客户详情',
      detaileData: {
        projectManagementDTO: {
          projectName: ''
        }
      },
      activeNames: ['1'],
      activeName: 1,
      timeLineListData: [],
      options2: [],
      yxkhFrom: [], // 客户来源列表
      pageType: 'add',
      isAllYXtenant: false,
      showEdit: false,
      detailsShow: false, // 侧边弹窗
      project: [], // 工程条件列表
      yearsList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      yearsListId: '',
      tabArr: [
        { label: '跟进记录', value: 0 },
        { label: '客户档案', value: 1 },
        { label: '开票信息', value: 2 },
        { label: '工商信息', value: 3 },
        { label: '风险扫描', value: 4 },
        { label: '相关资质', value: 5 },
        { label: '菜场配置', value: 6 }
      ],
      botTabArr: [
        // { label: '费用统计', value: 0 },
        { label: '合同列表', value: 1 },
        { label: '营业数据', value: 2 },
        { label: '税收数据', value: 3 },
        { label: '经营数据', value: 4 },
        { label: '营业数据', value: 5 }, // 菜场营业数据
        { label: '人员管理', value: 6 } // 菜场人员
      ],
      tabActive: 1,
      botTabActive: 3,
      building: { // 房源房源信息
      },
      options3: [],
      options4: [
        { label: '元/m²·天', value: 'M2DAYS' },
        { label: '元/月', value: 'M2MONTH' }
      ],
      projectManagemenId: '',
      addParmas: {
        projectManagementDTO: '', // 项目ID
        customerType: 'COMPANY', // 意向客户类型*
        yxTenantName: '', // 客户名称/姓名
        referred: '', // 品牌名称
        industryId: '', // 行业ID
        industryName: '', // 行业名
        lowArea: '', // 需求面积小
        highArea: '',
        lowPrice: '', // 心理价位小
        highPrice: '',
        priceUnit: 'M2DAYS', // 价格单位
        signDate: '', // 预计开店时间
        contact: '', // 联系人
        telephone: '', // 联系电话
        customerSource: '', // 客户来源
        customerSourceId: '', // 客户来源id
        remark: '', // 客户备注
        annexes: [ // 附件
        ],
        projectConditions: [ // 工程条件   projectType工程类型 (KWH用电量, SWWER排污水, WASTE_WATER排废水, FEED_WATER给水, AIR_CONDITION空调, OIL_DIAIN排油, FLUE烟道, CAS燃气)
          // {projectType: '', needValue: ''}
        ]
      },
      yxTenantDTOStorage: '', // 意向客户信息
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
      addshopContractFlag: false,
      contractsPrevList: [], // 续签合同列表
      showType: 1,
      contractId: '', // 合同
      billsType: '',
      tableData: [],
      tableData1: [],
      startEndTime: [],
      startDate: '',
      endDate: '',
      currentPage: 1,
      currentPage1: 1,
      total: 0,
      total1: 0,
      totalPages: 1,
      totalPages1: 1,
      pgSize: 15,
      pgSize1: 15,
      shopNumber: '',
      shopNumber2: '',
      pickerBeginDateBefore: {
        disabledDate: time => {
          let endDateVal = this.endDate
          if (endDateVal) {
            let temp = new Date(endDateVal).getTime() - 365 * 24 * 60 * 60 * 1000
            return time.getTime() < new Date(temp).getTime()
          }
        }
      },
      pickerBeginDateBefore1: {
        disabledDate: time => {
          let endDateVal = this.startDate1
          if (endDateVal) {
            let temp = new Date(endDateVal).getTime()
            return time.getTime() < new Date(temp).getTime() - 24 * 60 * 60 * 1000
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: time => {
          let beginDateVal = this.startDate
          if (beginDateVal) {
            let temp = new Date(beginDateVal).getTime() + 364 * 24 * 60 * 60 * 1000
            return time.getTime() > new Date(temp).getTime()
          }
        }
      },
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
      startDate1: '',
      endDate1: '',
      showEditBtn: true,
      showSyncRisk: false,
      showSynchBtn: false,
      projectManagementId: '' // 项目
    }
  },
  created () {
    this.options2 = this.$store.state.projectManagementsList
    this.customerSource()
    // this.getProjectList()
    if (this.tenantDetail.yxTenantId) {
      this.getYxData(this.tenantDetail.yxTenantId)
    }
    // this.tenantList = this.tenantDetail
    this.getFeeType()

    let now = new Date()
    let next = new Date()
    this.startDate = now.getFullYear() + '-01-01'
    this.endDate = this.getCurrentMonthLastDay()
    this.startDate1 = this.getNextMonth(this.formatDate(now))
    // this.endDate1 = this.getCurrentMonthLastDay1()

    let roomsList = this.tenantDetail.roomsList
    if (roomsList.length > 2) {
      this.roomsList = roomsList.slice(0, 2)
    } else {
      this.roomsList = roomsList
    }
  },
  mounted () {
    this.tenantId = this.tenantDetail.id
  },
  methods: {
    customerTypeState (val) {
      if (val) {
        if (val === 'COMPANY') {
          return '法人单位'
        } else if (val === 'PERSONAL') {
          return '个体户'
        } else if (val === 'BRANCH') {
          return '分支机构'
        } else if (val === 'OTHER') {
          return '其他单位'
        } else {
          return ''
        }
      }
    },
    tenantUseClass (tenantUse) {
      return tenantUse
    },
    tabShow (val) {
      if (val === 5 || val === 6) {
        if (this.tenantDetail.tenantUse === 'MARKET') {
          return true
        } else {
          return false
        }
      }
      return true
    },
    botTab (val) {
      // { label: '合同列表', value: 1 },
      // { label: '营业数据', value: 2 },
      // { label: '税收数据', value: 3 },
      // { label: '经营数据', value: 4 },
      // { label: '营业数据', value: 5 }, // 菜场营业数据
      // { label: '人员管理', value: 6 } // 菜场人员
      if (val === 2 || val === 3 || val === 4 || val === 5 || val === 6) {
        if (this.tenantDetail.tenantUse === 'SHOP' && val === 2) {
          return true
        } else if (this.tenantDetail.tenantUse === 'WORK' && (val === 3 || val === 4)) {
          return true
        } else if (this.tenantDetail.tenantUse === 'MARKET' && (val === 5 || val === 6)) {
          return true
        } else {
          return false
        }
      }
      return true
    },
    pictureClose () {
      this.showPicture = false
    },
    setFile (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    cancel () {
      this.introEdit = false
      this.$emit('handleEdit', 0, this.tenantDetail)
    },
    decryptMsg (val) {
      return decrypt(val)
    },
    preservation () {
      if (this.tenantDetail.iDNumber) {
        this.tenantDetail.iDNumber = this.decryptMsg(this.tenantDetail.iDNumber)
      }
      if (this.tenantDetail.building && !this.tenantDetail.building.id) {
        this.tenantDetail.building = null
      }
      context.http.put('/cms/api/tenant', this.tenantDetail).then(res => {
        if (res.status === 200) {
          this.$message.success('保存成功')
          this.introEdit = false
        }
      })
    },
    formatterStatus (status) {
      let contractStatus
      if (status === 'STORAGE') {
        contractStatus = '暂存'
      } else if (status === 'PENDING') {
        contractStatus = '待执行'
      } else if (status === 'EXECUTING') {
        contractStatus = '执行中'
      } else if (status === 'ZH_APPROVAL') {
        contractStatus = '招商审核中'
      } else if (status === 'TZ_APPROVAL') {
        contractStatus = '退租审核中'
      } else if (status === 'WITHDRAWAL') {
        contractStatus = '已退租'
      } else if (status === 'XQ_APPROVAL') {
        contractStatus = '续签审核中'
      } else if (status === 'NO') {
        contractStatus = '审核未通过'
      } else if (status === 'MATURITY') {
        contractStatus = '到期未处理'
      }
      return contractStatus
    },
    setAnnex (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.tenantDetail.annexes.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
      this.$forceUpdate()
    },
    addFlowListSuccess (data) { // 新增跟进成功 参数为跟进信息
      this.timeLineListData = data
    },
    storeDetailisHide () {
      this.detailsShow = true
      this.storeDetailisShow = false
    },
    shopDetails (roomId) {
      context.http.get('/cms/api/rooms/' + roomId).then(res => {
        if (res.status === 200) {
          this.storeDetailisData = res.data
          this.storeDetailisShow = true
          this.detailsShow = false // 关闭意向客户详情弹窗
        }
      })
    },
    formatDate (date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    },
    formatterTime (row, column) {
      if (row.pushTime) {
        return row.pushTime.replace('T', '  ')
      }
    },
    getNextMonth (date) {
      var arr = date.split('-')
      var year = arr[0] // 获取当前日期的年份
      var month = arr[1] // 获取当前日期的月份
      var day = arr[2] // 获取当前日期的日
      var days = new Date(year, month, 0)
      days = days.getDate() // 获取当前日期中的月的天数
      var year2 = year
      var month2 = parseInt(month) + 1
      if (month2 === 13) {
        year2 = parseInt(year2) + 1
        month2 = 1
      }
      var day2 = day
      var days2 = new Date(year2, month2, 0)
      days2 = days2.getDate()
      if (day2 > days2) {
        day2 = days2
      }
      if (month2 < 10) {
        month2 = '0' + month2
      }

      var t2 = year2 + '-' + month2 + '-' + '01'
      var year3 = Number(year2) + 1
      this.endDate1 = year3 + '-' + month2 + '-' + '01'
      return t2
    },
    getCurrentMonthLastDay () {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      var day = new Date(year, month, 0)
      return year + '-' + month + '-' + day.getDate()
    },
    getCurrentMonthLastDay1 () {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      var day = date.getDate()
      return year + '-' + month + '-' + day
    },
    async getFeeType () {
      let result = await context.http.get('/uaa/api/paramet-managements/name', { name: '费用类型' })
      this.options3 = result.data
    },
    openUrl (url) {
      if (url.indexOf('https://') === -1) {
        window.open('https://' + url)
      } else {
        window.open(url)
      }
    },
    appendUploadTips () {
      let style = 'position: fixed; left: 0; right: 0; top: 0; bottom: 0; margin: auto; display: inline-block; width: 260px; height: 50px; line-height: 50px; text-align: center; background-color: rgba(0, 0, 0, .6); color: #fff; border-radius: 5px;font-size: 16px;'
      let tipDom = `<div id="tipDom" class="tipDom" style="position: fixed; left: 0; right: 0; top: 0; bottom: 0; margin: auto;z-index: 9999999999; "><span class="pulseAni" style="${style}"><i class="el-icon-loading" style="margin-right:15px"></i>生成中... 请稍等</span></div>`
      $('body').append(tipDom)
    },
    // 获取row的key值
    getRowKeys (row) {
      return row.id
    },
    nameFoemat (name) {
      return name.substring(2, name.length - 1)
    },
    creatModel (index, row, type) { // 生成通知单
      if (this.loading) {
        return
      }
      this.loading = true
      let params = {}
      let keywords = []
      row.custom.forEach(res => {
        keywords.push({ 'name': res.name, 'val': res.val })
      })
      for (var i = 0; i < keywords.length; i++) {
        if (!keywords[i].val || keywords[i].val === '') {
          this.$message({
            type: 'error',
            message: '请输入关键词的值'
          })
          this.expands = []
          this.expands.push(this.orderListData[index].id)
          this.loading = false
          return
        }
      }
      this.appendUploadTips()
      params.keywords = keywords
      params.billIds = this.jobOrderIds
      if (type === 'merge') {
        context.http.post(`/cms/api/billNoticeRecord/${row.id}/merge`, params).then(res => {
          if (res.status === 200) {
            this.queryExportResult(res.data.id)
          }
        }).catch(error => {
          $('#tipDom').remove()
          this.loading = false
          console.log(error)
        })
      } else {
        context.http.post(`/cms/api/billNoticeRecord/${row.id}/produce`, params).then(res => {
          if (res.status === 200) {
            this.queryExportResult(res.data.id)
          }
        }).catch(error => {
          $('#tipDom').remove()
          this.loading = false
          console.log(error)
        })
      }
    },
    queryExportResult (id) {
      context.http.get(`/cms/api/bill-excel/detail?excelId=${id}`).then(res => {
        if (res.data.excelResult === '审核中') {
          setTimeout(res => {
            this.queryExportResult(id)
          }, 5000)
        } else if (res.data.excelResult === '失败') {
          $('#tipDom').remove()
          this.loading = false
          this.$message({
            type: 'error',
            message: res.data.remark
          })
        } else {
          this.loading = false
          context.http.get(`/cms/api/file/getUrl?fileName=${res.data.remark}`).then(result => {
            this.getBiils(this.contractId)
            $('#tipDom').remove()
            window.open(result.data)
          })
        }
      })
    },
    OrderListShow (row) { // 获取对应项目通知单列表
      if (!this.multipleSelection.length) {
        this.$message({
          type: 'error',
          message: '请先选择账单，再点击生成通知单'
        })
        return
      }
      // console.log(row)
      this.jobOrderIds = []
      this.multipleSelection.forEach(ele => {
        this.jobOrderIds.push(ele.id)
      })
      // this.jobOrderIds.push(row.id)
      context.http.get('/cms/api/billNoticeTemp?sort=projectManagement,asc&sort=createdDate,desc',
        { projectManagementId: this.tenantDetail.projectManagement.id, billNoticeStatus: 'USING' }).then(res => {
          this.orderListData = res.data
          this.orderListdrawershow = true
        })
    },
    onHideOrderList () { // 通知单关闭
      this.orderListdrawershow = false
    },
    handleEdit1 (index, row) { // 账单详情
      context.http.get(`cms/api/bills/${row.id}`).then(res => {
        this.teantBillDrawerShow = false
        this.builddetailsData = res.data
        this.billDetailsdrawershow = true
        this.queryBillId = row.id.toString()
      })
    },
    async handleEditEmit (index, row) {
      let result = await context.http.get(`cms/api/bills/${row.id}`)
      this.builddetailsData = JSOG.decode(result.data)
      this.billDetailsdrawershow = true
    },
    formatBuildingName (buildingNameArr) {
      let arr = buildingNameArr.map((item, index) => {
        return item.buildingName
      })
      return arr.join('、')
      // let arr = []
      // let ids = []
      // buildingNameArr.forEach(item => {
      //   if (ids.indexOf(item.building.id) === -1) {
      //     arr.push(item.building.buildingName)
      //     ids.push(item.building.id)
      //   }
      // })
      // return arr.join('、')
    },
    formatshopNumber (shopNumberArr, type) {
      let arr = []
      shopNumberArr.forEach(item => {
        arr.push(item.shopNumber)
      })
      if (type === 1) {
        this.shopNumber = arr.join('、')
      } else {
        this.shopNumber2 = arr.join('、')
      }
      return arr.join('、')
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
      // return true
    },
    querySeach () {
      if (this.showType === 1) {
        this.getBiils_history(this.contractId)
      } else {
        this.query()
      }
    },
    currentSel () {
      this.currentPage = 1
      this.getBiils(this.contractId)
    },
    currentSel1 () {
      this.currentPage1 = 1
      this.getBiils_history(this.contractId)
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.getBiils(this.contractId)
    },
    current_change1 (currentPage) {
      this.currentPage1 = currentPage
      this.getBiils_history(this.contractId)
    },
    collapseChange (contractsId) {
      if (contractsId === '') {
        return
      }
      this.showType = 1
      this.contractId = contractsId
      let id = contractsId + ''
      this.getBiils(id)
      this.getBiils_history(id)
    },
    getContractsPrev () { // 根据合同id查询存在续签关系的合同
      if (this.tenantDetail.usableContracts.length) {
        context.http.get(`cms/api/contracts/prev`, { contractId: this.tenantDetail.usableContracts[0].id }).then(res => {
          this.contractsPrevList = res.data
          this.contractId = res.data[0].id
          this.activeNames = res.data[0].id + ''
          this.getBiils(this.contractId)
          this.getBiils_history(this.contractId)
          this.teantBillDrawerShow = true
        }).catch(error => {
          console.log(error)
        })
      }
    },
    async getBiils (id) {
      let result = await context.http.get('cms/api/bills/contract', {
        contractId: id,
        queryType: 'CURRENT',
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'finalPaymentDate,asc'
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    async getBiils_history (id) {
      let startDate, endDate
      if (this.billTime === 'HISTORY') {
        startDate = this.startDate
        endDate = this.endDate
      } else {
        startDate = this.startDate1
        endDate = this.endDate1
      }
      let result = await context.http.get('cms/api/bills/contract',
        {
          contractId: id,
          queryType: this.billTime,
          feeType: this.billsType,
          startDate: startDate,
          endDate: endDate,
          sort: 'finalPaymentDate,asc',
          page: (this.currentPage1 - 1),
          size: this.pgSize1
        })
      this.tableData1 = result.data
      this.total1 = Number(result.headers['x-total-count'])
      this.totalPages1 = Math.ceil(this.total1 / this.pgSize1)
    },
    billTypeChange (n) {
      this.billTime = n
      this.getBiils_history(this.contractId)
    },
    drawerClose () { // 账单详情关闭
      this.getBiils(this.contractId)
      this.getBiils_history(this.contractId)
      this.billDetailsdrawershow = false
      this.teantBillDrawerShow = true
    },
    getYxData (tenantId) { // 请求意向客户data 客户网站 客户简介 档案文件
      context.http.get(`cms/api/yxTenant/${tenantId}`).then(res => {
        if (res) {
          this.yxData = res.data
        }
      })
    },
    formatreplace (description) {
      if (!description) {
        return
      }
      let html = description.replace(/\n/g, '<br/>')
      return html
    },
    tenantChange (item, index) { // 切换客户
      this.botTabActive = 3
      this.tabActive = 1
      this.component = 'followUpRecord'
      this.botComponent = 'revenueData'
      this.$emit('updateTenant', item.id)
    },
    deleFile (item, index) {
      this.tenantDetail.annexes.splice(index, 1)
    },
    downloadFile (item, index) {
      let name = item.annexName.replace(/,/g, '-')
      axios({
        method: 'GET',
        url: '/ywm/api/annex/download',
        params: {
          annexURL: item.annexURL,
          annexName: name
        },
        responseType: 'blob'
      }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', item.annexName)
        document.body.appendChild(link)
        link.click()
      })
    },
    addMultiContract () {
      let projectObj = this.tenantDetail.projectManagement.id
      let tenantId = this.tenantDetail.id
      this.$router.push({ path: '/home/MultipleContract', query: { project: projectObj, tenant: tenantId } })
    },
    addshopContract () {
      let projectObj = this.tenantDetail.projectManagement.id
      let tenantId = this.tenantDetail.id
      this.$router.push({ path: '/home/contractsList', query: { project: projectObj, tenant: tenantId } })
    },
    formatStatus (row, column) {
      let res = ''
      if (row.billStatus === 'APPROVAL') {
        res = '减免审核中'
      } else if (row.billStatus === 'UPDATE') {
        res = '减免驳回待修改'
      } else if (row.billStatus === 'NO') {
        res = '未付款'
      } else if (row.billStatus === 'OK') {
        res = '已结清'
      } else if (row.billStatus === 'SECTION') {
        res = '部分结清'
      }
      return res
    },
    async onEdit () {
      this.readOnly = false
    },
    onHide1 () {
      this.teantBillDrawerShow = false
    },
    onHide (id) {
      this.$emit('drawerClose', id)
      this.$emit('query')
    },
    tabFun (val) {
      this.tabActive = val
      this.showSyncRisk = false
      switch (val) {
        case 0:
          this.component = 'followUpRecord'
          this.showEditBtn = false
          this.showSynchBtn = false
          break
        case 1:
          this.component = 'tenantFiles'
          this.showEditBtn = true
          this.showSynchBtn = false
          break
        case 2:
          this.component = 'businessInfor'
          this.showEditBtn = true
          this.showSynchBtn = false
          break
        case 3:
          this.component = 'businessInfor'
          this.showEditBtn = true
          this.showSynchBtn = false
          break
        case 4:
          this.component = 'riskAssessment' // 风险按评估
          this.showEditBtn = false // 编辑按钮
          this.showSynchBtn = false// 同步工商信息
          this.showSyncRisk = true // 同步风险信息
          break
        case 5:
          this.component = 'certification' // 相关资质
          this.showEditBtn = true
          this.showSynchBtn = false
          this.showSyncRisk = false
          break
        case 6:
          this.component = 'payInfo' // 支付信息
          this.showEditBtn = true
          this.showSynchBtn = false
          this.showSyncRisk = false
          break
      }
    },
    botTabFun (val) {
      this.botTabActive = val
      switch (val) {
        case 0:
          this.botComponent = 'statisticalReportForms'
          break
        case 1:
          this.botComponent = 'contractInfor'
          break
        case 2:
          this.botComponent = 'businessData'// 营业数据
          break
        case 3:
          this.botComponent = 'revenueData' // 税收数据
          break
        case 4:
          this.botComponent = 'operateData' // 经营数据
          break
        case 5:
          this.botComponent = 'marketData' // 菜场营业数据
          break
        case 6:
          this.botComponent = 'marketPersonnel' // 菜场人员
          break
      }
    },
    editFn () {
      let val = this.tabActive
      switch (val) {
        case 0:
          this.showEditBtn = false
          break
        case 1:
          this.$refs.dynamicComponent.handlerEdit1()
          this.showEditBtn = false
          break
        case 2:
          this.$refs.dynamicComponent.handlerEdit2()
          this.showEditBtn = false
          break
        case 3:
          this.$refs.dynamicComponent.handlerEdit3()
          this.showEditBtn = false
          this.showSynchBtn = true
          break
        case 5:
          this.$refs.dynamicComponent.handlerEdit5()
          this.showEditBtn = false
          break
        case 6:
          this.$refs.dynamicComponent.handlerEdit()
          this.showEditBtn = false
          break
      }
    },
    synchronization () {
      this.$refs.dynamicComponent.synchronization()
    },
    syncRisk () {
      this.$refs.dynamicComponent.syncRisk()
    },
    handleEdit (index, row) {
      this.$emit('handleEdit', 0, row)
      this.showEditBtn = true
      this.showSynchBtn = false
    },
    async customerSource () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=客户来源')
      this.yxkhFrom = result.data
    },
    getYxTenant () {
      context.http.get(`cms/api/yxTenant/${this.tenantDetail.yxTenantId}`).then(res => {
        if (res) {
          this.detaileData = res.data
          this.yxTenantDTOStorage = res.data
          if (this.detaileData.projectManagementDTO) {
            this.projectManagemenId = this.detaileData.projectManagementDTO.id // 此条记录的项目id
          }
          context.http.get(`cms/api/followRecords/${this.tenantDetail.yxTenantId}`).then(result => {
            this.timeLineListData = result.data
            this.detailsShow = true
          })
        }
      })
    },
    getProjectList () { // 获取工程条件列表
      context.http.get('uaa/api/paramet-managements/name?name=工程条件').then(res => {
        this.project = res.data
        for (let i = 0; i < this.project.length; i++) {
          this.$set(this.project[i], 'isChecked', false)
          this.$set(this.project[i], 'needValue', null)
        }
      }).catch(error => {
        console.info(error)
      })
    },
    refreshList () {
      context.http.get(`cms/api/yxTenant/${this.tenantDetail.yxTenantId}`).then(res => {
        if (res) {
          this.detaileData = res.data
        }
      })
    },
    detailsClose () {
      this.detailsShow = false
    },
    onlineNotification () {
      if (!this.multipleSelection.length) {
        this.$message({
          type: 'error',
          message: '请先选择账单，再点击在线通知'
        })
        return
      }
      this.showNotif = true
    },
    determineNotif () {
      let jobOrderIds = []
      this.multipleSelection.forEach(ele => {
        jobOrderIds.push(ele.id)
      })
      context.http.get(`/cms/api/bills/expireNotice?billIds=${jobOrderIds}`).then(res => {
        if (res.status === 200) {
          this.$message.success('操作成功')
          this.showNotif = false
          this.multipleSelection = []
          this.$refs.multipleTable.clearSelection()
          this.getBiils(this.contractId)
        }
      })
    },
    handleSelectionChange (rows) {
      if (rows.length < 30 || rows.length === 30) {
        this.multipleSelection = rows
      } else {
        this.$refs.multipleTable.toggleRowSelection(rows[rows.length - 1], false)// 超出指定选择个数后，把第一个选中的selection设为false
        rows.splice(rows.length - 1, 1)// 同时要把选中第一项移除
        this.$message.error(`生成通知单数量最大不得超过${this.multipleSelection.length}条`)
        return
      }
    }
  }
}
</script>
<style lang="scss" >
.el-table__header thead tr th {
  background-color: #f7f8fa !important;
  color: #777777 !important;
}
.tenantDetailsClass {
  > div {
    &.vue-drawer {
      background-color: #faf7fa !important;
      .drawer {
        overflow-y: hidden;
        overflow-x: hidden;
      }
      .wrap {
        height: 100%;
        background-color: #faf7fa !important;
      }
      .drawer-head {
        padding: 0;
        margin: 0;
        height: 50px;
        line-height: 50px;
        background-color: #ffffff;
        padding-left: 15px;
        font-weight: bold;
        border: none;
        .el-dialog__close {
          font-size: 24px;
          color: #b9b9b9;
          margin-top: 10px;
        }

        .el-dialog__title {
          color: #262626;
          font-size: 16px;
        }
      }

      .details-content {
        margin: 0;
        height: calc(100vh - 60px);
        overflow: auto;
        width: 1380px;
        // margin-top: 12px;
        &::-webkit-scrollbar {
          width: 4px !important;
          height: 4px !important;
        }
        &::-webkit-scrollbar-track {
          box-shadow: inset 0 0 6px #fff;
          background-color: #fff;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          box-shadow: inset 0 0 6px #cccccc;
        }
        .shopList {
          padding: 10px;
          border-top: 1px solid #f2f2f2;
          margin: 0;
          background-color: #ffffff;
        }
      }
      .el-dialog__footer {
        padding: 0;
        background-color: #ffffff;
        margin-top: 15px;

        .dialog-footer {
          height: 80px;
          display: flex;
          flex-direction: row-reverse;
          align-items: center;

          > span {
            display: inline-block;
            width: 90px;
            height: 34px;
            line-height: 34px;
            text-align: center;
            cursor: pointer;
            color: #666666;

            &.subBtn {
              background-color: #3577f6;
              color: #ffffff;
              border-radius: 4px;
            }
          }
        }
      }
    }
  }

  .ctc-foot {
    justify-content: normal;
    flex-direction: row-reverse;
    align-items: center;
    color: #3f5fbf;
    font-size: 12px;
    padding: 60px 20px 30px 20px;

    .pagingnum {
      color: #3f5fbf;
      font-size: 12px;

      select {
        width: 65px;
        height: 28px;
        border-radius: 2px;
        border-color: #f6f6f7;
        color: #3577f6;
      }
    }

    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .el-pager li {
      margin: 0 5px;
      background-color: transparent;
      color: #3f5fbf;
      min-width: 30px;
      border-radius: 2px;
      font-size: 14px;
    }

    .el-pagination.is-background .el-pager li:not(.disabled).active {
      border-radius: 50%;
      background-color: #3f5fbf !important;
      color: #fff !important;
    }
  }
  .editbtns {
    width: 60px;
    height: 26px;
    line-height: 40px;
    // background: rgba(49, 117, 246, 1);
    border-radius: 4px;
    text-align: center;
    float: right;
    margin: 0;
    font-size: 14px;
    cursor: pointer;
    color: #fff !important;
    i {
      font-size: 14px;
      vertical-align: top;
    }
  }
}
.tenant-details {
  .tenant-files {
    .el-select {
      width: 100%;
    }
  }
}
.tenantBillsDraw {
  .currentBill {
  }
  > div {
    > .el-drawer {
      background-color: #faf7fa !important;
      .el-drawer__header {
        padding: 0;
        margin: 0;
        height: 60px;
        line-height: 60px;
        background-color: #ffffff;
        padding-left: 15px;
        font-weight: bold;
        border: none;
        display: flex;
        align-items: center;
        color: #262626;
        .el-drawer__close-btn {
          font-size: 24px;
          color: #b9b9b9;
        }
        .drawerTitle {
          color: #262626;
          font-size: 16px;
        }
      }

      .el-drawer__body {
        margin: 0;
        height: calc(100% - 60px);
        overflow: auto;
        margin-top: 15px;
        &::-webkit-scrollbar {
          width: 4px !important;
          height: 4px !important;
        }
        &::-webkit-scrollbar-track {
          box-shadow: inset 0 0 6px #fff;
          background-color: #fff;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          box-shadow: inset 0 0 6px #cccccc;
        }
        .shopList {
          padding: 10px;
          border-top: 1px solid #f2f2f2;
          margin: 0;
          background-color: #ffffff;
        }
        .el-collapse-item {
          .el-collapse-item__header {
            background-color: #ffffff;
            &.is-active {
              border-bottom-color: #f6f6f6;
            }
            .collapseTitle {
              padding-left: 15px;
              font-size: 16px;
              font-weight: bold;
              > span {
                display: flex;
                align-items: center;
                > i {
                  display: inline-block;
                  width: 4px;
                  height: 16px;
                  background: rgba(53, 117, 246, 1);
                  border-radius: 2px;
                  margin-right: 5px;
                }
              }
            }
          }
        }
      }
      .el-dialog__footer {
        padding: 0;
        background-color: #ffffff;
        margin-top: 15px;

        .dialog-footer {
          height: 80px;
          display: flex;
          flex-direction: row-reverse;
          align-items: center;

          > span {
            display: inline-block;
            width: 90px;
            height: 34px;
            line-height: 34px;
            text-align: center;
            cursor: pointer;
            color: #666666;

            &.subBtn {
              background-color: #3577f6;
              color: #ffffff;
              border-radius: 4px;
            }
          }
        }
      }
    }
  }

  .ctc-foot {
    justify-content: normal;
    flex-direction: row-reverse;
    align-items: center;
    color: #3f5fbf;
    font-size: 12px;
    padding: 60px 20px 30px 20px;

    .pagingnum {
      color: #3f5fbf;
      font-size: 12px;

      select {
        width: 65px;
        height: 28px;
        border-radius: 2px;
        border-color: #f6f6f7;
        color: #3577f6;
      }
    }

    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .el-pager li {
      margin: 0 5px;
      background-color: transparent;
      color: #3f5fbf;
      min-width: 30px;
      border-radius: 2px;
      font-size: 14px;
    }

    .el-pagination.is-background .el-pager li:not(.disabled).active {
      border-radius: 50%;
      background-color: #3f5fbf !important;
      color: #fff !important;
    }
  }
}
.brief_intr {
  .oss_file {
    width: 76px;
    height: 22px;
    line-height: 18px;
  }
}
</style>
<style lang="scss" scoped>
.tenant-information {
  width: 100%;
  height: 100%;
  .tenantBillBtn {
    display: inline-block;
    padding: 0 10px;
    height: 26px;
    line-height: 26px;
    background: rgba(238, 244, 255, 1);
    border: 1px solid rgba(159, 191, 255, 1);
    border-radius: 4px;
    font-size: 12px;
    color: #3575f6;
    position: fixed;
    z-index: 1;
    top: 15px;
    right: 20px;
    cursor: pointer;
  }
  .tenantList {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    flex-wrap: wrap;
    background-color: #ffffff;
    border-top: 1px solid #f2f2f2;
    > span {
      display: inline-block;
      text-align: center;
      cursor: pointer;
      min-width: 80px;
      height: 24px;
      line-height: 22px;
      padding: 0 4px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(216, 216, 216, 1);
      border-radius: 4px;
      margin-right: 10px;
      &.active {
        color: #3575f6;
        border-color: #9fbfff;
        background: rgba(238, 244, 255, 1);
      }
    }
  }
  .turnoverContent {
    min-height: 600px;
    margin-top: 25px;
    box-shadow: 3px -1px 5px #eee;
    border: 1px solid #eee;
    .shopNameTab {
      height: 40px;
      background-color: #fafafa;
      border-bottom: 1px solid #eeeeee;
      display: flex;
      justify-content: flex-start;
      span {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        text-align: center;
        padding: 0 8px;
        cursor: pointer;
        &.active {
          color: #ffffff;
          background-color: #3577f6;
        }
      }
    }
  }
  .table {
    padding: 20px;
    border: none;
    .el-table--fit {
      border: 1px solid #eeeeee;
    }
  }
  .toolDiv {
    padding: 30px;
    display: flex;
    .downUpLoad {
      padding-top: 21px;
      span {
        display: inline-block;
        height: 45px;
        line-height: 45px;
        text-align: center;
        border: 1px solid;
        border-radius: 5px;
        cursor: pointer;
        &.downBtn {
          width: 135px;
          border-color: #65ac69;
          color: #65ac69;
        }
        &.UpBtn {
          width: 110px;
          border-color: #4767c7;
          color: #4767c7;
          .shade {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      }
    }
    .seach {
      display: flex;
      align-content: center;
      width: 70%;
      .space {
        display: block;
        height: 66px;
        line-height: 85px;
        color: #999;
        margin: 0 10px;
      }
      div {
        p {
          margin-bottom: 5px;
        }
      }
      .queryBtn {
        width: 125px;
        height: 45px;
        margin: 23px 0 0 35px;
      }
    }
  }
  .headTabs {
    width: 330px;
    // min-height: 768px;
    max-height: 300px;
    background-color: #ffffff;
    margin-left: 12px;
    font-size: 12px;
    position: relative;
    border-radius: 4px;
    margin-bottom: 12px;
    .scrollStyle {
      &::-webkit-scrollbar {
        width: 4px !important;
        height: 4px !important;
      }
      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px #fff;
        background-color: #fff;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 6px #cccccc;
      }
    }
    .imgwarp {
      position: relative;
      width: 270px;
      height: 140px;
      text-align: center;
      margin: 0 auto 20px;
      img {
        // max-width: 270px;
        // max-height: 140px;
        width: 270px;
        height: 140px;
      }
      .project-state {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        opacity: 0.8;
        color: #fff;
        text-align: center;
        background: linear-gradient(#333, #999);
        padding-top: 40%;
        .project-name {
          top: 0;
          text-align: left;
        }
      }
    }
    div {
      margin-bottom: 10px;
    }
    .checkDataItem {
      margin-bottom: 40px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .tenant-title {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 18px;
      span {
        display: inline-block;
        font-size: 14px;
        // &:first-child {
        //   max-width: 200px;
        //   color: #262626;
        //   word-break: break-all;
        //   overflow: hidden;
        //   text-overflow: ellipsis;
        //   white-space: nowrap;
        // }
        // &:last-child {
        //   color: #777777;
        //   // font-weight: bold;
        //   display: inline-block;
        //   min-width: 90px;
        // }
      }
      .tentDetail {
        max-width: 200px;
        color: #262626;
        word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .tentTitle {
        color: #777777;
        // font-weight: bold;
        display: inline-block;
        // min-width: 90px;
        width: 120px;
      }
    }
    .tenant-type {
      span {
        &:first-child {
          display: inline-block;
          width: 20px;
          height: 20px;
          line-height: 19px;
          text-align: center;
          background-color: #dc704c;
          color: #fff;
          border-radius: 5px;
        }
      }
    }
    .tenant-state {
      span {
        display: inline-block;
        background-color: #3577f6;
        color: #fff;
        border-radius: 6px;
        padding: 2px 4px;
      }
    }
    .tenant-bottom {
      position: absolute;
      bottom: 0;
    }
    .teant-name {
      height: 40px;
      line-height: 40px;
      margin: 0 auto;
      padding: 0 16px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f6f6f6;
      i {
        display: inline-block;
        width: 4px;
        height: 16px;
        background: rgba(53, 117, 246, 1);
        border-radius: 2px;
        position: relative;
        top: 3px;
      }
      > span {
        &:first-child {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          display: inline-block;
        }
        > span {
          font-size: 16px;
          color: #262626;
          font-weight: bold;
        }
        &.tip {
          opacity: 0.6;
          border-radius: 4px;
          font-size: 14px;
          display: inline-block;
          height: 20px;
          line-height: 18px;
          padding: 0 8px;
          margin-left: 15px;
          &.WORK {
            background: rgba(53, 117, 246, 0.1);
            border: 1px solid #3575f6;
            color: #3575f6;
          }
          &.SHOP {
            background: rgba(246, 154, 35, 0.1);
            border: 1px solid #f69a23;
            color: #f69a23;
          }
          &.MARKET {
            background: rgba(68, 175, 105, 0.1);
            border: 1px solid #44af69;
            color: #44af69;
          }
        }
      }
      .icon-cms_bianji- {
        color: #3575f6;
        font-weight: normal;
        cursor: pointer;
        font-size: 14px;
        flex: 1;
        text-align: right;
        padding-right: 10px;
        span {
          color: #3575f6;
        }
      }
      div {
        margin-bottom: 0;
        flex: 1;
        text-align: right;
        padding-right: 10px;
      }
      .details_cannelBtn,
      .details_submitBtn {
        width: 44px;
        height: 26px;
        line-height: 26px;
        font-size: 12px;
      }
    }
    &.headTabs2 {
      .content {
        padding: 15px 15px 10px 15px;
        height: 200px;
        margin-bottom: 0px;
        overflow-y: auto;
        padding-bottom: 50px;
        &::-webkit-scrollbar {
          width: 4px !important;
          height: 4px !important;
        }
        &::-webkit-scrollbar-track {
          box-shadow: inset 0 0 6px #fff;
          background-color: #fff;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          box-shadow: inset 0 0 6px #cccccc;
        }
        .annexList {
          width: 100%;
          margin-bottom: 0;
          > div {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            border-bottom: 1px solid #eaeaea;
            padding-bottom: 5px;
            i {
              cursor: pointer;
            }
          }
        }
        .item {
          display: flex;
          min-height: 40px;
          margin-bottom: 0;
          // line-height: 50px;
          // align-items: center;
          > div {
            width: 70%;
          }
          > span {
            display: inline-block;
            width: 30%;
            font-size: 14px;
            color: #777777;
            > i {
              color: #ff0000;
              font-style: normal;
            }
          }
          > div {
            > span {
              font-size: 14px;
              color: #262626;
            }
          }

          .intentional-cus {
            display: inline-block;
            width: auto;
            padding: 0 8px;
            height: 26px;
            line-height: 26px;
            background: rgba(238, 244, 255, 1);
            border: 1px solid rgba(159, 191, 255, 1);
            border-radius: 2px;
            color: #3575f6;
            font-size: 12px;
            cursor: pointer;
          }
        }
        .aliUpload {
          width: 76px;
          height: 22px;
          line-height: 22px;
          display: inline-block;
        }
        .btn-wrap {
          margin-bottom: 0;
          text-align: right;
          position: absolute;
          width: 100%;
          bottom: 0px;
          left: 0;
          background-color: #fff;
          padding-right: 15px;
          padding-bottom: 10px;
          padding-top: 10px;
          box-shadow: 0px -1px 3px -1px #acacac;
        }
        .details_cannelBtn,
        .details_submitBtn {
          width: 44px;
          height: 26px;
          line-height: 26px;
          font-size: 12px;
        }
      }
    }
  }
  .dc-right {
    width: 100%;
    border: 1px solid #e7e7e7;
    margin-top: 20px;
    .dr-head {
      background-color: #fafafa;
      height: 40px;
      line-height: 40px;
      padding-left: 12px;
      font-size: 14px;
      margin-bottom: 24px;
      font-weight: bold;
      span {
        color: #5364c5;
        font-size: 12px;
        margin-left: 20px;
        font-weight: normal;
        cursor: pointer;
      }
    }
    .el-form-item {
      width: 22%;
      margin-left: 16px;
      margin-right: 10px;
      vertical-align: top;
      &:nth-of-type(4n) {
        margin-right: 0;
      }
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 200px;
    }
  }
  .basic-item {
    width: 97%;
    margin: 0 auto;
    margin-bottom: 16px;
    p {
      font-size: 14px;
      margin-bottom: 6px;
    }
  }
  .basic-select {
    position: relative;
    cursor: pointer;
    .selectInput {
      height: 80px;
      border: 1px solid #e7e7e7;
      border-radius: 5px;
      padding: 0 15px;
      &.selectActive {
        border: 1px solid #6473cb;
      }
      img {
        float: left;
        display: block;
        width: 150px;
        height: 50px;
        margin-right: 10px;
        margin-top: 15px;
      }
      span {
        float: left;
        color: #666666;
        display: block;
        line-height: 80px;
        font-size: 14px;
        &:last-child {
          float: right;
          color: #6473cb;
        }
      }
    }
    .selectBox {
      width: 100%;
      border: 1px solid #e7e7e7;
      border-radius: 3px;
      background: #fff;
      position: absolute;
      left: 0;
      top: 86px;
      z-index: 9;
      padding: 15px 0px;
      box-shadow: 1px 2px 5px #ddd;
      overflow-y: auto;
      li {
        border-bottom: 1px solid #e7e7e7;
        padding: 10px 15px;
        display: flex;
        &:hover {
          background: #eee;
        }
        img {
          display: block;
          width: 50px;
          height: 21.3px;
          margin-right: 20px;
        }
        span {
          display: block;
          line-height: 20px;
          font-size: 14px;
        }
      }
    }
  }
  .tenant-details {
    width: 1330px;
    height: 94%;
    position: relative;
    .main-content {
      width: 1023px;
      height: 600px;
      font-size: 12px;
      margin-top: 12px;
      background-color: #ffffff;
    }
    .add-contracts-btn {
      position: absolute;
      right: 16px;
      top: -45px;
      .cont-btn {
        background: #3577f6;
        color: #fff;
        border: none;
        &:hover {
          background: #4675cc;
        }
      }
    }
    .el-input__inner {
      height: 32px;
    }
    .el-input__icon {
      line-height: 32px;
    }
  }
  .dialog-footer {
    // margin-right: 30px;
  }
  .invoice-information {
    .el-form-item {
      width: 30%;
    }
  }
  .el-form-item {
    display: inline-block;
  }
  .el-select {
    width: 100%;
  }
  .el-cascader {
    width: 100%;
  }
  .el-textarea__inner {
    height: 70px;
    font-size: 12px;
  }
  .preview-title {
    margin-left: 16px;
  }
  .preview-wrap {
    display: flex;
    justify-content: flex-start;
    margin: 10px 0;
    .preview {
      width: 160px;
      height: 140px;
      border: 1px solid #ddd;
      margin: 0 30px 0 16px;
      position: relative;
      .pw-bottom {
        position: absolute;
        background-color: #4883f6;
        text-align: center;
        color: #fff;
        width: 100%;
        bottom: 0;
        font-size: 14px;
        .upload-icon {
          background: url(../../../../assets/upload-white.png) no-repeat;
          background-size: contain;
          width: 12px;
          height: 12px;
          margin: 6px 6px 6px 0;
        }
      }
      img {
        width: 100%;
        height: 100%;
      }
      input {
        position: absolute;
        top: 0;
        right: 0;
        width: 160px;
        height: 140px;
        opacity: 0;
        cursor: pointer;
      }
    }
    .map {
      width: 684px;
      height: 200px;
      border: 1px solid #ddd;
    }
    .errorTip {
      color: red;
      bottom: -18px;
      position: absolute;
    }
  }
  .el-form-item__content {
    span {
      display: inline-block;
      color: #666;
      font-size: 12px;
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
  .UpBtn {
    position: relative;
    display: inline-block;
    border-radius: 2px;
    cursor: pointer;
    margin-left: 20px;
    margin-right: 20px;
    input {
      position: absolute;
      right: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
  .main-menu {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #f2f2f2;
    background: #ffffff;
    margin-bottom: 20px;
    color: #777777;
    font-size: 14px;
    span {
      display: inline-block;
      width: 90px;
      height: 40px;
      text-align: center;
      cursor: pointer;
      &.active {
        border-bottom: 3px solid #3577f6;
        color: #3577f6;
      }
    }
    .intentional-cus {
      color: #3577f6;
      float: right;
      margin-right: 20px;
      font-size: 12px;
    }
  }
  .tenantBillsDraw {
    .drawBody {
      // border: 1px solid #eee;
      min-height: 600px;
      display: flex;
      .min_content {
        width: 1160px;
        margin-left: 20px;
        .tableList {
          margin-top: 20px;
          // border-top: 1px solid #eee;
          padding: 0 15px;
        }
        .currentBill {
          min-height: 400px;
          margin-bottom: 20px;
          background-color: #ffffff;
          .title {
            height: 40px;
            line-height: 40px;
            font-size: 16px;
            padding-left: 15px;
            border-bottom: 1px solid #f4f4f4;
            display: flex;
            justify-content: space-between;
            padding-right: 15px;
            align-items: center;
            > span {
              display: flex;
              align-items: center;
              font-weight: bold;
              color: #262626;
              i {
                display: inline-block;
                width: 4px;
                height: 16px;
                background: rgba(53, 117, 246, 1);
                border-radius: 2px;
                margin-right: 5px;
              }
            }
            .produceBtn {
              padding: 5px 10px;
              cursor: pointer;
              background-color: #fff !important;
              border-color: #3577f6 !important;
              color: #3577f6 !important;
              border-radius: 3px;
              border: 1px solid;
              height: 30px;
              line-height: 30px;
              padding: 0 10px;
              font-size: 12px;
              margin-left: 10px;
              &:hover {
                background-color: #3577f6 !important;
                border-color: #3577f6 !important;
                color: #fff !important;
              }
            }
          }
        }
        .historyBill {
          min-height: 400px;
          background-color: #ffffff;
          .nodata {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 15px 30px;
            background-color: rgba(0, 0, 0, 0.71);
            color: #fff;
            border-radius: 5px;
          }
          .chart {
            height: 500px;
          }
          .title {
            height: 46px;
            line-height: 46px;
            font-size: 14px;
            padding-left: 15px;
            border-bottom: 1px solid #f4f4f4;
            > span {
              display: inline-block;
              padding: 0 10px;
              height: 45px;
              color: #777777;
              cursor: pointer;
              &.active {
                color: #3175f6;
                border-bottom: 2px solid #3175f6;
                cursor: pointer;
              }
            }
          }
          .seachDiv {
            height: 80px;
            background-color: #ffffff;
            display: flex;
            align-items: center;
            padding: 0 20px;
            justify-content: space-between;
            .btnDiv {
              span {
                margin-right: -5px;
                display: inline-block;
                width: 30px;
                height: 25px;
                font-size: 16px;
                background-color: #ffffff;
                border: 1px solid #eee;
                text-align: center;
                line-height: 25px;
                cursor: pointer;
                box-shadow: inset -1px -1px 3px #dadada;
                &:first-child {
                  border-top-left-radius: 5px;
                  border-bottom-left-radius: 5px;
                }
                &:last-child {
                  border-top-right-radius: 5px;
                  border-bottom-right-radius: 5px;
                }
                &.active {
                  background-color: #f2f2f2ff;
                }
              }
            }
            .query-btn {
              display: inline-block;
              width: 120px;
              height: 32px;
              line-height: 32px;
              text-align: center;
              cursor: pointer;
              color: #fff;
              border-radius: 3px;
              background-color: #3577f6;
            }
            .query-btn:hover {
              background-color: #2a6ef0;
            }
            span {
              margin-right: 40px;
            }
          }
        }
      }
      .sidebar {
        width: 300px;
        min-height: 600px;
        background-color: #ffffff;
        border-top: none;
      }
      .collapseContent {
        > .item {
          height: 40px;
          // line-height: 40px;
          display: flex;
          padding: 0 10px;
          > div {
            &:first-child {
              font-size: 14px;
              text-align: left;
              white-space: nowrap;
              color: #777777;
            }
            &:last-child {
              font-size: 14px;
              color: #262626;
              // width: 200px;
              text-align: left;
              padding-left: 5px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
  .flowDialog1 {
    .el-dialog {
      background: #faf7fa;
    }
    .el-dialog__header {
      background: #fff;
      margin: 0 !important;
      padding-left: 15px !important;
      border-bottom: none;
      padding-top: 15px !important;
    }
    .dialog_content {
      margin: 10px 0 0 15px;
      background-color: #fff;
      > div {
        color: #262626;
        margin: 10px 0;
        span {
          color: #d91616;
        }
      }
    }
    .el-form {
      background-color: #fff;
      padding: 15px;
    }
    .dl-subtitle {
      display: inline-block;
      width: 45%;
      margin-bottom: 20px;
      margin-top: 0;
    }
    .el-form-item {
      display: block;
      margin: 10px 0 0 0;
      .el-select {
        width: 100%;
      }
    }
    .dl-subtitle {
      &:nth-of-type(2n) {
        margin-left: 40px;
      }
    }
    .el-textarea textarea {
      height: 100px !important;
    }
    .el-dialog__footer {
      padding: 0 !important;
    }
  }
}
</style>
