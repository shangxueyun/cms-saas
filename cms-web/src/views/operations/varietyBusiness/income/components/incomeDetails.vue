<template>
  <div class="contracts-info">
    <drawer :show="detailsdrawershow"
            class="drawer_new"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class=" details_content drawer-body"
           style="width: 1000px;"
           slot="drawer">
        <div class="main-content"
             style="padding:0">
          <div class="billDetails">
            <!-- <div class="head-right">
              <span @click="showRemarks=true">备注</span>
              <span @click="showEnclosure=true">附件</span>
            </div> -->
            <div class="dl-content clearfix">
              <el-form :model="detailsData"
                       ref="addData"
                       :rules="addDataRules">
                <div class="step1">
                  <div class="dc-left float-left"
                       style="text-align: left;min-height: 430px">
                    <div class="half_page_title"
                         style="width:100%">
                      <div><i></i>多经点位</div>
                    </div>
                    <div class="basic-select">
                      <div class="clearfix selectInput"
                           style="border: none;margin-bottom: 20px;display: flex;justify-content: flex-start;"
                           v-if="detailsData.projectManagement">
                        <img :src="detailsData.projectManagement.previewImage" />
                        <span>{{detailsData.projectManagement.referred}}</span>
                      </div>
                      <div class="bd-number">
                        <span>编号</span>
                        <span>点位名称</span>
                        <span>点位类型</span>
                      </div>
                      <div class="layer">
                        <div v-for="(item, index) in detailsData.managementPointDTOS"
                             :key="index">
                          <span :title="item.pointCode">{{item.pointCode}}</span>
                          <span :title="item.pointName">{{item.pointName}}</span>
                          <span>{{item.pointTypeName}}</span>
                        </div>
                      </div>
                    </div>
                    <div class="bd-number"
                         style="margin-bottom:15px">客户信息</div>
                    <div class="tenant-info">
                      <span>
                        <p>客户名称</p>
                        <p :title="detailsData.tenantName">{{detailsData.tenantName}}</p>
                      </span>
                      <span>
                        <p>品牌名称</p>
                        <p>{{detailsData.referred}}</p>
                      </span>
                      <span>
                        <p>合同编号</p>
                        <p>{{detailsData.contractNo}}</p>
                      </span>
                    </div>
                  </div>
                  <div class="dc-right float-right"
                       style="min-height: 430px">
                    <div class="half_page_title"
                         style="width:100%">
                      <div><i></i>账单信息</div>
                      <div>
                        <i class="iconfont icon-edit2 icon-edit1"
                           v-if="hasAuthority('02030505') && isEdit && this.detailsData.billAndFlows && this.detailsData.billAndFlows.length === 0"
                           @click="onEdit">编辑</i>
                      </div>
                    </div>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="yxContractNo">
                      <div class="cttitle">账单编号</div>
                      <span>{{detailsData.code}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">租赁方式</div>
                      <span>{{formatRentalMethod(detailsData.rentalMethod)}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">费用类型</div>
                      <span>{{detailsData.feeTypeName}}</span>
                    </el-form-item>
                    <el-form-item v-if="isEdit"
                                  :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">计费周期<i style="color:red">*</i></div>
                      <span>{{detailsData.startDate}}~{{detailsData.endDate}}</span>
                    </el-form-item>

                    <el-form-item v-if="!isEdit"
                                  :label-width="formLabelWidth"
                                  prop="startDate"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">计费周期<i style="color:red">*</i></div>
                      <el-date-picker type="date"
                                      value-format="yyyy-MM-dd"
                                      size="small"
                                      v-model="detailsData.startDate"
                                      placeholder="开始日期">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item v-if="!isEdit"
                                  :label-width="formLabelWidth"
                                  prop="endDate"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle"></div>
                      <el-date-picker type="date"
                                      value-format="yyyy-MM-dd"
                                      size="small"
                                      v-model="detailsData.endDate"
                                      placeholder="结束日期">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="area"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">账单类型</div>
                      <span>{{formatBillType(detailsData.billType)}}</span>
                    </el-form-item>
                    <el-form-item v-if="detailsData.rentalMethod !== 'RENT' && detailsData.feeTypeName === '租金'"
                                  :label-width="formLabelWidth"
                                  prop="iDNumber">
                      <div class="cttitle">租金抽成比例</div>
                      <span>{{detailsData.finalPrice}}%</span>
                    </el-form-item>
                    <el-form-item v-if="detailsData.rentalMethod === 'GUARANTEEPOINT'"
                                  :label-width="formLabelWidth"
                                  prop="iDNumber">
                      <div class="cttitle">保底租金/元</div>
                      <span>{{detailsData.bdAmount}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="amount">
                      <div class="cttitle">账单金额<i style="color:red">*</i></div>
                      <span v-if="isEdit">{{detailsData.amount | toLocaleString}}</span>
                      <el-input v-else
                                @input="changeCode"
                                size="small"
                                maxlength="13"
                                v-model="detailsData.amount"></el-input>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px">
                      <div class="cttitle">账单状态</div>
                      <span>{{formatBillStatus(detailsData.billStatus)}}</span>
                    </el-form-item>
                    <el-form-item prop="finalPaymentDate"
                                  :label-width="formLabelWidth">
                      <div class="cttitle">{{detailsData.billType === 'P' ? '应付时间' : '应收时间'}}<i style="color:red">*</i></div>
                      <span v-if="isEdit">{{detailsData.finalPaymentDate}}</span>
                      <el-date-picker v-else
                                      type="date"
                                      value-format="yyyy-MM-dd"
                                      size="small"
                                      v-model="detailsData.finalPaymentDate"
                                      placeholder="选择日期">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">备注</div>
                      <span v-if="isEdit">{{detailsData.remake}}</span>
                      <el-input style="height:40px"
                                v-else
                                v-model="detailsData.remake"
                                resize="none"
                                maxlength="70"
                                type="textarea">
                      </el-input>
                    </el-form-item>
                  </div>
                  <div class="dc-right float-right tenantinfo"
                       style="width: 100%;margin-top:15px">
                    <!-- <div class="dr-head clearfix"
                         style="margin-bottom: 0">账单核销
                      <div class="btn-wrap"
                           v-if="detailsData.billStatus !== 'OK' && detailsData.rentalMethod ==='POINTS' && detailsData.feeTypeName === '租金' && detailsData.turnoverStatus === 'OK' || 
                      detailsData.billStatus !== 'OK' && detailsData.rentalMethod ==='POINTS' && detailsData.feeTypeName !== '租金'  ||
                      detailsData.billStatus !== 'OK' && detailsData.rentalMethod !=='POINTS'">
                        <span class=""
                              @click="newPipeline()"
                              v-if="hasAuthority('02030506')">新增流水</span>
                        <span class=""
                              @click="matchflowDialogVisible = true,querySearch()"
                              v-if="hasAuthority('02030507')">匹配流水</span>
                      </div>
                    </div> -->
                    <div class="half_page_title"
                         style="width:100%">
                      <div><i></i>账单核销</div>
                      <div class="btn-wrap"
                           v-if="detailsData.billStatus !== 'OK' && detailsData.rentalMethod ==='POINTS' && detailsData.feeTypeName === '租金' && detailsData.turnoverStatus === 'OK' || 
                      detailsData.billStatus !== 'OK' && detailsData.rentalMethod ==='POINTS' && detailsData.feeTypeName !== '租金'  ||
                      detailsData.billStatus !== 'OK' && detailsData.rentalMethod !=='POINTS'">
                        <span class=""
                              @click="newPipeline()"
                              v-if="hasAuthority('02030506')">新增流水</span>
                        <span class=""
                              @click="matchflowDialogVisible = true,multipleSelection=[],querySearch()"
                              v-if="hasAuthority('02030507')&&isEdit">匹配流水</span>
                      </div>
                    </div>
                    <ul class="">
                      <li>流水编号</li>
                      <li>流水金额/元</li>
                      <li>核销金额</li>
                      <li>核销时间</li>
                      <li>核销人</li>
                      <li>付款人</li>
                      <li>出/入账时间</li>
                      <li>操作</li>
                    </ul>
                    <!--detailsData.billAndFlows-->
                    <ul class="billUl"
                        v-for="(item, index) in detailsData.billAndFlows"
                        :key="index">
                      <li>
                        <span>{{item.billFlowCode}}</span>
                      </li>
                      <li>{{item.billFlowAmount | toLocaleString}}</li>
                      <li>{{item.amount | toLocaleString}}</li>
                      <li>{{item.writeOffDate}}</li>
                      <li>{{item.writeOff}}</li>
                      <li class="ellipsis">{{item.drawee}}</li>
                      <li>{{item.accountDate}}</li>
                      <li class="bullLi">
                        <div @click="flowDetail(item.billFlowId)">查看</div>
                        <div v-if="hasAuthority('02030508')"
                             @click="matchingTrue(item.billFlowId)">解除匹配</div>
                      </li>
                    </ul>
                    <div class="noData"
                         v-if="detailsData.billAndFlows && detailsData.billAndFlows.length===0">暂无数据</div>
                  </div>

                  <!--<div class="turnoverBtn" v-if="detailsData.rentalMethod !== 'RENT' && detailsData.feeTypeName === '租金' && detailsData.turnoverStatus !== 'OK'">
                    <span class="" @click="showAmountCalculation()">输入营业额</span>
                  </div>-->
                </div>
              </el-form>
              <div class="step2 dl-content"
                   v-show="newlystep2">
                <div class="dc-right float-right">
                  <div class="dr-head">其他信息</div>
                  <div class="other-info">
                    <div style="margin-bottom: 10px;">备注</div>
                    <el-input type="textarea"
                              :rows="2"
                              resize="none">
                    </el-input>
                    <div style="margin: 40px 0 10px;">附件
                      <span class="upload">
                        上传附件
                        <input type="file"
                               @change="imageChange('addapp', $event)"
                               accept="image/png, image/jpeg">
                      </span>
                    </div>
                    <div class="enclosure">
                      <div class="enclosure-head">
                        <span>文件名</span>
                        <span>操作</span>
                      </div>
                      <div v-if="reduction.annexURL"
                           class="enclosure-list">
                        <div class="el-item">
                          <span>{{reduction.annexName}}</span>
                          <span>
                            <i @click="downloadFile"
                               class="iconfont icon-xiazaidaoru"
                               style="margin-right: 10px;"></i>
                            <i @click="deleFile"
                               class="iconfont icon-lajixiang"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button v-if="!isEdit"
                   @click="onHide"
                   class="close-button">关 闭</el-button>
        <el-button v-if="!isEdit"
                   type="primary"
                   @click="billSave('addData')"
                   class="defaultbtn dialog-confirmBtn">保 存</el-button>
        <span v-if="isEdit && hasAuthority('02030509')"
              class="delBillBtn"
              @click="deleBill">删除账单</span>
      </div>
    </drawer>
    <div class="contracts-remarks"
         v-show="showRemarks">
      <div class="rektitle">备注
        <span @click="showRemarks=false">关闭</span>
      </div>
      <el-input type="textarea"
                :rows="4"
                resize="none"
                placeholder="请输入内容">
      </el-input>
      <div class="operation">
        <span>确定</span>
      </div>
      <div class="remarks-list">
        <div class="remarks-item">
          <div>备注记录：</div>
          <div>
            <span>该商户租房源用于餐饮店铺</span>
            <span>2018.12.29</span>
          </div>
        </div>
      </div>
    </div>
    <div class="contracts-enclosure"
         v-show="showEnclosure">
      <div class="rektitle">附件管理
        <span @click="showEnclosure=false">关闭</span>
      </div>
      <div class="upload">
        <span>上传文件</span>
        <input type="file"
               @change="imageChange('addapp', $event)"
               accept="image/png, image/jpeg">
      </div>
      <div class="enclosure-list">
        <div class="enclosure-item">
          <span>商务条款.pdf</span>
          <span>删除</span>
          <span>下载</span>
        </div>
      </div>
    </div>
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
            项目简称<span class="required">*</span>
            <el-form-item prop="projectManagement.id">
              <el-select v-model="addData.projectManagement.id"
                         value-key="id"
                         @change="chooseProject"
                         placeholder="请选择">
                <el-option value="">请选择</el-option>
                <el-option v-for="item in projectManagement"
                           :key="item.id"
                           :label="item.referred"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="dl-subtitle"
               v-if="addData.specificTenant">
            客户名称/品牌名称
            <el-form-item prop="tenant">
              <el-autocomplete v-model="addData.tenant.teantName"
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
          <div class="inlinediv">
            <div class="dl-subtitle">备注</div>
            <el-form-item style="width: 100%;margin-bottom: 20px;margin-top:6px;">
              <el-input v-model="addData.remake"
                        resize="none"
                        maxlength="200"
                        type="textarea">
              </el-input>
            </el-form-item>
          </div>

        </div>
        <!-- ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| -->
        <div class="half_page_title"
             style="width:100%">
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
          <div class="enclosure"
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
                    <i @click="deleFile1(item, index)"
                       class="iconfont icon-lajixiang"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
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

    <!-- 匹配账单 -->
    <el-dialog v-if="billsDialogVisible"
               title="匹配账单"
               :visible.sync="billsDialogVisible"
               class="matchingflow el_dialog_new matchingflow_new matchingflow_new1 matchingflow_width"
               append-to-body>
      <div class="dialog_content">
        <div style="margin-bottom:10px;"
             class="flow_list">
          <ul class="ul_list">
            <li>
              <p>特定客户</p>
              <span>{{detailsData1.specificTenant ? '是' : '否'}}</span>
            </li>
            <li v-if="detailsData1.specificTenant">
              <p>项目简称</p>
              <span v-if="detailsData1.projectManagement">{{detailsData1.projectManagement.referred}}</span>
            </li>
            <li v-if="detailsData1.specificTenant">
              <p>品牌名称</p>
              <span v-if="detailsData1.tenant" :title="detailsData1.tenant.referred">{{detailsData1.tenant.referred}}</span>
            </li>
            <li>
              <p>流水金额/元</p>
              <span>{{detailsData1.amount+detailsData1.serviceCharge}}</span>
            </li>
            <li>
              <p>已匹配金额/元</p>
              <span>{{detailsData1.ypAmount}}</span>
            </li>
            <li>
              <p>未匹配金额/元</p>
              <span>{{detailsData1.wpAmount}}</span>
            </li>
          </ul>
          <!-- <el-table key="flowDataTable"
                    ref="flowDataTable"
                    max-height="240"
                    :data="detailsData1.billAndFlows"
                    v-if="detailsData1.billAndFlows.length > 0"
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
          <div class="half_page_title" style="width:100%">
            <div><i></i>待匹配账单</div>
          </div>
          <div class="search-bar">
            <div style="display:flex;align-items:center">
              <el-select v-model="flowSearchData1.projectManagementId"
                         v-if="!detailsData1.specificTenant"
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
              <el-input v-model="flowSearchData1.referred"
                        v-if="!detailsData1.specificTenant"
                        placeholder="输入品牌"></el-input>
              <div>
                <el-select v-model="flowSearchData1.feeType"
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
                                v-model="flowSearchData1.startDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="应收/应付开始时间">
                </el-date-picker>
              </div>
              <div class="split">-</div>
              <div>
                <el-date-picker v-model="flowSearchData1.endDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="应收/应付结束时间">
                </el-date-picker>
              </div> -->
              <div class="query-btn"
                   @click="matchingBills('seach')">查询</div>
            </div>
          </div>
          <el-table key="multipleTable1"
                    ref="multipleTable1"
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
                              width="114"
                              show-overflow-tooltip
                              label="地址">
              <template slot-scope="scope" class="code">{{ scope.row.projectManagement.address }}</template>
            </el-table-column> 
            <el-table-column align="center"
                              width="114"
                              show-overflow-tooltip
                              label="客户名称">
              <template slot-scope="scope" >{{ scope.row.tenantName }}</template>
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
          <div class="half_page_title" style="width:100%">
            <div><i></i>匹配账单</div>
          </div>
          <el-table key="selectTable1"
                    ref="selectTable1"
                    max-height="240"
                    :data="multipleSelection1"
                    tooltip-effect="dark"
                    class="details_table select_table"
                    style="width: 100%">
            <el-table-column align="center"
                             label="项目简称">
              <template slot-scope="scope">{{ scope.row.projectManagement.referred}}</template>
            </el-table-column>
            <el-table-column align="center"
                              width="114"
                              show-overflow-tooltip
                              label="地址">
              <template slot-scope="scope" class="code">{{ scope.row.projectManagement.address }}</template>
            </el-table-column> 
            <el-table-column align="center"
                              width="114"
                              show-overflow-tooltip
                              label="客户名称">
              <template slot-scope="scope" >{{ scope.row.tenantName || scope.row.tenandName }}</template>
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
            <el-table-column width="96" align="center"
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
              <template slot-scope="scope" class="code">
                <el-date-picker
                      v-if="!scope.row.isEdit"
                      v-model="scope.row.recordDate"
                      type="date"
                      prefix-icon="prefix-icon"
                      value-format="yyyy-MM-dd"
                      placeholder="">
                    </el-date-picker>
                    <span v-else>{{scope.row.recordDate}}</span>
              </template>
            </el-table-column>
            <el-table-column width="96" align="center"
                             label="匹配金额/元">
              <template slot-scope="scope">
                <el-input class="drawee"
                              type="number"
                              v-if="!scope.row.isEdit"
                              v-model="scope.row.ppAmount"
                              placeholder=""></el-input>
                    <span v-else>{{scope.row.ppAmount}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="操作">
              <template slot-scope="scope"><span v-if="!scope.row.isEdit" class="delete_btn"
                      @click="deleteFlow1(scope.row)">删除</span></template>
            </el-table-column>
          </el-table>
        </div>

      </div>
      <div slot="footer"
           class="dialog-footer slotfooter">
        <span @click="billsDialogVisible = false"
              class="details_cannelBtn">取消</span>
        <span type="primary"
              @click="saveFlow1('addform')"
              class="details_submitBtn">匹配</span>
      </div>
    </el-dialog>

    <!-- 匹配流水 -->
    <el-dialog v-if="matchflowDialogVisible"
               title="匹配流水"
               :visible.sync="matchflowDialogVisible"
               class="matchingflow el_dialog_new matchingflow_new"
               append-to-body>
      <div class="dialog_content">
        <div style="margin-bottom:10px;"
             class="flow_list">
          <ul class="ul_list">
            <li>
              <p>项目简称</p>
              <span>{{detailsData.projectManagement.referred}}</span>
            </li>
            <li>
              <p>品牌名称</p>
              <span :title="detailsData.referred">{{detailsData.referred}}</span>
            </li>
            <li>
              <p>账单金额/元</p>
              <span>{{detailsData.amount}}</span>
            </li>
            <li>
              <p>欠收金额/元</p>
              <span>{{detailsData.arrearsAmount}}</span>
            </li>
          </ul>
        </div>
        <div style="margin-bottom:10px;" class="flow_list">
          <div class="dr-head" style="margin-bottom: 0"><i class="titBorder"></i>待匹配流水</div>
          <div class="search-bar">
            <div style="display:flex;align-items:center">
              <el-input v-model="flowSearchData.flowCode"
                        placeholder="流水单号"></el-input>
              <div>
                <el-date-picker style="margin-right:0;"
                                v-model="flowSearchData.startDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="回单开始日期">
                </el-date-picker>
              </div>
              <div class="split">-</div>
              <div>
                <el-date-picker v-model="flowSearchData.endDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="回单结束日期">
                </el-date-picker>
              </div>
              <div class="query-btn"
                   @click="querySearch('search')">查询</div>
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
                    @selection-change="handleSelectionChange">
            <el-table-column :reserve-selection="true"
                             align="center"
                             type="selection"
                             width="55">
            </el-table-column>
            <el-table-column align="center"
                             label="流水单号">
              <template slot-scope="scope">{{ scope.row.flowCode }}</template>
            </el-table-column>
            <el-table-column align="center"
                             label="回单日期">
              <template slot-scope="scope">{{ scope.row.recordDate }}</template>
            </el-table-column>
            <el-table-column align="center"
                             label="流水金额/元"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="!scope.row.isEdit">{{ scope.row.amount | toLocaleString }}</span>
                <span v-else>{{ scope.row.billFlowAmount | toLocaleString }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="未匹配金额/元"
                             show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.wpAmount | toLocaleString }}</template>
            </el-table-column>
            <el-table-column align="center"
                             label="流水类型"
                             show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.billType === 'R' ? '收款' : '付款' }}</template>
            </el-table-column>
          </el-table>
        </div>
        <div class="flow_list">
          <div style="margin-bottom:8px;" class="dr-head"><i class="titBorder"></i>匹配流水</div>
          <el-table key="selectTable"
                    ref="selectTable"
                    max-height="240"
                    :data="multipleSelection"
                    tooltip-effect="dark"
                    class="details_table select_table"
                    style="width: 100%">
            <el-table-column align="center"
                             label="流水单号">
              <template slot-scope="scope">{{ scope.row.flowCode }}</template>
            </el-table-column>
            <!-- <el-table-column align="center"
                             label="出/入账时间">
              <template slot-scope="scope">{{ scope.row.recordDate }}</template>
            </el-table-column> -->
            <el-table-column align="center"
                             label="流水金额/元"
                             show-overflow-tooltip>
              <template slot-scope="scope"><span v-if="!scope.row.isEdit">{{ scope.row.amount | toLocaleString }}</span>
                <span v-else>{{ scope.row.billFlowAmount | toLocaleString }}</span></template>
            </el-table-column>
            <el-table-column align="center"
                             label="未匹配金额/元"
                             show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.wpAmount | toLocaleString }}</template>
            </el-table-column>
            <el-table-column align="center"
                             label="流水类型"
                             show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.billType === 'R' ? '收款' : '付款' }}</template>
            </el-table-column>
            <el-table-column align="center"
                             label="付款人"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-if="!scope.row.isEdit" class="drawee"
                          v-model="scope.row.drawee"
                          placeholder=""></el-input>
                <span v-else>{{scope.row.drawee}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="出/入账时间">
              <template slot-scope="scope">
                <el-date-picker v-if="!scope.row.isEdit" style="margin-right:0;"
                                class="recordDate"
                                :editable="false"
                                v-model="scope.row.accountDate"
                                type="date"
                                value-format="yyyy-MM-dd">
                </el-date-picker>
                <span v-else>{{scope.row.accountDate}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="匹配金额/元"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-if="!scope.row.isEdit" type="number"
                          class="drawee"
                          v-model="scope.row.ppAmount"
                          placeholder=""></el-input>
                <span v-else>{{scope.row.amount}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center"
                             label="操作"
                             show-overflow-tooltip>
              <template v-if="!scope.row.isEdit" slot-scope="scope"><span class="delete_btn"
                      @click="deleteFlow(scope.row)">删除</span></template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer slotfooter">
        <span @click="matchflowDialogVisible = false"
              class="details_cannelBtn">取消</span>
        <span type="primary"
              @click="saveFlow('addform')"
              class="details_submitBtn">匹配</span>
      </div>
    </el-dialog>
    <!-- 减免申请 -->
    <el-dialog v-if="exemptionDialogVisible"
               title="减免申请"
               :visible.sync="exemptionDialogVisible"
               append-to-body
               class="exemptionDialog">
      <el-form :model="reduction"
               :rules="reductionRules"
               ref="reductionform">
        <div class="dl-subtitle">减免金额<span class="required">*</span>
          <el-form-item prop="amount">
            <el-input v-model="reduction.amount">
            </el-input>
          </el-form-item>
        </div>
        <div class="dl-subtitle">减免时间<span class="required">*</span>
          <el-form-item prop="timeReduction">
            <el-date-picker type="date"
                            value-format="yyyy-MM-dd"
                            v-model="reduction.timeReduction"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="dl-subtitle">减免类型<span class="required">*</span>
          <el-form-item prop="reliefType"
                        style="margin-right: 0">
            <el-select v-model="reduction.reliefType"
                       placeholder="请选择"
                       @change="selectName">
              <el-option v-for="item in reliefTypeOptions"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="inlinediv"
             style="margin-top: 20px;">
          <div class="inline-subtitle">备注</div>
          <el-form-item style="width: 100%;margin: 0 0 20px; 0">
            <el-input v-model="reduction.remake">
            </el-input>
          </el-form-item>
        </div>
        <div class="inlinediv"
             style="margin: 20px 0;">
          <div class="inline-subtitle">附件
            <span class="upload">上传附件
              <input type="file"
                     @change="imageChange('reduction', $event)">
            </span>
          </div>
          <div class="enclosure">
            <div class="enclosure-head">
              <span>文件名</span>
              <span>操作</span>
            </div>
            <div v-if="reduction.annexURL"
                 class="enclosure-list">
              <div class="el-item">
                <span>{{reduction.annexName}}</span>
                <span>
                  <i @click="downloadFile"
                     class="iconfont icon-xiazaidaoru"
                     style="margin-right: 10px;"></i>
                  <i @click="deleFile"
                     class="iconfont icon-lajixiang"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="exemptionDialogVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="reductions('reductionform')"
                   class="defaultbtn dialog-confirmBtn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 账单金额计算 -->
    <el-dialog v-if="calculationDialogVisible"
               title="账单金额计算"
               center
               append-to-body
               :visible.sync="calculationDialogVisible"
               class="calculationDialog">
      <el-form :model="reduction"
               :rules="reductionRules"
               ref="reductionform">
        <div class="inlinediv"
             style="margin-top: 20px;">
          <div class="inline-subtitle">账单信息</div>
          <div class="bill-information">
            <span>计费周期</span>
            <span>租金抽成比例</span>
            <span>保底金额/元</span>
            <span>{{detailsData.startDate}}~{{detailsData.endDate}}</span>
            <span>{{detailsData.finalPrice}}%</span>
            <span>{{detailsData.bdAmount}}</span>
            <ul>
              <span>时间</span>
              <span>营业额/元<span class="required">*</span></span>
              <span>营业额抽成金额/元</span>
            </ul>
            <ul v-for="(item, index) in detailsData.turnovers"
                :key="index">
              <span>{{item.startDate}}~{{item.endDate}}</span>
              <span><input type="number"
                       v-model="item.turnoverAmount"
                       @input="queryTurnover(item, item.id, item.turnoverAmount)" /></span>
              <span>{{item.amountDrawn}}</span>
            </ul>
          </div>
        </div>
        <div class="btn">
          <span @click="finalBillAmount">生成最终账单金额</span>
        </div>
        <div class="inlinediv"
             style="margin: 20px 0;">
          <div class="enclosure">
            <div>账单金额/元</div>
            <div>{{BillAmount}}</div>
          </div>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer"
           style="text-align: right">
        <el-button @click="calculationDialogVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="amountCalculation()"
                   class="defaultbtn dialog-confirmBtn">确 定</el-button>
      </div>
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
    <!-- 删除账单 -->
    <el-dialog v-if="centerDialogVisible"
               :visible.sync="centerDialogVisible"
               class="lockDialogClose"
               append-to-body
               width="400px">
      <div class="lockDialogContent"
           style="padding-left: 40px">
        <img src="../../../../../assets/delete2.png">
        <div>
          <div class="div1">删除账单</div>
          <div class="div2">确定删除账单？</div>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <span class="cancel"
              @click="centerDialogVisible = false">取消</span>
        <span class="determine"
              @click="deleBillTrue">确定</span>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import Drawer from '@/components/drawer.vue'
import { toLocaleString, toLocaleFixed } from '@/utils/validate.js'
import ailPreview from '@/components/ailPreview.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import aliUpload from '@/components/aliUpload.vue'
import * as JSOG from 'jsog'
export default {
  name: 'billDetails',
  components: {
    Drawer,
    ailPreview,
    aliUpload,
    aliDownLoad,
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
        billAndFlows: []
      }
    },
    queryBillId: {
      type: String
    },
    reductionData: {
      type: Object
    }
  },
  data () {
    return {
      flowSearchData: {
        flowCode: '',
        startDate: '',
        endDate: ''
      },
      // --------------------------------------
      BillAmount: 0,
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
      newlystep1: true,
      newlystep2: false,
      drawerTitle: '账单详情',
      formLabelWidth: '',
      documentTypeOptions: [],
      nationalityOptions: [],
      tenantNameeOptions: [],
      projectList: [],
      chooseObj: {},
      accountEntry: true,
      selHourse: false,
      selProject: false,
      errorProject: false,
      flowDialogVisible: false,
      matchflowDialogVisible: false,
      exemptionDialogVisible: false,
      calculationDialogVisible: false,
      reduction: {},
      reliefTypeOptions: [
        { name: '特批调整', value: 'SPECIAL' },
        { name: '福利减免', value: 'WELFARE' },
        { name: '补偿减免', value: 'COMPENSATE' }
      ],
      addDataRules: {
        finalPaymentDate: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ]
      },
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
        'projectManagement.id': [
          { required: true, message: '请选择项目简称', trigger: 'change' }
        ]
      },
      reductionRules: {
        amount: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ],
        timeReduction: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ],
        reliefType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ]
      },
      showRemarks: false,
      showEnclosure: false,
      amountTotal: 0,
      options: {},
      flowExplain: '',
      tableData: [
        {
          date: '2016-05-03',
          name: '入账日期',
          address: '上海市普陀区'
        },
        {
          date: '2016-05-03',
          name: '入账日期',
          address: '上海市普陀区'
        }
      ],
      multipleSelection: '',
      exemptionType: '',
      isEdit: true,
      centerDialogVisible: false,
      matchingDialogVisible: false,
      billAndFlows: [],
      payTypeList: [],
      billTypeOption: [{
        value: 'R',
        name: '收款'
      }, {
        value: 'P',
        name: '付款'
      }],
      projectManagement: [],
      payUserList: [],
      fileType: [],
      iconImg: 'icon-shangchuanfujianicon',
      billsDialogVisible: false,
      tableData1: [],
      multipleSelection1: [],
      flowSearchData1: {
        projectManagementId: '',
        referred: '',
        feeType: '',
        startDate: '',
        endDate: ''
      },
      options2: [],
      flowDetailsData: {},
      detailsData1: {}
    }
  },
  watch: {
    detailsData: {
      handler: function () {
        this.getProjectOptions()
        if (this.detailsData.billType === 'R') {
          this.accountEntry = true
        } else {
          this.accountEntry = false
        }
        if (this.exemptionType === 'edit') {
          this.reduction = this.reductionData
        } else {
          this.reduction = {}
        }
      },
      immediate: true
    }
  },
  methods: {
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
        if (Number(item.ppAmount) > item.wpAmount) {
          this.$message({
            showClose: true,
            message: `第${index + 1}条流水匹配金额不能大于未匹配金额`,
            type: 'error'
          })
          return
        }
        item.drawee ? item.drawee : ''
        let obj = {
          billId: detailsData.id,
          billFlowId: item.id,
          drawee: item.drawee,
          payAmount: item.ppAmount,
          accountDate: item.accountDate
        }
        arr.push(obj)
      })
      if (arr.length === 0 || multipleSelection.length > arr.length) {
        return
      }
      if (arrAmount > detailsData.arrearsAmount) {
        this.$message({
          showClose: true,
          message: `匹配金额不能大于账单的欠收金额`,
          type: 'error'
        })
        return
      }
      context.http.put('/cms/api/bills/flow', arr).then(res => {
        if (res) {
          this.matchflowDialogVisible = false
          this.$emit('handleEdit', 0, detailsData)
        }
      })
    },
    // saveFlow () {
    //   let detailsData = JSOG.decode(this.detailsData)
    //   if (this.multipleSelection === '') {
    //     return false
    //   }
    //   detailsData.billFlows = this.multipleSelection
    //   delete detailsData.rooms
    //   context.http.put('/cms/api/bills/flow', detailsData).then(res => {
    //     if (res) {
    //       this.matchflowDialogVisible = false
    //       this.$emit('handleEdit', 0, detailsData)
    //     }
    //   })
    // },
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
    getRowKey (row) {
      return row.id
    },
    querySearch (status) {
      if (status === 'search') {

      } else {
        this.billAndFlows = JSON.parse(JSON.stringify(this.detailsData.billAndFlows))
        this.billAndFlows = this.billAndFlows.map(v => {
          v.isEdit = true
          return v
        })
        this.multipleSelection = this.billAndFlows
      }
      this.flowSearchData.startDate = this.flowSearchData.startDate ? this.flowSearchData.startDate : ''
      this.flowSearchData.endDate = this.flowSearchData.endDate ? this.flowSearchData.endDate : ''
      context.http.get('/cms/api/billFlows/nomate?sort=recordDate,asc&sort=id,asc', {
        billId: this.detailsData.id,
        billType: this.detailsData.billType,
        tenantId: this.detailsData.tenandId,
        flowCode: this.flowSearchData.flowCode,
        startDate: this.flowSearchData.startDate,
        endDate: this.flowSearchData.endDate
      }).then(res => {
        if (res) {
          res.data.forEach((item, index) => {
            // item.ppAmount = item.wpAmount
            item.accountDate = item.recordDate
            if (item.wpAmount < this.detailsData.arrearsAmount) {
              item.ppAmount = item.wpAmount
            } else {
              item.ppAmount = this.detailsData.arrearsAmount
            }
            item.drawee = item.paymentName
          })
          this.tableData = res.data
        }
      })
    },
    changeCode () {
      this.$nextTick(() => {
        let deposit = this.detailsData.amount
        let obj = this.detailsData
        if (deposit) {
          if (obj.amount !== '' && obj.amount.substr(0, 1) === '.') {
            obj.amount = ''
          }
          obj.amount = obj.amount.replace(/^0*(0\.|[1-9])/, '$1')// 粘贴不生效
          obj.amount = obj.amount.replace(/[^\d.]/g, '')  // 清除“数字”和“.”以外的字符
          obj.amount = obj.amount.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
          obj.amount = obj.amount.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
          obj.amount = obj.amount.replace(/^(\\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')// 只能输入两个小数
          if (obj.amount.indexOf('.') < 0 && obj.amount !== '') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            if (obj.amount.substr(0, 1) === '0' && obj.amount.length === 2) {
              this.detailsData.amount = obj.amount.substr(1, obj.amount.length)
            }
          }
        }
      })
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onEdit () {
      if (this.detailsData.billAndFlows && this.detailsData.billAndFlows.length > 0) {
        this.$message({
          message: '该账单已匹配流水，不支持修改',
          type: 'warning'
        })
        return
      }
      this.isEdit = false
    },
    flowDetail (billFlowId) {
      // this.$router.push({ path: '/home/flow', query: { billFlowId: billFlowId, variety: 'variety' } })
      // 之前跳到客户流水   现在改为跳银行流水
      this.$router.push({ path: '/home/flowBank', query: { billFlowId: billFlowId, variety: 'variety' } })
    },
    matchingTrue (billFlowId) {
      this.matchingDialogVisible = true
      this.flowId = billFlowId
    },
    unMatching () {
      context.http.get('/cms/api/bill_and_flow/unmate?billId=' + this.detailsData.id + '&flowId=' + this.flowId).then(res => {
        this.matchingDialogVisible = false
        let detailsData = JSOG.decode(this.detailsData)
        this.$emit('handleEdit', 0, detailsData)
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
    deleBillTrue () {
      let id = this.detailsData.id
      context.http.delete('/cms/api/bills/' + id).then(res => {
        this.centerDialogVisible = false
        this.onHide(1)
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
      }).catch(error => {
        console.info(error)
        //      this.centerDialogVisible = false
        //      this.onHide()
        //      this.$message({
        //        message: '删除失败！',
        //        type: 'error'
        //      })
      })
    },
    deleBill () {
      this.centerDialogVisible = true
    },
    billSave (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          console.log('add', this.detailsData)
          let _this = this
          context.http.put('/cms/api/bills', this.detailsData).then(res => {
            if (res) {
              _this.onHide()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    exemptionVisible (type) {
      this.exemptionDialogVisible = true
      this.exemptionType = type
      if (type === 'add') {
        this.reduction = {}
      }
    },
    queryTurnover (item, id, amount) {
      if (!amount) {
        return
      }
      context.http.get('/cms/api/bill/turnover', { 'turnoverId': id, 'turnoverAmount': amount }).then(res => {
        this.$set(item, 'amountDrawn', res.data)
        this.$forceUpdate()
      }).catch(error => {
        console.info(error)
      })
    },
    finalBillAmount () {
      let turnovers = this.detailsData.turnovers
      let billAmount = 0
      this.detailsData.turnovers.forEach(ele => {
        billAmount += Number(!ele.amountDrawn ? 0 : ele.amountDrawn)
      })
      this.BillAmount = billAmount
    },
    amountCalculation () {
      let data = JSOG.decode(this.detailsData)
      this.detailsData.amount = this.BillAmount
      delete this.detailsData.rooms
      context.http.put('/cms/api/bill/turnover', this.detailsData).then(res => {
        this.calculationDialogVisible = false
        this.$emit('handleEdit', 0, data)
      }).catch(error => {
        console.info(error)
      })
    },
    onHide (index) {
      this.isEdit = true
      this.$emit('drawerClose', false)
      if (index === 1) {
        this.$emit('query', false, index)
      } else {
        this.$emit('query', false)
      }
      this.readonly = true
    },
    formatRentalMethod (val) {
      return val === 'RENT' ? '固定租金' : val === 'POINTS' ? '扣点' : '保底扣点'
    },
    formatBillType (val) {
      return val === 'R' ? '收款' : '付款'
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
    formatFlowStatus (val) {
      let res = ''
      if (val === 'NO') {
        res = '未匹配'
      } else if (val === 'OK') {
        res = '完全匹配'
      } else if (val === 'SECTION') {
        res = '部分匹配'
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
    },
    formatReliefType (val) {
      let res = ''
      if (val === 'SPECIAL') {
        res = '特批调整'
      } else if (val === 'WELFARE') {
        res = '福利减免'
      } else if (val === 'COMPENSATE') {
        res = '补偿减免'
      }
      return res
    },
    previousStep () {
      this.onHide()
    },
    imageChange () {
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      let name = files[0].name
      context.http.post('/ywm/api/image-multipart', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
        this.$set(this.reduction, 'annexName', name)
        this.$set(this.reduction, 'annexURL', res.data)
      }).catch(error => {
        console.info(error)
      })
    },
    downloadFile () {
      axios({ method: 'GET', url: '/ywm/api/annex/download', params: { annexURL: this.reduction.annexURL, annexName: this.reduction.annexName }, responseType: 'blob' }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', this.reduction.annexName)
        document.body.appendChild(link)
        link.click()
      })
    },
    deleFile () {
      this.reduction.annexName = null
      this.reduction.annexURL = null
    },
    billDetails () {
    },
    selectName () { },
    handleSelectionChange (val) {
      this.multipleSelection = this.billAndFlows.concat(val)
    },
    // async newPipeline () {
    //   this.flowDialogVisible = true
    //   let result = await context.http.get('/cms/api/tenant/all', { tenantName: '' })
    //   this.tenantNameeOptions = result.data.filter(ele => {
    //     return ele.id === this.detailsData.tenandId
    //   })
    //   // this.tenantNameeOptions = result.data.tenantListDTOSet
    // },
    // addPipeline (formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       this.addData.billType = this.detailsData.billType
    //       if (this.detailsData.projectManagement) {
    //         this.addData.projectManagement = {
    //           id: this.detailsData.projectManagement.id
    //         }
    //       }
    //       this.addData.bills = [this.detailsData]
    //       if (!this.addData.tenant) {
    //         this.addData.tenant = null
    //       }
    //       let _this = this
    //       context.http.post('/cms/api/bill/billFlow', this.addData).then(res => {
    //         if (res.status === 200 || res.status === 201) {
    //           _this.flowDialogVisible = false
    //           _this.$emit('handleEdit', 0, this.detailsData)
    //           _this.addData = {
    //             projectManagement: {
    //               id: ''
    //             },
    //             tenant: ''
    //           }
    //         }
    //       })
    //     } else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    // },
    reductions (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let postData = this.reduction
          let _this = this
          postData.billId = this.detailsData.id
          let taskId = this.$route.query.taskId
          if (taskId && this.exemptionType === 'edit') {
            postData.taskId = taskId
            context.http.put('/cms/api/reductions', postData).then(res => {
              if (res) {
                _this.exemptionDialogVisible = false
                _this.$emit('handleEdit', 0, this.detailsData)
              }
            })
          } else {
            context.http.post('/cms/api/reductions', postData).then(res => {
              if (res) {
                _this.exemptionDialogVisible = false
                _this.$emit('handleEdit', 0, this.detailsData)
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showAmountCalculation () {
      this.calculationDialogVisible = true
    },
    flowDialogVisibleHide () {
      this.flowDialogVisible = false
      this.$refs['addFlowform'].resetFields()
    },
    async newPipeline () {
      this.addData = {
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
      }
      this.flowDialogVisible = true
      this.addData.billType = this.detailsData.billType
      if (this.projectManagement.filter(v => Number(v.id) === Number(this.detailsData.projectManagement.id)).length) {
        this.addData.projectManagement.id = this.detailsData.projectManagement.id
      }
      this.$set(this.addData.tenant, 'teantName', this.detailsData.tenantName)
      this.$set(this.addData.tenant, 'id', this.detailsData.tenandId)
      let result = await context.http.get(`/cms/api/tenantPays/${this.detailsData.tenandId}`)
      this.tenantNameeOptions = result.data.filter(item => {
        return item.payName !== '' && item.payName !== null
      })
      let result1 = await context.http.get('/uaa/api/paramet-managements/name', { name: '付款方式' })
      this.payTypeList = result1.data
    },
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
          context.http.post('/cms/api/billFlows', data).then(res => {
            if (res) {
              _this.flowDialogVisible = false
              _this.addData = {
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
              }
              _this.detailsData1 = res.data
              if (matching === 'matching') {
                context.http.get(`cms/api/billFlows/${res.data.id}`).then(res => {
                  _this.flowDetailsData = res.data
                  _this.flowSearchData1 = {
                    projectManagementId: [this.projectManagement[0].id],
                    referred: '',
                    feeType: '',
                    startDate: '',
                    endDate: ''
                  }
                  _this.getbillsList(_this.flowDetailsData.id, this.flowDetailsData.billType)
                  _this.billAndFlows1 = JSON.parse(JSON.stringify(_this.detailsData1.billAndFlows))
                  _this.billAndFlows1 = _this.billAndFlows1.map(v => {
                    v.isEdit = true
                    return v
                  })
                  console.log(_this.billAndFlows1)
                  _this.multipleSelection1 = _this.billAndFlows1
                  _this.billsDialogVisible = true
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
    billTypeChange () {
      if (this.addData.billType === 'R') {
        this.accountEntry = true
      } else {
        this.accountEntry = false
      }
    },
    chooseProject () {
      this.addData.tenant = {}
    },
    async getProjectOptions () {
      let result = await context.http.get('cms/api/project-managements', { useStatus: 'USING', page: 0, size: 100, sort: 'desc' })
      this.projectManagement = result.data
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
      let result = await context.http.get('cms/api/tenant/nameLike/' + this.addData.tenant.teantName + '?projectId=' + this.addData.projectManagement.id)
      var results = result.data
      for (let i of results) {
        i.value = i.teantName  // 将想要展示的数据作为value
      }
      list = result.data
      callback(list)
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
    async querySearch1 (queryString, cb) {
      let result = await context.http.get('cms/api/tenantPays/beneficiary?query=' + this.addData.beneficiaryName)
      cb(result.data)
    },
    async querySearch2 (queryString, cb) {
      let result = await context.http.get('cms/api/tenantPays/payment?query=' + this.addData.paymentName)
      cb(result.data)
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
    setAnnexs (annexURL, annexName) {
      this.addData.annexes.push({ 'annexURL': annexURL, 'annexName': annexName })
    },
    deleFile1 (item, index) {
      this.addData.annexes.splice(index, 1)
    },
    selectOperation (val) {
      this.addData.tenant = val
    },
    handleSelectionChange1 (val) {
      this.multipleSelection1 = this.billAndFlows1.concat(val)
      this.multipleSelection1.forEach(ele => {
        this.$set(ele, 'recordDate', this.detailsData1.recordDate)
      })
    },
    saveFlow1 () {
      let detailsData = JSOG.decode(this.detailsData1)
      if (!this.multipleSelection1.length) {
        this.$message({
          showClose: true,
          message: '请选择要匹配的流水',
          type: 'error'
        })
        return false
      }
      let multipleSelection = JSON.parse(JSON.stringify(this.multipleSelection1))
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
      context.http.post(`/cms/api/billFlows/${this.detailsData1.id}/mate`, arr).then(res => {
        if (res) {
          this.billsDialogVisible = false
          this.$emit('handleEdit', 0, this.detailsData)
          this.$message({
            showClose: true,
            message: `匹配成功`,
            type: 'success'
          })
        }
      })
    },
    async getFeeType () { // 费用类型
      let result1 = await context.http.get('/uaa/api/paramet-managements/name', { name: '费用类型' })
      let result2 = await context.http.get('/uaa/api/paramet-managements/name', { name: '多经费用类型' })
      this.options2 = result1.data.concat(result2.data)
    },
    matchingBills (isSeach) {
      if (isSeach !== 'seach' || !isSeach) {
        this.multipleSelection1 = []
        this.flowSearchData1 = {
          projectManagementId: '',
          referred: '',
          feeType: '',
          startDate: '',
          endDate: ''
        }
      }
      this.getbillsList(this.detailsData1.id)
      this.billsDialogVisible = true
    },
    getbillsList (id, type) {
      let tenantId = this.flowDetailsData.tenant ? this.flowDetailsData.tenant.id : ''
      context.http.get('cms/api/bills/nomate?sort=finalPaymentDate,asc&sort=id,asc', {
        flowId: id,
        tenantId: tenantId,
        projectManagementId: this.flowSearchData1.projectManagementId.toString(),
        referred: this.flowSearchData1.referred,
        billType: this.detailsData1.billType,
        feeType: this.flowSearchData1.feeType,
        startDate: this.flowSearchData1.startDate,
        endDate: this.flowSearchData1.endDate
      }).then(res => {
        res.data.forEach((item, index) => {
          // item.ppAmount = item.arrearsAmount
          // if (item.billCategory === 'NORMAL') {
          //   item.ppAmount = this.setPayAmount1(item)
          // } else {
          //   item.ppAmount = item.arrearsAmount
          // }
          if (item.onContainLafeFee) {
            item.ppAmount = item.arrearsAmount - item.qsLateFee
            item.ppAmount = item.ppAmount === 0 ? item.qsLateFee : item.ppAmount
            item.ppAmount = Number(item.ppAmount.toFixed(2))
          } else {
            item.ppAmount = item.arrearsAmount
            item.ppAmount = Number(item.ppAmount.toFixed(2))
          }
          if (item.ppAmount > this.detailsData1.wpAmount) {
            item.ppAmount = this.detailsData1.wpAmount
            item.ppAmount = Number(item.ppAmount.toFixed(2))
          }
          item.drawee = this.detailsData1.paymentName
        })
        this.tableData1 = res.data
        if (type) {
          this.tableData1.forEach(v => {
            if (v.id === this.detailsData.id) {
              this.$refs.multipleTable1.toggleRowSelection(v)
            }
          })
        }
        // this.pipei.total = Number(res.headers['x-total-count'])
      })
    },
    setPayAmount1 (item) {
      if (item.amount - item.reductionAmount > item.writeOffAmount) {
        if (item.amount - item.reductionAmount - item.writeOffAmount > this.detailsData1.wpAmount) {
          item.ppAmount = this.detailsData1.wpAmount
        } else {
          item.ppAmount = item.amount - item.reductionAmount - item.writeOffAmount
        }
      } else {
        if (item.qsLateFee > this.detailsData1.wpAmount) {
          item.ppAmount = this.detailsData1.wpAmount
        } else {
          item.ppAmount = item.qsLateFee
        }
      }
      return item.ppAmount
    },
    deleteFlow1 (row, i) {
      let flag = false
      let ITEM
      this.tableData1.forEach(item => {
        if (row.id === item.id) {
          console.log(item)
          ITEM = item
          flag = true
        }
      })
      if (flag) {
        this.$refs.multipleTable1.toggleRowSelection(ITEM)
      } else {
        this.$refs.multipleTable1.toggleRowSelection(row)
      }
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
    }
  }
}
</script>
<style lang="scss" scoped>
.noData {
  font-size: 12px;
  color: #777777;
  margin: 0 15px;
  text-align: center;
  height: 40px;
  line-height: 40px;
}
.contracts-info {
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
    .billDetails {
      .dl-content {
        width: 100%;
        margin-bottom: 20px;
        padding: 15px;
        font-size: 14px;
        color: #777777;
        .half_page_title {
          margin-bottom: 10px;
        }
        .dc-left {
          width: 30%;
          text-align: center;
          border: none;
          margin-top: 0px;
          background-color: #fff;
        }
        .dc-right {
          width: 68%;
          background-color: #fff;
          border: none;
          margin-top: 0px;
          .editBtn {
            float: right;
            display: block;
            margin-top: 10px;
            margin-right: 10px;
            width: 46px;
            height: 18px;
            background-image: url(../../../../../assets/editBtn.png);
            cursor: pointer;
          }
          .btn-wrap span {
            display: inline-block;
            width: 60px;
            height: 24px;
            line-height: 23px;
            text-align: center;
            border: 1px solid #0f75ff;
            border-radius: 4px;
            font-size: 12px;
            color: #0f75ff;
            cursor: pointer;
            margin-right: 10px;
            font-weight: normal;
          }
          ul {
            display: flex;
            border: none;
            background-color: #f7f7f9;
            margin: 0 12px;
            &.billUl {
              background-color: #ffffff;
            }
          }
        }
        .bd-number {
          height: 20px;
          line-height: 20px;
          padding-left: 8px;
          margin: 0 12px;
          background: #f7f7f9;
        }
        .cttitle + span {
          display: inline-block;
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          color: #262626;
        }

        .basic-select .layer div span {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 14px;
          color: #262626;
        }
        .tenant-info span p:first-child {
          padding: 0;
          font-size: 14px;
          color: #777;
        }
        .tenant-info span p:last-child {
          font-size: 14px;
          color: #262626;
          min-height: 30px;
        }
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
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
</style>
<style lang="scss">
.contracts-info {
  position: relative;
  .contracts-remarks {
    position: fixed;
    z-index: 999;
    width: 500px;
    height: 100%;
    right: 0;
    top: 57px;
    background-color: rgba(250, 250, 250, 1);
    .rektitle {
      margin: 20px;
      span {
        float: right;
        font-size: 12px;
        cursor: pointer;
      }
    }
    .el-textarea {
      width: 90%;
      margin-left: 20px;
      textarea {
        height: 40px;
      }
    }
    .operation {
      text-align: right;
      span {
        display: inline-block;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background-color: #0f75ff;
        color: #fff;
        border-radius: 4px;
        font-size: 12px;
        margin: 20px 28px 0 0;
        cursor: pointer;
      }
    }
    .remarks-list {
      width: 90%;
      margin: 20px auto 0;
      div {
        &:first-child {
          color: #333;
          font-size: 14px;
          margin-bottom: 10px;
        }
        &:last-child {
          color: #666;
          span {
            display: inline-block;
            font-size: 14px;
            &:first-child {
              width: 70%;
            }
            &:last-child {
              width: 28%;
              text-align: right;
            }
          }
        }
      }
    }
  }
  .contracts-enclosure {
    position: fixed;
    z-index: 999;
    width: 500px;
    height: 100%;
    right: 0;
    top: 57px;
    background-color: rgba(250, 250, 250, 1);
    .rektitle {
      margin: 20px;
      span {
        float: right;
        font-size: 12px;
        cursor: pointer;
      }
    }
    .upload {
      width: 90%;
      text-align: center;
      height: 100px;
      line-height: 100px;
      margin: 0 auto;
      color: rgba(15, 117, 255, 1);
      border: 1px solid rgba(231, 231, 231, 1);
      border-radius: 4px;
      background-color: #fff;
      position: relative;
      input {
        position: absolute;
        right: 0;
        width: 100%;
        height: 100px;
        opacity: 0;
        cursor: pointer;
      }
    }
    .enclosure-list {
      width: 90%;
      margin: 0 auto;
      margin-top: 40px;
      .enclosure-item {
        font-size: 14px;
        span {
          display: inline-block;
          width: 10%;
          &:first-child {
            width: 70%;
          }
        }
      }
    }
  }
  .flowDialog {
    .dl-subtitle {
      display: inline-block;
      width: 49%;
      margin-top: 20px;
    }
    .el-form-item {
      margin: 10px 0 0 0;
      width: 81%;
      .el-select {
        width: 100%;
      }
    }
  }
  .matchingflow {
    .el-dialog {
      width: 800px;
    }
    .el-dialog__body {
      min-height: 300px;
      margin-top: 20px;
    }
  }
  .exemptionDialog {
    .el-dialog__body {
      margin-top: 20px;
    }
    .dl-subtitle {
      display: inline-block;
      width: 32.5%;
    }
    .el-form-item {
      margin-top: 10px;
      margin-right: 10px;
    }
    .inlinediv {
      border: 1px solid rgba(231, 231, 231, 1);
      .inline-subtitle {
        padding: 6px 10px;
        background: rgba(250, 250, 250, 1);
        .upload {
          display: inline-block;
          font-size: 12px;
          width: 60px;
          height: 24px;
          line-height: 23px;
          text-align: center;
          border: 1px solid rgba(15, 117, 255, 1);
          color: #0f75ff;
          border-radius: 4px;
          float: right;
          cursor: pointer;
          position: relative;
          input {
            position: absolute;
            right: 0;
            width: 60px;
            height: 24px;
            opacity: 0;
            cursor: pointer;
          }
        }
      }
      .enclosure-head {
        height: 40px;
        line-height: 40px;
        span {
          display: inline-block;
          width: 48%;
          padding-left: 40px;
        }
        border-bottom: 1px solid rgba(231, 231, 231, 1);
      }
      .enclosure-list {
        width: 90%;
        margin: 0 auto;
        .el-item {
          height: 40px;
          padding-top: 10px;
          font-size: 14px;
          span {
            display: inline-block;
            width: 25%;
            &:first-child {
              width: 55%;
              overflow: hidden;
            }
          }
        }
      }
      .el-input__inner {
        border: none;
      }
    }
    .el-date-editor {
      width: 100%;
    }
  }
  .calculationDialog {
    .el-dialog {
      width: 800px;
    }
    .el-dialog__body {
      margin-top: 20px;
    }
    .dl-subtitle {
      display: inline-block;
      width: 32.5%;
    }
    .el-form-item {
      margin-top: 10px;
      margin-right: 10px;
    }
    .inlinediv {
      border: 1px solid rgba(231, 231, 231, 1);
      .inline-subtitle {
        padding: 6px 10px;
        background: rgba(250, 250, 250, 1);
        .upload {
          display: inline-block;
          font-size: 12px;
          width: 60px;
          height: 24px;
          line-height: 23px;
          text-align: center;
          border: 1px solid rgba(15, 117, 255, 1);
          color: #0f75ff;
          border-radius: 4px;
          float: right;
          cursor: pointer;
          position: relative;
          input {
            position: absolute;
            right: 0;
            width: 60px;
            height: 24px;
            opacity: 0;
            cursor: pointer;
          }
        }
      }
      .enclosure-head {
        height: 40px;
        line-height: 40px;
        span {
          display: inline-block;
          width: 48%;
          padding-left: 40px;
        }
        border-bottom: 1px solid rgba(231, 231, 231, 1);
      }
      .enclosure-list {
        width: 90%;
        margin: 0 auto;
        .el-item {
          height: 40px;
          padding-top: 10px;
          font-size: 14px;
          span {
            display: inline-block;
            width: 25%;
            &:first-child {
              width: 55%;
              overflow: hidden;
            }
          }
        }
      }
      .el-input__inner {
        border: none;
      }
      .enclosure {
        margin: 20px;
      }
    }
    .el-date-editor {
      width: 100%;
    }
    .bill-information {
      padding-bottom: 20px;
      span {
        display: inline-block;
        width: 32%;
        padding: 10px 0 0 10px;
      }
      input {
        border: 1px solid #dadada;
        height: 30px;
        border-radius: 3px;
      }
    }
    .btn {
      text-align: center;
      span {
        display: inline-block;
        width: 120px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #0f75ff;
        border-radius: 4px;
        font-size: 12px;
        color: #fff;
        background-color: #0f75ff;
        cursor: pointer;
        margin-top: 20px;
      }
    }
  }
  .cttitle + span {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
  }
  .turnoverBtn {
    span {
      display: inline-block;
      width: 90px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border: 1px solid #0f75ff;
      border-radius: 4px;
      font-size: 12px;
      color: #fff;
      background-color: #0f75ff;
      cursor: pointer;
      margin: 20px 10px;
      float: right;
    }
  }
  .wrap {
    .drawer-head {
      border-bottom: 1px solid #ddd;
    }
  }
  .main-content {
    position: relative;
  }
  .billDetails {
    position: relative;
    .head-right {
      position: absolute;
      top: -40px;
      right: 0;
      font-size: 12px;
      span {
        cursor: pointer;
      }
    }
    .dialog-footer {
      border-top: 1px solid #e5e5e5;
      padding: 20px 0;
      text-align: right;
    }
    .errorpjTip {
      color: red !important;
      font-size: 12px;
      width: 100%;
      float: left;
    }
    .step2 {
      .dc-right {
        width: 100% !important;
        border: 1px solid #e7e7e7;
        .other-info {
          width: 98%;
          margin: 0 auto;
        }
      }
    }
    .upload {
      position: relative;
      float: right;
      display: inline-block;
      width: 60px;
      height: 24px;
      line-height: 24px;
      background: rgba(222, 235, 254, 1);
      opacity: 0.9;
      border-radius: 2px;
      font-size: 12px;
      text-align: center;
      cursor: pointer;
      input {
        position: absolute;
        right: 0;
        width: 60px;
        height: 24px;
        opacity: 0;
        cursor: pointer;
      }
    }
    .enclosure {
      border: 1px solid #e7e7e7;
      margin-bottom: 20px;
      .enclosure-head {
        background-color: #fafafa;
        height: 30px;
        line-height: 30px;
        span {
          display: inline-block;
          width: 48%;
          padding-left: 40px;
        }
      }
      .el-item {
        height: 30px;
        line-height: 30px;
        span {
          display: inline-block;
          width: 48%;
          padding-left: 40px;
        }
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
              //  background: url(../../../assets/upload.png) no-repeat;
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
        width: 30%;
        text-align: center;
        border: 1px solid #e7e7e7;
        margin-top: 20px;
        .dr-head {
          background-color: #fafafa;
          height: 40px;
          line-height: 40px;
          padding-left: 12px;
          font-size: 16px;
          margin-bottom: 20px;
        }
      }
      .tenantinfo {
        .el-form-item {
          width: 29% !important;
          margin-right: 0;
        }
        .cttitle + span {
          display: inline-block;
          height: 40px;
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
          /*display: flex;
          justify-content: space-between;
          align-items: center;*/
          .editBtn {
            float: right;
            display: block;
            margin-top: 10px;
            margin-right: 10px;
            width: 46px;
            height: 18px;
            background-image: url(../../../../../assets/editBtn.png);
            cursor: pointer;
          }
          .btn-wrap {
            float: right;
            span {
              display: inline-block;
              width: 60px;
              height: 24px;
              line-height: 23px;
              text-align: center;
              border: 1px solid rgba(15, 117, 255, 1);
              border-radius: 4px;
              font-size: 12px;
              color: #0f75ff;
              cursor: pointer;
              margin-right: 10px;
              &:hover {
                background: rgba(15, 117, 255, 1);
                color: #fff;
              }
            }
          }
        }
        .el-form-item {
          display: inline-block;
          width: 29%;
          margin-left: 16px;
          margin-right: 10px;
          &:nth-of-type(3n) {
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
        ul {
          display: flex;
          border-bottom: 1px solid #d8dce3;
          &:last-child {
            border: none;
          }
          li {
            width: 20%;
            text-align: center;
            font-size: 14px;
            color: #666;
            height: 40px;
            line-height: 40px;
          }
        }
      }
      .billUl {
        li.bullLi {
          display: flex;
          justify-content: center;
          div {
            cursor: pointer;
            color: #0f75ff;
          }
          div:last-child {
            margin-left: 10px;
          }
        }
      }
      .reduction {
        ul li {
          width: 25%;
        }
      }
      .basic-select {
        min-height: 200px;
        .bd-number {
          height: 20px;
          line-height: 20px;
          padding-left: 12px;
          background: rgba(250, 250, 250, 1);
          span {
            width: 30%;
            display: inline-block;
          }
        }
        .layer {
          padding-bottom: 20px;
          font-size: 14px;
          div {
            padding: 12px 0 0 12px;
            span {
              display: inline-block;
              width: 30%;
              vertical-align: top;
            }
            span:nth-child(1) {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            span:nth-child(2) {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
        img {
          width: 30px;
          height: 20px;
          margin: 0 40px 0 20px;
        }
      }
      .tenant-info {
        margin: 0 12px;
        span {
          display: inline-block;
          width: 45%;
          font-size: 14px;
          p {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 6px 0;
            &:first-child {
              color: #7085a1;
              padding: 0;
            }
            &:last-child {
              min-height: 30px;
            }
          }
        }
      }
    }
  }
}
.el-textarea {
  textarea {
    height: 40px;
  }
}
.lateFeeunit {
  .el-input {
    width: 70%;
  }
}
textarea {
  height: 40px;
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
.billDetailDrawer{
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
    margin-bottom: 10px;
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
    margin-bottom: 10px !important;
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
}
.matchingflow_new.matchingflow_new1{
  .el-dialog{
    width:1400px!important;
  }
} 
</style>
