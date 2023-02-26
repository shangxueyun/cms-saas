<template>
  <div class="flow-details">
    <drawer :show="detailsdrawershow"
            class="drawer_new"
            :title="drawerTitle"
            :showEditBtn="isEdit && hasAuthority('02030319')&& this.detailsData.billAndFlows.length === 0"
            @on-hide="onHide"
            @on-edit="onEdit">
      <div class="details_content drawer-body"
           slot="drawer"
           style="width: 1000px;">
        <div class="main-content"
             style="padding:0">
          <el-form :model="detailsData"
                   ref="detailsData"
                   :rules="TenantDTORules">
            <div class="half_page_title"
                 style="width:100%">
              <div><i></i>基本信息</div>
            </div>
            <div class="part part1">
              <div class="content-info">
                <div>流水编号</div>
                <div>{{detailsData.code}}</div>
              </div>
              <div class="content-info">
                <div>流水类型</div>
                <div>{{formatBillType(detailsData.billType)}}</div>
              </div>
              <div class="content-info">
                <div>特定客户<i class="required">*</i></div>
                <div>{{detailsData.specificTenant?'是':'否'}}</div>
                <!-- <el-form-item prop="specificTenant"
                              v-else>
                  <el-radio-group v-model="detailsData.specificTenant">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item> -->
              </div>
              <div class="content-info"
                   v-if="detailsData.specificTenant">
                <div>管理企业</div>
                <div>{{detailsData.projectManagement ? detailsData.projectManagement.organizeName : ''}}</div>
              </div>
              <div class="content-info"
                   v-if="detailsData.specificTenant">
                <div>项目简称</div>
                <div>{{detailsData.projectManagement ? detailsData.projectManagement.referred : ''}}</div>
              </div>
              <div class="content-info"
                   v-if="detailsData.specificTenant">
                <div>客户名称</div>
                <div>{{detailsData.tenant ? detailsData.tenant.teantName : ''}}</div>
              </div>
              <div class="content-info">
                <div>匹配状态</div>
                <div>{{formatMatchState(detailsData.flowState)}}</div>
              </div>
              <div class="content-info">
                <div>付款方</div>
                <div v-if="isEdit">{{detailsData.payName?detailsData.payName:'-'}}</div>
                <el-form-item v-else
                              prop="payName">
                  <el-select v-model="detailsData.payName"
                             filterable
                             allow-create
                             placeholder=""
                             clearable
                             size="small"
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
              <div class="content-info">
                <div>付款方式</div>
                <div v-if="isEdit">{{detailsData.paymentMethodName}}</div>
                <el-form-item v-else
                              prop="payType">
                  <el-select v-model="detailsData.paymentMethodId"
                             size="small"
                             value-key="value"
                             @change="paymentMethodChange"
                             placeholder="请选择">
                    <el-option value="">请选择</el-option>
                    <el-option v-for="item in payTypeLists"
                               :key="item.id"
                               :label="item.value"
                               :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="content-info">
                <div>备注</div>
                <div v-if="isEdit">{{detailsData.remake ? detailsData.remake : '-'}}</div>
                <el-form-item v-else
                              style="width: 100%;margin-bottom: 20px;">
                  <el-input v-model="detailsData.remake"
                            size="small"
                            resize="none"
                            style="height:32px"
                            maxlength="200"
                            type="textarea">
                  </el-input>
                </el-form-item>
              </div>

            </div>
            <div class="half_page_title"
                 style="width:100%;margin-top:12px">
              <div><i></i>流水信息</div>
            </div>
            <div class="part part2">
              <div class="content-info">
                <div>流水单号</div>
                <div v-if="isEdit">{{detailsData.flowCode?detailsData.flowCode:'-'}}</div>
                <el-form-item v-else
                              prop="flowCode">
                  <el-input v-model="detailsData.flowCode"
                            size="small"
                            maxlength="50"></el-input>
                </el-form-item>
              </div>
              <div class="content-info">
                <div>回单日期<i class="required">*</i></div>
                <div v-if="isEdit">{{detailsData.recordDate}}</div>
                <el-form-item v-else
                              prop="recordDate">
                  <el-date-picker type="date"
                                  size="small"
                                  value-format="yyyy-MM-dd"
                                  v-model="detailsData.recordDate"
                                  placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </div>
              <div class="content-info">
                <div>流水金额/元<i class="required">*</i></div>
                <div v-if="isEdit">{{detailsData.amount+detailsData.serviceCharge | toLocaleString}}<span v-if="detailsData.serviceCharge>0">（含{{detailsData.serviceCharge| toLocaleString}}元手续费）</span></div>
                <el-form-item v-else
                              class="el-input__inner_with100"
                              prop="amount">
                  <!-- <el-input v-model="detailsData.amount"
                            type="number"> -->
                  <el-input v-model="detailsData.amount"
                            style="width:150px"
                            size="small"
                            placeholder="回单金额"
                            title=""
                            type="number">
                  </el-input>
                  <el-input v-model="detailsData.serviceCharge"
                            style="width:80px;margin-right:0"
                            placeholder="手续费"
                            size="small"
                            title=""
                            type="number">
                  </el-input>
                </el-form-item>
              </div>
              <div class="content-info">
                <div>收款人户名</div>
                <div v-if="isEdit">{{detailsData.beneficiaryName}}</div>
                <el-form-item v-else>
                  <el-autocomplete popper-class="my-autocomplete"
                                   size="small"
                                   v-model="detailsData.beneficiaryName"
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
              <div class="content-info">
                <div>收款人账号</div>
                <div v-if="isEdit">{{detailsData.beneficiaryAccount}}</div>
                <el-form-item v-else>
                  <el-input v-model="detailsData.beneficiaryAccount"
                            size="small"
                            type="number"
                            maxlength="50"></el-input>
                </el-form-item>
              </div>
              <div class="content-info">
                <div>收款开户行</div>
                <div v-if="isEdit">{{detailsData.beneficiaryBlank}}</div>
                <el-form-item v-else>
                  <el-input v-model="detailsData.beneficiaryBlank"
                            size="small"
                            maxlength="50"></el-input>
                </el-form-item>
              </div>
              <div class="content-info">
                <div>付款人户名</div>
                <div v-if="isEdit">{{detailsData.paymentName}}</div>
                <el-form-item v-else>
                  <el-autocomplete popper-class="my-autocomplete"
                                   size="small"
                                   v-model="detailsData.paymentName"
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
              <div class="content-info">
                <div>付款人账号</div>
                <div v-if="isEdit">{{detailsData.paymentAccount}}</div>
                <el-form-item v-else>
                  <el-input v-model="detailsData.paymentAccount"
                            size="small"
                            type="number"
                            maxlength="50"></el-input>
                </el-form-item>
              </div>
              <div class="content-info">
                <div>付款开户行</div>
                <div v-if="isEdit">{{detailsData.paymentBlank}}</div>
                <el-form-item v-else>
                  <el-input v-model="detailsData.paymentBlank"
                            size="small"
                            maxlength="50"></el-input>
                </el-form-item>
              </div>
              <div class="content-info">
                <div>
                  <span>附件</span>
                  <div class="upload"
                       style="margin-top: 0;"
                       v-if="detailsData.annexes.length < 5 && !isEdit">
                    <aliUpload class="aliUpload  aliUpload_small "
                               :upLoadText="upLoadText"
                               :fileType="fileType"
                               :iconShow="true"
                               @setAnnex="setAnnexs" />
                  </div>
                </div>
                <div v-if="isEdit">
                  <div class="enclosure-list el-item-preview"
                       v-for="(item, index) in detailsData.annexes"
                       :key="index">
                    <div class="el-item"
                         style="display: flex; justify-content: space-between;border-bottom: 1px solid #EBEBEB;align-items: center;">
                      <span style="padding-left: 0;;width: 80%;overflow: hidden;text-overflow: ellipsis; white-space: nowrap;">{{item.annexName}}</span>
                      <span @click="downloadFile(item, index)"
                            style="cursor:pointer;font-size:14px;margin-left:10px;margin-right:7px;"
                            class="iconfont icon-cms_xiazai-"></span>
                      <ailPreview :ailObj="item"
                                  :encrypt="true"
                                  @setFile="setFile" />
                    </div>
                  </div>
                </div>
                <div v-else
                     class="enclosure"
                     style="width:100%">
                  <div class="enclosure-list"
                       v-for="(item, index) in detailsData.annexes"
                       :key="index">
                    <div class="el-item"
                         style="display: flex; justify-content: space-between;border-bottom: 1px solid #EBEBEB;">
                      <span style="padding-left: 0;width: 80%;">{{item.annexName}}</span>
                      <span v-if="item.annexName"
                            style="padding-left: 0;width: auto;">
                        <i @click="downloadFile(item, index)"
                           class="iconfont icon-xiazaidaoru"
                           style="margin-right: 10px;cursor:pointer"></i>
                        <i @click="deleFile(item, index)"
                           class="iconfont icon-lajixiang"
                           style="cursor:pointer"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-form>
          <div class="half_page_title"
               style="margin: 12px 15px 0;">
            <div><i></i>匹配账单</div>
            <div @click="matchingBills"
                 class="matchingBills"
                 v-if="isEdit && hasAuthority('02030318') && detailsData.flowState !== 'OK'">匹配账单</div>
          </div>
          <div class="bills part">
            <div class="header">
              <div class="content-info1">
                <div>已匹配金额</div>
                <div>{{detailsData.ypAmount | toLocaleString}}</div>
              </div>
              <div class="line"></div>
              <div class="content-info1">
                <div>未匹配金额</div>
                <div>{{detailsData.wpAmount | toLocaleString}}</div>
              </div>
            </div>
            <ul class="bills-head">
              <li>项目简称</li>
              <li>客户名称</li>
              <!-- <li>品牌名称</li> -->
              <li>费用类型</li>
              <li>账单金额/元</li>
              <li>账单状态</li>
              <li>计费周期</li>
              <li>付款人</li>
              <li>出/入账时间</li>
              <li>匹配金额</li>
              <li>操作</li>
            </ul>
            <ul v-for="(item, index) in detailsData.billAndFlows"
                :key="index">
              <li class="code"
                  :title="item.projectManagementReferred">{{item.projectManagementReferred}}</li>
              <li class="code"
                  :title="item.tenandName">{{item.tenandName}}</li>
              <!-- <li :title="item.referred">{{item.referred}}</li> -->
              <li>{{item.feeTypeName}}</li>
              <li>{{item.billAmount | toLocaleString}}</li>
              <li>{{formatBillStatus(item.billStatus)}}</li>
              <li style="line-height: 22px;white-space: normal;">{{item.startDate}} - {{item.endDate}}</li>
              <li :title="item.drawee">{{item.drawee}}</li>
              <li>{{item.accountDate}}</li>
              <li>{{item.amount | toLocaleString}}</li>
              <li class="bullLi">
                <div @click="handleEdit(item.billId, item.billCategory)"
                     v-if="item.onPorject&&hasAuthority('02030306')">查看</div>
                <div v-if="hasAuthority('02030508')&&item.onConfirmOK&&item.onPorject"
                     @click="matchingTrue(item)">解除匹配</div>
              </li>
            </ul>
            <div class="noData"
                 v-if="detailsData.billAndFlows.length===0">暂无数据</div>
          </div>
          <!-- <div slot="footer"
               class="dialog-footer">
            <el-button v-if="!isEdit"
                       @click="onHide"
                       class="close-button">关 闭</el-button>
            <el-button v-if="!isEdit"
                       type="primary"
                       class="defaultbtn dialog-confirmBtn"
                       @click="editFolw">保 存</el-button>
            <el-button v-if="isEdit && hasAuthority('02030319')"
                       type="primary"
                       class="close-button"
                       @click="centerDialogVisible = true">删除流水</el-button>
          </div> -->
        </div>
        <!-- 匹配账单 -->
        <el-dialog v-if="billsDialogVisible"
                   title="匹配账单"
                   :visible.sync="billsDialogVisible"
                   class="matchingflow el_dialog_new matchingflow_new matchingflow_new2"
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
                  <span v-if="detailsData.tenant" :title="detailsData.tenant.teantName">{{detailsData.tenant.teantName}}</span>
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
              <div class="search-bar" style="padding: 10px 15px">
                <div style="display:flex;align-items:center">
                             <!-- @change='changeProjectManagementId' -->
                  <el-select v-model="projectManagementId"
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
                  <el-input v-model="referred"
                            v-if="!detailsData.specificTenant"
                            placeholder="输入客户"></el-input>
                  <div>
                    <el-select v-model="flowSearchData.feeType"
                               placeholder="选择费用类型"
                               clearable>
                      <el-option v-for="item in options1"
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
                        :data="tableData"
                        max-height="240"
                        tooltip-effect="dark"
                        class="details_table"
                        style="width: 100%;margin-bottom:15px"
                        :row-key="getRowKey"
                        :row-class-name="tableRowClassName"
                        @selection-change="handleSelectionChange1">
                <el-table-column :reserve-selection="true"
                                 align="center"
                                 type="selection"
                                 width="55">
                </el-table-column>
                <el-table-column align="center"
                                 label="项目简称">
                  <template slot-scope="scope"
                            class="code">{{ scope.row.projectManagement.referred}}</template>
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
                  <template slot-scope="scope">{{ scope.row.projectManagementReferred || scope.row.projectManagement.referred}}</template>
                </el-table-column>
                <el-table-column align="center"
                                 width="126"
                                 show-overflow-tooltip
                                 label="地址">
                  <template slot-scope="scope"
                            class="code"
                            v-if="scope.row.projectManagementAddress || scope.row.projectManagement">
                    {{ scope.row.projectManagementAddress || scope.row.projectManagement.address }}
                  </template>
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
                                 width="96"
                                 label="计费周期">
                  <template slot-scope="scope">{{ scope.row.startDate }} - {{scope.row.endDate}}</template>
                </el-table-column>
                <el-table-column align="center"
                                 label="账单金额/元">
                  <template slot-scope="scope">
                    <span v-if="!scope.row.isEdit">{{ scope.row.amount | toLocaleString}}</span>
                    <span v-else>{{ scope.row.billAmount | toLocaleString}}</span>
                  </template>
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
                                 label="匹配金额/元">
                  <template slot-scope="scope">
                    <el-input class="drawee"
                              type="number"
                              v-if="!scope.row.isEdit"
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
        <!-- 删除流水 -->
        <el-dialog v-if="centerDialogVisible"
                   class="lockDialogClose"
                   append-to-body
                   :visible.sync="centerDialogVisible"
                   width="400px"
                   center>
          <div class="lockDialogContent"
               style="padding-left: 40px">
            <img src="../../../../../assets/delete2.png">
            <div>
              <div class="div1">删除流水</div>
              <div class="div2">确定删除流水？</div>
            </div>
          </div>
          <span slot="footer"
                class="dialog-footer">
            <span class="cancel"
                  @click="centerDialogVisible = false">取消</span>
            <span class="determine"
                  @click="deleteBillFlows">确定</span>
          </span>
        </el-dialog>
        <!-- 解除匹配确认弹窗 -->
        <el-dialog v-if="matchingDialogVisible"
                   :visible.sync="matchingDialogVisible"
                   class="lockDialogClose"
                   append-to-body
                   width="400px">
          <div class="lockDialogContent"
               style="padding-left: 40px">
            <img src="../../../../../assets/jiechu2.png">
            <div>
              <div class="div1">解除匹配</div>
              <div class="div2">确定解除匹配流水吗？</div>
            </div>
          </div>
          <span slot="footer"
                class="dialog-footer">
            <span class="cancel"
                  @click="matchingDialogVisible = false">取消</span>
            <span class="determine"
                  @click="unMatching">确定</span>
          </span>
        </el-dialog>
        <picturePrevie v-if="showPicture"
                       :imgList="imgArr"
                       :num="num"
                       @pictureClose="pictureClose"></picturePrevie>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button v-if="!isEdit"
                   @click="onHide"
                   class="close-button">关 闭</el-button>
        <el-button v-if="!isEdit"
                   type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   @click="editFolw">保 存</el-button>
        <span v-if="isEdit && hasAuthority('02030319')"
              class="delBillBtn"
              @click="centerDialogVisible = true">删除流水</span>
      </div>
    </drawer>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import aliUpload from '@/components/aliUpload.vue'
