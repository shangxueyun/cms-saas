<template>
  <div class="contract-approval contractApproval">
    <div class="dl-head">
      <span class="step"
            :class="{stepActive: newlystep1,  stepActivePast: newlystep2||newlystep3||newlystep4}"><span style="font-size: 20px;">1</span>. 审批流程</span>
      <span class="step"
            :class="{stepActive: newlystep2,  stepActivePast: newlystep3||newlystep4}"><span style="font-size: 20px;">2</span>. 基本信息</span>
      <span class="step"
            :class="{stepActive: newlystep3,  stepActivePast: newlystep4}"><span style="font-size: 20px;">3</span>. 费用条款</span>
      <span class="step"
            :class="{stepActive: newlystep4}"><span style="font-size: 20px;">4</span>. 其他资料</span>
      <el-button v-if="NunOnRent != 2"
                 @click="followDetails = true"
                 class="follow"
                 size="small">
        查看跟进记录
      </el-button>
    </div>
    <div class="dl-content clearfix">
      <div class=""
           v-show="newlystep1">
        <div class="menuBar">
          <span v-for="(item,index) in historyOrNowTab"
                :key="index"
                :class="{active:index===historyOrNowTabIndex}"
                @click="historyOrNowTabChange(index)"
                v-show="isShowTab(item,index)">{{item.label}}<i v-if="item.value && item.value>0">({{item.value}})</i></span>
        </div>
        <div class="flowChart"
             style="min-height:500px">
          <div class="dingflow-design">
            <div class="ie-polyfill-container">
              <div class="box-scale"
                   :id="'box-scale' + idx"
                   v-for="(itm,idx) in detailsDataList"
                   :key="idx">
                <div class="contractNum">审批流程名称：{{processDefineName}}</div>
                <div class="contractNum"
                     style="top:40px">审批标题/品牌：{{brandTitle}}</div>
                <div class="contractNum"
                     style="top:60px">{{contractNo?'合同编号':'审批流程名称'}}：{{contractNo?contractNo:processDefineName}}</div>
                <div class="number"
                     style="top:80px">审批编号：{{itm.processTaskVersion}}</div>
                <div class="download"
                     style="top:110px" @click="domtoimageDownload(idx)" v-if="!downloading">下载审批</div>
                <span class="statusSeal"
                      :class="{'approvalAgreed':itm.approvalResult==='AGREED','approvalReject':itm.approvalResult==='REJECT','approvalclose':itm.approvalResult==='CLOSE','approvalWithdraw':itm.approvalResult==='WITHDRAW'}"></span>
                <div v-for="(item, index) in itm.processFlowNowVMS"
                     :key="index">
                  <div class="node-wrap"
                       v-if="item.type === 'START' || item.type === 'APPROVAL' || item.type === 'CC'">
                    <div class="node-wrap-box"
                         :class="{'node_sid-startevent start-node': item.type === 'START'}">
                      <div>
                        <div class="title"
                             :class="[item.type === 'START' ? 'approver-start-title': item.type === 'APPROVAL' ? 'approver-title' : 'notifier-title']">
                          <span>
                            <i class="icon"
                               :class="[item.type === 'START' ? 'approvalStartIcon': item.type === 'APPROVAL' ? 'approvalIcon' : 'notifierIcon']"></i>
                            <span class="">{{item.name}}</span>
                          </span>
                          <span>
                            <i v-if="(item.type !== 'START' || item.processApproval === 'WITHDRAW') && item.type !== 'CC'"
                               :class="{
                              'agree':item.processApproval==='AGREED',
                              'reject':item.processApproval==='REJECT' || item.processApproval === 'WITHDRAW',
                              'close':item.processApproval==='CLOSE',
                              'auto':item.processApproval==='AUTO',
                              'wait':!item.processApproval}">{{formatStatus(item.processApproval)}}</i>
                          </span>
                        </div>
                        <div class="content">
                          <div>
                            <!-- <span>{{item.userName}}({{item.jobPosition[0]}})</span> -->
                            <span :title="formatUserJobPos(item)">{{formatUserJobPos(item)}}</span>
                            <i v-if="item.type !== 'CC'">{{formatExecuteTime(item.executeTime)}}</i>
                          </div>
                          <div>
                            <!-- <span :title="item.memo"
                                  v-if="item.type !== 'START'">意见：{{formatMemo(item.memo)}}</span> -->
                            <span :title="item.memo"
                                  v-if="item.type !== 'START' || item.processApproval === 'WITHDRAW'">
                              <span v-if="item.processApproval === 'WITHDRAW'">撤回原因：</span>
                              <span v-else>意见：</span>
                              {{formatMemo(item.memo)}}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="add-node-btn-box">
                      <div class="add-node-btn"></div>
                    </div>
                  </div>
                  <branchWrap v-if="item.childNode && (item.type === 'PARALLEL_START_AND'||item.type === 'PARALLEL_START_OR')"
                              :branchData="item" />
                </div>
                <div class="end-node">
                  <div class="end-node-circle"></div>
                  <div class="end-node-text">流程结束</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class=""
           v-show="newlystep2">
        <div class="dl-content clearfix">
          <el-form>
            <div class="step1 stepNew2">
              <!--<div class="dc-left float-left"
                   style="text-align: left;height: 580px;">
                <div class="dr-head">房源信息</div>
                <div class="basic-select">
                  <div class="clearfix selectInput"
                       style="border: none">
                    <img :src="contractInfo.projectManagement.previewImage" />
                    <span>{{contractInfo.projectManagement.projectName}}</span>
                  </div>
                  <div v-for="(item,index) in contractInfo.rooms"
                       :key="index">
                    <div class="bd-number">{{item.building.buildingName}}</div>
                    <div class="layer">
                      <div>
                        <span v-if="item.floor">{{item.floor.name}}层</span>
                        <span>{{item.shopNumber}}室</span>
                        <span>{{item.buildingArea}}m²</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>-->
              <div class="dc-right float-right">
                <div class="dr-head">项目选择</div>
                <div style="padding-right:32px;box-sizing: border-box;">
                  <el-form-item class="project-box"
                                :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">所属项目<i class="required">*</i></div>
                    <div v-if="contractInfo.projectManagement"
                         class="project-item">
                      <img :src="contractInfo.projectManagement.previewImage" />
                      <span>{{contractInfo.projectManagement.referred}}</span>
                    </div>
                  </el-form-item>
                </div>
              </div>

              <div class="dc-right float-right"
                   style="margin-top:20px">
                <div class="dr-head">客户信息</div>
                <el-form-item :label-width="formLabelWidth">
                  <div class="cttitle">客户名称</div>
                  <span>{{contractInfo.tenant.teantName}}</span>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">签订人</div>
                  <span>{{contractInfo.signer}}</span>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth">
                  <div class="cttitle">签订人联系方式</div>
                  <span>{{contractInfo.signerPhone}}</span>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">用途</div>
                  <span>{{contractInfo.tenant.tenantUseDescription}}</span>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">行业</div>
                  <span>{{contractInfo.tenant.industry}}</span>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">品牌</div>
                  <span>{{contractInfo.tenant.referred}}</span>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">法人</div>
                  <span>{{contractInfo.tenant.operName}}</span>
                </el-form-item>
              </div>
              <div class="dc-right float-right"
                   style="margin-top:20px">
                <div class="dr-head">房源信息</div>
                <div style="padding-right:32px;box-sizing: border-box;">
                  <el-form-item class="project-box"
                                :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">已选中房源</div>
                    <div style="border:0;height:auto"
                         class="project-item">
                      <div style="height:auto"
                           class="project-item rooms-table">
                        <el-table :data="contractInfo.rooms"
                                  style="width: 100%">
                          <el-table-column prop="building.buildingName"
                                           label="楼宇"
                                           align="center"></el-table-column>
                          <el-table-column prop="floor.name"
                                           label="楼层"
                                           align="center"></el-table-column>
                          <el-table-column prop="shopNumber"
                                           label="房源号"
                                           align="center"></el-table-column>
                          <el-table-column prop="buildingArea"
                                           label="建筑面积/㎡"
                                           align="center"></el-table-column>
                          <el-table-column prop="useArea"
                                           label="使用面积/㎡"
                                           align="center"></el-table-column>
                          <el-table-column label="操作"
                                           align="center">
                            <template slot-scope="scope">
                              <span @click="handleEdit(scope)"
                                    class="hadle_href">查看平面图</span>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth">
                    <div class="cttitle">总建筑面积</div>
                    <span v-if="contractInfo.area">{{contractInfo.area}}㎡</span>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth">
                    <div class="cttitle">总使用面积</div>
                    <span v-if="contractInfo.useArea">{{contractInfo.useArea}}㎡</span>
                    <span else></span>
                  </el-form-item>
                </div>
              </div>
              <div class="dc-right float-right"
                   style="margin-top:20px;margin-bottom:90px">
                <div class="dr-head">合同信息</div>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">合同签订时间</div>
                  <span>{{contractInfo.signtDate}}</span>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">合同开始时间</div>
                  <span>{{contractInfo.startDate}}</span>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">合同结束时间</div>
                  <span>{{contractInfo.endDate}}</span>
                </el-form-item>
                <!--<el-form-item :label-width="formLabelWidth">
                  <div class="cttitle">租赁面积/m²</div>
                  <span>{{contractInfo.area | toLocaleFixed}}</span>
                </el-form-item>-->
                <!--<el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px">
                  <div class="cttitle">滞纳金比例</div>
                  <span>{{contractInfo.proportion}}</span>
                </el-form-item>-->
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">商铺名称</div>
                  <span>{{contractInfo.shopName}}</span>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">合同编号</div>
                  <span>{{contractInfo.contractNo}}</span>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth">
                  <div class="cttitle">租赁方式</div>
                  <span>{{formatRentalMethod(contractInfo.rentalMethod)}}</span>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth">
                  <div class="cttitle">交付乙方装修时间</div>
                  <span>{{contractInfo.toBTrimTime}}</span>
                </el-form-item>
                <!-- <el-form-item :label-width="formLabelWidth">
                  <div class="cttitle">合同标签</div>
                  <span>{{addData.latestPaymentDate}}</span>
                </el-form-item> -->
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <div class="stepNew3"
           v-show="newlystep3">
        <div class="dl-content clearfix">
          <div class="step1">
            <div class="dl-head info_tab">
              <ul class="nav">
                <li @click="changeNav(index)"
                    v-for="(item, index) in navList"
                    :key="index"
                    :class="item.value ? 'select_active' : ''">{{item.label}}</li>
              </ul>
            </div>
            <div v-if="navList[0].label === '租金条款' && navList[0].value">
              <div class="dc-right float-right"
                   style="min-height: 110px;width: 100%;margin-bottom:20px;">
                <div class="dr-head">计算方式</div>
                <div style="padding-bottom:20px;"
                     class="leaseTerms">
                  <ul>
                    <li>
                      <p style="line-height: 25px;">计租面积类型<i class="required">*</i></p>
                      <p style="line-height: 25px;">{{areaType(contractInfo.areaTypeRent)}}</p>
                    </li>
                    <li>
                      <p style="line-height: 25px;">计租面积/m²<i class="required">*</i></p>
                      <p v-if="contractInfo.areaTypeRent === 'BUILDING'"
                         style="line-height: 25px;">{{contractInfo.area}}㎡</p>
                      <p v-if="contractInfo.areaTypeRent === 'USING'"
                         style="line-height: 25px;">{{contractInfo.useArea}}㎡</p>
                      <p v-if="!contractInfo.areaTypeRent"
                         style="line-height: 25px;"></p>
                    </li>
                    <li>
                      <p style="line-height: 25px;">计算进位方式<i class="required">*</i></p>
                      <p style="line-height: 25px;">{{carryMode(contractInfo.carryModeRent)}}</p>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="dc-right float-right lease-terms"
                   style="min-height: 260px;width: 100%;margin-bottom:20px;">
                <div class="dr-head">租赁条款</div>
                <div v-for="(item,index) in contractInfo.rentClauses"
                     :key="index">
                  <div v-if="item.termType === 'RENT'"
                       class="leaseTerms">
                    <ul style="display: flex;flex-wrap: wrap;">
                      <li>
                        <p style="line-height: 25px;">开始时间<i class="required">*</i></p>
                        <p style="line-height: 25px;">{{item.startDate}}</p>
                      </li>
                      <li>
                        <p style="line-height: 25px;">结束时间<i class="required">*</i></p>
                        <p style="line-height: 25px;">{{item.endDate}}</p>
                      </li>
                      <li>
                        <p style="line-height: 25px;">租金保证金金额/元<i class="required">*</i></p>
                        <p style="line-height: 25px;">{{item.deposit}}</p>
                      </li>
                      <li v-if="contractInfo.rentalMethod === 'RENT'">
                        <p style="line-height: 25px;">初始单价<i class="required">*</i></p>
                        <p style="line-height: 25px;">{{item.price}}{{formatPriceUnit(item.priceUnit)}}</p>
                      </li>
                      <li v-if="contractInfo.rentalMethod !== 'RENT'"
                          class="cttitle">
                        <p style="line-height: 25px;">租金抽成比例<i class="required">*</i></p>
                        <p style="line-height: 25px;">{{item.point}}%/月</p>
                      </li>
                      <li v-if="contractInfo.rentalMethod === 'GUARANTEEPOINT'"
                          class="cttitle">
                        <p style="line-height: 25px;">保底价<i class="required">*</i></p>
                        <p style="line-height: 25px;">{{item.price}}{{formatPriceUnit(item.priceUnit)}}</p>
                      </li>
                      <li v-if="contractInfo.rentalMethod !== 'POINTS'">
                        <p style="line-height: 25px;">计费类型<i class="required">*</i></p>
                        <p style="line-height: 25px;">{{formatBillingType(item.billingType)}}</p>
                      </li>
                      <li v-if="contractInfo.rentalMethod !== 'POINTS'">
                        <p style="line-height: 25px;">年天数<i class="required">*</i></p>
                        <p style="line-height: 25px;">{{item.yearDay}}</p>
                      </li>
                      <li>
                        <p style="line-height: 25px;">付款周期/月<i class="required">*</i></p>
                        <p style="line-height: 25px;">{{item.month}}</p>
                      </li>
                      <li>
                        <p style="line-height: 25px;">账单划分方式<i class="required">*</i></p>
                        <p style="line-height: 25px;">{{formatbillDivision(item.billDivision)}}</p>
                      </li>
                      <li>
                        <p style="line-height: 25px;">首个免租期是否包含在租金账单内<i class="required">*</i></p>
                        <p style="line-height: 25px;">{{formatOfferReocrd(item.onBillContainFirstOfferReocrd)}}</p>
                      </li>
                      <li v-if="contractInfo.rentalMethod === 'RENT'"
                          style="width: 32%">
                        <p style="line-height: 25px;">账单应收日期<i class="required">*</i></p>
                        <p style="line-height: 25px;"
                           v-if="item.dayType === 'TOP'">提前{{item.dayNumber}}天</p>
                        <p style="line-height: 25px;"
                           v-else>固定{{item.dayNumber}}日</p>
                      </li>
                      <li v-if="contractInfo.rentalMethod !== 'RENT'"
                          class="cttitle">
                        <p style="line-height: 25px;">账单应收日期，次月<i class="required">*</i></p>
                        <p style="line-height: 25px;">{{item.dayNumber}}日</p>
                      </li>
                      <li style="width: 32%">
                        <p style="line-height: 25px;">滞纳金比例</p>
                        <p style="line-height: 25px;">{{item.lateFeeRate}}
                          <span v-if="item.lateFeeRate">%/天</span>
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="dc-right float-right lease-terms"
                   style="width: 100%;margin-bottom:20px;">
                <div class="dr-head">租金递增</div>
                <div v-for="(item,index) in contractInfo.rentClauses"
                     :key="index">
                  <div v-if="item.termType === 'RENT'">
                    <div v-for="(subItem,subIndex) in item.incrementRates"
                         :key="subIndex">
                      <div v-if="subItem.termType === 'RENT' ">
                        <ul class="contractUl">
                          <li>
                            <p style="line-height: 25px;">递增开始时间<i class="required">*</i></p>
                            <p style="line-height: 25px;">{{subItem.startDate}}</p>
                          </li>
                          <li>
                            <p style="line-height: 25px;">递增结束时间<i class="required">*</i></p>
                            <p style="line-height: 25px;">{{subItem.endDate}}</p>
                          </li>
                          <li v-if="contractInfo.rentalMethod === 'RENT'">
                            <p style="line-height: 25px;">租金单价递增<i class="required">*</i></p>
                            <p style="line-height: 25px;">{{subItem.number}}{{formatIncrementUnit(subItem.incrementUnit)}}</p>
                          </li>
                          <li v-if="contractInfo.rentalMethod !== 'RENT'">租金抽成比例<i class="required">*</i>
                            <p>{{subItem.point}}%/月</p>
                          </li>
                          <li v-if="contractInfo.rentalMethod === 'GUARANTEEPOINT'">保底价<i class="required">*</i>
                            <p>{{subItem.number}}{{formatPriceUnit(item.priceUnit)}}</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="dc-right float-right lease-terms"
                   style="width: 100% ;margin-bottom:20px;">
                <div class="dr-head">租金优惠</div>
                <div v-for="(item,index) in contractInfo.rentClauses"
                     :key="index">
                  <div v-if="item.termType === 'RENT'">
                    <div v-for="(subItem,subIndex) in item.offerRecords"
                         :key="subIndex">
                      <div v-if="subItem.termType ==='RENT'">
                        <ul class="contractUl">
                          <li>
                            <p style="line-height: 25px;">优惠类型<i class="required">*</i></p>
                            <p style="line-height: 25px;">{{formatOfferType(subItem.offerType)}}</p>
                          </li>
                          <li>
                            <p style="line-height: 25px;">优惠开始时间<i class="required">*</i></p>
                            <p style="line-height: 25px;">{{subItem.yhStartDate}}</p>
                          </li>
                          <li>
                            <p style="line-height: 25px;">优惠结束时间<i class="required">*</i></p>
                            <p style="line-height: 25px;">{{subItem.yhEndDate}}</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="dc-right float-right lease-terms"
                   style="width: 100% ;margin-bottom:20px;">
                <div class="dr-head">装修保证金</div>
                <ul v-if="contractInfo.zxStartDate || contractInfo.zxEndtDate || contractInfo.zxDeposit"
                    class="contractUl">
                  <li>
                    <p style="line-height: 25px;">开始时间<i class="required">*</i></p>
                    <p style="line-height: 25px;">{{contractInfo.zxStartDate}}</p>
                  </li>
                  <li>
                    <p style="line-height: 25px;">结束时间<i class="required">*</i></p>
                    <p style="line-height: 25px;">{{contractInfo.zxEndtDate}}</p>
                  </li>
                  <li>
                    <p style="line-height: 25px;">装修保证金金额<i class="required">*</i></p>
                    <p style="line-height: 25px;">{{contractInfo.zxDeposit}}</p>
                  </li>
                </ul>
              </div>
            </div>
            <div v-if="(navList.length > 1 && navList[1].value) || navList[0].label === '物业费条款' && navList[0].value">
              <div class="dc-right float-right"
                   style="min-height: 110px;width: 100%;margin-bottom:20px;">
                <div class="dr-head">计算方式</div>
                <div style="padding-bottom:20px;"
                     class="leaseTerms">
                  <ul>
                    <li>
                      <p style="line-height: 25px;">计租面积类型<i class="required">*</i></p>
                      <p style="line-height: 25px;">{{areaType(contractInfo.areaTypeProperty)}}</p>
                    </li>
                    <li>
                      <p style="line-height: 25px;">计租面积/m²<i class="required">*</i></p>
                      <p v-if="contractInfo.areaTypeProperty === 'BUILDING'"
                         style="line-height: 25px;">{{contractInfo.area}}㎡</p>
                      <p v-if="contractInfo.areaTypeProperty === 'USING'"
                         style="line-height: 25px;">{{contractInfo.useArea}}㎡</p>
                      <p v-if="!contractInfo.areaTypeProperty"
                         style="line-height: 25px;"></p>
                    </li>
                    <li>
                      <p style="line-height: 25px;">计算进位方式<i class="required">*</i></p>
                      <p style="line-height: 25px;">{{carryMode(contractInfo.carryModeProperty)}}</p>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="dc-right float-right lease-terms"
                   style="min-height: 280px;width: 100% ;margin-bottom:20px;">
                <div class="dr-head">物业费条款</div>
                <div v-for="(item,index) in contractInfo.rentClauses"
                     :key="index">
                  <div v-if="item.termType === 'PROPERTY'">
                    <ul style="margin-bottom:0;"
                        class="contractUl margin_bottom">
                      <li>
                        <p style="line-height: 25px;">开始时间<i class="required">*</i></p>
                        <p style="line-height: 25px;">{{item.startDate}}</p>
                      </li>
                      <li>
                        <p style="line-height: 25px;">结束时间<i class="required">*</i></p>
                        <p style="line-height: 25px;">{{item.endDate}}</p>
                      </li>
                      <li>
                        <p style="line-height: 25px;">物业费保证金金额/元<i class="required">*</i></p>
                        <p style="line-height: 25px;">{{item.deposit}}</p>
                      </li>
                      <li>
                        <p style="line-height: 25px;">物业费单价<i class="required">*</i></p>
                        <p style="line-height: 25px;">{{item.price}}{{formatPriceUnit(item.priceUnit)}}</p>
                      </li>
                      <li>
                        <p style="line-height: 25px;">计费类型<i class="required">*</i></p>
                        <p style="line-height: 25px;">{{formatBillingType(item.billingType)}}</p>

                      </li>
                      <li>
                        <p style="line-height: 25px;">年天数<i class="required">*</i></p>
                        <p style="line-height: 25px;">{{item.yearDay}}</p>
                      </li>
                      <li>
                        <p style="line-height: 25px;">付款周期/月<i class="required">*</i></p>
                        <p style="line-height: 25px;">{{item.month}}</p>
                      </li>
                      <li>
                        <p style="line-height: 25px;">账单划分方式<i class="required">*</i></p>
                        <p style="line-height: 25px;">{{formatbillDivision(item.billDivision)}}</p>
                      </li>
                      <li>
                        <p style="line-height: 25px;">物业费的账单日期是否同步租金账单<i class="required">*</i></p>
                        <p style="line-height: 25px;">{{formatonRentBill(item.onRentBill)}}</p>
                      </li>
                      <li>
                        <p style="line-height: 25px;">账单应收日期<i class="required">*</i></p>
                        <p style="line-height: 25px;"
                           v-if="item.dayType === 'TOP'">提前{{item.dayNumber}}天</p>
                        <p style="line-height: 25px;"
                           v-else>固定{{item.dayNumber}}日</p>
                      </li>
                      <li style="vertical-align: top">
                        <p style="line-height: 25px;">滞纳金比例</p>
                        <p style="line-height: 25px;">{{item.lateFeeRate}}<span v-if="item.lateFeeRate">%/天</span></p>
                      </li>
                    </ul>
                    <!-- <ul class="contractUl">
                      
                    </ul>
                    <ul class="contractUl">
                      
                    </ul>
                    <ul class="contractUl">
                      

                    </ul> -->
                  </div>
                </div>
              </div>
              <div class="dc-right float-right lease-terms"
                   style="width: 100% ;margin-bottom:20px;">
                <div class="dr-head">物业费递增</div>
                <div v-for="(item,index) in contractInfo.rentClauses"
                     :key="index">
                  <div v-if="item.termType === 'PROPERTY'">
                    <div v-for="(subItem,subIndex) in item.incrementRates"
                         :key="subIndex">
                      <div v-if="subItem.termType === 'PROPERTY' ">
                        <ul class="contractUl">
                          <li>
                            <p style="line-height: 25px;">递增开始时间<i class="required">*</i></p>
                            <p style="line-height: 25px;">{{subItem.startDate}}</p>
                          </li>
                          <li>
                            <p style="line-height: 25px;">递增结束时间<i class="required">*</i></p>
                            <p style="line-height: 25px;">{{subItem.endDate}}</p>
                          </li>
                          <li>
                            <p style="line-height: 25px;">物业费单价递增<i class="required">*</i></p>
                            <p style="line-height: 25px;">{{subItem.number}}{{formatIncrementUnit(subItem.incrementUnit)}}</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="dc-right float-right lease-terms"
                   style="width: 100% ;margin-bottom:20px;">
                <div class="dr-head">物业费优惠</div>
                <div v-for="(item,index) in contractInfo.rentClauses"
                     :key="index">
                  <div v-if="item.termType === 'PROPERTY'">
                    <div v-for="(subItem,subIndex) in item.offerRecords"
                         :key="subIndex">
                      <div v-if="subItem.termType ==='PROPERTY'">
                        <ul class="contractUl">
                          <li>
                            <p style="line-height: 25px;">优惠类型<i class="required">*</i></p>
                            <p style="line-height: 25px;">{{formatOfferType(subItem.offerType)}}</p>
                          </li>
                          <li>
                            <p style="line-height: 25px;">优惠开始时间<i class="required">*</i></p>
                            <p style="line-height: 25px;">{{subItem.yhStartDate}}</p>
                          </li>
                          <li>
                            <p style="line-height: 25px;">优惠结束时间<i class="required">*</i></p>
                            <p style="line-height: 25px;">{{subItem.yhEndDate}}</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div class="dc-right float-right  rentBillDetails"
                 style="width: 100% ;margin-bottom:20px;margin-bottom:90px;">
              <div @click="changePannal"
                   class="dr-head"
                   style="margin-bottom: 0;cursor:pointer;">账单明细<span class="iconfont icon-bottom"
                      style="font-size: 12px;margin-left:5px"></span></div>
              <ul v-if="showPannal"
                  class=""
                  style="border-bottom: 2px solid #D9DCE2">
                <li>日期</li>
                <li>费用类型</li>
                <li>付款日</li>
                <li v-if="contractInfo.rentalMethod === 'RENT'">最终单价</li>
                <li v-if="contractInfo.rentalMethod === 'GUARANTEEPOINT'">保底租金(元)</li>
                <li v-if="contractInfo.rentalMethod !== 'RENT'">租金抽成比例</li>
                <li>最终金额(元)</li>
              </ul>
              <div v-if="showPannal">
                <ul v-for="(item,index) in billList"
                    :key="index">
                  <li>{{item.startDate}}～{{item.endDate}} </li>
                  <li>{{item.feeTypeName}}</li>
                  <li>{{item.finalPaymentDate}}</li>
                  <li v-if="contractInfo.rentalMethod === 'RENT'">{{item.finalPrice}}{{priceUnitFormat(item.priceUnit)}}</li>
                  <li v-if="contractInfo.rentalMethod === 'GUARANTEEPOINT'">{{item.bdAmount}}</li>
                  <li v-if="contractInfo.rentalMethod !== 'RENT'">
                    <span v-if="item.feeTypeName === '租金'">{{item.finalPrice}}%</span>
                    <span v-else>-</span>
                  </li>
                  <li v-if="contractInfo.rentalMethod === 'RENT'">{{item.amount}}</li>
                  <li v-if="contractInfo.rentalMethod === 'POINTS'">
                    <span v-if="item.feeTypeName === '租金'">营业额的{{item.finalPrice}}%</span>
                    <span v-else>{{item.amount}}</span>
                  </li>
                  <li v-if="contractInfo.rentalMethod === 'GUARANTEEPOINT'">
                    <span v-if="item.feeTypeName === '租金'">{{item.bdAmount}}或者营业额的{{item.finalPrice}}%</span>
                    <span v-else>{{item.amount}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class=""
           v-show="newlystep4">
        <div class="dl-content clearfix">
          <div class="step1">
            <div class="dc-right float-right"
                 style="height: 200px;width: 100%">
              <div class="dr-head">备注</div>
              <div class=""
                   v-for="(item,index) in contractInfo.remarks"
                   :key="index">
                <span style="padding:10px">{{item.content}}</span>
              </div>
            </div>
            <div class="dc-right float-right"
                 style="width: 100%;margin-top:20px">
              <div class="dr-head"
                   style="margin-bottom: 0">附件</div>
              <div class="enclosure">
                <div class="enclosure-head">
                  <span>文件名</span>
                  <span>操作</span>
                </div>
                <div class="enclosure-list">
                  <div class="el-item"
                       style="display: flex"
                       v-for="(item,index) in filterAnnexes"
                       :key="index">
                    <span>{{item.annexName}}</span>
                    <span style="display: flex;padding-left: 0">
                      <ailPreview :ailObj="item"
                                  :encrypt="true"
                                  :picturePreview="true" />
                      <aliDownLoad :item="item"
                                   :encrypt="true" />
                      <!-- <i @click="downloadFile(item, index)"
                         class="iconfont icon-xiazaidaoru"
                         style="margin-right: 10px;"></i> -->
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="dc-right float-right"
                 style="width: 100% ;margin-top: 20px"
                 v-if="newlystep4 && approvalOperation">
              <div class="dr-head"
                   style="margin-bottom: 0">审批意见<i style="color:red"> * </i></div>
              <div class="textArea"
                   style="background-color:#ffffff">
                <el-input type="textarea"
                          :rows="4"
                          placeholder="500字以内"
                          resize="none"
                          maxlength="500"
                          v-model="memo">
                </el-input>
              </div>
            </div>
            <div class="dc-right float-right"
                 style="width: 100% ;border:none;border: 1px solid #eee;"
                 v-if="showOnRent && withdraw && this.contractStatus !== 'START'">
              <div class="dr-head"
                   style="margin-bottom: 0">审批撤回原因</div>
              <div class="textArea"
                   style="background-color:#ffffff">
                <el-input type="textarea"
                          :rows="4"
                          placeholder="500字以内"
                          resize="none"
                          maxlength="500"
                          style="border: none"
                          v-model="withdrawMemo">
                </el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-footer"
         style="display: flex;justify-content: flex-end;">
      <div class="closing-btn"
           style="margin-right: 10px;"
           v-if="this.contractStatus === 'START' && !this.finshed">
        <el-button class="close-button"
                   @click="centerDialogVisible = true">关闭申请</el-button>
      </div>
      <el-button type="primary"
                 @click="previousStep"
                 class="close-button"
                 v-if="newlystep2 || newlystep3 || newlystep4">上一步</el-button>
      <el-button type="primary"
                 @click="newlystepNoe()"
                 class="defaultbtn dialog-confirmBtn"
                 v-if="newlystep1 || newlystep2 || newlystep3">下一步</el-button>
      <el-button type="primary"
                 class="defaultbtn dialog-confirmBtn reject-btn"
                 v-if="newlystep4 && approvalOperation"
                 @click="postTask('REJECT')">驳回</el-button>
      <el-button type="primary"
                 class="defaultbtn dialog-confirmBtn"
                 v-if="newlystep4 && approvalOperation"
                 @click="postTask('AGREED')">通过</el-button>
      <el-button type="primary"
                 class="defaultbtn dialog-confirmBtn"
                 v-if="showOnRent && withdraw && newlystep4 && this.contractStatus !== 'START'"
                 @click="withdrawTask('WITHDRAW')">撤回</el-button>
    </div>
    <el-dialog :visible.sync="centerDialogVisible"
               width="400px!important"
               class="dl-warn"
               center>
      <div class="dl-content">
        <img src="../../../../assets/warn.png" />
        <p style="font-size: 16px;color: #000">关闭申请</p>
        <p>关闭申请后，该审批流程结束</p>
      </div>
      <span slot="footer"
            class="warn-dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="postTask('CLOSE')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 跟进详情 -->
    <followDetails v-if="followDetails && NunOnRent != 2"
                   :details-data="followDetailsData"
                   :boolean-flag="followDetails"
                   :config-object="{
        title: '跟进记录'
      }"
                   @drawerClose="drawerClose" />
  </div>
