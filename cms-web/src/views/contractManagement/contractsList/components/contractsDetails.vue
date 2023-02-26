<template>
  <div class="contracts-info contracts-details contracts-info3">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="mainlayout"
           style="width: 1000px;background-color: #fff;padding-bottom: 50px;"
           slot="drawer">
        <div class="dl-head info_tab">
          <ul class="nav">
            <li @click="changeNav(index)"
                v-for="(item, index) in navList"
                :key="index"
                :class="item.value ? 'select_active' : ''">{{item.label}}</li>
          </ul>
        </div>
        <div class="main-content"
             id="mainContent"
             style="padding: 0">
          <div class="addIntentionContracts">
            <!-- <div class="head-right">
              <span @click="contractBill()">
                <span class="iconfont icon-dingdan"></span>
                合同账单
              </span>
              <span @click="contractBill2()">
                <span class="iconfont icon-post"></span>
                备注</span>
              <span @click="contractBill3()">
                <span class="iconfont icon-attachment"></span>
                附件</span>
            </div> -->
            <div class="dl-content clearfix">
              <el-form :model="contractDetails"
                       ref="detailData"
                       :rules="detailDataRules">
                <div class="step1"
                     v-if="essentialInformation">
                  <div class="dc-right float-right tenantinfo conDetail">
                    <div class="dr-head"><span class="vertical"></span>项目信息</div>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">项目<i class="required">*</i></div>
                      <span v-if="contractDetails.projectManagement">{{contractDetails.projectManagement.referred}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">所属省市区<i class="required">*</i></div>
                      <span>{{address}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">地址<i class="required">*</i></div>
                      <span v-if="contractDetails.projectManagement">{{contractDetails.projectManagement.address}}</span>
                    </el-form-item>
                  </div>
                  <div class="dc-right float-right tenantinfo conDetail">
                    <div class="dr-head btn-wrap">
                      <span class="vertical"></span>客户信息
                      <span class="v-details-btn"
                            @click="getTenantDetails(0, contractDetails.tenant)">查看</span>
                    </div>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">客户名称<i class="required">*</i></div>
                      <span v-if="contractDetails.tenant">{{contractDetails.tenant.teantName}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">品牌</div>
                      <span v-if="contractDetails.tenant">{{contractDetails.tenant.referred}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">用途</div>
                      <span v-if="contractDetails.tenant">{{contractDetails.tenant.tenantUseDescription}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">行业</div>
                      <span v-if="contractDetails.tenant">{{contractDetails.tenant.industry}}</span>
                    </el-form-item>
                    <el-form-item style="margin-right:0"
                                  :label-width="formLabelWidth">
                      <div class="cttitle">法人</div>
                      <span v-if="contractDetails.tenant">{{contractDetails.tenant.operName}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">联系电话</div>
                      <span v-if="contractDetails.tenant">{{contractDetails.tenant.telephone}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">联系地址</div>
                      <span v-if="contractDetails.tenant">{{contractDetails.tenant.nowAddress}}</span>
                    </el-form-item>
                  </div>
                  <div class="dc-right float-right tenantinfo conDetail">
                    <div class="dr-head"><span class="vertical"></span>房源信息</div>
                    <el-form-item class="project-box"
                                  :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;width:956px!important;">
                      <div>
                        <div style="border:1px solid #e5e5e5;border-radius: 2px;border-bottom:0;width:100%;">
                          <el-table :data="contractDetails.rooms"
                                    style="width: 100%">
                            <el-table-column prop="shopNumber"
                                             label="房源号"
                                             align="center"></el-table-column>
                            <el-table-column prop="productionCertificateNo"
                                             label="产证号"
                                             align="center"></el-table-column>
                            <el-table-column prop="buildingArea"
                                             label="建筑面积/㎡"
                                             align="center"></el-table-column>
                            <el-table-column prop="useArea"
                                             label="使用面积/㎡"
                                             align="center"></el-table-column>
                            <el-table-column label="得房率"
                                             align="center">
                              <template slot-scope="scope">
                                {{scope.row.getRoomsRate}}<span v-if="scope.row.getRoomsRate">%</span>
                              </template>
                            </el-table-column>
                            <el-table-column label="操作"
                                             align="center">
                              <template slot-scope="scope">
                                <span @click="handleBunkDetail(scope.$index, scope.row)"
                                      class="view-btn">查看</span>
                              </template>
                            </el-table-column>
                          </el-table>
                        </div>
                      </div>
                    </el-form-item>
                    <!-- <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">总建筑面积</div>
                      <span v-if="detailData.area">{{detailData.area}}㎡</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">总使用面积</div>
                      <span v-if="detailData.useArea">{{detailData.useArea}}㎡</span>
                      <span else></span>
                    </el-form-item> -->
                  </div>
                  <div class="dc-right float-right conDetail">
                    <div class="dr-head"><span class="vertical"></span>合同条款</div>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">合同编号<i class="required">*</i></div>
                      <span>{{contractDetails.contractNo}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">合同状态</div>
                      <span>{{formatterStatus(contractDetails.contractStatus)}}
                        <span v-if="contractDetails.withdrawalDate">（退租日期：{{contractDetails.withdrawalDate}}）</span>
                      </span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="iDNumber">
                      <div class="cttitle">合同签订时间<i class="required">*</i></div>
                      <span>{{contractDetails.signtDate}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;margin-right:0">
                      <div class="cttitle">合同开始时间<i class="required">*</i></div>
                      <span>{{contractDetails.startDate}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="area"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">合同结束时间<i class="required">*</i></div>
                      <span>{{contractDetails.endDate}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="yxContractNo">
                      <div class="cttitle">租赁方式<i class="required">*</i></div>
                      <span>{{formatRentalMethod(contractDetails.rentalMethod)}}</span>
                    </el-form-item>
                  </div>
                  <div class="dc-right float-right tenantinfo conDetail">
                    <div class="dr-head btn-wrap">
                      <span class="vertical"></span>附件
                      <span class="aliUpload-span"
                            v-if="contractDetails.contractStatus !== 'ZH_APPROVAL' && contractDetails.contractStatus !== 'XQ_APPROVAL'">
                        <aliUpload class="aliUpload"
                                   upLoadText="上传资料"
                                   :fileType="fileType"
                                   businessType='project'
                                   :encrypt="true"
                                   :iconShow="true"
                                   @setAnnex="setAnnex" />
                      </span>
                    </div>
                    <el-form-item class="project-box"
                                  :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;width:956px!important;">
                      <div class="annexes">
                        <div style="border:1px solid #e5e5e5;border-radius: 2px;border-bottom:0;width:100%;">
                          <el-table :data="contractDetails.annexes"
                                    style="width: 100%">
                            <el-table-column prop="annexName"
                                             label="附件名称"
                                             align="left"></el-table-column>
                            <el-table-column prop="createTime"
                                             :formatter="formatterTime1"
                                             label="上传时间"
                                             align="center"></el-table-column>
                            <el-table-column prop="createUserName"
                                             label="操作人"
                                             align="center"></el-table-column>
                            <el-table-column label="操作"
                                             align="center">
                              <template slot-scope="scope">
                                <span class="view-btn">
                                  <ailPreview :ailObj="scope.row"
                                              :encrypt="true"
                                              @setFile="setFile" />
                                  <aliDownLoad :item="scope.row"
                                               :encrypt="true" />
                                  <i class="icon-guidang iconfont"
                                     v-if="hasAuthority('02020511')"
                                     @click="annexesFile(scope.row.id,true)"
                                     title="归档"></i>
                                </span>
                              </template>
                            </el-table-column>
                          </el-table>
                          <div class="fileBtn"
                               v-if="contractDetails.onFileAnnexes && contractDetails.onFileAnnexes.length"
                               style="">
                            <span @click="fileShow=!fileShow"
                                  style="font-weight: bold;color:#333">归档</span>
                            <i class="icon-right iconfont"
                               :class="{'roat':fileShow}"
                               @click="fileShow=!fileShow"></i>
                          </div>
                          <div class="fileContent1"
                               v-show="fileShow && contractDetails.onFileAnnexes && contractDetails.onFileAnnexes.length">
                            <el-table :data="contractDetails.onFileAnnexes"
                                      :show-header="false"
                                      style="width: 100%">
                              <el-table-column prop="annexName"
                                               label="附件名称"
                                               align="left"></el-table-column>
                              <el-table-column prop="createTime"
                                               :formatter="formatterTime1"
                                               label="上传时间"
                                               align="center"></el-table-column>
                              <el-table-column prop="createUserName"
                                               label="操作人"
                                               align="center"></el-table-column>
                              <el-table-column label="操作"
                                               align="center">
                                <template slot-scope="scope">
                                  <span class="view-btn">
                                    <ailPreview :ailObj="scope.row"
                                                :encrypt="true"
                                                @setFile="setFile" />
                                    <aliDownLoad :item="scope.row"
                                                 :encrypt="true" />
                                    <i class="icon-huifu iconfont"
                                       v-if="hasAuthority('02020511')"
                                       @click="annexesFile(scope.row.id,false)"
                                       title="恢复"></i>
                                  </span>
                                </template>
                              </el-table-column>
                            </el-table>
                          </div>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                  <div class="dc-right float-right tenantinfo conDetail"
                       style="margin-bottom: 15px">
                    <div class="dr-head btn-wrap">
                      <span class="vertical"></span>备注
                      <span class="remark"
                            @click="remarkContent = '';flowDialogVisible=true;"
                            v-if="contractDetails.contractStatus !== 'ZH_APPROVAL' && contractDetails.contractStatus !== 'XQ_APPROVAL'"><i class="iconfont icon-cms_xiugai-"></i>备注</span>
                    </div>
                    <el-form-item class="project-box"
                                  :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;width:956px!important;">
                      <div class="remarks-table">
                        <div style="border:1px solid #e5e5e5;border-radius: 2px;border-bottom:0;width:100%;">
                          <el-table :data="detailDataRemarks"
                                    style="width: 100%">
                            <el-table-column label="备注内容"
                                             align="center">
                              <template slot-scope="scope">
                                <span :title="scope.row.content">{{scope.row.content}}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="createTime"
                                             :formatter="formatterTime"
                                             label="记录时间"
                                             align="center"></el-table-column>
                            <el-table-column prop="createUserName"
                                             label="操作人"
                                             align="center"></el-table-column>
                          </el-table>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                </div>
                <div class="step2 dl-content clearfix"
                     v-else>
                  <!--<div class="dc-right float-right">
                    <div class="dr-head">已选中房源</div>
                    <div class="selected-housing"
                         v-for="(item, index) in detailData.rooms"
                         :key="index">
                      <span>{{item.projectManagement ? item.projectManagement.projectName : ''}}</span>
                      <span>{{item.building.buildingName}}</span>
                      <span v-if="item.floor">{{item.floor.name}}层</span>
                      <span>{{item.shopNumber}}</span>
                      <span>{{item.buildingArea}} m²</span>
                    </div>
                  </div>-->
                  <div class="dc-right float-right tenantinfo conDetail">
                    <div class="dr-head"><span class="vertical"></span>单价</div>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">初始单价<i class="required">*</i></div>
                      <span v-if="contractDetails.projectManagement">{{contractDetails.cPrice | toLocaleString}}{{priceUnitFormat(contractDetails.cPriceUnit)}}</span>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">实时单价</div>
                      <span v-if="contractDetails.projectManagement">{{contractDetails.sPrice | toLocaleString}}{{priceUnitFormat(contractDetails.sPriceUnit)}}</span>
                    </el-form-item>
                  </div>
                  <div class="dc-right float-right">
                    <div class="dr-head contract-rules clearfix"><span class="vertical"></span>账单规则
                      <div @click="openPropertyDialog"
                           v-if="hasAuthority('02020508') && contractDetails.contractStatus !== 'ZH_APPROVAL' && contractDetails.contractStatus !== 'NO' && contractDetails.contractStatus !== 'XQ_APPROVAL' && 
                           (contractDetails.rentClauses.length>1 || contractDetails.rentClauses.length === 1 && contractDetails.rentClauses[0].termType === 'PROPERTY')">生成物业费规则</div>
                      <div @click="openNewRulesDialog"
                           v-if="hasAuthority('02020507') && contractDetails.contractStatus !== 'ZH_APPROVAL' && contractDetails.contractStatus !== 'NO' && contractDetails.contractStatus !== 'XQ_APPROVAL' && 
                           (contractDetails.rentClauses.length>1 || contractDetails.rentClauses.length === 1 && contractDetails.rentClauses[0].termType === 'RENT')">生成租金规则</div>
                    </div>
                    <div class="selected-housing bill-details">
                      <ul>
                        <li>规则类型</li>
                        <li>开始时间</li>
                        <li>结束时间</li>
                        <li>初始单价</li>
                        <li style="overflow: hidden;"
                            title="付费周期">付费周期</li>
                        <li>创建时间</li>
                        <li>操作</li>
                      </ul>
                      <ul v-for="(item, index) in contractRulesData"
                          :key="index">
                        <li>
                          {{item.termType === 'PROPERTY' ? '物业费' : '租金'}}
                        </li>
                        <li>
                          {{item.startDate}}
                        </li>
                        <li>
                          {{item.endDate}}
                        </li>
                        <li>
                          <span v-if="item.termType === 'PROPERTY'">{{item.price}}{{priceUnitFormat(item.priceUnit)}}</span>
                          <span v-if="item.termType === 'RENT' && contractDetails.rentalMethod === 'RENT'">{{item.price}}{{priceUnitFormat(item.priceUnit)}}</span>
                          <span v-if="item.termType === 'RENT' && contractDetails.rentalMethod === 'POINTS'">{{item.point}}%/月</span>
                          <span v-if="item.termType === 'RENT' && contractDetails.rentalMethod === 'GUARANTEEPOINT'">{{item.point}}%/月或{{item.price}}{{priceUnitFormat(item.priceUnit)}}</span>
                        </li>
                        <li>
                          {{item.month + '月'}}
                        </li>
                        <li>
                          {{item.createdDate ? item.createdDate.substring(0, 10) : ''}}
                        </li>
                        <li class="operation-li">
                          <span v-if="hasAuthority('02020509')"
                                @click="rulesDetail(item.termType, item.id)">查看</span>
                          <span v-if="hasAuthority('02020510') && contractDetails.contractStatus !== 'ZH_APPROVAL' && contractDetails.contractStatus !== 'NO' && contractDetails.contractStatus !== 'XQ_APPROVAL'"
                                @click="createdbillDialog = true;ruleId = item.id;billStart='';billTableData=[]">生成账单</span>
                        </li>
                      </ul>
                      <ul v-if="contractRulesData.length === 0"
                          style="text-align: center">
                        <li style="width: 100%;color: #777">暂无数据</li>
                      </ul>
                    </div>
                  </div>
                  <!-- <div class="page float-right"
                       style="margin-bottom: 10px;">
                    <el-pagination v-if="pager.total > 0"
                                   background
                                   layout="prev, pager, next"
                                   :page-size=pager.pgSize
                                   :total="pager.total"
                                   :current-page="pager.currentPage"
                                   @current-change="current_change">
                    </el-pagination>
                  </div> -->
                  <div class="dc-right float-right">
                    <div class="dr-head contract-rules clearfix"><span class="vertical"></span>账单列表
                      <div @click="exportBill">导出账单</div>
                    </div>
                    <div class="selected-housing bill-details">
                      <ul>
                        <li>费用类型</li>
                        <li>账单金额/元</li>
                        <li>已收金额/元</li>
                        <li style="width: 220px">计费周期</li>
                        <li>应收时间</li>
                        <li>账单状态</li>
                        <li>操作</li>
                      </ul>
                      <ul v-for="(item, index) in tableData"
                          :key="index">
                        <li>{{ item.feeTypeName }}</li>
                        <li>
                          {{ item.amount | toLocaleString }}<span v-if="item.remake && item.feeTypeName === '租金保证金'">{{ item.remake }}</span>
                        </li>
                        <li>
                          {{ item.sjAmount | toLocaleString }}
                        </li>
                        <li style="width: 220px">
                          {{ item.startDate }}~{{ item.endDate }}
                        </li>
                        <li>
                          {{ item.finalPaymentDate }}
                        </li>
                        <li>
                          {{formatterBillStatus(item)}}
                        </li>
                        <li class="operation-li">
                          <span v-if="contractDetails.contractStatus !== 'ZH_APPROVAL' && contractDetails.contractStatus !== 'XQ_APPROVAL'"
                                @click="billDetails(index, item)">查看</span>
                        </li>
                      </ul>
                      <ul v-if="tableData.length === 0"
                          style="text-align: center">
                        <li style="width: 100%;color: #777">暂无数据</li>
                      </ul>
                    </div>
                  </div>
                  <div class="page-footer"
                       style="margin-bottom: 15px;">
                    <span>
                      合同总金额：<span>{{amount | toLocaleString}}元</span>
                      实收总金额：<span>{{sjAmount | toLocaleString}}元</span>
                    </span>
                    <span v-if="pager.total > 0">
                      <el-pagination background
                                     layout="prev, pager, next"
                                     :page-size=pager.pgSize
                                     :total="pager.total"
                                     :current-page="pager.currentPage"
                                     @current-change="current_change">
                      </el-pagination>
                    </span>
                  </div>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer"
           style="background: #fff;padding: 10px;margin-right: 0;height:50px;margin-top: -50px;">
        <el-button type="primary"
                   style="position: relative;float: left;width: 135px;left: 40px;"
                   v-if="contractDetails.decorationBills && contractDetails.decorationBills.length === 1 && (contractDetails.decorationBills[0].billStatus === 'OK' || contractDetails.decorationBills[0].billStatus === 'SECTION')"
                   @click="returnDecorationDeposit"
                   class="close-button">返还装修保证金</el-button>
        <el-button type="primary"
                   v-if="hasAuthority('02020505') && (contractDetails.contractStatus === 'EXECUTING' || contractDetails.contractStatus === 'WITHDRAWAL' || contractDetails.contractStatus === 'MATURITY')"
                   @click="checkRenew"
                   class="close-button">合同续签</el-button>
        <el-button type="primary"
                   class="close-button"
                   v-if="hasAuthority('02020504') && (contractDetails.contractStatus === 'PENDING' || contractDetails.contractStatus === 'MATURITY' || contractDetails.contractStatus === 'EXECUTING')"
                   @click="contractWithdrawal('add')">合同退租</el-button>
        <!-- <el-button type="primary"
                   class="close-button"
									  style="padding: 0"
                   v-if="detailData.contractStatus === 'TZ_APPROVAL' || detailData.contractStatus === 'WITHDRAWAL'"
                   @click="agreement">查看退租协议</el-button> -->
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
                v-model="remarkContent"
                placeholder="请输入内容">
      </el-input>
      <div class="operation">
        <span @click="addRemarks">确定</span>
      </div>
      <div class="remarks-list">
        <div class="remarks-item">
          <div>备注记录：</div>
          <div v-for="(item, index) in contractDetails.remarks"
               :key="index">
            <span style="width: 100%;text-align: left">{{item.content}}</span>
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
        <span>
          <i class="icon icon-adds"></i>
          <p style="line-height: 0;position: relative;top: -28px;">上传文件</p>
        </span>
        <!-- <input type="file" style="top: 0" @change="imageChange('addapp', $event)"> -->
        <aliUpload class="aliUpload"
                   :upLoadText="upLoadText"
                   :fileType="fileType"
                   :iconShow="false"
                   @setAnnex="setAnnex" />
      </div>
      <div class="enclosure-list"
           v-for="(item, index) in enclosureList"
           :key="index">
        <div class="el-item clearfix">
          <span>{{item.annexName}}</span>
          <span v-if="item.annexName"
                style="float: right;display:flex;">
            <aliDownLoad :item="item" />
            <!-- <i @click="downloadFile(item, index)" class="iconfont icon-xiazaidaoru" style="margin-right: 10px;"></i> -->
            <i @click="deleFile(item, index)"
               class="iconfont icon-lajixiang"
               style="margin-left:10px"></i>
          </span>
        </div>
      </div>
      <div class="operation">
        <span @click="addAnnexes">确定</span>
      </div>
      <div class="enclosure-list"
           v-for="(item, index) in contractDetails.annexes"
           :key="item.id">
        <div class="el-item clearfix">
          <span>{{item.annexName}}</span>
          <span v-if="item.annexName"
                style="float: right;display:flex;">
            <aliDownLoad :item="item" />
            <!-- <i @click="downloadFile(item, index)" class="iconfont icon-xiazaidaoru" style="margin-right: 10px;"></i> -->
            <i @click="deleteAnnex(item, index)"
               class="iconfont icon-lajixiang"
               style="margin-left:10px"></i>
          </span>
        </div>
      </div>
    </div>
    <el-dialog title="合同账单"
               :show-close="false"
               :visible.sync="contractBillDialogVisible"
               class="contract-bill"
               append-to-body>
      <div class="export"
           @click="exportBill">
        <span class="iconfont icon-xiazaidaoru"></span>
        导出账单
      </div>
      <div class="amount clearfix">
        <div>
          <p>合同账单总金额/元</p>
          <p>{{amount | toLocaleString}}</p>
        </div>
        <div>
          <p>实收总金额/元</p>
          <p>{{sjAmount | toLocaleString}}</p>
        </div>
      </div>
      <el-table ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%">
        <el-table-column prop="feeTypeName"
                         label="费用类型"
                         width="120">
        </el-table-column>
        <el-table-column label="账单金额/元"
                         width="120">
          <template slot-scope="scope">{{ scope.row.amount | toLocaleString }}<span v-if="scope.row.remake && scope.row.feeTypeName === '租金保证金'">{{ scope.row.remake }}</span></template>
        </el-table-column>
        <el-table-column label="实收金额/元"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.sjAmount | toLocaleString }}</template>
        </el-table-column>
        <el-table-column label="计费周期"
                         width="170"
                         align="center"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.startDate }}~{{ scope.row.endDate }}</template>
        </el-table-column>
        <el-table-column prop="finalPaymentDate"
                         label="应收时间"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="billStatus"
                         label="账单状态"
                         :formatter="formatterBillStatus"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="billType"
                         label="账单类型"
                         :formatter="formatterBillType"
                         show-overflow-tooltip>
        </el-table-column>
        <!-- <el-table-column
          prop="address"
          label="滞纳金金额"
          show-overflow-tooltip>
        </el-table-column> -->
        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button @click="billDetails(scope.$index, scope.row)"
                       v-if="contractDetails.contractStatus !== 'ZH_APPROVAL' && contractDetails.contractStatus !== 'XQ_APPROVAL'"
                       class="el-button--primary"
                       size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="contractBillDialogVisible = false"
                   class="close-button">关 闭</el-button>
        <!-- <el-button type="primary"
                   @click="addPara('addform')"
                   class="defaultbtn dialog-confirmBtn">保 存</el-button> -->
      </div>
    </el-dialog>
    <el-dialog title="合同退租申请"
               :visible.sync="withdrawalDialogVisible"
               class="contract-bill rent-withdrawal"
               append-to-body>
      <contractWithdrawal :withdrawalVisible="withdrawalDialogVisible"
                          :withdrawalType="withdrawalType"
                          :detailData="contractDetails"
                          :withdrawalData="withdrawalData"
                          ref="contractWithdrawal"
                          @withdrawalClose="withdrawalClose"
                          @onHide="onHide" />
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="withdrawalDialogVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="initiateApproval('addform')"
                   class="defaultbtn dialog-confirmBtn">
          <span v-if="withdrawalType !== 'add'">再次</span>发起审批
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="合同续签"
               :visible.sync="renewalDialogVisible"
               class="contract-bill"
               append-to-body>
      <renewContract :renewBill="renewBill"
                     :marginBill="marginBill" />
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="renewalDialogVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="confirmRenewal('addform')"
                   class="defaultbtn dialog-confirmBtn">确认续签</el-button>
      </div>
    </el-dialog>
    <el-dialog title="装修保证金退款确认"
               :visible.sync="refundDialog"
               class="refundDialog"
               append-to-body>
      <el-form :model="refundform"
               :rules="refundRules"
               ref="refundform">
        <div class="dl-subtitle">账单类型
          <el-form-item>
            付款
          </el-form-item>
        </div>
        <div class="dl-subtitle">账单金额/元<span class="required">*</span>
          <el-form-item prop="amount">
            <el-input v-model="refundform.amount">
            </el-input>
          </el-form-item>
        </div>
        <div class="dl-subtitle"
             style="margin-bottom: 40px;">付款时间<span class="required">*</span>
          <el-form-item prop="billDate">
            <el-date-picker v-model="refundform.billDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="refundDialog = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="refund('refundform')"
                   class="defaultbtn dialog-confirmBtn">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增规则"
               :visible.sync="newRulesDialog"
               class="newRulesDialog"
               width="800px"
               append-to-body>
      <addRentRules ref="addRentRules"
                    v-if="newRulesDialog"
                    :LeaseClauseDataes="LeaseClauseDataes"
                    :contractId="contractId"
                    :rentalMethod="contractDetails.rentalMethod"
                    @closeDialog="closeDialog"
                    @resetData="resetData" />
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="newRulesDialog = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="addRules()"
                   class="defaultbtn dialog-confirmBtn">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增规则"
               :visible.sync="newPropertyDialog"
               class="newRulesDialog"
               width="800px"
               append-to-body>
      <addPropertyRules ref="addPropertyRules"
                        :propertyClauseDataes="propertyClauseData"
                        :contractId="contractId"
                        @closeDialog="closeDialog"
                        @resetData="resetData" />
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="newPropertyDialog = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="addPropertyRules()"
                   class="defaultbtn dialog-confirmBtn">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="规则详情"
               :visible.sync="rentRulesDetail"
               class="newRulesDialog"
               width="800px"
               append-to-body>
      <rentRulesDetail v-if="rentRulesDetail"
                       ref="rentRulesDetail"
                       :rulesDetailData="rentRulesDetailData"
                       :detailDataContracts="contractDetails"
                       :rentalMethod="contractDetails.rentalMethod" />
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="rentRulesDetail = false"
                   class="close-button">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="规则详情"
               :visible.sync="propertyRulesDetail"
               class="newRulesDialog"
               width="800px"
               append-to-body>
      <propertyRulesDetail v-if="propertyRulesDetail"
                           ref="propertyRulesDetail"
                           :detailDataContracts="contractDetails"
                           :rulesDetailData="propertyRulesDetailData" />
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="propertyRulesDetail = false"
                   class="close-button">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="生成账单"
               append-to-body
               :visible.sync="createdbillDialog"
               class="generate-bills"
               width="800px">
      <div class="query-wrap"
           style="display: flex;">
        <el-date-picker v-model="billStart"
                        style="width: 380px!important;margin: 18px 10px 10px 0"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
        <div class="query-btn"
             @click="previewBills"
             style="width: 80px;margin-top: 22px;margin-left: 10px;">预览</div>
      </div>
      <el-table ref="multipleTable"
                :data="billTableData"
                tooltip-effect="dark"
                style="width: 100%"
                center>
        <el-table-column label="日期"
                         width="180">
          <template slot-scope="scope">{{ scope.row.startDate }} ~ {{ scope.row.endDate }}</template>
        </el-table-column>
        <el-table-column label="费用类型"
                         width="120">
          <template slot-scope="scope">{{ scope.row.feeTypeName }}</template>
        </el-table-column>
        <el-table-column label="付款日"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.finalPaymentDate }}</template>
        </el-table-column>

        <el-table-column label="最终单价"
                         show-overflow-tooltip>
          <template slot-scope="scope">

            <span v-if="scope.row.feeTypeName === '物业费'">{{scope.row.finalPrice}}{{priceUnitFormat(scope.row.priceUnit)}}</span>
            <span v-if="scope.row.feeTypeName === '租金' && scope.row.rentalMethod === 'RENT'">{{scope.row.finalPrice}}{{priceUnitFormat(scope.row.priceUnit)}}</span>
            <span v-if="scope.row.feeTypeName === '租金' && scope.row.rentalMethod === 'POINTS'">{{scope.row.finalPrice}}%/月</span>
            <span v-if="scope.row.feeTypeName === '租金' && scope.row.rentalMethod === 'GUARANTEEPOINT'">{{scope.row.finalPrice}}%/月</span>

          </template>
        </el-table-column>
        <el-table-column width="200px"
                         label="账单金额"
                         show-overflow-tooltip>
          <template slot-scope="scope">

            <span class="feeTypeName"
                  v-if="scope.row.feeTypeName === '租金' && scope.row.rentalMethod === 'GUARANTEEPOINT'">{{scope.row.bdAmount}}或者营业额的{{scope.row.finalPrice}}%</span>
            <span class="feeTypeName"
                  v-else-if="scope.row.feeTypeName === '租金' && scope.row.rentalMethod === 'POINTS'">营业额的{{scope.row.finalPrice}}%</span>
            <span class="feeTypeName"
                  v-else>{{scope.row.amount}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="createdbillDialog = false"
                   class="close-button">取 消</el-button>
        <el-button type="primary"
                   @click="cretaedBills()"
                   class="defaultbtn dialog-confirmBtn">生 成</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showTips"
               width="400px!important"
               class="dl-warn"
               center>
      <div class="dl-content">
        <img src="../../../../assets/tanhao.png" />
        <p style="font-size: 16px;color: #000">是否确认生成</p>
        <p>生成的新账单计费周期存在与部分老账单出现交集，是否继续生成？</p>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="showTips = false">取 消</el-button>
        <el-button type="primary"
                   @click="showTips = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="备注"
               :visible.sync="flowDialogVisible"
               width="500px"
               :close-on-click-modal=false
               class="enclosureDialog"
               append-to-body>
      <el-form>
        <div style="padding: 20px 0">
          <div style="margin-bottom: 10px">
            备注<span class="required">*</span>
          </div>
          <el-input type="textarea"
                    v-model="remarkContent"
                    maxlength="200"
                    :rows="4"
                    show-word-limit
                    placeholder="200字以内">
          </el-input>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="flowDialogVisible = false"
                   class="close-button">取消</el-button>
        <el-button type="primary"
                   style="margin-left: 0"
                   @click="addRemarks"
                   class="defaultbtn dialog-confirmBtn">确定</el-button>
      </div>
    </el-dialog>
    <!-- 账单详情 -->
    <billDetails :detailsdrawershow="billDetailsdrawershow"
                 :detailsData="builddetailsData"
                 :queryBillId="queryBillId"
                 :reductionData="reductionData"
                 @drawerClose="drawerClose"
                 @handleEdit="handleEdit"
                 @query='query'
                 @showFlow="showFlow"
                 ref="billDetail" />
    <flowDetails v-if="flowdrawershow"
                 :detailsdrawershow="flowdrawershow"
                 :detailsData="flowDetailsData"
                 :payTypeList="payTypeList"
                 :billId="billId"
                 @drawerClose="flowDrawerClose"
                 @handleEdit="flowHandleEdit"
                 @showBill="showBill"
                 @query='flowQuery' />
    <!-- 房源详情 -->
    <storeDetailis :detailsdrawershow="storeDetailisShow"
                   :detailData="storeDetailisData"
                   :options1="projectOptions"
                   ref="storeDetailis"
                   @shopDetails="shopDetails"
                   @handleEdit='handleBunkDetail'
                   @tenantHandleEdit='tenantHandleEdit'
                   @drawerClose="storeDetailisHide"
                   @query="search" />

    <!-- 预览 -->
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import ailPreview from '@/components/ailPreview.vue'
import billDetails from '@/views/operations/costCollection/billList/components/billDetails.vue'
import flowDetails from '@/views/operations/costCollection/flow/components/flowDetails'
import contractWithdrawal from './contractWithdrawal.vue'
import renewContract from './renewContract.vue'
import aliUpload from '@/components/aliUpload.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import addRentRules from './addRentRules.vue'
import addPropertyRules from './addPropertyRules.vue'
import rentRulesDetail from './rentRulesDetail.vue'
import propertyRulesDetail from './propertyRulesDetail.vue'
import storeDetailis from '../../../project/housingList/components/storeDetailis.vue'
import axios from 'axios'
export default {
  name: 'contractsDetails',
  components: {
    Drawer,
    picturePrevie,
    ailPreview,
    contractWithdrawal,
    renewContract,
    billDetails,
    flowDetails,
    aliUpload,
    aliDownLoad,
    addRentRules,
    addPropertyRules,
    rentRulesDetail,
    propertyRulesDetail,
    storeDetailis
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    withdrawalData: {
      type: Object
    },
    detailData: {
      type: Object,
      default: {
        onFileAnnexes: [],
        rooms: [{
          'projectManagement': {
            'previewImage': '',
            'projectManagement': ''
          }
        }],
        rentClauses: [{
          startDate: '',
          endDate: '',
          deposit: '',
          proportion: '',
          month: '',
          dayNumber: '',
          billingType: '',
          yearDay: ''
        }, {
          startDate: '',
          endDate: '',
          deposit: '',
          proportion: '',
          month: '',
          dayNumber: '',
          billingType: '',
          yearDay: ''
        }]
      }
    }
  },
  data () {
    return {
      fileShow: false,
      contractDetails: {
        rooms: [{
          'projectManagement': {
            'previewImage': '',
            'projectManagement': ''
          }
        }],
        onFileAnnexes: [],
        rentClauses: [{
          startDate: '',
          endDate: '',
          deposit: '',
          proportion: '',
          month: '',
          dayNumber: '',
          billingType: '',
          yearDay: ''
        }, {
          startDate: '',
          endDate: '',
          deposit: '',
          proportion: '',
          month: '',
          dayNumber: '',
          billingType: '',
          yearDay: ''
        }]
      },
      billId: '',
      payTypeList: [],
      flowDetailsData: {},
      flowdrawershow: false,
      address: '',
      projectOptions: [],
      storeDetailisData: {
        imgUrls: [],
        projectManagement: {
          projectName: ''
        },
        building: {},
        floor: {}
      },
      storeDetailisShow: false,
      tenantDetailData: {},
      detailsShow: false,
      flowDialogVisible: false,
      showPicture: false,
      imgArr: [],
      num: 0,
      showTips: false,
      newRulesDialog: false,
      newPropertyDialog: false,
      rentRulesDetail: false,
      propertyRulesDetail: false,
      createdbillDialog: false,
      contractId: '',
      billStart: '',
      billEnd: '',
      upLoadText: '',
      billTableData: [],
      fileType: [],
      tableData: [],
      contractRulesData: [],
      remarkContent: '',
      sjAmount: '',
      amount: '',
      newlystep1: true,
      newlystep2: false,
      refundDialog: false,
      essentialInformation: true,
      showLeaseTerms: true,
      showRentIncrements: true,
      showRentConcessions: true,
      showPropertyIncrements: true,
      showProperty: true,
      withdrawalDialogVisible: false,
      contractBillDialogVisible: false,
      renewalDialogVisible: false,
      drawerTitle: '合同详情',
      navList: [{
        label: '基本信息',
        value: true
      }, {
        label: '账单信息',
        value: false
      }],
      refundform: {
        amount: '',
        billDate: ''
      },
      formLabelWidth: '',
      documentTypeOptions: [],
      nationalityOptions: [],
      projectList: [],
      chooseObj: {},
      selHourse: false,
      selProject: false,
      errorProject: false,
      sexOptions: [
        {
          name: '男',
          value: 'MAN'
        },
        {
          name: '女',
          value: 'WOMAN'
        }
      ],
      detailDataRules: {
        yxContractNo: [{
          required: true,
          message: '请输入合同编号',
          trigger: 'blur'
        }],
        startDate: [{
          required: true,
          message: '请选择开始时间',
          trigger: 'blur'
        }],
        endDate: [{
          required: true,
          message: '请选择结束时间',
          trigger: 'blur'
        }],
        area: [{
          required: true,
          message: '请输入租赁面积',
          trigger: 'blur'
        }]
      },
      showRemarks: false,
      showEnclosure: false,
      renewBill: {},
      marginBill: [],
      refundRules: {
        amount: [{
          required: true,
          message: '请输入账单金额',
          trigger: 'blur'
        }],
        billDate: [{
          required: true,
          message: '请选择付款时间',
          trigger: 'change'
        }]
      },
      enclosureList: [],
      enclosure: '',
      withdrawalType: '',
      billDetailsdrawershow: false,
      builddetailsData: {},
      queryBillId: '',
      reductionData: {},
      LeaseClauseDataes: {},
      propertyClauseData: {},
      propertyRulesDetailData: {},
      rentRulesDetailData: {},
      ruleId: '',
      pager: {
        currentPage: 1,
        pgNum: 1,
        total: 0,
        pgSize: 15
      },
      detailDataRemarks: []
    }
  },
  watch: {
    projectList: {
      handler: function () {
        this.chooseObj = this.projectList[0]
      }
    },
    detailData: {
      handler: function (newVal, oldVal) {
        let onFileAnnexes = newVal.annexes.filter(item => item.onFile) // 已归档文件
        newVal.annexes = newVal.annexes.filter(item => !item.onFile)
        newVal.onFileAnnexes = onFileAnnexes
        console.log(newVal)
        this.contractDetails = newVal
        let rejectedType = this.$route.query.type
        if (rejectedType !== 'surrender') {
          // this.getBillDetails()
        }
        this.changeNav(0)
        this.queryContractRules()
        this.formaterAddr()
        this.remarksFormat()
      }
    }
  },
  created () {
    this.contractDetails = this.detailData
  },
  mounted () {
    let clientHeight = document.body.clientHeight
    let mainContent = document.getElementById('mainContent')
    mainContent.style.height = clientHeight - 165 + 'px'
    this.getDataAuthorityOptions()
  },
  methods: {
    annexesFile (id, flag) { // 归档恢复
      context.http.put('/cms/api/annexes/file', { id: id, onFile: flag }).then(res => {
        if (res.status === 200) {
          this.$message.success('操作成功')
          this.$emit('handleEdit', 0, this.detailData)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 省市区
    async formaterAddr () {
      if (this.detailData.projectManagement.district !== '') {
        this.address = await this.getAddrByCode(this.detailData.projectManagement.district)
      } else if (this.detailData.projectManagement.city !== '') {
        this.address = await this.getAddrByCode(this.detailData.projectManagement.city)
      } else if (this.detailData.projectManagement.province) {
        this.address = await this.getAddrByCode(this.detailData.projectManagement.province)
      }
    },
    remarksFormat () {
      let remarks = this.contractDetails.remarks.slice(0)
      remarks.forEach((ele, idx) => {
        if (ele.content === '') {
          remarks.splice(idx, 1)
        }
      })
      this.detailDataRemarks = remarks
    },
    async getAddrByCode (code) {
      let result = await context.http.get(`ywm/api/district-codes/${code}`)
      return result.data.address
    },
    flowQuery () { },
    showBill (id) {
      let row = {}
      row.id = id
      this.flowdrawershow = false
      this.handleEdit(0, row)
    },
    showFlow (id) {
      let row = {}
      row.id = id
      this.flowHandleEdit(0, row)
    },
    async flowHandleEdit (index, row) {
      let result = await context.http.get(`cms/api/billFlows/${row.id}`)
      this.flowDetailsData = result.data
      this.flowdrawershow = true
      this.billDetailsdrawershow = false
    },
    flowDrawerClose () {
      this.flowdrawershow = false
      this.billDetailsdrawershow = true
    },
    search () { },
    handleBunkDetail (index, row) {
      console.log('drawerClose')
      context.http.get('/cms/api/rooms/' + row.id).then(res => {
        if (res.status === 200) {
          this.storeDetailisData = res.data
          this.storeDetailisShow = true
        }
      })
    },
    shopDetails (roomId) {
      context.http.get('/cms/api/rooms/' + roomId).then(res => {
        if (res.status === 200) {
          this.storeDetailisData = res.data
          this.storeDetailisShow = true
        }
      })
    },
    tenantHandleEdit (index, row) {
      console.log(row)
      this.storeDetailisShow = false
      this.$emit('showTenant', index, row)
    },
    storeDetailisHide () {
      this.storeDetailisShow = false
      this.handleQuery()
    },
    async getDataAuthorityOptions () {
      let result = await context.http.get('cms/api/project-managements', { page: 0, size: 100, sort: 'desc', useStatus: 'USING' })
      this.projectOptions = result.data
      let result2 = await context.http.get('/uaa/api/paramet-managements/name', { name: '付款方式' })
      this.payTypeList = result2.data
    },
    handleQuery () {
      this.$emit('handleEdit', 0, this.detailData)
    },
    getTenantDetails (index, row) {
      this.$emit('showTenant', 0, row)
    },
    detailsClose () {
      this.detailsShow = false
    },
    affirmDialog (contractId, tenantId) {
      // this.centerDialogVisible = true
      // this.contractId = contractId
      // this.tenantId = tenantId
      console.log(contractId, tenantId)
    },
    openNewRulesDialog () {
      this.contractId = this.detailData.id
      this.LeaseClauseDataes = this.detailData
      this.newRulesDialog = true
      this.$nextTick(() => {
        this.$refs.addRentRules.closeRules()
      })
    },
    openPropertyDialog () {
      this.contractId = this.detailData.id
      this.propertyClauseData = this.contractDetails
      this.newPropertyDialog = true
      this.$nextTick(() => {
        this.$refs.addPropertyRules.closeRules()
      })
    },
    resetData () {
      this.LeaseClauseDataes = {}
      this.propertyClauseData = {}
    },
    setAnnex (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.enclosureList.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
      this.enclosure = 'name'
      this.addAnnexes()
    },
    addAnnexes () {
      if (this.enclosureList.length === 0 || !this.enclosure) {
        return
      }
      let obj = {
        contractId: this.detailData.id,
        annexs: this.enclosureList
      }
      context.http.post('/cms/api/annexes/list', obj).then(res => {
        if (res.status === 200) {
          this.showEnclosure = false
          this.enclosure = ''
          this.enclosureList = []
          context.http.get(`/cms/api/contracts/${this.detailData.id}`).then(res => {
            if (res.status === 200) {
              let newVal = res.data
              let onFileAnnexes = newVal.annexes.filter(item => item.onFile) // 已归档文件
              newVal.annexes = newVal.annexes.filter(item => !item.onFile)
              newVal.onFileAnnexes = onFileAnnexes
              console.log(newVal)
              this.contractDetails = newVal
              this.$forceUpdate()
            }
          })
        }
      })
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
    setFile (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      // this.queryContractRules()
      this.contractBill()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    closeDialog () {
      this.newRulesDialog = false
      this.newPropertyDialog = false
      this.queryContractRules()
      this.contractBill()
    },
    rulesDetail (termType, id) {
      context.http.get(`/cms/api/rent-clauses/${id}`).then(res => {
        if (res.status === 200) {
          if (termType === 'PROPERTY') {
            this.propertyRulesDetailData = res.data
            this.propertyRulesDetail = true
          } else {
            this.rentRulesDetailData = res.data
            this.rentRulesDetail = true
          }
        }
      })
    },
    queryContractRules () {
      context.http.get('/cms/api/rent-clauses?sort=termType,desc&sort=createdDate,desc', { contractId: this.detailData.id, page: (this.pager.currentPage - 1), size: this.pager.pgSize }).then(res => {
        this.contractRulesData = JSOG.decode(res.data)
        this.pager.total = Number(res.headers['x-total-count'])
      })
    },
    drawerClose () {
      this.contractBill()
      this.billDetailsdrawershow = false
    },
    addRules () {
      this.$refs.addRentRules.saveRules()
    },
    addPropertyRules () {
      this.$refs.addPropertyRules.saveRules()
    },
    async handleEdit (index, row) {
      let result = await context.http.get(`cms/api/bills/${row.id}`)
      this.builddetailsData = JSOG.decode(result.data)
      this.billDetailsdrawershow = true
    },
    billDetails (index, row) {
      context.http.get(`cms/api/bills/${row.id}`).then(res => {
        this.builddetailsData = res.data
        this.billDetailsdrawershow = true
        this.queryBillId = row.id.toString()
        this.contractBillDialogVisible = false
      })
    },
    query () {

    },
    pictureClose () {
      this.showPicture = false
    },
    onHide () {
      this.enclosureList = []
      this.$emit('drawerClose')
      this.$emit('query')
      this.readonly = true
      this.fileShow = false
      this.showRemarks = false
      this.showEnclosure = false
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
      } else {
        this.selHourse = !this.selHourse
      }
      this.chooseObj = item
    },
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[inx].value = true
      if (inx === 0) {
        this.essentialInformation = true
      } else if (inx === 1) {
        this.pager.currentPage = 1
        this.essentialInformation = false
        this.contractBill()
      }
    },
    newlystepNoe (formName) {
      if (!this.chooseObj) {
        this.errorProject = true
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.newlystep1 = false
          this.newlystep2 = true
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    previousStep () {
      this.essentialInformation = false
    },
    withdrawalClose () {
      this.withdrawalDialogVisible = false
    },
    formatterTime (row, column) {
      return row.createTime.substring(0, 10)
    },
    formatterTime1 (row, column) {
      return row.createTime.replace('T', ' ')
    },
    formatBillType (val) {
      return val === 'MONTH' ? '按月计费' : '按天计费'
    },
    formatUnit (val) {
      return val === 'P' ? '%' : '元'
    },
    formatOfferType (val) {
      return val === 'RENT' ? '免租期' : val === 'DECORATION' ? '装修期' : '物业免租期'
    },
    formatRentalMethod (val) {
      return val === 'RENT' ? '固定租金' : val === 'POINTS' ? '扣点' : '保底扣点'
    },
    formatOfferReocrd (val) {
      return val === true ? '包括' : '不包括'
    },
    formatonRentBill (val) {
      return val === false ? '不同步' : '同步'
    },
    formatterStatus (val) {
      let contractStatus
      if (val === 'STORAGE') {
        contractStatus = '暂存'
      } else if (val === 'PENDING') {
        contractStatus = '待执行'
      } else if (val === 'EXECUTING') {
        contractStatus = '执行中'
      } else if (val === 'ZH_APPROVAL') {
        contractStatus = '招商审核中'
      } else if (val === 'TZ_APPROVAL') {
        contractStatus = '退租审核中'
      } else if (val === 'WITHDRAWAL') {
        contractStatus = '已退租'
      } else if (val === 'XQ_APPROVAL') {
        contractStatus = '续签审核中'
      } else if (val === 'NO') {
        contractStatus = '审核未通过'
      } else if (val === 'MATURITY') {
        contractStatus = '到期未处理'
      }
      return contractStatus
    },
    feeTypeFormat (val) {
      let feeType
      if (val === 'RENT') {
        feeType = '租金'
      } else if (val === 'RENT_DEPOSIT') {
        feeType = '租金保证金'
      } else if (val === 'DECORATION') {
        feeType = '装修保证金'
      } else if (val === 'F_INTENTION') {
        feeType = '返还意向金'
      } else if (val === 'F_DECORATION') {
        feeType = '返还装修保证金'
      } else if (val === 'WITHDRAWAL') {
        feeType = '退租结算'
      } else if (val === 'PROPERTY') {
        feeType = '物业费'
      } else if (val === 'PROPERTY_DEPOSIT') {
        feeType = '物业费保证金'
      } else if (val === 'WITHDRAWAL') {
        feeType = '退租结算'
      } else if (val === 'RELEASE') {
        feeType = '合同解除结算'
      }
      return feeType
    },
    priceUnitFormat (val) {
      let priceUnit
      if (val === 'M2DAYS') {
        priceUnit = '元/㎡天'
      } else if (val === 'M2MONTH') {
        priceUnit = '元/㎡月'
      } else if (val === 'DAY') {
        priceUnit = '元/天'
      } else if (val === 'MONTH') {
        priceUnit = '元/月'
      } else if (val === 'YEAR') {
        priceUnit = '元/年'
      }
      return priceUnit
    },
    returnDecorationDeposit () {
      this.refundDialog = true
      if (this.contractDetails.decorationBills.length > 0) {
        this.refundform.amount = this.contractDetails.decorationBills[0].sjAmount
      }
    },
    imageChange (state, event) {
      this.enclosureList = []
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      let name = files[0].name
      event.target.value = ''
      context.http.post('/ywm/api/image-multipart', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.enclosureList = [{
          'annexName': name,
          'annexURL': res.data
        }]
        this.enclosure = 'name'
      }).catch(error => {
        console.info(error)
      })
    },
    addIntentionContracts () { },
    checkRenew () {
      context.http.get(`/cms/api/contracts/checkRenew`, { contractId: this.detailData.id }).then(res => {
        if (res.status === 400) {
          return
        } else {
          this.contractRenewal()
        }
      })
    },
    contractRenewal () {
      this.marginBill = []
      this.renewalDialogVisible = true
      context.http.get('/cms/api/bills/renew', {
        id: this.detailData.id
      }).then(res => {
        this.renewBill = res.data
      })
      context.http.get(`/cms/api/bills/business/${this.detailData.id}`).then(res => {
        this.marginBill = res.data
      })
    },
    getBillDetails () {
      this.marginBill = []
      context.http.get(`/cms/api/bills/business/${this.detailData.id}`).then(res => {
        this.marginBill = res.data
      })
    },
    contractWithdrawal (type) {
      this.withdrawalDialogVisible = true
      this.withdrawalType = type
    },
    initiateApproval () {
      this.$refs.contractWithdrawal.initiateApproval()
    },
    agreement () {
      console.log('退租协议')
    },
    confirmRenewal () {
      localStorage.contractStatus = 'renewal'
      localStorage.contract = JSON.stringify(this.contractDetails)
      this.renewalDialogVisible = false
      this.onHide()
      this.$emit('openAddDialog')
    },
    contractBill () {
      // this.contractBillDialogVisible = true
      context.http.get(`/cms/api/bills/business/statisics/${this.detailData.id}?sort=startDate,asc&sort=endDate,asc&sort=finalPaymentDate,asc&sort=feeType,asc`, { page: (this.pager.currentPage - 1), size: this.pager.pgSize }).then(res => {
        this.tableData = res.data.list
        this.amount = res.data.statisics.amount
        this.sjAmount = res.data.statisics.sjAmount
        this.pager.total = Number(res.headers['x-total-count'])
      })
    },
    contractBill2 () {
      this.showRemarks = true
      this.showEnclosure = false
      console.log(this.showRemarks, this.showEnclosure)
    },
    contractBill3 () {
      this.showEnclosure = true
      this.showRemarks = false
    },
    exportBill () {
      axios({
        method: 'GET',
        url: `/cms/api/bills/business/report/${this.detailData.id}`,
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
    deleFile (item, index) {
      this.enclosureList.splice(index, 1)
    },
    deleteAnnex (item, index) {
      context.http.delete(`/cms/api/annexes/${item.id}`).then(res => {
        this.contractDetails.annexes.splice(index, 1)
      })
    },
    addRemarks () {
      if (!this.remarkContent) {
        return
      }
      context.http.post('/cms/api/remarks', {
        content: this.remarkContent,
        contractId: this.detailData.id
      }).then(res => {
        if (res.status === 201) {
          this.flowDialogVisible = false
          this.remarkContent = ''
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          context.http.get(`/cms/api/contracts/${this.detailData.id}`).then(res => {
            if (res.status === 200) {
              this.contractDetails = res.data
              this.remarksFormat()
              this.$forceUpdate()
            }
          })
        }
      })
    },
    formatterBillType (row, column) {
      return row.billType === 'R' ? '收款' : '付款'
    },
    formatterBillStatus (row, column) {
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
      } else if (row.billStatus === 'STAY_SETTLE') {
        res = '待结清'
      }
      return res
    },
    formatterFeeType (row, column) {
      let feeType
      switch (row.feeType) {
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
    refund (formName) {
      this.$refs['refundform'].validate((valid) => {
        if (valid) {
          this.refundform.businessId = this.contractDetails.id
          this.refundform.businessType = 'CONTRACT'
          this.refundform.feeTypeName = '装修保证金'
          this.refundform.finalPaymentDate = this.refundform.billDate
          this.refundform.referred = this.contractDetails.tenant.referred
          this.refundform.tenandId = this.contractDetails.tenant.id
          this.refundform.projectManagement = this.contractDetails.projectManagement
          let _this = this
          context.http.post('/cms/api/bills/restore', this.refundform).then(res => {
            if (res.status === 201) {
              _this.refundDialog = false
              _this.showRemarks = false
              _this.showEnclosure = false
              this.$emit('handleEdit', 0, this.contractDetails)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    previewBills () {
      if (!this.billStart[0] || !this.billStart[1]) {
        this.$message({
          message: '请选择时间',
          type: 'warning'
        })
        return
      }
      context.http.get(`/cms/api/rent-clauses/business/${this.ruleId}?startDate=${this.billStart[0]}&endDate=${this.billStart[1]}`).then(res => {
        if (res.status === 200) {
          this.billTableData = res.data.newBills
          if (res.data.oldBills && res.data.oldBills.length > 0 && res.data.newBills.length !== 0) {
            this.showTips = true
          }
        }
      })
    },
    cretaedBills () {
      if (!this.billStart[0] || !this.billStart[1] || this.billTableData.length === 0) {
        return
      }
      context.http.post(`/cms/api/rent-clauses/business/${this.ruleId}?startDate=${this.billStart[0]}&endDate=${this.billStart[1]}`).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '生成成功',
            type: 'success'
          })
          this.createdbillDialog = false
          this.contractBill()
        }
      }).catch(error => {
        console.log(error)
        this.$message({
          message: '生成成功',
          type: 'success'
        })
        this.createdbillDialog = false
        this.contractBill()
      })
    }
  }
}
</script>
<style lang="scss">
@keyframes whirl {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(90deg);
  }
}
@import "../../../../style/mixins.scss";
.feeTypeName {
  display: block;
  width: 200px !important;
}
.contracts-info {
  position: relative;
  &.contracts-info3 {
    .dweditbtn {
      right: 15px;
    }
    .wrap {
      height: auto !important;
      min-height: auto !important;
    }
    .drawer-head {
      margin: 15px 0 0 0;
      padding: 0 20px 20px 20px;
    }
    .main-content {
      padding: 0 20px 0 20px;
      overflow-y: scroll;
      margin: 0;
      border: none;
      @include scrollBarStyle;
    }
    .vertical {
      display: inline-block;
      width: 4px;
      height: 18px !important;
      background-color: #3575f6;
      border-radius: 2px;
      vertical-align: sub;
      margin-right: 5px;
    }
    .cttitle {
      color: #777;
      vertical-align: top;
    }
    .page-footer {
      padding: 20px 0 20px 20px;
      background-color: #fff;
      font-size: 14px;
      width: 100%;
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      span {
        color: #777777;
        span {
          color: #262626;
          margin-right: 10px;
          font-weight: bold;
          font-size: 14px;
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
  .contracts-remarks {
    position: fixed;
    z-index: 2222 !important;
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
  }
  .contracts-enclosure {
    position: fixed;
    z-index: 2222 !important;
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
      .aliUpload {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        .oss_file {
          border: none;
          width: 100%;
          height: 100%;
          input {
            position: absolute;
            right: 0;
            width: 100%;
            height: 100px;
            opacity: 0;
            cursor: pointer;
          }
        }
      }
      .icon-adds {
        background: url(../../../../assets/plus.png) no-repeat;
        background-size: contain;
        margin-bottom: 6px;
      }
    }

    .enclosure-list {
      width: 90%;
      margin: 0 auto;
      margin-top: 40px;
      font-size: 12px;

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
  .contract-bill {
    .el-dialog {
      width: 1000px;
    }

    .el-dialog__body {
      border-bottom: none;
    }

    .el-table {
      border: 1px solid rgba(241, 241, 241, 1);
    }

    .amount {
      > div {
        display: inline-block;
        margin: 20px 60px 20px 0;
        float: left;

        p {
          &:first-child {
            margin-bottom: 10px;
            color: #7085a1;
          }
        }
      }
    }

    .export {
      position: absolute;
      right: 35px;
      top: 23px;
      color: #0f75ff;
      cursor: pointer;

      span {
        color: #0f75ff;
      }
    }
  }
  .rent-withdrawal {
    .el-dialog {
      margin-top: 5vh !important;
    }
  }
  .generate-bills {
    .query-wrap {
      margin: 10px 0;
      display: flex;
      align-content: center;
      > div {
        margin-top: 18px;
        margin-bottom: 10px;
        margin-right: 10px;
      }
      .query-btn {
        width: 80px;
        margin-top: 22px;
        margin-left: 10px;
      }
    }
  }
  .dl-head {
    margin-top: 10px;
  }

  .info_tab {
    height: 48px;
    display: -ms-flexbox;
    display: flex;
    background-color: #fff;
    margin: 10px 0 0px 0;
    box-shadow: 1px 2px 5px #eee;
    border-radius: 3px;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -ms-flex-align: center;
    align-items: center;
    padding-right: 44px;
    border-bottom: 1px solid #ecedef;

    .nav {
      display: -ms-flexbox;
      display: flex;
      padding-left: 20px;

      li.select_active {
        border-bottom: 2px solid #3575f6;
        color: #3575f6;
        font-weight: bolder;
      }

      li {
        width: 140px;
        text-align: center;
        font-size: 14px;
        color: #666;
        height: 46px;
        line-height: 46px;
        border-bottom: 2px solid #fff;
        cursor: pointer;
      }
    }
  }
}
.contracts-details {
  .basic-select {
    .selectInput {
      img {
        margin: 0;
        width: 60px;
        height: 30px;
      }
      span {
        font-size: 14px;
      }
    }
    .condetail {
      > span {
        float: left !important;
        line-height: 30px;
        margin-left: 20px;
        color: #666 !important;
      }
    }
  }

  .cttitle + span {
    font-size: 14px;
    color: #262626;
    display: inline-block;
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
          width: 100%;
          text-align: left;
        }
      }
    }
  }
  .textleft {
    text-align: left !important;
    white-space: nowrap;
    overflow: hidden;
  }
  .addIntentionContracts {
    background: #f7f7f7;
    position: relative;

    .head-right {
      position: absolute;
      top: -40px;
      right: 0;
      font-size: 12px;

      > span {
        margin-right: 10px;
      }

      span {
        cursor: pointer;
      }

      .iconfont {
        vertical-align: middle;
      }
    }
    .dialog-footer {
      border-top: 1px solid #e5e5e5;
      padding: 20px 0;
      text-align: right;
      margin-top: 0;
      margin-right: 38px;
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
        top: 0;
        width: 60px;
        height: 24px;
        opacity: 0;
        cursor: pointer;
      }
    }

    .enclosure {
      border: 1px solid #e7e7e7;
      margin-bottom: 20px;
      font-size: 12px;

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
        font-size: 12px;

        span {
          display: inline-block;
          width: 48%;
          padding-left: 40px;
        }
      }
    }

    .dl-content {
      width: 100%;
      margin-bottom: 0;
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
      .project-box {
        width: 100% !important;
        margin-top: 10px;
        .project-item {
          width: 100%;
          height: 74px;
          display: flex;
          align-items: center;
          border: 1px solid rgba(227, 227, 227, 1);
          border-radius: 4px;
          img {
            margin-left: 12px;
            margin-right: 14px;
            display: block;
            width: 100px;
            height: 55px;
          }
          span {
            font-size: 12px;
            color: #666666;
          }
        }
      }
      .rooms-table {
        padding: 20px;
        box-sizing: border-box;
        height: auto !important;
        .el-table td {
          border: 0;
        }
      }
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
          // background-color: #fafafa;
          // height: 40px;
          // line-height: 40px;
          // padding-left: 12px;
          // font-size: 14px;
          // margin-bottom: 20px;
          background-color: #fff;
          height: 40px;
          line-height: 40px;
          padding-left: 20px;
          font-size: 16px;
          margin-bottom: 10px;
          font-weight: bold;
          border-bottom: 1px solid #f6f6f6;
        }
        .basic-select {
          width: 100%;
          .bd-number {
            text-align: left;
            height: 20px;
            line-height: 20px;
            padding-left: 32px;
            background: #fafafa;
          }
          .layer {
            padding-bottom: 20px;
            font-size: 14px;
            div {
              padding: 12px 0 0 0;
              span {
                display: inline-block;
                width: 32%;
                vertical-align: top;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
      }
      .tenantinfo {
        .el-form-item {
          width: 29% !important;
          margin-right: 0;
          vertical-align: top;
        }

        .cttitle + span {
          display: inline-block;
          height: 25px;
          line-height: 25px;
          font-size: 14px;
        }
      }

      .dc-right {
        width: 100%;
        margin-top: 15px;
        background: #fff;
        border: none;
        .annexes {
          .icon-guidang,
          .icon-huifu {
            color: #333;
            font-size: 18px;
            margin-left: 10px;
            text-decoration: none;
          }
          .fileBtn {
            .iconfont {
              font-size: 12px;
              color: #999;
              display: inline-block;
              &.roat {
                transform: rotate(90deg);
                animation: whirl 0.2s ease-out;
              }
            }
            > span {
              color: #333;
              font-size: 14px;
              cursor: pointer;
            }
          }
        }
        .dr-head {
          background-color: #fff;
          height: 40px;
          line-height: 40px;
          padding-left: 20px;
          font-size: 16px;
          margin-bottom: 10px;
          font-weight: bold;
          border-bottom: 1px solid #f6f6f6;
          div,
          span {
            font-weight: 400;
          }
        }
        .contract-rules {
          div {
            display: inline-block;
            background-color: #fff;
            color: #0f75ff;
            border: 1px solid #0f75ff;
            cursor: pointer;
            height: 24px;
            line-height: 23px;
            border-radius: 4px;
            font-size: 12px;
            padding: 0 4px;
            float: right;
            margin: 7px 10px 0 0;
            &:hover {
              background-color: #0f75ff;
              color: #fff;
            }
          }
        }

        .el-form-item {
          display: inline-block;
          width: 29%;
          margin-left: 20px;
          margin-right: 10px;

          &:nth-of-type(2n) {
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
      }
    }

    .selected-housing {
      margin-bottom: 15px;
      font-size: 12px;
      margin: 0 20px 20px 20px;
      span {
        display: inline-block;
        width: 19%;
        padding-left: 40px;
        vertical-align: top;
      }

      ul {
        display: flex;
        border-bottom: 1px solid #f6f6f6;
        &:first-child {
          background: #f7f8fa;
        }

        li {
          width: 20%;
          height: 30px;
          line-height: 30px;
          text-align: center;
        }
      }

      input {
        border: 1px solid rgba(231, 231, 231, 1);
        border-radius: 4px;
      }

      .cttitle {
        float: left;
        display: inline-block;
        width: 33%;
        padding-left: 20px;
        margin-bottom: 20px;
        color: #777777;
        div {
          padding-top: 10px;
        }
      }
      .operation-li {
        span {
          cursor: pointer;
          color: #0f75ff;
          display: inline-block;
          width: 60px !important;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    .bill-details {
      ul {
        &:first-child {
          li {
            height: 40px;
            line-height: 40px;
          }
        }

        li {
          span {
            padding-left: 0 !important;
            width: 100% !important;
          }
        }
      }
    }
    .iconfont {
      cursor: pointer;
    }
  }
  .dl-warn {
    .el-dialog {
      .el-dialog__header,
      .el-dialog__body {
        border: none;
      }
      .el-dialog__footer {
        padding-top: 20px;
        .el-button {
          width: 100px;
          height: 30px;
          line-height: 0px;
          &:first-child {
            background-color: #a0a0a0;
            color: #fff;
            border-color: #a0a0a0;
          }
          background-color: #3577f6;
          border-color: #3577f6;
        }
      }
    }
    .dl-content {
      text-align: center;
      img {
        width: 60px;
        height: 60px;
        margin-bottom: 10px;
      }
      p {
        margin-bottom: 10px;
      }
    }
  }
}
.main-content {
  position: relative;
}
.contracts-info .wrap {
  .drawer-head {
    border-bottom: 1px solid #ddd;
  }
}
.conDetail {
  .el-form-item {
    margin-right: 0 !important;
  }
  .view-btn {
    color: #3575f6;
    cursor: pointer;
    > div {
      display: inline-block;
      color: #262626;
    }
    // &:hover {
    //   text-decoration: underline;
    // }
  }
  .el-table__header {
    border: none;
  }
  .el-form-item__content {
    > div {
      > div {
        border: none !important;
      }
    }
  }
  .el-table thead {
    font-weight: normal;
    color: #777777 !important;
    font-size: 14px;
  }
  .el-table td,
  .el-table th.is-leaf {
    border: none;
  }
  .el-table::before {
    background-color: #fff;
  }
  .el-table th > .cell {
    font-weight: 400;
  }
}
.btn-wrap {
  position: relative;
  .v-details-btn {
    position: absolute;
    display: inline-block;
    width: 50px;
    height: 24px;
    line-height: 22px;
    text-align: center;
    color: #0f75ff;
    border: 1px solid rgba(15, 117, 255, 1);
    border-radius: 4px;
    right: 20px;
    top: 8px;
    font-size: 12px;
    font-weight: normal;
    cursor: pointer;
    &:hover {
      background: #0f75ff;
      color: #fff;
    }
  }
  .aliUpload-span {
    position: absolute;
    right: 20px;
    top: 5px;
    font-weight: 400;
    cursor: pointer;
    input {
      font-size: 0;
    }
  }
  .remark {
    position: absolute;
    right: 20px;
    top: 8px;
    width: 60px;
    height: 24px;
    line-height: 22px;
    text-align: center;
    color: #0f75ff;
    border: 1px solid rgba(15, 117, 255, 1);
    border-radius: 4px;
    font-weight: 400;
    font-size: 12px;
    cursor: pointer;
    i {
      font-size: 12px;
      margin-right: 4px;
    }
  }
}
.enclosureDialog {
  .el-dialog__footer {
    padding: 8px 20px 8px;
  }
  .el-dialog__header {
    padding: 16px 20px 16px 20px;
  }
}
.remarks-table {
  .cell {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap !important;
  }
}
</style>