import Drawer from '@/components/drawer.vue'
import ailPreview from '@/components/ailPreview.vue'
import picturePrevie from '@/components/picturePrevie.vue'
export default {
  name: 'billDetails',
  components: {
    Drawer,
    aliUpload,
    ailPreview,
    picturePrevie
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    detailsData: {
      type: Object,
      default: {
        annexes: []
      }
    },
    payTypeList: {
      type: Array,
      default: []
    },
    variety: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      matchingDialogVisible: false,
      multipleSelection: [],
      drawerTitle: '银行流水详情',
      isEdit: true,
      centerDialogVisible: false,
      TenantDTORules: {
        amount: [
          { required: true, message: '请填写流水金额', trigger: 'blur' }
        ],
        recordDate: [
          { required: true, message: '请选择回单日期', trigger: 'blur' }
        ]
      },
      upLoadText: '上传附件',
      fileType: [],
      billsDialogVisible: false,
      tableData: Object.freeze([
        { ppAmount: '', projectManagement: {} }
      ]),
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      flowSearchData: {
        flowCode: '',
        startDate: '',
        endDate: ''
      },
      options1: [],
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
      payTypeLists: [],
      payUserList: [],
      imgArr: [],
      nmgArr: [],
      num: 0,
      showPicture: false,
      projectManagementId: [],
      projectManagement: [],
      referred: '',
      billId: ''
    }
  },
  watch: {
    detailsData: {
      handler: function () {
        this.newPipeline()
      }
    }
  },
  created () {
    this.getProjectOptions()
    this.newPipeline()
    this.getFeeType()
  },
  methods: {
    // changeProjectManagementId (e) {
    //   debugger
    //   console.log(e)
    //   console.log(this.projectManagementId)
    // },
    tableRowClassName ({row, rowIndex}) {
      return 'code'
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
    matchingTrue (item) {
      this.matchingDialogVisible = true
      this.flowId = item.billFlowId
      this.billId = item.billId
    },
    unMatching () {
      context.http.get('/cms/api/bill_and_flow/unmate?billId=' + this.billId + '&flowId=' + this.flowId).then(res => {
        this.matchingDialogVisible = false
        let detailsData = JSOG.decode(this.detailsData)
        this.$emit('handleEdit', 0, detailsData, this.flowId)
        //      this.onHide()
        this.$message({
          message: '解除匹配成功！',
          type: 'success'
        })
      }).catch(error => {
        console.info(error)
        this.matchingDialogVisible = false
        //      this.onHide()
      })
    },
    async getProjectOptions () {
      let result = await context.http.get('cms/api/project-managements', { useStatus: 'USING' })
      this.projectManagement = result.data
      this.projectManagementId = [this.projectManagement[0].id]
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
          this.$emit('handleEdit', 0, detailsData, detailsData.id)
        }
      })
    },
    async getFeeType () { // 费用类型
      let result1 = await context.http.get('/uaa/api/paramet-managements/name', { name: '费用类型' })
      let result2 = await context.http.get('/uaa/api/paramet-managements/name', { name: '多经费用类型' })
      this.options1 = result1.data.concat(result2.data)
    },
    matchingBills (isSeach) {
      this.billAndFlows = JSON.parse(JSON.stringify(this.detailsData.billAndFlows))
      this.billAndFlows = this.billAndFlows.map(v => {
        v.isEdit = true
        return v
      })
      this.multipleSelection = this.billAndFlows
      console.log('multipleSelection', this.multipleSelection)
      this.currentPage = 1
      if (isSeach !== 'seach' || !isSeach) {
        // this.multipleSelection = []
        this.flowSearchData = {
          feeType: '',
          startDate: '',
          endDate: ''
        }
      }
      this.getbillsList(this.detailsData.id)
      this.billsDialogVisible = true
    },
    getbillsList (id) { // 请求未匹配账单
      let tenantId = this.detailsData.tenant ? this.detailsData.tenant.id : ''
      // if (this.detailsData.specificTenant) {
      //   this.projectManagementId = null
      //   this.referred = null
      // }
      context.http.get('cms/api/bills/nomate?sort=finalPaymentDate,asc&sort=id,asc', {
        page: (this.currentPage - 1),
        // size: this.pgSize,
        flowId: id,
        tenantId: tenantId,
        projectManagementId: this.projectManagementId.toString(),
        referred: this.referred,
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
        this.tableData = res.data
        console.log(this.tableData)
        this.total = Number(res.headers['x-total-count'])
      })
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
    // matchflow () {
    //   this.multipleSelection = []
    //   this.flowSearchData = {
    //     flowCode: '',
    //     startDate: '',
    //     endDate: ''
    //   }
    //   this.matchflowDialogVisible = true
    //   context.http.get('/cms/api/billFlows/nomate', { billId: this.detailsData.id, billType: this.detailsData.billType, tenantId: this.detailsData.tenandId, sort: 'recordDate,asc', startDate: '', endDate: '' }).then(res => {
    //     if (res) {
    //       this.tableData = res.data
    //       // this.tableData.forEach(ele => {
    //       //   ele.amount = toLocaleString(ele.amount)
    //       // })
    //     }
    //   })
    // },
    getRowKey (row) {
      return row.id
    },
    // -----------------------------------------------------------------
    async querySearch1 (queryString, cb) { // 收款
      // if (!queryString || queryString === '') {
      //   return false
      // }
      let result = await context.http.get('cms/api/tenantPays/beneficiary?query=' + this.detailsData.beneficiaryName)
      cb(result.data)
    },
    async querySearch2 (queryString, cb) { // fu款
      // if (!queryString || queryString === '') {
      //   return false
      // }
      let result = await context.http.get('cms/api/tenantPays/payment?query=' + this.detailsData.paymentName)
      cb(result.data)
    },
    handleSelect (item) {
      this.detailsData.beneficiaryName = item.name // 收款人户名
      this.detailsData.beneficiaryAccount = item.account // 收款人账号
      this.detailsData.beneficiaryBlank = item.blank // 收款开户行
    },
    handleSelect1 (item) {
      this.detailsData.paymentName = item.name // 收款人户名
      this.detailsData.paymentAccount = item.account // 收款人账号
      this.detailsData.paymentBlank = item.blank // 收款开户行
    },
    setFile (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    getPayUserList () {
      if (this.detailsData.tenant && this.detailsData.tenant.id) {
        context.http.get('cms/api/tenantPays/' + this.detailsData.tenant.id).then(res => {
          this.payUserList = res.data.filter(item => {
            return item.payName !== '' && item.payName !== null
          })
        })
      }
    },
    pictureClose () {
      this.showPicture = false
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onHide (index) {
      if (this.variety === 'variety') {
        this.$router.push({ path: '/home/incomeList' })
      } else {
        this.$emit('drawerClose', false)
        if (index === 1) {
          this.$emit('query', false, index)
        } else {
          this.$emit('query', false)
        }
        this.isEdit = true
      }
    },
    async newPipeline () {
      let result1 = await context.http.get('/uaa/api/paramet-managements/name', { name: '付款方式' })
      this.payTypeLists = result1.data
    },
    paymentMethodChange () {
      let paymentMethodName = ''
      paymentMethodName = this.payTypeLists.filter(item => {
        return item.id === this.detailsData.paymentMethodId
      })
      this.detailsData.paymentMethodName = paymentMethodName[0].value
    },
    handleSelectionChange (val) {
      let billIds = val
      this.billIds = billIds.map(item => {
        return item.id
      })
      console.log(this.billIds)
    },
    onEdit () {
      if (this.detailsData.billAndFlows && this.detailsData.billAndFlows.length > 0) {
        this.$message({
          message: '该流水已匹配账单，不支持修改',
          type: 'warning'
        })
        return
      }
      this.isEdit = false
    },
    editFolw () {
      this.$refs['detailsData'].validate((valid) => {
        if (valid) {
          if (this.detailsData.amount < 0) {
            this.$message({
              type: 'error',
              message: '金额不能为负数'
            })
            return
          }
          let _this = this
          context.http.put('/cms/api/billFlows', this.detailsData).then(res => {
            if (res.status === 200) {
              _this.isEdit = true
              _this.$emit('handleEdit', 0, res.data)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deleteBillFlows () {
      context.http.delete(`/cms/api/billFlows/${this.detailsData.id}`).then(res => {
        if (res.status === 200) {
          this.$emit('handleEdit', 0, this.detailsData, this.flowId)
          this.$message.success('删除成功')
          this.centerDialogVisible = false
          this.onHide(1)
        }
      })
    },
    setAnnexs (annexURL, annexName) {
      this.detailsData.annexes.push({ 'annexURL': annexURL, 'annexName': annexName })
    },
    deleFile (item, index) {
      this.detailsData.annexes.splice(index, 1)
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
    handleEdit (id, type) {
      if (type === 'DIVERSIFICATION') {
        this.$router.push({ path: '/home/incomeList', query: { billId: id } })
      } else {
        this.$emit('showBill', id)
        // this.$router.push({path: '/home/billList', query: {billId: id}})
      }
    },
    formatBillType (val) {
      return val === 'R' ? '收款' : '付款'
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.getbillsList(this.detailsData.id)
    },
    currentSel () {
      this.currentPage = 1
      this.getbillsList(this.detailsData.id)
    },
    formatMatchState (val) {
      let res = ''
      if (val === 'OK') {
        res = '完全匹配'
      } else if (val === 'SECTION') {
        res = '部分匹配'
      } else {
        res = '未匹配'
      }
      return res
    },
    formatBillStatus (val) {
      let res = ''
      if (val === 'APPROVAL') {
        res = '减免审核中'
      } else if (val === 'UPDATE') {
        res = '减免驳回待修改'
      } else if (val === 'NO') {
        res = '未付款'
      } else if (val === 'OK') {
        res = '已结清'
      } else if (val === 'SECTION') {
        res = '部分结清'
      } else if (val === 'STAY_SETTLE') {
        res = '待结清'
      }
      return res
    },
    formatFeeType (val) {
      let feeType
      switch (val) {
        case 'RENT':
          feeType = '租金'
          break
        case 'RENT_DEPOSIT':
          feeType = '租金保证金'
          break
        case 'PROPERTY':
          feeType = '物业费'
          break
        case 'PROPERTY_DEPOSIT':
          feeType = '物业费保证金'
          break
        case 'INTENTION':
          feeType = '意向金'
          break
        case 'DECORATION':
          feeType = '装修保证金'
          break
        case 'F_INTENTION':
          feeType = '返还意向金'
          break
        case 'F_DECORATION':
          feeType = '返还装修保证金'
          break
        case 'WITHDRAWAL':
          feeType = '退租结算'
          break
        case 'RELEASE':
          feeType = '合同解除结算'
          break
      }
      return feeType
    }
  }
}
</script>
<style lang="scss" scoped>
.flow-details {
  .details_content {
    &.drawer-body {
      height: calc(100% - 56px);
      overflow-y: auto;
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
    li.bullLi {
      display: flex;
      justify-content: space-around;
    }
    li.bullLi div {
      cursor: pointer;
      color: #0f75ff;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .delBillBtn {
    display: inline-block;
    width: 90px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background: rgba(210, 59, 47, 0.1);
    border: 1px solid rgba(210, 59, 47, 1);
    border-radius: 4px;
    color: #d92e20;
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.matchingflow_new {
  &.matchingflow_new1 {
    .el-dialog {
      width: 1390px !important;
    }
  }
  &.matchingflow_new2 {
    .el-dialog {
      width: 1400px !important;
    }
  }
  .ul_list {
    li span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
    }
  }
}
.flow-details {
  .drawer-head {
    border-bottom: 1px solid rgba(229, 229, 229, 1);
  }
  .main-content {
    position: relative;
    margin-top: 10px;
    .el-item-preview {
      margin-top: 0 !important;
      > .el-item {
        margin-top: 0 !important;
        > div {
          display: inline-block;
          cursor: pointer;
          .icon-cms_chakan- {
            // color: rgb(0, 92, 179);
          }
        }
      }
    }
    > .el-form {
      margin: 0 15px 12px;
      .part {
        background-color: #fff;
        padding: 0 15px;
      }
    }
    .half_page_title {
      border-bottom: 1px solid #eeeeee;
      .matchingBills {
        float: right;
        width: 70px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        font-size: 12px;
        color: #3577f6;
        border: 1px solid #7fafe6;
        cursor: pointer;
        border-radius: 4px;
        font-weight: normal;
      }
    }
    .content-info {
      display: inline-block;
      width: 32%;
      margin-top: 20px;
      vertical-align: top;
      div {
        font-size: 14px;
        color: #777777;
        i.required {
          color: red;
        }
        &:last-child {
          font-size: 14px;
          color: #262626;
          margin-top: 6px;
          min-height: 14px;
        }
      }
      .el-form-item__error {
        color: #f56c6c !important;
      }
      .el-form-item {
        margin-bottom: 0;
      }
      .el-select {
        width: 240px;
        height: 40px;
        margin-top: 0 !important;
      }
      .el-input {
        width: 240px;
        // height: 40px;
        margin-top: 0 !important;
      }
      .el-textarea {
        width: 240px;
        height: 40px;
        margin-top: 0 !important;
      }
      textarea {
        width: 240px;
        height: 32px;
      }
      .el-input__inner {
        width: 240px;
      }
      .el-input__inner_with100 {
        .el-input__inner {
          width: 100%;
        }
      }
      .upload {
        position: relative;
        display: inline-block;
        width: 80px !important;
        height: 24px;
        line-height: 23px;
        opacity: 0.9;
        border-radius: 2px;
        font-size: 12px;
        text-align: center;
        // border: 1px solid #0f75ff;
        color: #0f75ff !important;
        border-radius: 4px;
        cursor: pointer;
        .aliUpload {
          width: 100%;
          height: 100%;
          position: absolute;
          right: 0;
          top: 0;
          margin-top: 0;
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
    .matched-bills {
      margin: 40px 0 15px;
      height: 26px;
      span {
        display: block;
        line-height: 26px;
        float: left;
      }
      div {
        float: right;
        width: 70px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        font-size: 12px;
        color: #3577f6;
        border: 1px solid #7fafe6;
        cursor: pointer;
        border-radius: 4px;
      }
    }
    .bills {
      background: rgba(255, 255, 255, 1);
      // border: 1px solid rgba(241, 241, 241, 1);
      border: none;
      &.part {
        margin: 0 15px 12px;
        .header {
          height: 70px;
          padding: 0 15px;
          display: flex;
          align-items: center;
          .line {
            width: 2px;
            height: 35px;
            background-color: #f3f3f3;
            margin-right: 10px;
          }
          .content-info1 {
            width: 150px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: 14px;
            > div {
              &:first-child {
                color: #777777;
              }
              &:last-child {
                margin-top: 10px;
                color: #262626;
              }
            }
          }
        }
        .noData {
          font-size: 12px;
          color: #262626;
          margin: 0 15px;
          text-align: center;
          height: 40px;
          line-height: 40px;
        }
      }
      .bills-head {
        background-color: #f7f8fa;
        color: #777777;
        font-size: 14px;

        li {
          font-size: 12px;
          width: 11%;
          text-align: center;
          height: 30px;
          line-height: 30px;
          overflow: hidden;
        }
      }
      ul {
        display: flex;
        margin: 0 15px;
        &:first-child {
          background: rgba(250, 250, 250, 1);
        }
        li {
          font-size: 12px;
          width: 11%;
          text-align: center;
          height: 50px;
          line-height: 50px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &.code {
            font-size: 12px;
            width: 11%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .ck-btn {
        display: inline-block;
        width: 60px;
        height: 26px;
        line-height: 25px;
        text-align: center;
        border: 1px solid rgba(53, 119, 246, 1);
        border-radius: 4px;
        color: rgba(53, 119, 246, 1);
        cursor: pointer;
      }
    }
    .dialog-footer {
      border-top: 1px solid #e5e5e5;
      padding: 20px 0;
      text-align: right;
      margin-top: 100px;
    }
  }
}
.warnDialog {
  .warnIcon {
    display: block;
    width: 90px;
    height: 90px;
    margin: 20px auto;
  }
  .warnInfo {
    display: block;
    width: 100%;
    text-align: center;
    margin-bottom: 30px;
  }
}
.code {
  .cell {
    white-space: nowrap !important;
  }
}
.select_table {
  .el-input__icon {
    line-height: 1;
  }
  .el-date-editor {
    .el-input__inner {
      padding: 6px;
    }
  }
}
</style>
