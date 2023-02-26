<template>
  <div class="flow-list">
    <span class="page_head_title">费用收缴</span>
    <ul class="default_tab_block">
      <li v-if="hasAuthority('02030301')"
          @click="switchover('financial')">
        <span>费用收缴统计</span>
      </li>
      <li v-if="hasAuthority('02030320')"
          @click="switchover('tenantBills')">
        <span>客户账单</span>
      </li>
      <li v-if="hasAuthority('02030302')"
          @click="switchover('billList')">
        <span>账单列表</span>
      </li>
      <li v-if="hasAuthority('02030323')"
          @click="switchover('flow')">
        <span>客户流水</span>
      </li>
      <li v-if="hasAuthority('02030314')"
          class="active">
        <span>银行流水</span>
      </li>
    </ul>
    <div class="pl-content">
      <div class="search-bar">
        <div style="display:flex;align-items:center">
          <!-- <el-select style="margin-right:0;"
                     v-model="projectManagementId"
                     multiple
                     collapse-tags
                     placeholder="项目简称"
                     clearable>
            <el-option v-for="item in projectManagement"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select> -->
          <!-- <el-input v-model="referred"
                    placeholder="客户名称"></el-input> -->
          <el-select v-model="billType"
                     placeholder="流水类型"
                     clearable>
            <el-option v-for="item in options1"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <div>
            <el-date-picker style="margin-right:0;"
                            v-model="startDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="回单日期开始时间">
            </el-date-picker>
          </div>
          <div class="split">-</div>
          <div>
            <el-date-picker v-model="endDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="回单日期结束时间">
            </el-date-picker>
          </div>
          <el-select style="margin-right:0;"
                     v-model="flowState"
                     placeholder="匹配状态"
                     clearable>
            <el-option v-for="item in flowStateList"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <div class="query-btn"
               @click="querySearch">查询</div>
        </div>
        <el-button class="tban tban1"
                   v-if="hasAuthority('02030313')"
                   @click="newPipeline"><i class="iconfont icon-crm_xinzeng-"></i> 新增流水</el-button>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  class="flow_table"
                  style="width: 100%"
                  :cell-class-name="isWrap">
          <el-table-column prop="code"
                           label="流水编号"
                           align="center"></el-table-column>
          <el-table-column prop="billType"
                           label="流水类型"
                           align="center"
                           :formatter="formatBillType"></el-table-column>
          <el-table-column prop="specificTenant"
                           label="特定客户"
                           :formatter="formatSpecificTenant"
                           align="center"></el-table-column>
          <el-table-column prop="recordDate"
                           label="回单日期"
                           align="center"></el-table-column>
          <!-- <el-table-column width="120"
                           prop="projectManagement.referred"
                           label="项目简称"
                           align="center"></el-table-column>
          <el-table-column prop="projectManagement.address"
                           label="地址"
                           align="center"></el-table-column>
          <el-table-column prop="tenant.teantName"
                           label="客户名称"
                           align="center"></el-table-column> -->
          <!-- <el-table-column prop="tenant.referred"
                           label="品牌名称"
                           align="center"></el-table-column> -->
          <el-table-column :formatter="formatAmount"
                           label="流水金额/元"
                           align="center"></el-table-column>
          <el-table-column width="100"
                           prop="flowState"
                           label="匹配状态"
                           align="center"
                           :formatter="formatBillStatus"></el-table-column>
          <el-table-column label="操作"
                           v-if="hasAuthority('02030315')"
                           align="center">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)"
                         class="el-button--primary operation-btn"
                         size="mini">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column v-if="hasAuthority('02030316')"
                           width="71"
                           align="center">
            <template slot="header"
                      slot-scope="scope">
              <el-tooltip class="item"
                          effect="dark"
                          content="点击导出银行流水"
                          placement="top">
                <div @click="exportData"
                     class="export_btn"><i class="iconfont icon-cms_daochushuju-1"></i><span>导出</span></div>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot1">
        <span><span style="margin-right:10px">{{currentPage}}/{{Math.ceil(total/pgSize)}}页</span> 共{{total}}条记录</span>
        <el-pagination v-if="total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size="pgSize"
                       :total="total"
                       :current-page.sync="currentPage"
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
    <!-- 新增流水 -->
    <el-dialog v-if="flowDialogVisible"
               :close-on-click-modal="false"
               title="新增流水"
               :visible.sync="flowDialogVisible"
               class="flowDialog addFlow_new">
      <el-form :model="addData"
               :rules="addFlowRules"
               ref="addFlowform">
        <div class="half_page_title"
             style="width:100%">
          <div><i></i>基本信息</div>
        </div>
        <div class="part part1">
          <div class="dl-subtitle">流水类型<span class="required">*</span>
            <el-form-item prop="billType">
              <el-select v-model="addData.billType"
                         @change="billTypeChange"
                         placeholder="请选择">
                <el-option v-for="item in billTypeOption"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="dl-subtitle">特定客户<span class="required">*</span>
            <el-form-item prop="specificTenant">
              <el-radio-group v-model="addData.specificTenant">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="dl-subtitle"
               v-if="addData.specificTenant">
            管理企业<span class="required">*</span>
            <el-form-item prop="organizeId">
              <el-select v-model="addData.organizeId"
                         value-key="id"
                         @change="organizesChange"
                         placeholder="请选择">
                <el-option value="">请选择</el-option>
                <el-option v-for="item in organizesOptions"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="dl-subtitle"
               v-if="addData.specificTenant">
            项目简称<span class="required">*</span>
            <el-form-item prop="projectManagement.id">
              <el-select v-model="addData.projectManagement.id"
                         value-key="id"
                         @change="chooseProject"
                         placeholder="请选择">
                <el-option value="">请选择</el-option>
                <el-option v-for="item in projectManagement"
                           :key="item.id"
                           :label="item.projectName"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="dl-subtitle"
               v-if="addData.specificTenant">
            <!-- 客户名称/品牌名称 -->
            客户名称
            <el-form-item prop="tenant">
              <el-autocomplete v-model="addData.tenant.desc"
                               :fetch-suggestions="searchOperation"
                               @select="selectOperation"
                               name="autocomplete"
                               placeholder="请输入内容"></el-autocomplete>
            </el-form-item>
          </div>
          <div class="dl-subtitle"
               v-if="addData.specificTenant">付款方
            <el-form-item>
              <el-select v-model="addData.payName"
                         filterable
                         allow-create
                         placeholder=""
                         clearable
                         name="payName"
                         @focus="getPayUserList">
                <el-option v-for="item in payUserList"
                           :key="item.id"
                           :label="item.payName"
                           :value="item.payName">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="dl-subtitle"
               v-else>付款方
            <el-form-item>
              <el-input v-model="addData.payName"
                        maxlength="50"></el-input>
            </el-form-item>
          </div>
          <div class="dl-subtitle">付款方式
            <el-form-item prop="paymentMethodId">
              <el-select v-model="addData.paymentMethodId"
                         value-key="id"
                         clearable
                         placeholder="请选择">
                <el-option value="">请选择</el-option>
                <el-option v-for="item in payTypeList"
                           :key="item.id"
                           :label="item.value"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="dl-subtitle">备注
            <el-form-item>
              <el-input v-model="addData.remake"
                        resize="none"
                        :autosize="{ minRows: 1, maxRows: 3}"
                        maxlength="200"
                        type="textarea">
              </el-input>
            </el-form-item>
          </div>
          <!-- <div class="inlinediv">
            <div class="dl-subtitle">备注</div>
            <el-form-item style="width: 100%;margin-bottom: 20px;margin-top:6px;">
              <el-input v-model="addData.remake"
                        resize="none"
                        maxlength="200"
                        type="textarea">
              </el-input>
            </el-form-item>
          </div> -->

        </div>
        <div style="height: 12px;background-color: #f7f7f7;width: 100%;"></div>
        <!-- ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| -->
        <div class="half_page_title"
             style="width:100%;margin-top: 12px;">
          <div><i></i>流水信息</div>
        </div>
        <div class="part part2">
          <div class="dl-subtitle">流水单号
            <el-form-item>
              <el-input v-model="addData.flowCode"
                        maxlength="50"></el-input>
            </el-form-item>
          </div>
          <div class="dl-subtitle">
            <span v-if="accountEntry">回单日期</span>
            <span v-else>回单日期</span>
            <span class="required">*</span>
            <el-form-item prop="recordDate">
              <el-date-picker type="date"
                              value-format="yyyy-MM-dd"
                              v-model="addData.recordDate"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="dl-subtitle">流水金额/元<span class="required">*</span>
            <el-form-item prop="amount">
              <el-input v-model="addData.amount"
                        style="width:200px"
                        placeholder="回单金额"
                        title=""
                        type="number">
              </el-input>
              <el-input v-model="addData.serviceCharge"
                        style="width:115px;margin-right:0"
                        placeholder="手续费"
                        title=""
                        type="number">
              </el-input>
            </el-form-item>
          </div>
          <div class="dl-subtitle">收款人户名
            <el-form-item>
              <el-autocomplete popper-class="my-autocomplete"
                               v-model="addData.beneficiaryName"
                               :fetch-suggestions="querySearch1"
                               placeholder="请输入内容"
                               @select="handleSelect">
                <template slot-scope="{ item }">
                  <div class="template_self">
                    <span>{{item.name}}</span>
                    <span>{{item.account}}</span>
                    <span>{{item.blank}}</span>
                  </div>
                </template>
              </el-autocomplete>
            </el-form-item>
          </div>
          <div class="dl-subtitle">收款人账号
            <el-form-item>
              <el-input v-model="addData.beneficiaryAccount"
                        type="number"
                        maxlength="50"></el-input>
            </el-form-item>
          </div>
          <div class="dl-subtitle">收款开户行
            <el-form-item>
              <el-input v-model="addData.beneficiaryBlank"
                        maxlength="50"></el-input>
            </el-form-item>
          </div>
          <div class="dl-subtitle">付款人户名
            <el-form-item>
              <el-autocomplete popper-class="my-autocomplete"
                               v-model="addData.paymentName"
                               :fetch-suggestions="querySearch2"
                               placeholder="请输入内容"
                               @select="handleSelect1">
                <template slot-scope="{ item }">
                  <div class="template_self">
                    <span>{{item.name}}</span>
                    <span>{{item.account}}</span>
                    <span>{{item.blank}}</span>
                  </div>
                </template>
              </el-autocomplete>
            </el-form-item>
          </div>
          <div class="dl-subtitle">付款人账号
            <el-form-item>
              <el-input v-model="addData.paymentAccount"
                        type="number"
                        maxlength="50"></el-input>
            </el-form-item>
          </div>
          <div class="dl-subtitle">付款开户行
            <el-form-item>
              <el-input v-model="addData.paymentBlank"
                        maxlength="50"></el-input>
            </el-form-item>
          </div>
          <div class="dl-subtitle">
            <div class="enclosure"
                 style="width:100%">
              <div class="enclosure-head"
                   style="width: 140px;position: relative;">附件
                <aliUpload class="aliUpload"
                           v-if="this.addData.annexes.length < 5"
                           :upLoadText="this.addData.annexes.length>0?'继续上传':'上传附件'"
                           :fileType="fileType"
                           :iconShow="true"
                           :encrypt="true"
                           @setAnnex="setAnnexs" />
              </div>
              <div class="enclosure-list"
                   v-for="(item, index) in addData.annexes"
                   :key="index">
                <div class="el-item">
                  <svg class="icon"
                       v-if="item.annexName"
                       aria-hidden="true">
                    <use :xlink:href="getformat2(item.annexName)"></use>
                  </svg>
                  <span class="enclosure-name">{{item.annexName}}</span>
                  <ailPreview :ailObj="item"
                              :encrypt="true"
                              :picturePreview="true" />
                  <span v-if="item.annexName">
                    <i @click="deleFile(item, index)"
                       class="iconfont icon-lajixiang"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="enclosure"
               style="width:47%;margin-top:20px">
            <span style="display:block;width:100%;color:#777;margin-bottom:6px;">附件</span>
            <div style="display: flex;justify-content: space-between;align-items: center;width:100%;">
              <aliUpload v-if="this.addData.annexes.length < 5"
                         class="deviceDetails"
                         :upLoadText="this.addData.annexes.length>0?'继续上传':'上传附件'"
                         :fileType="fileType"
                         :iconShow="false"
                         :iconImg="iconImg"
                         :uploadIcon="true"
                         @setAnnex="setAnnexs" />
              <div class="annexList"
                   style="70%">
                <div v-for="(item, index) in addData.annexes"
                     :key="index">
                  <p style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;width:180px">{{item.annexName}}</p>
                  <span>
                    <i @click="deleFile(item, index)"
                       class="iconfont icon-lajixiang"></i>
                  </span>
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <span @click="flowDialogVisible = false"
              class="details_cannelBtn">取消</span>
        <span @click="addPipeline('addFlowform', '')"
              class="details_submitBtn">保存</span>
        <span @click="addPipeline('addFlowform', 'matching')"
              class="details_submitBtn">保存并匹配</span>

      </div>
    </el-dialog>
    <!-- 账单详情 -->
    <billDetails v-if="billdrawershow"
                 :detailsdrawershow="billdrawershow"
                 :detailsData="builddetailsData"
                 :queryBillId="queryBillId"
                 :reductionData="reductionData"
                 @drawerClose="billDrawerClose"
                 @handleEdit="billHandleEdit"
                 @query='billQuery'
                 @showFlow="showFlow"
                 ref="billDetail" />
    <!-- 流水详情 -->
    <flowBankDetails v-if="detailsdrawershow"
                     :detailsdrawershow="detailsdrawershow"
                     :detailsData="flowDetailsData"
                     :payTypeList="payTypeList"
                     :billId="billId"
                     :variety="variety"
                     @drawerClose="drawerClose"
                     @handleEdit="handleEdit"
                     @showBill="showBill"
                     @query='query' />

    <!-- 匹配账单 -->
    <el-dialog v-if="billsDialogVisible"
               title="匹配账单"
               :visible.sync="billsDialogVisible"
               class="matchingflow el_dialog_new matchingflow_new matchingflow_new1"
               append-to-body>
      <div class="dialog_content">
        <div style="margin-bottom:10px;"
             class="flow_list">
          <ul class="ul_list">
            <li>
              <p>特定客户</p>
              <span>{{detailsData.specificTenant ? '是' : '否'}}</span>
            </li>
            <li v-if="detailsData.specificTenant">
              <p>项目简称</p>
              <span v-if="detailsData.projectManagement">{{detailsData.projectManagement.referred}}</span>
            </li>
            <li v-if="detailsData.specificTenant">
              <p>客户名称</p>
              <span v-if="detailsData.tenant"
                    :title="detailsData.tenant.teantName">{{detailsData.tenant.teantName}}</span>
            </li>
            <li>
              <p>流水金额/元</p>
              <span>{{detailsData.amount+detailsData.serviceCharge}}</span>
            </li>
            <li>
              <p>已匹配金额/元</p>
              <span>{{detailsData.ypAmount}}</span>
            </li>
            <li>
              <p>未匹配金额/元</p>
              <span>{{detailsData.wpAmount}}</span>
            </li>
          </ul>
          <!-- <el-table key="flowDataTable"
                    ref="flowDataTable"
                    max-height="240"
                    :data="detailsData.billAndFlows"
                    v-if="detailsData.billAndFlows.length > 0"
                    class="details_table"
                    style="width: 100%">
            <el-table-column align="center"
                             label="项目简称">
              <template slot-scope="scope">{{ scope.row.projectManagementReferred }}</template>
            </el-table-column>
            <el-table-column align="center"
                             label="品牌名称">
              <template slot-scope="scope">{{ scope.row.referred }}</template>
            </el-table-column>
            <el-table-column align="center"
                             label="费用类型"
                             show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.feeTypeName}}</template>
            </el-table-column>
            <el-table-column align="center"
                             label="应收/应付时间"
                             show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.finalPaymentDate}}</template>
            </el-table-column>
            <el-table-column align="center"
                             label="计费周期"
                             width="180">
              <template slot-scope="scope">{{ scope.row.startDate }} - {{scope.row.endDate}}</template>
            </el-table-column>
            <el-table-column align="center"
                             label="账单状态"
                             :formatter="billStatusFormat"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center"
                             label="付款人"
                             show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.drawee}}</template>
            </el-table-column>
            <el-table-column align="center"
                             label="匹配金额/元"
                             show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.amount}}</template>
            </el-table-column>
          </el-table> -->
        </div>
        <div class="flow_list">
          <div class="half_page_title"
               style="width:100%">
            <div><i></i>待匹配账单</div>
          </div>
          <div class="search-bar"
               style="padding: 10px 15px">
            <div style="display:flex;align-items:center">
              <el-select v-model="flowSearchData.projectManagementId"
                         v-if="!detailsData.specificTenant"
                         placeholder="项目简称"
                         multiple
                         collapse-tags
                         style="width:180px"
                         clearable>
                <el-option v-for="item in projectManagement"
                           :key="item.id"
                           :label="item.referred"
                           :value="item.id">
                </el-option>
              </el-select>
              <el-input v-model="flowSearchData.referred"
                        v-if="!detailsData.specificTenant"
                        placeholder="输入客户"></el-input>
              <div>
                <el-select v-model="flowSearchData.feeType"
                           placeholder="选择费用类型"
                           clearable>
                  <el-option v-for="item in options2"
                             :key="item.id"
                             :label="item.value"
                             :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <!-- <div>
                <el-date-picker style="margin-right:0;"
                                v-model="flowSearchData.startDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="应收/应付开始时间">
                </el-date-picker>
              </div>
              <div class="split">-</div>
              <div>
                <el-date-picker v-model="flowSearchData.endDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="应收/应付结束时间">
                </el-date-picker>
              </div> -->
              <div class="query-btn"
                   @click="matchingBills('seach')">查询</div>
            </div>
          </div>
          <el-table key="multipleTable"
                    ref="multipleTable"
                    :data="tableData1"
                    max-height="240"
                    tooltip-effect="dark"
                    class="details_table"
                    style="width: 100%;margin-bottom:15px"
                    :row-key="getRowKey"
                    @selection-change="handleSelectionChange1">
            <el-table-column :reserve-selection="true"
                             align="center"
                             type="selection"
                             width="55">
            </el-table-column>
            <el-table-column align="center"
                             label="项目简称">
              <template slot-scope="scope">{{ scope.row.projectManagement.referred}}</template>
            </el-table-column>
            <el-table-column align="center"
                             width="126"
                             show-overflow-tooltip
                             label="地址">
              <template slot-scope="scope"
                        class="code">{{ scope.row.projectManagement.address }}</template>
            </el-table-column>
            <el-table-column align="center"
                             width="126"
                             show-overflow-tooltip
                             label="客户名称">
              <template slot-scope="scope">{{ scope.row.tenantName }}</template>
            </el-table-column>
            <!-- <el-table-column align="center"
                             show-overflow-tooltip
                             label="品牌名称">
              <template slot-scope="scope">{{ scope.row.referred }}</template>
            </el-table-column> -->
            <el-table-column align="center"
                             label="费用类型"
                             show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.feeTypeName}}</template>
            </el-table-column>
            <el-table-column align="center"
                             width="180"
                             label="计费周期">
              <template slot-scope="scope">{{ scope.row.startDate }} - {{scope.row.endDate}}</template>
            </el-table-column>
            <el-table-column align="center"
                             label="账单金额/元">
              <template slot-scope="scope">{{ scope.row.amount | toLocaleString}}</template>
            </el-table-column>
            <el-table-column align="center"
                             label="待收金额/元"
                             show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.arrearsAmount | toLocaleString }}</template>
            </el-table-column>
            <el-table-column align="center"
                             label="待收滞纳金/元"
                             show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.qsLateFee | toLocaleString}}</template>
            </el-table-column>
          </el-table>

          <div class="half_page_title"
               style="width:100%">
            <div><i></i>匹配账单</div>
          </div>
          <el-table key="selectTable"
                    ref="selectTable"
                    max-height="240"
                    :data="multipleSelection"
                    tooltip-effect="dark"
                    class="details_table select_table"
                    style="width: 100%">
            <el-table-column align="center"
                             label="项目简称">
              <template slot-scope="scope">{{ scope.row.projectManagement.referred}}</template>
            </el-table-column>
            <el-table-column align="center"
                             width="126"
                             show-overflow-tooltip
                             label="地址">
              <template slot-scope="scope"
                        class="code">{{ scope.row.projectManagement.address }}</template>
            </el-table-column>
            <el-table-column align="center"
                             width="126"
                             show-overflow-tooltip
                             label="客户名称">
              <template slot-scope="scope">{{ scope.row.tenantName || scope.row.tenandName }}</template>
            </el-table-column>
            <!-- <el-table-column align="center"
                             label="品牌名称">
              <template slot-scope="scope">{{ scope.row.referred }}</template>
            </el-table-column> -->
            <el-table-column align="center"
                             label="费用类型"
                             show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.feeTypeName}}</template>
            </el-table-column>
            <el-table-column align="center"
                             width="180"
                             label="计费周期">
              <template slot-scope="scope">{{ scope.row.startDate }} - {{scope.row.endDate}}</template>
            </el-table-column>
            <el-table-column align="center"
                             label="账单金额/元">
              <template slot-scope="scope">{{ scope.row.amount | toLocaleString}}</template>
            </el-table-column>
            <el-table-column align="center"
                             label="待收金额/元"
                             show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.arrearsAmount | toLocaleString }}</template>
            </el-table-column>
            <el-table-column align="center"
                             label="待收滞纳金/元"
                             show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.qsLateFee | toLocaleString}}</template>
            </el-table-column>
            <el-table-column align="center"
                             width="110px"
                             label="付款人">
              <template slot-scope="scope">
                <el-input class="drawee"
                          v-if="!scope.row.isEdit"
                          v-model="scope.row.drawee"
                          placeholder=""></el-input>
                <span v-else>{{scope.row.drawee}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             width="110px"
                             label="出/入账时间">
              <template slot-scope="scope"
                        class="code">
                <el-date-picker v-if="!scope.row.isEdit"
                                v-model="scope.row.recordDate"
                                type="date"
                                prefix-icon="prefix-icon"
                                value-format="yyyy-MM-dd"
                                placeholder="">
                </el-date-picker>
                <span v-else>{{scope.row.recordDate}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             width="110px"
                             label="匹配金额/元">
              <template slot-scope="scope">
                <el-input class="drawee"
                          v-if="!scope.row.isEdit"
                          type="number"
                          v-model="scope.row.ppAmount"
                          placeholder=""></el-input>
                <span v-else>{{scope.row.amount}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             width="70"
                             label="操作">
              <template slot-scope="scope">
                <span class="delete_btn"
                      v-if="!scope.row.isEdit"
                      @click="deleteFlow(scope.row)">删除</span></template>
            </el-table-column>
          </el-table>
        </div>

      </div>
      <div slot="footer"
           class="dialog-footer slotfooter">
        <span @click="billsDialogVisible = false"
              class="details_cannelBtn">取消</span>
        <span type="primary"
              @click="saveFlow('addform')"
              class="details_submitBtn">匹配</span>
      </div>
    </el-dialog>
    <!-- 匹配账单 -->
    <!-- <el-dialog v-if="billsDialogVisible"
               title="匹配账单"
               :visible.sync="billsDialogVisible"
               append-to-body
               width="1000px"
               class="flowDialog flowDialog_new">
      <div class="billsBox">
        <el-table class="details_table flows_new_ui"
                  :data="tableData1"
                  ref="multipleTable"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection"
                           width="55"
                           label=""></el-table-column>

          <el-table-column prop="contractNo"
                           label="合同编号"
                           align="center">
          </el-table-column>

          <el-table-column prop="feeTypeName"
                           label="费用类型"
                           align="center">
          </el-table-column>
          <el-table-column prop="amount"
                           label="应收金额/元"
                           align="center">
          </el-table-column>
          <el-table-column prop="sjAmount"
                           label="已匹配金额/元"
                           align="center">
          </el-table-column>
          <el-table-column prop="finalPaymentDate"
                           label="应收时间"
                           align="center">
          </el-table-column>
          <el-table-column label="计费周期"
                           align="center"
                           width="180px">
            <template slot-scope="scope">
              {{scope.row.startDate}} ~ {{scope.row.endDate}}
            </template>
          </el-table-column>

        </el-table>
      </div>
      <div v-if="pipei.total > 0"
           style="padding:20px 0 30px 0"
           class="ctc-foot1">
        <span><span style="margin-right:10px">{{pipei.currentPage}}/{{Math.ceil(pipei.total/pipei.pgSize)}}页</span> 共{{pipei.total}}条记录</span>
        <el-pagination background
                       layout="prev, pager, next"
                       :page-size=pipei.pgSize
                       :total="pipei.total"
                       :current-page="pipei.currentPage"
                       @current-change="current_change1">
        </el-pagination>
        <div class="pagingnum">
          显示 <select v-model="pipei.pgSize"
                  @change="currentSel1">
            <option v-for="item in pipei.pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </option>
          </select>
          条目
        </div>

      </div>
      <div slot="footer"
           class="dialog-footer">
        <span @click="billsDialogVisible = false"
              class="details_cannelBtn">取消</span>
        <span @click="confirmMatching"
              class="details_submitBtn">匹配</span>
      </div>
    </el-dialog> -->

  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import flowBankDetails from './components/flowBankDetails'
import billDetails from '../billList/components/billDetails'
import aliUpload from '@/components/aliUpload.vue'
import { toLocaleFixed, getformat, toLocaleString } from '@/utils/validate.js'
import ailPreview from '@/components/ailPreview.vue'
export default {
  name: 'flow',
  components: {
    flowBankDetails,
    aliUpload,
    billDetails,
    ailPreview
  },
  data () {
    return {
      // --------------------------
      queryBillId: '',
      reductionData: {},
      builddetailsData: {},
      billdrawershow: false,
      navList: [{ label: '本期未结清', value: true }, { label: '逾期未结清', value: false }, { label: '退租未结清', value: false }, { label: '自建未结清', value: false }],
      referred: '',
      startDate: '',
      endDate: '',
      billTypeOption: [{
        value: 'R',
        name: '收款'
      }, {
        value: 'P',
        name: '付款'
      }],
      checkList: ['USING'],
      accountEntry: true,
      adddialogVisible: false,
      addProjectShow: false,
      detailsdrawershow: false,
      flowDialogVisible: false,
      flowExplain: '',
      addData: {
        annexes: [],
        tenant: {},
        projectManagement: {
          id: ''
        },
        payName: '',
        amount: '', // 回单金额
        serviceCharge: '', // 手续费
        beneficiaryName: '', // 收款人户名
        beneficiaryAccount: '', // 收款人账号
        beneficiaryBlank: '', // 收款开户行
        paymentName: '', // 付款人户名
        paymentAccount: '', // 付款人账号
        paymentBlank: '', // 付款开户行
        specificTenant: true // 特定客户 默认是
      },
      addform: {},
      addFlowRules: {
        billType: [
          { required: true, message: '请选择流水类型', trigger: 'change' }
        ],
        amount: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        tenant: [
          { required: false, message: '请选择客户', trigger: 'change' }
        ],
        recordDate: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ],
        organizeId: [
          { required: true, message: '请选择管理企业', trigger: 'change' }
        ],
        'projectManagement.id': [
          { required: true, message: '请选择项目', trigger: 'change' }
        ]
      },
      tableData: [],
      tenantNameeOptions: [],
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      flowDetailsData: {
        annexes: [],
        billAndFlows: []
      },
      flowTypeOption: [
        {
          code: 15,
          name: '收款'
        },
        {
          code: 15,
          name: '付款'
        }
      ],
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
      onRent: false,
      projectManagementId: [], // 商圈
      projectManagement: [],
      payTypeList: [],
      upLoadText: '',
      fileType: [],
      billId: '',
      billsDialogVisible: false,
      tableData1: [],
      billIds: [],
      pipei: {
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
        currentPage: 1,
        pgNum: 1,
        total: 0,
        pgSize: 15
      },
      variety: '',
      flowState: '',
      flowStateList: [
        {
          label: '完全匹配',
          value: 'OK'
        },
        {
          label: '未匹配',
          value: 'NO'
        },
        {
          label: '部分匹配',
          value: 'SECTION'
        }
      ],
      iconImg: 'icon-shangchuanfujianicon',
      payUserList: [],
      options1: [
        { label: '收款', value: 'R' },
        { label: '付款', value: 'P' }
      ],
      billType: '',
      multipleSelection: [],
      flowSearchData: {
        projectManagementId: '',
        referred: '',
        feeType: '',
        startDate: '',
        endDate: ''
      },
      detailsData: {},
      organizesOptions: [],
      options2: []
    }
  },
  created () {
    this.getProjectOptions()
    this.query()
  },
  computed: {
    getTenantName: function () {
      return this.addData.tenant.teantName
    }
  },
  watch: {
    getTenantName: {
      handler: function () {
        console.log(this.addData.tenant.teantName)
        this.addData.payName = ''
        this.payUserList = []
      }
    }
  },
  mounted () {
    let billFlowId = this.$route.query.billFlowId
    let variety = this.$route.query.variety
    if (billFlowId) {
      if (variety === 'variety') this.variety = 'variety'
      this.flowID = billFlowId
      context.http.get(`cms/api/billFlows/${billFlowId}`).then(res => {
        this.flowDetailsData = res.data
        this.detailsdrawershow = true
      })
    }
  },
  methods: {
    getformat2 (str) {
      return getformat(str)
    },
    billStatusFormat (row, column) {
      let billStatus = row.billStatus
      switch (billStatus) {
        case 'NO':
          return '未付款'
        case 'SECTION':
          return '部分结清'
        case 'STAY_SETTLE':
          return '待结清'
        case 'OK':
          return '已结清'

      }
    },
    deleteFlow (row, i) {
      let flag = false
      let ITEM
      this.tableData.forEach(item => {
        if (row.id === item.id) {
          console.log(item)
          ITEM = item
          flag = true
        }
      })
      if (flag) {
        this.$refs.multipleTable.toggleRowSelection(ITEM)
      } else {
        this.$refs.multipleTable.toggleRowSelection(row)
      }
    },
    async getFeeType () { // 费用类型
      let result1 = await context.http.get('/uaa/api/paramet-managements/name', { name: '费用类型' })
      let result2 = await context.http.get('/uaa/api/paramet-managements/name', { name: '多经费用类型' })
      this.options2 = result1.data.concat(result2.data)
    },
    getRowKey (row) {
      return row.id
    },
    handleSelectionChange1 (val) {
      console.log(val)
      // this.multipleSelection = val
      this.multipleSelection = this.billAndFlows.concat(val)
      this.multipleSelection.forEach(ele => {
        this.$set(ele, 'recordDate', this.detailsData.recordDate)
      })
    },
    setPayAmount (item) {
      if (item.amount - item.reductionAmount > item.writeOffAmount) {
        if (item.amount - item.reductionAmount - item.writeOffAmount > this.detailsData.wpAmount) {
          item.ppAmount = this.detailsData.wpAmount
        } else {
          item.ppAmount = item.amount - item.reductionAmount - item.writeOffAmount
        }
      } else {
        if (item.qsLateFee > this.detailsData.wpAmount) {
          item.ppAmount = this.detailsData.wpAmount
        } else {
          item.ppAmount = item.qsLateFee
        }
      }
      return item.ppAmount
    },
    saveFlow () {
      let detailsData = JSOG.decode(this.detailsData)
      let multipleSelectionSelect = this.multipleSelection.filter(v => !v.isEdit)
      if (!multipleSelectionSelect.length) {
        this.$message({
          showClose: true,
          message: '请选择要匹配的流水',
          type: 'error'
        })
        return false
      }
      let multipleSelection = JSON.parse(JSON.stringify(multipleSelectionSelect))
      let arr = []
      let arrAmount = 0
      multipleSelection.forEach((item, index) => {
        arrAmount += Number(item.ppAmount)
        if (item.drawee === '') {
          this.$message({
            showClose: true,
            message: `付款人户名不能为空`,
            type: 'error'
          })
          return
        }
        if (item.recordDate === '') {
          this.$message({
            showClose: true,
            message: `出/入账时间不能为空`,
            type: 'error'
          })
          return
        }
        if (item.ppAmount === '') {
          this.$message({
            showClose: true,
            message: `流水匹配金额不能为空`,
            type: 'error'
          })
          return
        }
        if (Number(item.ppAmount) < 0 || Number(item.ppAmount) === 0) {
          this.$message({
            showClose: true,
            message: `第${index + 1}条流水匹配金额需大于0`,
            type: 'error'
          })
          return
        }
        if (Number(item.ppAmount) > item.arrearsAmount) {
          this.$message({
            showClose: true,
            message: `第${index + 1}条流水匹配金额不能大于未匹配金额`,
            type: 'error'
          })
          return
        }
        item.drawee ? item.drawee : ''
        let obj = {
          billId: item.id,
          billFlowId: detailsData.id,
          drawee: item.drawee,
          payAmount: item.ppAmount,
          accountDate: item.recordDate
        }
        arr.push(obj)
      })
      if (arr.length === 0 || multipleSelection.length > arr.length) {
        return
      }
      if (arrAmount > detailsData.wpAmount) {
        this.$message({
          showClose: true,
          message: `匹配金额不能大于未匹配金额`,
          type: 'error'
        })
        return
      }
      context.http.post(`/cms/api/billFlows/${this.detailsData.id}/mate`, arr).then(res => {
        if (res) {
          this.billsDialogVisible = false
          this.$message({
            showClose: true,
            message: `匹配成功`,
            type: 'success'
          })
          this.query()
          this.$emit('handleEdit', 0, detailsData)
        }
      })
    },
    formatSpecificTenant (row, column) {
      let txt = row.specificTenant ? '是' : '否'
      return txt
    },
    async searchOperation (queryString, callback) {
      if (!this.addData.projectManagement.id || this.addData.projectManagement.id === '') {
        this.$message({
          message: '请先选择项目',
          type: 'warning'
        })
        return
      }
      var list = [{}]
      if (!queryString || queryString === '') {
        this.addData.tenant = {}
        return false
      }
      let result = await context.http.get('cms/api/tenant/nameLike/', { name: this.addData.tenant.desc })
      // let result = await context.http.get('cms/api/tenant/nameLike/' + this.addData.tenant.teantName + '?projectId=' + this.addData.projectManagement.id)
      var results = result.data
      for (let i of results) {
        i.value = i.desc  // 将想要展示的数据作为value
      }
      list = result.data
      callback(list)
    },
    handleSelect (item) {
      this.addData.beneficiaryName = item.name // 收款人户名
      this.addData.beneficiaryAccount = item.account // 收款人账号
      this.addData.beneficiaryBlank = item.blank // 收款开户行
    },
    handleSelect1 (item) {
      this.addData.paymentName = item.name // 收款人户名
      this.addData.paymentAccount = item.account // 收款人账号
      this.addData.paymentBlank = item.blank // 收款开户行
    },
    async querySearch1 (queryString, cb) { // 收款
      // if (!queryString || queryString === '') {
      //   return false
      // }
      let result = await context.http.get('cms/api/tenantPays/beneficiary?query=' + this.addData.beneficiaryName)
      cb(result.data)
    },
    async querySearch2 (queryString, cb) { // fu款
      // if (!queryString || queryString === '') {
      //   return false
      // }
      let result = await context.http.get('cms/api/tenantPays/payment?query=' + this.addData.paymentName)
      cb(result.data)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    showBill (id) {
      let row = {}
      row.id = id
      this.detailsdrawershow = false
      this.billHandleEdit(0, row)
    },
    showFlow (id) {
      let row = {}
      row.id = id
      this.billdrawershow = false
      this.handleEdit(0, row)
    },
    billQuery () { },
    billDrawerClose () {
      this.billdrawershow = false
      context.http.get(`cms/api/billFlows/${this.flowID}`).then(res => {
        this.flowDetailsData = res.data
        this.detailsdrawershow = true
      })
    },
    async billHandleEdit (index, row) {
      let result = await context.http.get(`cms/api/bills/${row.id}`)
      this.builddetailsData = JSOG.decode(result.data)
      this.billdrawershow = true
      this.detailsdrawershow = false
    },
    isWrap ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 2) {
        return 'isWrap'
      }
    },
    async getProjectOptions () {
      let result = await context.http.get('cms/api/project-managements', { useStatus: 'USING', page: 0, size: 100, sort: 'desc' })
      this.projectManagement = result.data
      this.flowSearchData.projectManagementId = [this.projectManagement[0].id]
    },
    querySearch () {
      this.currentPage = 1
      this.query()
    },
    handleSelectionChange (val) {
      let billIds = val
      this.billIds = billIds.map(item => {
        return item.id
      })
    },
    matchingBills (isSeach) {
      // this.billAndFlows = JSON.parse(JSON.stringify(this.detailsData.billAndFlows))
      // this.billAndFlows = this.billAndFlows.map(v => {
      //   v.isEdit = true
      //   return v
      // })
      // this.multipleSelection = this.billAndFlows
      this.currentPage = 1
      if (isSeach !== 'seach' || !isSeach) {
        // this.multipleSelection = []
        this.flowSearchData = {
          projectManagementId: '',
          referred: '',
          feeType: '',
          startDate: '',
          endDate: ''
        }
      }
      this.getbillsList(this.detailsData.id)
      this.billsDialogVisible = true
    },
    getbillsList (id, type) {
      let tenantId = this.flowDetailsData.tenant ? this.flowDetailsData.tenant.id : ''
      context.http.get('cms/api/bills/nomate?sort=finalPaymentDate,asc&sort=id,asc', {
        page: (this.pipei.currentPage - 1),
        // size: this.pgSize,
        flowId: id,
        tenantId: tenantId,
        projectManagementId: this.flowSearchData.projectManagementId.toString(),
        referred: this.flowSearchData.referred,
        billType: this.detailsData.billType,
        feeType: this.flowSearchData.feeType,
        startDate: this.flowSearchData.startDate,
        endDate: this.flowSearchData.endDate
      }).then(res => {
        res.data.forEach((item, index) => {
          if (item.onContainLafeFee) {
            item.ppAmount = item.arrearsAmount - item.qsLateFee
            item.ppAmount = item.ppAmount === 0 ? item.qsLateFee : item.ppAmount
            item.ppAmount = Number(item.ppAmount.toFixed(2))
          } else {
            item.ppAmount = item.arrearsAmount
            item.ppAmount = Number(item.ppAmount.toFixed(2))
          }
          if (item.ppAmount > this.detailsData.wpAmount) {
            item.ppAmount = this.detailsData.wpAmount
            item.ppAmount = Number(item.ppAmount.toFixed(2))
          }
          // if (item.billCategory === 'NORMAL') {
          //   item.ppAmount = this.setPayAmount(item)
          // } else {
          //   item.ppAmount = item.arrearsAmount
          // }
          item.drawee = this.detailsData.paymentName
        })
        this.tableData1 = res.data
        this.pipei.total = Number(res.headers['x-total-count'])
      })
    },
    currentSel1 () {
      this.pipei.currentPage = 1
      this.getbillsList(this.flowDetailsData.id, this.flowDetailsData.billType)
    },
    current_change1 (currentPage) {
      this.pipei.currentPage = currentPage
      this.getbillsList(this.flowDetailsData.id, this.flowDetailsData.billType)
    },
    confirmMatching () {
      if (this.billIds.length === 0) {
        this.$message({
          message: '请先选择账单，再点击匹配！',
          type: 'error'
        })
        return
      }
      context.http.post(`cms/api/billFlows/${this.flowDetailsData.id}/mate`, this.billIds).then(res => {
        if (res.status === 200) {
          this.billsDialogVisible = false
          this.query()
          this.$message({
            message: '流水匹配成功',
            type: 'success'
          })
        }
      })
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    selectOperation (val) {
      this.addData.tenant = val
    },
    getPayUserList () {
      if (this.addData.tenant && this.addData.tenant.id) {
        context.http.get('cms/api/tenantPays/' + this.addData.tenant.id).then(res => {
          this.payUserList = res.data.filter(item => {
            return item.payName !== '' && item.payName !== null
          })
        })
      }
    },
    chooseProject () {
      this.addData.tenant = {}
    },
    setAnnexs (annexURL, annexName) {
      this.addData.annexes.push({ 'annexURL': annexURL, 'annexName': annexName })
    },
    deleFile (item, index) {
      this.addData.annexes.splice(index, 1)
    },
    downloadFile (item, index) {
      axios({
        method: 'GET',
        url: '/ywm/api/annex/download',
        params: {
          annexURL: item.annexURL,
          annexName: item.annexName
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
    switchover (state) {
      if (state === 'financial') {
        this.$router.push({ name: 'financialState' })
      } else if (state === 'billList') {
        this.$router.push({ name: 'billList' })
      } else if (state === 'tenantBills') {
        this.$router.push({ name: 'tenantBills' })
      } else if (state === 'flow') {
        this.$router.push({ name: 'flow' })
      }
    },
    drawerClose () {
      this.detailsdrawershow = false
    },
    dialogHide () {
      this.adddialogVisible = false
    },
    formatBillType (row, column) {
      return row.billType === 'R' ? '收款' : '付款'
    },
    formatAmount (row, column) {
      return toLocaleString(row.amount + row.serviceCharge)
    },
    formatBillStatus (row, column) {
      let res = ''
      if (row.flowState === 'NO') {
        res = '未匹配'
      } else if (row.flowState === 'OK') {
        res = '完全匹配'
      } else if (row.flowState === 'SECTION') {
        res = '部分匹配'
      }
      return res
    },
    async newPipeline () {
      this.addData = {
        annexes: [],
        tenant: {},
        projectManagement: {
          id: ''
        },
        organizeId: null, // 管理企业
        payName: '',
        amount: '', // 回单金额
        serviceCharge: '', // 手续费
        beneficiaryName: '', // 收款人户名
        beneficiaryAccount: '', // 收款人账号
        beneficiaryBlank: '', // 收款开户行
        paymentName: '', // 付款人户名
        paymentAccount: '', // 付款人账号
        paymentBlank: '', // 付款开户行
        specificTenant: true // 特定客户 默认是
      }
      this.flowDialogVisible = true
      this.$nextTick(() => { // 防止请求期间页面卡死不动
        context.http.get('/cms/api/tenant/all', { tenantName: '' }).then(res => {
          this.tenantNameeOptions = res.data
        })
        context.http.get('/uaa/api/paramet-managements/name', { name: '付款方式' }).then(res => {
          this.payTypeList = res.data
        })
        context.http.get('/uaa/api/organizes/enterprise/user', { useStatus: 'USING', organizeType: 'ENTERPRISE' }).then(res => {
          this.organizesOptions = res.data
          this.addData.organizeId = this.organizesOptions[0].id
          this.organizesChange(this.addData.organizeId)
        })
      })
    },
    async organizesChange (id) { // 管理企业查名下项目
      this.addData.projectManagement.id = null
      this.projectManagement = []
      if (!id) {
        return
      }
      let res = await context.http.get('/cms/api/project-managements/byOrganizeId', { useStatus: 'USING', organizeId: id })
      if (res.data && res.data.length) {
        this.projectManagement = res.data
        this.addData.projectManagement.id = this.projectManagement[0].id
        // if (this.$route.params && this.$route.params.projectManagementId) {
        //   let temp = this.projectManagement.some(item => {
        //     return item.id === this.$route.params.projectManagementId
        //   })
        //   if (temp) {
        //     this.projectManagementId = [this.$route.params.projectManagementId]
        //   }
        // }
      }
    },
    // 新增流水
    addPipeline (formName, matching) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.flowDialogVisible = true
          // console.log('add', this.addData)
          if (this.addData.serviceCharge === '') {
            this.addData.serviceCharge = 0
          }
          let data = JSOG.parse(JSOG.stringify(this.addData))
          if (this.addData.specificTenant) {
            if (!data.tenant || !data.tenant.id) {
              data.tenant = null
              data.payName = ''
            }
          }
          if (data.amount < 0) {
            this.$message({
              type: 'error',
              message: '流水金额不能为负数'
            })
            return
          }
          if (data.payName && data.payName.length > 50) {
            this.$message({
              type: 'error',
              message: '付款方最多不得超过50个字符'
            })
            return
          }
          let _this = this
          if (!data.specificTenant) {
            delete data.projectManagement
            delete data.tenant
          }
          console.log(data)
          context.http.post('/cms/api/billFlows', data).then(res => {
            if (res) {
              _this.flowDialogVisible = false
              _this.query()
              _this.addData = {
                annexes: [],
                tenant: {},
                projectManagement: {
                  id: ''
                },
                payName: ''
              }
              _this.detailsData = res.data
              if (matching === 'matching') {
                context.http.get(`cms/api/billFlows/${res.data.id}`).then(res => {
                  _this.flowDetailsData = res.data
                  _this.pipei.currentPage = 1
                  _this.billIds = []
                  _this.flowSearchData = {
                    projectManagementId: '',
                    referred: '',
                    feeType: '',
                    startDate: '',
                    endDate: ''
                  }
                  _this.getbillsList(_this.flowDetailsData.id, this.flowDetailsData.billType)
                  _this.billAndFlows = JSON.parse(JSON.stringify(_this.detailsData.billAndFlows))
                  _this.billAndFlows = _this.billAndFlows.map(v => {
                    v.isEdit = true
                    return v
                  })
                  _this.multipleSelection = _this.billAndFlows
                  _this.billsDialogVisible = true
                  if (!_this.projectManagement || !_this.projectManagement.length) {
                    this.getProjectOptions()
                  }
                  // _this.multipleSelection = []
                  _this.getFeeType()
                  _this.$nextTick(() => {
                    _this.$message({
                      message: '新增流水成功',
                      type: 'success'
                    })
                  })
                })
              } else {
                _this.$message({
                  message: '新增流水成功',
                  type: 'success'
                })
              }
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async query (type, index) {
      let projecId = this.projectManagementId.slice(0)
      // if (projecId.length > 1) {
      //   projecId = projecId.join()
      // } else if (projecId.length === 1) {
      //   projecId = projecId[0]
      // }
      if (index) this.currentPage = index
      let result = await context.http.get('cms/api/billFlows', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'id,desc',
        startDate: this.startDate,
        endDate: this.endDate,
        billType: this.billType,
        // referred: this.referred,
        // projectManagementId: projecId,
        flowState: this.flowState
      })
      this.tableData = result.data
      // this.tableData.forEach(ele => {
      //   ele.amount = toLocaleString(ele.amount)
      // })
      this.total = Number(result.headers['x-total-count'])
    },
    async exportData () {
      let projecId = this.projectManagementId.slice(0)
      if (projecId.length > 1) {
        projecId = projecId.join()
      } else if (projecId.length === 1) {
        projecId = projecId[0]
      }
      axios({
        method: 'GET',
        url: '/cms/api/billFlows/report',
        params: {
          page: (this.currentPage - 1),
          size: this.pgSize,
          sort: 'id,desc',
          referred: this.referred,
          projectManagementId: projecId,
          billType: this.billType,
          flowState: this.flowState,
          startDate: this.startDate,
          endDate: this.endDate
        },
        responseType: 'blob'
      }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        let fileName = res.headers['content-disposition'].substring(20)
        fileName = decodeURI(fileName)
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(url)
      })
    },
    bindCheckBox (value) {
      this.checkList = []
      this.checkList.push(value[1])
      this.currentPage = 1
      this.query()
    },
    async handleEdit (index, row) {
      let result = await context.http.get(`cms/api/billFlows/${row.id}`)
      this.flowID = row.id
      this.flowDetailsData = result.data
      this.detailsdrawershow = true
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    goCharts (index, row) {
      this.$router.push({ path: '/home/charts', query: { buildingId: row.id } })
    },
    billTypeChange () {
      if (this.addData.billType === 'R') {
        this.accountEntry = true
      } else {
        this.accountEntry = false
      }
    },
    parseOrganize (organizeTree) {
      if (organizeTree.child.length === 0) {
        return { value: organizeTree.id ? organizeTree.id : organizeTree.userPostId ? organizeTree.userPostId : organizeTree.userId, label: organizeTree.name }
      } else {
        return {
          value: organizeTree.id ? organizeTree.id : organizeTree.userPostId ? organizeTree.userPostId : organizeTree.userId,
          label: organizeTree.name,
          children: organizeTree.child.map(item => {
            return this.parseOrganize(item)
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
<style lang="scss">
.flow-list {
  font-size: 14px;
  background-color: #f9f9f9;
  .el-table .isWrap .cell {
    white-space: pre-wrap;
    // text-align: left;
  }
  .pl-content {
    width: 100%;
    margin: 0 auto;
    .search-bar {
      .el-input {
        width: 180px;
      }
      // .query-btn {
      //   display: inline-block;
      //   width: 110px;
      //   height: 32px;
      //   line-height: 32px;
      //   text-align: center;
      //   cursor: pointer;
      //   color: #fff;
      //   border-radius: 3px;
      //   background-color: #3577f6;
      //   margin-top: 0;
      //   margin-left: 16px;
      // }
      // .query-btn:hover {
      //   background-color: #2a6ef0;
      // }
      // .addbtn {
      //   margin: 0;
      //   position: absolute;
      //   right: 40px;
      //   top: 19px;
      // }
      // div {
      //   float: left;
      //   display: inline-block;
      // }
      .swbtn {
        margin-left: 16px;
        font-size: 18px;
        width: 100px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-size: 18px;
        color: #000;
        background-color: #fff;
        margin-left: 16px;
        border-radius: 10px;
        cursor: pointer;
      }
      .btnselect {
        color: #fff;
        background-color: #42506c;
      }
      div {
        cursor: pointer;
      }
      .split {
        color: #333333;
        margin: 0 8px;
      }
    }
    .bd-statistics {
      background-color: #fff;
      margin-bottom: 10px;
      box-shadow: 1px 2px 5px #eee;
      .statistics-title {
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        color: #333;
        font-weight: bold;
        padding-left: 20px;
        border-bottom: 1px solid #ededef;
      }
      .statistics-content {
        .contentItem {
          display: inline-block;
          padding: 20px 0 20px 20px;
        }
        .bd-number {
          margin-left: 6px;
          padding-right: 20px;
          font-size: 14px;
          font-weight: 400;
          font-family: PingFangSC;
          color: #353b4b;
          display: inline-block;
          min-width: 90px;
          .ci-title {
            font-weight: 400;
            height: 25px;
            line-height: 25px;
            color: #828692;
            font-size: 12px;
          }
          .ci-value {
            display: inline-block;
            font-size: 20px;
            margin-top: 4px;
          }
        }
        .borderstrip {
          width: 2px;
          height: 35px;
          background-color: #ecedef;
          display: inline-block;
          margin-top: 6px;
        }
      }
    }
    .plc-table {
      position: relative;
      .export {
        position: absolute;
        right: 20px;
        top: 5px;
        z-index: 9;
        span {
          display: inline-block;
          width: 60px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          /*background: rgba(222, 235, 254, 1);
          color: #5b9af8;
          opacity: 0.9;
          border-radius: 4px;*/
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
    .rent-control {
      border: 1px solid #96d050;
      background-color: #fff;
      color: #96d050;
      &:hover {
        background-color: #96d050;
        color: #fff;
      }
    }
    .editbtn {
      color: #3175d2;
      &:hover {
        color: #fff;
      }
    }
  }
  .ctc-foot {
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    padding: 60px 0 30px 20px;
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: #2f3f48;
      color: #fff;
    }
    .el-pagination.is-background .el-pager li:not(.disabled):hover {
      color: #999;
    }
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
  .addProjectdialog .el-dialog {
    width: 1000px;
    margin-top: 5vh !important;
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #d9dce2;
  }
  .el-table__row div {
    // white-space: nowrap;

    img {
      width: 97px;
      height: 80px;
    }
    .buildingImage {
      width: 120px;
      margin: 0 auto;
    }
  }
  .flowDialog {
    .dl-subtitle {
      display: inline-block;
      width: 49%;
      margin-top: 20px;
      .enclosure {
        .aliUpload {
          display: inline-block;
          margin-left: 10px;
        }
        .enclosure-list {
          display: flex;
          vertical-align: top;
          .el-item {
            width: 100%;
            border-bottom: 1px solid #ebebeb;
            .enclosure-name {
              width: 70%;
              padding-left: 0;
              vertical-align: top;
            }
            .icon {
              vertical-align: top;
              margin-top: 4px;
            }
            > span:last-child {
              width: 10%;
              padding-left: 16px;
            }
            > div {
              display: inline-block;
              width: 10%;
              vertical-align: top;
              padding-left: 16px;
            }
            .ailPreview {
              display: inline-block;
            }
          }
        }
      }
    }
    .el-form-item {
      margin: 10px 0 0 0;
      width: 81%;
      .el-select {
        width: 100%;
      }
    }
    .aliUpload {
      width: 100px;
      height: 30px;
      border: 1px solid #0f75ff;
      border-radius: 4px;
      margin-top: 6px;
      // position: absolute;
      // right: 0;
      // top: 0;
      .oss_file {
        border: none;
        width: 100%;
        height: 100%;
        input {
          position: absolute;
          right: 0;
          top: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
      }
    }
  }
}
.menu {
  height: 62px;
  line-height: 62px;
  border-bottom: 1px solid #eeeeee;
  margin-top: 15px;
  margin-bottom: 20px;
  background-color: #ffffff;
  // padding-left: 20px;
  span {
    display: inline-block;
    width: 200px;
    height: 62px;
    text-align: center;
    cursor: pointer;
    &.active {
      border-bottom: 3px solid #3577f6;
      color: #3577f6;
    }
  }
}
.el-autocomplete {
  width: 100%;
}
.template_self {
  > span {
    margin-right: 5px;
  }
}
.el-table th div.export_btn {
  display: flex;
  width: 56px;
  height: 26px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(229, 229, 229, 1);
  border-radius: 3px;
  font-size: 12px;
  cursor: pointer;
  i {
    display: block;
    line-height: 26px;
    font-size: 14px;
    margin-right: 3px;
    color: #262626;
  }
  span {
    display: block;
    line-height: 26px;
    color: #262626;
  }
  &:hover {
    i,
    span {
      color: #3575f6;
    }
  }
}
.flow_table .has-gutter tr th:nth-last-child(2) .cell {
  padding: 0;
}
.flows_new_ui::before {
  height: 0 !important;
}
.flows_new_ui td {
  border-bottom: 1px solid #fafafa !important;
}
.flowDialog_new {
  .el-dialog__header {
    border-bottom: 1px solid #f6f6f6;
    padding: 15px 20px;
    margin: 0;
    .el-dialog__title {
      font-size: 16px;
      color: #262626;
      font-weight: bolder;
    }
    .el-dialog__headerbtn {
      top: 15px;
    }
  }
  .el-dialog__body {
    border-bottom: 0;
    margin: 0;
    padding: 15px 20px 0 !important;
  }
  .el-dialog__footer {
    padding: 10px 20px 20px !important;
  }
}
.addFlow_new {
  .el-dialog {
    background: #f7f7f7;
    overflow: hidden;
    width: 750px;
  }
  .el-dialog__header {
    padding: 0 20px;
    margin: 0;
    border: 0;
    margin-bottom: 12px;
    background: #fff;
    height: 50px;
    display: flex;
    align-items: center;
    .el-dialog__title {
      display: block;
      font-size: 16px;
      line-height: 16px;
      color: #262626;
      font-weight: bolder;
    }
    .el-dialog__headerbtn {
      top: 15px;
      right: 20px !important;
    }
  }
  .el-dialog__body {
    background: #fff;
    border-bottom: 0;
    margin: 0;
    // padding: 0px 20px 15px !important;
    margin-bottom: 12px !important;
    .enclosure {
      margin-bottom: 0;
    }
    .el-input,
    .el-select {
      margin-right: 10px;
    }

    .el-input__inner {
      height: 32px;
      margin-right: 10px;
    }

    .el-input__icon {
      line-height: 32px;
    }

    .el-select {
      height: 32px;
      line-height: 32px;
      margin-right: 10px;
    }
    .el-form {
      > .part {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 0px 20px 15px;
      }
    }
    .dl-subtitle {
      width: 47%;
      display: block;
      color: #777;
    }
    .inlinediv {
      width: 100%;
    }
    .el-form-item {
      width: 100%;
      margin-top: 6px;
    }
    .el-input {
      width: 100%;
    }
    .annexList {
      width: 100%;
      flex: 1;
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
    .deviceDetails {
      width: 100px;
      height: 100px;
      margin-right: 25px !important;
      .oss_file {
        width: 100%;
        height: 100%;
        border: none;
        background-color: rgba(247, 249, 253, 1);
        border: 1px solid rgba(234, 234, 234, 1);
        border-radius: 4px;
        color: #3575f6;
        > i {
          font-size: 20px;
          position: absolute;
          top: -5px;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
        }
        > span {
          position: absolute;
          top: 18px;
          left: 0;
          right: 0;
          font-size: 12px;
        }
        > input {
          right: 0;
          top: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
          position: absolute;
        }
      }
    }
  }
  .el-dialog__footer {
    background: #fff;
    height: 56px;
    padding: 0 20px !important;
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 56px;
      span {
        display: block;
        height: 32px;
        line-height: 32px;
        border: 1px solid transparent;
        width: 80px;
        &:nth-child(2) {
          margin-right: 12px;
          height: 32px;
          line-height: 32px;
          background: #fff;
          color: #3577f6;
          border: 1px solid #3577f6;
          background: rgba(53, 119, 246, 0.05);
        }
        &:nth-child(3) {
          width: 100px;
        }
      }
    }
  }
}
</style>
