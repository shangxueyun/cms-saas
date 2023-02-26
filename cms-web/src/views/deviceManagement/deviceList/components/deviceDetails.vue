<template>
  <div class="device-details deviceDetails_new">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            :showEditBtn="false"
            @on-edit="onEdit"
            @on-hide="onHide">
      <div class="main-content"
           slot="drawer">
        <div class="leftPart">
          <p class="title">
            <span><i class="icon"></i>设施设备基本信息</span>
            <i class="iconfont icon-cms_bianji-"
               style="color:#3575F6;font-weight: normal;cursor:pointer;font-size: 14px;"
               @click="onEdit"
               v-if="hasAuthority('03040104') && readonly">
              <span style="font-size:12px;margin-left:3px">编辑</span>
            </i>
          </p>
          <div class="scrollDiv">
            <div class="imgContant">
              <div class="carousel-itemImg clearfix">
                <div class="carousel float-left">
                  <img v-if="!detailsData.imageUrls"
                       :src="berthImg"
                       alt=""
                       style="width: 100%;height: 100%;object-fit: cover;">
                  <el-carousel trigger="click"
                               height="240px"
                               ref="carousel"
                               v-else>
                    <el-carousel-item v-for="item in detailsData.imageUrls"
                                      :key="item">
                      <img :src="item"
                           alt=""
                           style="width:100%;height:100%">
                    </el-carousel-item>
                  </el-carousel>
                </div>
                <div class="itemImg float-left listBox"
                     id="listBox">
                  <div class="cf">
                    <div v-if="(!detailsData.imageUrls || detailsData.imageUrls&&detailsData.imageUrls.length < 5) && !readonly"
                         class="itemImg-div">
                      <aliUpload class="aliUpload deviceDetails"
                                 :upLoadText="upLoadText_cost"
                                 :fileType="fileType_cost"
                                 :iconShow="false"
                                 :iconImg="iconImg"
                                 :uploadIcon="true"
                                 @setAnnex="setAnnex" />
                    </div>
                    <div v-for="(item,index) in detailsData.imageUrls"
                         :key="index"
                         class="itemImg-div">
                      <img :src="item"
                           @click="setActiveItem(index)">
                      <i class="iconfont icon-jinakangbaoicons18"
                         @click="deleteImg(index)"
                         v-if="!readonly"></i>
                    </div>
                  </div>
                </div>
                <span id="prev"
                      class="btn prev"
                      @click="prevClick"
                      v-if="detailsData.imageUrls&&detailsData.imageUrls.length >= 3"><i class="el-icon-arrow-right"></i></span>
                <span id="next"
                      class="btn next"
                      @click="nextClick"
                      v-if="detailsData.imageUrls&&detailsData.imageUrls.length >= 3"><i class="el-icon-arrow-left"></i></span>
              </div>
            </div>
            <div class="tabContent">
              <div class="headTab">
                <span :class="{active:addDeviStep===1}"
                      @click="changeAddDeviStep(1)">基本信息</span>
                <span :class="{active:addDeviStep===2}"
                      @click="changeAddDeviStep(2)">维护信息</span>
                <!-- <span :class="{active:addDeviStep===3}"
                      @click="changeAddDeviStep(3)">其他信息</span> -->
              </div>
              <el-form :model="detailsData"
                       ref="detailsData"
                       :rules="addFlowRules">
                <div class="part"
                     v-show="addDeviStep===1">
                  <div class="content">
                    <el-form-item prop="projectManagement">
                      <span>项目简称<i class="required">*</i></span>
                      <p v-if="readonly">{{detailsData.projectManagement.referred}}</p>
                      <el-select v-model="detailsData.projectManagement"
                                 value-key="id"
                                 size="small"
                                 style="width:190px"
                                 v-else
                                 @change="projectChange('changePrject')">
                        <el-option v-for="(item) in projectManagementsList"
                                   :key="item.id"
                                   :label="item.referred"
                                   :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                    <!-- 设施设备大小类 -->
                    <el-form-item prop="equirementType.parent.id">
                      <span>设备大类<i class="required">*</i></span>
                      <p v-if="readonly||equirementClass==='other'">{{detailsData.equirementType.parent.name}}</p>
                      <el-select v-if="equirementClass==='common'&&!readonly"
                                 v-model="detailsData.equirementType.parent.id"
                                 style="width:190px"
                                 size="small"
                                 @change="equirementTypeChange">
                        <el-option v-for="(item,index) in equirementTypes"
                                   :key="index"
                                   :label="item.name"
                                   :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="equirementType.id">
                      <span>设备小类<i class="required">*</i></span>
                      <p v-if="readonly">{{detailsData.equirementType.name}}</p>
                      <!-- 设施设备 -->
                      <el-select v-if="equirementClass==='common'&&!readonly"
                                 v-model="detailsData.equirementType.id"
                                 style="width:190px"
                                 size="small">
                        <el-option v-for="(item,index) in equirementTypesChild"
                                   :key="index"
                                   :label="item.name"
                                   :value="item.id"></el-option>
                      </el-select>
                      <!--能耗消防弱电  -->
                      <el-select v-if="equirementClass==='other'&&!readonly"
                                 v-model="detailsData.equirementType.id"
                                 style="width:190px"
                                 size="small"
                                 @change="equirementTypesChildChange">
                        <el-option v-for="(item,index) in equirementTypes"
                                   :key="index"
                                   :label="item.name"
                                   :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <span>设备条形码</span>
                      <p>{{detailsData.barCode||'-'}}</p>
                    </el-form-item>
                    <el-form-item prop="code">
                      <span>设备编号<i class="required">*</i></span>
                      <p v-if="readonly">{{detailsData.code}}</p>
                      <el-input style="width:190px"
                                size="small"
                                v-model="detailsData.code"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item prop="name">
                      <span>设备名称<i class="required">*</i></span>
                      <p v-if="readonly">{{detailsData.name}}</p>
                      <el-input style="width:190px"
                                size="small"
                                v-model="detailsData.name"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item prop="code">
                      <span>使用寿命</span>
                      <p v-if="readonly">{{detailsData.useLife}}</p>
                      <el-input style="width:190px"
                                size="small"
                                v-model="detailsData.useLife"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item prop="energyType"
                                  v-if="detailsData.equirementType.parent.id===25">
                      <span>能耗类型<i class="required">*</i></span>
                      <p v-if="readonly">{{formatenergyType(detailsData.energyType)}}</p>
                      <el-select v-model="detailsData.energyType"
                                 size="small"
                                 @change="energyTypeChange"
                                 v-else>
                        <el-option label="仪表"
                                   value="METER"></el-option>
                        <el-option label="开关"
                                   value="SWITCH"></el-option>
                        <el-option label="照明"
                                   v-if="detailsData.equirementType.id===27"
                                   value="LAMP"></el-option>
                        <el-option label="空调"
                                   v-if="detailsData.equirementType.id===27"
                                   value="VRV"></el-option>
                        <el-option label="其他"
                                   value="OTHER"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item prop="instrumentType"
                                  v-if="detailsData.energyType==='METER'">
                      <span>仪表类型<i class="required">*</i></span>
                      <p v-if="readonly">{{formatinstrumentType(detailsData.instrumentType)}}</p>
                      <el-radio-group v-model="detailsData.instrumentType"
                                      v-else
                                      @change="radioChange">
                        <el-radio label="ORDINARY_TABLE">普通表</el-radio>
                        <el-radio label="PUBLIC_TABLE">公共表</el-radio>
                        <el-radio label="SUMMARY_TABLE">总表</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="tenant.id"
                                  v-if="detailsData.instrumentType==='ORDINARY_TABLE' && detailsData.energyType==='METER'">
                      <span>关联商户<i class="required">*</i></span>
                      <p v-if="readonly">{{detailsData.tenant.referred}}</p>
                      <el-select v-model="detailsData.tenant.id"
                                 filterable
                                 size="small"
                                 placeholder="输入搜索商户"
                                 style="width:190px"
                                 v-else>
                        <el-option v-for="item in tenantList"
                                   :key="item.id"
                                   :label="item.referred"
                                   :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="useStatus">
                      <span>当前状态<i class="required">*</i></span>
                      <p v-if="readonly">{{detailsData.useStatus==='USING'?'在用':'停用'}}</p>
                      <el-select style="width:190px"
                                 size="small"
                                 v-model="detailsData.useStatus"
                                 v-else>
                        <el-option label="在用"
                                   value="USING"></el-option>
                        <el-option label="停用"
                                   value="DISABLE"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="building">
                      <span>楼宇名称<i class="required">*</i></span>
                      <p v-if="readonly">{{detailsData.building.buildingName}}</p>
                      <el-select v-model="detailsData.building"
                                 style="width:190px"
                                 size="small"
                                 v-else
                                 value-key="id">
                        <el-option v-for="(item) in buildingOption"
                                   :key="item.id"
                                   :label="item.buildingName"
                                   :value="item"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="personLiable">
                      <span>责任人<i class="required">*</i></span>
                      <p v-if="readonly">{{detailsData.personLiable}}</p>
                      <el-input style="width:190px"
                                size="small"
                                v-model="detailsData.personLiable"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item prop="personLiableTelephone">
                      <span>责任人手机号<i class="required">*</i></span>
                      <p v-if="readonly">{{detailsData.personLiableTelephone}}</p>
                      <el-input v-else
                                size="small"
                                style="width:190px"
                                v-model="detailsData.personLiableTelephone"
                                maxlength="11"
                                onkeyup="value=value.replace(/[^0-9]/g,'')"
                                onpaste="value=value.replace(/[^0-9]/g,'')"
                                oncontextmenu="value=value.replace(/[^0-9]/g,'')"></el-input>
                    </el-form-item>
                    <el-form-item prop="installDate">
                      <span>安装日期</span>
                      <p v-if="readonly">{{detailsData.installDate}}</p>
                      <el-date-picker style="width:190px"
                                      size="small"
                                      value-format="yyyy-MM-dd"
                                      v-model="detailsData.installDate"
                                      type="date"
                                      placeholder="选择日期"
                                      v-else></el-date-picker>
                    </el-form-item>
                    <el-form-item prop="installPosition"
                                  style="width:100%">
                      <span style="width:100%">安装位置<i class="required">*</i></span>
                      <p v-if="readonly"
                         style="width:100%">{{detailsData.installPosition}}</p>
                      <el-input style="width:600px"
                                size="small"
                                v-model="detailsData.installPosition"
                                maxlength="100"
                                v-else></el-input>
                    </el-form-item>
                    <div class="partitionDiv"></div>
                    <el-form-item prop="brand">
                      <span>品牌</span>
                      <p v-if="readonly">{{detailsData.brand}}</p>
                      <el-input style="width:190px"
                                size="small"
                                v-model="detailsData.brand"
                                maxlength="6"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item prop="manufacturer">
                      <span>制造厂商</span>
                      <p v-if="readonly">{{detailsData.manufacturer}}</p>
                      <el-input style="width:190px"
                                size="small"
                                v-model="detailsData.manufacturer"
                                maxlength="20"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item prop="produced">
                      <span>产地</span>
                      <p v-if="readonly">{{!detailsData.produced?'':(detailsData.produced==='IMPORTED'?'进口':'国产')}}</p>
                      <el-select style="width:190px"
                                 size="small"
                                 v-model="detailsData.produced"
                                 v-else>
                        <el-option label="进口"
                                   value="IMPORTED"></el-option>
                        <el-option label="国产"
                                   value="MADE_IN_CHINA"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="supplier">
                      <span>供应商</span>
                      <p v-if="readonly">{{detailsData.supplier}}</p>
                      <el-input style="width:190px"
                                size="small"
                                v-model="detailsData.supplier"
                                maxlength="25"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item prop="productionDate">
                      <span>出厂日期</span>
                      <p v-if="readonly">{{detailsData.productionDate}}</p>
                      <el-date-picker style="width:190px"
                                      size="small"
                                      value-format="yyyy-MM-dd"
                                      v-model="detailsData.productionDate"
                                      type="date"
                                      placeholder="选择日期"
                                      v-else></el-date-picker>
                    </el-form-item>
                    <el-form-item prop="annualInspectionDate">
                      <span>年检日期</span>
                      <p v-if="readonly">{{detailsData.annualInspectionDate}}</p>
                      <el-date-picker style="width:190px"
                                      size="small"
                                      value-format="yyyy-MM-dd"
                                      v-model="detailsData.annualInspectionDate"
                                      type="date"
                                      placeholder="选择日期"
                                      v-else></el-date-picker>
                    </el-form-item>
                    <el-form-item prop="deliveryDate">
                      <span>交付日期</span>
                      <p v-if="readonly">{{detailsData.deliveryDate}}</p>
                      <el-date-picker style="width:190px"
                                      size="small"
                                      value-format="yyyy-MM-dd"
                                      v-model="detailsData.deliveryDate"
                                      type="date"
                                      placeholder="选择日期"
                                      v-else></el-date-picker>
                    </el-form-item>
                    <el-form-item prop="useDate">
                      <span>使用日期</span>
                      <p v-if="readonly">{{detailsData.useDate}}</p>
                      <el-date-picker style="width:190px"
                                      size="small"
                                      value-format="yyyy-MM-dd"
                                      v-model="detailsData.useDate"
                                      type="date"
                                      placeholder="选择日期"
                                      v-else></el-date-picker>
                    </el-form-item>
                    <el-form-item prop="warrantyEndDate">
                      <span>质保结束日期</span>
                      <p v-if="readonly">{{detailsData.warrantyEndDate}}</p>
                      <el-date-picker style="width:190px"
                                      size="small"
                                      value-format="yyyy-MM-dd"
                                      v-model="detailsData.warrantyEndDate"
                                      type="date"
                                      placeholder="选择日期"
                                      v-else></el-date-picker>
                    </el-form-item>
                    <el-form-item prop="remake"
                                  style="width:100%">
                      <span style="width:100%">备注</span>
                      <p v-if="readonly"
                         style="width:100%">{{detailsData.remake}}</p>
                      <el-input type="textarea"
                                :rows="3"
                                size="small"
                                v-model="detailsData.remake"
                                style="width:600px"
                                maxlength="100"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item style="width:100%">
                      <div style="display:flex">
                        <span v-if="detailsData.annexes.length > 0 ||!readonly">附件</span>
                        <div class="upload"
                             style="margin-top: 0;width: 80px;margin-left:15px;height: 24px;line-height: 23px;"
                             v-if="detailsData.annexes.length < 5 && !readonly">
                          <aliUpload class="aliUpload  aliUpload_small "
                                     :upLoadText="upLoadText"
                                     :fileType="fileType"
                                     :iconShow="true"
                                     @setAnnex="setAnnexs" />
                        </div>
                      </div>
                      <div>
                        <div class="enclosure-list el-item-preview"
                             style="margin-top:10px"
                             v-for="(item, index) in detailsData.annexes"
                             :key="index">
                          <div class="el-item"
                               style="display: flex; justify-content: space-between;border-bottom: 1px solid #EBEBEB;align-items: center;padding-bottom:5px">
                            <span style="padding-left: 0;;width: 90%;overflow: hidden;text-overflow: ellipsis; white-space: nowrap;">{{item.annexName}}</span>
                            <aliDownLoad :item="item"
                                         v-if="readonly"
                                         :encrypt="true" />
                            <i @click="deleFile(item, index)"
                               v-if="!readonly"
                               class="iconfont icon-lajixiang"
                               style="cursor:pointer"></i>
                            <ailPreview :ailObj="item"
                                        v-if="readonly"
                                        :encrypt="true"
                                        :picturePreview="true"
                                        @setFile="setFile" />
                          </div>
                        </div>
                      </div>
                    </el-form-item>
                  </div>
                </div>
                <div class="part"
                     v-show="addDeviStep===2">
                  <!-- <div class="title">维保信息</div> -->
                  <div class="content">
                    <el-form-item prop="onMaintenance">
                      <span>是否需要维保<i class="required">*</i></span>
                      <p v-if="readonly">{{detailsData.onMaintenance?'是':'否'}}</p>
                      <el-select style="width:190px"
                                 size="small"
                                 v-model="detailsData.onMaintenance"
                                 v-else>
                        <el-option label="是"
                                   :value="true"></el-option>
                        <el-option label="否"
                                   :value="false"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="maintenancePeriod">
                      <span>维保周期<i class="required">*</i></span>
                      <p v-if="readonly">{{formatMaintenancePeriod(detailsData.maintenancePeriod)}}</p>
                      <el-select v-model="detailsData.maintenancePeriod"
                                 style="width:190px"
                                 size="small"
                                 v-else>
                        <el-option label="天"
                                   value="DAY"></el-option>
                        <el-option label="周"
                                   value="WEEK"></el-option>
                        <el-option label="月"
                                   value="MONTH"></el-option>
                        <el-option label="年"
                                   value="YEAR"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="maintenanceStartDate">
                      <span>维保合同开始时间</span>
                      <p v-if="readonly">{{detailsData.maintenanceStartDate}}</p>
                      <el-date-picker style="width:190px"
                                      size="small"
                                      value-format="yyyy-MM-dd"
                                      v-model="detailsData.maintenanceStartDate"
                                      type="date"
                                      placeholder="选择日期"
                                      v-else></el-date-picker>
                    </el-form-item>
                    <el-form-item prop="maintenanceEndDate">
                      <span>维保合同结束时间</span>
                      <p v-if="readonly">{{detailsData.maintenanceEndDate}}</p>
                      <el-date-picker style="width:190px"
                                      size="small"
                                      value-format="yyyy-MM-dd"
                                      v-model="detailsData.maintenanceEndDate"
                                      type="date"
                                      placeholder="选择日期"
                                      v-else></el-date-picker>
                    </el-form-item>
                    <el-form-item prop="maintenanceUnit">
                      <span>维保单位<i class="el-icon-info"
                           @mouseover="toolTips=true"
                           @mouseout="toolTips=false"
                           style="margin:0 2px"
                           v-if="!readonly"></i><i class="toolTips"
                           v-show="toolTips"><i class="icon"></i>匹配不到,请填写其他</i></span>
                      <p v-if="readonly">{{detailsData.maintenanceUnit}}</p>
                      <el-input v-model="detailsData.maintenanceUnit"
                                style="width:190px"
                                size="small"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item prop="maintenanceContacts">
                      <span>维保联系人</span>
                      <p v-if="readonly">{{detailsData.maintenanceContacts}}</p>
                      <el-input v-model="detailsData.maintenanceContacts"
                                style="width:190px"
                                size="small"
                                maxlength="6"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item prop="maintenanceTelephone">
                      <span>维保联系手机号</span>
                      <p v-if="readonly">{{detailsData.maintenanceTelephone}}</p>
                      <el-input v-else
                                v-model="detailsData.maintenanceTelephone"
                                size="small"
                                maxlength="11"
                                style="width:190px"
                                onkeyup="value=value.replace(/[^0-9]/g,'')"
                                onpaste="value=value.replace(/[^0-9]/g,'')"
                                oncontextmenu="value=value.replace(/[^0-9]/g,'')"></el-input>
                    </el-form-item>
                    <el-form-item prop="maintenanceType">
                      <span>维保单位分类字段</span>
                      <p v-if="readonly">{{formatMaintenanceType(detailsData.maintenanceType)}}</p>
                      <el-select style="width:190px"
                                 size="small"
                                 v-model="detailsData.maintenanceType"
                                 v-else>
                        <el-option label="原厂维保"
                                   value="FACTORY_MADLE"></el-option>
                        <el-option label="外委维保"
                                   value="SUB_CONTRACTOR"></el-option>
                        <el-option label="集团维保"
                                   value="GROUP"></el-option>
                        <el-option label="无"
                                   value="NO"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="outsourceType">
                      <span>外包类型</span>
                      <p v-if="readonly">{{formatoutsourceType(detailsData.outsourceType)}}</p>
                      <el-select style="width:190px"
                                 size="small"
                                 v-model="detailsData.outsourceType"
                                 v-else>
                        <el-option label="质保期内"
                                   value="WARRANTY"></el-option>
                        <el-option label="甲方外包"
                                   value="PARTY_A"></el-option>
                        <el-option label="清包"
                                   value="CLEAR_BIG"></el-option>
                        <el-option label="中包"
                                   value="TUNDISH"></el-option>
                        <el-option label="小包"
                                   value="BUNDLE"></el-option>
                        <el-option label="无"
                                   value="NO"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <div class="part"
                     v-show="addDeviStep===2">
                  <!-- <div class="title">巡检信息</div> -->
                  <div class="content">
                    <el-form-item prop="onMaintain">
                      <span>是否需要巡检<i class="required">*</i></span>
                      <p v-if="readonly">{{detailsData.onMaintain?'是':'否'}}</p>
                      <el-select style="width:190px"
                                 size="small"
                                 v-model="detailsData.onMaintain"
                                 v-else>
                        <el-option label="是"
                                   :value="true"></el-option>
                        <el-option label="否"
                                   :value="false"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="maintainPeriodDay">
                      <span>巡检周期（天）<i class="required">*</i></span>
                      <p v-if="readonly">{{detailsData.maintainPeriodDay}}</p>
                      <el-input style="width:190px"
                                size="small"
                                v-model="detailsData.maintainPeriodDay"
                                v-else
                                maxlength="10"
                                onkeyup="value=value.replace(/[^\0-9\.]/g,'')"
                                onpaste="value=value.replace(/[^\0-9\.]/g,'')"
                                oncontextmenu="value=value.replace(/[^\0-9\.]/g,'')"></el-input>
                    </el-form-item>
                    <el-form-item prop="firstMaintainDate">
                      <span>首次巡检时间</span>
                      <p v-if="readonly">{{detailsData.firstMaintainDate}}</p>
                      <el-date-picker style="width:190px"
                                      size="small"
                                      value-format="yyyy-MM-dd"
                                      v-model="detailsData.firstMaintainDate"
                                      type="date"
                                      placeholder="选择日期"
                                      v-else></el-date-picker>
                    </el-form-item>
                    <el-form-item prop="onMeterReading">
                      <span>是否抄表<i class="required">*</i></span>
                      <p v-if="readonly">{{detailsData.onMeterReading?'是':'否'}}</p>
                      <el-select style="width:190px"
                                 size="small"
                                 v-model="detailsData.onMeterReading"
                                 v-else>
                        <el-option label="是"
                                   :value="true"></el-option>
                        <el-option label="否"
                                   :value="false"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="onPatrol">
                      <span>是否需要巡更<i class="required">*</i></span>
                      <p v-if="readonly">{{detailsData.onPatrol?'是':'否'}}</p>
                      <el-select style="width:190px"
                                 size="small"
                                 v-model="detailsData.onPatrol"
                                 v-else>
                        <el-option label="是"
                                   :value="true"></el-option>
                        <el-option label="否"
                                   :value="false"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <div class="part"
                     v-show="addDeviStep===3">
                  <!-- <div class="title">巡检信息</div> -->
                  <div class="content">
                    <el-form-item prop="equirementRegisterCode">
                      <span>设备注册代码号</span>
                      <p v-if="readonly">{{detailsData.equirementRegisterCode}}</p>
                      <el-input v-model="detailsData.equirementRegisterCode"
                                style="width:190px"
                                size="small"
                                maxlength="20"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item prop="productionCode">
                      <span>出厂编号</span>
                      <p v-if="readonly">{{detailsData.productionCode}}</p>
                      <el-input v-model="detailsData.productionCode"
                                style="width:190px"
                                size="small"
                                maxlength="20"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item prop="specificationModel">
                      <span>规格型号</span>
                      <p v-if="readonly">{{detailsData.specificationModel}}</p>
                      <el-input v-model="detailsData.specificationModel"
                                style="width:190px"
                                size="small"
                                maxlength="30"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item prop="technicalParameter">
                      <span>主要技术参数</span>
                      <p v-if="readonly">{{detailsData.technicalParameter}}</p>
                      <el-input v-model="detailsData.technicalParameter"
                                style="width:190px"
                                size="small"
                                maxlength="30"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item prop="ratedVoltage">
                      <span>额定电压</span>
                      <p v-if="readonly">{{detailsData.ratedVoltage}}</p>
                      <el-input v-model="detailsData.ratedVoltage"
                                style="width:190px"
                                size="small"
                                maxlength="10"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item prop="ratedCurrent">
                      <span>额定电流</span>
                      <p v-if="readonly">{{detailsData.ratedCurrent}}</p>
                      <el-input v-model="detailsData.ratedCurrent"
                                style="width:190px"
                                size="small"
                                maxlength="10"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item prop="frequency">
                      <span>频率</span>
                      <p v-if="readonly">{{detailsData.frequency}}</p>
                      <el-input v-model="detailsData.frequency"
                                style="width:190px"
                                size="small"
                                maxlength="10"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item prop="totalPower">
                      <span>总功率</span>
                      <p v-if="readonly">{{detailsData.totalPower}}</p>
                      <el-input v-model="detailsData.totalPower"
                                style="width:190px"
                                size="small"
                                maxlength="10"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item prop="locationNumber">
                      <span>点位数（消防总点位数）</span>
                      <p v-if="readonly">{{detailsData.locationNumber}}</p>
                      <el-input v-else
                                size="small"
                                v-model="detailsData.locationNumber"
                                style="width:190px"
                                onkeyup="value=value.replace(/[^0-9]/g,'')"
                                onpaste="value=value.replace(/[^0-9]/g,'')"
                                oncontextmenu="value=value.replace(/[^0-9]/g,'')"></el-input>
                    </el-form-item>
                    <el-form-item prop="systemNumber">
                      <span>系统数（消防分几个系统）</span>
                      <p v-if="readonly">{{detailsData.systemNumber}}</p>
                      <el-input v-else
                                size="small"
                                v-model="detailsData.systemNumber"
                                style="width:190px"
                                onkeyup="value=value.replace(/[^0-9]/g,'')"
                                onpaste="value=value.replace(/[^0-9]/g,'')"
                                oncontextmenu="value=value.replace(/[^0-9]/g,'')"></el-input>
                    </el-form-item>
                    <el-form-item prop="ladderSpeed">
                      <span>梯速</span>
                      <p v-if="readonly">{{detailsData.ladderSpeed}}</p>
                      <el-input v-model="detailsData.ladderSpeed"
                                size="small"
                                style="width:190px"
                                maxlength="10"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item prop="carrying">
                      <span>载重</span>
                      <p v-if="readonly">{{detailsData.carrying}}</p>
                      <el-input v-model="detailsData.carrying"
                                size="small"
                                style="width:190px"
                                maxlength="10"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item prop="station">
                      <span>站（电梯的停靠站数）</span>
                      <p v-if="readonly">{{detailsData.station}}</p>
                      <el-input v-else
                                size="small"
                                v-model="detailsData.station"
                                style="width:190px"
                                onkeyup="value=value.replace(/[^0-9]/g,'')"
                                onpaste="value=value.replace(/[^0-9]/g,'')"
                                oncontextmenu="value=value.replace(/[^0-9]/g,'')"></el-input>
                    </el-form-item>
                    <el-form-item prop="door">
                      <span>门（电梯开门数）</span>
                      <p v-if="readonly">{{detailsData.door}}</p>
                      <el-input v-else
                                size="small"
                                v-model="detailsData.door"
                                style="width:190px"
                                onkeyup="value=value.replace(/[^0-9]/g,'')"
                                onpaste="value=value.replace(/[^0-9]/g,'')"
                                oncontextmenu="value=value.replace(/[^0-9]/g,'')"></el-input>
                    </el-form-item>
                    <el-form-item prop="floor">
                      <span>层（电梯的楼层数）</span>
                      <p v-if="readonly">{{detailsData.floor}}</p>
                      <el-input v-else
                                size="small"
                                v-model="detailsData.floor"
                                style="width:190px"
                                onkeyup="value=value.replace(/[^0-9]/g,'')"
                                onpaste="value=value.replace(/[^0-9]/g,'')"
                                oncontextmenu="value=value.replace(/[^0-9]/g,'')"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </el-form>
              <div v-if="!readonly"
                   class="bottomBtn">
                <span @click="saveDevice('detailsData')"
                      class="subBtn">保存</span>
                <span @click="cannelFn"
                      class="quxiao_btn">取消</span>
              </div>
            </div>
          </div>
        </div>
        <div class="rightPart">
          <!-- <div class="rightTab"
               v-if="detailsData.equirementType.parent.id===25 || detailsData.equirementType.parent.id===2">
            <span :class="{active:rightPartShow===1}"
                  @click="changerightPartShow(1)">报修维保信息</span>
            <span :class="{active:rightPartShow===2}"
                  @click="changerightPartShow(2)"
                  v-if="detailsData.energyType==='METER'">能耗数据</span>
            <span :class="{active:rightPartShow===3}"
                  @click="changerightPartShow(3)"
                  v-if="detailsData.equirementType.parent.id===2">检测记录</span>
          </div> -->
          <div class="table1 equirementsRecords"
               v-show="rightPartShow===1">
            <p class="title"><span><i class="icon"></i>跟进记录</span></p>
            <div class="seachDiv">
              <el-date-picker v-model="start"
                              type="date"
                              :editable="false"
                              :clearable="false"
                              size="small"
                              style="width:180px"
                              value-format="yyyy-MM-dd"
                              placeholder="起始时间">
              </el-date-picker>
              <span style="margin:0 15px"> - </span>
              <el-date-picker v-model="end"
                              type="date"
                              size="small"
                              :editable="false"
                              :clearable="false"
                              style="width:180px;margin-right:15px;"
                              value-format="yyyy-MM-dd"
                              placeholder="结束时间">
              </el-date-picker>
              <span class="query-btn"
                    @click="getEquirementsRecords">查询</span>
            </div>
            <div class="tipsDiv">
              <!-- <span style="background-color:#CB5A00">巡更</span>
              <span style="background-color:#CEBF50">巡检</span>
              <span style="background-color:#3575F6">报修</span>
              <span style="background-color:#83BF68">维修</span>
              <span style="background-color:#F99A12">保养</span> -->
              <span v-for="(item,index) in recordTypeList"
                    :key="index"
                    :class="{'on':item.isOn}"
                    @click="recordTypeSelect(item)">{{item.label}}</span>
            </div>
            <el-timeline class="timeline"
                         style="padding-left: 200px;padding-top: 10px;overflow-x: hidden;"
                         :style="{height:((detailsData.equirementType.parent.id===25 && detailsData.energyType==='METER') || detailsData.equirementType.parent.id===2?'355px':'957px')}">
              <el-timeline-item placement="top"
                                style="position:relative;"
                                v-for="(item, index) in equirementsRecordsList"
                                :key="index"
                                :color="nodeColor(index)">
                <div class="statusBox">
                  <div :class="{'REPAIR_FORM':item.recordType==='REPAIR_FORM',
                  'REPAIR':item.recordType==='REPAIR',
                  'MAINTAIN':item.recordType==='MAINTAIN',
                  'PATROL':item.recordType==='PATROL',
                  'POLLING':item.recordType==='POLLING'
                  }">
                    {{formatTimeLineTitle(item.recordType)}}
                  </div>
                  <div :class="{'first':index===0}">{{formatApprovalDate(item.recordTime)}}</div>
                </div>
                <div class="template">
                  <div v-if="item.recordType==='REPAIR'">
                    <span>记录人：</span>
                    <span>{{item.contact}}</span>
                  </div>
                  <div v-if="item.recordType==='MAINTAIN'">
                    <span>维保人：</span>
                    <span>{{item.contact}}</span>
                  </div>
                  <div v-if="item.recordType==='REPAIR_FORM'">
                    <span>报修人：</span>
                    <span>{{item.contact}}</span>
                  </div>
                  <div v-if="item.recordType==='REPAIR'">
                    <span>维修记录：</span>
                    <!-- <span>{{item.repairStatus==='NO'?'维保未完成':'维保完成'}}</span> -->
                    <span>{{item.description}}</span>
                  </div>
                  <div v-if="item.recordType==='MAINTAIN'">
                    <span>维保结果：</span>
                    <span>{{item.repairStatus==='NO'?'维保未完成':'维保完成'}}</span>
                  </div>
                  <div v-if="item.recordType==='REPAIR_FORM'">
                    <span>问题简述：</span>
                    <span>{{item.description}}</span>
                  </div>
                  <div v-if="item.recordType==='PATROL'||item.recordType==='POLLING'">
                    <span>责任人：</span>
                    <span>{{item.contact}}</span>
                  </div>
                  <div v-if="item.recordType==='PATROL'||item.recordType==='POLLING'">
                    <span>巡更&巡检结果：</span>
                    <span :style="{color:(item.description==='异常'?'#f00':'')}">{{item.description}}</span>
                  </div>
                  <div>
                    <span>操作：</span>
                    <span @click="showDetails(item)"
                          class="chakanBtn">查看</span>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
          <!-- <div class="table2"
               v-show="rightPartShow===1">
            <p class="title"><span><i class="icon"></i>保养记录</span></p>
            <div class="table details_table"
                 style="border:none">
              <el-table :data="table2Data"
                        style="width: 100%"
                        ref="multipleTable">
                <el-table-column prop="repairRecordCode"
                                 label="维保编号"
                                 width="200"
                                 align="center"></el-table-column>
                <el-table-column prop="repairDate"
                                 label="维保日期"
                                 align="center"> </el-table-column>
                <el-table-column label="维保方式"
                                 align="center"
                                 :formatter="formatmaintenanceClassify"> </el-table-column>
                <el-table-column label="维保结果"
                                 align="center"
                                 :formatter="formatRepairStatus1"></el-table-column>
                <el-table-column label="操作"
                                 align="center">
                  <template slot-scope="scope">
                    <span @click="handleEdit2(scope.$index, scope.row)"
                          class="chakanBtn">查看</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="ctc-foot">
              <el-col :span="24">
                <span class="flex"
                      style="flex-direction: row-reverse;">
                  <el-pagination v-if="total1 > 0"
                                 background
                                 layout="prev, pager, next"
                                 :page-size=15
                                 :total="total1"
                                 :current-page="currentPage1"
                                 @current-change="current_change1">
                  </el-pagination>
                </span>
              </el-col>
            </div>
          </div> -->
          <div v-if="detailsData.equirementType.parent.id===25 && detailsData.energyType==='METER'"
               class="energyDiv">
            <p class="title">
              <span><i class="icon"></i>能耗记录</span>
              <el-button style="margin-right:10px;display:block"
                         v-if="hasAuthority('03010103')"
                         class="tban tban1"
                         @click="addEnergyDataFn"><i class="iconfont icon-crm_xinzeng-"></i> 新增数据</el-button>
            </p>
            <div class="eChart"
                 v-show="showType===1">
              <div class="seachDiv">
                <div>
                  <el-date-picker v-model="startDate"
                                  type="month"
                                  style="width:150px"
                                  :editable="false"
                                  :clearable="false"
                                  size="small"
                                  value-format="yyyy-MM-dd"
                                  :picker-options="pickerBeginDateBefore"
                                  placeholder="起始月份">
                  </el-date-picker>
                  <span> - </span>
                  <el-date-picker v-model="endDate"
                                  type="month"
                                  size="small"
                                  :editable="false"
                                  style="width:150px"
                                  :clearable="false"
                                  value-format="yyyy-MM-dd"
                                  :picker-options="pickerBeginDateAfter"
                                  placeholder="结束月份">
                  </el-date-picker>
                  <span class="query-btn"
                        style="margin-left:15px"
                        @click="chartDetails">查询</span>
                </div>
                <div class="changeBtnDiv">
                  <span class="iconfont icon-tubiao"
                        :class="{'active':showType === 1}"
                        title="展示柱状图"
                        @click="changeShowType(1)"></span>
                  <span class="iconfont icon-liebiao401"
                        :class="{'active':showType === 2}"
                        title="展示表格"
                        @click="changeShowType(2)"></span>

                </div>
              </div>
              <div id="myChart"
                   style="width:100%;height:500px"></div>
            </div>
            <div class="historyTable"
                 v-show="showType===2">
              <div class="seachDiv">
                <div>
                  <el-date-picker v-model="startDate"
                                  type="month"
                                  :editable="false"
                                  :clearable="false"
                                  style="width:150px"
                                  value-format="yyyy-MM-dd"
                                  placeholder="起始月份">
                  </el-date-picker>
                  <span> - </span>
                  <el-date-picker v-model="endDate"
                                  type="month"
                                  :editable="false"
                                  :clearable="false"
                                  style="width:150px"
                                  value-format="yyyy-MM-dd"
                                  placeholder="结束月份">
                  </el-date-picker>
                  <span class="query-btn"
                        style="margin-left:15px"
                        @click="searchHistoryTable">查询</span>
                </div>
                <div class="changeBtnDiv">
                  <span class="iconfont icon-tubiao"
                        :class="{'active':showType === 1}"
                        title="展示柱状图"
                        @click="changeShowType(1)"></span>
                  <span class="iconfont icon-liebiao401"
                        :class="{'active':showType === 2}"
                        title="展示表格"
                        @click="changeShowType(2)"></span>
                </div>
              </div>
              <div class="table3 details_table">
                <el-table :data="table3Data"
                          style="width: 100%"
                          ref="multipleTable">
                  <el-table-column prop="equirement.code"
                                   label="设备编号"
                                   align="center"> </el-table-column>
                  <el-table-column prop="equirement.name"
                                   label="设备名称"
                                   align="center"> </el-table-column>
                  <el-table-column label="时间"
                                   align="center"
                                   :formatter="formatconsumerTime"> </el-table-column>
                  <el-table-column label="用量"
                                   align="center"
                                   :formatter="formatconsumption"></el-table-column>
                  <el-table-column label="操作"
                                   v-if="hasAuthority('03010103')">
                    <template slot-scope="scope">
                      <el-button @click="editEnergy(scope.$index, scope.row)"
                                 class="el-button--primary operation-btn"
                                 plain
                                 size="mini">编 辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="ctc-foot">
                <el-col :span="24">
                  <span class="flex">
                    <el-pagination v-if="total2 > 0"
                                   background
                                   layout="prev, pager, next"
                                   :page-size=pgSize2
                                   :total="total2"
                                   :current-page="currentPage2"
                                   @current-change="current_change2">
                    </el-pagination>
                  </span>
                </el-col>
              </div>
            </div>
          </div>
          <div class="cheackRecord"
               v-show="detailsData.equirementType.parent.id===2">
            <p class="title"><span><i class="icon"></i>检测记录</span></p>
            <div class="seachDiv">
              <el-select v-model="cheackRes"
                         clearable
                         size="small"
                         placeholder="检测结果"
                         style="width:140px;">
                <el-option label="正常"
                           value="NORMAL"></el-option>
                <el-option label="异常"
                           value="ERROR"></el-option>
              </el-select>
              <el-date-picker v-model="startDate2"
                              type="date"
                              :editable="false"
                              :clearable="false"
                              size="small"
                              value-format="yyyy-MM-dd"
                              style="width:140px"
                              placeholder="起始月份">
              </el-date-picker>
              <span> - </span>
              <el-date-picker v-model="endDate2"
                              type="date"
                              size="small"
                              :editable="false"
                              :clearable="false"
                              style="width:140px"
                              value-format="yyyy-MM-dd"
                              placeholder="结束月份">
              </el-date-picker>
              <span class="query-btn"
                    @click="searcCheackRecord">查询</span>
            </div>

            <div class="table3 details_table">
              <el-table :data="table4Data"
                        style="width: 100%"
                        ref="multipleTable">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <span style="padding-left:20px">备注：{{props.row.comment}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="checkDate"
                                 label="日期"
                                 align="center"> </el-table-column>
                <el-table-column prop="equipmentType"
                                 label="检测类型"
                                 align="center"> </el-table-column>
                <el-table-column prop="checkStatusValue"
                                 label="检测结果"
                                 align="center">
                  <template slot-scope="props">
                    <span class="normal"
                          :class="{'abnormal' : props.row.checkStatusValue !== '正常'}">{{props.row.checkStatusValue}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作"
                                 align="center"
                                 v-if="hasAuthority('03050105')">
                  <template slot-scope="scope">
                    <span @click="handleEdit3(scope.$index, scope.row)"
                          style="color: #3575F6;cursor: pointer;text-decoration: underline;">查看</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="ctc-foot">
              <el-col :span="24">
                <span class="flex">
                  <el-pagination v-if="total3 > 0"
                                 background
                                 layout="prev, pager, next"
                                 :page-size=pgSize3
                                 :total="total3"
                                 :current-page="currentPage3"
                                 @current-change="current_change3">
                  </el-pagination>
                </span>
              </el-col>
            </div>
          </div>
        </div>
      </div>
    </drawer>
    <!-- 巡更巡检记录 -->
    <patrolPollingRecord :show="recordShow"
                         :recordDetails="recordDetails"
                         @close="recordClose" />
    <!-- 新增能耗数据 -->
    <el-dialog :title="this.energyModuleType ==='add'?'新增能耗数据':'编辑能耗数据'"
               :visible.sync="addEnergyDataShow"
               class="el_dialog_new"
               width="750px"
               @close="addEnergyDataClose"
               :close-on-click-modal="false">
      <addEnergyData :detailsData="detailsData"
                     v-if="addEnergyDataShow"
                     :energyData="energyData"
                     :energyModuleType="energyModuleType"
                     :addEnergyDataShow="addEnergyDataShow"
                     @refresh="getEnergyData"
                     @addEnergyDataClose="addEnergyDataClose" />
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import * as JSOG from 'jsog'
import aliUpload from '@/components/aliUpload.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import ailPreview from '@/components/ailPreview.vue'
import addEnergyData from './addEnergyData.vue'
import patrolPollingRecord from '../../patrolPollingRecord/components/patrolPollingRecordD' // 巡更巡检记录
export default {
  name: 'deviceDetails',
  components: {
    Drawer,
    ailPreview,
    addEnergyData,
    aliDownLoad,
    patrolPollingRecord,
    aliUpload
  },
  props: {
    equirementClass: { // equirementClass 设施设备 通用 common  能耗消防弱电other  区分详情编辑大类
      type: String,
      default: 'common'
    },
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    tenantList: {},
    detailsData: {
      type: Object,
      default: {
        equirementType: {
          name: '',
          id: '',
          parent: {
            id: '',
            name: ''
          }
        }
      }
    },
    equirementTypes: {
      type: Array,
      default: []
    },
    projectManagementsList: {
      type: Array,
      default: []
    }
  },
  watch: {
    detailsdrawershow: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          // this.getRepair_records() //维保列表
          // this.getRepair_forms() //报修列表
          this.dateInit()
          this.end = this.getCurrentMonthLastDay1()
          this.start = this.getCurrentMonthLastDay2()
          this.getEquirementsRecords() // 跟进记录
          if (this.detailsData.equirementType.parent.id === 25 && this.detailsData.energyType === 'METER') { // 能耗&仪表 查询能耗数据
            this.getEnergyData() // 请求能耗数据
          }
          if (this.detailsData.equirementType.parent.id === 2) { // 消防设备 查询检测记录
            this.getCheackRecord()
          }
        }
      },
      immediate: true
    }
  },
  mounted () {

  },
  data () {
    return {
      energyData: null, // 编辑能耗数据
      energyModuleType: 'add', // 能耗新增or编辑弹窗
      addEnergyDataShow: false,
      recordTypeList: [
        { label: '巡更', value: 'PATROL', isOn: true },
        { label: '巡检', value: 'POLLING', isOn: true },
        { label: '维修', value: 'REPAIR', isOn: true },
        { label: '保养', value: 'MAINTAIN', isOn: true }
      ],
      recordTypeParams: ['PATROL', 'POLLING', 'REPAIR', 'MAINTAIN'],
      recordDetails: {
        annexes: [],
        completeTime: '',
        patrolInspection: {}
      },
      recordShow: false,
      showType: 1,
      upLoadText: '上传附件',
      fileType: [],
      iconImg: 'icon-shangchuantupianicon',
      maintenanceClassify: '',
      equirementsRecordsList: [], // 设备跟进记录
      cheackRes: '',
      start: '',
      end: '',
      startDate: '',
      endDate: '',
      startDate2: '',
      endDate2: '',
      myChart: null,
      rightPartShow: 1,
      radio: '',
      berthImg: require('../../../../assets/berth-default.png'),
      fileType_cost: ['png', 'jpg'],
      upLoadText_cost: '上传图片',
      table1Data: [],
      table2Data: [],
      table3Data: [],
      table4Data: [],
      toolTips: false,
      equirementTypesChild: [],
      buildingOption: [],
      addDeviStep: 1,
      addFlowRules: {
        'equirementType.parent.id': [
          { required: true, message: '请选择设备大类', trigger: 'blur' }
        ],
        'equirementType.id': [
          { required: true, message: '请选择设备小类', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入设备编号', trigger: 'blur' }
        ],
        'tenant.id': [
          { required: true, message: '请选择关联商户', trigger: 'change' }
        ],
        energyType: [
          { required: true, message: '请选择能耗类型', trigger: 'blur' }
        ],
        instrumentType: [
          { required: true, message: '请选择仪表类型', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入设备名称', trigger: 'change' }
        ],
        projectManagement: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        building: [
          { required: true, message: '请选择楼宇', trigger: 'change' }
        ],
        personLiable: [
          { required: true, message: '请输入责任人', trigger: 'blur' }
        ],
        personLiableTelephone: [
          { required: true, message: '请输入责任人手机号', trigger: 'blur' }
        ],
        useStatus: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        installPosition: [
          { required: true, message: '请输入设备位置', trigger: 'blur' }
        ],
        onMaintenance: [
          { required: true, message: '请选择是否需要维保', trigger: 'change' }
        ],
        maintenancePeriod: [
          { required: true, message: '请选择维保周期', trigger: 'change' }
        ],
        onMaintain: [
          { required: true, message: '请选择是否需要巡检', trigger: 'change' }
        ],
        maintainPeriodDay: [
          { required: true, message: '请输入巡检周期', trigger: 'change' }
        ],
        onMeterReading: [
          { required: true, message: '请选择是否需要抄表', trigger: 'change' }
        ],
        onPatrol: [
          { required: true, message: '请选择是否需要巡更', trigger: 'change' }
        ]
      },
      drawerTitle: '设施设备详情',
      readonly: true,
      buildingItem: 0,
      currentPage: 1,
      total: 1,
      pgSize: 15,
      currentPage1: 1,
      total1: 1,
      pgSize1: 15,
      currentPage2: 1,
      total2: 1,
      pgSize2: 15,
      currentPage3: 1,
      total3: 1,
      pgSize3: 15,
      index: 0,
      len2: 0,
      pickerBeginDateBefore: {
        disabledDate: time => {
          let endDateVal = this.endDate
          if (endDateVal) {
            let temp = new Date(endDateVal).getTime() - 365 * 24 * 60 * 60 * 1000
            return time.getTime() < new Date(temp).getTime()
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
      }
    }
  },
  methods: {
    equirementTypesChildChange () {
      this.detailsData.energyType = null
    },
    editEnergy (index, row) { // 编辑能耗
      this.energyData = row
      this.energyModuleType = 'edit'
      this.addEnergyDataShow = true
    },
    addEnergyDataFn () {
      this.energyModuleType = 'add'
      this.addEnergyDataShow = true
    },
    addEnergyDataClose () {
      this.addEnergyDataShow = false
    },
    recordTypeSelect (item) {
      item.isOn = !item.isOn
      let arr = this.recordTypeList.map((itm, i) => {
        if (itm.isOn) {
          return itm.value
        }
      })
      this.recordTypeParams = arr.filter(item => item)
      console.log(this.recordTypeParams)
      this.getEquirementsRecords()
    },
    recordClose () {
      this.recordShow = false
    },
    changeShowType (n) { // 切换图表 表格展示
      this.showType = n
      this.getEnergyData()
    },
    energyTypeChange () { // 仪表类型切换
      this.changerightPartShow(1)
    },
    setFile () {

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
    cannelFn () { // 取消
      this.readonly = true
      this.$refs['detailsData'].resetFields()
      this.$emit('cannelFn', this.detailsData.id)
    },
    formatTimeLineTitle (type) { // 时间线头部遍历
      switch (type) {
        case 'REPAIR_FORM':
          return '报修'
        case 'REPAIR':
          return '维修'
        case 'MAINTAIN':
          return '保养'
        case 'PATROL':
          return '巡更'
        case 'POLLING':
          return '巡检'
      }
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
    getEquirementsRecords () { // 获取设备跟进记录
      context.http.get('cms/api/equirements/records', {
        id: this.detailsData.id,
        type: this.recordTypeParams.toString(),
        start: this.start,
        end: this.end
      }).then(res => {
        this.equirementsRecordsList = res.data
      }).catch(error => {
        console.info(error)
      })
    },
    searcCheackRecord () {
      this.currentPage3 = 1
      this.getCheackRecord()
    },
    radioChange (instrumentType) {
      if (this.detailsData.instrumentType === 'ORDINARY_TABLE') {
        this.detailsData.tenant = { id: null }
      }
    },
    searchHistoryTable () {
      this.currentPage2 = 1
      this.tableData2Details()
    },
    dateInit () {
      let now = new Date()
      let next = new Date()
      this.startDate = now.getFullYear() + '-01-01'
      this.startDate = now.getFullYear() + '-01-01'
      this.endDate = this.getCurrentMonthLastDay()
      // this.endDate = this.getCurrentMonthLastDay()
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
      day = day < 10 ? '0' + day : day
      return year + '-' + month + '-' + day
    },
    getCurrentMonthLastDay2 () {
      var date = new Date().getTime() - 365 * 24 * 60 * 60 * 1000
      date = new Date(date)
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      var day = date.getDate()
      day = day < 10 ? '0' + day : day
      return year + '-' + month + '-' + day
    },
    drawLine (dateArray, useLevel) {
      this.myChart = this.$echarts.init(document.getElementById('myChart'))
      this.myChart.clear()
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            const item = params[0]
            return item.axisValue + '<br>' + '用量：' + item.data
          }
        },
        xAxis: {
          axisLabel: {
            // interval: 0
          },
          axisTick: {
            alignWithLabel: true
          },
          type: 'category',
          data: dateArray
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: useLevel,
          type: 'line',
          areaStyle: {},
          smooth: true
        }]
      }
      this.myChart.setOption(option)
    },
    getEnergyData () { // 请求能耗数据
      context.http.get(`cms/api/energyData/equirementId`, {
        equirementId: this.detailsData.id,
        from: this.startDate,
        to: this.endDate,
        sort: 'consumerTime,desc',
        page: (this.currentPage2 - 1),
        size: this.pgSize2
      }).then(res => {
        this.table3Data = JSOG.decode(res.data)
        this.total2 = Number(res.headers['x-total-count'])
        context.http.get(`cms/api/energyData/diagram`, { equirementId: this.detailsData.id, from: this.startDate, to: this.endDate }).then(result => {
          let data = result.data
          let dateArray = [] // 时间
          let useLevel = [] // 用量
          data.forEach(ele => {
            dateArray.push((ele.consumerTime).substring(0, 7))
            useLevel.push(ele.consumption)
          })
          if (dateArray.length === 0) {
            dateArray = ['2019.01', '2019.02', '2019.03', '2019.04', '2019.05', '2019.06', '2019.07', '2019.08', '2019.09', '2019.10', '2019.11', '2019.12']
          }
          setTimeout(() => {
            this.drawLine(dateArray, useLevel)
          }, 200)
        })
      }).catch(error => {
        console.info(error)
      })
    },
    chartDetails () { // 详情图标
      if (!this.startDate || !this.endDate) {
        this.$message.error('请输入时间区间')
        return
      }
      context.http.get(`cms/api/energyData/diagram`, { equirementId: this.detailsData.id, from: this.startDate, to: this.endDate }).then(res => {
        let data = JSOG.decode(res.data)
        let dateArray = [] // 时间
        let useLevel = [] // 用量
        data.forEach(ele => {
          dateArray.push((ele.consumerTime).substring(0, 7))
          useLevel.push(ele.consumption)
        })
        if (dateArray.length === 0) {
          dateArray = ['2019.01', '2019.02', '2019.03', '2019.04', '2019.05', '2019.06', '2019.07', '2019.08', '2019.09', '2019.10', '2019.11', '2019.12']
        }
        setTimeout(() => {
          this.drawLine(dateArray, useLevel)
        }, 200)
      })
    },
    tableData2Details () { // 详情历史数据
      if (!this.startDate || !this.endDate) {
        this.$message.error('请输入时间区间')
        return
      }
      context.http.get(`cms/api/energyData/equirementId`, {
        equirementId: this.detailsData.id,
        from: this.startDate,
        to: this.endDate,
        sort: 'consumerTime,desc',
        page: (this.currentPage2 - 1),
        size: this.pgSize2
      }).then(res => {
        this.table3Data = JSOG.decode(res.data)
        this.total2 = Number(res.headers['x-total-count'])
      })
    },
    formatconsumption (row, column) {
      if (row.equirement.equirementType.name === '电') {
        return row.consumption + 'kw.h'
      } else {
        return row.consumption + 'm³'
      }
    },
    formatconsumerTime (row, column) {
      return row.consumerTime.substring(0, 7)
    },
    getCheackRecord () { // 检测记录
      context.http.get('cms/api/fcReportsDetails?sort=fireControlReport.checkDate,desc&sort=createdDate,desc', {
        equipmentId: this.detailsData.id,
        checkStatus: this.cheackRes,
        startDate: this.startDate2,
        endDate: this.endDate2,
        page: (this.currentPage3 - 1),
        size: this.pgSize3
      }).then(res => {
        this.table4Data = res.data
        this.total3 = Number(res.headers['x-total-count'])
      }).catch(error => {
        console.info(error)
      })
    },
    changerightPartShow (n) { // 能耗数据tab切换
      this.rightPartShow = n
      if (n === 2) {
        this.$nextTick(function () {
          this.getEnergyData()
        })
      } else if (n === 3) {
        this.getCheackRecord()
      } else {
        if (this.myChart) {
          this.myChart.dispose()
        }
      }
    },
    formatinstrumentType (n) {
      switch (n) {
        case 'ORDINARY_TABLE':
          return '普通表'
        case 'PUBLIC_TABLE':
          return '公共表'
        case 'SUMMARY_TABLE':
          return '总表'
      }
    },
    formatenergyType (n) {
      switch (n) {
        case 'METER':
          return '仪表'
        case 'SWITCH':
          return '开关'
        case 'LAMP':
          return '照明'
        case 'VRV':
          return '空调'
        case 'OTHER':
          return '其他'
      }
    },
    getTenantList (id) {
      context.http.get(`cms/api/tenant/projectManagement/${id}`, { size: 10000 }).then(res => { // 根据项目id查所有客户
        this.$emit('updateTenantList', res.data)
        // this.repairDetailsShow1 = true
      }).catch(error => {
        console.info(error)
      })
    },
    getRepair_records () { // 根据设备id 查维保记录列表
      context.http.get(`/cms/api/equirements/${this.detailsData.id}/repair-records`,
        {
          maintenanceClassify: 'MAINTAIN',
          page: (this.currentPage1 - 1),
          size: this.pgSize1
        }).then(res => {
          if (res) {
            this.table2Data = res.data
            this.total1 = Number(res.headers['x-total-count'])
          }
        })
    },
    getRepair_forms () { // 根据设备id 查报修信息列表
      context.http.get('/cms/api/repair-forms',
        {
          equirementId: this.detailsData.id,
          page: (this.currentPage - 1),
          size: this.pgSize
        }).then(res => {
          if (res) {
            this.table1Data = res.data
            this.total = Number(res.headers['x-total-count'])
          }
        })
    },
    deleteImg (index) {
      this.index = 0
      this.Change()
      this.detailsData.imageUrls.splice(index, 1)
    },
    formatRepairStatus (row, column) {
      switch (row.repairStatus) {
        case 'REFERED':
          return '待处理'
        case 'WAIT':
          return '处理中'
        case 'OVER':
          return '已处理'
      }
    },
    formatRepairStatus1 (row, column) {
      switch (row.repairStatus) {
        case 'COMPLETE':
          return '维保完成'
        case 'NO':
          return '维保未完成'
      }
    },
    formatmaintenanceClassify (row, column) {
      if (row.maintenanceClassify === 'REPAIR') {
        return '维修'
      } else if (row.maintenanceClassify === 'MAINTAIN') {
        return '保养'
      } else {
        return '-'
      }
    },
    showDetails (item) { // 上记录入口
      if (item.recordType === 'REPAIR_FORM') { // 报修单
        this.$emit('emitOpenbaoxiu', item.repairFormId)
      } else if (item.recordType === 'REPAIR') { // 维修 false表示维修单 无报修信息
        this.$emit('emitOpenweixiu', item.repairFormId)
      } else if (item.recordType === 'MAINTAIN') { //  保养
        this.$emit('emitOpenbaoyang', item.id)
      } else if (item.recordType === 'PATROL' || item.recordType === 'POLLING') {
        // item.id
        context.http.get(`/cms/api/patrolInspectionRecord/${item.id}`).then(res => {
          this.recordDetails = res.data
          this.recordShow = true
        })
      }
    },
    handleEdit2 (index, row) { // 下table入口
      let id = row.id
      if (row.maintenanceClassify === 'REPAIR') { // 维修 true表示维修单里有报修信息
        this.$emit('emitOpenweixiu', row.repairFormId)
      } else if (row.maintenanceClassify === 'MAINTAIN') { //  保养
        this.$emit('emitOpenbaoyang', id)
      }
    },
    handleEdit3 (index, row) {
      this.$parent.firecontrolDetails(row.reportId)
    },
    setAnnex (annexURL, annexName) {
      if (!this.detailsData.imageUrls) {
        this.detailsData.imageUrls = []
      }
      this.detailsData.imageUrls.splice(0, 0, annexURL)
    },
    setActiveItem (i) {
      this.$refs.carousel.setActiveItem(i)
    },
    equirementTypeChange (flag) { // 大类切换
      // this.detailsData.energyType = null
      let id = this.detailsData.equirementType.parent.id
      if (flag !== 'onEdit') {
        this.detailsData.equirementType.id = ''
        this.detailsData.energyType = null
        this.detailsData.instrumentType = null
      }
      for (let i = 0; i < this.equirementTypes.length; i++) {
        if (id === this.equirementTypes[i].id) {
          this.equirementTypesChild = this.equirementTypes[i].child
        }
      }
    },
    recordTypeInit () {
      this.recordTypeList.forEach((item, index) => {
        item.isOn = true
      })
      this.recordTypeParams = ['PATROL', 'POLLING', 'REPAIR', 'MAINTAIN']
    },
    onHide () {
      this.drawerTitle = '设施设备详情'
      this.$emit('drawerClose', false)
      this.readonly = true
      this.addDeviStep = 1
      this.recordTypeInit()
      if (this.myChart) {
        this.myChart.dispose()
      }
      this.showType = 1
      this.rightPartShow = 1
      this.currentPage1 = 1
      this.currentPage2 = 1
      this.currentPage3 = 1
      this.index = 0
      this.cheackRes = ''
      this.startDate2 = ''
      this.endDate2 = ''
      this.$refs['detailsData'].resetFields()
      this.Change()
    },
    onEdit () {
      this.readonly = false
      this.projectChange() // 第二个参数为true时 则是点编辑时第一次请求商户列表  当前商户不清空
      this.equirementTypeChange('onEdit')
    },
    saveDevice (formName) {
      let _this = this
      if (this.detailsData.equirementType.parent.id !== 25 || this.detailsData.energyType !== 'METER' || this.detailsData.instrumentType !== 'ORDINARY_TABLE') {
        this.detailsData.tenant = null
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _this = this
          context.http.put('/cms/api/equirements', this.detailsData).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              if (this.detailsData.equirementType.parent.id === 25 && this.detailsData.energyType === 'METER') { // 能耗&仪表 查询能耗数据
                this.getEnergyData() // 请求能耗数据
              }
              _this.cannelFn()
              _this.$emit('bindSuccessFun')
              _this.$emit('query')
            }
          })
        } else {
          if (_this.detailsData.equirementType.parent.id === '' ||
            _this.detailsData.equirementType.id === '' ||
            _this.detailsData.code === '' ||
            // !_this.detailsData.instrumentType ||
            (_this.detailsData.tenant && !_this.detailsData.tenant.id) ||
            _this.detailsData.name === '' ||
            _this.detailsData.projectManagement === '' ||
            _this.detailsData.building === '' ||
            _this.detailsData.personLiable === '' ||
            _this.detailsData.personLiableTelephone === '' ||
            _this.detailsData.useStatus === '' ||
            _this.detailsData.installPosition === ''
          ) {
            _this.addDeviStep = 1
          } else if (
            _this.detailsData.onMaintenance === '' ||
            _this.detailsData.maintenancePeriod === '' ||
            !_this.detailsData.maintenancePeriod ||
            _this.detailsData.onMaintain === '' ||
            _this.detailsData.maintainPeriodDay === '' ||
            _this.detailsData.onMeterReading === ''
          ) {
            _this.addDeviStep = 2
          }
          console.log('error submit!!')
          return false
        }
      })
    },
    formatoutsourceType (n) {
      if (n === 'WARRANTY') {
        return '质保期内'
      } else if (n === 'PARTY_A') {
        return '甲方外包'
      } else if (n === 'CLEAR_BIG') {
        return '清包'
      } else if (n === 'TUNDISH') {
        return '中包'
      } else if (n === 'BUNDLE') {
        return '小包'
      } else if (n === 'NO') {
        return '无'
      }
    },
    formatMaintenanceType (n) {
      if (n === 'FACTORY_MADLE') {
        return '原厂维保'
      } else if (n === 'SUB_CONTRACTOR') {
        return '外委维保'
      } else if (n === 'GROUP') {
        return '集团维保'
      } else if (n === 'NO') {
        return '无'
      }
    },
    formatMaintenancePeriod (n) {
      if (n === 'WEEK') {
        return '周'
      } else if (n === 'DAY') {
        return '天'
      } else if (n === 'MONTH') {
        return '月'
      } else if (n === 'YEAR') {
        return '年'
      }
    },
    changeAddDeviStep (step) {
      this.addDeviStep = step
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
      // return true
    },
    projectChange (flag) { // isChange是否手动更改
      context.http.get('cms/api/buildings', { page: 0, size: 50, sort: 'desc', useStatus: 'USING', projectId: this.detailsData.projectManagement.id }).then(res => {
        this.buildingOption = res.data.buildingListDTOS
        if (flag === 'changePrject') {
          this.getTenantList(this.detailsData.projectManagement.id)
          this.detailsData.tenant = {
            id: null
          }
          this.$set(this.detailsData, 'building', this.buildingOption[0])
        } else {
          this.$set(this.detailsData, 'building', this.detailsData.building)
          this.getTenantList(this.detailsData.projectManagement.id)
        }
      })
    },
    formatBillType (val) {
      let res = '-'
      let equipmentOptions = this.equipmentOptions
      equipmentOptions.forEach(ele => {
        if (val === ele.value) {
          res = ele.label
        }
      })
      return res
    },
    current_change1 (currentPage) { // 切换页码
      this.currentPage1 = currentPage
      this.getRepair_records()
    },
    current_change2 (currentPage) { // 切换页码
      this.currentPage2 = currentPage
      this.tableData2Details()
    },
    current_change3 (currentPage) { // 切换页码
      this.currentPage3 = currentPage
      this.getCheackRecord()
    },
    current_change (currentPage) { // 切换页码
      this.currentPage = currentPage
      this.getRepair_forms()
    },
    G (s) {
      return document.getElementById(s)
    },
    getStyle (obj, attr) {
      if (obj.currentStyle) {
        return obj.currentStyle[attr]
      } else {
        return getComputedStyle(obj, false)[attr]
      }
    },
    Change () {
      var oList = this.G('listBox')
      var oListLi = oList.getElementsByClassName('itemImg-div')
      var oPrev = this.G('prev')
      var oNext = this.G('next')
      var len2 = oListLi.length
      if (!oListLi.length) {
        return
      }

      var oListUl = document.getElementsByClassName('cf')[0]
      var w2 = oListLi[0].offsetHeight
      oListUl.style.height = w2 * len2 + 'px'
      var index = this.index
      var num = 3
      // var num2 = Math.ceil(3 / 2)
      // if (index + num2 >= len2) {
      //   $(oListUl).animate({top: 0})
      //   index = 0
      // } else if (index < len2) {
      //   $(oListUl).animate({top: -(index) * w2 - index * 10})
      // }
      if (index === 0) {
        $(oListUl).animate({ top: 0 })
      } else {
        $(oListUl).animate({ top: -(index) * w2 - index * 10 })
      }
      this.index = index
      this.len2 = len2
    },
    prevClick () {
      var oList = this.G('listBox')
      var oListLi = oList.getElementsByClassName('itemImg-div')
      var len2 = oListLi.length
      if (this.index === 0) {
        return
      }
      this.index--
      // this.index = this.index === -1 ? len2 - 1 : this.index
      this.Change()
    },
    nextClick () {
      var oList = this.G('listBox')
      var oListLi = oList.getElementsByClassName('itemImg-div')
      var len2 = oListLi.length
      if (this.index === len2 - 3) {
        return
      }
      this.index++
      // this.index = this.index === len2 ? 0 : this.index
      this.Change()
    }
  }
}
</script>
<style lang="scss">
.deviceDetails_new {
  .aliUpload_small {
    width: 100%;
    height: 100%;
  }
  .dialog-footer1 {
    padding-right: 40px;
    text-align: right;
    height: 60px;
    background-color: #fff;
    margin-top: 0;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
  }
  > div {
    &.vue-drawer {
      background-color: #faf7fa !important;
      .drawer {
        overflow-y: auto;
        overflow-x: hidden;
      }
      .wrap {
        height: 100%;
        background-color: #faf7fa !important;
        min-height: auto;
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
          font-size: 20px;
          color: #b9b9b9;
          margin-top: 20px;
        }

        .el-dialog__title {
          color: #262626;
          font-size: 16px;
        }
      }

      .dialog-footer {
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

  .ctc-foot {
    justify-content: normal;
    flex-direction: row-reverse;
    align-items: center;
    color: #3f5fbf;
    font-size: 12px;
    padding: 15px 20px 15px 20px;
    .flex {
      justify-content: flex-end;
    }
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
.deviceDetails {
  margin-right: 0px !important;
  .oss_file {
    width: 100%;
    height: 100%;
    border: none;
    background-color: #eeeeee;
    line-height: 80px;
    color: #3577f6;
    > .iconfont {
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      width: 100%;
      height: 100%;
      top: -10px;
      font-size: 24px;
    }
    > span {
      width: auto;
      padding-left: 0;
      position: absolute;
      left: 0;
      right: 0;
      bottom: -22px;
    }
  }
}
.device-details {
  .el-date-editor.el-input {
    width: 100%;
  }
  .el-radio__label {
    font-size: 12px;
    padding-left: 5px;
  }
  .el-radio {
    margin-right: 8px;
  }
  .dialog-footer {
    .el-button--primary {
      color: #ffffff;
    }
  }
  .el-button--primary {
    color: #3175f6 !important;
    background-color: #ffffff !important;
    border-color: #3175f6 !important;
  }
  .el-button--primary:hover {
    background-color: #3577f6 !important;
    border-color: #3577f6 !important;
    color: #ffffff !important;
  }
}
</style>
<style lang="scss" scoped>
.normal {
  color: #49af61;
}
.abnormal {
  color: #ff6665;
}
.device-details {
  &.deviceDetails_new {
    .main-content {
      width: 1300px;
      display: flex;
      justify-content: space-between;
      margin: 15px;
      height: calc(100% - 90px);
      overflow-y: auto;
      overflow-x: hidden;
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
      .title {
        height: 45px;
        line-height: 45px;
        padding: 0 15px;
        border-bottom: 1px solid #eeeeee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        font-weight: bold;
        color: #262626;
        > span {
          > i {
            &.icon {
              display: inline-block;
              width: 4px;
              height: 16px;
              background: #3575f6;
              border-radius: 2px;
              margin-right: 5px;
            }
          }
        }
      }
      .leftPart {
        width: 680px;
        background-color: #ffffff;
        > .scrollDiv {
          background-color: #ffffff;
        }
        .imgContant {
          position: relative;
          .carousel-itemImg {
            position: relative;
            .listBox {
              width: 130px;
              height: 250px;
              margin: 20px 0 0 10px;
              position: relative;
              overflow: hidden;
              position: relative;
            }
            .btn {
              position: absolute;
              width: 20px;
              height: 20px;
              line-height: 20px;
              cursor: pointer;
              z-index: 99;
              font-size: 20px;
              font-weight: bold;
              // background-color: rgba(31,45,61,.23);
              i {
                color: #777;
              }
            }
            .prev {
              top: 270px;
              right: 90px;
              transform: rotate(90deg);
            }
            .next {
              top: 270px;
              right: 50px;
              transform: rotate(90deg);
            }
          }
          .carousel {
            margin: 29px auto;
            width: 400px;
            height: 240px;
            margin-left: 100px;
          }
          .itemImg {
            width: 120px;
            margin: 20px 0 0 20px;
            // justify-content: space-between;
            .cf {
              width: 120px;
              position: absolute;
              div {
                width: 120px;
                height: 72px;
                margin-right: 10px;
                position: relative;
                margin-bottom: 13px;
                img {
                  width: 120px;
                  height: 72px;
                }
                i {
                  position: absolute;
                  top: -8px;
                  right: -8px;
                  cursor: pointer;
                  color: #105cee;
                }
              }
            }
            .itemImg-div {
              &:first-child {
                margin-top: 8px;
              }
            }
          }
        }
        .tabContent {
          .el-form {
            padding: 15px;
          }
          .menuTab {
            height: 60px;
            align-items: center;
            display: flex;
            margin: 0 30px;
            border: 1px solid #eee;
            box-shadow: 1px 1px 3px 0px #eee;
            > span {
              display: inline-block;
              width: 120px;
              text-align: center;
              cursor: pointer;
              height: 58px;
              line-height: 58px;
              &.active {
                color: #3175f6ff;
                border-bottom: 2px solid #3175f6ff;
              }
            }
          }
          .content {
            padding-top: 1px;
            .title {
              padding-left: 15px;
            }
            .itemContent {
              padding: 15px 10px;
              display: flex;
              flex-wrap: wrap;
              .item {
                width: 33%;
                min-height: 70px;
                padding-left: 20px;
                > p {
                  font-size: 14px;
                  margin-bottom: 10px;
                }
                > span {
                  display: inline-block;
                  width: 100%;
                  font-size: 12px;
                  color: #8e8e8e;
                  word-break: break-all;
                }
              }
            }
          }
        }
        .tabContent {
          .headTab {
            height: 45px;
            line-height: 45px;
            border-top: 1px solid #f6f6f6;
            border-bottom: 1px solid #f6f6f6;
            > span {
              display: inline-block;
              text-align: center;
              cursor: pointer;
              font-size: 14px;
              height: 45px;
              padding: 0 10px;
              margin-right: 15px;
              line-height: 45px;
              &.active {
                color: #3175f6;
                border-bottom: 2px solid #3175f6;
              }
            }
          }
          .bottomBtn {
            height: 40px;
            height: 40px;
            display: flex;
            flex-direction: row-reverse;
            color: #777777;
            padding-right: 15px;
            > span {
              display: inline-block;
              width: 70px;
              line-height: 32px;
              height: 32px;
              text-align: center;
              cursor: pointer;
              border-radius: 4px;
              &.subBtn {
                background-color: #3577f6;
                color: #ffffff;
              }
            }
          }
          .part {
            .title {
              width: 100%;
              height: 40px;
              font-size: 14px;
              line-height: 40px;
              padding-left: 15px;
              background-color: #fafafaff;
              margin-bottom: 20px;
            }
            .content {
              display: flex;
              flex-wrap: wrap;
              .partitionDiv {
                width: 100%;
                border-bottom: 1px solid #eeeeee;
                margin-bottom: 10px;
              }
              .el-form-item {
                width: 31%;
                // margin-left: 10px;
                &.width38 {
                  width: 38%;
                }
                .el-form-item__content {
                  > span {
                    margin-bottom: 5px;
                    display: inline-block;
                    height: 35px;
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    color: #777777;
                    > .toolTips {
                      display: inline-block;
                      font-style: normal;
                      font-size: 12px;
                      padding: 8px 3px;
                      background-color: rgba(0, 0, 0, 0.7);
                      color: #fff;
                      border-radius: 5px;
                      margin-left: 5px;
                      position: relative;
                      > .icon {
                        width: 0;
                        height: 0;
                        border-width: 8px;
                        border-style: solid;
                        border-color: transparent rgba(0, 0, 0, 0.7) transparent
                          transparent;
                        position: absolute;
                        left: -16px;
                        top: 9px;
                      }
                    }
                  }
                  > p {
                    font-size: 14px;
                    color: #262626;
                    min-height: 30px;
                    // line-height: 40px;
                    width: 180px;
                    word-break: break-all;
                    // overflow: hidden;
                    // text-overflow: ellipsis;
                    // white-space: nowrap;
                  }
                  .el-textarea__inner {
                    resize: none !important;
                  }
                }
              }
            }
          }
        }
      }
      .rightPart {
        width: 600px;
        .seachDiv {
          padding: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          .query-btn {
            display: inline-block;
            width: 70px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            cursor: pointer;
            color: #fff;
            border-radius: 3px;
            background-color: #3577f6;
            margin: 0;
          }
          .query-btn:hover {
            background-color: #2a6ef0;
          }
          .changeBtnDiv {
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
        }
        .cheackRecord {
          background-color: #ffffff;
        }
        .rightTab {
          height: 50px;
          line-height: 50px;
          font-size: 14px;
          color: #666;
          // border: 1px solid rgba(238, 238, 238, 1);
          // box-shadow: 0px 2px 3px 0px rgba(190, 199, 208, 0.2);
          margin-bottom: 15px;
          background-color: #fff;
          > span {
            padding: 0 15px;
            cursor: pointer;
            display: inline-block;
            height: 48px;
            &.active {
              color: #3175f6;
              border-bottom: 2px solid #3175f6;
            }
          }
        }
        .eChart {
          border: 1px solid #f7f7f7;
          min-height: 410px;
          margin-bottom: 20px;
        }
        .historyTable {
          border: 1px solid #f7f7f7;
          min-height: 410px;
        }
        .table1 {
          background-color: #ffffff;

          &.equirementsRecords {
            > .seachDiv {
              justify-content: flex-start;
            }
            .tipsDiv {
              text-align: right;
              padding-right: 15px;
              > span {
                display: inline-block;
                width: 38px;
                height: 18px;
                line-height: 18px;
                border-radius: 4px;
                text-align: center;
                font-size: 12px;
                color: #ffffff;
                background-color: #cdcdcd;
                margin-right: 10px;
                cursor: pointer;
                &.on {
                  &:nth-child(1) {
                    background-color: #cb5a00;
                  }
                  &:nth-child(2) {
                    background-color: #cebf50;
                  }
                  &:nth-child(3) {
                    background-color: #83bf68;
                  }
                  &:nth-child(4) {
                    background-color: #f99a12;
                  }
                }
              }
            }
            .timeline {
              height: 355px;
              margin-bottom: 15px;
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
                    &.REPAIR_FORM {
                      background: #3575f6;
                      border-radius: 4px;
                      color: #ffffff;
                    }
                    &.REPAIR {
                      background: #83bf68;
                      border-radius: 4px;
                      color: #ffffff;
                    }
                    &.MAINTAIN {
                      background: #f99a12;
                      border-radius: 4px;
                      color: #ffffff;
                    }
                    &.PATROL {
                      background: #cb5a00;
                      border-radius: 4px;
                      color: #ffffff;
                    }
                    &.POLLING {
                      background: #cebf50;
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
                padding-right: 8px;
                > div {
                  > span {
                    &:first-child {
                      color: #262626;
                    }
                    &:last-child {
                      color: #777777;
                      &.chakanBtn {
                        color: #3575f6;
                        cursor: pointer;
                        &:hover {
                          text-decoration: underline;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        .table3 {
          background-color: #ffffff;
          // height: 575px;
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
        .energyDiv {
          background-color: #ffffff;
          // height: 783px;
          height: 680px;
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
        .table2 {
          background-color: #ffffff;
          .table {
            height: 397px;
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
            .chakanBtn {
              color: #3575f6;
              cursor: pointer;
              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
      }
    }
  }
}
</style>
