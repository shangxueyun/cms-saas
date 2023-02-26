<template>
  <div class="addEquipment">
    <div class="dialog_content">
      <div class="menuTab">
        <span :class="{'active':addDevMenuTab===1}"
              @click="addDevMenuTabChange(1)">1. 基本信息</span>
        <span :class="{'active':addDevMenuTab===2}"
              @click="addDevMenuTabChange(2)">2. 维保&巡检信息</span>
        <span :class="{'active':addDevMenuTab===3}"
              @click="addDevMenuTabChange(3)">3. 其他信息</span>
      </div>
      <div class="shadowBox"></div>
      <div class="title"
           v-show="addDevMenuTab===1">
        <i></i>
        <span>基本信息</span>
      </div>
      <el-form :model="addData"
               :rules="addFlowRules"
               ref="addData">
        <div class="content"
             v-show="addDevMenuTab===1">
          <div class="main_content">
            <div class="item"
                 style="width:460px">
              <span>设备大类<i class="required">*</i></span>
              <el-form-item prop="equirementType.parent.id">
                <el-select style="width:460px"
                           size="small"
                           v-model="addData.equirementType.parent.id"
                           @change="equirementTypeChange">
                  <el-option v-for="(item,index) in equirementTypes"
                             :key="index"
                             :label="item.name"
                             :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="item"
                 style="width:200px">
              <span>设备小类<i class="required">*</i></span>
              <el-form-item prop="equirementType.id">
                <el-select style="width:200px"
                           size="small"
                           v-model="addData.equirementType.id">
                  <el-option v-for="(item,index) in equirementTypesChild"
                             :key="index"
                             :label="item.name"
                             :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="item"
                 style="width:210px;margin-right:0;"
                 v-if="addData.equirementType.parent.id===25">
              <span>能耗类型<i class="required">*</i></span>
              <el-form-item prop="energyType">
                <el-radio-group v-model="addData.energyType"
                                size="small">
                  <el-radio label="METER">仪表</el-radio>
                  <el-radio label="SWITCH">开关</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="item"
                 style="width:250px"
                 v-if="addData.energyType==='METER'">
              <span>仪表类型<i class="required">*</i></span>
              <el-form-item prop="instrumentType">
                <el-radio-group v-model="addData.instrumentType"
                                size="small"
                                @change="radioChange">
                  <el-radio label="ORDINARY_TABLE">普通表</el-radio>
                  <el-radio label="PUBLIC_TABLE">公共表</el-radio>
                  <el-radio label="SUMMARY_TABLE">总表</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="item"
                 style="width:200px"
                 v-if="addData.instrumentType==='ORDINARY_TABLE' && addData.energyType==='METER'">
              <span>关联商户<i class="required">*</i></span>
              <el-form-item prop="tenant.id">
                <el-select v-model="addData.tenant.id"
                           size="small"
                           filterable
                           placeholder="输入搜索商户">
                  <el-option v-for="item in tenantList"
                             :key="item.id"
                             :label="item.referred"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="item"
                 v-else></div>
          </div>
        </div>
        <div class="shadowBox"
             v-show="addDevMenuTab===1"></div>
        <div class="title"
             v-show="addDevMenuTab===1"
             style="width:100%">
          <i></i>
          <span>关联信息</span>
        </div>
        <div class="content"
             v-show="addDevMenuTab===1">
          <div class="main_content">
            <div class="item">
              <span>设备名称<i class="required">*</i></span>
              <el-form-item prop="name">
                <el-input v-model="addData.name"
                          size="small"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <span>设备编号<i class="required">*</i></span>
              <el-form-item prop="code">
                <el-input v-model="addData.code"
                          size="small"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <span>项目简称<i class="required">*</i></span>
              <el-form-item prop="projectManagement">
                <el-select v-model="addData.projectManagement"
                           value-key="id"
                           size="small"
                           @change="projectChange"
                           placeholder="请选择">
                  <el-option v-for="item in projectManagementsList"
                             :key="item.id"
                             :label="item.referred"
                             :value="item"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <span>楼宇名称<i class="required">*</i></span>
              <el-form-item prop="building">
                <el-select v-model="addData.building"
                           value-key="id"
                           size="small"
                           placeholder="请选择">
                  <el-option v-for="item in buildingOption"
                             :key="item.id"
                             :label="item.buildingName"
                             :value="item"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <span>责任人<i class="required">*</i></span>
              <el-form-item prop="personLiable">
                <el-input v-model="addData.personLiable"
                          size="small"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <span>责任人手机号<i class="required">*</i></span>
              <el-form-item prop="personLiableTelephone">
                <el-input v-model="addData.personLiableTelephone"
                          size="small"
                          onkeyup="value=value.replace(/[^0-9]/g,'')"
                          maxlength="11"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <span>当前状态<i class="required">*</i></span>
              <el-form-item prop="useStatus">
                <el-select v-model="addData.useStatus"
                           size="small">
                  <el-option label="在用"
                             value="USING"></el-option>
                  <el-option label="停用"
                             value="DISABLE"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <span>品牌</span>
              <el-form-item prop="brand">
                <el-input v-model="addData.brand"
                          size="small"
                          maxlength="6"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <span>制造厂商</span>
              <el-form-item prop="manufacturer">
                <el-input v-model="addData.manufacturer"
                          size="small"
                          maxlength="20"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <span>产地</span>
              <el-form-item prop="produced">
                <el-select v-model="addData.produced"
                           size="small">
                  <el-option label="进口"
                             value="IMPORTED"></el-option>
                  <el-option label="国产"
                             value="MADE_IN_CHINA"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <span>供应商</span>
              <el-form-item prop="supplier">
                <el-input v-model="addData.supplier"
                          size="small"
                          maxlength="25"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <span>出厂日期</span>
              <el-form-item prop="productionDate">
                <el-date-picker v-model="addData.productionDate"
                                size="small"
                                type="date"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </div>
            <div class="item">
              <span>年检日期</span>
              <el-form-item prop="annualInspectionDate">
                <el-date-picker v-model="addData.annualInspectionDate"
                                size="small"
                                type="date"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </div>
            <div class="item">
              <span>交付日期</span>
              <el-form-item prop="deliveryDate">
                <el-date-picker v-model="addData.deliveryDate"
                                size="small"
                                type="date"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </div>
            <div class="item">
              <span>始用日期</span>
              <el-form-item prop="useDate">
                <el-date-picker v-model="addData.useDate"
                                size="small"
                                type="date"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </div>
            <div class="item">
              <span>质保结束日期</span>
              <el-form-item prop="warrantyEndDate">
                <el-date-picker v-model="addData.warrantyEndDate"
                                size="small"
                                type="date"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </div>
            <div class="item">
              <span>安装日期</span>
              <el-form-item prop="installDate">
                <el-date-picker v-model="addData.installDate"
                                size="small"
                                type="date"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </div>
            <div class="item">
              <span>安装位置<i class="required">*</i></span>
              <el-form-item prop="installPosition">
                <el-input size="small"
                          v-model="addData.installPosition"
                          maxlength="30"></el-input>
              </el-form-item>
            </div>
            <div class="item"
                 style="width:100%">
              <span>备注</span>
              <el-form-item prop="remake">
                <el-input type="textarea"
                          rows="1"
                          v-model="addData.remake"
                          maxlength="30"></el-input>
              </el-form-item>
            </div>
            <div class="enclosure"
                 style="width:100%;">
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
                    <!-- <svg class="icon"
                           aria-hidden="true">
                        <use :xlink:href="getformat(item.annexName)"></use>
                      </svg> -->
                    <p style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;width:180px">{{item.annexName}}</p>
                    <span>
                      <i @click="deleFile(item, index)"
                         class="iconfont icon-lajixiang"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="title"
             v-show="addDevMenuTab===2"
             style="width:100%">
          <i></i>
          <span>维保信息</span>
        </div>
        <div class="content"
             v-show="addDevMenuTab===2">
          <div class="main_content">
            <div class="item">
              <span>是否需要维保<i class="required">*</i></span>
              <el-form-item prop="onMaintenance">
                <el-select v-model="addData.onMaintenance"
                           size="small">
                  <el-option label="是"
                             value="true"></el-option>
                  <el-option label="否"
                             value="false"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <span>维保周期<i class="required">*</i></span>
              <el-form-item prop="maintenancePeriod">
                <el-select v-model="addData.maintenancePeriod"
                           size="small">
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
            </div>
            <div class="item">
              <span>维保单位<i class="el-icon-info"
                   @mouseover="toolTips=true"
                   @mouseout="toolTips=false"
                   style="margin:0 5px"></i><i class="toolTips"
                   v-show="toolTips"><i class="icon"></i>匹配不到，请填写其他</i></span>
              <el-form-item prop="maintenanceUnit">
                <el-input v-model="addData.maintenanceUnit"
                          size="small"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <span>维保联系人</span>
              <el-form-item prop="maintenanceContacts">
                <el-input v-model="addData.maintenanceContacts"
                          size="small"
                          maxlength="6"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <span>维保联系手机号</span>
              <el-form-item prop="maintenanceTelephone">
                <el-input v-model="addData.maintenanceTelephone"
                          size="small"
                          onkeyup="value=value.replace(/[^0-9]/g,'')"
                          onpaste="value=value.replace(/[^0-9]/g,'')"
                          oncontextmenu="value=value.replace(/[^0-9]/g,'')"
                          maxlength="11"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <span>维保单位分类字段<i class="required">*</i></span>
              <el-form-item prop="maintenanceType">
                <el-select v-model="addData.maintenanceType"
                           size="small">
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
            </div>
            <div class="item">
              <span>外包类型</span>
              <el-form-item prop="outsourceType">
                <el-select v-model="addData.outsourceType"
                           size="small">
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
            <div class="item">
              <span>维保合同开始时间</span>
              <el-form-item prop="maintenanceStartDate">
                <el-date-picker v-model="addData.maintenanceStartDate"
                                size="small"
                                type="date"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </div>
            <div class="item">
              <span>维保合同结束时间</span>
              <el-form-item prop="maintenanceEndDate">
                <el-date-picker v-model="addData.maintenanceEndDate"
                                size="small"
                                type="date"
                                placeholder="选择日期"
                                value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="shadowBox"
             v-show="addDevMenuTab===2"></div>
        <div class="title"
             v-show="addDevMenuTab===2"
             style="width:100%">
          <i></i>
          <span>巡检信息</span>
        </div>
        <div class="content"
             v-show="addDevMenuTab===2">
          <div class="main_content">
            <div class="item">
              <el-form-item prop="onMaintain">
                <span>是否需要巡检<i class="required">*</i></span>
                <el-select v-model="addData.onMaintain"
                           size="small">
                  <el-option label="是"
                             value="true"></el-option>
                  <el-option label="否"
                             value="false"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item prop="maintainPeriodDay">
                <span>巡检周期（天）<i class="required">*</i></span>
                <el-input v-model="addData.maintainPeriodDay"
                          size="small"
                          maxlength="10"
                          onkeyup="value=value.replace(/[^\0-9\.]/g,'')"
                          onpaste="value=value.replace(/[^\0-9\.]/g,'')"
                          oncontextmenu="value=value.replace(/[^\0-9\.]/g,'')"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item prop="firstMaintainDate">
                <span>首次巡检时间</span>
                <el-date-picker value-format="yyyy-MM-dd"
                                size="small"
                                type="date"
                                placeholder="选择日期"
                                v-model="addData.firstMaintainDate"></el-date-picker>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item prop="onMeterReading">
                <span>是否抄表<i class="required">*</i></span>
                <el-select v-model="addData.onMeterReading"
                           size="small">
                  <el-option label="是"
                             value="true"></el-option>
                  <el-option label="否"
                             value="false"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item prop="onPatrol">
                <span>是否需要巡更<i class="required">*</i></span>
                <p v-if="readonly">{{addData.onPatrol?'是':'否'}}</p>
                <el-select size="small"
                           v-model="addData.onPatrol"
                           v-else>
                  <el-option label="是"
                             :value="true"></el-option>
                  <el-option label="否"
                             :value="false"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="item"></div>
          </div>
        </div>
        <div class="title"
             v-show="addDevMenuTab===3"
             style="width:100%">
          <i></i>
          <span>其他信息</span>
        </div>
        <div class="content"
             v-show="addDevMenuTab===3">
          <div class="main_content">
            <div class="item">
              <el-form-item prop="equirementRegisterCode">
                <span>设备注册代码号</span>
                <el-input maxlength="20"
                          size="small"
                          v-model="addData.equirementRegisterCode"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item prop="productionCode">
                <span>出厂编号</span>
                <el-input maxlength="20"
                          size="small"
                          v-model="addData.productionCode"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item prop="specificationModel">
                <span>规格型号</span>
                <el-input maxlength="30"
                          size="small"
                          v-model="addData.specificationModel"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item prop="technicalParameter">
                <span>主要技术参数</span>
                <el-input maxlength="30"
                          size="small"
                          v-model="addData.technicalParameter"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item prop="ratedVoltage">
                <span>额定电压</span>
                <el-input maxlength="10"
                          size="small"
                          v-model="addData.ratedVoltage"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item prop="ratedCurrent">
                <span>额定电流</span>
                <el-input maxlength="10"
                          size="small"
                          v-model="addData.ratedCurrent"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item prop="frequency">
                <span>频率</span>
                <el-input maxlength="10"
                          size="small"
                          v-model="addData.frequency"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item prop="totalPower">
                <span>总功率</span>
                <el-input maxlength="10"
                          size="small"
                          v-model="addData.totalPower"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item prop="locationNumber">
                <span>点位数（消防总点位数）</span>
                <el-input v-model="addData.locationNumber"
                          size="small"
                          onkeyup="value=value.replace(/[^0-9]/g,'')"
                          onpaste="value=value.replace(/[^0-9]/g,'')"
                          oncontextmenu="value=value.replace(/[^0-9]/g,'')"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item prop="systemNumber">
                <span>系统数（消防分几个系统）</span>
                <el-input v-model="addData.systemNumber"
                          size="small"
                          onkeyup="value=value.replace(/[^0-9]/g,'')"
                          onpaste="value=value.replace(/[^0-9]/g,'')"
                          oncontextmenu="value=value.replace(/[^0-9]/g,'')"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item prop="ladderSpeed">
                <span>梯速</span>
                <el-input v-model="addData.ladderSpeed"
                          size="small"
                          maxlength="10"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item prop="carrying">
                <span>载重</span>
                <el-input v-model="addData.carrying"
                          size="small"
                          maxlength="10"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item prop="station">
                <span>站（电梯的停靠站数）</span>
                <el-input v-model="addData.station"
                          size="small"
                          onkeyup="value=value.replace(/[^0-9]/g,'')"
                          onpaste="value=value.replace(/[^0-9]/g,'')"
                          oncontextmenu="value=value.replace(/[^0-9]/g,'')"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item prop="door">
                <span>门（电梯开门数）</span>
                <el-input v-model="addData.door"
                          size="small"
                          onkeyup="value=value.replace(/[^0-9]/g,'')"
                          onpaste="value=value.replace(/[^0-9]/g,'')"
                          oncontextmenu="value=value.replace(/[^0-9]/g,'')"></el-input>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item prop="floor">
                <span>层（电梯的楼层数）</span>
                <el-input v-model="addData.floor"
                          size="small"
                          onkeyup="value=value.replace(/[^0-9]/g,'')"
                          onpaste="value=value.replace(/[^0-9]/g,'')"
                          oncontextmenu="value=value.replace(/[^0-9]/g,'')"></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="shadowBox"></div>
    <div slot="footer"
         class="slotfooter">
      <span @click="dialogClose"
            class="details_cannelBtn">关闭</span>
      <span @click="addDevMenuTab-=1"
            v-if="addDevMenuTab!==1"
            class="details_submitBtn">上一步</span>
      <span @click="addDevMenuTab+=1"
            v-if="addDevMenuTab!==3"
            class="details_submitBtn">下一步</span>
      <span @click="addPipeline('addData')"
            class="details_submitBtn">确定</span>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import * as JSOG from 'jsog'