</template>
<script>
import context from '@/service'
import branchWrap from './branchWrap.vue'
import axios from 'axios'
import ailPreview from '@/components/ailPreview.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import followDetails from '../components/followDetails.vue'
import domtoimage from 'dom-to-image'
export default {
  name: 'contractApproval',
  components: {
    branchWrap,
    aliDownLoad,
    ailPreview,
    followDetails
  },
  props: {
    detailsData: {

    },
    processInstanceInfo: {
      type: Object
    },
    approvalOperation: {
      type: Boolean
    },
    newlystep1: {
      type: Boolean
    },
    newlystep2: {
      type: Boolean
    },
    newlystep3: {
      type: Boolean
    },
    newlystep4: {
      type: Boolean
    },
    contractInfo: {
      type: Object
    },
    billList: {
      type: Array,
      default: () => []
    },
    contractStatus: {
      type: String
    },
    finshed: {
      type: Boolean
    },
    taskId: {
      type: Number
    },
    processDefineName: {

    },
    contractNo: {

    },
    onRent: {
      type: Number
    },
    processStatus: {
      type: String
    },
    rowId: {
      type: Number
    }
  },
  watch: {
    // contractInfo: {
    //   handler: function (newVal, oldVal) {
    //     let contract = this.contractInfo.id
    //     let time = this.detailsData[0].time
    //     console.log(contract, time)
    //   }
    // }
  },
  data () {
    return {
      filterAnnexes: [], // 只列出审批发起时存在的附件（后续在合同详情添加的附件不展示）
      centerDialogVisible: false,
      detailsDataList: [
        { approvalResult: '', processFlowNowVMS: [], processTaskVersion: '', time: '' }
      ],
      formLabelWidth: '',
      rejectDialog: false,
      memo: '', // 审批意见
      historyOrNowTab: [
        { label: '当前审批流程', value: '0' },
        { label: '历史审批流程', value: '2' }
      ],
      historyOrNowTabIndex: 0,
      showPannal: false,
      navList: [],
      withdraw: false,
      showOnRent: false,
      withdrawMemo: '',
      brandTitle: '',
      NunOnRent: 0,
      followDetails: false,
      followDetailsData: {},
      downloading: false
    }
  },
  created () {
    this.detailsDataList[0] = this.detailsData[0]
    this.historyOrNowTab[1].value = this.detailsData.length - 1
    if (this.contractInfo.rentClauses.length > 1) {
      this.navList = [{
        label: '租金条款',
        value: true
      }, {
        label: '物业费条款',
        value: false
      }]
    } else if (this.contractInfo.rentClauses.length === 1 && this.contractInfo.rentClauses[0].termType === 'RENT') {
      this.navList = [{
        label: '租金条款',
        value: true
      }]
    } else if (this.contractInfo.rentClauses.length === 1 && this.contractInfo.rentClauses[0].termType === 'PROPERTY') {
      this.navList = [{
        label: '物业费条款',
        value: true
      }]
    }
    this.brandTitle = this.$route.params.brandTitle
    this.showOnRent = this.onRent === 1
    this.withdraw = this.processStatus === 'RUNING'
    this.NunOnRent = this.$route.params.onRent
    this.followDetailsData = this.$route.params.row
    this.getFilterAnnexes()
  },
  methods: {
    async getFilterAnnexes () { // 只列出审批发起时存在的附件（后续在合同详情添加的附件不展示）
      let contractId = this.contractInfo.id
      let time = this.detailsData[0].time
      let result = await context.http.get(`cms/api/annexes/all?contractId=${contractId}&startTime=${time}`)
      this.filterAnnexes = result.data
      console.log(contractId, time)
    },
    async withdrawTask () {
      if (this.withdrawMemo === '') {
        this.$message({
          type: 'warning',
          message: '请填写审批撤回原因'
        })
        return
      }
      await context.http.put('/cms/api/process-instances/withdraw', { processInstanceId: this.rowId, memo: this.withdrawMemo })
      this.$message({
        type: 'success',
        message: '操作成功'
      })
      setTimeout(this.$router.push({ name: 'approvalCenter', params: { onRent: 2 } }), 800)
    },
    formatbillDivision (billDivision) {
      if (billDivision === 'NO') {
        return '首期开始，按付款周期划分'
      } else if (billDivision === 'QUARTER') {
        return '首期三个月，第三笔开始按季度划分'
      } else if (billDivision === 'QUARTER_TWO') {
        return '第二笔开始，按季度划分'
      }
    },
    areaType (val) {
      if (val) {
        return val === 'BUILDING' ? '建筑面积' : '使用面积'
      }
    },
    carryMode (val) {
      if (val) {
        return val === 'ROUNDING' ? '四舍五入' : '无条件进位'
      }
    },
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[inx].value = true
    },
    changePannal () {
      this.showPannal = !this.showPannal
    },
    isShowTab (item, index) { // 是否展示历史流程标签
      if (index === 1 && !item.value > 0) {
        return false
      }
      return true
    },
    formatUserJobPos (item) { // 员工岗位姓名
      if (item.type === 'CC') {
        return item.userName.length > 0 ? item.userName.join('、') : ''
      } else {
        // return `${item.userName[0] ? item.userName[0] : '--'}(${item.jobPosition[0] ? item.jobPosition[0] : '--'})`
        return `${item.userName.length > 0 ? item.userName.join('、') : '--'}(${item.jobPosition[0] ? item.jobPosition[0] : '--'})`
      }
    },
    formatExecuteTime (t) { // 流程节点时间
      return t ? t.slice(0, 16).replace('T', ' ') : '-'
    },
    historyOrNowTabChange (index) {
      this.historyOrNowTabIndex = index
      this.detailsDataList = []
      if (index === 0) {
        this.detailsDataList[0] = this.detailsData[0]
      } else {
        if (this.detailsData.length > 1) {
          this.detailsDataList = this.curtailArr(this.detailsData)
        } else {
          this.detailsDataList = []
        }
      }
    },
    curtailArr (arr) { // 删除数组第一项，不改变原数组的情况下  生成新数组
      let m = arr.concat()
      m.shift()
      return m
    },
    formatMemo (memo) {
      if (!memo || memo === '') {
        return '无'
      } else {
        return memo
      }
    },
    formatStatus (s) {
      switch (s) {
        case 'REJECT':
          return '已驳回'
        case 'AGREED':
          return '已通过'
        case 'CLOSE':
          return '申请关闭'
        case 'AUTO':
          return '自动处理'
        case 'WITHDRAW':
          return '已撤回'
        case null:
          return '等待审核'
      }
    },
    previousStep () {
      if (this.newlystep2) {
        this.$emit('changeStepsStaus', { newlystep1: true, newlystep2: false, newlystep3: false, newlystep4: false })
      } else if (this.newlystep3) {
        this.$emit('changeStepsStaus', { newlystep1: false, newlystep2: true, newlystep3: false, newlystep4: false })
      } else if (this.newlystep4) {
        this.$emit('changeStepsStaus', { newlystep1: false, newlystep2: false, newlystep3: true, newlystep4: false })
      }
    },
    newlystepNoe () {
      if (this.contractStatus === 'START' && !this.finshed) {
        localStorage.contractStatus = 'approvalReject'
        this.$router.push({ path: '/home/contractsList', query: { contractId: this.contractInfo.id, taskId: this.taskId, type: 'contractSign' } })
      }
      if (this.newlystep1) {
        this.$emit('changeStepsStaus', { newlystep1: false, newlystep2: true, newlystep3: false, newlystep4: false })
      } else if (this.newlystep2) {
        this.$emit('changeStepsStaus', { newlystep1: false, newlystep2: false, newlystep3: true, newlystep4: false })
      } else if (this.newlystep3) {
        this.$emit('changeStepsStaus', { newlystep1: false, newlystep2: false, newlystep3: false, newlystep4: true })
      }
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
    async postTask (approvalResult) {
      if (this.memo === '' && approvalResult === 'REJECT') {
        this.$message({
          type: 'warning',
          message: '请填写审批意见'
        })
        return
      }
      await context.http.put('/cms/api/process-task', { taskId: this.taskId, taskResult: approvalResult, memo: this.memo })
      this.$message({
        type: 'success',
        message: '操作成功'
      })
      setTimeout(this.$router.push({ name: 'approvalCenter' }), 800)
    },
    downloadFile (item) {
      axios({ method: 'GET', url: '/ywm/api/annex/download', params: { annexURL: item.annexURL, annexName: item.annexName }, responseType: 'blob' }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', item.annexName)
        document.body.appendChild(link)
        link.click()
      })
    },
    handleEdit (scope) {
      let obj = Object.assign(this.$route.params, { projectManagementId: scope.row.projectManagement.id, buildingName: scope.row.building.id, floorName: scope.row.floor.name }, { newlystep2: this.newlystep2 })
      this.$router.push({ name: 'industryCAD2', params: { ...obj } })
    },
    domtoimageDownload (idx) {
      const _this = this
      this.downloading = true
      this.$nextTick(() => {
        domtoimage.toJpeg(document.getElementById('box-scale' + idx), { quality: 0.95, bgcolor: '#f5f5f7' }).then(function (dataUrl) {
          var link = document.createElement('a')
          link.download = _this.processDefineName
          link.href = dataUrl
          link.click()
          _this.downloading = false
        })
      })
    },
    formatFeeType (feeType) {
      if (feeType === 'RENT') {
        return '租金'
      } else if (feeType === 'RENT_DEPOSIT') {
        return '租金保证金'
      } else if (feeType === 'PROPERTY') {
        return '物业费'
      } else if (feeType === 'PROPERTY_DEPOSIT') {
        return '物业费保证金'
      } else if (feeType === 'INTENTION') {
        return '意向金'
      } else if (feeType === 'F_INTENTION') {
        return '返还意向金'
      } else if (feeType === 'DECORATION') {
        return '装修保证金'
      } else if (feeType === 'F_DECORATION') {
        return '返还装修保证金'
      } else if (feeType === 'WITHDRAWAL') {
        return '退租结算'
      } else if (feeType === 'RELEASE') {
        return '合同解除结算'
      }
    },
    formatPriceUnit (priceUnit) {
      if (priceUnit === 'M2DAYS') {
        return '元/㎡天'
      } else if (priceUnit === 'M2MONTH') {
        return '元/㎡月'
      } else if (priceUnit === 'DAY') {
        return '元/天'
      } else if (priceUnit === 'MONTH') {
        return '元/月'
      } else if (priceUnit === 'YEAR') {
        return '元/年'
      }
    },
    formatTermType (termType) {
      if (termType === 'RENT') {
        return '租金'
      } else if (termType === 'PROPERTY') {
        return '物业费'
      }
    },
    formatRentalMethod (val) {
      return val === 'RENT' ? '固定租金' : val === 'POINTS' ? '扣点' : '保底扣点'
    },
    formatBillingType (BillingType) {
      if (BillingType === 'MONTH') {
        return '按月计费'
      } else if (BillingType === 'DAY') {
        return '按天计费'
      } else {
        return '未知'
      }
    },
    formatApprovalResult (result) {
      if (result === 'AGREED') {
        return '通过'
      } else if (result === 'REJECT') {
        return '驳回'
      } else if (result === 'CLOSE') {
        return '关闭'
      } else if (result === 'REPOST') {
        return '再次提交'
      } else {
        return '审批中'
      }
    },
    formatIncrementUnit (incrementUnit) {
      if (incrementUnit === 'P') {
        return '%'
      } else if (incrementUnit === 'Y') {
        return '元'
      } else {
        return ''
      }
    },
    formatOfferType (offerType) {
      if (offerType === 'RENT') {
        return '免租期'
      } else if (offerType === 'DECORATION') {
        return '装修期'
      } else if (offerType === 'PROPERTY') {
        return '物业免租期'
      } else {
        return ''
      }
    },
    formatOfferReocrd (val) {
      return val === true ? '包括' : '不包括'
    },
    formatonRentBill (val) {
      return val === false ? '不同步' : '同步'
    },
    closeApprovalDialog () {
      this.$emit('approvalDialogClose')
    },
    trimStr (str) { return str.replace(/(^\s*)|(\s*$)/g, '') },
    drawerClose () {
      this.followDetails = false
    }
  }

}
</script>
<style lang="scss" >
@import "../../../../style/aflow";
.contract-approval {
  .hadle_href {
    color: #3575f6 !important;
    text-decoration: underline;
    cursor: pointer;
  }
  .el-dialog {
    width: 1000px !important;
    margin-top: 3vh !important;
  }
  .dl-head {
    display: flex;
    justify-content: space-start;
    margin: 20px 0;
    height: 70px;
    align-items: center;
    background-color: #ffffff;
    padding-left: 15px;
    box-shadow: 1px 1px 7px #eee;
    position: relative;
  }
  .step {
    display: inline-block;
    width: 200px;
    height: 40px;
    line-height: 40px;
    padding-left: 14px;
    font-size: 16px;
    background-color: #f9f9f9;
    color: #777;
    border-radius: 6px;
    margin-right: 43px;
    &:last-child {
      margin-right: 0;
    }
  }
  .follow {
    position: absolute;
    top: 26%;
    right: 18px;
  }
  .stepActive {
    color: #fff;
    background-color: #3175d2;
  }
  .stepActivePast {
    color: #fff;
    background-color: #789ed2;
  }
  .drawer-content {
    margin-top: 10px;
  }
  .el-textarea__inner {
    height: 100px;
  }
  .checkAll {
    font-size: 16px;
    .el-checkbox__label {
      font-size: 16px;
    }
  }
  .cttitle {
    margin-bottom: 10px;
  }
  .el-select {
    width: 100%;
  }
  .el-form-item__content {
    font-size: 12px;
    .el-cascader {
      width: 100%;
    }
    span {
      color: #666;
    }
  }
  .reject-btn {
    background-color: #e87477 !important;
    border: #e87477 !important;
    &:hover {
      background-color: #e87477 !important;
      border: #e87477 !important;
    }
  }
  .dl-content {
    width: 100%;
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
            background: url(../../../../assets/upload.png) no-repeat;
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
      width: 20%;
      text-align: center;
      .selectInput {
        padding: 0 20px;
        img {
          width: 60px;
          height: 30px;
        }
        span {
          position: relative;
          top: -10px;
          left: 10px;
        }
      }
    }
    .dc-right {
      // width: 80%;
      // border: 1px solid #e7e7e7;
      // margin-top: 20px;
      .dr-head {
        background-color: #fafafa;
        height: 40px;
        line-height: 40px;
        padding-left: 12px;
        font-size: 14px;
        margin-bottom: 24px;
      }
      .el-form-item {
        width: 30%;
        margin-left: 16px;
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
    }
    .step2 {
      .dc-right {
        border: none;
        margin-top: 0;
      }
    }
    .approval-process {
      font-size: 12px;
      width: 928px;
      // height: 100px;
      margin-top: 20px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(231, 231, 231, 1);
      padding: 20px 0 0 20px;
      div {
        display: inline-block;
      }
      .divider-line {
        width: 1px;
        height: 30px;
        background: rgba(212, 212, 212, 1);
        margin-left: 40px;
      }
      .under-line {
        width: 100px;
        height: 1px;
        background: rgba(212, 212, 212, 1);
        margin-left: 20px;
        position: relative;
        top: 0;
      }
      .process-wrap {
      }
      .process-content {
        margin-left: 40px;
        vertical-align: top;
        width: 54%;
        overflow: hidden;
        div {
          p {
            &:first-child {
              font-size: 14px;
              color: #333;
            }
          }
        }
      }
      .icon {
        display: inline-block;
        width: 30px;
        height: 30px;
        vertical-align: baseline;
        vertical-align: top;
      }
      .pass-icon {
        background: url(../../../../assets/pass.png) no-repeat;
        background-size: contain;
      }
      .reject-icon {
        background: url(../../../../assets/bohui.png) no-repeat;
        background-size: contain;
      }
      .again-icon {
        background: url(../../../../assets/timg.jpg) no-repeat;
        background-size: contain;
      }
    }
  }
  .dl-content {
    width: 100%;
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
      background-color: #ffffff;
      .dr-head {
        background-color: #fafafa;
        height: 40px;
        line-height: 40px;
        padding-left: 12px;
        font-size: 14px;
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
      background-color: #ffffff;
      .dr-head {
        background-color: #fafafa;
        height: 40px;
        line-height: 40px;
        padding-left: 12px;
        font-size: 14px;
        margin-bottom: 24px;
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
        vertical-align: top;
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
        &:last-child {
          border: none;
        }
        li {
          width: 20%;
          text-align: center;
          font-size: 12px;
          color: #666;
          height: 40px;
          line-height: 40px;
          text-align: left;
          padding-left: 20px;
        }
      }
    }
    .leaseTerms {
      ul {
        display: inline-block;
        width: 100%;
        li {
          width: 32%;
          display: inline-block;
          margin-bottom: 24px;
        }
      }
    }
    .lease-terms {
      ul {
        margin-bottom: 20px;
      }
    }
    .reduction {
      ul li {
        width: 25%;
      }
    }
    .basic-select {
      height: 200px;
      .bd-number {
        height: 20px;
        line-height: 20px;
        padding-left: 12px;
        background: rgba(250, 250, 250, 1);
      }
      .layer {
        padding-bottom: 20px;
        font-size: 14px;
        div {
          padding: 12px 0 0 12px;
          font-size: 12px;
          span {
            display: inline-block;
            width: 30%;
            text-align: center;
          }
        }
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
        }
      }
    }
  }
  .enclosure {
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
      // width: 90%;
      margin: 0 auto;
      margin-top: 20px;
      margin-bottom: 20px;
      .el-item {
        font-size: 14px;
        span {
          display: inline-block;
          width: 10%;
          &:first-child {
            width: 50%;
          }
        }
      }
    }
  }
  .rentBillDetails {
    ul {
      li {
        text-align: center !important;
        overflow: hidden;
        padding-left: 0 !important;
      }
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
      margin-bottom: 0;
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
.stepsNav {
  height: 90px;
  margin: 20px 0;
  box-shadow: 2px 2px 6px #e4e2e2;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #fff;
  > span {
    width: 220px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    margin-left: 30px;
    background-color: #f9f9f9;
    color: #777777;
    box-shadow: 2px 2px 6px #eee;
    border-radius: 5px;
    &.active {
      background-color: #4376cb;
      color: #ffffff;
    }
  }
}
.menuBar {
  height: 70px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  box-shadow: 2px 2px 6px #dad8d8;
  background-color: #ffffff;
  > span {
    height: 68px;
    line-height: 68px;
    margin-right: 20px;
    padding: 0 15px;
    color: #666666;
    cursor: pointer;
    &.active {
      border-bottom: 2px solid #4376cb;
    }
  }
}
.dingflow-design {
  width: 100%;
  background-color: #f5f5f7;
  overflow: auto;
}
// ---------------------------------------------------------？
.contractApproval {
  .dl-content {
    width: 100%;
    // background-color: #ffffff;
    margin-top: 20px;
    .basic-select {
      height: 200px;
      .bd-number {
        height: 20px;
        line-height: 20px;
        padding-left: 12px;
        background: #fafafa;
      }
      .layer {
        padding-bottom: 20px;
        font-size: 14px;
      }
    }
    .dc-left {
      width: 30%;
      text-align: center;
      border: 1px solid #e7e7e7;
      .selectInput {
        padding: 0 20px;
        img {
          width: 60px;
          height: 30px;
        }
        span {
          position: relative;
          top: -10px;
          left: 10px;
        }
      }
      .dr-head {
        background-color: #fafafa;
        height: 40px;
        line-height: 40px;
        padding-left: 12px;
        font-size: 14px;
        margin-bottom: 20px;
      }
    }
    .dc-right {
      width: 68%;
      border: 1px solid #e7e7e7;
      background-color: #ffffff;
      .dr-head {
        background-color: #fafafa;
        height: 40px;
        line-height: 40px;
        padding-left: 12px;
        font-size: 14px;
        margin-bottom: 24px;
      }
      .el-form-item {
        vertical-align: top;
        display: inline-block;
        width: 29%;
        margin-left: 16px;
        margin-right: 10px;
      }
    }
  }
}
.clearfix:after {
  content: ".";
  display: block;
  clear: both;
  visibility: hidden;
  height: 0;
  font-size: 0;
}
.cttitle {
  margin-bottom: 10px;
}
.el-form-item__content span {
  color: #666;
}
.contract-approval {
  > .dl-content {
    box-shadow: 1px 1px 7px #eeeeee;
  }
}
.contractApproval {
  .node-wrap-box {
    width: 250px;
    box-shadow: 1px 1px 8px #bfbfbf;
    .content {
      padding: 0px 10px 15px;
      font-size: 14px;
      > div {
        display: flex;
        justify-content: space-between;
        &:first-child {
          > i {
            font-size: 12px;
            color: #c6c9d1;
          }
        }
        &:last-child {
          margin-top: 10px;
          > span {
            width: 100%;
            color: #777777;
          }
        }
        > span,
        i {
          display: inline-block;
          width: 50%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        > i {
          text-align: right;
        }
      }
    }
    .title {
      height: 40px;
      line-height: 40px;
      background-color: #ffffff !important;
      font-size: 14px;
      color: #2e2c2c;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 16px;
      font-weight: normal;
      .agree {
        color: #61ab5a;
      }
      .reject {
        color: #e93223;
      }
      .wait {
        color: #f9a218;
      }
      .auto {
        color: #4376cd;
      }
      .close {
        color: #a7a7a7;
      }
      > i.wait {
        display: inline-block;
        width: 30px;
        height: 40px;
        background-image: url(../../../../assets/wait.png);
        background-size: 100% 72%;
        background-repeat: no-repeat;
        background-position: center;
      }
      > i.close {
        display: inline-block;
        width: 30px;
        height: 40px;
        background-image: url(../../../../assets/close.png);
        background-size: 100% 72%;
        background-repeat: no-repeat;
        background-position: center;
      }
      .el-icon-success {
        color: #61ab5a;
        font-size: 24px;
      }
      .el-icon-loading {
        color: #f09851;
        font-size: 24px;
      }
      .el-icon-error {
        color: #ff0000;
        font-size: 24px;
      }
      > span > .icon {
        display: inline-block;
        width: 17px;
        height: 17px;
        margin-right: 10px;
        &.approvalStartIcon {
          // background: url(../../../../assets/approvalStartIcon.png) no-repeat;
          // background-size: 100% 100%;
          width: 0;
          height: 0;
          margin-right: 0;
        }
        &.approvalIcon {
          background: url(../../../../assets/approval.png) no-repeat;
        }
        &.notifierIcon {
          background: url(../../../../assets/notifierIcon.png) no-repeat;
        }
      }
    }
  }
  .dingflow-design .add-node-btn-box:before {
    margin: 0!important;
    left: 50%!important;
  }
  .dingflow-design .branch-box .col-box:before {
    margin: 0!important;
    left: 50%!important;
  }
}
.box-scale {
  padding: 85.5px 0 !important;
  .statusSeal {
    display: inline-block;
    width: 185px;
    height: 185px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 65%;
    z-index: 100;
    top: 60px;
    &.approvalAgreed {
      background-image: url(../../../../assets/agree.png);
    }
    &.approvalReject {
      background-image: url(../../../../assets/reject.png);
    }
    &.approvalclose {
      background-image: url(../../../../assets/closeIcon.png);
    }
    &.approvalWithdraw {
      background-image: url(../../../../assets/approvalWithdraw.png);
    }
  }
  .contractNum {
    position: absolute;
    left: 10%;
    top: 20px;
    font-size: 14px;
    color: #666;
  }
  .number {
    position: absolute;
    left: 10%;
    top: 60px;
    font-size: 14px;
    color: #666;
  }
  .download{
    position: absolute;
    left: 10%;
    top: 110px;
    font-size: 14px;
    color: #666;
    width: 100px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
    z-index: 999;
    background: #3575F6;
    border-radius: 2px;
    color: #ffffff;
  }
}
.dingflow-design span.add-branch {
  width: 95px !important;
  height: 57px !important;
  background-color: transparent !important;
  box-shadow: none !important;
  top: -30px !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  &.PARALLEL_START_AND {
    background-image: url(../../../../assets/branchIcon.png) !important;
  }
  &.PARALLEL_START_OR {
    background-image: url(../../../../assets/huoqianw.png) !important;
  }
}
.stepNew3 {
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
    margin-bottom: 20px;
    .nav {
      display: -ms-flexbox;
      display: flex;

      li.select_active {
        border-bottom: 2px solid #3175d2;
        color: #3175d2;
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
.stepNew2 .dc-right {
  width: 100% !important;
  .project-box {
    width: 100% !important;
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
      .el-table td {
        border: 0;
      }
    }
    .proTable {
      height: auto;
    }
  }
}
.contractUl {
  display: inline-block !important;
  width: 100%;
  li {
    display: inline-block;
    width: 32% !important;
  }
}
.margin_bottom li {
  margin-bottom: 24px;
}
</style>
