<template>
  <div class="">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            class="storeDetailisClass"
            @on-hide="onHide">
      <div slot="drawer"
           class="storeDetailis">
        <el-tabs v-model="roomInfoActive"
                 @tab-click="handleClick"
                 class="shopList"
                 v-if="roomInfo">
          <el-tab-pane v-for="(item) in roomInfo"
                       :key="item.id"
                       :label="item.shopNumber"
                       :name="item.id+''"></el-tab-pane>
        </el-tabs>
        <div class="min-content">
          <div class="left">
            <div class="stoteInfo">
              <div class="title">
                <span>
                  <i></i>
                  <span>基本信息</span>
                </span>
                <span class="icons"
                      @click="deitReadonly"
                      v-if="readonly1 && (hasAuthority('02020202') || defaultAuthority)"><i class="iconfont icon-edit1"></i> 编辑</span>
              </div>
              <div class="content">
                <div class="imgBox">
                  <img :src="selectedImg"
                       v-if="selectedImg && !isVideo(selectedImg)"
                       data-type="1"
                       @click="showImgList('',selectIndex)" />
                  <img :src="videoPng"
                       v-else-if="isVideo(selectedImg)"
                       data-type="22"
                       @click="playVideo(selectedImg,'')" />
                  <img src="../../../../assets/berth-default.png"
                       v-else
                       data-type="3" />
                </div>
                <div class="imgList">
                  <span class="iconfont icon-right iconRight"
                        @click="selectImg('reduce')"
                        v-if="detailData.imgUrls && detailData.imgUrls.length > 0 && readonly1"></span>
                  <div class="upLoadComponents"
                       v-if="detailData.imgUrls && detailData.imgUrls.length<5 && !readonly1"
                       title="点击上传图片视频">
                    <aliUpload class="aliUpload"
                               :upLoadText="upLoadText"
                               :fileType="fileType"
                               :iconShow="false"
                               :uploadIcon="true"
                               @setAnnex="setAnnex" />
                  </div>
                  <div v-for="(item, index) in detailData.imgUrls"
                       :key="index"
                       style="position: relative">
                    <img v-if="!isVideo(item)"
                         :src="item"
                         :class="{'imgborder': index === selectIndex}"
                         @click="changeImg(item,index)" />
                    <img v-else
                         :src="videoPng"
                         :class="{'imgborder': index === selectIndex}"
                         @click="changeImg(item,index)" />
                    <span class="iconfont icon-cms_cuowu"
                          v-if="!readonly1"
                          @click="delimg(index)"></span>
                  </div>

                  <span class="iconfont icon-right"
                        @click="selectImg('add')"
                        v-if="detailData.imgUrls && detailData.imgUrls.length > 0 && readonly1"
                        style="left: 260px;width: 16px;"></span>
                </div>
                <div style="margin-top:10px"
                     v-if="readonly1">
                  <span class="expire"
                        v-if="detailData.contractEndDay>0">合同{{detailData.contractEndDay}}天后到期</span>
                  <span class="expire"
                        v-if="detailData.contractEndDay<=0 && detailData.contractEndDay!==null">合同已到期</span>
                </div>

                <div class="stoteFrom">
                  <el-form class="form"
                           :model="detailData"
                           ref="detailData"
                           :rules="detailDataRules"
                           :class="{'readonly1':readonly1}">
                    <el-form-item prop='building'>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">管理企业<i class="required">*</i><span v-if="readonly1"></span></span>
                      <span class="itemTxt">{{detailData.projectManagement.originalProjectName}}</span>
                    </el-form-item>
                    <el-form-item prpo='projectManagement'>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">项目
                        <i class="required">*</i><span v-if="readonly1"></span></span>
                      <span class="itemTxt">{{detailData.projectManagement.referred}}</span>
                      <!-- <el-select v-if="!readonly1"
                                 size="small"
                                 value-key="id"
                                 v-model="detailData.projectManagement"
                                 placeholder="请选择"
                                 @change="chooseItem('project', detailData.projectManagement)"
                                 style="width:170px">
                        <el-option v-for="item in projectList"
                                   :key="item.id"
                                   :label="item.referred"
                                   :value="item">
                        </el-option>
                      </el-select> -->
                    </el-form-item>
                    <el-form-item prop='building'>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">楼宇<i class="required">*</i><span v-if="readonly1"></span></span>
                      <span class="itemTxt">{{detailData.building.buildingName}}</span>
                      <!-- <el-select v-if="!readonly1"
                                 value-key="id"
                                 size="small"
                                 v-model="detailData.building"
                                 placeholder="请选择"
                                 @change="chooseItem('hourse', detailData.building)"
                                 style="width:170px">
                        <el-option v-for="item in hourList"
                                   :key="item.id"
                                   :label="item.buildingName"
                                   :value="item">
                        </el-option>
                      </el-select> -->
                    </el-form-item>
                    <el-form-item prop='floor'>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">楼层<i class="required">*</i><span v-if="readonly1"></span></span>
                      <span v-if="readonly1 && detailData.floor"
                            class="itemTxt">{{detailData.floor.name}}</span>
                      <el-select v-if="!readonly1"
                                 value-key="id"
                                 size="small"
                                 v-model="detailData.floor"
                                 placeholder="请选择"
                                 style="width:170px">
                        <el-option v-for="item in buildingList"
                                   :key="item.id"
                                   :label="item.name"
                                   :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop='shopNumber'>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">房源号<i class="required">*</i><span v-if="readonly1"></span></span>
                      <span v-if="readonly1"
                            class="itemTxt">{{detailData.shopNumber}}</span>
                      <el-input v-if="!readonly1"
                                size="small"
                                v-model="detailData.shopNumber"
                                placeholder="房源号"
                                style="width:170px"></el-input>
                    </el-form-item>
                    <el-form-item prop='buildingArea'>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">建筑面积/m²<i class="required">*</i><span v-if="readonly1"></span></span>
                      <span v-if="readonly1"
                            class="itemTxt">{{detailData.buildingArea}}</span>
                      <!-- class="itemTxt">{{detailData.buildingArea | toLocaleFixed}}</span> -->
                      <el-input v-if="!readonly1"
                                size="small"
                                v-model="detailData.buildingArea"
                                style="width:170px"
                                @input="getHsRate"
                                type="number"></el-input>
                    </el-form-item>
                    <el-form-item prop='useArea'>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">使用面积/m²<span v-if="readonly1"></span></span>
                      <span v-if="readonly1"
                            class="itemTxt">{{detailData.useArea||'-'}}</span>
                      <el-input v-if="!readonly1"
                                size="small"
                                v-model="detailData.useArea"
                                style="width:170px"
                                @input="getHsRate"
                                type="number"></el-input>
                    </el-form-item>
                    <el-form-item prop='address'>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">地址<span v-if="readonly1"></span></span>
                      <span v-if="readonly1"
                            class="itemTxt">{{detailData.address||'-'}}</span>
                      <el-input v-if="!readonly1"
                                size="small"
                                v-model="detailData.address"
                                placeholder="具体地址"
                                style="width:170px"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">产权证编号<span v-if="readonly1"></span></span>
                      <span v-if="readonly1"
                            class="itemTxt">{{detailData.productionCertificateNo}}</span>
                      <el-input v-if="!readonly1"
                                size="small"
                                v-model="detailData.productionCertificateNo"
                                placeholder="产证号"
                                style="width:170px"></el-input>
                    </el-form-item>
                    <el-form-item prop='expectedUnitPrice'>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">招商指导价（元/m²·天）<span v-if="readonly1"></span></span>
                      <!-- <span>{{detailData.expectedUnitPrice}}、、、</span> -->
                      <span v-if="readonly1" 
                                class="itemTxt">{{formatUnitPrice(detailData.expectedUnitPrice)}}</span>
                      <el-input v-else-if="!readonly1"
                                size="small"
                                v-model="detailData.expectedUnitPrice"
                                placeholder="招商指导价"
                                style="width:170px"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">联系人<span v-if="readonly1"></span></span>
                      <span v-if="readonly1"
                            class="itemTxt">{{detailData.contact}}</span>
                      <el-input v-if="!readonly1"
                                size="small"
                                v-model="detailData.contact"
                                placeholder="联系人"
                                style="width:170px"></el-input>
                    </el-form-item>
                    <el-form-item prop='telephone'>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">联系人电话<span v-if="readonly1"></span></span>
                      <span v-if="readonly1"
                            class="itemTxt">{{detailData.telephone}}</span>
                      <el-input v-if="!readonly1"
                                size="small"
                                v-model="detailData.telephone"
                                @input="detailData.telephone=detailData.telephone.replace(/[^0-9]/g,'')"
                                placeholder="联系人电话"
                                style="width:170px"></el-input>
                    </el-form-item>
                    <el-form-item prop='useStatus'>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">状态<span v-if="readonly1"></span></span>
                      <span v-if="readonly1"
                            class="itemTxt">{{useStatus(detailData.useStatus)}}</span>
                      <el-select v-else
                                 size="small"
                                 v-model="detailData.useStatus"
                                 placeholder="请选择"
                                 style="width:170px">
                        <el-option label="使用中"
                                   value="USING"></el-option>
                        <el-option label="已停用"
                                   value="DISABLE"></el-option>
                      </el-select>
                    </el-form-item>
                    <!-- <el-form-item prop='shopNumber'>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">房源平面图<span v-if="readonly1"></span></span>
                      <div class="itemTxt itemImageUrl"
                           v-if='!readonly1'>
                        <div class="upLoadComponents">
                          <aliUpload class="aliUpload"
                                     :upLoadText="upLoadText"
                                     :fileType="fileType1"
                                     :iconShow="false"
                                     :uploadIcon="true"
                                     @setAnnex="setAnnexsAli" />
                        </div>
                        <div class="imageName"
                             v-if="detailData.roomsImageName">
                          <span>{{detailData.roomsImageName}}</span>( <span @click='showPictureAli(detailData.roomsImageUrl)'>预览</span> )
                        </div>
                      </div>
                      <div class="itemTxt"
                           v-if="readonly1 && detailData.roomsImageName">
                        <span class="roomImageName">{{detailData.roomsImageName}}</span>( <span class="showRoomImage"
                              @click='showPictureAli(detailData.roomsImageUrl)'>预览</span> )
                      </div>
                    </el-form-item> -->

                    <!-- <el-form-item>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">所属省市区<span v-if="readonly1"></span></span>
                      <span class="itemTxt">{{provinces}}</span>
                    </el-form-item> -->
                    <!-- <el-form-item prop='getRoomsRate'>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">得房率/%<span v-if="readonly1"></span></span>
                      <span v-if="readonly1"
                            class="itemTxt">{{detailData.getRoomsRate ||'-'}}</span>
                      <el-input v-if="!readonly1"
                                size="small"
                                v-model="detailData.getRoomsRate"
                                style="width:170px"
                                disabled="disabled"></el-input>
                    </el-form-item> -->
                    <!-- <el-form-item prop='industry'>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">预期业态<span v-if="readonly1"></span></span>
                      <span class="itemTxt itemIndustry"
                            :title="detailData.industryName">{{detailData.industryName}}</span>
                    </el-form-item> -->
                    <!-- <el-form-item prop='investmentStatus'>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">房源类型<span v-if="readonly1"></span></span>
                      <span v-if="readonly1"
                            class="itemTxt">{{investmentStatus(detailData.investmentStatus)}}</span>
                      <el-select v-else
                                 size="small"
                                 v-model="detailData.investmentStatus"
                                 placeholder="请选择"
                                 style="width:170px">
                        <el-option label="普通房源"
                                   value="OK"></el-option>
                        <el-option label="自用"
                                   value="NO"></el-option>
                        <el-option label="虚拟房源"
                                   value="FICTITIOUS"></el-option>
                      </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item prop='expectedUnitPrice'>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">招商指导价<span v-if="readonly1"></span></span>
                      <span class="itemTxt">{{priceUnit(detailData.expectedUnitPrice, detailData.priceUnit)}}</span>
                    </el-form-item> -->
                    <!-- <el-form-item>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">客户名称<span v-if="readonly1"></span></span>
                      <span class="itemTxt">{{detailData.tenantName}}</span>
                    </el-form-item>
                    <el-form-item>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">租期<span v-if="readonly1"></span></span>
                      <span class="itemTxt">
                        <span v-if="detailData.contractStartDate">{{detailData.contractStartDate}} - {{detailData.contractEndDate}}</span>
                      </span>
                    </el-form-item>
                    <el-form-item prop='roomsUse'>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">用途<i class="required">*</i><span v-if="readonly1"></span></span>
                      <span v-if="readonly1"
                            class="itemTxt">{{roomsUseStatus(detailData.roomsUse)}}</span>
                      <el-select v-else
                                 size="small"
                                 v-model="detailData.roomsUse"
                                 placeholder="请选择"
                                 style="width:170px">
                        <el-option v-for="(item, index) in roomsUseOption"
                                   :key="index"
                                   :label="item.name"
                                   :value="item.value"></el-option>
                      </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item prop='firstDisplay'>
                      <span class="itemName"
                            :class="{'alginLeft':readonly1,'alginRight':!readonly1}">招商平面图优先展示<span v-if="readonly1">：</span></span>
                      <span v-if="readonly1"
                            class="itemTxt"
                            style="width:auto">{{formatFirstDisplay(detailData.firstDisplay)}}</span>
                      <el-select v-else
                                 v-model="detailData.firstDisplay"
                                 placeholder="请选择"
                                 style="width:170px">
                        <el-option label="优先合同"
                                   value="CONTRACT"></el-option>
                        <el-option label="优先客户列表"
                                   value="YXTENANT"></el-option>
                      </el-select>
                    </el-form-item> -->
                  </el-form>
                </div>
              </div>
              <div v-if="!readonly1"
                   class="stoteInfo_foot">
                <span @click="addHourse('detailData')"
                      class="subBtn">保 存</span>
                <span @click="addcancel()">取 消</span>
              </div>
            </div>
            <div class="projectInfo">
              <div class="title">
                <span>
                  <i></i>
                  <span>工程条件</span>
                </span>
              </div>
              <div class="basicInfo"
                   id="itemContent">
                <div v-if="detailData.projectConditions && detailData.projectConditions.length===0 && readonly2"
                     style="padding: 20px;color:#777777">暂无数据</div>
                <div class="itemContent"
                     :key="keyVersions"
                     v-else>
                  <div class="item"
                       style="padding-left:0px;"
                       v-for="(item,index) in EngInfoList"
                       :key="index"
                       v-show="item.isChecked||!readonly2">
                    <span style="display:inline-block;width:250px;margin-right:10px;color:#777;overflow: hidden; text-overflow: ellipsis;white-space: nowrap;"
                          :title="item.value">{{item.value}}</span>
                    <el-input v-if="!readonly2"
                              v-model="item.needValue"
                              size="small"
                              :disabled="!item.isChecked"
                              style="width:150px;margin-right:10px"></el-input>
                    <span v-else
                          style="display:inline-block;width:150px;text-align:center;color:#262626;margin-right:10px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap"
                          :title="item.needValue">{{item.needValue}}</span>
                    <span style="color:#262626;display:inline-block;width:100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap"
                          :title="item.description">{{item.description}}</span>
                  </div>
                </div>
              </div>
              <div v-if="!readonly2"
                   class="stoteInfo_foot">
                <span @click="putprojectCondition()"
                      class="subBtn">保 存</span>
                <span @click="cancelCondition()">取 消</span>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="now">
              <!-- <div class="tab">
                <span :class="{'active':rightTab===1}"
                      @click="rightTabChange(1)">跟进记录</span>
                <span :class="{'active':rightTab===2}"
                      @click="rightTabChange(2)">当前意向客户</span>
              </div> -->
              <div class="title">
                <span>
                  <i></i>
                  <span>跟进记录</span>
                </span>
              </div>
              <div class="writeRecord"
                   v-if="rightTab===1">
                <span style="font-size:12px;"
                      @click="addFollowUp"
                      v-if="hasAuthority('02020202') || defaultAuthority">
                  <i class="iconfont icon-cms_xiegenjin-1"></i>
                  写跟进
                </span>
              </div>
              <div class="timeline_content"
                   v-if="rightTab===1">
                <el-timeline class="timelineBox"
                             v-if="timeLineListData.length"
                             style="padding: 30px 70px 0px 130px;">
                  <el-timeline-item placement="top"
                                    style="position:relative;"
                                    v-for="(item, index) in timeLineListData"
                                    :key="index"
                                    :color="nodeColor(index)">
                    <div class="statusBox">
                      <div class="tjsh">{{formatTimeLineTitle(item.followRecordType)}}</div>
                      <div :class="{'first':index===0}">{{formatApprovalDate(item.followTime)}}</div>
                    </div>
                    <div class="template">
                      <p><span>{{item.followRecordType==='INPUT'?'录入人':'跟进人'}}：</span><span>{{item.followName}}</span></p>
                      <p v-if="item.followRecordType==='FOLLOW'"><span>跟进记录：</span><span v-html="formatreplace(item.followContent)"></span></p>
                      <div class="annexesList"
                           v-for="(item2, idx2) in item.annexes"
                           :key="idx2">
                        <span class="annexName"
                              :title="item2.annexName">{{item2.annexName}}</span>
                        <aliDownLoad class="aliDownLoad1"
                                     style="margin-right:15px"
                                     :item="item2"
                                     :encrypt="true" />
                        <ailPreview :ailObj="item2"
                                    :encrypt="true"
                                    @setFile="setFile" />

                      </div>
                    </div>
                  </el-timeline-item>
                </el-timeline>
                <div class="noRecord"
                     style="padding: 120px 50px;text-align: center;"
                     v-else>暂无记录</div>
              </div>
              <div style="display:flex;justify-content:space-between;padding-right:20px;"
                   class="seachDiv"
                   v-if="rightTab===2">
                <div>
                  <el-input v-model="table1Parems.brandName"
                            size="small"
                            style="width:160px"
                            placeholder="品牌名称"></el-input>
                  <!-- <el-select v-model="table1Parems.industryId"
                             style="width:160px;margin-left:20px"
                             size="small"
                             placeholder="业态"
                             clearable>
                    <el-option v-for="item in industryList"
                               :key="item.id"
                               :label="item.value"
                               :value="item.id">
                    </el-option>
                  </el-select> -->
                  <el-cascader :options="industry1options"
                               clearable
                               placeholder="行业"
                               size="small"
                               style="width:160px;margin-left:20px"
                               @change="handleChange1"
                               v-model="industryIdArr1"></el-cascader>
                  <el-input v-model="table1Parems.contact"
                            style="width:160px;margin-left:20px"
                            size="small"
                            placeholder="联系人"></el-input>
                  <span @click="seachList1"
                        class="seachList2">查询</span>
                </div>

                <el-button class="tban tban1 tban_new"
                           v-if="hasAuthority('02020202') || defaultAuthority"
                           @click="toAddPotlClients"><i class="iconfont icon-crm_xinzeng-"></i> <span class="text">新增意向客户</span></el-button>
              </div>
              <div class="table1 details_table"
                   v-if="rightTab===2">
                <el-table :data="tableData1"
                          style="width: 100%">
                  <el-table-column width="80"
                                   prop="customerType"
                                   label="客户类型"
                                   align="center"></el-table-column>
                  <el-table-column prop="yxTenantName"
                                   label="客户名称"
                                   align="center"></el-table-column>
                  <el-table-column prop="referred"
                                   label="品牌名称"
                                   align="center"></el-table-column>
                  <el-table-column prop="tenantUseDescription"
                                   label="用途"
                                   align="center"></el-table-column>
                  <el-table-column prop="industryName"
                                   label="行业"
                                   align="center"></el-table-column>
                  <el-table-column width="130"
                                   label="需求面积"
                                   :formatter="formatterDemandArea"
                                   align="center"></el-table-column>
                  <el-table-column label="心理价位"
                                   width="130px"
                                   align="center"
                                   :formatter="formatterPrice"></el-table-column>
                  <el-table-column prop="dealOdds"
                                   label="招商进度"
                                   align="center"></el-table-column>
                  <el-table-column label="跟进时间"
                                   width="120px"
                                   align="center">
                    <template slot-scope="scope">
                      <div>
                        <p>{{formatterlastFollowTime(scope.row,'year')}}</p>
                        <p>{{formatterlastFollowTime(scope.row,'time')}}</p>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column width="60"
                                   label="操作"
                                   align="center">
                    <template slot-scope="scope">
                      <span class="details_cheackBtn"
                            @click="toDetails(scope.$index, scope.row)">查看</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="ctc-foot"
                   v-if="rightTab===2">
                <el-pagination v-if="total1 > 0"
                               background
                               layout="prev, pager, next"
                               :page-size="pgSize1"
                               :total="total1"
                               :current-page="currentPage1"
                               @current-change="current_change1">
                </el-pagination>
              </div>
            </div>
            <div class="history">
              <!-- <div class="tab">
                <span :class="{'active':historyTab===1}"
                      @click="historyTabChange(1)">历史意向客户</span>
                <span :class="{'active':historyTab===2}"
                      @click="historyTabChange(2)">历史客户</span>
              </div> -->
              <div class="title">
                <span>
                  <i></i>
                  <span>入驻信息</span>
                </span>
                <div class="dweditbtn delAction"
                     @click="showEnterInfoDialog"><i class="iconfont icon-crm_xinzeng-"></i>
                  <span>新增</span>
                </div>
              </div>
              <div>
                <div class="table1 details_table">
                  <el-table :data="tableDataEnter"
                            style="width: 100%">
                    <el-table-column prop="rzEnterpriseName"
                                     label="企业名称"
                                     align="center"></el-table-column>
                    <el-table-column prop="moveIntoType"
                                     width="100px"
                                     label="类别"
                                     align="center"></el-table-column>
                    <el-table-column :formatter="priceFomat"
                                     label="租金单价"
                                     align="center"></el-table-column>
                    <el-table-column :formatter="dateFormat"
                                     label="租期"
                                     align="center"></el-table-column>
                    <el-table-column width="60px"
                                     label="操作"
                                     align="center">
                      <template slot-scope="scope">
                        <span class="details_cheackBtn"
                              @click="editEnter(scope.$index, scope.row)">编辑</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </drawer>
    <!-- 意向客户详情 -->
    <!-- <potClienDtl :detailsdrawershow="detailsShow"
                 :yxkhFrom="yxkhFrom"
                 :options2="projectList"
                 :draweDetaileData="detaileData"
                 :timeLineListData="timeLineListData1"
                 :project="project"
                 ref="potClienDtl"
                 @refreshList="refreshList"
                 @shopDetails="shopDetails"
                 @addProgressFn="addProgressFn"
                 @addFlowListSuccess="addFlowListSuccess"
                 @drawerClose="detailsClose" /> -->
    <el-dialog title="写跟进"
               :visible.sync="dialogVisible"
               class="storeDetailisdialog store_flow_new el_dialog_new"
               @close="dialogVisibleClose"
               width="400px">
      <div class="dialog_content">
        <el-form :model="ruleForm"
                 :rules="rules"
                 ref="ruleForm">
          <el-form-item prop="followTime"
                        style="width:100%">
            <span>时间 <i class="required">*</i></span>
            <el-date-picker v-model="ruleForm.followTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            :picker-options="pickerOptions"
                            value-format="yyyy-MM-ddTHH:mm:ss"
                            style="margin-top:8px;width:100%;"></el-date-picker>
          </el-form-item>
          <el-form-item prop="followContent"
                        style="width:100%">
            <span>内容 <i class="required">*</i></span>
            <el-input type="textarea"
                      v-model="ruleForm.followContent"
                      style="height:auto;margin-top:8px;"
                      maxlength="200"
                      placeholder="200字以内"></el-input>
          </el-form-item>
          <div style="width:100%">
            <div class="enclosure"
                 style="width:100%">
              <div class="enclosure-head"
                   style="width: 130px;">附件
                <div style="opacity:1;margin-left:0;"
                     class="iconfont icon-shangchuanfujianicon upload"> 上传附件
                  <aliUpload class="aliUpload aliUploadFlow"
                             style="display: inline-block;"
                             :upLoadText="upLoadText"
                             :fileType="fileType_cost"
                             :iconShow="false"
                             @setAnnex="setAnnexs" />
                </div>
              </div>
              <div class="enclosure-list enclosure-list-flow"
                   v-for="(item, index) in ruleForm.annexes"
                   :key="index">
                <div class="el-item">
                  <span style="padding-left: 0">{{item.annexName}}</span>
                  <span v-if="item.annexName">
                    <i style="cursor:pointer"
                       @click="deleFileFlow(item, index)"
                       class="iconfont icon-lajixiang"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!-- 跟进里的消息推送 -->
          <el-form-item style="width:100%;margin-bottom: 0px;">
            <div class="cttitle">消息推送</div>
            <span class="sendIfo">不发送</span>
            <el-switch style="margin:0 12px;"
                       v-model="switchTurn"
                       active-color="#91CF48"
                       inactive-color="#EAECF0"
                       @change="changeSwitch">
            </el-switch>
            <span class="sendIfo">发送</span>
          </el-form-item>
          <el-form-item v-if="switchTurn"
                        style="width:100%;margin-bottom: 0px;">
            <div class="cttitle">收件人<i class="required">*</i></div>
            <div class="select-wrap">
              <div class="select-span">
                <span v-for="(item, index) in selectSpan"
                      :key="index">{{item.userName ? item.userName : item.userPostName}} <i class="iconfont icon-cha"
                     @click="delSelect(item)"></i></span>
              </div>
              <i class="iconfont icon-bottom"
                 @click="organizationShow=!organizationShow"
                 :class="{'icon-top': organizationShow}"></i>
            </div>
            <transition name="sub-comments">
              <div class="organization"
                   v-show="organizationShow">
                <el-input placeholder="请输入组织名称/员工姓名"
                          prefix-icon="el-icon-search"
                          v-model="filterText"
                          class=""></el-input>
                <el-tree :data="orgListCopy"
                         show-checkbox
                         node-key="nodeId"
                         :render-after-expand="false"
                         :default-checked-keys="checkedKeys"
                         :filter-node-method="filterNode"
                         @check-change="handleCheckChange"
                         ref="treeForm"
                         :props="defaultProps">
                </el-tree>
              </div>
            </transition>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer"
            class="slotfooter">
        <span class="details_cannelBtn"
              @click="dialogVisibleClose">取消</span>
        <span class="details_submitBtn"
              @click="addRecord">确定</span>
      </span>
    </el-dialog>
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
    <!-- 新增入驻 -->
    <el-dialog :title="enterType==='add'?'新增入驻':'编辑入驻'"
               width="900px"
               class="addClientsDialog2 addEnterInfoDialog"
               :visible.sync="addEnterInfoDialog"
               :close-on-click-modal="false"
               @close="enterInfoDialogClose">
      <el-form class="form"
               :model="addParmasEnterInfo"
               ref="addParmasEnterRef"
               :rules="addParmasEnterInfoRules">
        <div class="addComtent1">
          <div class="title">
            <i></i>
            房源
          </div>
          <div class="contentDtl">
            <div class="item"
                 style="margin-bottom:20px"> <span>管理企业</span> <span>{{detailData.projectManagement.originalProjectName}}</span></div>
            <div class="item"
                 style="margin-bottom:20px"> <span>项目</span> <span>{{detailData.projectManagement.projectName}}</span> </div>
            <div class="item"
                 style="margin-bottom:20px"> <span>楼宇</span> <span>{{detailData.building.buildingName}}</span> </div>
            <div class="item"> <span>房源号</span> <span>{{detailData.shopNumber}}</span> </div>
            <div class="item"> <span>楼层</span> <span>{{detailData.floor.name}}</span> </div>
            <div class="item"> <span>建筑面积</span> <span>{{detailData.buildingArea}}</span> </div>
          </div>
        </div>
        <div class="addComtent1"
             style="margin-top:12px">
          <div class="title">
            <i></i>
            入驻信息
          </div>
          <div class="contentDtl"
               style="padding:15px 15px 0">
            <div class="item"
                 style="width:60%!important">
              <span>企业<i class="required">*</i></span>
              <el-autocomplete clearable
                               v-model="addEnterInfoId"
                               style="width:100%"
                               size="small"
                               value-key="teantName"
                               :fetch-suggestions="searchTeantName"
                               @select="handleSelectTeant"
                               placeholder="请输入内容"></el-autocomplete>
            </div>
            <div class="item">
              <span>类别</span>
              <el-select size="small"
                         style="width:100%!important"
                         v-model="addParmasEnterInfo.moveIntoType"
                         placeholder="请选择">
                <el-option label="一手"
                           value="一手"></el-option>
                <el-option label="二手"
                           value="二手"></el-option>
                <el-option label="三手"
                           value="三手"></el-option>
                <el-option label="四手"
                           value="四手"></el-option>
                <el-option label="五手"
                           value="五手"></el-option>
                <el-option label="挂靠"
                           value="挂靠"></el-option>
              </el-select>
            </div>
            <div class="time">
              <div class="item"
                   style="width:240px!important">
                <span>起始日期</span>
                <el-date-picker v-model="addParmasEnterInfo.startTime"
                                size="small"
                                type="date"
                                style="width:100%"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </div>
              <div> - </div>
              <div class="item"
                   style="width:240px!important">
                <span>截止日期</span>
                <el-date-picker v-model="addParmasEnterInfo.endTime"
                                size="small"
                                style="width:100%"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </div>
            </div>
            <div class="price"
                 style="width:32%">
              <span>租金单价（元）</span>
              <el-input placeholder="请输入内容"
                        size="small"
                        style="width:100%;margin-top:8px"
                        v-model="addParmasEnterInfo.price"
                        class="input-with-select">
                <el-select v-model="addParmasEnterInfo.rentPriceType"
                           style="width:135px"
                           slot="prepend"
                           placeholder="请选择">
                  <el-option label="面积单价(每天)"
                             value="MJ_MT"></el-option>
                  <el-option label="月租金"
                             value="MONTH"></el-option>
                  <el-option label="年租金"
                             value="YEAR"></el-option>
                </el-select>
              </el-input>
            </div>
          </div>
        </div>
      </el-form>
      <div style="padding-right:15px;"
           slot="footer"
           class="dialog-footer">
        <div>
          <span class="del"
                v-if="enterType==='edit'"
                @click="deleteDialog=true">删除</span>
        </div>
        <div>
          <span @click="addEnterInfo"
                class="subBtn">确 定</span>
          <span @click="enterInfoDialogClose"
                class="quxiao_btn">取 消</span>
        </div>

      </div>
    </el-dialog>
    <!-- 新增意向客户 -->
    <el-dialog title="新增意向客户"
               width="750px"
               class="addClientsDialog2"
               :visible.sync="dialogFormVisible"
               :close-on-click-modal="false"
               @close="closeFn">
      <el-form class="form"
               :model="addParmas"
               ref="addParmas"
               :rules="TenantDTORules">
        <div class="addComtent1">
          <div class="title">
            <i></i>
            客户档案
          </div>
          <div class="contentDtl">
            <div>
              <div class="item ">
                <div style="width:100%">
                  <span>项目<i>*</i></span>
                  <el-form-item prop="projectManagementDTO">
                    <el-select style="width:100%"
                               value-key="id"
                               size="small"
                               v-model="addParmas.projectManagementDTO">
                      <el-option v-for="item in options1"
                                 :key="item.id"
                                 :label="item.referred"
                                 :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <div class="item">
                <div>
                  <span>意向客户类型<i>*</i></span>
                  <div style="display:flex;">
                    <el-radio v-model="addParmas.customerType"
                              label="COMPANY"
                              @change="radioChange">企业</el-radio>
                    <el-radio v-model="addParmas.customerType"
                              label="PERSONAL"
                              @change="radioChange">个人</el-radio>
                  </div>
                </div>
              </div>
              <div class="item ">
                <div>
                  <span>{{addParmas.customerType==='COMPANY'?'企业名称':'姓名'}}<i>*</i></span>
                  <el-form-item prop="yxTenantName">
                    <el-input style="width:100%"
                              v-model="addParmas.yxTenantName"
                              size="small"
                              placeholder="请输入"
                              maxlength="50"
                              @change="autoChange"
                              onblur="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"></el-input>
                  </el-form-item>
                </div>
                <div>
                  <span>品牌名称<i>*</i></span>
                  <el-form-item prop="referred">
                    <el-input v-model="addParmas.referred"
                              style="width:100%"
                              placeholder="请输入"
                              size="small"
                              maxlength="20"
                              onblur="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"></el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="item">
                <div>
                  <span>用途<i>*</i></span>
                  <el-form-item prop="tenantUse">
                    <el-select style="width:100%"
                               v-model="addParmas.tenantUse"
                               size="small"
                               placeholder="请选择"
                               @change="industryFn(addParmas.tenantUse);industryObj = {}"
                               value-key="value">
                      <el-option v-for="item in tenantUseList"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div>
                  <span>行业<i>*</i></span>
                  <el-form-item prop="industryId">
                    <el-select style="width:100%"
                               v-model="industryObj"
                               size="small"
                               placeholder="请选择"
                               value-key="id"
                               @change="industryChange">
                      <el-option v-for="item in industryList"
                                 :key="item.id"
                                 :label="item.value"
                                 :value="item">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>

              </div>
              <div class="item">
                <div class="inputNoborder">
                  <span>需求面积/m²<i>*</i></span>
                  <span style="margin-bottom: 0;border: 1px solid #DCDFE6;border-radius: 4px;">
                    <el-form-item prop="lowArea"
                                  style="display: inline-block;">
                      <el-input v-model="addParmas.lowArea"
                                style="width:150px"
                                size="small"
                                onkeyup="value=value.replace(/[^0-9\.]/g,'')"></el-input>
                    </el-form-item>
                    <span style="margin:0 5px;color:#999;font-weight: bold;">-</span>
                    <el-form-item prop="highArea"
                                  style="display: inline-block">
                      <el-input v-model="addParmas.highArea"
                                style="width:150px"
                                size="small"
                                onkeyup="value=value.replace(/[^0-9\.]/g,'')"></el-input>
                    </el-form-item>
                  </span>
                </div>
                <div class="inputNoborder">
                  <span>心理价位<i>*</i></span>
                  <span style="margin-bottom: 0;border: 1px solid #DCDFE6;border-radius: 4px;">
                    <el-form-item prop="lowPrice"
                                  style="display: inline-block;">
                      <el-input v-model="addParmas.lowPrice"
                                style="width:95px"
                                size="small"
                                onkeyup="value=value.replace(/[^0-9\.]/g,'')"></el-input>
                    </el-form-item>
                    <span style="margin:0 5px;color:#999;font-weight: bold;">-</span>
                    <el-form-item prop="highPrice"
                                  style="display: inline-block;">
                      <el-input v-model="addParmas.highPrice"
                                style="width:95px"
                                size="small"
                                onkeyup="value=value.replace(/[^0-9\.]/g,'')"></el-input>
                    </el-form-item>
                    <el-select v-model="addParmas.priceUnit"
                               size="small"
                               class="priceSelect"
                               style="width:122px;">
                      <el-option v-for="(item,index) in options3"
                                 :key="index"
                                 :label="item.label"
                                 :value="item.value"></el-option>
                    </el-select>
                  </span>
                </div>

              </div>
              <div class="item">
                <div>
                  <span>预计开店时间</span>
                  <el-date-picker v-model="addParmas.signDate"
                                  size="small"
                                  value-format="yyyy-MM-dd"
                                  style="width:100%"
                                  type="date"
                                  placeholder="请选择">
                  </el-date-picker>
                </div>
                <div>
                  <span>联系人<i>*</i></span>
                  <el-form-item prop="contact">
                    <el-input v-model="addParmas.contact"
                              size="small"
                              placeholder="请输入"
                              style="width:100%"></el-input>
                  </el-form-item>

                </div>

              </div>
              <div class="item">
                <div>
                  <span>联系电话<i>*</i></span>
                  <el-form-item prop="telephone">
                    <el-input v-model="addParmas.telephone"
                              size="small"
                              placeholder="请输入"
                              onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')"
                              onpaste="return false"
                              ondragenter="return false"
                              style="width:100%"></el-input>
                  </el-form-item>

                </div>
                <div>
                  <span>意向客户来源</span>
                  <el-select v-model="customerSourceObj"
                             value-key="id"
                             size="small"
                             style="width:100%"
                             @change="customerSourceChange">
                    <el-option v-for="(item,index) in yxkhFrom"
                               :key="index"
                               :label="item.value"
                               :value="item"></el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="addComtent1"
             style="margin-top:15px">
          <div class="title">
            <i></i>
            意向客户简介
          </div>
          <div class="contentDtl">
            <div>
              <div class="item ">
                <div style="width:100%">
                  <span>意向客户网站</span>
                  <el-input style="width:100%"
                            size="small"
                            v-model="addParmas.website"
                            placeholder="请输入内容"></el-input>
                </div>
              </div>
              <div class="item"
                   style="flex-direction:column;">
                <span>意向客户简介</span>
                <el-input v-model="addParmas.introduction"
                          type="textarea"
                          :rows="5"
                          resize="none"
                          style="width:100%;margin-top:10px"
                          maxlength="200"
                          placeholder="请输入200字以内"></el-input>
              </div>
              <div class="item ">
                <div style="width:100%">
                  <span>档案文件</span>
                  <div style="display: flex;justify-content: space-between;align-items: center;">
                    <aliUpload class="aliUpload deviceDetails"
                               :upLoadText="addParmas.annexes.length>0?'继续上传':'上传附件'"
                               :fileType="fileType_cost"
                               :iconShow="false"
                               :iconImg="iconImg"
                               :uploadIcon="true"
                               @setAnnex="setAnnex1" />
                    <div class="annexList"
                         style="70%">
                      <div v-for="(item, index) in addParmas.annexes"
                           :key="index">
                        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{item.annexName}}</span>
                        <span>
                          <i @click="deleFile(item, index,'yx')"
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
      </el-form>
      <div style="padding-right:20px;"
           slot="footer"
           class="dialog-footer">
        <span @click="save"
              class="subBtn">确 定</span>
        <span @click="closeFn"
              class="quxiao_btn">取 消</span>
      </div>
    </el-dialog>

    <el-dialog title="跟进"
               width="1050px"
               :visible.sync="addProgressFrom"
               class="addProgressFrom">
      <el-form class="form1"
               :model="followRecordDTOParams"
               ref="followRecordDTOParams"
               :rules="addProgressRules">
        <div class="content">
          <div class="item">
            <span>跟进时间<i>*</i></span>
            <el-form-item prop="followTime">
              <el-date-picker v-model="followRecordDTOParams.followTime"
                              value-format="yyyy-MM-ddTHH:mm:ss.000Z"
                              style="width:300px"
                              type="datetime"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="item">
            <span>跟进记录<i>*</i></span>
            <el-form-item prop="followContent">
              <el-input type="textarea"
                        :rows="5"
                        resize="none"
                        style="width:100%"
                        maxlength="200"
                        placeholder="200字以内"
                        v-model="followRecordDTOParams.followContent"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <!-- <span>记录报价</span> -->
            <el-collapse v-model="activeNames">
              <el-collapse-item title="记录报价"
                                name="1">
                <div class="storeInfo">
                  <span class="title">房源信息</span>
                  <div class="content">
                    <div class="project">
                      <p style="font-size: 16px;font-weight: bold;">{{building.projectManagementName}}</p>
                      <div class="collapse">
                        <el-collapse v-model="activeName"
                                     accordion>
                          <el-collapse-item v-for="(item,index) in building.projectRoomsSecondDTOList"
                                            :key="index"
                                            :title="item.buildingName"
                                            :name="index+1">
                            <div>
                              <el-checkbox-group v-model="followRecordDTOParams.rooms">
                                <el-checkbox v-for="(itm,idx) in item.roomsDTOList"
                                             :label="itm"
                                             :key="idx">
                                  <span v-if="itm.floor">{{itm.floor.name}}层</span>
                                  <span>{{itm.shopNumber}}</span>
                                  <span>{{itm.buildingArea}}m²</span>
                                </el-checkbox>
                              </el-checkbox-group>
                            </div>
                          </el-collapse-item>
                        </el-collapse>
                      </div>
                    </div>
                    <div class="offer">
                      <div class="item">
                        <span>报价</span>
                        <div>
                          <el-input v-model="followRecordDTOParams.price"
                                    style="width: 250px;margin-right: 20px;"></el-input>
                          <el-select v-model="followRecordDTOParams.priceUnit"
                                     style="width:120px">
                            <el-option v-for="(item,index) in options3"
                                       :key="index"
                                       :label="item.label"
                                       :value="item.value"></el-option>
                          </el-select>
                        </div>
                      </div>
                      <div class="item">
                        <span>租赁年限</span>
                        <div>
                          <el-select style="width: 250px"
                                     v-model="followRecordDTOParams.leaseYear">
                            <el-option v-for="(item,index) in yearsList"
                                       :key="index"
                                       :label="item"
                                       :value="item"></el-option>
                          </el-select>
                          <span style="margin:10px 10px">年</span>
                        </div>
                      </div>
                      <div class="item">
                        <span>递增</span>
                        <div>
                          <el-input v-model="followRecordDTOParams.increment"
                                    style="width: 250px"></el-input>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div>
            <div class="enclosure"
                 style="width:100%">
              <div class="enclosure-head">附件
                <div class="upload"> 上传附件 <input type="file"
                         @change="imageChange('addFlowList', $event)"></div>
              </div>
              <div class="enclosure-list"
                   v-for="(item, index) in followRecordDTOParams.annexes"
                   :key="index">
                <div class="el-item">
                  <span>{{item.annexName}}</span>
                  <span v-if="item.annexName">
                    <i @click="deleFile(item, index,'flow')"
                       class="iconfont icon-lajixiang"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!-- 跟进里的消息推送 -->
          <el-form-item>
            <div class="cttitle">消息推送</div>
            <span class="sendIfo">不发送</span>
            <el-switch style="margin:0 12px;"
                       v-model="switchTurn"
                       active-color="#91CF48"
                       inactive-color="#EAECF0"
                       @change="changeSwitch">
            </el-switch>
            <span class="sendIfo">发送</span>
          </el-form-item>
          <el-form-item v-if="switchTurn">
            <div class="cttitle">收件人<i class="required">*</i></div>
            <div class="select-wrap">
              <div class="select-span">
                <span v-for="(item, index) in selectSpan"
                      :key="index">{{item.userName ? item.userName : item.userPostName}} <i class="iconfont icon-cha"
                     @click="delSelect(item)"></i></span>
              </div>
              <i class="iconfont icon-bottom"
                 @click="organizationShow=!organizationShow"
                 :class="{'icon-top': organizationShow}"></i>
            </div>
            <transition name="sub-comments">
              <div class="organization"
                   v-show="organizationShow">
                <el-input placeholder="请输入组织名称/员工姓名"
                          prefix-icon="el-icon-search"
                          v-model="filterText"
                          class=""></el-input>
                <el-tree :data="orgListCopy"
                         show-checkbox
                         node-key="nodeId"
                         :render-after-expand="false"
                         :default-checked-keys="checkedKeys"
                         :filter-node-method="filterNode"
                         @check-change="handleCheckChange"
                         ref="treeForm"
                         :props="defaultProps">
                </el-tree>
              </div>
            </transition>
          </el-form-item>
          <div slot="footer"
               class="dialog-footer"
               style="display:flex;flex-direction:row-reverse">
            <el-button type="primary"
                       style="margin-left:20px"
                       @click="addFlowList">确 认</el-button>
            <el-button @click="addProgressFrom=false">关 闭</el-button>
          </div>
        </div>
      </el-form>
    </el-dialog>
    <!-- 视频播放 -->
    <div class="videoBox"
         v-if="videoBoxshow"
         @click="videoClose">
      <div style="width: 800px; height: 400px;position: relative;left: 50%;top: 50%;transform: translate(-50%, -50%);">
        <i class="iconfont icon-jinakangbaoicons18 videoCloseBtn"
           style="position: absolute; color: #fff; top: -10px; right: -10px; z-index: 1;font-size: 20px;cursor: pointer;"
           @click="videoClose"></i>
        <div @click.stop="videoBoxshow=true">
          <video id="myVideo"
                 class="video-js vjs-big-play-centered">
            <source :src="videoSrc"
                    type="video/mp4" />
            <p class="vjs-no-js"> 请开启Javascript脚本以便 <a href="http://videojs.com/html5-video-support/"
                 target="_blank"> 支持HTML5 video播放器 </a> </p>
          </video>
        </div>
      </div>
    </div>
    <!-- 删除提示弹窗 -->
    <el-dialog :visible.sync="deleteDialog"
               class="lockDialogClose"
               width="400px"
               center>
      <div class="lockDialogContent"
           style="padding-left: 40px">
        <img src="../../../../assets/delete2.png">
        <div>
          <div class="div1">删除</div>
          <div class="div2">确认删除该数据？</div>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <span class="cancel"
              @click="deleteDialog = false">取消</span>
        <span class="determine"
              @click="delRoom">确定</span>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import videojs from 'video.js'
