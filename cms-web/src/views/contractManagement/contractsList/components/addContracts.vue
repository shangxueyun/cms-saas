<template>
  <div class="addContracts">
    <div class="dl-head">
      <span class="step"
            :class="{stepActive: newlystep1, stepActivePast: newlystep2}"><span style="font-size: 20px;">1</span>. 基本资料</span>
      <span class="step"
            :class="{stepActive: newlystep2}"><span style="font-size: 20px;">2</span>. 费用条款</span>
      <span class="step"
            :class="{stepActive: newlystep3}"><span style="font-size: 20px;">3</span>. 其他资料</span>
    </div>
    <div class="dl-content clearfix">
      <el-form :model="addData"
               ref="addData1"
               :rules="addDataRules1">
        <div class="step1"
             v-show="newlystep1">
          <div class="dc-project">
            <div class="dr-head"
                 style="text-align: left">项目选择</div>
            <div class="cttitle"
                 style="margin-left: 16px;">所属项目<i class="required">*</i></div>
            <div class="basic-select"
                 style="height: auto"
                 v-if="houseReadOnly">
              <div class="clearfix selectInput"
                   style="border: none"
                   v-if="addData.rooms">
                <img :src="addData.projectManagement.previewImage" />
                <span style="float: none;color: #000">{{addData.projectManagement.referred}}</span>
              </div>
            </div>
            <div class="basic-select"
                 v-else>
              <div @click="choose('project')"
                   class="clearfix"
                   :class="selProject ? 'selectInput selectActive' : 'selectInput'">
                <img :src="chooseObj.previewImage"
                     v-if="chooseObj" />
                <span v-if="chooseObj">{{chooseObj.referred}}</span>
                <span class="iconfont"
                      :class="{'icon-right': !selProject, 'icon-xiala-': selProject}"></span>
              </div>
              <ul v-if="selProject"
                  class="selectBox">
                <li @click="chooseItem('project', item)"
                    v-for="(item, index) in projectList"
                    :key="index">
                  <img :src="item.previewImage" />
                  <span>{{item.referred}}</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- <div class="dc-left float-left"
               v-if="houseReadOnly">
            <div class="dr-head"
                 style="text-align: left">房源信息</div>
            <div class="basic-select" style="height: auto">
              <div class="clearfix selectInput"
                   style="border: none"
                   v-if="detailData.rooms">
                <img :src="detailData.projectManagement.previewImage" />
                <span style="float: none">{{detailData.projectManagement.projectName}}</span>
              </div>
              <div class="bd-number">
              </div>
              <div class="layer"
                   v-for="(item, index) in detailData.rooms"
                   :key="index">
                <div>
                  <span v-if="item.floor">{{item.floor.name}}层</span>
                  <span class="showTitle" :title="item.buildingArea" v-if="item.shopNumber">{{item.shopNumber}}</span>
                  <span v-if="item.buildingArea">{{item.buildingArea}}m²</span>
                </div>
              </div>
            </div>
          </div>
          <div class="dc-left float-left"
               v-else>
            <div class="dr-head"
                 style="text-align: left">房源信息</div>
            <div class="basic-select">
              <div @click="choose('project')"
                   class="clearfix"
                   :class="selProject ? 'selectInput selectActive' : 'selectInput'">
                <img :src="chooseObj.previewImage" v-if="chooseObj"/>
                <span v-if="chooseObj">{{chooseObj.projectName}}</span>
                <span class="iconfont icon-xiala-"></span>
              </div>
              <ul v-if="selProject"
                  class="selectBox">
                <li @click="chooseItem('project', item)"
                    v-for="(item, index) in projectList"
                    :key="index">
                  <img :src="item.previewImage" />
                  <span>{{item.projectName}}</span>
                </li>
              </ul>
            </div>
            <div v-if="errorProject"
                 class="errorpjTip">请选择项目</div>
            <ul class="buildList">
              <li v-for="(item, index) in building.projectRoomsSecondDTOList"
                  :key="index">
                <p><span>{{item.buildingName}}</span><span class="iconfont icon-xiala-"></span></p>
                <dl>
                  <dd>
                    <el-checkbox-group v-model="checkIdList"
                                       class="select"
                                       @change="handleChecked">
                      <el-checkbox v-for="items in item.roomsDTOList"
                                   :key="items.id"
                                   :label="items.id">
                        <span v-if="items.floor">{{items.floor.name}}层</span>
                        <span>{{items.shopNumber}}</span>
                        <span>{{items.buildingArea}}㎡</span>
                      </el-checkbox>
                    </el-checkbox-group>
                  </dd>
                </dl>
              </li>
            </ul>
          </div> -->
          <div class="dc-right float-right tenantinfo">
            <div class="dr-head">客户信息</div>
            <el-form-item :label-width="formLabelWidth"
                          prop="tenant"
                          style="margin-bottom: 20px;vertical-align: top;">
              <div class="cttitle">客户名称<i class="required">*</i></div>
              <el-select v-model="addData.tenant"
                         filterable
                         v-if="tenantShow"
                         value-key="id"
                         @change="changeCentalMethod"
                         placeholder="请选择">
                <el-option v-for="item in tenantNameeOptions"
                           :key="item.id"
                           :label="item.teantName"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth">
              <div class="cttitle">品牌名称</div>
              <el-input v-model="addData.tenant.referred"
                        disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth">
              <div class="cttitle">用途</div>
              <el-input v-model="addData.tenant.tenantUseDescription"
                        disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth">
              <div class="cttitle">行业</div>
              <el-input v-model="addData.tenant.industry"
                        disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          style="vertical-align: top;">
              <div class="cttitle">法人</div>
              <el-input v-model="addData.tenant.operName"
                        disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth">
              <div class="cttitle">签订人</div>
              <el-input v-model="addData.signer"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth">
              <div class="cttitle">签订人联系方式</div>
              <el-input v-model="addData.signerPhone"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
          </div>
          <div class="dc-right float-right"
               ref="aaaaaa">
            <div class="dr-head">房源信息</div>
            <div class="berth-infor"
                 v-show="!berthSelected"
                 style="max-height: 318px;overflow-y: scroll;">
              <div class="berth">
                <span>选择房源</span>
                <span @click="berthSelected = true">完成</span>
              </div>
              <el-collapse accordion
                           style="width: 96%;margin: 10px auto 0"
                           @change="handleChange"
                           v-model="activeName">
                <el-collapse-item v-for="(item, index) in building.projectRoomsSecondDTOList"
                                  :key="item.buildingId"
                                  :name="index"
                                  style="position: relative;">
                  <template slot="title">
                    <img class="floor-img"
                         v-if="item.buildingImage"
                         :src="item.buildingImage" /><span>{{item.buildingName}}</span>
                    <span class="currentlySelected"
                          v-if="item.selectLength && item.selectLength > 0">{{item.selectLength}}</span>
                  </template>
                  <div class="floor-search">
                    <el-select v-model="selectionFloor"
                               @change="selectFloor(item.floorDTOS)"
                               placeholder="请选择楼层">
                      <el-option v-for="item in item.floorDTOS"
                                 :key="item.id"
                                 :label="item.name + '层'"
                                 :value="item.id">
                      </el-option>
                    </el-select>
                    <div>
                      <el-input placeholder="搜索房源"
                                prefix-icon="el-icon-search"
                                @input="searchBerth(item.floorDTOS)"
                                v-model="berthInput">
                      </el-input>
                    </div>
                  </div>
                  <!-- :data="item.floorDTOS[0].roomsDTOS" -->
                  <el-table ref="multipleTable"
                            :data="RoomsDTOS"
                            tooltip-effect="dark"
                            style="width: 100%"
                            @select="openDetails"
                            @select-all="selectAll"
                            @selection-change="handleSelectionChange">
                    <el-table-column type="selection"
                                     width="55">
                    </el-table-column>
                    <el-table-column label="房源号"
                                     align="center">
                      <template slot-scope="scope">{{ scope.row.shopNumber }}</template>
                    </el-table-column>
                    <el-table-column label="建筑面积"
                                     align="center">
                      <template slot-scope="scope">{{ scope.row.buildingArea }}㎡</template>
                    </el-table-column>
                    <el-table-column label="使用面积"
                                     align="center"
                                     show-overflow-tooltip>
                      <template slot-scope="scope"
                                v-if="scope.row.useArea">{{ scope.row.useArea }}㎡</template>
                    </el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-collapse>
            </div>
            <div class="berth-selected"
                 v-show="berthSelected">
              <div class="berth"
                   style="margin-bottom: 10px">
                <span>已选中房源</span>
                <span @click="berthSelected = false"
                      v-if="!houseReadOnly">添加房源</span>
              </div>
              <el-table :data="multipleSelectionAll"
                        class="berth-infor"
                        style="width: 100%;max-height: 400px;overflow-y: scroll;">
                <el-table-column prop="building.buildingName"
                                 label="楼宇"
                                 align="center">
                </el-table-column>
                <el-table-column prop="floor.name"
                                 label="楼层"
                                 align="center">
                </el-table-column>
                <el-table-column prop="shopNumber"
                                 align="center"
                                 label="房源号">
                </el-table-column>
                <el-table-column prop="buildingArea"
                                 label="建筑面积/㎡"
                                 align="center">
                </el-table-column>
                <el-table-column prop="useArea"
                                 label="使用面积/㎡"
                                 align="center">
                </el-table-column>
                <el-table-column prop="address"
                                 align="center"
                                 label="操作">
                  <template slot-scope="scope">
                    <el-button v-if="!houseReadOnly"
                               @click="handleDelete(scope.$index, scope.row)"
                               class="el-button--primary operation-btn"
                               size="mini">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="berth-area"
                 style="margin-top: 14px">
              <form>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;position: relative">
                  <div class="cttitle">总建筑面积</div>
                  <el-input v-model="addData.area"
                            :disabled="true"
                            style="width: 91%;margin-right: 10px"
                            placeholder="请输入内容"></el-input>㎡
                  <p v-if="areaNull"
                     style="position: absolute;font-size:12px;color:#f56c6c">请选择房源</p>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;position: relative">
                  <div class="cttitle">总使用面积</div>
                  <el-input v-model="addData.useArea"
                            :disabled="true"
                            style="width: 91%;margin-right: 10px"
                            placeholder="请输入内容"></el-input>㎡
                  <p v-if="useAreaNull"
                     style="position: absolute;font-size:12px;color:#f56c6c">部分房源使用面积为空</p>
                </el-form-item>
              </form>
            </div>
          </div>
          <div class="dc-right float-right contract-info">
            <div class="dr-head">合同信息</div>
            <el-form-item :label-width="formLabelWidth"
                          style="margin-bottom: 20px;"
                          prop="signtDate">
              <div class="cttitle">合同签订时间<i class="required">*</i></div>
              <el-date-picker v-model="addData.signtDate"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="startDate"
                          :label-width="formLabelWidth"
                          style="margin-bottom: 20px;">
              <div class="cttitle">合同开始时间<i class="required">*</i></div>
              <el-date-picker v-model="addData.startDate"
                              value-format="yyyy-MM-dd"
                              type="date"
                              @change="contractChange"
                              :picker-options="contractStart"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          prop="endDate"
                          style="margin-bottom: 20px;">
              <div class="cttitle">合同结束时间<i class="required">*</i></div>
              <el-date-picker v-model="addData.endDate"
                              type="date"
                              :picker-options="contractEnd"
                              @change="contractChange"
                              value-format="yyyy-MM-dd"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          style="margin-bottom: 20px;"
                          prop="contractNo">
              <div class="cttitle">合同编号<i class="required">*</i></div>
              <el-input v-model="addData.contractNo"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          style="margin-bottom: 20px;"
                          prop="rentalMethod">
              <div class="cttitle">租赁方式<i class="required">*</i></div>
              <el-select v-model="addData.rentalMethod"
                         :disabled="addData.tenant.tenantUseDescription === '办公' || addData.tenant.tenantUseDescription === '菜场'"
                         placeholder="请选择">
                <el-option label="固定租金"
                           value="RENT"></el-option>
                <el-option label="扣点"
                           value="POINTS"></el-option>
                <el-option label="保底扣点"
                           value="GUARANTEEPOINT"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          prop="iDNumber">
              <div class="cttitle">商铺名称</div>
              <el-input v-model="addData.shopName"
                        style="margin-right: 10px"
                        maxlength="50"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          prop="iDNumber">
              <div class="cttitle">交付乙方装修时间</div>
              <el-date-picker v-model="addData.toBTrimTime"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <!-- <el-form-item :label-width="formLabelWidth"
                          prop="iDNumber">
              <div class="cttitle">滞纳金比例</div>
              <el-input v-model="addData.proportion"
                        type="number"
                        style="width: 60%;margin-right: 10px"
                        placeholder="请输入内容"></el-input>%/天
            </el-form-item> -->
          </div>
        </div>
      </el-form>
      <el-form>
        <div class="step2 dl-content"
             v-show="newlystep2">
          <!-- <div class="dc-right float-right">
            <div class="dr-head">已选中房源</div>
            <div class="selected-housing"
                 v-for="(item, index) in checkList"
                 :key="index">
              <span>{{item.projectManagement ? item.projectManagement.projectName : ''}}</span>
              <span>{{item.building ? item.building.buildingName : ''}}</span>
              <span>{{item.floor ? item.floor.name : ''}}层</span>
              <span>{{item.shopNumber}}</span>
              <span>{{item.buildingArea}} m²</span>
            </div>
          </div> -->
          <div class="typeTab">
            <span v-for="(item,index) in options4"
                  :key="item.id"
                  :class="{active:berthPlan === item.value}"
                  @click.stop="changeTab(item,index)">{{item.label}}
              <span class="iconfont icon-cha"
                    v-if="options4.length === 2"
                    @click.stop="delTab(index)"
                    style="font-size: 14px;margin-left: 6px;"></span>
            </span>
            <span class="add-clause"
                  v-if="options4.length === 1 && options4[0].value === 'PropertyFeeClause'"
                  @click="addTal(0)"> + 租金条款</span>
            <span class="add-clause"
                  v-if="options4.length === 1 && options4[0].value === 'RentClause'"
                  @click="addTal(1)"> + 物业费条款</span>
          </div>
          <el-form ref="LeaseClauseForm"
                   :model="LeaseClauseData"
                   :rules="LeaseClauseRules"
                   label-width="80px">
            <div class="dc-right float-right"
                 v-show="isrentClause">
              <div class="dr-head">
                计算方式
              </div>
              <div>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="areaTypeRent">
                  <div class="cttitle">计租面积类型<i class="required">*</i></div>
                  <el-select v-model="LeaseClauseData.areaTypeRent"
                             @change="changeAreaType"
                             placeholder="请选择">
                    <el-option v-for="item in rentalAreaOptions"
                               :key="item.id"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;margin-right: 5px;width: 28%!important;">
                  <div class="cttitle">计租面积/m²<i class="required">*</i></div>
                  <el-input disabled="disabled"
                            v-model="exhibitionArea"
                            placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="carryModeRent">
                  <div class="cttitle">计算进位方式<i class="required">*</i></div>
                  <el-select v-model="LeaseClauseData.carryModeRent"
                             placeholder="请选择">
                    <el-option v-for="item in carryOptions"
                               :key="item.id"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="dc-right float-right"
                 v-show="isrentClause">
              <div class="dr-head">
                租赁条款
                <span class="iconfont icon-bottom"
                      :class="{'icon-top': !showLeaseTerms}"
                      @click="showLeaseTerms = !showLeaseTerms"></span>
                <div class="right-btn">
                  <span @click="rentIncrements = true"
                        v-if="!rentIncrements">+租金递增</span>
                  <span @click="rentConcessions = true"
                        v-if="!rentConcessions">+租金优惠</span>
                  <span @click="decorationBond = true"
                        v-if="!decorationBond">+装修保证金</span>
                </div>
              </div>
              <div class="selected-housing"
                   v-if="showLeaseTerms">
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="startDate">
                  <div class="cttitle">开始时间<i class="required">*</i></div>
                  <el-date-picker v-model="LeaseClauseData.startDate"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  disabled="disabled"
                                  placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="endDate">
                  <div class="cttitle">结束时间<i class="required">*</i></div>
                  <el-date-picker v-model="LeaseClauseData.endDate"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  disabled="disabled"
                                  placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;margin-right: 5px;"
                              prop="deposit">
                  <div class="cttitle">租金保证金金额/元<i class="required">*</i></div>
                  <el-input type="number"
                            v-model="LeaseClauseData.deposit"
                            placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item prop="price"
                              v-if="addData.rentalMethod === 'RENT'">
                  <div class="cttitle">初始单价<i class="required">*</i></div>
                  <el-input v-model="LeaseClauseData.price"
                            type="number"
                            style="width: 59%;margin-right: 10px"
                            placeholder="请输入内容"></el-input>
                  <el-select v-model="LeaseClauseData.priceUnit"
                             style="width: 35%;"
                             placeholder="请选择">
                    <el-option label="元/㎡天"
                               value="M2DAYS"></el-option>
                    <!-- <el-option label="元/㎡月"
                               value="M2MONTH"
                               disabled></el-option>
                    <el-option label="元/天"
                               value="DAY"
                               disabled></el-option> -->
                    <el-option label="元/月"
                               value="MONTH"></el-option>
                    <el-option label="元/年"
                               value="YEAR"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="addData.rentalMethod !== 'RENT'"
                              :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="point">
                  <div class="cttitle">租金抽成比例(按营业额抽成)<i class="required">*</i></div>
                  <el-input v-model="LeaseClauseData.point"
                            style="width: 83%!important"
                            type="number"
                            placeholder="请输入内容"></el-input>
                  <span>%/月</span>
                </el-form-item>
                <el-form-item prop="price"
                              v-if="addData.rentalMethod === 'GUARANTEEPOINT'">
                  <div class="cttitle">保底价<i class="required">*</i></div>
                  <el-input v-model="LeaseClauseData.price"
                            style="width: 59%;margin-right: 10px"
                            placeholder="请输入内容"></el-input>
                  <el-select v-model="LeaseClauseData.priceUnit"
                             style="width: 35%;"
                             placeholder="请选择">
                    <el-option label="元/㎡天"
                               value="M2DAYS"></el-option>
                    <!-- <el-option label="元/㎡月"
                               value="M2MONTH"
                               disabled></el-option>
                    <el-option label="元/天"
                               value="DAY"
                               disabled></el-option> -->
                    <el-option label="元/月"
                               value="MONTH"></el-option>
                    <el-option label="元/年"
                               value="YEAR"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="addData.rentalMethod !== 'POINTS'"
                              :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="billingType">
                  <div class="cttitle">计费类型<i class="required">*</i></div>
                  <el-select v-model="LeaseClauseData.billingType"
                             placeholder="请选择">
                    <el-option v-for="item in billingTypeOptions"
                               :key="item.value"
                               :label="item.name"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="addData.rentalMethod !== 'POINTS'"
                              :label-width="formLabelWidth"
                              prop="yearDay"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">年天数<i class="required">*</i></div>
                  <!-- <el-input v-model="LeaseClauseData.yearDay"
                            type="number"
                            placeholder="请输入内容"></el-input> -->
                  <el-select v-model="LeaseClauseData.yearDay"
                             placeholder="请选择">
                    <el-option label="365"
                               value="365"></el-option>
                    <el-option label="360"
                               value="360"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="month">
                  <!-- <div v-if="LeaseClauseData.priceUnit === 'YEAR'"
                       class="cttitle">付款周期/年<i class="required">*</i></div> -->
                  <div class="cttitle">付款周期/月<i class="required">*</i></div>
                  <el-input v-model="LeaseClauseData.month"
                            placeholder="请输入内容"
                            @input="monthChange('LeaseClauseData', LeaseClauseData.month)"></el-input>
                  <!-- <el-select v-model="LeaseClauseData.month"
                             placeholder="请选择">
                    <el-option v-for="item in paymentCycleOptions"
                               :key="item.value"
                               :label="item.value"
                               :value="item.value">
                    </el-option>
                  </el-select> -->
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="billDivision">
                  <div class="cttitle">账单划分方式<i class="required">*</i></div>
                  <el-select v-model="LeaseClauseData.billDivision"
                             @change="syncHandle()"
                             placeholder="请选择">
                    <el-option label="首期开始，按付款周期划分"
                               value="NO"></el-option>
                    <el-option label="首期三个月，第三笔开始按季度划分"
                               value="QUARTER"
                               :disabled="billDivisionDisabledL"></el-option>
                    <el-option label="第二笔开始，按季度划分"
                               value="QUARTER_TWO"
                               :disabled="billDivisionDisabledL"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="addData.rentalMethod === 'RENT'"
                              :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="dayNumber">
                  <div class="cttitle">账单应收日期<i class="required">*</i></div>
                  <!-- <div class="cttitle">提前付款时间<i class="required">*</i></div> -->
                  <!-- <el-input v-model="LeaseClauseData.dayNumber"
                            style="width: 83%!important"
                            type="number"
                            placeholder="请输入内容"></el-input>
                  <span>自然日</span> -->
                  <el-select v-model="LeaseClauseData.dayType"
                             style="width: 57%;margin-right: 10px"
                             @change="LeaseClauseData.dayNumber = ''"
                             placeholder="请选择">
                    <el-option label="固定日期"
                               value="FIXED"></el-option>
                    <el-option label="提前天数"
                               value="TOP"></el-option>
                  </el-select>
                  <el-input v-model="LeaseClauseData.dayNumber"
                            type="number"
                            style="width: 37%;"
                            placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item v-if="addData.rentalMethod !== 'RENT'"
                              :label-width="formLabelWidth"
                              style="margin-bottom: 20px"
                              prop="dayNumber">
                  <div class="cttitle">账单应收日期，次月<i class="required">*</i></div>
                  <el-input v-model="LeaseClauseData.dayNumber"
                            style="width: 83%!important"
                            type="number"
                            min="1"
                            max="31"
                            placeholder="请输入内容"></el-input>
                  <span>日</span>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">首个免租期是否包含在租金账单内<i class="required">*</i></div>
                  <el-select v-model="LeaseClauseData.onBillContainFirstOfferReocrd"
                             placeholder="请选择"
                             @change="syncHandle()">
                    <el-option v-for="item in offerReocrdOptions"
                               :key="item.value"
                               :label="item.name"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth">
                  <div class="cttitle">滞纳金比例</div>
                  <el-input v-model="LeaseClauseData.lateFeeRate"
                            type="number"
                            style="width: 60%;margin-right: 10px"
                            placeholder="请输入内容"></el-input>%/天
                </el-form-item>
              </div>
            </div>
          </el-form>
          <div class="dc-right float-right"
               v-if="rentIncrements && isrentClause">
            <div class="dr-head">
              租金递增
              <span class="iconfont icon-bottom"
                    :class="{'icon-top': !showRentIncrements}"
                    @click="showRentIncrements = !showRentIncrements"></span>
              <span class="iconfont icon-add"
                    @click="rentIncrementsAdd"></span>
              <span class="iconfont icon-reduce"
                    @click="rentIncrementsReduce"
                    v-if="LeaseClauseData.incrementRates.length > 1"></span>
              <div class="right-btn">
                <i class="iconfont icon-cha"
                   @click="rentIncrementsDel"></i>
              </div>
            </div>
            <div class="selected-housing"
                 v-for="(item, index) in LeaseClauseData.incrementRates"
                 :key="index"
                 v-if="showRentIncrements">
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;">
                <div class="cttitle">递增开始时间</div>
                <el-date-picker v-model="item.startDate"
                                type="date"
                                @change="changeEnd(index)"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;">
                <div class="cttitle">递增结束时间</div>
                <el-date-picker v-model="item.endDate"
                                type="date"
                                @change="changeStart(index)"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            v-if="addData.rentalMethod === 'RENT'"
                            style="margin-bottom: 20px;margin-right: 5px;">
                <div class="cttitle">租金单价递增</div>
                <el-input v-model="item.number"
                          type="number"
                          style="width: 55%"
                          placeholder="请输入内容"></el-input>
                <el-select v-model="item.incrementUnit"
                           style="width: 35%;"
                           placeholder="请选择">
                  <el-option label="%"
                             value="P"></el-option>
                  <el-option label="元"
                             value="Y"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="addData.rentalMethod !== 'RENT'"
                            :label-width="formLabelWidth"
                            style="margin-bottom: 20px;"
                            prop="point">
                <div class="cttitle">租金抽成比例(按营业额抽成)<i class="required">*</i></div>
                <el-input v-model="item.point"
                          style="width: 83%!important"
                          type="number"
                          placeholder="请输入内容"></el-input>
                <span>%/月</span>
              </el-form-item>
              <el-form-item v-if="addData.rentalMethod === 'GUARANTEEPOINT'">
                <div class="cttitle">保底价<i class="required">*</i></div>
                <el-input v-model="item.number"
                          style="width: 59%;margin-right: 10px"
                          placeholder="请输入内容"></el-input>
                <span>{{priceUnitFormat(LeaseClauseData.priceUnit)}}</span>
                <!-- <el-select v-model="item.priceUnit"
                            style="width: 35%;"
                            placeholder="请选择">
                  <el-option label="元/㎡天"
                              value="M2DAYS"></el-option>
                  <el-option label="元/㎡月"
                              value="M2MONTH"
                              disabled></el-option>
                  <el-option label="元/天"
                              value="DAY"
                              disabled></el-option>
                  <el-option label="元/月"
                              value="MONTH"
                              ></el-option>
                </el-select> -->
              </el-form-item>
            </div>
          </div>
          <div class="dc-right float-right"
               v-if="rentConcessions && isrentClause">
            <div class="dr-head">
              租金优惠
              <span class="iconfont icon-bottom"
                    :class="{'icon-top': !showRentConcessions}"
                    @click="showRentConcessions = !showRentConcessions"></span>
              <span class="iconfont icon-add"
                    @click="rentConcessionsAdd"></span>
              <span class="iconfont icon-reduce"
                    @click="rentConcessionsReduce"
                    v-if="LeaseClauseData.offerRecords.length > 1"></span>
              <div class="right-btn">
                <i class="iconfont icon-cha"
                   @click="rentConcessionsDel"></i>
              </div>
            </div>
            <div class="selected-housing"
                 v-for="(item, index) in LeaseClauseData.offerRecords"
                 :key="index"
                 v-if="showRentConcessions">
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;margin-right: 5px;">
                <div class="cttitle">优惠类型</div>
                <el-select v-model="item.offerType"
                           placeholder="请选择">
                  <el-option label="免租期"
                             value="RENT"></el-option>
                  <el-option label="装修期"
                             value="DECORATION"></el-option>
                  <el-option label="物业免租期"
                             value="PROPERTY"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;">
                <div class="cttitle">优惠开始时间</div>
                <el-date-picker v-model="item.yhStartDate"
                                type="date"
                                @change="yhChangeEnd(index)"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;">
                <div class="cttitle">优惠结束时间</div>
                <el-date-picker v-model="item.yhEndDate"
                                type="date"
                                @change="yhChangeStart(index)"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
          <div class="dc-right float-right"
               v-if="decorationBond && isrentClause">
            <div class="dr-head">
              装修保证金
              <span class="iconfont icon-bottom"
                    :class="{'icon-top': !showRentBond}"
                    @click="showRentBond = !showRentBond"></span>
              <div class="right-btn">
                <i class="iconfont icon-cha"
                   @click="decorationBondDel();decorationBond = false"></i>
              </div>
            </div>
            <div class="selected-housing"
                 v-if="showRentBond">
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;">
                <div class="cttitle">开始时间</div>
                <el-date-picker v-model="addData.zxStartDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;">
                <div class="cttitle">结束时间</div>
                <el-date-picker v-model="addData.zxEndtDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;margin-right: 5px;">
                <div class="cttitle">装修保证金金额</div>
                <el-input v-model="addData.zxDeposit"
                          type="number"
                          style="width: 91%;margin-right: 11px;"
                          placeholder="请输入内容"></el-input>元
              </el-form-item>
            </div>
          </div>
          <el-form ref="propertyClauseForm"
                   v-show="!isrentClause"
                   :model="propertyClauseData"
                   :rules="propertyClauseRules"
                   label-width="80px">
            <div class="dc-right float-right">
              <div class="dr-head">
                计算方式
              </div>
              <div>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="areaTypeProperty">
                  <div class="cttitle">计租面积类型<i class="required">*</i></div>
                  <el-select v-model="propertyClauseData.areaTypeProperty"
                             @change="changeAreaTypeProp"
                             placeholder="请选择">
                    <el-option v-for="item in rentalAreaOptions"
                               :key="item.id"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;margin-right: 5px;width: 28%!important;">
                  <div class="cttitle">计租面积/m²<i class="required">*</i></div>
                  <el-input disabled="disabled"
                            v-model="exhibitionAreaProp"
                            placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="carryModeProperty">
                  <div class="cttitle">计算进位方式<i class="required">*</i></div>
                  <el-select v-model="propertyClauseData.carryModeProperty"
                             placeholder="请选择">
                    <el-option v-for="item in carryOptions"
                               :key="item.id"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="dc-right float-right">
              <div class="dr-head">物业条款
                <span class="iconfont icon-bottom"
                      :class="{'icon-top': !showPropertyClause}"
                      @click="showPropertyClause = !showPropertyClause"></span>
                <div class="right-btn">
                  <span @click="increasingProperty = true"
                        v-if="!increasingProperty">+物业费递增</span>
                  <span @click="propertyFee = true"
                        v-if="!propertyFee">+物业费优惠</span>
                </div>
              </div>
              <div class="selected-housing"
                   v-if="showPropertyClause">
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="startDate">
                  <div class="cttitle">开始时间<i class="required">*</i></div>
                  <el-date-picker v-model="propertyClauseData.startDate"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  disabled="disabled"
                                  placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="endDate">
                  <div class="cttitle">结束时间<i class="required">*</i></div>
                  <el-date-picker v-model="propertyClauseData.endDate"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  disabled="disabled"
                                  placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;margin-right: 5px;"
                              prop="deposit">
                  <div class="cttitle">物业费保证金金额/元<i class="required">*</i></div>
                  <el-input v-model="propertyClauseData.deposit"
                            type="number"
                            placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item prop="price">
                  <div class="cttitle">物业费单价<i class="required">*</i></div>
                  <el-input v-model="propertyClauseData.price"
                            type="number"
                            style="width: 59%;margin-right: 10px"
                            placeholder="请输入内容"></el-input>
                  <el-select v-model="propertyClauseData.priceUnit"
                             style="width: 35%;"
                             placeholder="请选择">
                    <el-option label="元/㎡天"
                               value="M2DAYS"></el-option>
                    <!-- <el-option label="元/㎡月"
                               value="M2MONTH"
                               disabled></el-option>
                    <el-option label="元/天"
                               value="DAY"
                               disabled></el-option> -->
                    <el-option label="元/月"
                               value="MONTH"></el-option>
                    <el-option label="元/年"
                               value="YEAR"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="billingType">
                  <div class="cttitle">计费类型<i class="required">*</i></div>
                  <el-select v-model="propertyClauseData.billingType"
                             placeholder="请选择">
                    <el-option v-for="item in billingTypeOptions"
                               :key="item.value"
                               :label="item.name"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              prop="yearDay"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">年天数<i class="required">*</i></div>
                  <!-- <el-input v-model="propertyClauseData.yearDay"
                            type="number"
                            placeholder="请输入内容"></el-input> -->
                  <el-select v-model="propertyClauseData.yearDay"
                             placeholder="请选择">
                    <el-option label="365"
                               value="365">
                    </el-option>
                    <el-option label="360"
                               value="360">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="month">
                  <!-- <div v-if="propertyClauseData.priceUnit === 'YEAR'"
                       class="cttitle">付款周期/年<i class="required">*</i></div> -->
                  <div class="cttitle">付款周期/月<i class="required">*</i></div>
                  <el-input v-model="propertyClauseData.month"
                            placeholder="请输入内容"
                            @input="monthChange('propertyClauseData', propertyClauseData.month)"></el-input>
                  <!-- <el-select v-model="propertyClauseData.month"
                             placeholder="请选择">
                    <el-option v-for="item in paymentCycleOptions"
                               :key="item.value"
                               :label="item.value"
                               :value="item.value">
                    </el-option>
                  </el-select> -->
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;"
                              prop="billDivision">
                  <div class="cttitle">账单划分方式<i class="required">*</i></div>
                  <el-select v-model="propertyClauseData.billDivision"
                             @change="syncHandle()"
                             placeholder="请选择">
                    <el-option label="首期开始，按付款周期划分"
                               value="NO"></el-option>
                    <el-option label="首期三个月，第三笔开始按季度划分"
                               value="QUARTER"
                               :disabled="billDivisionDisabledP"></el-option>
                    <el-option label="第二笔开始，按季度划分"
                               value="QUARTER_TWO"
                               :disabled="billDivisionDisabledP"></el-option>
                  </el-select>
                </el-form-item>
                <!-- v-if="LeaseClauseData.onBillContainFirstOfferReocrd === false && LeaseClauseData.month === propertyClauseData.month" -->
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;">
                  <div class="cttitle">物业费的账单日期是否同步租金账单<i class="required">*</i></div>
                  <el-select v-model="propertyClauseData.onRentBill"
                             placeholder="请选择">
                    <el-option v-for="item in onRentBillOptions"
                               :key="item.value"
                               :label="item.name"
                               :disabled="item.disabled"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;width: 30%!important"
                              prop="dayNumber">
                  <div class="cttitle">账单应收日期<i class="required">*</i></div>
                  <!-- <div class="cttitle">提前付款时间<i class="required">*</i></div> -->
                  <!-- <el-input v-model="propertyClauseData.dayNumber"
                            type="number"
                            placeholder="请输入内容"></el-input> -->
                  <el-select v-model="propertyClauseData.dayType"
                             style="width: 57%;margin-right: 10px"
                             @change="propertyClauseData.dayNumber = ''"
                             placeholder="请选择">
                    <el-option label="固定日期"
                               value="FIXED"></el-option>
                    <el-option label="提前天数"
                               value="TOP"></el-option>
                  </el-select>
                  <el-input v-model="propertyClauseData.dayNumber"
                            type="number"
                            style="width: 37%;"
                            placeholder="请输入内容"></el-input>
                  <!-- 自然日 -->
                </el-form-item>
                <el-form-item :label-width="formLabelWidth">
                  <div class="cttitle">滞纳金比例</div>
                  <el-input v-model="propertyClauseData.lateFeeRate"
                            type="number"
                            style="width: 60%;margin-right: 10px"
                            placeholder="请输入内容"></el-input>%/天
                </el-form-item>
              </div>
            </div>
          </el-form>
          <div class="dc-right float-right"
               v-if="increasingProperty && !isrentClause">
            <div class="dr-head">
              物业费递增
              <span class="iconfont icon-bottom"
                    :class="{'icon-top': !showProperty}"
                    @click="showProperty = !showProperty"></span>
              <span class="iconfont icon-add"
                    @click="propertyFeeAdd"></span>
              <span class="iconfont icon-reduce"
                    @click="propertyFeeReduce"
                    v-if="propertyClauseData.incrementRates.length > 1"></span>
              <div class="right-btn">
                <i class="iconfont icon-cha"
                   @click="propertyFeeDel"></i>
              </div>
            </div>
            <div class="selected-housing"
                 v-for="(item, index) in propertyClauseData.incrementRates"
                 :key="index"
                 v-if="showProperty">
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;"
                            prop="startDate">
                <div class="cttitle">递增开始时间</div>
                <el-date-picker v-model="item.startDate"
                                type="date"
                                @change="wyChangeEnd(index)"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;"
                            prop="endDate">
                <div class="cttitle">递增结束时间</div>
                <el-date-picker v-model="item.endDate"
                                type="date"
                                @change="wyChangeStart(index)"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;margin-right: 5px;"
                            prop="RentalMethod">
                <div class="cttitle">物业费单价递增</div>
                <el-input v-model="item.number"
                          type="number"
                          style="width: 55%"
                          placeholder="请输入内容"></el-input>
                <el-select v-model="item.incrementUnit"
                           style="width: 35%;"
                           placeholder="请选择">
                  <el-option label="%"
                             value="P"></el-option>
                  <el-option label="元"
                             value="Y"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="dc-right float-right"
               v-if="propertyFee && !isrentClause">
            <div class="dr-head">
              物业费优惠
              <span class="iconfont icon-bottom"
                    :class="{'icon-top': !showPropertyDiscount}"
                    @click="showPropertyDiscount = !showPropertyDiscount"></span>
              <span class="iconfont icon-add"
                    @click="preferentialPropertyAdd"></span>
              <span class="iconfont icon-reduce"
                    @click="preferentialPropertyReduce"
                    v-if="propertyClauseData.offerRecords.length > 1"></span>
              <div class="right-btn">
                <i class="iconfont icon-cha"
                   @click="preferentialPropertyDel"></i>
              </div>
            </div>
            <div class="selected-housing"
                 v-for="(item, index) in propertyClauseData.offerRecords"
                 :key="index"
                 v-if="showPropertyDiscount">
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;"
                            prop="RentalMethod">
                <div class="cttitle">优惠类型</div>
                <el-select v-model="item.offerType"
                           placeholder="请选择">
                  <el-option label="免租期"
                             value="RENT"></el-option>
                  <el-option label="装修期"
                             value="DECORATION"></el-option>
                  <el-option label="物业免租期"
                             value="PROPERTY"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;"
                            prop="RentalMethod">
                <div class="cttitle">优惠开始时间</div>
                <el-date-picker v-model="item.yhStartDate"
                                type="date"
                                @change="wyyhChangeEnd(index)"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;margin-right: 5px;"
                            prop="RentalMethod">
                <div class="cttitle">优惠结束时间</div>
                <el-date-picker v-model="item.yhEndDate"
                                type="date"
                                @change="wyyhChangeStart(index)"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
          <div class="generated-btn">
            <span @click="generatedRentDetails">生成账单明细</span>
            <el-dropdown trigger="hover"
                         style="float: right">
              <div class="morebtn el-dropdown-link">
                <!-- <i class="icon-daochu" style="font-size: 12px;margin-left: 10px;"></i> -->
                修改租金明细
                <i class="el-icon-arrow-down el-icon--right"
                   style="font-size: 12px;margin-left: 0"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <span @click="downLoadModel">下载租金明细</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span class="export-info"
                        style="postion: relative">导入租金明细
                    <input type="file"
                           style="position: absolute;opacity: 0;bottom: 17px;left: 0;width: 123px;"
                           @change="importModel($event)">
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="dc-right float-right">
            <div class="dr-head">账单明细
              <div class="right-btn">
                <!-- <span style="width: 70px;" @click="BillEdit=true" v-if="BillEdit===false">编辑</span>
                    <span style="width: 70px;" @click="BillEdit=false" v-else>保存</span> -->
              </div>
            </div>
            <div class="selected-housing">
              <ul>
                <li>日期</li>
                <li>费用类型</li>
                <li>付款日</li>
                <li v-if="addData.rentalMethod === 'RENT'">最终单价</li>
                <li v-if="addData.rentalMethod === 'GUARANTEEPOINT'">保底租金(元)</li>
                <li v-if="addData.rentalMethod !== 'RENT'">租金抽成比例</li>
                <li>最终金额(元)</li>
              </ul>
              <ul v-for="(item, index) in rentBillDetails"
                  :key="index">
                <li>
                  <el-checkbox v-model="checked"
                               v-if="BillEdit"></el-checkbox>
                  {{item.startDate}}～{{item.endDate}}
                </li>
                <li>{{item.feeTypeName}}</li>
                <li>{{item.finalPaymentDate}}</li>
                <li v-if="addData.rentalMethod === 'RENT'">{{item.finalPrice}}{{priceUnitFormat(item.priceUnit)}}</li>
                <li v-if="addData.rentalMethod === 'GUARANTEEPOINT'">{{item.bdAmount}}</li>
                <li v-if="addData.rentalMethod !== 'RENT'">
                  <span v-if="item.feeTypeName === '租金'">{{item.finalPrice}}%</span>
                  <span v-else>-</span>
                </li>
                <li v-if="addData.rentalMethod === 'RENT'">
                  <input type="text"
                         v-model="item.amount"
                         v-if="BillEdit" />
                  <div v-else
                       class="overflow-style">{{item.amount}}元
                    <span v-if="item.remake && item.feeTypeName === '租金保证金'"
                          style="color: red">({{item.remake}})</span>
                  </div>
                </li>
                <li v-if="addData.rentalMethod === 'POINTS'">
                  <span v-if="item.feeTypeName === '租金'">营业额的{{item.finalPrice}}%</span>
                  <span v-else>{{item.amount}}</span>
                </li>
                <li v-if="addData.rentalMethod === 'GUARANTEEPOINT'">
                  <span v-if="item.feeTypeName === '租金'">{{item.bdAmount}}或者营业额的{{item.finalPrice}}%</span>
                  <span v-else>{{item.amount}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-form>
      <div class="step3 dl-content"
           v-show="newlystep3">
        <div class="contc-template">
          <el-select clearable
                     v-model="templateId"
                     placeholder="请选择租赁合同模版"
                     style="width: 200px;margin-top: 10px"
                     size="small"
                     @change="setOtherData(templateId)">
            <el-option v-for="item in templateOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="dc-right float-right"
             v-if="templateId"
             style="width: 100%">
          <div class="dr-head"
               style="margin-bottom: 0">其他</div>
          <div class="otherinfo">
            <template v-for="(item, index) in KeyWordRecordImgArr">
              <div style="display: flex;align-items: center;margin-bottom: 16px;">
                <span>{{formatName(item.exName)}}：</span>
                <aliUpload class="aliUpload"
                           upLoadText="上传附件"
                           :fileType="tempFileType"
                           businessType='project'
                           :encrypt="true"
                           :iconShow="true"
                           @setAnnex="step3setAnnex(arguments, item)" />
              </div>
              <div class="enclosure-warp"
                   v-for="(item2, index2) in item.otherAnnexes"
                   :key="item2.annexName">
                <svg class="icon"
                     v-if="item2.annexName"
                     aria-hidden="true">
                  <use :xlink:href="getformat2(item2.annexName)"></use>
                </svg>
                <span style="margin-left: 6px">{{item2.annexName}}</span>
                <ailPreview :ailObj="item2"
                            :encrypt="true"
                            @setFile="setFile" />
                <span>
                  <i @click="deleteAnnex(item, index2)"
                     class="iconfont icon-lajixiang"
                     style="margin-left:20px;cursor: pointer;"></i>
                </span>
              </div>
            </template>
            <div class="text-div"
                 v-for="(item, index) in KeyWordRecordTextArr"
                 :key="index">
              <span>{{item.exName}}：</span>
              <el-input v-model="item.value"
                        size="small"
                        style="width: 200px"></el-input>
            </div>
          </div>
        </div>
        <div class="dc-right float-right"
             style="width: 100%">
          <div class="dr-head"
               style="margin-bottom: 0">备注</div>
          <div class="other-info"
               v-if="houseReadOnly">
            <el-input type="textarea"
                      :rows="2"
                      resize="none"
                      v-model="addData.remark">
            </el-input>
          </div>
          <div class="other-info"
               v-else>
            <el-input type="textarea"
                      :rows="2"
                      resize="none"
                      v-if="addData.remarks[0]"
                      v-model="addData.remarks[0].content">
            </el-input>
          </div>
        </div>
        <div class="dc-right float-right"
             style="width: 100%">
          <div class="enclosure">
            <div class="enclosure-head enclosure-head2">
              <div>附件</div>
              <!-- <div class="upload">
								上传附件
								<input type="file" @change="imageChange('addapp', $event)">
							</div> -->
              <aliUpload :upLoadText="upLoadText"
                         :fileType="fileType"
                         @setAnnex="setAnnex" />
            </div>
            <div class="enclosure-head"
                 style="border-bottom: 1px solid #D8DCE3;background-color:#fff">
              <span>文件名</span>
              <span style="text-align: right;padding-right: 30px;">操作</span>
            </div>
            <!-- <div class="enclosure-list" v-if="houseReadOnly">
							<div class="el-item">
								<span>{{addData.annexName}}</span>
								<span v-if="addData.annexName">
									<i @click="downloadFile(addData, 0)" class="iconfont icon-xiazaidaoru" style="margin-right: 10px;"></i>
									<i @click="deleFile2()" class="iconfont icon-lajixiang"></i>
								</span>
							</div>
						</div> -->
            <div class="enclosure-list"
                 v-for="(item, index) in addData.annexes"
                 :key="index">
              <div class="el-item">
                <span>{{item.annexName}}</span>
                <span v-if="item.annexName"
                      style="text-align: right;padding-right: 20px;">
                  <!-- <i @click="downloadFile(item, index)"
                     class="iconfont icon-xiazaidaoru"
                     style="margin-right: 10px;"></i> -->
                  <aliDownLoad :item="item"
                                :encrypt="true" />
                  <i @click="deleFile(item, index)"
                     class="iconfont icon-lajixiang"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click="closeAddDialog"
                 class="close-button"
                 v-if="newlystep1">关 闭</el-button>
      <el-button type="primary"
                 @click="previousStep"
                 class="close-button"
                 v-if="newlystep2 || newlystep3">上一步</el-button>
      <el-button @click="newlystepNoe('addData')"
                 type="primary"
                 class="defaultbtn dialog-confirmBtn"
                 v-if="newlystep1 || newlystep2">下一步</el-button>
      <el-button type="primary"
                 class="close-button preview-button"
                 v-if=" (newlystep3 && contractStateParent !== 'renewal' && !approvalAgain && this.templateId) || (newlystep3 && approvalAgain && this.templateId)"
                 @click="previewContract('preview')">预览租赁合同</el-button>
      <el-button type="primary"
                 class="close-button"
                 v-if="newlystep3 && contractStateParent !== 'renewal' && !approvalAgain "
                 @click="temporaryStorage()">暂存</el-button>
      <el-button type="primary"
                 class="defaultbtn dialog-confirmBtn"
                 v-if="newlystep3"
                 @click="previewContract('initiateApproval')">
        <span v-if="approvalAgain">再次</span>发起审批
      </el-button>
    </div>

    <el-dialog :visible.sync="centerDialogVisible"
               class="lockDialogClose"
               append-to-body
               width="400px">
      <div class="lockDialogContent">
        <img src="../../../../assets/tips.png">
        <div>
          <div class="div1">提示</div>
          <div class="div2">该合同编号{{addData.contractNo}}已存在，是否确认使用该编号？</div>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <span class="cancel"
              @click="centerDialogVisible = false">取消</span>
        <span class="determine"
              @click="determine">确定</span>
      </span>
    </el-dialog>

    <!-- 图片预览 -->
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import { getformat } from '@/utils/validate.js'
import aliUpload from '@/components/aliUpload.vue'
import ailPreview from '@/components/ailPreview.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import { fail } from 'assert'
window.repeatCode = false
export default {
  name: 'addContracts',
  components: {
    aliUpload,
    ailPreview,
    picturePrevie,
    aliDownLoad
  },
  props: {
    projectList: {
      type: Array,
      default: []
    },
    detailData: {
      type: Object,
      default: {}
    },
    contractState: {
      type: String,
      default: ''
    },
    intentionToFormalize: {
      type: String,
      default: ''
    },
    approvalReject: {
      type: String,
      default: ''
    },
    queryObj: {
      type: Object
    }
  },
  data () {
    var validateCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入合同编号'))
      } else if (window.repeatCode) {
        callback(new Error('合同编号已存在,请更换'))
      } else {
        callback()
      }
    }
    var validateYearDay = (rule, value, callback) => {
      if (this.LeaseClauseData.billingType === 'MONTH') {
        if (value === '' || value === undefined) {
          callback(new Error('请输入年天数'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateYearDay2 = (rule, value, callback) => {
      if (this.propertyClauseData.billingType === 'MONTH') {
        if (value === '' || value === undefined) {
          callback(new Error('请输入年天数'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateMonth = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请输入付款周期'))
      } else if (!(/(^[1-9]\d*$)/.test(value))) {
        callback(new Error('只能输入数字'))
      } else {
        callback()
      }
    }
    return {
      KeyWordRecordTextArr: [],
      KeyWordRecordImgArr: [],
      explain: '',
      showPicture: false,
      imgArr: [],
      enclosureList: [],
      tempFileType: ['jpeg', 'jpg', 'png'],
      templateId: '',
      templateOptions: [],
      centerDialogVisible: false,
      billDivisionDisabledL: true,
      billDivisionDisabledP: true,
      detailDataReject: {},
      tenantShow: true,
      activeName: '',
      approvalRejectParent: '',
      contractStateParent: '',
      projectListParent: [],
      rentalAreaOptions: [
        { label: '建筑面积', value: 'BUILDING', id: 1 },
        { label: '使用面积', value: 'USING', id: 2 }
      ],
      carryOptions: [
        { label: '四舍五入', value: 'ROUNDING', id: 1 },
        { label: '无条件进位', value: 'UNCONDITIONAL', id: 2 }
      ],
      options4: [
        { label: '租金条款', value: 'RentClause', id: 1 },
        { label: '物业费条款', value: 'PropertyFeeClause', id: 2 }
      ],
      berthPlan: 'RentClause', // 租金条款
      isrentClause: true,
      berthSelected: false,
      selectionFloor: '',
      RoomsDTOS: [],
      multipleSelection: [],
      multipleSelectionAll: [],
      berthInput: '',
      upLoadText: '上传附件',
      fileType: [],
      houseReadOnly: false,
      areaNull: false,
      approvalAgain: false,
      pickerOptionsStart: {},
      pickerOptionsEnd: {},
      berthSelectedTableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      addData: {
        onImportBills: false,
        contractBillTmpDTOS: [],
        tenant: {
          industry: '',
          contact: ''
        },
        rentClauses: [{
          termType: 'RENT',
          offerRecords: [],
          incrementRates: []
        }],
        remarks: [{
          content: ''
        }],
        annexes: [],
        startDate: '',
        contractNo: '',
        rentalMethod: '',
        shopName: '',
        signtDate: '',
        endDate: '',
        zxStartDate: '',
        zxEndtDate: '',
        zxDeposit: '',
        toBTrimTime: '',
        billNoticeTemplateId: '',
        billNoticeTemplateName: '',
        customKeyWordRecordDTOS: []
      },
      contractEnd: {
        disabledDate: time => {
          if (this.addData.startDate) {
            return time.getTime() < new Date(this.addData.startDate).getTime()
          } else {
            return
          }
        }
      },
      contractStart: {
        disabledDate: time => {
          if (this.addData.endDate) {
            return time.getTime() > new Date(this.addData.endDate).getTime()
          } else {
            return
          }
        }
      },
      propertyClauseData: {
        carryModeProperty: '',
        billingType: '',
        carryModeRent: '',
        deposit: '',
        price: '',
        month: '',
        dayNumber: '',
        billDivision: 'NO',
        priceUnit: 'M2DAYS',
        termType: 'PROPERTY',
        onRentBill: true,
        offerRecords: [],
        incrementRates: []
      },
      LeaseClauseData: {
        carryModeRent: '',
        deposit: '',
        month: '',
        dayNumber: '',
        billDivision: 'NO',
        priceUnit: 'M2DAYS',
        termType: 'RENT',
        offerRecords: [],
        incrementRates: []
      },
      offerReocrdOptions: [
        { name: '不包括', value: false },
        { name: '包括', value: true }
      ],
      onRentBillOptions: [
        { name: '不同步', value: false, disabled: false },
        { name: '同步', value: true, disabled: false }
      ],
      rentBillDetails: [],
      annexesList: [],
      newlystep1: true,
      newlystep2: false,
      newlystep3: false,
      rentIncrements: false,
      rentConcessions: false,
      decorationBond: false,
      increasingProperty: false,
      propertyFee: false,
      showLeaseTerms: true,
      showPropertyClause: true,
      showRentIncrements: true,
      showRentConcessions: true,
      showRentBond: true,
      showProperty: true,
      showPropertyDiscount: true,
      checked: true,
      BillEdit: false,
      formLabelWidth: '',
      documentTypeOptions: [],
      tenantNameeOptions: [],
      chooseObj: {},
      building: {},
      checkList: [],
      checkIdList: [],
      exhibitionArea: '',
      exhibitionAreaProp: '',
      selHourse: false,
      selProject: false,
      errorProject: false,
      contractStatus: '',
      contractNumber: '',
      taskId: '',
      selectionIndex: '',
      useAreaNull: false,
      addDataRules1: {
        rentalMethod: [{
          required: true,
          message: '请选择租赁方式',
          trigger: 'change'
        }],
        contractNo: [{
          validator: validateCode,
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
        signtDate: [{
          required: true,
          message: '请选择签订时间',
          trigger: 'blur'
        }],
        area: [{
          required: false,
          message: '租赁面积不能为空',
          trigger: 'change'
        }],
        tenant: [{
          required: true,
          message: '请选择客户',
          trigger: 'change'
        }]
      },
      LeaseClauseRules: {
        areaTypeRent: [{
          required: true,
          message: '请选择计租面积类型',
          trigger: 'change'
        }],
        carryModeRent: [{
          required: true,
          message: '请选择计费进位方式',
          trigger: 'change'
        }],
        startDate: [{
          required: false,
          message: '请选择开始时间',
          trigger: 'change'
        }],
        endDate: [{
          required: false,
          message: '请选择结束时间',
          trigger: 'change'
        }],
        deposit: [{
          required: true,
          message: '请输入租金保证金金额',
          trigger: 'blur'
        }],
        price: [{
          required: true,
          message: '请输入价格',
          trigger: 'blur'
        }],
        month: [{
          // required: true,
          // message: '请输入付款周期',
          validator: validateMonth,
          trigger: 'change'
        }],
        billDivision: [{
          required: true,
          message: '请选择账单划分方式',
          trigger: 'change'
        }],
        dayNumber: [{
          required: true,
          message: '请输入应收日期',
          trigger: 'blur'
        }],
        billingType: [{
          required: true,
          message: '请选择计费类型',
          trigger: 'change'
        }],
        yearDay: [{
          validator: validateYearDay,
          trigger: 'blur'
        }],
        point: [{
          required: true,
          message: '请输入租金抽成比例',
          trigger: 'blur'
        }]
      },
      propertyClauseRules: {
        areaTypeProperty: [{
          required: true,
          message: '请选择计租面积类型',
          trigger: 'change'
        }],
        carryModeProperty: [{
          required: true,
          message: '请选择计费进位方式',
          trigger: 'change'
        }],
        startDate: [{
          required: false,
          message: '请选择开始时间',
          trigger: 'change'
        }],
        endDate: [{
          required: false,
          message: '请选择结束时间',
          trigger: 'change'
        }],
        deposit: [{
          required: true,
          message: '请输入物业费保证金金额',
          trigger: 'blur'
        }],
        price: [{
          required: true,
          message: '请输入物业费单价',
          trigger: 'blur'
        }],
        month: [{
          validator: validateMonth,
          trigger: 'change'
        }],
        billDivision: [{
          required: true,
          message: '请选择账单划分方式',
          trigger: 'change'
        }],
        dayNumber: [{
          required: true,
          message: '请输入应收日期',
          trigger: 'blur'
        }],
        billingType: [{
          required: true,
          message: '请选择计费类型',
          trigger: 'change'
        }],
        yearDay: [{
          validator: validateYearDay2,
          trigger: 'blur'
        }]
      },
      billingTypeOptions: [
        {
          name: '按月计费',
          value: 'MONTH'
        },
        {
          name: '按实际天数计费',
          value: 'DAY'
        }
      ],
      paymentCycleOptions: [
        {
          value: 1
        }, {
          value: 2
        }, {
          value: 3
        }, {
          value: 4
        }, {
          value: 5
        }, {
          value: 6
        }, {
          value: 7
        }, {
          value: 8
        }, {
          value: 9
        }, {
          value: 10
        }, {
          value: 11
        }, {
          value: 12
        }
      ],
      currentlySelected: []
    }
  },
  watch: {
    projectListParent: { // 暂存
      handler: function (newVal, oldVal) {
        if (localStorage.STORAGE === 'true') {
          this.approvalAgain = false
          let detailData = JSON.parse(JSON.stringify(this.detailData))
          this.addData = detailData
          this.chooseObj = this.addData.projectManagement
          if (this.addData.rentClauses.length === 2) { // 租金和物业
            this.LeaseClauseData = this.detailData.rentClauses[0] // 租金条款
            this.propertyClauseData = this.addData.rentClauses[1]
            this.$set(this.LeaseClauseData, 'areaTypeRent', this.addData.areaTypeRent)
            this.$set(this.LeaseClauseData, 'carryModeRent', this.addData.carryModeRent)
            this.$set(this.propertyClauseData, 'areaTypeProperty', this.addData.areaTypeProperty)
            this.$set(this.propertyClauseData, 'carryModeProperty', this.addData.carryModeProperty)
            if (this.LeaseClauseData.month === 3 || this.LeaseClauseData.month === '3') {
              this.billDivisionDisabledL = false
            }
            if (this.propertyClauseData.month === 3 || this.propertyClauseData.month === '3') {
              this.billDivisionDisabledP = false
            }
          } else if (this.addData.rentClauses.length === 1 && this.addData.rentClauses[0].termType === 'RENT') { // 只有租金条款
            this.LeaseClauseData = this.detailData.rentClauses[0] // 租金条款
            this.$set(this.LeaseClauseData, 'areaTypeRent', this.addData.areaTypeRent)
            this.$set(this.LeaseClauseData, 'carryModeRent', this.addData.carryModeRent)
            this.propertyClauseData = {
              carryModeProperty: '',
              billingType: '',
              carryModeRent: '',
              deposit: '',
              price: '',
              month: '',
              dayNumber: '',
              billDivision: 'NO',
              priceUnit: 'M2DAYS',
              termType: 'PROPERTY',
              offerRecords: [{
                termType: 'PROPERTY',
                'yhStartDate': '',
                'yhEndDate': '',
                'offerType': ''
              }],
              incrementRates: [{
                termType: 'PROPERTY',
                'startDate': '',
                'endDate': '',
                'number': '',
                'incrementUnit': 'P'
              }]
            }
            this.delTab(1)
            if (this.LeaseClauseData.month === 3 || this.LeaseClauseData.month === '3') {
              this.billDivisionDisabledL = false
            }
          } else if (this.addData.rentClauses.length === 1 && this.addData.rentClauses[0].termType === 'PROPERTY') { // 只有物业条款
            this.propertyClauseData = this.addData.rentClauses[0]
            this.$set(this.propertyClauseData, 'areaTypeProperty', this.addData.areaTypeProperty)
            this.$set(this.propertyClauseData, 'carryModeProperty', this.addData.carryModeProperty)
            this.delTab(0)
            this.LeaseClauseData = {
              billingType: '',
              deposit: '',
              carryModeRent: '',
              month: '',
              dayNumber: '',
              billDivision: 'NO',
              priceUnit: 'M2DAYS',
              termType: 'RENT',
              offerRecords: [],
              incrementRates: []
            }
            if (this.propertyClauseData.month === 3 || this.propertyClauseData.month === '3') {
              this.billDivisionDisabledP = false
            }
          }
          this.syncHandle('暂存')
          if (this.addData.rooms) {
            this.multipleSelectionAll = this.addData.rooms
            this.berthSelected = true
            let checkIdList = []
            this.checkList = this.addData.rooms
            this.addData.rooms.forEach(ele => {
              checkIdList.push(ele.id)
            })
            this.checkIdList = checkIdList
            this.sczj()
          }
          this.getRooms(this.addData.projectManagement.id, 'prefix')
          this.houseReadOnly = false
          if (this.LeaseClauseData.incrementRates.length > 0) { // 租金递增
            this.rentIncrements = true
            this.showRentIncrements = true
          } else {
            this.rentIncrements = false
          }
          if (this.LeaseClauseData.offerRecords.length > 0) { // 租金优惠
            this.rentConcessions = true
            this.showRentConcessions = true
          } else {
            this.rentConcessions = false
          }
          if (this.addData.zxStartDate !== null && this.addData.zxStartDate !== '') { // 装修保证金
            this.decorationBond = true
            this.showRentBond = true
          } else {
            this.decorationBond = false
          }
          if (this.propertyClauseData.incrementRates.length > 0 && this.propertyClauseData.incrementRates[0].endDate !== '') { // 物业费递增
            this.increasingProperty = true
            this.showProperty = true
          } else {
            this.increasingProperty = false
          }
          if (this.propertyClauseData.offerRecords.length > 0 && this.propertyClauseData.offerRecords[0].yhEndDate !== '') { // 物业费优惠
            this.propertyFee = true
            this.showPropertyDiscount = true
          } else {
            this.propertyFee = false
          }
          this.$refs['addData1'].resetFields()
          this.$refs['LeaseClauseForm'].resetFields()
          this.$refs['propertyClauseForm'].resetFields()
        } else { }
      }
    },
    contractStateParent: { // 续签
      handler: function (newName, oldName) {
        if (localStorage.contractStatus === 'renewal') {
          // this.getRenewal() // 获取rentClauses
          context.http.get('/cms/api/rent-clauses/renewal?contractId=' + this.detailData.id).then(res => {
            if (res.status === 200) {
              this.detailData.rentClauses = res.data
              // this.LeaseClauseData = this.detailData.rentClauses[0]
              // if (this.detailData.rentClauses.length > 1) {
              //   this.propertyClauseData = this.detailData.rentClauses[1]
              // }
              // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!续签条款初始化
              this.approvalAgain = false
              let detailData = JSON.parse(JSON.stringify(this.detailData))
              this.addData = detailData
              this.rentBillDetails = this.addData.contractBillTmpDTOS
              this.chooseObj = this.detailData.projectManagement
              // this.addData.startDate = this.addData.endDate
              var now = this.addData.endDate.split('-')
              now = new Date(Number(now['0']), (Number(now['1']) - 1), Number(now['2']))
              now.setDate(now.getDate() + 1)
              let month = (now.getMonth() + 1) < 10 ? 0 + '' + (now.getMonth() + 1) : (now.getMonth() + 1)
              let date = now.getDate() < 10 ? 0 + '' + now.getDate() : now.getDate()
              let youWant = now.getFullYear() + '-' + month + '-' + date
              this.addData.startDate = youWant
              // this.LeaseClauseData = this.detailData.rentClauses[0]
              // this.propertyClauseData = this.detailData.rentClauses[1]
              this.LeaseClauseData.incrementRates = [{
                termType: 'RENT',
                'startDate': '',
                'endDate': '',
                'number': '',
                'incrementUnit': 'P'
              }]
              this.LeaseClauseData.offerRecords = [{
                termType: 'RENT',
                'yhStartDate': '',
                'yhEndDate': '',
                'offerType': ''
              }]
              this.propertyClauseData.areaTypeProperty = 'BUILDING'
              this.propertyClauseData.carryModeProperty = 'ROUNDING'
              this.propertyClauseData.startDate = ''
              this.propertyClauseData.endDate = ''
              this.decorationBondDel()
              this.getRooms(this.detailData.projectManagement.id, 'prefix')
              this.checkList = this.addData.rooms
              this.sczj()
              // this.multipleSelectionAll = arr
              this.berthSelected = true
              this.addData.signtDate = ''
              this.addData.endDate = ''
              this.houseReadOnly = true
              // this.contractStatus = localStorage.contractState
              if (this.addData.rentClauses.length === 2) {
                this.LeaseClauseData = this.detailData.rentClauses[0] // 租金条款
                this.propertyClauseData = this.addData.rentClauses[1]
                this.$set(this.LeaseClauseData, 'areaTypeRent', this.addData.areaTypeRent)
                this.$set(this.LeaseClauseData, 'carryModeRent', this.addData.carryModeRent)
                this.$set(this.propertyClauseData, 'areaTypeProperty', this.addData.areaTypeProperty)
                this.$set(this.propertyClauseData, 'carryModeProperty', this.addData.carryModeProperty)
                this.propertyClauseData.incrementRates = [{
                  termType: 'PROPERTY',
                  'startDate': '',
                  'endDate': '',
                  'number': '',
                  'incrementUnit': 'P'
                }]
                this.propertyClauseData.offerRecords = [{
                  termType: 'PROPERTY',
                  'yhStartDate': '',
                  'yhEndDate': '',
                  'offerType': ''
                }]
                if (this.LeaseClauseData.month === 3 || this.LeaseClauseData.month === '3') {
                  this.billDivisionDisabledL = false
                }
                if (this.propertyClauseData.month === 3 || this.propertyClauseData.month === '3') {
                  this.billDivisionDisabledP = false
                }
              } else if (this.addData.rentClauses.length === 1 && this.addData.rentClauses[0].termType === 'RENT') { // 只有租金条款
                this.LeaseClauseData = this.detailData.rentClauses[0] // 租金条款
                this.$set(this.LeaseClauseData, 'areaTypeRent', this.addData.areaTypeRent)
                this.$set(this.LeaseClauseData, 'carryModeRent', this.addData.carryModeRent)
                this.delTab(1)
                this.propertyClauseData = {
                  carryModeProperty: '',
                  billingType: '',
                  deposit: '',
                  price: '',
                  month: '',
                  dayNumber: '',
                  billDivision: 'NO',
                  priceUnit: 'M2DAYS',
                  termType: 'PROPERTY',
                  offerRecords: [],
                  incrementRates: []
                }
                if (this.LeaseClauseData.month === 3 || this.LeaseClauseData.month === '3') {
                  this.billDivisionDisabledL = false
                }
                // this.propertyClauseData = {
                //   offerRecords: [{
                //     termType: 'PROPERTY',
                //     'yhStartDate': '',
                //     'yhEndDate': '',
                //     'offerType': ''
                //   }],
                //   incrementRates: [{
                //     termType: 'PROPERTY',
                //     'startDate': '',
                //     'endDate': '',
                //     'number': '',
                //     'incrementUnit': 'P'
                //   }]
                // }
              } else if (this.addData.rentClauses.length === 1 && this.addData.rentClauses[0].termType === 'PROPERTY') { // 只有物业条款
                this.propertyClauseData = this.addData.rentClauses[0]
                this.$set(this.propertyClauseData, 'areaTypeProperty', this.addData.areaTypeProperty)
                this.$set(this.propertyClauseData, 'carryModeProperty', this.addData.carryModeProperty)
                this.LeaseClauseData = {
                  billingType: '',
                  carryModeRent: '',
                  deposit: '',
                  month: '',
                  dayNumber: '',
                  billDivision: 'NO',
                  priceUnit: 'M2DAYS',
                  termType: 'RENT',
                  offerRecords: [],
                  incrementRates: []
                }
                this.delTab(0)
                if (this.propertyClauseData.month === 3 || this.propertyClauseData.month === '3') {
                  this.billDivisionDisabledP = false
                }
              }
              this.syncHandle('续签')
            }
          })
        }
      }
    },
    detailData: {
      handler: function (newName, oldName) { },
      immediate: true,
      deep: true
    },
    intentionToFormalize: { // 意向合同转正式合同
      handler: function (newVal, old) {
        if (localStorage.contractStatus === 'toBeContract') {
          this.approvalAgain = false
          this.houseReadOnly = true
          this.addData = this.detailData
          this.rentBillDetails = this.addData.contractBillTmpDTOS
          // this.propertyClauseData = this.addData.rentClauses[1]
          // this.LeaseClauseData = this.addData.rentClauses[0]
          this.getRooms(this.addData.projectManagement.id)
          if (this.addData.rooms) {
            this.checkList = this.addData.rooms
            this.multipleSelectionAll = this.addData.rooms
            this.berthSelected = true
            this.getArea()
          }
          this.addData.rentClauses = [{
            startDate: '',
            endDate: '',
            deposit: '',
            price: '',
            priceUnit: '',
            month: '',
            dayNumber: '',
            billingType: '',
            yearDay: '',
            incrementRates: '',
            offerRecords: ''
          }]
        }
      },
      immediate: true
    },
    approvalRejectParent: { // 审核驳回查看
      handler: function (newVal, old) {
        if (localStorage.contractStatus === 'approvalReject' && newVal) {
          this.taskId = this.$route.query.taskId
          this.approvalAgain = true
          this.houseReadOnly = false
          this.berthSelected = true
          let contractDetails = this.$route.query.contractId
          context.http.get(`/cms/api/contracts/${contractDetails}`).then(res => {
            if (res.status === 200) {
              this.detailDataReject = res.data
              if (this.detailDataReject.remarks.length === 0) {
                this.detailDataReject.remarks = [{ content: '' }] // 备注
              }
              let detailData = JSON.parse(JSON.stringify(this.detailDataReject))
              this.addData = detailData
              this.getRooms(this.addData.projectManagement.id, 'prefixReject')
              if (this.addData.rooms) {
                this.multipleSelectionAll = this.addData.rooms
                let checkIdList = []
                this.checkList = this.addData.rooms
                this.addData.rooms.forEach(ele => {
                  checkIdList.push(ele.id)
                })
                this.checkIdList = checkIdList
                this.sczj()
              }
              this.$nextTick(() => {
                this.$set(this.LeaseClauseData, 'areaTypeRent', this.addData.areaTypeRent)
                this.$set(this.LeaseClauseData, 'carryModeRent', this.addData.carryModeRent)
                if (this.addData.rentClauses.length > 1) {
                  this.propertyClauseData = this.addData.rentClauses[1]
                  this.$set(this.propertyClauseData, 'areaTypeProperty', this.addData.areaTypeProperty)
                  this.$set(this.propertyClauseData, 'carryModeProperty', this.addData.carryModeProperty)
                }
              })
              context.http.get('/cms/api/project-managements', {
                useStatus: 'USING'
              }).then(res => {
                let projectList = res.data
                let chooseObj = projectList.filter(ele => {
                  return ele.id === this.addData.projectManagement.id
                })
                this.chooseObj = chooseObj[0]
              })
              if (this.addData.rentClauses.length === 2) {
                this.LeaseClauseData = this.addData.rentClauses[0]
                this.propertyClauseData = this.addData.rentClauses[1]
                this.$set(this.LeaseClauseData, 'areaTypeRent', this.addData.areaTypeRent)
                this.$set(this.LeaseClauseData, 'carryModeRent', this.addData.carryModeRent)
                this.$set(this.propertyClauseData, 'areaTypeProperty', this.addData.areaTypeProperty)
                this.$set(this.propertyClauseData, 'carryModeProperty', this.addData.carryModeProperty)
                if (this.LeaseClauseData.month === 3 || this.LeaseClauseData.month === '3') {
                  this.billDivisionDisabledL = false
                }
                if (this.propertyClauseData.month === 3 || this.propertyClauseData.month === '3') {
                  this.billDivisionDisabledP = false
                }
              } else if (this.addData.rentClauses.length === 1 && this.addData.rentClauses[0].termType === 'RENT') { // 只有租金条款
                this.LeaseClauseData = this.addData.rentClauses[0] // 租金条款
                this.$set(this.LeaseClauseData, 'areaTypeRent', this.addData.areaTypeRent)
                this.$set(this.LeaseClauseData, 'carryModeRent', this.addData.carryModeRent)
                this.propertyClauseData = {
                  carryModeProperty: '',
                  billingType: '',
                  carryModeRent: '',
                  deposit: '',
                  price: '',
                  month: '',
                  dayNumber: '',
                  billDivision: 'NO',
                  priceUnit: 'M2DAYS',
                  termType: 'PROPERTY',
                  offerRecords: [],
                  incrementRates: []
                }
                this.delTab(1)
                if (this.LeaseClauseData.month === 3 || this.LeaseClauseData.month === '3') {
                  this.billDivisionDisabledL = false
                }
              } else if (this.addData.rentClauses.length === 1 && this.addData.rentClauses[0].termType === 'PROPERTY') { // 只有物业条款
                this.propertyClauseData = this.addData.rentClauses[0]
                this.$set(this.propertyClauseData, 'areaTypeProperty', this.addData.areaTypeProperty)
                this.$set(this.propertyClauseData, 'carryModeProperty', this.addData.carryModeProperty)
                this.LeaseClauseData = {
                  billingType: '',
                  carryModeRent: '',
                  deposit: '',
                  month: '',
                  dayNumber: '',
                  billDivision: 'NO',
                  priceUnit: 'M2DAYS',
                  termType: 'RENT',
                  offerRecords: [],
                  incrementRates: []
                }
                this.delTab(0)
                if (this.propertyClauseData.month === 3 || this.propertyClauseData.month === '3') {
                  this.billDivisionDisabledP = false
                }
              }
              this.syncHandle('审核驳回查看')
              if (this.LeaseClauseData.offerRecords.length === 0) { // 租金优惠
                this.LeaseClauseData.offerRecords = [{
                  termType: 'RENT',
                  'yhStartDate': '',
                  'yhEndDate': '',
                  'offerType': ''
                }]
                this.rentConcessions = false
              } else {
                this.rentConcessions = true
                this.showRentConcessions = true
              }
              if (this.LeaseClauseData.incrementRates.length === 0) { // 租金递增
                this.LeaseClauseData.incrementRates = [{
                  termType: 'RENT',
                  'startDate': '',
                  'endDate': '',
                  'number': '',
                  'incrementUnit': 'P'
                }]
                this.rentIncrements = false
              } else {
                this.rentIncrements = true
                this.showRentIncrements = true
              }
              if (this.propertyClauseData.offerRecords.length === 0) { // 物业费优惠
                this.propertyClauseData.offerRecords = [{
                  termType: 'PROPERTY',
                  'yhStartDate': '',
                  'yhEndDate': '',
                  'offerType': ''
                }]
                this.propertyFee = false
              } else {
                this.propertyFee = true
                this.showPropertyDiscount = true
              }
              if (this.propertyClauseData.incrementRates.length === 0) { // 物业费递增
                this.propertyClauseData.incrementRates = [{
                  termType: 'PROPERTY',
                  'startDate': '',
                  'endDate': '',
                  'number': '',
                  'incrementUnit': 'P'
                }]
                this.increasingProperty = false
              } else {
                this.increasingProperty = true
                this.showProperty = true
              }
              if (this.addData.zxStartDate !== null && this.addData.zxStartDate !== '') { // 装修保证金
                this.decorationBond = true
                this.showRentBond = true
              } else {
                this.decorationBond = false
              }
            }
          })
        }
      }
    },
    'LeaseClauseData.dayNumber': {
      handler: function (newName, oldName) {
        if (this.LeaseClauseData.dayType === 'TOP') return
        // var reg = /^([12][0-8]|28|[1-9])$/
        var reg = /^([1-9]|1[0-9]|2[0-8])$/
        if (!reg.test(newName)) {
          this.LeaseClauseData.dayNumber = ''
        } else {
          this.LeaseClauseData.dayNumber = newName
        }
      }
    },
    'propertyClauseData.dayNumber': {
      handler: function (newName, oldName) {
        if (this.propertyClauseData.dayType === 'TOP') return
        var reg = /^([1-9]|1[0-9]|2[0-8])$/
        if (!reg.test(newName)) {
          this.propertyClauseData.dayNumber = ''
        } else {
          this.propertyClauseData.dayNumber = newName
        }
      }
    }
  },
  created () {
    this.initialization()
    this.approvalRejectParent = this.approvalReject
    this.projectListParent = this.projectList
    this.contractStateParent = this.contractState
    this.getBillNoticeTemp()
  },
  mounted () { },
  methods: {
    getformat2 (str) {
      return getformat(str)
    },
    formatName (name) {
      return name && name.replace('image.', ' ')
    },
    pictureClose () {
      this.showPicture = false
    },
    setFile (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    step3setAnnex (vals, item) {
      item.otherAnnexes.push({
        'annexURL': vals[0],
        'annexName': vals[1]
      })
      this.$forceUpdate()
    },
    deleteAnnex (item, index) {
      item.otherAnnexes.splice(index, 1)
      this.$forceUpdate()
    },
    setOtherData (id) {
      if (!id) {
        this.addData.billNoticeTemplateId = ''
        this.addData.billNoticeTemplateName = ''
        return
      }
      if (id === this.addDataBillNoticeTemplateId) {
        this.addData.billNoticeTemplateId = id
        this.addData.billNoticeTemplateName = this.addDataBillNoticeTemplateName
        this.formatKeywords(id, this.addDataBillNoticeTemplateName)
        return
      }
      let currentTemplate = this.templateOptions.filter(ele => {
        return ele.id === id
      })
      currentTemplate = currentTemplate[0]
      this.addData.billNoticeTemplateId = currentTemplate.id
      this.addData.billNoticeTemplateName = currentTemplate.name
      let textArr = []
      let imgArr = []
      if (currentTemplate.billNoticeKeywords.length === 0) {
        this.KeyWordRecordTextArr = textArr
        this.KeyWordRecordImgArr = imgArr
        return
      }
      currentTemplate.billNoticeKeywords.forEach(ele => {
        if (ele.keyWordType === 'CUSTOM') {
          ele.exName = ele.name.replace(/\$|{|}/g, '')
          ele.otherAnnexes = []
          if (ele.keywordAtribute === 'TEXT') {
            textArr.push(ele)
          } else if (ele.keywordAtribute === 'IMG') {
            imgArr.push(ele)
          }
        }
      })
      console.log(textArr, imgArr)
      this.KeyWordRecordTextArr = textArr
      this.KeyWordRecordImgArr = imgArr
    },
    formatKeywords (id, name) {
      this.addDataBillNoticeTemplateId = id
      this.addDataBillNoticeTemplateName = name
      this.templateId = id
      let textArr = []
      let imgArr = []
      if (!this.addData.customKeyWordRecordDTOS || this.addData.customKeyWordRecordDTOS.length === 0) return
      this.addData.customKeyWordRecordDTOS.forEach(ele => {
        ele.exName = ele.name.replace(/\$|{|}/g, '')
        if (ele.keywordAtribute === 'TEXT') {
          textArr.push(ele)
        } else if (ele.keywordAtribute === 'IMG') {
          imgArr.push(ele)
        }
      })
      console.log(textArr, imgArr)
      this.KeyWordRecordTextArr = textArr
      this.KeyWordRecordImgArr = imgArr
    },
    changeCentalMethod () {
      if (this.addData.tenant.tenantUseDescription === '办公' || this.addData.tenant.tenantUseDescription === '菜场') {
        this.addData.rentalMethod = 'RENT'
      }
    },
    sczj () { // 删除自用房源
      let arr = []
      let area = 0 // 总建筑面积
      let useArea = 0 // 总使用面积 合同续签排除自用房源
      this.addData.rooms.forEach(ele => {
        if (ele.investmentStatus === 'OK' || ele.investmentStatus === 'FICTITIOUS') {
          arr.push(ele)
          area += ele.buildingArea
          useArea += ele.useArea === null ? 0 : ele.useArea
        }
      })
      this.multipleSelectionAll = arr
      this.addData.area = area.toFixed(2)
      this.addData.useArea = useArea.toFixed(2)
    },
    initialization () {
      this.activeName = 100
      this.selProject = false
      this.areaNull = false
      this.useAreaNull = false
      this.berthSelected = false
      this.isrentClause = true
      this.berthPlan = 'RentClause'
      this.currentlySelected = []
      this.multipleSelectionAll = []
      if (this.queryObj.projectObj) {
        let projectId = this.queryObj.projectObj
        let chooseObj = this.projectList.filter(ele => {
          return ele.id === projectId
        })
        this.chooseObj = chooseObj[0]
      } else {
        this.chooseObj = this.projectList[0]
      }
      if (this.$refs['addData1']) {
        this.$refs['addData1'].resetFields()
      }
      if (this.$refs['LeaseClauseForm']) {
        this.$refs['LeaseClauseForm'].resetFields()
      }
      if (this.$refs['propertyClauseForm']) {
        this.$refs['propertyClauseForm'].resetFields()
      }
      this.exhibitionArea = ''
      this.exhibitionAreaProp = ''
      this.approvalAgain = false
      this.checkIdList = []
      if (this.chooseObj && this.chooseObj.id && localStorage.STORAGE !== 'true' && localStorage.contractStatus !== 'renewal') {
        this.getRooms(this.chooseObj.id)
      }
      this.houseReadOnly = false
      this.addData = {
        onImportBills: false,
        contractBillTmpDTOS: [],
        tenant: {
          industry: '',
          contact: ''
        },
        rentClauses: [{
          termType: 'RENT',
          offerRecords: [],
          incrementRates: []
        }],
        remarks: [{
          content: ''
        }],
        annexes: [],
        zxStartDate: '',
        zxEndtDate: '',
        zxDeposit: ''
      }
      this.propertyClauseData = {
        carryModeProperty: '',
        billingType: '',
        carryModeRent: '',
        deposit: '',
        price: '',
        month: '',
        dayNumber: '',
        billDivision: 'NO',
        priceUnit: 'M2DAYS',
        termType: 'PROPERTY',
        offerRecords: [],
        incrementRates: [],
        dayType: 'TOP'
      }
      this.LeaseClauseData = {
        billingType: '',
        carryModeRent: '',
        deposit: '',
        month: '',
        dayNumber: '',
        billDivision: 'NO',
        priceUnit: 'M2DAYS',
        termType: 'RENT',
        offerRecords: [],
        incrementRates: [],
        dayType: 'TOP'
      }
      this.rentBillDetails = this.addData.contractBillTmpDTOS
      this.newlystep1 = true
      this.newlystep2 = false
      this.newlystep3 = false
    },
    contractChange () {
      this.addData.zxStartDate = ''
      this.addData.zxEndtDate = '' // 装修保证金
      for (let i = 0; i < this.LeaseClauseData.offerRecords.length; i++) { // 租金优惠
        this.LeaseClauseData.offerRecords[i].yhStartDate = ''
        this.LeaseClauseData.offerRecords[i].yhEndDate = ''
      }
      for (let i = 0; i < this.LeaseClauseData.incrementRates.length; i++) { // 租金递增
        this.LeaseClauseData.incrementRates[i].startDate = ''
        this.LeaseClauseData.incrementRates[i].endDate = ''
      }
    },
    priceUnitChange () {
      for (var i = 0; i < this.LeaseClauseData.incrementRates.length; i++) {
        this.LeaseClauseData.incrementRates[i].priceUnit = this.LeaseClauseData.priceUnit
      }
    },
    changeAreaType () {
      if (this.LeaseClauseData.areaTypeRent === 'BUILDING') {
        this.exhibitionArea = this.addData.area
      } else if (this.LeaseClauseData.areaTypeRent === 'USING') {
        this.exhibitionArea = this.addData.useArea
      }
    },
    changeAreaTypeProp () {
      if (this.propertyClauseData.areaTypeProperty === 'BUILDING') {
        this.exhibitionAreaProp = this.addData.area
      } else if (this.propertyClauseData.areaTypeProperty === 'USING') {
        this.exhibitionAreaProp = this.addData.useArea
      }
    },
    getRoomsNumber () { // 房源选择数量回显
      let roomsNumber = this.addData.roomsNumber
      let pRList = this.building.projectRoomsSecondDTOList
      for (let i = 0; i < pRList.length; i++) {
        for (const key in roomsNumber) {
          if (roomsNumber.hasOwnProperty(key)) {
            const element = roomsNumber[key]
            if (pRList[i].buildingId === Number(key)) {
              pRList[i].selectLength = element
            }
          }
        }
      }
    },
    handleChange (index) { // 展开楼层初始化
      if (index !== '' && this.building.projectRoomsSecondDTOList[index].floorDTOS) {
        this.selectionIndex = index
        let lengthIndex = this.building.projectRoomsSecondDTOList[index].floorDTOS.length - 1
        this.selectionFloor = this.building.projectRoomsSecondDTOList[index].floorDTOS[lengthIndex].id
        this.RoomsDTOS = this.building.projectRoomsSecondDTOList[index].floorDTOS[lengthIndex].roomsDTOS
        this.roomsDTOSIndex = lengthIndex
        this.toggleSelection(this.multipleSelectionAll)
      } else {
        this.multipleSelection = []
      }
    },
    changeTab (item, index) {
      this.berthPlan = item.value
      if (this.berthPlan === 'RentClause') {
        this.isrentClause = true
      } else {
        this.isrentClause = false
      }
    },
    delTab (index) {
      this.options4.splice(index, 1)
      if (index === 0) {
        this.berthPlan = 'PropertyFeeClause'
        this.isrentClause = false
      } else {
        this.berthPlan = 'RentClause'
        this.isrentClause = true
      }
    },
    addTal (index) {
      if (index === 0) {
        this.options4.unshift({ label: '租金条款', value: 'RentClause', id: 1 })
      } else {
        this.options4.push({ label: '物业费条款', value: 'PropertyFeeClause', id: 2 })
      }
      this.$forceUpdate()
    },
    handleDelete (index, row) { // 删除已选中房源 计算相应选中房源数量
      this.multipleSelectionAll.splice(index, 1)
      let building = this.building.projectRoomsSecondDTOList.filter(ele => {
        return ele.buildingId === row.building.id
      })
      let buildingIndex = this.building.projectRoomsSecondDTOList.indexOf(building[0])
      this.building.projectRoomsSecondDTOList[buildingIndex].selectLength -= 1
      let floor = this.building.projectRoomsSecondDTOList[buildingIndex].floorDTOS.filter(ele => {
        return ele.id === row.floor.id
      })
      let floorIndex = this.building.projectRoomsSecondDTOList[buildingIndex].floorDTOS.indexOf(floor[0])
      this.building.projectRoomsSecondDTOList[buildingIndex].floorDTOS[floorIndex].selectLength -= 1
      this.toggleSelection(this.multipleSelectionAll)
      this.getArea()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    openDetails (selection, row) {
      this.building.projectRoomsSecondDTOList[this.selectionIndex].floorDTOS[this.roomsDTOSIndex].selectLength = selection.length
      let multipleSelectionAll = this.multipleSelectionAll
      if (event.target.checked) {
        multipleSelectionAll.push(row)
      } else {
        multipleSelectionAll.forEach(function (item, index, arr) {
          if (item.id === row.id) {
            arr.splice(index, 1)
          }
        })
      }
      this.multipleSelectionAll = multipleSelectionAll
      this.getArea()
      this.getselectNum()
    },
    getselectNum () {
      let selectLength = 0
      let selectionIndex = this.selectionIndex ? this.selectionIndex : 0
      if (this.building.projectRoomsSecondDTOList[selectionIndex].floorDTOS) {
        this.building.projectRoomsSecondDTOList[selectionIndex].floorDTOS.forEach(ele => {
          if (ele.selectLength) {
            selectLength += ele.selectLength
          }
        })
      }
      this.building.projectRoomsSecondDTOList[selectionIndex].selectLength = selectLength
    },
    selectAll (selection) {
      this.building.projectRoomsSecondDTOList[this.selectionIndex].floorDTOS[this.roomsDTOSIndex].selectLength = selection.length
      this.getselectNum()
      let currentlySelected = this.currentlySelected
      let multipleSelectionAllss = this.multipleSelectionAll
      if (selection.length > 0) {
        let multipleSelectionAll = [...this.multipleSelectionAll, ...this.RoomsDTOS]
        let multipleSelectionAll2 = [...new Set(multipleSelectionAll)]
        this.multipleSelectionAll = multipleSelectionAll2
        currentlySelected = this.multipleSelection
        // currentlySelected = selection
      } else {
        this.multipleSelectionAll = this.array_diff(multipleSelectionAllss, currentlySelected)
      }
      this.currentlySelected = currentlySelected
      this.getArea()
    },
    array_diff (a, b) {
      for (var i = 0; i < b.length; i++) {
        for (var j = 0; j < a.length; j++) {
          if (a[j].id === b[i].id) {
            a.splice(j, 1)
            j = j - 1
          }
        }
      }
      return a
    },
    getArea () {
      this.useAreaNull = false
      let buildingArea = 0
      let useArea = 0
      this.multipleSelectionAll.forEach(ele => {
        buildingArea += Number(ele.buildingArea)
        useArea += Number(ele.useArea)
        if (!ele.useArea) {
          this.useAreaNull = true
        }
      })
      if (buildingArea !== 0) {
        this.areaNull = false
      } else {
        this.areaNull = true
      }
      this.$set(this.addData, 'area', buildingArea.toFixed(2))
      this.$set(this.addData, 'useArea', useArea.toFixed(2))
      this.$forceUpdate()
    },
    getRenewal () {
      context.http.get('/cms/api/rent-clauses/renewal?contractId=' + this.detailData.id).then(res => {
        if (res.status === 200) {
          this.detailData.rentClauses = res.data
          this.LeaseClauseData = this.detailData.rentClauses[0]
          if (this.detailData.rentClauses.length > 1) {
            this.propertyClauseData = this.detailData.rentClauses[1]
          }
        }
      })
    },
    getBillDetailsCheck (obj, obj2) {
      if (!this.generatedRentDetails || !this.showPropertyClause) {
        return
      }
      if (this.options4.length === 1 && this.options4[0].value === 'RentClause') {
        this.$refs['LeaseClauseForm'].validate((valid) => {
          if (valid) {
            if (!this.icVerification()) {
              return
            }
            obj.fn()
          } else {
            return false
          }
        })
      } else if (this.options4.length === 1 && this.options4[0].value === 'PropertyFeeClause') {
        this.$refs['propertyClauseForm'].validate((valid) => {
          if (valid) {
            if (!this.icVerification()) {
              return
            }
            obj2 ? obj2.fn('OnlyPropertyTerms') : obj.fn()
          } else {
            this.isrentClause = false
            this.berthPlan = 'PropertyFeeClause'
            return false
          }
        })
      } else {
        this.$refs['LeaseClauseForm'].validate((valid) => {
          if (valid) {
            this.$refs['propertyClauseForm'].validate((valid) => {
              if (valid) {
                if (!this.icVerification()) {
                  return
                }
                obj2 ? obj2.fn() : obj.fn()
              } else {
                this.isrentClause = false
                this.berthPlan = 'PropertyFeeClause'
                return false
              }
            })
          } else {
            this.isrentClause = true
            this.berthPlan = 'RentClause'
            return false
          }
        })
      }
    },
    downLoadModelFormat () {
      let url = '/cms/api/contracts/reportBills'
      if (this.options4.length > 1) {
        this.addData.rentClauses[1] = this.propertyClauseData
      }
      this.addData.rentClauses[0] = this.LeaseClauseData
      this.addData.areaTypeRent = this.LeaseClauseData.areaTypeRent
      this.addData.carryModeRent = this.LeaseClauseData.carryModeRent
      this.addData.areaTypeProperty = this.propertyClauseData.areaTypeProperty
      this.addData.carryModeProperty = this.propertyClauseData.carryModeProperty
      let postData = JSON.parse(JSON.stringify(this.addData))
      if (this.options4.length === 1 && this.options4[0].value === 'RentClause') {
        postData.rentClauses.splice(1, 1)
        postData.areaTypeProperty = null
        postData.carryModeProperty = null
      } else if (this.options4.length === 1 && this.options4[0].value === 'PropertyFeeClause') {
        postData.rentClauses.splice(0, 1)
        postData.carryModeRent = null
        postData.areaTypeRent = null
      }
      axios({ method: 'POST', url: url, responseType: 'blob', data: postData }).then(res => {
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
    downLoadModel () {
      let obj = { fn: this.downLoadModelFormat }
      this.getBillDetailsCheck(obj)
    },
    importModel (event) {
      let files = event.target.files
      let form = new FormData()
      let addDataId = this.addData.id ? this.addData.id : ''
      form.append('file', files[0])
      form.append('tanentId', this.addData.tenant.id)
      form.append('rentalMethod', this.addData.rentalMethod)
      form.append('contractId', addDataId)
      let name = files[0].name
      let index = name.lastIndexOf('.')
      let type = name.substr(index + 1).toLowerCase()
      if (files[0].size > (1024 * 1024 * 20)) {
        this.$message({
          message: '文件大小不能超过20M',
          type: 'error'
        })
        return
      }
      if (index > 0 && type !== 'xlsx' && type !== 'xls') {
        this.$message({
          message: '格式错误，请上传xlsx、xls格式文件',
          type: 'error'
        })
      } else {
        context.http.post('/cms/api/contracts/billsFile', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          if (res.status === 200) {
            this.$message({
              showClose: true,
              message: '账单数据导入成功',
              type: 'success'
            })
            event.target.value = ''
            this.addData.onImportBills = true
            this.rentBillDetails = res.data
          }
        }).catch(error => {
          event.target.value = ''
          console.info(error)
        })
      }
    },
    setAnnex (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.addData.annexes.push({
        'annexName': annexName,
        'annexURL': annexURL
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
    imageChange (state, event) {
      if (state === 'addapp') {
        let files = event.target.files
        let form = new FormData()
        form.append('file', files[0])
        let name = files[0].name
        let annexes = this.addData.annexes
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
          this.$set(this.addData, 'annexName', name)
          this.$set(this.addData, 'annexURL', res.data)
          this.addData.annexes.push({
            'annexName': name,
            'annexURL': res.data
          })
        }).catch(error => {
          console.info(error)
        })
        // this.addData.annexes = this.annexesList
        // this.$forceUpdate()
      }
    },
    changeStart (index) {
      if (this.LeaseClauseData.incrementRates[index].endDate < this.LeaseClauseData.incrementRates[index].startDate) {
        this.$message.error('结束时间不能小于开始时间')
        this.LeaseClauseData.incrementRates[index].endDate = ''
      }
      if (this.LeaseClauseData.incrementRates[index].endDate > this.addData.endDate || this.LeaseClauseData.incrementRates[index].endDate < this.addData.startDate) {
        this.$message.error('时间必须在合同时间范围内')
        this.LeaseClauseData.incrementRates[index].endDate = ''
      }
    },
    changeEnd (index) {
      if (index > 0) {
        if (this.LeaseClauseData.incrementRates[index].startDate < this.LeaseClauseData.incrementRates[index - 1].endDate) {
          this.$message.error('开始时间不能大于上个阶段结束时间')
          this.LeaseClauseData.incrementRates[index].startDate = ''
        }
      }
      if (this.LeaseClauseData.incrementRates[index].startDate < this.addData.startDate || this.LeaseClauseData.incrementRates[index].startDate > this.addData.endDate) {
        this.$message.error('时间必须在合同时间范围内')
        this.LeaseClauseData.incrementRates[index].startDate = ''
      }
    },
    yhChangeStart (index) {
      if (this.LeaseClauseData.offerRecords[index].yhEndDate < this.LeaseClauseData.offerRecords[index].yhStartDate) {
        this.$message.error('结束时间不能小于开始时间')
        this.LeaseClauseData.offerRecords[index].yhEndDate = ''
      }
      if (this.LeaseClauseData.offerRecords[index].yhEndDate > this.addData.endDate || this.LeaseClauseData.offerRecords[index].yhEndDate < this.addData.startDate) {
        this.$message.error('时间必须在合同时间范围内')
        this.LeaseClauseData.offerRecords[index].yhEndDate = ''
      }
    },
    yhChangeEnd (index) {
      if (index > 0) {
        if (this.LeaseClauseData.offerRecords[index].yhStartDate < this.LeaseClauseData.offerRecords[index - 1].yhEndDate) {
          this.$message.error('开始时间不能大于上个阶段开结束时间')
          this.LeaseClauseData.offerRecords[index].yhStartDate = ''
        }
      }
      if (this.LeaseClauseData.offerRecords[index].yhStartDate < this.addData.startDate || this.LeaseClauseData.offerRecords[index].yhStartDate > this.addData.endDate) {
        this.$message.error('时间必须在合同时间范围内')
        this.LeaseClauseData.offerRecords[index].yhStartDate = ''
      }
    },
    wyChangeStart (index) {
      if (this.propertyClauseData.incrementRates[index].endDate < this.propertyClauseData.incrementRates[index].startDate) {
        this.$message.error('结束时间不能小于开始时间')
        this.propertyClauseData.incrementRates[index].endDate = ''
      }
      if (this.propertyClauseData.incrementRates[index].endDate > this.addData.endDate || this.propertyClauseData.incrementRates[index].endDate < this.addData.startDate) {
        this.$message.error('时间必须在合同时间范围内')
        this.propertyClauseData.incrementRates[index].endDate = ''
      }
    },
    wyChangeEnd (index) {
      if (index > 0) {
        if (this.propertyClauseData.incrementRates[index].startDate < this.propertyClauseData.incrementRates[index - 1].yhEndDate) {
          this.$message.error('开始时间不能大于上个阶段开结束时间')
          this.propertyClauseData.incrementRates[index].startDate = ''
        }
      }
      if (this.propertyClauseData.incrementRates[index].startDate < this.addData.startDate || this.propertyClauseData.incrementRates[index].startDate > this.addData.endDate) {
        this.$message.error('时间必须在合同时间范围内')
        this.propertyClauseData.incrementRates[index].startDate = ''
      }
    },
    wyyhChangeStart (index) {
      if (this.propertyClauseData.offerRecords[index].yhEndDate < this.propertyClauseData.offerRecords[index].yhStartDate) {
        this.$message.error('结束时间不能小于开始时间')
        this.propertyClauseData.offerRecords[index].yhEndDate = ''
      }
      if (this.propertyClauseData.offerRecords[index].yhEndDate > this.addData.endDate || this.propertyClauseData.offerRecords[index].yhEndDate < this.addData.startDate) {
        this.$message.error('时间必须在合同时间范围内')
        this.propertyClauseData.offerRecords[index].yhEndDate = ''
      }
    },
    wyyhChangeEnd (index) {
      if (index > 0) {
        if (this.propertyClauseData.offerRecords[index].yhStartDate < this.propertyClauseData.offerRecords[index - 1].yhEndDate) {
          this.$message.error('开始时间不能大于上个阶段开结束时间')
          this.propertyClauseData.offerRecords[index].yhStartDate = ''
        }
      }
      if (this.propertyClauseData.offerRecords[index].yhStartDate < this.addData.startDate || this.propertyClauseData.offerRecords[index].yhStartDate > this.addData.endDate) {
        this.$message.error('时间必须在合同时间范围内')
        this.propertyClauseData.offerRecords[index].yhStartDate = ''
      }
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
      this.addData.tenant = {
        referred: '',
        operName: '',
        industry: ''
      }
      this.addData.rooms = []
      this.addData.area = 0
      this.addData.useArea = 0
      this.checkList = []
      this.checkIdList = []
      if (state === 'project') {
        this.selProject = !this.selProject
      } else {
        this.selHourse = !this.selHourse
      }
      this.chooseObj = item
      this.getRooms(item.id)
      this.multipleSelectionAll = []
      this.activeName = 100
    },
    formatCheckboxData () {
      let checkIdList = this.checkIdList
      let roomsList = []
      this.building.projectRoomsSecondDTOList.forEach(ele => {
        ele.floorDTOS.forEach(ele2 => {
          if (ele2.roomsDTOS) {
            ele2.roomsDTOS.forEach(ele3 => {
              roomsList.push(ele3)
            })
          }
        })
      })
      let newArr = []
      for (let i = 0; i < roomsList.length; i++) {
        for (let j = 0; j < checkIdList.length; j++) {
          if (checkIdList[j] === roomsList[i].id) {
            newArr.push(roomsList[i])
          }
        }
      }
      this.checkList = newArr
    },
    async newlystepNoe (formName) {
      if (this.newlystep1) {
        this.rentBillDetails = this.addData.contractBillTmpDTOS
        let _this = this
        const contractNoRepeat = await _this.queryContractNo()
        this.$refs['addData1'].validate((valid) => {
          if (valid) {
            if (_this.addData.area === 0 || !_this.addData.area || _this.multipleSelectionAll.length === 0) {
              // _this.$message.error('请选择房源')
              _this.areaNull = true
              return false
            }
            if (this.contractNumber === this.addData.contractNo) { // 判断合同编号是否改变
              _this.$message.error('请输入合同编号')
              return false
            }
            if (!_this.addData.tenant.teantName) {
              _this.$message.error('请选择客户')
              return false
            }
            // this.formatCheckboxData()
            _this.LeaseClauseData.startDate = _this.addData.startDate
            _this.LeaseClauseData.endDate = _this.addData.endDate
            _this.propertyClauseData.startDate = _this.addData.startDate
            _this.propertyClauseData.endDate = _this.addData.endDate
            if (contractNoRepeat) {
              this.centerDialogVisible = true
            } else {
              _this.newlystep1 = false
              _this.newlystep2 = true
              if (_this.LeaseClauseData.areaTypeRent) {
                _this.changeAreaType()
              }
              if (_this.propertyClauseData.areaTypeProperty) {
                _this.changeAreaTypeProp()
              }
            }
          } else {
            return false
          }
        })
      } else if (this.newlystep2) {
        if (!this.generatedRentDetails || !this.showPropertyClause) {
          return
        }
        if (this.options4.length === 1 && this.options4[0].value === 'RentClause') {
          this.$refs['LeaseClauseForm'].validate((valid) => {
            if (valid) {
              this.newlystep1 = false
              this.newlystep2 = false
              this.newlystep3 = true
            } else {
              return false
            }
          })
        } else if (this.options4.length === 1 && this.options4[0].value === 'PropertyFeeClause') {
          this.$refs['propertyClauseForm'].validate((valid) => {
            if (valid) {
              this.newlystep1 = false
              this.newlystep2 = false
              this.newlystep3 = true
            } else {
              this.isrentClause = false
              this.berthPlan = 'PropertyFeeClause'
              return false
            }
          })
        } else {
          this.$refs['LeaseClauseForm'].validate((valid) => {
            if (valid) {
              this.$refs['propertyClauseForm'].validate((valid) => {
                if (valid) {
                  this.newlystep1 = false
                  this.newlystep2 = false
                  this.newlystep3 = true
                } else {
                  this.isrentClause = false
                  this.berthPlan = 'PropertyFeeClause'
                  return false
                }
              })
            } else {
              this.isrentClause = true
              this.berthPlan = 'RentClause'
              // this.$message({
              //   message: '请输入租金条款必填项',
              //   type: 'warning'
              // })
              return false
            }
          })
        }
        this.formatKeywords(this.addData.billNoticeTemplateId, this.addData.billNoticeTemplateName) // 合同模版重显
      }
      // this.addData.rooms = this.checkList
      this.addData.rooms = this.multipleSelectionAll
    },
    determine () {
      this.centerDialogVisible = false
      this.newlystep1 = false
      this.newlystep2 = true
      if (this.LeaseClauseData.areaTypeRent) {
        this.changeAreaType()
      }
      if (this.propertyClauseData.areaTypeProperty) {
        this.changeAreaTypeProp()
      }
    },
    handleChecked (val) {
      this.formatCheckboxData()
      let buildingArea = 0
      this.checkList.forEach(ele => {
        buildingArea += Number(ele.buildingArea)
      })
      this.areaNull = false
      this.$set(this.addData, 'area', buildingArea.toFixed(2))
      this.$forceUpdate()
    },
    rentIncrementsAdd () {
      // this.addData.rentClauses[0].incrementRates.push({'startDate': '', 'endDate': '', 'number': '', 'incrementUnit': ''})
      this.LeaseClauseData.incrementRates.push({
        termType: 'RENT',
        'startDate': '',
        'endDate': '',
        'point': '',
        'number': '',
        'incrementUnit': 'P'
      })
    },
    rentIncrementsReduce () {
      this.LeaseClauseData.incrementRates.pop()
    },
    rentIncrementsDel () {
      this.rentIncrements = false
      this.LeaseClauseData.incrementRates = [{
        termType: 'RENT',
        'startDate': '',
        'endDate': '',
        'number': '',
        'incrementUnit': 'P'
      }]
    },
    rentConcessionsAdd () {
      this.LeaseClauseData.offerRecords.push({
        termType: 'RENT',
        'yhStartDate': '',
        'yhEndDate': '',
        'offerType': ''
      })
    },
    rentConcessionsReduce () {
      this.LeaseClauseData.offerRecords.pop()
    },
    rentConcessionsDel () {
      this.rentConcessions = false
      this.LeaseClauseData.offerRecords = [{
        termType: 'RENT',
        'yhStartDate': '',
        'yhEndDate': '',
        'offerType': ''
      }]
    },
    propertyFeeAdd () {
      this.propertyClauseData.incrementRates.push({
        termType: 'PROPERTY',
        'startDate': '',
        'endDate': '',
        'number': '',
        'incrementUnit': 'P'
      })
    },
    propertyFeeReduce () {
      this.propertyClauseData.incrementRates.pop()
    },
    propertyFeeDel () {
      this.increasingProperty = false
      this.propertyClauseData.incrementRates = [{
        termType: 'PROPERTY',
        'startDate': '',
        'endDate': '',
        'number': '',
        'incrementUnit': 'P'
      }]
    },
    preferentialPropertyAdd () {
      this.propertyClauseData.offerRecords.push({
        termType: 'PROPERTY',
        'yhStartDate': '',
        'yhEndDate': '',
        'offerType': ''
      })
    },
    preferentialPropertyReduce () {
      this.propertyClauseData.offerRecords.pop()
    },
    preferentialPropertyDel () {
      this.propertyFee = false
      this.propertyClauseData.offerRecords = [{
        termType: 'PROPERTY',
        'yhStartDate': '',
        'yhEndDate': '',
        'offerType': ''
      }]
    },
    decorationBondDel () {
      this.addData.zxStartDate = ''
      this.addData.zxEndtDate = ''
      this.addData.zxDeposit = ''
    },
    previousStep () {
      if (this.newlystep2) {
        this.newlystep1 = true
        this.newlystep2 = false
        this.newlystep3 = false
      } else if (this.newlystep3) {
        this.newlystep1 = false
        this.newlystep2 = true
        this.newlystep3 = false
      }
    },
    deleFile (item, index) {
      this.addData.annexes.splice(index, 1)
    },
    deleFile2 () {
      this.addData.annexName = null
      this.addData.annexURL = null
    },
    searchBerth (floorDTOS) {
      let roomsDTOS = []
      let berthInputVal = this.berthInput
      let floor = floorDTOS.filter(item => {
        return item.id === this.selectionFloor
      })
      if (berthInputVal === '') {
        this.RoomsDTOS = floor[0].roomsDTOS
        this.toggleSelection(this.multipleSelectionAll)
        return
      }
      floor[0].roomsDTOS.forEach(ele => {
        if (ele.shopNumber.indexOf(berthInputVal) >= 0) {
          roomsDTOS.push(ele)
        }
      })
      this.RoomsDTOS = roomsDTOS
      this.toggleSelection(this.multipleSelectionAll)
    },
    selectFloor (floorDTOS) {
      let floor = floorDTOS.filter(item => {
        return item.id === this.selectionFloor
      })
      let roomsDTOSIndex = floorDTOS.indexOf(floor[0])
      this.roomsDTOSIndex = roomsDTOSIndex
      this.RoomsDTOS = floor[0].roomsDTOS
      this.getselectNum()
      let multipleSelection = this.multipleSelection
      let buildingArea = 0
      let useArea = 0
      this.multipleSelectionAll.forEach(ele => {
        buildingArea += Number(ele.buildingArea)
        useArea += Number(ele.useArea)
      })
      this.$set(this.addData, 'area', buildingArea.toFixed(2))
      this.$set(this.addData, 'useArea', useArea.toFixed(2))
      this.multipleSelection = []
      this.toggleSelection(this.multipleSelectionAll)
      this.$forceUpdate()
    },
    toggleSelection (rows) { // 选中之前已选记录
      let index = this.selectionIndex ? this.selectionIndex : 0
      let currentlySelected = []
      if (rows.length > 0) {
        this.$refs.multipleTable[index].clearSelection()
        if (this.RoomsDTOS) {
          let RoomsDTOS = [...this.RoomsDTOS]
          let rowsRes = this.obj_diff(RoomsDTOS, rows)
          rowsRes.forEach(row => {
            this.$nextTick(() => {
              currentlySelected.push(row)
              this.$refs.multipleTable[index].toggleRowSelection(row, true)
            })
          })
        }
        this.currentlySelected = currentlySelected
      } else {
        this.$refs.multipleTable[index].clearSelection()
      }
    },
    obj_diff (a, b) {
      let c = []
      for (var i = 0; i < b.length; i++) {
        for (var j = 0; j < a.length; j++) {
          if (a[j].id === b[i].id) {
            c.push(a[j])
            a.splice(j, 1)
            j = j - 1
          }
        }
      }
      return c
    },
    getRooms (id, type) {
      let contractId = ''
      if (this.detailData.id || this.addData.id) {
        contractId = this.detailData.id ? this.detailData.id : this.addData.id
      }
      context.http.get('/cms/api/tenant/projectManagement/unbinding/' + id + '?contractId=' + contractId).then(res => {
        this.tenantNameeOptions = res.data
        if (this.queryObj.tenantId && this.tenantNameeOptions.length > 0) {
          let tenant = this.tenantNameeOptions.filter(ele => {
            return ele.id === this.queryObj.tenantId
          })
          this.addData.tenant = tenant[0] ? tenant[0] : {}
        }
        // let tenant = this.detailData.tenant
        // if (localStorage.getItem('STORAGE') === 'true') {
        //   if (tenant && tenant.id) {
        //     this.tenantNameeOptions = res.data
        //     this.tenantNameeOptions.push(tenant)
        //   }
        // } else {
        //   this.tenantNameeOptions = res.data
        // }
      })
      context.http.get('/cms/api/rooms/projectManagement/new?investmentStatus=OK,FICTITIOUS&projectManagementId=' + id).then(res => {
        if (res.status === 200) {
          this.building = res.data
          this.getRoomsNumber()
          // this.selectionFloor = res.data.projectRoomsSecondDTOList[0].floorDTOS[0].id
          // this.RoomsDTOS = res.data.projectRoomsSecondDTOList[0].floorDTOS[0].roomsDTOS
          if (type === 'prefixReject') {
            this.$set(this.addData, 'contractNo', this.detailDataReject.contractNo)
            this.$set(this.addData, 'proportion', this.detailDataReject.proportion)
            return
          }
          if (type !== 'prefix') {
            this.contractNumber = res.data.noPrefix // 判断合同编号是否改变
            this.$set(this.addData, 'contractNo', res.data.noPrefix)
            this.$set(this.addData, 'proportion', res.data.proportion)
            this.$set(this.LeaseClauseData, 'onBillContainFirstOfferReocrd', res.data.onBillContainFirstOfferReocrd)
            this.$set(this.LeaseClauseData, 'billingType', res.data.billingType)
            this.$set(this.LeaseClauseData, 'yearDay', res.data.yearDay)
            this.$set(this.LeaseClauseData, 'dayNumber', res.data.dayNumber)
            this.$set(this.LeaseClauseData, 'lateFeeRate', res.data.proportion)
            this.$set(this.propertyClauseData, 'billingType', res.data.billingType)
            this.$set(this.propertyClauseData, 'yearDay', res.data.yearDay)
            this.$set(this.propertyClauseData, 'dayNumber', res.data.dayNumber)
            this.$set(this.propertyClauseData, 'lateFeeRate', res.data.proportion)
            this.$set(this.propertyClauseData, 'onRentBill', true)
          } else {
            this.$set(this.addData, 'contractNo', this.detailData.contractNo)
            this.$set(this.addData, 'proportion', this.detailData.proportion)
          }
        }
      })
    },
    closeAddDialog () {
      this.$emit('addDialogClose')
      localStorage.contractStatus = ''
    },
    icVerification () {
      let result = true
      if (((this.options4.length === 1 && this.options4[0].value === 'RentClause') || (this.options4.length === 2 && this.options4[0].value === 'RentClause')) &&
        this.LeaseClauseData.incrementRates.length > 0 && this.rentIncrements) {
        let incrementRates1 = this.LeaseClauseData.incrementRates
        let incrementRatesLength = this.LeaseClauseData.incrementRates.length
        for (let i = 0; i < incrementRatesLength; i++) {
          if (!incrementRates1[i].startDate || !incrementRates1[i].endDate ||
            (this.addData.rentalMethod === 'RENT' && (incrementRates1[i].number === '' || incrementRates1[i].numbe === null)) ||
            (this.addData.rentalMethod === 'POINTS' && (incrementRates1[i].point === '' || incrementRates1[i].point === null)) ||
            (this.addData.rentalMethod === 'GUARANTEEPOINT' &&
              (incrementRates1[i].number === '' || incrementRates1[i].number === null || !incrementRates1[i].point))) {
            this.$message.error('递增信息请输入完整')
            result = false
          }
        }
      } else {
        this.LeaseClauseData.incrementRates = []
      }
      if (((this.options4.length === 1 && this.options4[0].value === 'RentClause') || (this.options4.length === 2 && this.options4[0].value === 'RentClause')) &&
        this.LeaseClauseData.offerRecords.length > 0 && this.rentConcessions) {
        let incrementRates3 = this.LeaseClauseData.offerRecords
        let incrementRatesLength = this.LeaseClauseData.offerRecords.length
        for (let i = 0; i < incrementRatesLength; i++) {
          if (!incrementRates3[i].offerType || !incrementRates3[i].yhStartDate || !incrementRates3[i].yhEndDate) {
            this.$message.error('递增信息请输入完整')
            result = false
          }
        }
      } else {
        this.LeaseClauseData.offerRecords = []
      }
      if (((this.options4.length === 1 && this.options4[0].value === 'PropertyFeeClause') || (this.options4.length === 2 && this.options4[1].value === 'PropertyFeeClause')) &&
        this.propertyClauseData.incrementRates.length > 0 && this.propertyClauseData.incrementRates[0].endDate !== '' && this.increasingProperty) {
        // if (this.propertyClauseData.incrementRates.length > 0 && this.increasingProperty && !this.isrentClause) { //合同续签、新增时 在‘租金条款’tab 生成账单后   物业费条款tab 物业费递增 会被清空  故备注此判断
        let incrementRates2 = this.propertyClauseData.incrementRates
        let incrementRatesLength = this.propertyClauseData.incrementRates.length
        for (let i = 0; i < incrementRatesLength; i++) {
          if (!incrementRates2[i].startDate || !incrementRates2[i].endDate || incrementRates2[i].number === '' ||
            incrementRates2[i].number === null) {
            this.$message.error('递增信息请输入完整')
            result = false
          }
        }
      } else {
        this.propertyClauseData.incrementRates = []
      }
      if (((this.options4.length === 1 && this.options4[0].value === 'PropertyFeeClause') || (this.options4.length === 2 && this.options4[1].value === 'PropertyFeeClause')) &&
        this.propertyClauseData.offerRecords.length > 0 && this.propertyClauseData.offerRecords[0].yhEndDate !== '' && this.propertyFee) {
        let incrementRates4 = this.propertyClauseData.offerRecords
        let incrementRatesLength = this.propertyClauseData.offerRecords.length
        for (let i = 0; i < incrementRatesLength; i++) {
          if (!incrementRates4[i].offerType || !incrementRates4[i].yhStartDate || !incrementRates4[i].yhEndDate) {
            this.$message.error('递增信息请输入完整')
            result = false
          }
        }
      } else {
        this.propertyClauseData.offerRecords = []
      }
      if (this.LeaseClauseData.areaTypeRent === 'BUILDING' && Number(this.addData.area) === 0) {
        this.$message.error('计租面积为0')
        result = false
      } else if (this.LeaseClauseData.areaTypeRent === 'USING' && Number(this.addData.useArea) === 0) {
        this.$message.error('计租面积为0')
        result = false
      }
      if (this.options4[0].value === 'PropertyFeeClause' && this.propertyClauseData.areaTypeProperty === 'BUILDING' && Number(this.addData.area) === 0 && !this.isrentClause) {
        this.$message.error('计租面积为0')
        result = false
      } else if (this.options4[0].value === 'PropertyFeeClause' && this.propertyClauseData.areaTypeProperty === 'USING' && Number(this.addData.useArea) === 0 && !this.isrentClause) {
        this.$message.error('计租面积为0')
        result = false
      }
      return result
    },
    // 计算方式字段兼容
    fieldCompatibility (postData) {
      if (this.options4.length === 1 && this.options4[0].value === 'RentClause') {
        postData.areaTypeProperty = null
        postData.carryModeProperty = null
      } else if (this.options4.length === 1 && this.options4[0].value === 'PropertyFeeClause') {
        postData.carryModeRent = null
        postData.areaTypeRent = null
      }
    },
    rentHandle () {
      delete this.addData.annexName
      delete this.addData.annexURL
      this.addData.rentClauses[0] = this.LeaseClauseData
      this.addData.areaTypeRent = this.LeaseClauseData.areaTypeRent
      this.addData.carryModeRent = this.LeaseClauseData.carryModeRent
      this.addData.areaTypeProperty = this.propertyClauseData.areaTypeProperty
      this.addData.carryModeProperty = this.propertyClauseData.carryModeProperty
      let postData = JSON.parse(JSON.stringify(this.addData))
      postData.rentClauses.splice(1, 1)
      console.log('postData', postData)
      this.fieldCompatibility(postData)
      context.http.post('/cms/api/bills/business', postData).then(res => {
        if (res.status === 200) {
          this.rentBillDetails = res.data
          this.addData.onImportBills = false
        }
      })
    },
    propertyHandle (type) {
      delete this.addData.annexName
      delete this.addData.annexURL
      this.addData.rentClauses[0] = this.LeaseClauseData
      this.addData.rentClauses[1] = this.propertyClauseData
      this.addData.areaTypeRent = this.LeaseClauseData.areaTypeRent
      this.addData.carryModeRent = this.LeaseClauseData.carryModeRent
      this.addData.areaTypeProperty = this.propertyClauseData.areaTypeProperty
      this.addData.carryModeProperty = this.propertyClauseData.carryModeProperty
      let postData = JSON.parse(JSON.stringify(this.addData))
      // 只有物业条款
      if (type === 'OnlyPropertyTerms') {
        postData.rentClauses.splice(0, 1)
      }
      this.fieldCompatibility(postData)
      context.http.post('/cms/api/bills/business', postData).then(res => {
        if (res.status === 200) {
          this.addData.onImportBills = false
          this.rentBillDetails = res.data
        }
      })
    },
    generatedRentDetails () {
      let obj = { fn: this.rentHandle }
      let obj2 = { fn: this.propertyHandle }
      this.getBillDetailsCheck(obj, obj2)
    },
    // 预览合同
    previewContract (type) {
      if (!this.icVerification()) {
        return
      }
      if (type === 'initiateApproval' && !this.addData.billNoticeTemplateId) {
        this.initiateApproval()
        return
      }
      delete this.addData.annexName
      delete this.addData.annexURL
      this.addData.areaTypeRent = this.LeaseClauseData.areaTypeRent
      this.addData.carryModeRent = this.LeaseClauseData.carryModeRent
      this.addData.areaTypeProperty = this.propertyClauseData.areaTypeProperty
      this.addData.carryModeProperty = this.propertyClauseData.carryModeProperty
      // this.addData.rentClauses[0] = this.LeaseClauseData
      // this.addData.rentClauses[1] = this.propertyClauseData
      // 合同模版
      this.addData.customKeyWordRecordDTOS = [...this.KeyWordRecordImgArr, ...this.KeyWordRecordTextArr]
      let postData = JSON.parse(JSON.stringify(this.addData))
      postData.rentClauses = []
      if (this.options4.length === 1 && this.options4[0].value === 'RentClause') {
        postData.rentClauses[0] = this.LeaseClauseData
        postData.areaTypeProperty = null
        postData.carryModeProperty = null
      } else if (this.options4.length === 1 && this.options4[0].value === 'PropertyFeeClause') {
        postData.rentClauses[0] = this.propertyClauseData
        postData.carryModeRent = null
        postData.areaTypeRent = null
      } else {
        postData.rentClauses[0] = this.LeaseClauseData
        postData.rentClauses[1] = this.propertyClauseData
      }
      context.http.post(`cms/api/produceContract/templates/${this.addData.billNoticeTemplateId}`, postData).then(res => {
        if (res.status === 200) {
          this.queryResult(res.data.id, type)
        }
      })
    },
    temporaryStorage () {
      if (!this.icVerification()) {
        return
      }
      delete this.addData.annexName
      delete this.addData.annexURL
      this.addData.areaTypeRent = this.LeaseClauseData.areaTypeRent
      this.addData.carryModeRent = this.LeaseClauseData.carryModeRent
      this.addData.areaTypeProperty = this.propertyClauseData.areaTypeProperty
      this.addData.carryModeProperty = this.propertyClauseData.carryModeProperty
      // this.addData.rentClauses[0] = this.LeaseClauseData
      // this.addData.rentClauses[1] = this.propertyClauseData
      // 合同模版
      this.addData.customKeyWordRecordDTOS = [...this.KeyWordRecordImgArr, ...this.KeyWordRecordTextArr]
      let postData = JSON.parse(JSON.stringify(this.addData))
      postData.rentClauses = []
      if (this.options4.length === 1 && this.options4[0].value === 'RentClause') {
        postData.rentClauses[0] = this.LeaseClauseData
        postData.areaTypeProperty = null
        postData.carryModeProperty = null
      } else if (this.options4.length === 1 && this.options4[0].value === 'PropertyFeeClause') {
        postData.rentClauses[0] = this.propertyClauseData
        postData.carryModeRent = null
        postData.areaTypeRent = null
      } else {
        postData.rentClauses[0] = this.LeaseClauseData
        postData.rentClauses[1] = this.propertyClauseData
      }
      context.http.post('/cms/api/contracts/temporary', postData).then(res => {
        this.closeAddDialog()
        this.$emit('query')
      })
    },
    initiateApproval () {
      if (!this.icVerification()) {
        return
      }
      delete this.addData.annexName
      delete this.addData.annexURL
      this.addData.areaTypeRent = this.LeaseClauseData.areaTypeRent
      this.addData.carryModeRent = this.LeaseClauseData.carryModeRent
      this.addData.areaTypeProperty = this.propertyClauseData.areaTypeProperty
      this.addData.carryModeProperty = this.propertyClauseData.carryModeProperty
      // this.addData.rentClauses[0] = this.LeaseClauseData
      // this.addData.rentClauses[1] = this.propertyClauseData
      this.addData.customKeyWordRecordDTOS = [...this.KeyWordRecordImgArr, ...this.KeyWordRecordTextArr]
      let postData = JSON.parse(JSON.stringify(this.addData))
      postData.rentClauses = []
      if (this.options4.length === 1 && this.options4[0].value === 'RentClause') {
        postData.rentClauses[0] = this.LeaseClauseData
        postData.areaTypeProperty = null
        postData.carryModeProperty = null
      } else if (this.options4.length === 1 && this.options4[0].value === 'PropertyFeeClause') {
        postData.rentClauses[0] = this.propertyClauseData
        postData.carryModeRent = null
        postData.areaTypeRent = null
      } else {
        postData.rentClauses[0] = this.LeaseClauseData
        postData.rentClauses[1] = this.propertyClauseData
      }
      if (localStorage.contractStatus === 'renewal') {
        postData.remarks.push({
          content: postData.remark
        })
      }
      if (!this.approvalAgain) {
        context.http.post('/cms/api/contracts', postData).then(res => {
          this.closeAddDialog()
          this.$emit('query')
        })
      } else {
        this.addData.taskId = this.taskId
        postData.taskId = this.taskId
        context.http.put('/cms/api/contracts/process', postData).then(res => {
          this.closeAddDialog()
          this.$emit('query')
        })
      }
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
    async queryContractNo () {
      if (!this.addData.contractNo) {
        return false
      }
      let repeatCode = false
      let result = await context.http.get(`/cms/api/contracts/validContractNo?contractNo=${this.addData.contractNo}&contractId=${this.addData.id || ''}`)
      if (result.data) {
        repeatCode = true
      } else {
        repeatCode = false
      }
      return repeatCode
    },
    monthChange (type, month) {
      if (type === 'LeaseClauseData') {
        if (month === 3 || month === '3') {
          this.billDivisionDisabledL = false
        } else {
          this.LeaseClauseData.billDivision = 'NO'
          this.billDivisionDisabledL = true
        }
      }
      if (type === 'propertyClauseData') {
        if (month === 3 || month === '3') {
          this.billDivisionDisabledP = false
        } else {
          this.propertyClauseData.billDivision = 'NO'
          this.billDivisionDisabledP = true
        }
      }
      this.syncHandle()
    },
    syncHandle (type) {
      if (this.LeaseClauseData.onBillContainFirstOfferReocrd === false && this.LeaseClauseData.billDivision === 'NO' &&
        this.propertyClauseData.billDivision === 'NO' && Number(this.LeaseClauseData.month) === Number(this.propertyClauseData.month)) {
        this.onRentBillOptions[1].disabled = false
        if (type) return
        this.propertyClauseData.onRentBill = true
      } else {
        this.onRentBillOptions[1].disabled = true
        if (type) return
        this.propertyClauseData.onRentBill = false
      }
    },
    // 模版
    getBillNoticeTemp () {
      context.http.get(`/cms/api/billNoticeTemp`, {
        keywordBusinessType: 'CONTRACT',
        // sort: 'projectManagement,asc,createdDate,desc',
        billNoticeStatus: 'USING',
        page: 0,
        size: 10000
      }).then(res => {
        if (res.status === 200) {
          this.templateOptions = res.data
        }
      })
    },
    queryResult (id, type) {
      context.http.get(`/cms/api/bill-excel/detail?excelId=${id}`).then(res => {
        if (res.status === 200) {
          const loading = this.$loading({
            lock: true,
            text: '加载中。。。',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.5)'
          })
          if (res.data.excelResult === '审核中') {
            setTimeout(() => {
              this.queryResult(id, type)
            }, 1000)
          } else if (res.data.excelResult === '成功') {
            loading.close()
            if (type === 'preview') {
              this.getUrl(res.data.remark)
            } else {
              // 删除相同附件
              const addDataAnnexes = this.addData.annexes
              if (addDataAnnexes && addDataAnnexes.length > 0) {
                addDataAnnexes.forEach((ele, index) => {
                  if (ele.annexName === '商铺租赁合同.pdf') {
                    addDataAnnexes.splice(index, 1)
                  }
                })
              }
              this.addData.annexes.push({
                'annexName': '商铺租赁合同.pdf',
                'annexURL': res.data.remark
              })
              this.initiateApproval()
            }
          } else if (res.data.excelResult === '成功') {
            loading.close()
            this.$message.error('生成失败')
          }
        }
      })
    },
    getUrl (remark) {
      context.http.get(`/cms/api/file/getUrl?fileName=${remark}`).then(res => {
        if (res.status === 200) {
          window.open(res.data)
        }
      })
    }
  },
  destroyed () {
    localStorage.contractStatus = ''
    localStorage.STORAGE = false
  }
}
</script>
<style lang="scss">
.addContracts {
  .currentlySelected {
    display: inline-block;
    background-color: #cb444a;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    border-radius: 50%;
    color: #fff;
    font-size: 12px;
    position: absolute;
    right: 39px;
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
  .step1 {
    .dc-right {
      width: 100% !important;
      border: 1px solid #e7e7e7;
    }
    .berth {
      width: 97%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      span {
        &:last-child {
          cursor: pointer;
          color: #3175d2;
        }
      }
    }
    .floor-img {
      float: left;
      display: block;
      width: 60px;
      height: 25px;
      margin-right: 20px;
      margin-top: 5px;
    }
    .floor-search {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
      > div {
        width: 45%;
      }
    }
    .contract-info {
      .el-form-item {
        margin-right: 20px !important;
        width: 29% !important;
        &:nth-of-type(odd) {
          margin-right: 20px !important;
        }
      }
    }
    .berth-area {
      .el-form-item {
        width: 280px !important;
      }
    }
  }
  .step2 {
    .typeTab {
      height: 50px;
      line-height: 50px;
      background-color: #ffffff;
      margin-top: 15px;
      box-shadow: 4px 4px 4px 1px #eee;
      > span {
        display: inline-block;
        width: 120px;
        text-align: center;
        cursor: pointer;
        &.active {
          color: #3175d2;
          border-bottom: 2px solid #3175d2;
        }
      }
      .add-clause {
        display: inline-block;
        width: 100px;
        height: 30px;
        line-height: 30px;
        background: #0f75ff;
        border: 1px solid #0f75ff;
        color: #fff;
        border-radius: 4px;
        text-align: center;
        margin: 10px;
        float: right;
      }
    }
    .el-form-item {
      width: 30% !important;
      &:nth-of-type(odd) {
        margin-right: 10px !important;
      }
    }
    .dc-right {
      width: 100% !important;
      border: 1px solid #e7e7e7;
      .other-info {
        width: 98%;
        margin: 0 auto;
        .el-textarea {
          .el-textarea__inner {
            border: none;
          }
        }
      }
    }
    .selected-housing {
      margin-bottom: 20px;
      > span {
        display: inline-block;
        width: 19%;
        padding-left: 40px;
      }
      ul {
        display: flex;
        &:first-child {
          border-bottom: 1px solid #e7e7e7;
        }
        li {
          width: 20%;
          height: 30px;
          line-height: 30px;
          text-align: center;
          overflow: hidden;
          font-size: 12px;
        }
      }
      input {
        border: 1px solid rgba(231, 231, 231, 1);
        border-radius: 4px;
      }
    }
    .generated-btn {
      text-align: center;
      span {
        display: inline-block;
        width: 110px;
        height: 36px;
        line-height: 36px;
        margin-top: 20px;
        text-align: center;
        color: #fff;
        background: rgba(15, 117, 255, 1);
        border-radius: 4px;
        cursor: pointer;
      }
    }
    .morebtn {
      cursor: pointer;
      border: 1px solid #f3af2c;
      color: #f3af2c;
      height: 32px;
      width: 120px;
      line-height: 32px;
      margin-top: 20px;
      .icon-daochu {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url(../../../../assets/daochu1.png) no-repeat;
        background-size: contain;
        vertical-align: text-top;
        margin-right: 4px;
      }
    }
  }
  .step3 {
    .other-info {
      .el-textarea {
        width: 100%;
        margin: 0 auto;
        .el-textarea__inner {
          border: none;
        }
      }
    }
    .otherinfo {
      margin: 15px;
      .text-div {
        display: flex;
        align-items: center;
        margin-top: 20px;
      }
    }
    .contc-template {
      margin-top: 15px;
    }
    .enclosure-warp {
      display: flex;
      align-items: center;
      padding-left: 83px;
      margin-top: 10px;
      /* border-bottom: 1px solid #EBEBEB; */
      > div {
        margin-left: 20px;
      }
    }
  }
  .enclosure {
    margin-bottom: 20px;
    .enclosure-head2 {
      background-color: #fafafa;
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        display: inline-block;
        width: 60%;
        padding-left: 0px;
      }
      .upload {
        position: relative;
        float: right;
        display: inline-block;
        width: 60px;
        height: 24px;
        line-height: 23px;
        opacity: 0.9;
        border-radius: 2px;
        font-size: 12px;
        text-align: center;
        border: 1px solid rgba(15, 117, 255, 1);
        color: rgba(15, 117, 255, 1);
        border-radius: 4px;
        margin: 8px;
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
  .dc-project {
    width: 100%;
    border: 1px solid #e7e7e7;
    margin-top: 20px;
  }
  .dr-head {
    background-color: #fafafa;
    height: 40px;
    line-height: 40px;
    padding-left: 12px;
    font-size: 14px;
    margin-bottom: 24px;
    .iconfont {
      cursor: pointer;
      font-size: 12px;
    }
    .icon-add {
      font-size: 16px;
      color: #0073ff;
      margin-left: 40px;
    }
    .icon-reduce {
      font-size: 16px;
    }
    .right-btn {
      float: right;
      span {
        display: inline-block;
        width: 84px;
        height: 26px;
        line-height: 23px;
        text-align: center;
        color: #0f75ff;
        border: 1px solid rgba(15, 117, 255, 1);
        border-radius: 4px;
        margin-right: 6px;
        font-size: 12px;
        cursor: pointer;
      }
      .icon-cha {
        margin-right: 10px;
      }
    }
  }
  .tenantinfo {
    .el-form-item {
      width: 29% !important;
      margin-right: 20px !important;
    }
    .cttitle + span {
      display: inline-block;
      height: 26px;
      line-height: 40px;
    }
  }
  .buildList {
    width: 95%;
    margin: 10px auto;
    height: 480px;
    overflow-y: scroll;
    li {
      width: 100%;
      p {
        width: 100%;
        display: flex;
        justify-content: space-between;
        background: #fafafa;
        padding: 0 15px;
        span {
          display: block;
          height: 30px;
          line-height: 30px;
        }
      }
      dl {
        width: 100%;
        padding: 0 15px;
        dd {
          width: 100%;
          border-bottom: 1px solid #e7e7e7;
          .select {
            width: 100%;
            .el-checkbox {
              width: 100%;
              margin: 0;
              display: flex;
              // height: 30px;
              padding-top: 10px;
              .el-checkbox__input {
                margin-top: 4px;
              }
              .el-checkbox__label {
                span {
                  width: 66px;
                  height: auto;
                  display: inline-block;
                  text-align: center;
                  vertical-align: top;
                  white-space: normal;
                }
              }
            }
          }
        }
      }
    }
  }
  .enclosure-list {
    .iconfont {
      cursor: pointer;
    }
  }
  .basic-select {
    .layer {
      span {
        display: inline-block;
        width: 32%;
        margin-bottom: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .overflow-style {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .basic-select {
    position: relative;
    cursor: pointer;
    width: 97%;
    margin: 0 auto;
    margin-bottom: 10px;
    .selectInput {
      height: 60px;
      border: 1px solid #e7e7e7;
      border-radius: 5px;
      padding: 0 15px;
      &.selectActive {
        border: 1px solid #6473cb;
      }
      img {
        float: left;
        display: block;
        width: 80px;
        height: 40px;
        margin-right: 20px;
        margin-top: 10px;
      }
      span {
        float: left;
        color: #666666;
        display: block;
        line-height: 60px;
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
      top: 55px;
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
          width: 60px;
          height: 30px;
          margin-right: 20px;
        }
        span {
          display: block;
          line-height: 30px;
          font-size: 14px;
        }
      }
    }
  }
  .preview-button{
    width: 116px;
    color: #3577F6!important;
  }
  .aliDownload{
    display: inline-block;
    margin-right: 20px;
  }
}
.contractNoDialog {
  .el-dialog__footer {
    text-align: center;
    .dialog-footer {
      border: none;
      margin-right: 0;
      span {
        display: inline-block;
        width: 110px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
        &:first-child {
          background-color: #b1b6c4;
          margin-right: 10px;
        }
        &:last-child {
          background: linear-gradient(
            90deg,
            rgba(53, 119, 246, 1),
            rgba(108, 153, 255, 1)
          );
        }
      }
    }
  }
  .el-dialog__header {
    border: none;
  }
  .el-dialog__body {
    border: none;
  }
  .lockDialogContent {
    display: -ms-flexbox;
    display: flex;
    margin: 20px 0 30px 0;
    div {
      margin-left: 15px;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      flex-direction: column;
      justify-content: space-evenly;
      .div1 {
        color: #666666;
        font-size: 20px;
        font-weight: 600;
        width: 100%;
      }
      .div2 {
        color: #999;
      }
    }
  }
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
.berth-infor::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background-color: rgb(25, 38, 70);
}
/*定义滚动条轨道 内阴影+圆角*/
.berth-infor::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px #fff;
  border-radius: 10px;
  background-color: #fff;
}
/*定义滑块 内阴影+圆角*/
.berth-infor::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px #3175d2;
  background-color: 3175d2;
}
.addContracts {
  .el-collapse-item__header {
    border-left: 1px solid #e3e3e3;
    border-right: 1px solid #e3e3e3;
    border-radius: 4px;
    padding: 0 10px;
  }
  .el-collapse-item__wrap {
    border-left: 1px solid #e3e3e3;
    border-right: 1px solid #e3e3e3;
    padding: 0 10px;
  }
  .el-collapse-item {
    margin: 10px 0;
    border-top: 1px solid #e3e3e3;
    border-radius: 4px;
  }
}
</style>