export default {
  components: {
    aliUpload
  },
  props: {
    projectManagementsList: {

    },
    projectManagementId: {

    }
  },
  watch: {

  },
  created () {
    this.addData.projectManagement.id = this.projectManagementId
    this.projectChange()
    this.getEquirementTypes()
  },
  mounted () {
  },
  data () {
    return {
      cascaderList: [],
      toolTips: false,
      fileType: [],
      iconImg: 'icon-shangchuanfujianicon',
      addData: {
        annexes: [],
        equirementType: {
          id: null,
          name: null,
          parent: {
            id: null,
            name: null
          }
        },
        energyType: null,
        instrumentType: null,
        tenant: {
          id: null
        },
        brand: null,
        code: null,
        name: null,
        projectManagement: {
          id: null
        },
        building: null,
        personLiable: null,
        personLiableTelephone: null,
        useStatus: null,
        referred: null,
        manufacturer: null,
        produced: null,
        supplier: null,
        productionDate: null,
        annualInspectionDate: null,
        deliveryDate: null,
        useDate: null,
        warrantyEndDate: null,
        installDate: null,
        installPosition: null,
        remake: null,
        onMaintenance: null,
        maintenancePeriod: null,
        maintenanceUnit: null,
        maintenanceContacts: null,
        maintenanceTelephone: null,
        maintenanceType: null,
        outsourceType: null,
        maintenanceStartDate: null,
        maintenanceEndDate: null,
        onMaintain: null,
        maintainPeriodDay: null,
        firstMaintainDate: null,
        onMeterReading: null,
        equirementRegisterCode: null,
        productionCode: null,
        specificationModel: null,
        technicalParameter: null,
        ratedVoltage: null,
        ratedCurrent: null,
        frequency: null,
        totalPower: null,
        locationNumber: null,
        systemNumber: null,
        ladderSpeed: null,
        carrying: null,
        station: null,
        door: null,
        floor: null,
        onPatrol: ''
      },
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
          { required: true, message: '请选择客户', trigger: 'change' }
        ],
        energyType: [
          { required: true, message: '请输选择能耗类型', trigger: 'blur' }
        ],
        instrumentType: [
          { required: true, message: '请输选择仪表类型', trigger: 'change' }
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
        maintenanceType: [
          { required: true, message: '请选择维保单位分类字段', trigger: 'change' }
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
      buildingOption: [],
      equirementTypes: [], // 设备大小类枚举
      equirementTypesChild: [], // 设备小类
      addDevMenuTab: 1 // 新增设备菜单栏
    }
  },
  computed: {

  },
  methods: {
    addDevMenuTabChange (n) { // 新增设备tabqiehuan
      this.addDevMenuTab = n
    },
    radioChange (instrumentType) {
      if (this.addData.instrumentType === 'ORDINARY_TABLE') {
        this.addData.tenant = { id: null }
      }
    },
    dialogClose () {
      this.addDevMenuTab = 1
      this.addData.annexes = []
      this.$refs['addData'].resetFields()
      this.$emit('dialogClose')
    },
    deleFile (item, index) {
      this.addData.annexes.splice(index, 1)
    },
    setAnnexs (annexURL, annexName) {
      this.addData.annexes.push({ 'annexURL': annexURL, 'annexName': annexName })
    },
    getTenantList (id) {
      context.http.get(`cms/api/tenant/projectManagement/${id}`, { size: 10000 }).then(res => { // 根据项目id查所有客户
        this.tenantList = res.data
        this.addData.tenant = { id: null }
      }).catch(error => {
        console.info(error)
      })
    },
    projectChange () {
      context.http.get('cms/api/buildings', { page: 0, size: 50, sort: 'desc', useStatus: 'USING', projectId: this.addData.projectManagement.id }).then(res => {
        this.buildingOption = res.data.buildingListDTOS
        this.getTenantList(this.addData.projectManagement.id)
      })
    },
    equirementTypeChange () { // 大类切换
      let id = this.addData.equirementType.parent.id
      this.addData.equirementType.id = ''
      for (let i = 0; i < this.equirementTypes.length; i++) {
        if (id === this.equirementTypes[i].id) {
          this.equirementTypesChild = this.equirementTypes[i].child
        }
      }
      this.addData.energyType = null
      this.addData.instrumentType = null
    },
    async getEquirementTypes () { // 请求设备大小类
      let result = await context.http.get('/cms/api/equirementTypes/tree')
      this.equirementTypes = result.data
      this.equirementTypes.forEach((element, index) => {
        this.cascaderList.push({ value: element.id, label: element.name, children: [] })
        element.child.forEach(item => {
          this.cascaderList[index].children.push({ value: item.id, label: item.name })
        })
      })
    },
    addPipeline (formName) {
      let _this = this
      if (this.addData.equirementType.parent.id !== 25 || this.addData.energyType !== 'METER' || this.addData.instrumentType !== 'ORDINARY_TABLE') {
        this.addData.tenant = null
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _this = this
          context.http.post('/cms/api/equirements', this.addData).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '新增成功'
              })
              this.dialogClose()
              this.$emit('addEquirementSuccess')
            }
          })
        } else {
          console.log(_this.addData.equirementType.parent.id)
          if (!_this.addData.equirementType.parent.id ||
            !_this.addData.equirementType.id ||
            (_this.addData.equirementType.parent.id === 25 && !_this.addData.energyType) ||
            (!_this.addData.energyType === 'METER' && !_this.addData.instrumentType) ||
            (_this.addData.instrumentType === 'ORDINARY_TABLE' && _this.addData.energyType === 'METER' && !_this.addData.tenant.id) ||
            !_this.addData.code ||
            !_this.addData.name ||
            !_this.addData.projectManagement ||
            !_this.addData.building ||
            !_this.addData.personLiable ||
            !_this.addData.personLiableTelephone ||
            !_this.addData.useStatus ||
            !_this.addData.installPosition
          ) {
            _this.addDevMenuTab = 1
          } else if (
            !_this.addData.onMaintenance ||
            !_this.addData.maintenancePeriod ||
            !_this.addData.onMaintain ||
            !_this.addData.maintainPeriodDay ||
            !_this.addData.onMeterReading
          ) {
            _this.addDevMenuTab = 2
          }
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
#projectId2 {
  .el-dialog__wrapper {
    &.addEquipment_new {
      .el-dialog {
        .el-dialog__header {
          margin-bottom: 0 !important;
        }
        .el-dialog__body {
          padding: 0 !important;
          .dialog_content form.el-form {
            padding: 0 !important;
            .content {
              padding: 15px;
              width: 100%;
            }
          }
          .slotfooter {
            margin-top: 0;
          }
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
        .el-select {
          width: 100%;
        }
        .el-radio {
          margin-right: 15px;
        }
        .el-dialog__header {
          margin-bottom: 0;
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
    }
  }
}
</style>
<style lang="scss" scoped>
.addEquipment_new {
  .addEquipment {
    .shadowBox {
      width: 100%;
      height: 12px;
      background-color: #f7f7f7;
    }
    .content {
      .main_content {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .item {
          width: 32%;
          // margin-right: 15px;
          // margin-bottom: 22px;
          span {
            color: #787878;
            width: 100%;
            display: inline-block;
            // margin-bottom: 8px;
            height: 35px;
            display: flex;
            align-items: center;
            > .toolTips {
              display: inline-block;
              font-style: normal;
              font-size: 12px;
              padding: 8px 5px;
              background-color: rgba(0, 0, 0, 0.7);
              color: #fff;
              border-radius: 5px;
              margin-left: 15px;
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
        }
      }
    }
    .menuTab {
      height: 60px;
      margin-top: 0;
      box-shadow: none;
      border-radius: 0;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;

      > span {
        width: 210px;
        height: 40px;
        line-height: 40px;
        display: inline-block;
        background-color: #f9f9f9;
        border-radius: 5px;
        color: #777;
        text-align: left;
        padding-left: 15px;
        &.active {
          background-color: #4476cc;
          color: #fff;
        }
      }
    }
  }
}
</style>