import moment from 'moment'
import axios from 'axios'
import 'videojs-contrib-hls'
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import Drawer from '@/components/drawer.vue'
// import potClienDtl from '../../../financialManagement/mnangement/potlClientsList/components/potClienDtl'
import ailPreview from '@/components/ailPreview.vue'
import { toLocaleString, toLocaleFixed } from '@/utils/validate.js'
export default {
  name: 'hoursedetails',
  components: {
    Drawer,
    picturePrevie,
    // potClienDtl,
    aliUpload,
    aliDownLoad,
    ailPreview
  },
  props: {
    defaultAuthority: {
      type: Boolean,
      default: false
    },
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    roomInfo: {},
    options1: {},
    detailData: {  // detailData房源详情  detaileData 意向客户详情
      type: Object,
      default: {
        projectConditions: []
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.treeForm.filter(val)
    },
    detailData: {
      handler: function () {
        this.$refs['detailData'].resetFields()
        this.loadproject()
        if (this.detailData.imgUrls && this.detailData.imgUrls.length > 0) {
          this.selectedImg = this.detailData.imgUrls[0]
        } else {
          this.selectedImg = ''
          this.detailData.imgUrls = []
        }
        if (this.detailData.projectConditions.length > 0) {
          this.formatProjectConditions2()
          this.formatProjectConditions()
        } else {
          this.conditionCheckList = []
          this.needValue = {
            KWHVvalue: '',
            SWWERvalue: '',
            WASTE_WATERvalue: '',
            FEED_WATERvalue: '',
            AIR_CONDITIONvalue: '',
            OIL_DIAINvalue: '',
            FLUEvalue: '',
            CASvalue: ''
          }
          this.formatProjectConditions2()
        }
        // context.http.get(`/ywm/api/district-codes/${this.detailData.projectManagement.district}`).then(res => {
        //   this.provinces = res.data.address
        // })
        this.getRoomsFollowRecord() // 跟进记录
        this.getEnterInfo(this.detailData.id)
        // this.yxTenantRoomsCurr() // 当前意向客户
        // this.yxTenantRoomsCurrHistory() // 当前意向客户
        // this.tenantHistory()
        if (this.roomInfo) {
          this.roomInfoActive = this.detailData.id + ''
        }
      }
    }
  },
  created () {
    this.EngInfoList = this.$store.state.projectList // 工程条件列表
    this.industry1()
    this.industryFn(this.addParmas.tenantUse) // 工程条件列表
    this.EngInfoListInit(this.EngInfoList)
    if (this.detailData.imgUrls && this.detailData.imgUrls.length) {
      this.selectedImg = this.detailData.imgUrls[0]
    } else {
      this.selectedImg = null
    }
    this.getProjectList()
  },
  mounted () {

  },
  data () {
    var validatorArea1 = (rule, value, callback) => {
      if (Number(this.detailData.buildingArea) <= 0) {
        callback(new Error('建筑面积大于零'))
      } else if (Number(this.detailData.useArea) > Number(this.detailData.buildingArea)) {
        callback(new Error('使用面积不能大于建筑面积'))
      } else {
        callback()
      }
    }
    var validatorArea2 = (rule, value, callback) => {
      if (Number(this.detailData.useArea) > Number(this.detailData.buildingArea)) {
        callback(new Error('使用面积不能大于建筑面积'))
      } else {
        callback()
      }
    }
    return {
      deleteDialog: false,
      enterType: 'add',
      addEnterInfoId: '',
      addParmasEnterInfo: {
        roomId: '',
        rzEnterpriseId: '',
        moveIntoType: '',
        startTime: '',
        endTime: '',
        rentPriceType: 'MJ_MT',
        price: ''
      },
      addEnterInfoDialog: false,
      tableDataEnter: [], // 入驻信息表格
      addParmasEnterInfoRules: {},
      oldDetailData: [],
      industryIdArr1: [],
      industryIdArr2: [],
      industryIdArr3: [],
      industry1options: [],
      videoPng: require('../../../../assets/video.png'),
      videoBoxshow: false,
      videoSrc: '',
      roomInfoActive: '0',
      yearsList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      activeNames: ['1'],
      detailsShow: false, // 侧边弹窗
      project: [], // 工程条件列表
      options3: [
        { label: '元/m²·天', value: 'M2DAYS' },
        { label: '元/月', value: 'MONTH' },
        { label: '元/年', value: 'YEAR' }
      ],
      industryObj: {}, // 业态选中返回的obj
      customerSourceObj: {}, // 意向客户来源选中返回的obj
      addStep: 1,
      TenantDTORules: {
        projectManagementDTO: [
          { required: true, message: '请选择所在项目', trigger: 'change' }
        ],
        yxTenantName: [
          { required: true, message: '请输入企业名称', trigger: 'change' }
        ],
        referred: [
          { required: true, message: '请输入品牌名称', trigger: 'change' }
        ],
        industryId: [
          { required: true, message: '请选择业态', trigger: 'change' }
        ],
        lowArea: [
          { required: true, message: '请填写需求面积', trigger: 'change' }
        ],
        highArea: [
          { required: true, message: '请填写需求面积', trigger: 'change' }
        ],
        lowPrice: [
          { required: true, message: '请填写心理价位', trigger: 'change' }
        ],
        highPrice: [
          { required: true, message: '请填写心理价位', trigger: 'change' }
        ],
        contact: [
          { required: true, message: '请填写联系人', trigger: 'change' }
        ],
        telephone: [
          { required: true, message: '请输入正确的手机号或固定电话', trigger: 'change' }
        ],
        tenantUse: [
          { required: true, message: '请选择用途', trigger: 'change' }
        ]
      },
      addProgressRules: {
        followTime: [
          { required: true, message: '请填写跟进时间', trigger: 'change' }
        ],
        followContent: [
          { required: true, message: '请填写跟进记录', trigger: 'change' }
        ]
      },
      addParmas: {
        tenantUse: 'SHOP',
        projectManagementDTO: '', // 项目ID
        customerType: 'COMPANY', // 意向客户类型*
        yxTenantName: '', // 企业名称/姓名
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
      tenantUseList: [
        {
          label: '商铺',
          value: 'SHOP'
        },
        {
          label: '办公',
          value: 'WORK'
        },
        {
          label: '菜场',
          value: 'MARKET'
        }
      ],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      dialogFormVisible: false,
      tableData1: [],
      currentPage1: 1,
      total1: 0,
      pgSize1: 15,
      tableData2: [],
      currentPage2: 1,
      total2: 0,
      pgSize2: 15,
      table1Parems: {
        brandName: '',
        industryId: '',
        contact: ''
      },
      table2Parems: {
        brandName: '',
        industryId: '',
        contact: ''
      },
      ruleForm: {
        followTime: '',
        followContent: '',
        zcFollowType: 'ROOM',
        annexes: []
      },
      rules: {
        followTime: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        followContent: [
          { required: true, message: '请输入内容', trigger: 'change' }
        ]
      },
      dialogVisible: false,
      timeLineListData: [],
      timeLineListData1: [],
      rightTab: 1,
      EngInfoList: null,
      keyVersions: 0,
      projectList: [],
      hourList: [],
      buildingList: [],
      provinces: null,
      imgArr: [],
      num: 0,
      showPicture: false,
      fileType: ['png', 'jpg', 'mp4'],
      fileType1: ['png', 'jpg'],
      upLoadText: '',
      selectIndex: 0,
      selectedImg: '',
      activeName: '1',
      shopList: [
        { name: '1', label: '1-10000001' },
        { name: '2', label: '1-10000002' },
        { name: '3', label: '1-10000003' },
        { name: '4', label: '1-10000004' },
        { name: '5', label: '1-10000005' },
        { name: '6', label: '1-10000006' },
        { name: '7', label: '1-10000007' },
        { name: '8', label: '1-10000008' },
        { name: '9', label: '1-10000009' },
        { name: '10', label: '1-100000010' }

      ],
      readonly1: true,
      readonly2: true,
      drawerTitle: '房源详情',
      detailDataRules: {
        projectManagement: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        building: [
          { required: true, message: '请选择楼宇', trigger: 'change' }
        ],
        floor: [
          { required: true, message: '请选择楼层', trigger: 'change' }
        ],
        shopNumber: [
          { required: true, message: '请输入房源号', trigger: 'blur' }
        ],
        // industry: [
        //   { required: true, message: '请选择预期业态', trigger: 'change' }
        // ],
        buildingArea: [
          { required: true, message: '请输入建筑面积', trigger: 'blur' },
          { trigger: 'blur', validator: validatorArea1 }
        ],
        useArea: [
          { trigger: 'blur', validator: validatorArea2 }
        ],
        investmentStatus: [
          { required: true, message: '请选择招商状态', trigger: 'change' }
        ],
        roomsUse: [
          { required: true, message: '请选择用途', trigger: 'change' }
        ],
        telephone: [
          { pattern: /^1(3|4|5|7|8)\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ]
        // expectedUnitPrice: [
        //   { required: true, message: '招商指导价', trigger: 'blur' }
        // ]
      },
      industryList: [],
      yxkhFrom: [],
      projectManagemenId: '', // 此条记录的项目Id
      building: { // 房源房源信息

      },
      followRecordDTOParams: {// 新增跟进记录入参
        annexes: [],
        followContent: '',
        followTime: '',
        price: '', // 心理价位
        priceUnit: 'M2DAYS', // 价格单位
        leaseYear: '', // 租赁年限
        increment: '', // 递增
        rooms: [],
        yxTenantDTO: ''
      },
      addProgressFrom: false, // 新增更近记录
      detaileData: { // detailData房源详情  detaileData 意向客户详情
        imgUrls: [],
        projectManagementDTO: {
          projectName: ''
        },
        building: {},
        floor: {}
      },
      myPlayer: null,
      switchTurn: false,
      selectSpan: [],
      organizationShow: false,
      filterText: '',
      orgListCopy: [],
      checkedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      fileType_cost: [],
      iconImg: 'icon-shangchuanfujianicon',
      historyTab: 1,
      tableDataHistory: [],
      currentPage3: 1,
      total3: 0,
      pgSize3: 15,
      table3Parems: {
        name: '',
        industryId: ''
      },
      isSubmit: false,
      roomsUseOption: [
        { value: 'SHOP', name: '商铺' },
        { value: 'WORK', name: '办公' },
        { value: 'MARKET', name: '菜场' }
      ],
      upLoadText1: '上传照片'
    }
  },
  methods: {
    addFollowUp () {
      this.dialogVisible = true
      this.switchTurn = false
      this.selectSpan = []
      this.queryOrganizeList()
    },
    delRoom () {
      let row = this.addParmasEnterInfo
      context.http.delete(`/cms/api/enterpriseRooms/${row.id}`).then(res => {
        this.$message.success('删除成功')
        this.deleteDialog = false
        this.getEnterInfo(this.detailData.id)
        this.$emit('queryList')
        this.enterInfoDialogClose()
      }).catch(error => {
        console.log(error)
        this.deleteDialog = false
      })
    },
    editEnter (index, row) {
      this.enterType = 'edit'
      this.addEnterInfoId = row.rzEnterpriseName
      this.addParmasEnterInfo = row
      this.addEnterInfoDialog = true
    },
    showEnterInfoDialog () {
      this.enterType = 'add'
      this.addParmasEnterInfo.roomId = this.detailData.id
      this.addEnterInfoDialog = true
    },
    handleSelectTeant (item) {
      console.log(item)
      this.addParmasEnterInfo.rzEnterpriseId = item.id
    },
    enterInfoDialogClose () {
      this.addEnterInfoId = ''
      this.addParmasEnterInfo = {
        roomId: '',
        rzEnterpriseId: '',
        moveIntoType: '',
        startTime: '',
        endTime: '',
        rentPriceType: 'MJ_MT',
        price: ''
      }
      this.addEnterInfoDialog = false
    },
    addEnterInfo () { // 新增
      if (!this.addParmasEnterInfo.rzEnterpriseId || this.addEnterInfoId === '') {
        this.$message.error('请选择企业')
        return
      }
      if (moment(this.addParmasEnterInfo.endTime).isBefore(this.addParmasEnterInfo.startTime)) {
        this.$message.error('起始日期不能大于截止日期')
        return
      }
      if (this.enterType === 'add') {
        context.http.post('/cms/api/enterpriseRooms', this.addParmasEnterInfo).then(res => {
          if (res) {
            this.$message.success('新增成功')
            this.enterInfoDialogClose()
            this.getEnterInfo(this.detailData.id)
            this.$emit('queryList')
          }
        }).catch(error => {
          console.log(error)
        })
      } else {
        context.http.put('/cms/api/enterpriseRooms', this.addParmasEnterInfo).then(res => {
          if (res) {
            this.$message.success('修改成功')
            this.enterInfoDialogClose()
            this.getEnterInfo(this.detailData.id)
            this.$emit('queryList')
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },
    async getEnterInfo (id) { // 入驻信息
      let result = await context.http.get(`/cms/api/enterpriseRooms/roomId/${id}`)
      this.tableDataEnter = result.data
    },
    async searchTeantName (queryString, callback) {
      var list = [{}]
      if (!queryString || queryString === '') {
        return false
      }
      let result = await context.http.get('/cms/api/tenant', {
        page: 0,
        size: 99,
        queryWord: queryString,
        useStatus: 'USING'
      })
      if (result.data) {
        var results = result.data.content
        callback(results)
      }
    },
    dateFormat (row, column) {
      if (!row.startTime || !row.endTime) {
        return '-'
      } else {
        return row.startTime + ' ~ ' + row.endTime
      }
    },
    priceFomat (row, column) {
      let price = row.price
      let rentPriceType = ''
      if (row.rentPriceType === 'MJ_MT') {
        rentPriceType = '元/m²·天'
      } else if (row.rentPriceType === 'MONTH') {
        rentPriceType = '元/月'
      } else if (row.rentPriceType === 'YEAR') {
        rentPriceType = '元/年'
      }
      if (!price) {
        return '-'
      } else {
        return price + rentPriceType
      }
    },
    formatUnitPrice (price) {
      let unitPrice = ''
      if (price) {
        price = Number(price)
        unitPrice = price.toFixed(2)
      }
      return unitPrice
    },
    handleChange1 (arr) {
      this.table1Parems.industryId = arr[1]
      console.log(arr)
    },
    handleChange2 (arr) {
      this.table2Parems.industryId = arr[1]
      console.log(arr)
    },
    handleChange3 (arr) {
      this.table3Parems.industryId = arr[1]
      console.log(arr)
    },
    async industry1 () {
      let result1 = await context.http.get('/uaa/api/paramet-managements/name?name=业态')
      let result2 = await context.http.get('/uaa/api/paramet-managements/name?name=行业')
      let result3 = await context.http.get('/uaa/api/paramet-managements/name?name=菜场业态')
      let obj1 = {
        value: 'SHOP',
        label: '商铺',
        children: []
      }
      obj1.children = result1.data.map((item, index) => {
        return { value: item.id, label: item.value }
      })
      let obj2 = {
        value: 'WORK',
        label: '办公',
        children: []
      }
      obj2.children = result2.data.map((item, index) => {
        return { value: item.id, label: item.value }
      })
      let obj3 = {
        value: 'MARKET',
        label: '菜场',
        children: []
      }
      obj3.children = result3.data.map((item, index) => {
        return { value: item.id, label: item.value }
      })
      this.industry1options.push(obj1, obj2, obj3)
    },
    async industryFn (tenantUse) {
      let name = ''
      if (tenantUse === 'SHOP') {
        name = '业态'
      } else if (tenantUse === 'WORK') {
        name = '行业'
      } else {
        name = '菜场业态'
      }
      let result = await context.http.get(`/uaa/api/paramet-managements/name?name=${name}`)
      this.addParmas.industryId = ''
      this.addParmas.industryName = ''
      this.industryList = result.data
    },
    setAnnexs (annexURL, annexName) {
      this.ruleForm.annexes.push({ 'annexURL': annexURL, 'annexName': annexName })
    },
    setAnnexsAli (annexURL, annexName) {
      this.detailData.roomsImageName = annexName
      this.detailData.roomsImageUrl = annexURL
    },
    deleFileFlow (item, index) {
      this.ruleForm.annexes.splice(index, 1)
    },
    setFile (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    addFlowListSuccess (data) { // 新增跟进成功 参数为跟进信息
      // this.getPotlClientsList()
      this.timeLineListData1 = data
    },
    formatreplace (description) {
      if (!description) {
        return
      }
      let html = description.replace(/\n/g, '<br/>')
      html = html.replace(/↵/g, '<br/>')
      return html
    },
    formatterAreaUtils (row) {
      return row.contractArea + 'm²'
    },
    formatterPriceUtils (row) {
      return toLocaleString(row.contractPrice) + '元/m²天'
    },
    formatterDemandArea (row) {
      return row.demandArea + 'm²'
    },
    formatterContractDate (row) {
      return row.contractStartDate + '~' + row.contractEndDate
    },
    nodeColor (index) {
      return index === 0 ? '#3575F6' : '#D3DBEB'
    },
    formatApprovalDate (time) {
      if (time) {
        time = time.substr(0, time.lastIndexOf('T'))
        return time
      }
    },
    shopDetails (roomId) {
      this.detailsShow = false
      setTimeout(() => {
        this.$emit('shopDetails', roomId, 2)
      }, 500)
      console.log(roomId)
    },
    seachList1 () {
      this.currentPage1 = 1
      this.yxTenantRoomsCurr()
    },
    seachList2 () {
      this.currentPage2 = 1
      this.yxTenantRoomsCurrHistory()
    },
    seachList3 () {
      this.currentPage3 = 1
      this.tenantHistory()
    },
    videoClose () {
      // this.myPlayer.pause()
      // this.myPlayer.currentTime(0)
      this.myPlayer.dispose()
      this.videoBoxshow = false
    },
    initVideo () {
      // 初始化视频方法
      this.myPlayer = this.$video(myVideo, {
        // 确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
        controls: true,
        // 自动播放属性,muted:静音播放
        // autoplay: 'muted',
        // 建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
        preload: 'auto',
        // 设置视频播放器的显示宽度（以像素为单位）
        width: '800px',
        // 设置视频播放器的显示高度（以像素为单位）
        height: '400px'
      }, function () {
        this.play()
      })
    },
    playVideo (item, index) {
      this.videoSrc = item
      this.videoBoxshow = true
      this.$nextTick(() => {
        this.initVideo()
      })
    },
    setAnnex (annexURL) {  // 子组件上传成功返回文件url 和名字
      if (this.isVideo(annexURL)) { // 判断是否是视频文件如果是则视频文件放在数组前面
        this.detailData.imgUrls.unshift(annexURL)
      } else {
        this.detailData.imgUrls.push(annexURL)
        this.selectedImg = this.detailData.imgUrls[0]
      }
    },
    isVideo (url) { // 判断链接是否是视频链接
      if (!url) {
        return
      }
      let index = url.lastIndexOf('.')
      let str = url.substring(index + 1, url.length)
      str.toLowerCase()
      // console.log(str)
      if (str === 'mp4') {
        return true
      } else {
        return false
      }
    },
    toDetails (index, row) { // 查看
      context.http.get(`cms/api/yxTenant/${row.tenantId}`).then(res => {
        if (res) {
          this.followRecordDTOParams.yxTenantDTO = res.data
          this.yxTenantDTOStorage = res.data
          if (res.data.projectManagementDTO) {
            this.projectManagemenId = res.data.projectManagementDTO.id // 此条记录的项目id
          }
          this.pageType = 'readOnly'
          this.detaileData = res.data
          context.http.get(`cms/api/followRecords/${row.tenantId}`).then(result => {
            this.timeLineListData1 = result.data
            this.detailsShow = true
            this.onHide()
          })
        }
      })
    },
    formatterlastFollowTime (row, type) {
      if (type === 'year') {
        return row.lastFollowTime.substr(0, 10)
      } else {
        return row.lastFollowTime.substr(11)
      }
    },
    formatterPrice (row, column) {
      if (row.priceUnit === 'M2DAYS') {
        return row.price + '元/㎡天'
      } else if (row.priceUnit === 'MONTH') {
        return row.price + '元/月'
      } else if (row.priceUnit === 'YEAR') {
        return row.price + '元/年'
      }
    },
    yxTenantRoomsCurr () { // 查询房源下当前意向客户
      let params = this.table1Parems
      params.page = this.currentPage1 - 1
      params.size = this.pgSize1
      params.roomId = this.detailData.id
      context.http.get('cms/api/yxTenantRooms/page/curr', params).then(res => {
        this.tableData1 = res.data
        this.total1 = Number(res.headers['x-total-count'])
      })
    },
    yxTenantRoomsCurrHistory () { // 查询房源下历史意向客户
      let params = this.table2Parems
      params.page = this.currentPage2 - 1
      params.size = this.pgSize2
      params.roomId = this.detailData.id
      context.http.get('cms/api/yxTenantRooms/page/history', params).then(res => {
        this.tableData2 = res.data
        this.total2 = Number(res.headers['x-total-count'])
      })
    },
    tenantHistory () { // 查询历史客户
      let params = this.table3Parems
      params.page = this.currentPage3 - 1
      params.size = this.pgSize3
      params.roomsId = this.detailData.id
      params.sort = 'startDate,desc'
      context.http.get('cms/api/rooms/historyTenant', params).then(res => {
        this.tableDataHistory = res.data
        this.total3 = Number(res.headers['x-total-count'])
      })
    },
    deleFile (item, index, type) {
      if (type === 'yx') {
        this.addParmas.annexes.splice(index, 1)
      } else {
        this.followRecordDTOParams.annexes.splice(index, 1)
      }
    },
    setAnnex1 (annexURL, annexName) {
      this.addParmas.annexes.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
    },
    deitReadonly () {
      this.readonly1 = !this.readonly1
    },
    imageChange (state, event) {
      let files = event.target.files
      let fileSize = files[0].size
      let form = new FormData()
      form.append('file', files[0])
      let name = files[0].name
      let annexes = ''
      if (state === 'addFlowList') {
        annexes = this.followRecordDTOParams.annexes
      } else if (state === 'addapp') {
        annexes = this.addParmas.annexes
      }
      if (parseInt(fileSize) > 1024 * 1024 * 20) { // 不大于20M
        this.$message({
          message: '文件大小不超过20M',
          type: 'error'
        })
        return
      }
      for (let i = 0; i < annexes.length; i++) {
        if (annexes[i].annexName === name) {
          return false
        }
      }
      event.target.value = ''
      context.http.post('/ywm/api/image-multipart', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        // this.$set(this.addParmas, 'annexName', name)
        // this.$set(this.addParmas, 'annexURL', res.data)
        if (state === 'addFlowList') {
          this.followRecordDTOParams.annexes.push({
            'annexName': name,
            'annexURL': res.data
          })
        } else if (state === 'addapp') {
          this.addParmas.annexes.push({
            'annexName': name,
            'annexURL': res.data
          })
        }
      }).catch(error => {
        console.info(error)
      })
      // this.addParmas.annexes = this.annexesList
      // this.$forceUpdate()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    autoChange () {
      if (this.addParmas.customerType === 'PERSONAL') {
        this.addParmas.contact = this.addParmas.yxTenantName
      }
    },
    getProjectConditions () { // 便利工程条件格式
      let project = this.project
      this.addParmas.projectConditions = []
      for (let i = 0; i < project.length; i++) {
        // if (project[i].value !== '') {
        if (project[i].isChecked) {
          this.addParmas.projectConditions.push({
            projectType: project[i].id,
            needValue: project[i].needValue
          })
        }
      }
      // console.log(this.addParmas.projectConditions)
    },
    save () { // 新增提交
      // this.getProjectConditions()// 便利工程条件格式
      if (this.isSubmit) return
      this.isSubmit = true
      console.log(this.addParmas)
      context.http.post(`cms/api/yxTenant/withRoom/${this.detailData.id}`, this.addParmas).then(res => {
        this.isSubmit = false
        this.$message({
          type: 'success',
          message: '新增成功',
          center: true
        })
        this.yxTenantRoomsCurr()
        this.yxTenantRoomsCurrHistory()
        this.addStep = 1
        this.dialogFormVisible = false
      }).catch(error => {
        console.log(error)
        this.isSubmit = false
      })
    },
    radioChange () {
      console.log(this.addParmas.customerType)
    },
    customerSourceChange () { // 改变意向客户来源
      // console.log(this.customerSourceObj)
      this.addParmas.customerSourceId = this.customerSourceObj.id
      this.addParmas.customerSource = this.customerSourceObj.value
    },
    industryChange () { // 改变业态
      // console.log(this.industryObj)
      this.addParmas.industryId = this.industryObj.id
      this.addParmas.industryName = this.industryObj.value
    },
    changeStep (n) {
      // console.log(this.project)
      if (this.addStep === 1) {
        this.$refs['addParmas'].validate((valid) => {
          if (valid) {
            this.addStep = n
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.addStep = n
      }
    },
    closeFn () {
      this.dialogFormVisible = false
    },
    toAddPotlClients () { // 新增意向客户
      this.addParmas = {
        tenantUse: 'SHOP',
        projectManagementDTO: '', // 项目ID
        customerType: 'COMPANY', // 意向客户类型*
        yxTenantName: '', // 企业名称/姓名
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
      }
      this.industryObj.id = ''
      this.industryObj.value = ''
      this.customerSourceObj.id = ''
      this.customerSourceObj.value = ''
      this.industryFn(this.addParmas.tenantUse) // 行业列表被置空   从新请求
      this.customerSource()// 客户来源
      this.getProjectList()// 请求工程条件列表
      this.dialogFormVisible = true
      if (this.$refs['addParmas'] !== undefined) {
        this.$refs['addParmas'].resetFields()
      }
      this.addParmas.projectManagementDTO = this.detailData.projectManagement
    },
    // async industryFn () {
    //   let result = await context.http.get('/uaa/api/paramet-managements/name?name=行业')
    //   this.industryList = result.data
    // },
    async customerSource () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=客户来源')
      this.yxkhFrom = result.data
    },
    getProjectList () { // 获取工程条件列表
      context.http.get('uaa/api/paramet-managements/name?name=工程条件').then(res => {
        this.project = res.data
        for (let i = 0; i < this.project.length; i++) {
          this.$set(this.project[i], 'isChecked', false)
          this.$set(this.project[i], 'needValue', null)
        }
        // console.log(this.project)
      }).catch(error => {
        console.info(error)
      })
    },
    addRecord () { // 新增房源跟进记录
      if (this.selectSpan.length === 0 && this.switchTurn) {
        this.$message.error('请选择收件人！')
        return
      }
      let arr = []
      this.selectSpan.forEach(ele => {
        arr.push(ele.userId)
      })
      arr = [...new Set(arr)]
      this.ruleForm.messageFlg = this.switchTurn
      this.ruleForm.userIds = arr
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.roomsId = this.detailData.id
          context.http.post('/cms/api/roomsFollowRecord', this.ruleForm).then(res => {
            this.$message.success('新增成功')
            this.getRoomsFollowRecord()
            this.dialogVisibleClose()
            this.$refs['ruleForm'].resetFields()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getRoomsFollowRecord () { // 查询房源跟进记录
      context.http.get(`/cms/api/roomsFollowRecord/roomId/${this.detailData.id}?zcFollowType=ROOM`).then(res => {
        this.timeLineListData = res.data
      })
    },
    cancelCondition () {
      this.readonly2 = true
      this.$emit('handleEdit', 0, this.detailData)
    },
    putprojectCondition () { // 修改工程条件
      this.projectConditions()
      let params = {}
      params.projectConditions = this.detailData.projectConditions
      params.roomId = this.detailData.id
      context.http.put('/cms/api/rooms/projectCondition', params).then(res => {
        if (res.status === 200) {
          this.$message.success('保存成功')
          this.$emit('handleEdit', 0, this.detailData)
          this.readonly2 = true
        }
      })
    },
    onHide () {
      this.$emit('drawerClose') // 房源id
      // this.EngInfoListInit(this.EngInfoList)
      ++this.keyVersions
      this.readonly1 = true
      this.readonly2 = true
      this.selProject = false
      this.selHourse = false
      this.drawerTitle = '房源详情'
      // this.detailsShow = true
    },
    projectConditions () { // 入参处理
      let EngInfoList = this.EngInfoList
      this.detailData.projectConditions = []
      for (let i = 0; i < EngInfoList.length; i++) {
        if ((EngInfoList[i].needValue || EngInfoList[i].needValue === '') && EngInfoList[i].isChecked) {
          this.detailData.projectConditions.push({
            projectType: EngInfoList[i].id,
            needValue: EngInfoList[i].needValue
          })
        }
      }
      // console.log('projectConditions', this.detailData.projectConditions)
    },
    addcancel () {
      this.readonly1 = true
      this.$emit('handleEdit', 0, this.detailData)
      this.$emit('shopDetails', this.detailData.id)
    },
    addHourse (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.projectConditions()
          let detailData = JSON.parse(JSON.stringify(this.detailData))
          if (detailData.expectedUnitPrice) {
            detailData.expectedUnitPrice = Number(detailData.expectedUnitPrice)
            detailData.expectedUnitPrice = detailData.expectedUnitPrice.toFixed(2)
          }
          this.buildingList.forEach(item => {
            if (item.id === detailData.floor) {
              detailData.floor = item
            }
          })
          // console.log(detailData.expectedUnitPrice)
          context.http.put('/cms/api/rooms', detailData).then(res => {
            if (res.status === 200) {
              this.$message.success('保存成功')
              this.$emit('handleEdit', 0, detailData)
              this.$emit('shopDetails', detailData.id)
              this.$emit('queryList')
              this.readonly1 = true
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    current_change1 (currentPage) {
      this.currentPage1 = currentPage
      this.yxTenantRoomsCurr()
    },
    current_change2 (currentPage) {
      this.currentPage2 = currentPage
      this.yxTenantRoomsCurrHistory()
    },
    current_change3 (currentPage) {
      this.currentPage3 = currentPage
      this.tenantHistory()
    },
    dialogVisibleClose () {
      this.filterText = ''
      this.ruleForm.annexes = []
      this.$refs['ruleForm'].resetFields()
      this.dialogVisible = false
    },
    formatTimeLineTitle (type) { // 时间线头部遍历
      switch (type) {
        case 'INPUT':
          return '录入'
        case 'FOLLOW':
          return '跟进'
        case 'PROCESS_RUNING':
          return '审批中'
        case 'PROCESS_AGREED':
          return '审批通过'
      }
    },
    rightTabChange (n) {
      this.rightTab = n
    },
    historyTabChange (n) {
      this.historyTab = n
    },
    EngInfoListInit (arr) { // 初始化工程条件列表
      for (let i = 0; i < arr.length; i++) {
        this.$set(arr[i], 'isChecked', false)
        this.$set(arr[i], 'needValue', null)
      }
      // console.log(this.EngInfoList)
    },
    changeHandler (value, item, index) {
      if (!value) {
        this.$set(this.EngInfoList[index], 'needValue', null)
        this.$set(this.EngInfoList[index], 'isChecked', false)
      } else {
        this.$set(this.EngInfoList[index], 'needValue', '')
        this.$set(this.EngInfoList[index], 'isChecked', true)
      }
      this.$forceUpdate()
    },
    changeHandler1 (value, item, index) {
      if (!value) {
        this.$set(this.project[index], 'needValue', null)
        this.$set(this.project[index], 'isChecked', false)
      } else {
        this.$set(this.project[index], 'needValue', '')
        this.$set(this.project[index], 'isChecked', true)
      }
      this.$forceUpdate()
    },
    formatProjectConditions () { // 详情参数处理
      let projectData = this.detailData.projectConditions
      for (let i = 0; i < projectData.length; i++) {
        for (let k = 0; k < this.EngInfoList.length; k++) {
          if (Number(projectData[i].projectType) === this.EngInfoList[k].id) {
            this.$set(this.EngInfoList[k], 'needValue', projectData[i].needValue ? projectData[i].needValue : '')
            this.$set(this.EngInfoList[k], 'isChecked', true)
          }
        }
      }
      ++this.keyVersions
    },
    formatProjectConditions2 () { // 详情参数处理
      for (let k = 0; k < this.EngInfoList.length; k++) {
        this.$set(this.EngInfoList[k], 'needValue', '')
        this.$set(this.EngInfoList[k], 'isChecked', false)
      }
    },
    async loadproject () {
      // context.http.get('/cms/api/project-managements', { useStatus: 'USING' }).then(res => {
      //   this.projectList = res.data
      // })
      context.http.get('/cms/api/floors/building/' + this.detailData.building.id).then(res => {
        this.buildingList = res.data
      })
      // context.http.get('/cms/api/buildings', { projectId: this.detailData.projectManagement.id }).then(res => {
      //   this.hourList = res.data.buildingListDTOS
      // })
      // context.http.get('/uaa/api/paramet-managements/name?name=' + '装修程度').then(res => {
      //   this.decorate = res.data
      // })
    },
    chooseItem (state, item) {
      if (state === 'project') {
        this.selProject = !this.selProject
        this.detailData.projectManagement = item
        this.detailData.building = {}
        this.buildingList = []
        if (this.detailData.floor) {
          this.detailData.floor = null
        }
        context.http.get('/cms/api/buildings', { projectId: item.id }).then(res => {
          this.hourList = res.data.buildingListDTOS
        })
      } else {
        this.selHourse = !this.selHourse
        this.detailData.building = item
        if (this.detailData.floor) {
          this.detailData.floor = null
        }
        context.http.get('/cms/api/floors/building/' + this.detailData.building.id).then(res => {
          this.buildingList = res.data
        })
      }
    },
    getHsRate () {
      if (this.detailData.useArea && this.detailData.buildingArea) {
        this.detailData.getRoomsRate = ((this.detailData.useArea / this.detailData.buildingArea) * 100).toFixed(2)
      }
    },
    industry (state) {
      if (state === 'LIFE') {
        return '生活配套'
      } else if (state === 'FOOD') {
        return '餐饮'
      } else if (state === 'RETAIL') {
        return '零售'
      } else if (state === 'BDUCATION') {
        return '亲子教育'
      } else if (state === 'CSE') {
        return '娱乐'
      } else if (state === 'FINANCIAL') {
        return '金融'
      } else if (state === 'REALESTATE') {
        return '房地产'
      } else if (state === 'SERVICE') {
        return '其他'
      }
    },
    investmentStatus (state) {
      if (state === 'OK') {
        return '普通房源'
      } else if (state === 'NO') {
        return '自用'
      } else if (state === 'FICTITIOUS') {
        return '虚拟房源'
      }
    },
    priceUnit (price, unit) {
      Number(price)
      if (unit === 'M2DAYS') {
        return price ? price.toFixed(2) + '元/㎡天' : '-'
      } else if (unit === 'M2MONTH') {
        return price ? price.toFixed(2) + '元/㎡月' : '-'
      } else if (unit === 'DAY') {
        return price ? price.toFixed(2) + '元/天' : '-'
      } else if (unit === 'MONTH') {
        return price ? price.toFixed(2) + '元/月' : '-'
      }
    },
    useStatus (state) {
      if (state === 'USING') {
        return '使用中'
      } else if (state === 'DISABLE') {
        return '已停用'
      }
    },
    roomsUseStatus (state) {
      if (state === 'SHOP') {
        return '商铺'
      } else if (state === 'WORK') {
        return '办公'
      } else if (state === 'MARKET') {
        return '菜场'
      }
    },
    formatFirstDisplay (str) {
      switch (str) {
        case 'CONTRACT':
          return '优先合同'
        case 'YXTENANT':
          return '优先客户列表'
      }
    },
    showImgList (itm, idx) {
      let imgArr = []
      this.detailData.imgUrls.forEach(item => {
        if (!this.isVideo(item)) {
          imgArr.push(item)
        }
      })
      this.imgArr = imgArr
      console.log(imgArr)
      this.num = idx - (this.detailData.imgUrls.length - imgArr.length)
      this.showPicture = true
    },
    showPictureAli (imgUrl) {
      this.showPicture = true
      this.imgArr = [imgUrl]
    },
    pictureClose () {
      this.showPicture = false
    },
    changeImg (item, index) {
      this.selectIndex = index
      this.selectedImg = this.detailData.imgUrls[this.selectIndex]
    },
    selectImg (type) {
      if (type === 'add') {
        if (this.selectIndex === this.detailData.imgUrls.length - 1) {
          return
        }
        this.selectIndex += 1
      } else {
        if (this.selectIndex === 0) {
          return
        }
        this.selectIndex -= 1
      }
      this.selectedImg = this.detailData.imgUrls[this.selectIndex]
    },
    delimg (index) {
      this.detailData.imgUrls.splice(index, 1)
      this.selectIndex = 0
      this.selectedImg = this.detailData.imgUrls[0]
    },
    handleClick (tab, event) {
      // console.log(tab.label, tab.name)
      this.$emit('upDateStoreDetails', tab.name)
    },
    addProgressFn () { // 打开写进度弹窗
      this.getRooms(this.projectManagemenId) // 新增更近记录页面项目房源信息
    },
    async getRooms (id) {
      let res = await context.http.get('/cms/api/rooms/projectManagement?projectManagementId=' + id)
      this.building = res.data
      this.addProgressFrom = true
      this.switchTurn = false
      this.selectSpan = []
    },
    addProgressFromClose () {
      this.followRecordDTOParams = {// 新增跟进记录入参
        annexes: [],
        followContent: '',
        followTime: '',
        price: '', // 心理价位
        priceUnit: 'M2DAYS', // 价格单位
        leaseYear: '', // 租赁年限
        increment: '', // 递增
        rooms: [],
        yxTenantDTO: ''
      }
      this.followRecordDTOParams.yxTenantDTO = this.yxTenantDTOStorage
    },
    addFlowList () { // 新增更近记录
      console.log('1')
      if (this.selectSpan.length === 0 && this.switchTurn) {
        this.$message.error('请选择收件人！')
        return
      }
      let arr = []
      this.selectSpan.forEach(ele => {
        arr.push(ele.userId)
      })
      arr = [...new Set(arr)]
      this.followRecordDTOParams.messageFlg = this.switchTurn
      this.followRecordDTOParams.userIds = arr
      this.$refs['followRecordDTOParams'].validate((valid) => {
        if (valid) {
          context.http.post('cms/api/followRecord', this.followRecordDTOParams).then(res => {
            context.http.get(`cms/api/followRecords/${this.followRecordDTOParams.yxTenantDTO.id}`).then(result => {
              this.timeLineListData1 = result.data
              this.$message({
                type: 'success',
                message: '新增成功'
              })
              this.addProgressFrom = false
              this.addProgressFromClose()
              // this.getPotlClientsList()
              context.http.get(`cms/api/yxTenant/${this.yxTenantDTOStorage.id}`).then(res => {
                if (res) {
                  this.detaileData = res.data // detailData房源详情  detaileData 意向客户详情
                }
              })
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    detailsClose () { // 关闭意向客户 提交打开房源详情事件 参数房源id
      console.log('detailsClose')
      this.$emit('showStoreDetails', this.detailData.id)
      this.detailsShow = false
    },
    refreshList () {
      context.http.get(`cms/api/yxTenant/${this.yxTenantDTOStorage.id}`).then(res => {
        if (res) {
          this.detaileData = res.data // detailData房源详情  detaileData 意向客户详情
          this.yxTenantRoomsCurr() // 刷新房源详情页当前和历史意向客户
          this.yxTenantRoomsCurrHistory()
          this.tenantHistory()
        }
      })
    },
    changeSwitch (val) {
      this.selectSpan = []
      this.$message({
        message: '切换成功',
        type: 'success'
      })
    },
    // 收件人
    delSelect (data) {
      let selectSpan = this.selectSpan
      selectSpan.forEach((ele, index) => {
        if (ele.nodeId === data.nodeId) {
          this.selectSpan.splice(index, 1)
          this.$refs.treeForm.setChecked(ele, false)
        }
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleCheckChange (data, checked, indeterminate) {
      let selectSpan = this.selectSpan
      if (checked && !data.disabled && data.userId !== null) {
        selectSpan.push(data)
      } else {
        selectSpan.forEach((ele, index) => {
          if (ele.nodeId === data.nodeId) {
            selectSpan.splice(index, 1)
          }
        })
      }
      this.selectSpan = selectSpan
    },
    async queryOrganizeList () {
      this.orgListCopy = []
      context.http.get('/uaa/api/organizes/report').then(res => {
        if (res.status === 200) {
          this.orgList = res.data
          this.orgListCopy = JSON.parse(JSON.stringify(res.data))
          let cascaderData = []
          this.orgListCopy.forEach(item => {
            cascaderData.push(this.parseOrganize(item))
          })
          this.orgListCopy = cascaderData
        }
      })
    },
    parseOrganize (organizeTree) {
      if (organizeTree.reporterDTOList.length === 0) {
        return {
          userPostId: organizeTree.postId,
          userPostName: organizeTree.name,
          userName: organizeTree.userName,
          userId: organizeTree.userId,
          nodeId: organizeTree.nodeId,
          // label: (organizeTree.userName === null ? '' : organizeTree.userName) + '(' + (organizeTree.name === null ? '' : organizeTree.name) + ')',
          label: this.formateName(organizeTree),
          disabled: organizeTree.name === ''
        }
      } else {
        return {
          userPostId: organizeTree.postId,
          label: this.formateName(organizeTree),
          userPostName: organizeTree.name,
          userName: organizeTree.userName,
          userId: organizeTree.userId,
          nodeId: organizeTree.nodeId,
          disabled: organizeTree.name === '',
          children: organizeTree.reporterDTOList.map(item => {
            return this.parseOrganize(item)
          })
        }
      }
    },
    formateName (organizeTree) {
      let str = ''
      if (organizeTree.userName === null) {
        str = ''
      } else {
        str += organizeTree.userName
      }
      if (organizeTree.userName === null && organizeTree.name === null) {
        str += ''
      } else if (organizeTree.userName === null && organizeTree.name !== null) {
        str += organizeTree.name
      } else if (organizeTree.userName !== null && organizeTree.name !== null) {
        str += '(' + organizeTree.name + ')'
      }
      return str
    },
    tenantHandle (index, row) {
      console.log(row)
      this.$emit('tenantHandleEdit', index, row)
    }
  }
}
</script>
<style lang="scss">
.selectAppend {
  .el-input__icon {
    width: 20px;
  }
  .el-input-group__append {
    padding: 0 15px 0 10px;
  }
  .el-input--suffix {
    .el-input__inner {
      padding-right: 20px;
    }
  }
}
.store_flow_new {
  .upload {
    &::before {
      font-size: 16px;
    }
  }
  .el-input__inner {
    height: 32px;
  }
  .el-input__icon {
    line-height: 32px;
  }
  .el-dialog__header {
    padding: 0 20px !important;
    height: 50px;
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: bolder;
    .el-dialog__headerbtn {
      position: static;
    }
  }
  .el-dialog__body {
    margin: 0;
    padding: 0 20px !important;
    border: 0;
  }
  .el-dialog__footer {
    padding: 12px 20px !important;
  }
  .aliUploadFlow {
    position: absolute;
    left: 0;
    top: 0;
    .oss_file {
      width: 80px;
      height: 24px;
      border: 0;
    }
  }
  .enclosure-list-flow {
    .el-item {
      display: flex;
      justify-content: space-between;
      span {
        display: block !important;
      }
      span:last-child {
        width: auto;
      }
    }
  }
}

.storeDetailisClass {
  .el-tabs__nav {
    .el-tabs__item {
      height: 26px;
      line-height: 26px;
      font-size: 14px;
      background: #fff;
      border: 1px solid #cccccc;
      border-radius: 4px;
      padding: 0 10px !important;
      margin-right: 10px;
      &.is-active {
        background: #eef4ff;
        border: 1px solid #9fbfff;
        color: #3175f6;
      }
    }
  }
  .el-tabs__active-bar {
    display: none;
  }
  .el-tabs__item:hover {
    color: #3175f6;
  }
  > div {
    &.drawer {
      background-color: #faf7fa !important;
      .wrap {
        height: 100%;
      }
      .drawer-head {
        padding: 0;
        margin: 0;
        height: 60px;
        line-height: 60px;
        background-color: #ffffff;
        padding-left: 15px;
        font-weight: bold;
        border: none;
        .el-dialog__close {
          font-size: 24px;
          color: #b9b9b9;
          margin-top: 20px;
        }
        .el-dialog__title {
          color: #262626;
          font-size: 16px;
        }
      }
      .storeDetailis {
        margin: 0;
        height: calc(100% - 60px);
        overflow: hidden;
        width: 1000px;
        .shopList {
          padding: 10px 15px;
          border-top: 1px solid #f2f2f2;
          margin: 0;
          background-color: #ffffff;
        }
      }
      .el-dialog__footer {
        padding: 0;
        background-color: #ffffff;
        margin-top: 10px;
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
            &.quxiao_btn {
              &:hover {
                color: #3577f6;
              }
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
.storeDetailisdialog {
  .el-textarea textarea {
    height: auto;
  }
  .el-dialog__body {
    margin-top: 15px;
  }
}
.storeDetailis {
  .el-form-item__error {
    left: 100px;
  }
}
.shopList {
  .el-tabs__nav-wrap::after {
    background-color: transparent;
  }
  .el-tabs__header {
    margin: 0;
  }
}
.storeDetailis {
  .readonly1 {
    .el-form-item {
      margin-bottom: 0px;
    }
  }
  .upLoadComponents {
    .aliUpload {
      width: 100%;
      height: 100%;
    }
    .oss_file {
      width: 48px;
      height: 30px;
      line-height: 30px;
      background: rgba(247, 249, 253, 1);
      border: 1px solid rgba(234, 234, 234, 1);
      border-radius: 0;
      .icon-shangchuantupianicon {
        font-size: 18px;
        color: #3175fb;
      }
    }
  }
}
.addClientsDialog2 {
  &.addEnterInfoDialog {
    .el-dialog__body {
      // height: 420px !important;
    }
  }
  .el-dialog {
    background-color: #faf7fa;
    .el-dialog__header {
      padding: 0;
      margin: 0;
      height: 50px;
      line-height: 50px;
      background-color: #ffffff;
      padding-left: 15px;
      font-weight: bold;
      border: none;
      margin-bottom: 12px;
      .el-dialog__title {
        color: #262626;
        font-size: 16px;
      }
    }
    .el-dialog__body {
      margin: 0;
      // height: 750px;
      overflow: auto;
      border: none;
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
    .el-dialog__footer {
      padding: 0;
      background-color: #ffffff;
      margin-top: 12px;
      padding-left: 15px !important;
      .dialog-footer {
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .del {
          display: inline-block;
          width: 90px;
          height: 34px;
          line-height: 34px;
          text-align: center;
          cursor: pointer;
          background: rgba(227, 40, 25, 0.1);
          border: 1px solid #e32819;
          border-radius: 2px;
          color: #e32819;
        }
        > div {
          display: flex;
          flex-direction: row-reverse;
          span {
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
            &.quxiao_btn {
              &:hover {
                color: #3577f6;
              }
            }
          }
        }
      }
    }
    .addComtent1 {
      background-color: #ffffff;
      width: 100%;
      .annexList {
        width: 80%;
        // margin-left: 15px;
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
        margin-right: 15px !important;
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
        }
      }
      .title {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        color: #262626;
        background-color: #ffffff;
        padding-left: 15px;
        font-weight: bold;
        border-bottom: 1px solid #f6f6f6;
        display: flex;
        align-items: center;
        > i {
          display: inline-block;
          width: 4px;
          height: 16px;
          background: rgba(53, 117, 246, 1);
          border-radius: 2px;
          margin-right: 8px;
        }
      }
      .contentDtl {
        padding: 15px;
        .item {
          display: flex;
          width: 100%;
          justify-content: space-between;
          > div {
            width: 48%;
            display: flex;
            flex-direction: column;
            margin-bottom: 22px;
            &.inputNoborder {
              .el-input--small {
                .el-input__inner {
                  border: none !important;
                }
              }
              .priceSelect {
                background: #f5f7fa;
                .el-input--small {
                  background: #f5f7fa;
                  .el-input__inner {
                    background: #f5f7fa;
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                    border-left: 1px solid #dcdfe6 !important;
                  }
                }
              }
            }
            > span {
              margin-bottom: 5px;
              font-size: 14px;
              color: #777777;
              > i {
                // color: #ff0000;
                font-style: normal;
              }
            }
          }
        }
      }
      .addStep2 {
        display: flex;
        flex-direction: column;
        > .item {
          display: flex;
          padding-left: 130px;
          margin-right: 0;
          height: 50px;
          line-height: 50px;
        }
      }
      .el-form-item {
        margin-bottom: 0px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.addEnterInfoDialog {
  .contentDtl {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .time {
      width: 60%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .item {
      width: 32% !important;
      flex-direction: column;
      font-size: 14px;
      > span {
        &:first-child {
          color: #777777;
          margin-bottom: 10px;
        }
        &:last-child {
          color: #333333;
        }
      }
    }
  }
}
.videoBox {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 10000;
  .video-js {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
.storeDetailis {
  .min-content {
    margin-top: 10px;
    display: flex;
    height: calc(100% - 80px);
    justify-content: space-between;
    overflow-y: auto;
    padding: 0 15px;
    &::-webkit-scrollbar {
      width: 4px !important;
      height: 4px !important;
    }
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px #fafafa;
      background-color: #fafafa;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 6px #cccccc;
    }
    .tab {
      height: 36px;
      line-height: 36px;
      border-bottom: 1px solid #f2f2f2;
      z-index: 2;
      > span {
        display: inline-block;
        padding: 0 10px;
        height: 35px;
        cursor: pointer;
        &.active {
          color: #3175f6;
          border-bottom: 2px solid #3175f6;
        }
      }
    }
    .left {
      width: 290px;
      margin-bottom: 30px;
      .stoteInfo {
        background-color: #ffffff;
        border-radius: 4px;
        position: relative;
        .content {
          height: 660px;
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
          .stoteFrom {
            .el-form-item {
              margin-bottom: 18px;
            }
          }
        }
        .stoteInfo_foot {
          display: flex;
          flex-direction: row-reverse;
          position: absolute;
          width: 100%;
          bottom: 0;
          height: 40px;
          align-items: center;
          background-color: #fff;
          border-top: 1px solid #f2f2f2;
          cursor: pointer;
          padding-right: 15px;
          > span {
            display: inline-block;
            width: 44px;
            height: 26px;
            line-height: 26px;
            font-size: 12px;
            text-align: center;
            color: #777777;
            &.subBtn {
              background-color: #2a6ef0;
              color: #ffffff;
              border-radius: 4px;
            }
            &.quxiao_btn {
              &:hover {
                color: #3577f6;
              }
            }
          }
        }
      }
      .projectInfo {
        background-color: #ffffff;
        border-radius: 4px;
        margin-top: 10px;
        position: relative;
        min-height: 200px;
        .basicInfo {
          font-size: 14px;
          // height: 200px;
          // overflow-y: auto;
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
          .itemContent {
            padding: 10px 10px 40px !important;
            max-height: 400px;
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
            .item {
              display: flex;
              min-height: 40px;
              // line-height: 50px;
              padding-left: 0px;
              margin-top: 10px;
              align-items: center;
              > span {
                display: inline-block;
                width: 80px;
                > i {
                  color: #ff0000;
                  font-style: normal;
                }
              }
              > div {
                > span {
                }
              }
            }
            .itemEdit {
              margin-bottom: 15px;
            }
          }
        }
        .stoteInfo_foot {
          display: flex;
          flex-direction: row-reverse;
          position: absolute;
          width: 100%;
          bottom: 0;
          height: 40px;
          align-items: center;
          background-color: #fff;
          border-top: 1px solid #f2f2f2;
          z-index: 1;
          cursor: pointer;
          padding-right: 15px;
          > span {
            display: inline-block;
            width: 44px;
            height: 26px;
            line-height: 26px;
            font-size: 12px;
            text-align: center;
            color: #777777;
            &.subBtn {
              background-color: #2a6ef0;
              color: #ffffff;
              border-radius: 4px;
            }
            &.quxiao_btn {
              &:hover {
                color: #3577f6;
              }
            }
          }
        }
      }
      .title {
        height: 36px;
        background-color: #ffffff;
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        color: #262626;
        padding: 0 10px;
        font-weight: bold;
        align-items: center;
        border-bottom: 1px solid #eee;
        > span {
          &:first-child {
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
        .icons {
          font-weight: normal;
          cursor: pointer;
          font-size: 12px;
          color: #3575f6;
        }
      }
      .content {
        padding: 5px 10px;
        .imgBox {
          width: 100%;
          height: 140px;
          img {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: cover;
          }
        }
        .imgList {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          position: relative;
          margin-top: 10px;
          > div {
            width: 48px;
            height: 30px;
            margin-right: 8px;
            &:last-child {
              margin-right: 0px;
            }
            > img {
              width: 100%;
              height: 100%;
              &.imgborder {
                border: 1px solid #409eff;
                // box-shadow: 0 0 0 1px #409eff;
              }
            }
            .icon-jinakangbaoicons18 {
              position: absolute;
              top: -8px;
              right: -7px;
              color: #409eff;
              cursor: pointer;
            }
            .icon-cms_cuowu {
              position: absolute;
              top: -8px;
              right: -7px;
              color: #777777;
              cursor: pointer;
            }
          }
          .iconRight {
            transform: rotate(180deg);
            -ms-transform: rotate(180deg); /* IE 9 */
            -moz-transform: rotate(180deg); /* Firefox */
            -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
            -o-transform: rotate(180deg); /* Opera */
            position: absolute;
            left: -15px;
          }
          .icon-right {
            position: absolute;
            width: 16px;
            text-align: center;
            cursor: pointer;
            bottom: 0;
            height: 100%;
            color: #fff;
            background-color: rgba(0, 0, 0, 0.6);
            left: 0;
            display: flex;
            font-size: 12px;
            align-items: center;
            justify-content: center;
            z-index: 2;
          }
        }
        .expire {
          background-color: rgb(243, 204, 203);
          padding: 2px 5px;
          border-radius: 4px;
          color: rgb(235, 96, 91);
        }
        .stoteFrom {
          margin-top: 10px;
          padding-bottom: 40px;
          .itemName {
            display: inline-block;
            color: #777777;
            font-size: 14px;
            // height: 40px;
            // line-height: 40px;
            &.alginLeft {
              text-align: left;
              width: 90px;
            }
            &.alginRight {
              width: 90px;
              text-align: left;
            }
          }
          .itemImageUrl {
            display: inline-block;
            max-width: 166px;
            white-space: nowrap; /*不换行*/
            overflow: hidden; /*超出部分隐藏*/
            vertical-align: top;
            position: relative;
            .imageName {
              position: absolute;
              top: 4px;
              left: 50px;
              max-width: 120px;
              white-space: nowrap; /*不换行*/
              overflow: hidden; /*超出部分隐藏*/
              text-overflow: ellipsis; /*超出部分文字以...显示*/
              > span:first-child {
                display: inline-block;
                max-width: 66px;
                overflow: hidden; /*超出部分隐藏*/
                white-space: nowrap; /*不换行*/
                text-overflow: ellipsis; /*超出部分文字以...显示*/
                vertical-align: top;
              }
              > span:last-child {
                color: #3175f6;
                display: inline-block;
                vertical-align: top;
                cursor: pointer;
              }
            }
          }
          .roomImageName {
            display: inline-block;
            max-width: 100px;
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
            vertical-align: top;
          }
          .showRoomImage {
            color: #3175f6;
            display: inline-block;
            vertical-align: top;
            cursor: pointer;
          }
          .itemTxt {
            display: inline-block;
            width: 170px;
            color: #262626;
            font-size: 14px;
            vertical-align: middle;
            // height: 40px;
            // line-height: 40px;
          }
          .itemIndustry {
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 150px;
            overflow: hidden;
          }
          .uploadFloorplan {
            position: relative;
            width: 72px;
            height: 26px;
            font-size: 10px;
            display: inline-block;
            .aliUpload {
              position: absolute;
              left: 0;
              top: 0;
              .oss_file {
                width: 70px;
                height: 40px;
                line-height: 40px;
                background: rgba(247, 249, 253, 1);
                border: 1px solid rgba(234, 234, 234, 1);
                border-radius: 0;
                .icon-shangchuantupianicon {
                  font-size: 10px;
                  color: #3175fb;
                }
              }
            }
          }
        }
      }
    }
    .right {
      font-size: 14px;
      color: #666;
      width: calc(100% - 300px);
      .title {
        height: 36px;
        background-color: #ffffff;
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        color: #262626;
        padding: 0 10px;
        font-weight: bold;
        align-items: center;
        border-bottom: 1px solid #eee;
        > span {
          &:first-child {
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
        .delAction {
          font-weight: normal;
          cursor: pointer;
          color: #44af69 !important;
          font-size: 14px !important;
          > span {
            text-decoration: underline;
          }
        }
        .icons {
          font-weight: normal;
          cursor: pointer;
          font-size: 12px;
          color: #3575f6;
        }
      }
      .tban_new {
        border: 0;
      }
      .tban_new:hover {
        background: #fff;
        .text {
          text-decoration: underline;
        }
      }
      .table1 {
        padding: 0 15px;
      }
      .now {
        width: 100%;
        background-color: #ffffff;
        border-radius: 4px;
        min-height: 520px;

        .writeRecord {
          height: 35px;
          line-height: 35px;
          margin-top: 20px;
          text-align: right;
          padding-right: 20px;
          color: #3575f6;
          > span {
            display: inline-block;
            width: 82px;
            height: 26px;
            line-height: 26px;
            text-align: center;
            background: rgba(238, 244, 255, 1);
            border: 1px solid rgba(159, 191, 255, 1);
            border-radius: 14px;
            cursor: pointer;
          }
        }
        .timeline_content {
          // height: 350px;
          // overflow-y: auto;
          .timelineBox {
            width: 100%;
            padding-left: 150px;
            padding-top: 30px;
            height: 500px;
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
            .statusBox {
              position: absolute;
              left: -160px;
              top: 0;
              width: 150px;
              text-align: center;
              display: -ms-flexbox;
              display: flex;
              -ms-flex-direction: column;
              flex-direction: column;
              font-size: 12px;
              > div {
                position: absolute;
                right: 0;
                &:first-child {
                  display: inline-block;
                  width: 60px;
                  height: 20px;
                  line-height: 20px;
                  &.shangxian {
                    background: #3575f6;
                    border-radius: 4px;
                    color: #ffffff;
                  }
                  &.xiaxian {
                    background: #f99a12;
                    border-radius: 4px;
                    color: #ffffff;
                  }
                  &.shenhe {
                    background: #f99a12;
                    border-radius: 4px;
                    color: #ffffff;
                  }
                  &.tjsh {
                    background: #83bf68;
                    border-radius: 4px;
                    color: #ffffff;
                  }
                }
                &:last-child {
                  &.first {
                    top: 30px;
                    color: #3575f6;
                  }
                  top: 30px;
                  color: #999999;
                }
              }
            }
            .template {
              position: relative;
              top: -13px;
              left: 0px;
              width: 500px;
              > p {
                display: flex;
                margin-bottom: 5px;
                span {
                  display: block;
                }
                > span:first-child {
                  font-size: 14px;
                  color: #333333;
                  width: 75px;
                  font-weight: bolder;
                }
                > span:last-child {
                  font-size: 14px;
                  flex: 1;
                  color: #777777;
                }
              }
              .annexesList {
                display: flex;
                font-size: 12px;
                color: #005cb3;
                .annexName {
                  margin-right: 10px;
                  cursor: pointer;
                }
                > div {
                  cursor: pointer;
                  font-size: 14px;
                }
              }
            }
          }
        }
      }
      .history {
        min-height: 500px;
        overflow: auto;
        padding-bottom: 50px;
        margin-top: 10px;
        width: 100%;
        background-color: #ffffff;
        border-radius: 4px;
        > .title {
          height: 45px;
          padding-left: 15px;
          font-size: 16px;
          font-weight: bold;
          color: #262626;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #f6f6f6;
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
      .seachDiv {
        height: 60px;
        background-color: #ffffff;
        border-radius: 5px;
        display: flex;
        align-items: center;
        padding-left: 20px;
        position: relative;
        > span {
          margin-right: 40px;
        }
        .addBtn {
          float: right !important;
          width: 130px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          font-size: 14px;
          color: #fff;
          background-color: #65ac69;
          border-radius: 4px;
          cursor: pointer;
          position: absolute;
          right: 0;
        }
        .seachList2 {
          display: inline-block;
          width: 70px;
          height: 32px;
          line-height: 32px;
          background: rgba(53, 119, 246, 1);
          border-radius: 4px;
          text-align: center;
          cursor: pointer;
          color: #ffffff;
          margin-left: 15px;
          &:hover {
            opacity: 0.9;
          }
        }
      }
    }
  }
}
.addComtent {
  margin-top: 10px;
  min-height: 500px;
  width: 100%;
  border: 1px solid #e5e5e5;
  .title {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: #666;
    background-color: #fafafa;
    padding-left: 15px;
    > i {
      display: inline-block;
      width: 4px;
      height: 16px;
      background: rgba(53, 117, 246, 1);
      border-radius: 2px;
      margin-right: 5px;
    }
  }
  .contentDtl {
    padding: 15px;
    .item {
      display: flex;
      width: 100%;
      > div {
        width: 48%;
        display: flex;
        flex-direction: column;
        margin-bottom: 15px;
        > span {
          margin-bottom: 10px;
          > i {
            // color: #ff0000;
            font-style: normal;
          }
        }
      }
    }
  }
  .addStep2 {
    display: flex;
    flex-direction: column;
    > .item {
      display: flex;
      padding-left: 130px;
      margin-right: 0;
      height: 50px;
      line-height: 50px;
    }
  }
  .el-form-item {
    margin-bottom: 0px;
  }
}
.addProgressFrom {
  .form1 {
    > .content {
      width: 730px;
      min-height: 850px;
      margin: 20px auto;
      .item {
        display: flex;
        flex-direction: column;
        margin-bottom: 15px;
        > span {
          margin-bottom: 10px;
          > i {
            color: #ff0000;
            font-style: normal;
          }
        }
        .storeInfo {
          min-height: 560px;
          border: 1px solid #eeeeee;
          .title {
            height: 50px;
            line-height: 50px;
            padding: 0 15px;
            background-color: #fafafa;
            display: block;
            > i {
              display: inline-block;
              width: 4px;
              height: 16px;
              background: rgba(53, 117, 246, 1);
              border-radius: 2px;
              margin-right: 5px;
            }
          }
          .content {
            padding: 10px;
            display: flex;
            justify-content: space-between;
            .project {
              width: 300px;
              height: 500px;
              border: 1px solid #eeeeee;
              padding: 15px;
              overflow-y: scroll;
              .collapse {
                margin-top: 20px;
                .el-collapse-item__header {
                  background-color: #fafafa;
                  padding-left: 15px;
                  height: 40px;
                  line-height: 40px;
                }
                .el-collapse-item__wrap {
                  padding-left: 25px;
                  .el-checkbox {
                    width: 100%;
                    margin-right: 0;
                    margin-bottom: 5px;
                  }
                }
              }
            }
            .offer {
              width: 400px;
              height: 500px;
              padding-left: 20px;
              > .item {
                display: flex;
                flex-direction: column;
                margin-bottom: 15px;
                > div {
                  display: flex;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
