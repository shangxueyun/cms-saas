/* eslint-disable one-var */
/* eslint-disable one-var */
<template>
  <div class="project-details">
    <drawer :show="addProjectShow"
            :title="drawerTitle"
            :showEditBtn="showEditBtn && hasAuthority('02010103') && tabIndex!==2"
            @on-edit="onEdit"
            @on-hide="onHide">
      <div class="post-details"
           slot="drawer">
        <div class="tab">
          <div class="dl-head info_tab">
            <ul class="nav">
              <li @click="changeNav(index)"
                  v-for="(item, index) in navList"
                  :key="index"
                  :class="item.value ? 'select_active' : ''">{{item.label}}</li>
            </ul>
          </div>
        </div>
        <div class="main-content"
             id="mainContent">
          <div class="add-project"
               v-show="tabIndex===0">
            <div class="dl-content clearfix">
              <el-form :model="projectDetail"
                       ref="fromDetail"
                       :rules="projectDetailRules">
                <div class="dc-right float-right">
                  <div class="dr-head"><span class="vertical"></span>基本信息</div>
                  <el-form-item prop="organizeId">
                    <div class="cttitle">管理企业<i class="required">*</i></div>
                    <span>{{projectDetail.originalProjectName}}</span>
                    <!-- <el-select v-else  v-model="projectDetail.organizeId">
                      <el-option
                        v-for="item in projectNameOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select> -->
                  </el-form-item>

                  <el-form-item prop="projectCode">
                    <div class="cttitle">项目代码</div>
                    <span v-if="readOnly">{{projectDetail.projectCode}}</span>
                    <el-input v-model="projectDetail.projectCode"
                              v-else
                              maxlength="30"
                              placeholder="请输入内容"></el-input>
                  </el-form-item>

                  <el-form-item prop="projectName"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">项目名称<i class="required">*</i></div>
                    <span v-if="readOnly">{{projectDetail.projectName}}</span>
                    <el-input v-model="projectDetail.projectName"
                              v-else
                              maxlength="30"
                              placeholder="请输入内容"></el-input>
                  </el-form-item>

                  <el-form-item prop="outRentName"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">对外招租名称<i class="required">*</i></div>
                    <span v-if="readOnly">{{projectDetail.outRentName}}</span>
                    <el-input v-model="projectDetail.outRentName"
                              v-else
                              maxlength="30"
                              placeholder="请输入内容"></el-input>
                  </el-form-item>

                  <el-form-item prop="investType"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">资产投资方式</div>
                    <span v-if="readOnly">{{formatInvestType(projectDetail.investType)}}</span>
                    <el-select v-else
                               v-model="projectDetail.investType">
                      <el-option v-for="item in investTypeOption"
                                 :key="item.value"
                                 :label="item.name"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item prop="ruralEquityRatio"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">农方股权比例（%）</div>
                    <span v-if="readOnly">{{projectDetail.ruralEquityRatio}}</span>
                    <el-input v-model="projectDetail.ruralEquityRatio"
                              v-else
                              maxlength="30"
                              placeholder="请输入内容"></el-input>
                  </el-form-item>

                  <el-form-item style="margin-bottom: 20px;margin-right: 0">
                    <div class="cttitle">省市区<i class="required">*</i></div>
                    <span v-if="readOnly">{{address}}</span>
                    <el-cascader v-model="areaOptions"
                                 placeholder="请选择省市区"
                                 ref="cascaderAddr"
                                 :key="isResouceShow"
                                 :options="cascaderData"
                                 @active-item-change="handleItemChange"
                                 @change="addHandleItemChange"
                                 :props="{
                                      value: 'id',
                                      label: 'name',
                                      children: 'cities'
                                    }"
                                 v-else></el-cascader>
                  </el-form-item>

                  <el-form-item prop="address">
                    <div class="cttitle">地址<i class="required">*</i></div>
                    <span v-if="readOnly">{{projectDetail.address}}</span>
                    <el-input v-model="projectDetail.address"
                              v-else
                              @blur="dtTypeChange"
                              maxlength="50"
                              placeholder="请输入内容"></el-input>
                  </el-form-item>

                  <div style="margin: 0 0 16px 16px;">
                    <div class="cttitle">地理位置</div>
                    <div class="map"
                         ref="container"
                         v-if="isFromSeach"></div>
                    <div class="map"
                         ref="container"
                         v-else></div>
                  </div>
                </div>

                <div class="dc-right float-right">
                  <div class="dr-head"><span class="vertical"></span>关联信息</div>
                  <div class="clearfix"
                       style="position: relative;">
                    <div class="tab2">
                      <div>
                        <span :class="{'active':tab2Index===1}"
                              class="noborderright"
                              @click="changeTabIndex(1)">产权人</span>
                        <span :class="{'active':tab2Index===2}"
                              class="noborderleft"
                              @click="changeTabIndex(2)">项目建设单位</span>
                        <span :class="{'active':tab2Index===3}"
                              class="noborderleft"
                              @click="changeTabIndex(3)"
                              v-if="hasAuthority('02010107')">项目设计单位</span>
                        <span :class="{'active':tab2Index===4}"
                              class="noborderleft"
                              @click="changeTabIndex(4)"
                              v-if="hasAuthority('02010107')">监理单位</span>
                        <span :class="{'active':tab2Index===5}"
                              class="noborderleft"
                              @click="changeTabIndex(5)"
                              v-if="hasAuthority('02010107')">施工单位</span>
                        <span :class="{'active':tab2Index===6}"
                              class="noborderleft"
                              @click="changeTabIndex(6)">其他</span>
                      </div>
                      <span class="addmore dtAddmore"
                            @click="addRelations(tab2Index)"
                            v-if="(tab2Index === 5 ||  tab2Index === 6) && !readOnly">
                        <i class="iconfont icon-add-new"></i>
                        <span>继续添加</span>
                      </span>
                    </div>
                    <div v-if="tab2Index === 1">
                      <div class="relatedinfor-table">
                        <ul class="table-ul">
                          <li>产权人</li>
                          <li>联系人</li>
                          <li>联系人职务</li>
                          <li>手机号</li>
                          <li>公司固话</li>
                          <li>操作</li>
                        </ul>
                        <ul class="table-ul">
                          <li>{{ projectDetail.propertyOwnerRelation && projectDetail.propertyOwnerRelation.name}}</li>
                          <li>{{projectDetail.propertyOwnerRelation && projectDetail.propertyOwnerRelation.contacts}}</li>
                          <li>{{ projectDetail.propertyOwnerRelation && projectDetail.propertyOwnerRelation.contactsPost}}</li>
                          <li>{{ projectDetail.propertyOwnerRelation && projectDetail.propertyOwnerRelation.telephone}}</li>
                          <li>{{ projectDetail.propertyOwnerRelation && projectDetail.propertyOwnerRelation.fixedTel}}</li>
                          <li class="operating"
                              @click="relationHandler('propertyOwnerRelation', projectDetail.propertyOwnerRelation.id, 1)">查看</li>
                        </ul>
                      </div>
                    </div>
                    <div v-if="tab2Index === 2">
                      <div class="relatedinfor-table">
                        <ul class="table-ul">
                          <li>项目建设单位</li>
                          <li>联系人</li>
                          <li>联系人职务</li>
                          <li>手机号</li>
                          <li>公司固话</li>
                          <li>操作</li>
                        </ul>
                        <ul class="table-ul">
                          <li>{{ projectDetail.bulidUnitRelation && projectDetail.bulidUnitRelation.name}}</li>
                          <li>{{projectDetail.bulidUnitRelation && projectDetail.bulidUnitRelation.contacts}}</li>
                          <li>{{ projectDetail.bulidUnitRelation && projectDetail.bulidUnitRelation.contactsPost}}</li>
                          <li>{{ projectDetail.bulidUnitRelation && projectDetail.bulidUnitRelation.telephone}}</li>
                          <li>{{ projectDetail.bulidUnitRelation && projectDetail.bulidUnitRelation.fixedTel}}</li>
                          <li class="operating"
                              @click="relationHandler('bulidUnitRelation', projectDetail.bulidUnitRelation.id, 2)">查看</li>
                        </ul>
                      </div>
                    </div>
                    <div v-if="tab2Index === 3">
                      <div class="relatedinfor-table">
                        <ul class="table-ul">
                          <li>项目设计单位</li>
                          <li>联系人</li>
                          <li>联系人职务</li>
                          <li>手机号</li>
                          <li>公司固话</li>
                          <li>操作</li>
                        </ul>
                        <ul class="table-ul">
                          <li>{{ projectDetail.designUnitRelation && projectDetail.designUnitRelation.name}}</li>
                          <li>{{projectDetail.designUnitRelation && projectDetail.designUnitRelation.contacts}}</li>
                          <li>{{ projectDetail.designUnitRelation && projectDetail.designUnitRelation.contactsPost}}</li>
                          <li>{{ projectDetail.designUnitRelation && projectDetail.designUnitRelation.telephone}}</li>
                          <li>{{ projectDetail.designUnitRelation && projectDetail.designUnitRelation.fixedTel}}</li>
                          <li class="operating"
                              @click="relationHandler('designUnitRelation', projectDetail.designUnitRelation.id, 3)">查看</li>
                        </ul>
                      </div>
                    </div>
                    <div v-if="tab2Index === 4">
                      <div class="relatedinfor-table">
                        <ul class="table-ul">
                          <li>监理单位</li>
                          <li>联系人</li>
                          <li>联系人职务</li>
                          <li>手机号</li>
                          <li>公司固话</li>
                          <li>操作</li>
                        </ul>
                        <ul class="table-ul">
                          <li>{{ projectDetail.supervisorRelation && projectDetail.supervisorRelation.name}}</li>
                          <li>{{projectDetail.supervisorRelation && projectDetail.supervisorRelation.contacts}}</li>
                          <li>{{ projectDetail.supervisorRelation && projectDetail.supervisorRelation.contactsPost}}</li>
                          <li>{{ projectDetail.supervisorRelation && projectDetail.supervisorRelation.telephone}}</li>
                          <li>{{ projectDetail.supervisorRelation && projectDetail.supervisorRelation.fixedTel}}</li>
                          <li class="operating"
                              @click="relationHandler('supervisorRelation', projectDetail.supervisorRelation.id, 4)">查看</li>
                        </ul>
                      </div>
                    </div>
                    <div v-if="tab2Index === 5">
                      <div class="relatedinfor-table">
                        <ul class="table-ul">
                          <li>施工单位</li>
                          <li>施工内容</li>
                          <li>联系人</li>
                          <li>联系人职务</li>
                          <li>手机号</li>
                          <li>公司固话</li>
                          <li>操作</li>
                        </ul>
                        <ul class="table-ul"
                            v-for="(item, index) in projectDetail.relations"
                            :key="index">
                          <li>{{ item && item.name}}</li>
                          <li>{{item && item.content}}</li>
                          <li>{{item && item.contacts}}</li>
                          <li>{{ item && item.contactsPost}}</li>
                          <li>{{ item && item.telephone}}</li>
                          <li>{{ item && item.fixedTel}}</li>
                          <li class="operating"
                              @click="relationHandler('relations', item.id, 5)">查看</li>
                        </ul>
                      </div>
                    </div>
                    <div v-if="tab2Index === 6">
                      <div class="relatedinfor-table">
                        <ul class="table-ul">
                          <li>单位名称</li>
                          <li>联系人</li>
                          <li>联系电话</li>
                          <li>备注</li>
                          <li>操作</li>
                        </ul>
                        <ul class="table-ul"
                            v-for="(item, index) in projectDetail.otherRelations"
                            :key="index">
                          <li>{{ item && item.name}}</li>
                          <li>{{item && item.contacts}}</li>
                          <li>{{item && item.fixedTel}}</li>
                          <li :title="item.remark">{{ item && item.remark}}</li>
                          <li class="operating"
                              @click="relationHandler('otherRelations', item.id, 6)">查看</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="dc-right float-right"
                     style="margin-bottom: 100px;">
                  <div class="dr-head"><span class="vertical"></span>设置信息</div>
                  <el-form-item prop="previewImage">
                    <div class="cttitle">项目图片<i class="required">*</i></div>
                    <div class="preview-wrap">
                      <div class="preview"
                           @click="showImg(projectDetail.previewImage, 1)">
                        <i class="iconfont icon-cms_cuowu"
                           v-if="!readOnly && projectDetail.previewImage"
                           @click="delPreviewImage()"></i>
                        <img :src="projectDetail.previewImage"
                             v-if="projectDetail.previewImage" />
                        <div class="pw-bottom">
                          <span v-if="!readOnly">更换图片</span>
                          <span v-else>预览图片</span>
                        </div>
                        <input type="file"
                               v-if="!readOnly"
                               @change="imageChange($event)"
                               accept="image/png, image/jpeg">
                        <div v-if="errorField"
                             class="errorTip">{{errorTip}}</div>
                      </div>
                    </div>
                    <p v-if="!readOnly"
                       style="margin-top: 20px;">(最多可上传1张,建议尺寸：160x182像素；支持格式JPG,PNG)</p>
                  </el-form-item>
                  <el-form-item prop="sortNumber">
                    <div class="cttitle">排序<i class="required">*</i></div>
                    <span v-if="readOnly">{{projectDetail.sortNumber}}</span>
                    <el-input v-model="projectDetail.sortNumber"
                              v-else
                              maxlength="10"
                              type="number"
                              placeholder="请输入内容"></el-input>
                  </el-form-item>
                  <el-form-item prop="iDNumber">
                    <div class="cttitle">状态<i class="required">*</i></div>
                    <span v-if="readOnly">{{formaterUseStatus(projectDetail.useStatus)}}</span>
                    <el-select v-model="projectDetail.useStatus"
                               placeholder="请选择"
                               v-else>
                      <el-option v-for="item in useStatusOptions"
                                 :key="item.value"
                                 :label="item.name"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
          <!-- 项目主要经济指标 -->
          <div class="ecoIndicators"
               v-show="tabIndex===1">
            <div class="cycleIndex"
                 v-if="projectDetail.cycle">
              <span :class="{'active':cycleIndex===index}"
                    v-for="(item,index) in projectDetail.projectCycles"
                    @click="cycleIndexChange(index)"
                    :key="index">{{item.cycle}}</span>
            </div>
            <el-form :model="projectDetail"
                     ref="projectDetail">
              <!-- 不分期 -->
              <div v-if="!projectDetail.cycle">
                <div v-for="(item,index) in projectDetail.projectCycles"
                     :key="index">
                  <div class="div_title">
                    <h3>建筑相关</h3>
                  </div>
                  <div class="architecture">
                    <el-form-item>
                      <div class="cttitle">占地面积(㎡)</div>
                      <span v-if="readOnly">{{item.newBuildingArea }}</span>
                      <el-input v-model="item.newBuildingArea "
                                v-else
                                maxlength="30"
                                placeholder="请输入内容"
                                type="number"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <div class="cttitle">总建筑面积(㎡)</div>
                      <span v-if="readOnly">{{item.totalBuildingArea}}</span>
                      <el-input v-model="item.totalBuildingArea"
                                v-else
                                maxlength="30"
                                placeholder="请输入内容"
                                type="number"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <div class="cttitle">地上建筑面积(㎡)</div>
                      <span v-if="readOnly">{{item.upBuildingArea}}</span>
                      <el-input v-model="item.upBuildingArea"
                                v-else
                                maxlength="30"
                                placeholder="请输入内容"
                                type="number"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <div class="cttitle">地下建筑面积(㎡)</div>
                      <span v-if="readOnly">{{item.downBuildingArea}}</span>
                      <el-input v-model="item.downBuildingArea"
                                v-else
                                maxlength="30"
                                placeholder="请输入内容"
                                type="number"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <div class="cttitle">层高(m)</div>
                      <span v-if="readOnly">{{item.floorHeight}}</span>
                      <el-input v-model="item.floorHeight"
                                v-else
                                maxlength="30"
                                placeholder="请输入内容"
                                type="number"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <div class="cttitle">净高(m)</div>
                      <span v-if="readOnly">{{item.clearHeight}}</span>
                      <el-input v-model="item.clearHeight"
                                v-else
                                maxlength="30"
                                placeholder="请输入内容"
                                type="number"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <div class="cttitle">建筑结构</div>
                      <span v-if="readOnly">{{item.buildingStructureDesc}}</span><!-- buildingStructure buildingStructureDesc -->
                      <el-select v-model="item.buildingStructure"
                                placeholder="请选择"
                                size="small"
                                v-else>
                        <el-option v-for="item in buildingStructureOptions"
                                  :key="item.value"
                                  :label="item.name"
                                  :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <div class="cttitle">楼板荷载(kg/m²)</div>
                      <span v-if="readOnly">{{item.floorLoad}}</span>
                      <el-input v-model="item.floorLoad"
                                v-else
                                maxlength="30"
                                placeholder="请输入内容"
                                type="number"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <div class="cttitle">建筑外立面</div>
                      <span v-if="readOnly">{{item.buildingFacadeDesc}}</span><!-- buildingFacadeDesc  -->
                      <el-select v-model="item.buildingFacade"
                                placeholder="请选择"
                                size="small"
                                v-else>
                        <el-option v-for="item in buildingFacadeOptions"
                                  :key="item.value"
                                  :label="item.name"
                                  :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                <div class="segmentation"></div>
                <div class="div_title">
                  <h3>设备相关</h3>
                </div>
                <div class="config">
                  <el-form-item>
                    <div class="cttitle">电梯系统</div>
                    <span v-if="readOnly">{{item.elevatorSystem}}</span>
                    <el-input v-model="item.elevatorSystem"
                              v-else
                              maxlength="30"
                              placeholder="客梯、货梯、扶梯、消防电梯等具体数量"
                              type="text"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <div class="cttitle">空调系统</div>
                    <span v-if="readOnly">{{item.airConSystem}}</span>
                    <el-input v-model="item.airConSystem"
                              v-else
                              maxlength="30"
                              placeholder="制冷量/制冷功率/制热量/制热功率/能效比等"
                              type="text"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <div class="cttitle">新风系统</div>
                    <span v-if="readOnly">{{item.freshAirSystem}}</span>
                    <el-input v-model="item.freshAirSystem"
                              v-else
                              maxlength="30"
                              placeholder="品牌/风量/噪音/交换效率/净化效率等"
                              type="text"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <div class="cttitle">电力</div>
                    <span v-if="readOnly">{{item.power}}</span>
                    <el-input v-model="item.power"
                              v-else
                              maxlength="30"
                              placeholder="单位用电指标/最大负荷"
                              type="text"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <div class="cttitle">消防系统</div>
                    <span v-if="readOnly">{{item.fireFightingSystemDesc}}</span><!-- fireFightingSystemDesc   -->
                    <el-select v-model="item.fireFightingSystem"
                              placeholder="请选择"
                              size="small"
                              v-else
                              multiple
                              collapse-tags
                              clearable>
                      <el-option v-for="item in fireFightingSystemOptions"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <div class="cttitle">供水系统</div>
                    <span v-if="readOnly">{{item.waterSupplySystemDesc}}</span><!-- waterSupplySystemDesc    -->
                    <el-select v-model="item.waterSupplySystem"
                              placeholder="请选择"
                              size="small"
                              v-else
                              multiple
                              collapse-tags
                              clearable>
                      <el-option v-for="item in waterSupplySystemOptions"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <div class="cttitle">燃气系统</div>
                    <span v-if="readOnly">{{item.gasSystem}}</span>
                    <el-input v-model="item.gasSystem"
                              v-else
                              maxlength="30"
                              placeholder="天然气小时流量/额定压力/是否带自动熄火装置等"
                              type="text"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <div class="cttitle">雨污水系统</div>
                    <span v-if="readOnly">{{item.rainwaterSewageSystem}}</span>
                    <el-input v-model="item.rainwaterSewageSystem"
                              v-else
                              maxlength="30"
                              placeholder="品牌/设计负荷（过水能力）"
                              type="text"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <div class="cttitle">绿色环保</div>
                    <span v-if="readOnly">{{item.greenEnvironmentProtectionDesc}}</span><!-- greenEnvironmentProtectionDesc     -->
                    <el-select v-model="item.greenEnvironmentProtection"
                              placeholder="请选择"
                              size="small"
                              v-else
                              multiple
                              collapse-tags
                              clearable>
                      <el-option v-for="item in greenEnvironmentProtectionOptions"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <div class="cttitle">其他</div>
                    <span v-if="readOnly">{{item.other}}</span>
                    <el-input v-model="item.other"
                              v-else
                              maxlength="30"
                              placeholder="请输入内容"
                              type="text"></el-input>
                  </el-form-item>
                </div>
                </div>
              </div>
              <div v-else>
                <div v-for="(item,index) in projectDetail.projectCycles"
                     :key="index"
                     v-show="cycleIndex===index">
                  <div class="div_title">
                    <h3>建筑相关</h3>
                  </div>
                  <div class="architecture">
                    <el-form-item>
                      <div class="cttitle">占地面积(㎡)</div>
                      <span v-if="readOnly">{{item.newBuildingArea }}</span>
                      <el-input v-model="item.newBuildingArea "
                                v-else
                                maxlength="30"
                                placeholder="请输入内容"
                                type="number"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <div class="cttitle">总建筑面积(㎡)</div>
                      <span v-if="readOnly">{{item.totalBuildingArea}}</span>
                      <el-input v-model="item.totalBuildingArea"
                                v-else
                                maxlength="30"
                                placeholder="请输入内容"
                                type="number"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <div class="cttitle">地上建筑面积(㎡)</div>
                      <span v-if="readOnly">{{item.upBuildingArea}}</span>
                      <el-input v-model="item.upBuildingArea"
                                v-else
                                maxlength="30"
                                placeholder="请输入内容"
                                type="number"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <div class="cttitle">地下建筑面积(㎡)</div>
                      <span v-if="readOnly">{{item.downBuildingArea}}</span>
                      <el-input v-model="item.downBuildingArea"
                                v-else
                                maxlength="30"
                                placeholder="请输入内容"
                                type="number"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <div class="cttitle">层高(m)</div>
                      <span v-if="readOnly">{{item.floorHeight}}</span>
                      <el-input v-model="item.floorHeight"
                                v-else
                                maxlength="30"
                                placeholder="请输入内容"
                                type="number"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <div class="cttitle">净高(m)</div>
                      <span v-if="readOnly">{{item.clearHeight}}</span>
                      <el-input v-model="item.clearHeight"
                                v-else
                                maxlength="30"
                                placeholder="请输入内容"
                                type="number"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <div class="cttitle">建筑结构</div>
                      <span v-if="readOnly">{{item.buildingStructureDesc}}</span><!-- buildingStructure buildingStructureDesc -->
                      <el-select v-model="item.buildingStructure"
                                placeholder="请选择"
                                size="small"
                                v-else>
                        <el-option v-for="item in buildingStructureOptions"
                                  :key="item.value"
                                  :label="item.name"
                                  :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <div class="cttitle">楼板荷载(kg/m²)</div>
                      <span v-if="readOnly">{{item.floorLoad}}</span>
                      <el-input v-model="item.floorLoad"
                                v-else
                                maxlength="30"
                                placeholder="请输入内容"
                                type="number"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <div class="cttitle">建筑外立面</div>
                      <span v-if="readOnly">{{item.buildingFacadeDesc}}</span><!-- buildingFacadeDesc  -->
                      <el-select v-model="item.buildingFacade"
                                placeholder="请选择"
                                size="small"
                                v-else>
                        <el-option v-for="item in buildingFacadeOptions"
                                  :key="item.value"
                                  :label="item.name"
                                  :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                <div class="segmentation"></div>
                <div class="div_title">
                  <h3>设备相关</h3>
                </div>
                <div class="config">
                  <el-form-item>
                    <div class="cttitle">电梯系统</div>
                    <span v-if="readOnly">{{item.elevatorSystem}}</span>
                    <el-input v-model="item.elevatorSystem"
                              v-else
                              maxlength="30"
                              placeholder="请输入内容"
                              type="text"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <div class="cttitle">空调系统</div>
                    <span v-if="readOnly">{{item.airConSystem}}</span>
                    <el-input v-model="item.airConSystem"
                              v-else
                              maxlength="30"
                              placeholder="请输入内容"
                              type="text"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <div class="cttitle">新风系统</div>
                    <span v-if="readOnly">{{item.freshAirSystem}}</span>
                    <el-input v-model="item.freshAirSystem"
                              v-else
                              maxlength="30"
                              placeholder="请输入内容"
                              type="text"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <div class="cttitle">电力</div>
                    <span v-if="readOnly">{{item.power}}</span>
                    <el-input v-model="item.power"
                              v-else
                              maxlength="30"
                              placeholder="请输入内容"
                              type="text"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <div class="cttitle">消防系统</div>
                    <span v-if="readOnly">{{item.fireFightingSystemDesc}}</span><!-- fireFightingSystemDesc   -->
                    <el-select v-model="item.fireFightingSystem"
                              placeholder="请选择"
                              size="small"
                              v-else
                              :clearable="true"
                              multiple
                              collapse-tags>
                      <el-option v-for="item in fireFightingSystemOptions"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <div class="cttitle">供水系统</div>
                    <span v-if="readOnly">{{item.waterSupplySystemDesc}}</span><!-- waterSupplySystemDesc    -->
                    <el-select v-model="item.waterSupplySystem"
                              placeholder="请选择"
                              size="small"
                              v-else
                              multiple
                              collapse-tags
                              clearable>
                      <el-option v-for="item in waterSupplySystemOptions"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <div class="cttitle">燃气系统</div>
                    <span v-if="readOnly">{{item.gasSystem}}</span>
                    <el-input v-model="item.gasSystem"
                              v-else
                              maxlength="30"
                              placeholder="请输入内容"
                              type="text"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <div class="cttitle">雨污水系统</div>
                    <span v-if="readOnly">{{item.rainwaterSewageSystem}}</span>
                    <el-input v-model="item.rainwaterSewageSystem"
                              v-else
                              maxlength="30"
                              placeholder="请输入内容"
                              type="text"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <div class="cttitle">绿色环保</div>
                    <span v-if="readOnly">{{item.greenEnvironmentProtectionDesc}}</span><!-- greenEnvironmentProtectionDesc     -->
                    <el-select v-model="item.greenEnvironmentProtection"
                              placeholder="请选择"
                              size="small"
                              v-else
                              multiple
                              collapse-tags
                              clearable>
                      <el-option v-for="item in greenEnvironmentProtectionOptions"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <div class="cttitle">其他</div>
                    <span v-if="readOnly">{{item.other}}</span>
                    <el-input v-model="item.other"
                              v-else
                              maxlength="30"
                              placeholder="请输入内容"
                              type="text"></el-input>
                  </el-form-item>
                </div>
                </div>
              </div>
            </el-form>
          </div>
          <div class="fileOn"
               v-if="tabIndex===2">
            <div class="title"
                 style="font-weight: bold;">
              <span><span class="vertical"></span>项目资料库</span>
            </div>
            <div class="tableDiv">
              <div class="search-div">
                <el-select v-model="annexType"
                           placeholder="请选择资料类型"
                           size="small"
                           style="width: 12%;margin-right: 10px;"
                           clearable>
                  <el-option v-for="item in tenantNameeOptions"
                             :key="item.value"
                             :label="item.name"
                             :value="item.value">
                  </el-option>
                </el-select>
                <el-input v-model="annexNumber"
                          style="width: 16%;"
                          placeholder="请输入资料编号"
                          size="small"></el-input>
                <el-date-picker
                  v-model="startEndTime"
                  style="width: 28%;"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
                </el-date-picker>
                <el-input v-model="createdUserName"
                          style="  width: 12%;margin-left: 20px;"
                          placeholder="请输入上传人"
                          size="small"></el-input>
                <div class="query-btn-small"
                     style="margin-top:0px"
                     @click="getAnnexesList('btn')">查询</div>

                <div class="upload"
                     @click="uploadData()">
                  <i class="iconfont icon-shangchuanfujianicon"></i>
                  上传资料
                </div>
              </div>
              <el-table :data="tableData"
                        style="width: 100%">
                <el-table-column label="资料类型"
                                 align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.annexNameDescription}}</span>
                    <!-- <el-select v-model="scope.row.annexType"
                               v-else
                               placeholder="请选择">
                      <el-option v-for="item in tenantNameeOptions"
                                 :key="item.value"
                                 :label="item.name"
                                 :value="item.value">
                      </el-option>
                    </el-select> -->
                  </template>
                </el-table-column>
                <el-table-column label="资料编号"
                                 align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.annexNumber}}</span>
                    <!-- <el-input v-model="scope.row.annexNumber"
                              placeholder="请输入内容"
                              v-else></el-input> -->
                  </template>
                </el-table-column>
                <el-table-column label="资料名称"
                                 align="center">
                  <template slot-scope="scope">
                    <span v-if="!scope.row.elEdit">{{scope.row.annexName}}</span>
                    <el-input v-model="scope.row.annexName"
                              placeholder="请输入内容"
                              v-else></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="上传时间"
                                 align="center"
                                 :formatter="createdDateFormat"></el-table-column>
                <el-table-column label="上传人"
                                 align="center"
                                 prop="createdUserName"></el-table-column>
                <el-table-column label="操作"
                                 align="center">
                  <template slot-scope="scope">
                    <span v-if="!scope.row.elEdit"
                          class="elreadOnly">
                      <i class="iconfont icon-edit"
                         @click="elOnEdit(scope.row)"
                         style="margin-right: 10px"></i>
                      <!-- <i class="iconfont icon-cms_chakan-" @click="downloadFile(scope.row.annexURL, scope.row.annexName)" style="margin-right: 10px"></i> -->
                      <ailPreview :ailObj="scope.row"
                                  :encrypt="true"
                                  @setFile="setFile" />
                      <aliDownLoad :item="scope.row"
                                   :encrypt="true" />
                      <!-- <i @click="deleteAnnex(scope.row, scope.$index)"
                        class="iconfont icon-lajixiang"
                        style="margin-left:10px"></i> -->
                    </span>
                    <span v-else
                          class="elEdit">
                      <span @click="cancelEl(scope.row)">取消</span>
                      <span @click="postEl(scope.row)"
                            style="color: #3575F6">保存</span>
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="ctc-foot"
                 v-if="pager.total > 0">
              <span><span style="margin-right:10px">{{pager.currentPage}}/{{Math.ceil(pager.total/pager.pgSize)}}页</span> 共{{pager.total}}条记录</span>
              <el-pagination v-if="pager.total > 0"
                             background
                             layout="prev, pager, next"
                             :page-size=pager.pgSize
                             :total="pager.total"
                             :current-page="pager.currentPage"
                             @current-change="current_change">
              </el-pagination>
              <div class="pagingnum">
                显示 <select v-model="pager.pgSize"
                        @change="currentSel">
                  <option v-for="item in pager.pgNumoptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                  </option>
                </select>
                条目
              </div>
            </div>
          </div>
        </div>
        <div slot="footer"
             v-if="!readOnly && tabIndex !== 2"
             style="background: #fff;padding: 10px;margin-right: 0;height:50px;margin-top: -50px;"
             class="dialog-footer">
          <el-button @click="cancel"
                     class="close-button">取消</el-button>
          <el-button type="primary"
                     @click="confirm('fromDetail')"
                     class="defaultbtn dialog-confirmBtn">保存</el-button>
        </div>
      </div>
    </drawer>

    <el-dialog title="上传资料"
               :visible.sync="flowDialogVisible"
               width="500px"
               :close-on-click-modal=false
               class="enclosureDialog"
               append-to-body>
      <el-form :model="meansData"
               :rules="meansRules"
               ref="addFlowform">
        <div class="dl-subtitle">
          <div>
            资料分类<span class="required">*</span>
          </div>
          <el-form-item prop="annexType">
            <el-select v-model="meansData.annexType"
                       placeholder="请选择">
              <el-option v-for="item in tenantNameeOptions"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <!-- <div class="dl-subtitle">
          <div>
            资料编号<span class="required">*</span>
          </div>
          <el-form-item prop="annexNumber">
            <el-input v-model="meansData.annexNumber"
                      type="text">
            </el-input>
          </el-form-item>
        </div> -->
        <div class="dl-subtitle"
             style="margin-bottom: 20px">资料附件<span class="required">*</span>
          <aliUpload class="aliUpload"
                     v-if="enclosureList.length === 0"
                     :upLoadText="upLoadText"
                     :fileType="fileType"
                     businessType='project'
                     :encrypt="true"
                     :iconShow="true"
                     @setAnnex="setAnnex" />
          <div class="enclosure">
            <div v-for="(item, index) in enclosureList"
                 :key="index">
              <span>{{item.annexName}}</span>
              <span>
                <i @click="deleteAnnex2(index)"
                   class="iconfont icon-lajixiang"
                   style="margin-left:20px;cursor: pointer;"></i>
              </span>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="flowDialogVisible = false"
                   class="close-button">取消</el-button>
        <el-button type="primary"
                   style="margin-left: 0"
                   @click="addPipeline('addFlowform')"
                   class="defaultbtn dialog-confirmBtn">确定</el-button>
      </div>
    </el-dialog>

    <!-- 图片预览 -->
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>

    <el-dialog v-if="constructionDialogVisible"
               :title="constructionTitle"
               :visible.sync="constructionDialogVisible"
               :close-on-click-modal="false"
               @close="addHide"
               width="500px"
               class="flowDialog1">
      <div class="dialog_content">
        <el-form v-if="tab2Index === 5">
          <div class="dl-subtitle">施工单位
            <el-form-item>
              <el-input v-model="relations.name"
                        size="small"
                        type="text">
              </el-input>
            </el-form-item>
          </div>
          <div class="dl-subtitle">施工内容
            <el-form-item prop="tenandId">
              <el-input v-model="relations.content"
                        size="small"
                        type="text">
              </el-input>
            </el-form-item>
          </div>
          <div class="dl-subtitle">联系人
            <el-form-item>
              <el-input v-model="relations.contacts"
                        size="small"
                        type="text">
              </el-input>
            </el-form-item>
          </div>
          <div class="dl-subtitle">联系人职务
            <el-form-item prop="feeType">
              <el-input v-model="relations.contactsPost"
                        size="small"
                        type="text">
              </el-input>
            </el-form-item>
          </div>
          <div class="dl-subtitle">手机号
            <el-form-item prop="amount">
              <el-input v-model="relations.telephone"
                        size="small"
                        type="number">
              </el-input>
            </el-form-item>
          </div>
          <div class="dl-subtitle">公司固话
            <el-form-item prop="amount">
              <el-input v-model="relations.fixedTel"
                        size="small"
                        type="tel">
              </el-input>
            </el-form-item>
          </div>
          <div class="inlinediv"
               style="width:100%">
            <div>备注</div>
            <el-form-item style="width: 100%;margin-bottom: 20px;">
              <el-input v-model="relations.remark"
                        resize="none"
                        maxlength="500"
                        placeholder="500字以内"
                        type="textarea">
              </el-input>
            </el-form-item>
          </div>
        </el-form>
        <el-form v-else-if="tab2Index === 6">
          <div class="dl-subtitle">单位名称
            <el-form-item>
              <el-input v-model="otherRelations.name"
                        size="small"
                        type="text">
              </el-input>
            </el-form-item>
          </div>
          <div class="dl-subtitle">联系人
            <el-form-item prop="tenandId">
              <el-input v-model="otherRelations.contacts"
                        size="small"
                        type="text">
              </el-input>
            </el-form-item>
          </div>
          <div class="dl-subtitle">联系电话
            <el-form-item prop="amount">
              <el-input v-model="otherRelations.fixedTel"
                        size="small"
                        type="tel">
              </el-input>
            </el-form-item>
          </div>
          <div class="inlinediv"
               style="width:100%">
            <div>备注</div>
            <el-form-item style="width: 100%;margin-bottom: 20px;">
              <el-input v-model="otherRelations.remark"
                        resize="none"
                        maxlength="200"
                        placeholder="200字以内"
                        type="textarea">
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer"
           class="slotfooter">
        <span @click="addHide"
              class="details_cannelBtn">取消</span>
        <span @click="addBillSave(tab2Index)"
              class="details_submitBtn">确定</span>
      </div>
    </el-dialog>

    <RelatedInformation v-if="detailsShow"
                        :detailsdrawershow.sync="detailsShow"
                        :projectManagementId="projectDetail.id"
                        :id="relatedId"
                        :relateType="relateType"
                        @handleEdit="handleEdit"
                        ref="RelatedInformation" />
  </div>
</template>
<script>
import axios from 'axios'
import Drawer from '@/components/drawer.vue'
import context from '@/service'
import AMap from 'AMap'
// import Worker from '../../../../utils/pptx/worker'
import aliUpload from '@/components/aliUpload.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import ailPreview from '@/components/ailPreview.vue'
import RelatedInformation from './RelatedInformation.vue'
var map, marker
var geocoder
export default {
  components: {
    Drawer,
    aliDownLoad,
    aliUpload,
    picturePrevie,
    ailPreview,
    RelatedInformation
  },
  props: {
    addProjectShow: {
      type: Boolean,
      default: false
    },
    isFromSeach: { // 是否是首页搜索父组件入口调用 解决同一页面多次调用地图 容器id相同 地图无法正常创建、销毁
      type: Boolean,
      default: true
    },
    projectDetailData: {
      type: Object
    }
  },
  watch: {
    addProjectShow: {
      handler: function (newVal, old) {
        if (newVal) {
          this.init()
        }
      }
    },
    projectDetailData: {
      handler: function () {
        this.$refs['fromDetail'].resetFields()
        this.projectDetail = this.projectDetailData
        console.log(this.projectDetail)
        this.readOnly = true
        // this.getProjectManagementType()
        this.formaterAddr()
        this.buildingStructure()
        this.buildingFacade()
        this.fireFightingSystem()
        this.waterSupplySystem()
        this.greenEnvironmentProtection()
        this.geoAddress()
        if (this.hasAuthority('02010103')) {
          this.showEdit = true
        }
        marker = null
        this.tab2Index = 1
        this.tabIndex = 0
        this.changeNav(0)
        this.changeTabIndexInit()
        let projectCycles = this.projectDetailData.projectCycles
        // 有期数
        if (projectCycles.length) {
          projectCycles.forEach((v, i) => {
            projectCycles[i] = this.showDataSelect(projectCycles[i])
          })
        } else {
          // 无期数
          projectCycles = [{}]
        }
        this.projectDetailData.projectCycles = this.showDataSelect(projectCycles)
        if (!this.projectDetail.propertyOwnerRelation) {
          this.projectDetail.propertyOwnerRelation = {
            'name': '',
            'contacts': '',
            'contactsPost': '',
            'telephone': '',
            'fixedTel': '',
            'remark': '',
            'relationType': 'PROPERTY_OWNER',
            'contact': ''
          }
        }
        if (!this.projectDetail.bulidUnitRelation) {
          this.projectDetail.bulidUnitRelation = {
            'name': '',
            'contacts': '',
            'contactsPost': '',
            'telephone': '',
            'fixedTel': '',
            'remark': '',
            'relationType': 'BULID_UNIT',
            'contact': ''
          }
        }
        if (!this.projectDetail.designUnitRelation) {
          this.projectDetail.designUnitRelation = {
            'name': '',
            'contacts': '',
            'contactsPost': '',
            'telephone': '',
            'fixedTel': '',
            'remark': '',
            'relationType': 'DESIGN_UNIT',
            'contact': ''
          }
        }
        if (!this.projectDetail.supervisorRelation) {
          this.projectDetail.supervisorRelation = {
            'name': '',
            'contacts': '',
            'contactsPost': '',
            'telephone': '',
            'fixedTel': '',
            'remark': '',
            'relationType': 'SUPERVISOR_UNIT',
            'contact': ''
          }
        }
        if (this.projectDetail.relations.length === 0) {
          this.projectDetail.relations = [
            {
              'name': '',
              'contacts': '',
              'contactsPost': '',
              'telephone': '',
              'fixedTel': '',
              'remark': '',
              'relationType': 'CONSTRUCTION_UNIT',
              'contact': ''
            }
          ]
        }
        if (this.projectDetail.otherRelations.length === 0) {
          this.projectDetail.otherRelations = [
            {
              'name': '',
              'contacts': '',
              'telephone': '',
              'remark': '',
              'relationType': 'OTHER'
            }
          ]
        }
      }
    }
  },
  data () {
    return {
      createdUserName: '',
      startEndTime: '',
      cycleIndex: 0,
      relateType: 'propertyOwnerRelation',
      relatedId: '',
      detailsShow: false,
      relations: {},
      otherRelations: {},
      constructionDialogVisible: false,
      projectDetail: {
      },
      showEditBtn: true,
      showPicture: false,
      imgArr: [],
      num: 0,
      meansData: {},
      meansRules: {
        annexType: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ]
        // annexNumber: [
        //   { required: true, message: '请输入编号', trigger: 'blur' }
        // ]
      },
      tenantNameeOptions: [
        { name: '招商资料', value: 'BUSINESS' },
        { name: '营运资料', value: 'OPERATION' },
        { name: '物业资料', value: 'PROPERTY' },
        { name: '工程资料', value: 'CONDITION' },
        { name: '企划资料', value: 'PLANNING' },
        { name: '财务资料', value: 'FINANCE' },
        { name: '项目产权人', value: 'PROPERTY_OWNER' },
        { name: '其他资料', value: 'OTHER' }
      ],
      buildingStructureOptions: [],
      buildingFacadeOptions: [],
      fireFightingSystemOptions: [],
      waterSupplySystemOptions: [],
      greenEnvironmentProtectionOptions: [],
      flowDialogVisible: false,
      upLoadText: '上传资料',
      fileType: [],
      constructionTitle: '',
      tableData: [
        { fileName: '1', time: '2019-09-01' }
      ],
      tab2Index: 1,
      tabIndex: 0, // 0项目档案1项目主要经济目标
      drawerTitle: '项目详情',
      chargeTypeOptions: [
        { name: '按月计费', value: 'MONTH' },
        { name: '按实际天数计费', value: 'DAY' }
      ],
      offerReocrdOptions: [
        { name: '不包括', value: false },
        { name: '包括', value: true }
      ],
      investTypeOption: [
        {
          name: '独立',
          value: 'INDEPENDENT'
        },
        {
          name: '合作',
          value: 'COOPERATE'
        }
      ],
      projectDetailRules: {
        projectName: [
          { required: true, message: '请输入项目名称' }
        ],
        // projectCode: [
        //   { required: true, message: '请输入项目代码' }
        // ],
        outRentName: [
          { required: true, message: '请输入对外招租名称' }
        ],
        areaOptions: [
          { required: true, message: '请选择省市区' }
        ],
        address: [
          { required: true, message: '请输入具体地址' }
        ],
        previewImage: [
          { required: true, message: '请上传项目图片', trigger: 'blur' }
        ],
        telephone: [
          { pattern: /^1[23456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur', required: false }
        ],
        fixedTel: [
          { pattern: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/, message: '请输入正确的固话', trigger: 'blur', required: false }
        ],
        sortNumber: [
          { required: true, message: '请输入项目排序值', trigger: 'blur' }
        ],
        'propertyOwnerRelation.telephone': [{
          pattern: /^1[23456789]\d{9}$/,
          message: '请输入正确的手机号码',
          required: false,
          trigger: 'blur'
        }],
        'propertyOwnerRelation.fixedTel': [{
          pattern: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,
          message: '请输入正确的固话',
          required: false,
          trigger: 'blur'
        }],
        'bulidUnitRelation.telephone': [{
          pattern: /^1[23456789]\d{9}$/,
          message: '请输入正确的手机号码',
          required: false,
          trigger: 'blur'
        }],
        'bulidUnitRelation.fixedTel': [{
          pattern: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,
          message: '请输入正确的固话',
          required: false,
          trigger: 'blur'
        }],
        'designUnitRelation.telephone': [{
          pattern: /^1[23456789]\d{9}$/,
          message: '请输入正确的手机号码',
          required: false,
          trigger: 'blur'
        }],
        'designUnitRelation.fixedTel': [{
          pattern: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,
          message: '请输入正确的固话',
          required: false,
          trigger: 'blur'
        }],
        'supervisorRelation.telephone': [{
          pattern: /^1[23456789]\d{9}$/,
          message: '请输入正确的手机号码',
          required: false,
          trigger: 'blur'
        }],
        'supervisorRelation.fixedTel': [{
          pattern: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,
          message: '请输入正确的固话',
          required: false,
          trigger: 'blur'
        }]
      },
      projectNameOptions: [],
      organizeName: '',
      address: '',
      documentTypeOptions: {},
      pickerOptions0: {
        disabledDate: time => {
          let endDateVal = this.projectDetail.endDate
          if (endDateVal) {
            let temp = new Date(endDateVal).getTime() - 365 * 24 * 60 * 60 * 1000
            return time.getTime() < new Date(temp).getTime() || time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          let beginDateVal = this.projectDetail.startDate
          if (beginDateVal) {
            let temp = new Date(beginDateVal).getTime() + 364 * 24 * 60 * 60 * 1000
            return time.getTime() > new Date(temp).getTime() || time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
          }
        }
      },
      errorField: true,
      errorTip: '',
      readOnly: true,
      showEdit: false,
      organizeOptions: {},
      cascaderData: [],
      areaOptions: [],
      isResouceShow: 0,
      projectStatusOptions: [
        { name: '运营中', value: 'RUNNING' }, { name: '筹备中', value: 'PREPARING' }
      ],
      useStatusOptions: [
        { name: '使用中', value: 'USING' }, { name: '已停用', value: 'DISABLE' }
      ],
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
      provinceAddress: '',
      enclosureList: [],
      navList: [
        {
          label: '项目建设信息',
          value: true
        }, {
          label: '主要技术指标',
          value: false
        }, {
          label: '项目资料库',
          value: false
        }
      ],
      annexNumber: '',
      annexType: '',
      projectClassOptions: []
    }
  },
  mounted () {
    let clientHeight = document.body.clientHeight
    let mainContent = document.getElementById('mainContent')
    mainContent.style.height = clientHeight - 108 + 'px'
    // this.projectDetail = this.projectDetailData
    // this.init()
  },
  beforeDestroy () {
    localStorage.setItem('tabIndex', 1)
  },
  methods: {
    cycleIndexChange (i) {
      this.cycleIndex = i
    },
    NameOptions (row) {
      this.addData.originalProjectName = this.projectNameOptions.map(item => {
        if (row === item.id) {
          return item.name
        }
      }).toString()
    },
    async getProjectManagementType () {
      let result = await context.http.get('uaa/api/organizes/all/simple?organizeType=ENTERPRISE&useStatus=USING')
      this.projectNameOptions = result.data
    },
    delCycles (i) {
      this.projectDetail.projectCycles.splice(i, 1)
    },
    addCycle () {
      let item = { cycle: '', startWorkDate: '', endWorkDate: '', practiceDate: '' }
      this.projectDetail.projectCycles.push(item)
    },
    showDataSelect (data) {
      // 建筑结构
      if (data.buildingStructureDesc) {
        data.buildingStructureDesc = data.buildingStructureDesc.replace(/,/g, '、')
      }
      // 建筑外立面
      if (data.buildingFacadeDesc) {
        data.buildingFacadeDesc = data.buildingFacadeDesc.replace(/,/g, '、')
      }
      // 消防系统
      if (data.fireFightingSystemDesc) {
        data.fireFightingSystemDesc = data.fireFightingSystemDesc.replace(/,/g, '、')
        data.fireFightingSystem = data.fireFightingSystem.split(',')
      }
      // 供水系统
      if (data.waterSupplySystemDesc) {
        data.waterSupplySystemDesc = data.waterSupplySystemDesc.replace(/,/g, '、')
        data.waterSupplySystem = data.waterSupplySystem.split(',')
      }
      // 绿色环保
      if (data.greenEnvironmentProtectionDesc) {
        data.greenEnvironmentProtectionDesc = data.greenEnvironmentProtectionDesc.replace(/,/g, '、')
        data.greenEnvironmentProtection = data.greenEnvironmentProtection.split(',')
      }
      return data
    },
    submitDataSelect (data) {
      // 建筑结构
      // 判断无数据对象错误
      if (data.buildingStructure) {
        let { arr, CCTstr } = this.parameTransferred(this.buildingStructureOptions, data.buildingStructure)
        data.buildingStructure = CCTstr
        data.buildingStructureDesc = arr
      }
      // 建筑外立面
      if (data.buildingFacade) {
        let { arr, CCTstr } = this.parameTransferred(this.buildingFacadeOptions, data.buildingFacade)
        data.buildingFacade = CCTstr
        data.buildingFacadeDesc = arr
      }
      // 消防系统
      if (data.fireFightingSystem) {
        let { arr, CCTstr } = this.parameTransferred(this.fireFightingSystemOptions, data.fireFightingSystem)
        data.fireFightingSystem = CCTstr
        data.fireFightingSystemDesc = arr
      }
      // 供水系统
      if (data.waterSupplySystem) {
        let { arr, CCTstr } = this.parameTransferred(this.fireFightingSystemOptions, data.waterSupplySystem)
        data.waterSupplySystem = CCTstr
        data.waterSupplySystemDesc = arr
      }
      // 绿色环保
      if (data.greenEnvironmentProtection) {
        let { arr, CCTstr } = this.parameTransferred(this.fireFightingSystemOptions, data.greenEnvironmentProtection)
        data.greenEnvironmentProtection = CCTstr
        data.greenEnvironmentProtectionDesc = arr
      }
      return data
    },
    cycleChange (val) {
      let o = val ? [{ cycle: '', startWorkDate: '', endWorkDate: '', practiceDate: '' }] : []
      this.$set(this.projectDetail, 'projectCycles', o)
    },
    changeTabIndexInit () {
      const tabIndex = localStorage.getItem('tabIndex')
      if (tabIndex) {
        this.changeTabIndex(Number(tabIndex))
      } else {
        this.tab2Index = 1
        this.changeTabIndex(1)
      }
    },
    relationHandler (type, id, index) {
      localStorage.setItem('tabIndex', index)
      this.relateType = type
      this.relatedId = id
      this.detailsShow = true
    },
    addHide () {
      this.constructionDialogVisible = false
    },
    handleEdit () {
      this.showEditBtn = true
      this.$emit('handleEdit', 0, this.projectDetailData.id)
      // this.changeTabIndexInit()
    },
    addBillSave (tab2Index) {
      const reg = /^1(3|4|5|7|8)\d{9}$/
      if (tab2Index === 5) {
        if (this.relations.telephone && this.relations.telephone.length !== 0 && !reg.test(this.relations.telephone)) {
          this.$message.error('请输入正确的手机号！')
          return
        }
        this.relations.projectManagementId = this.projectDetailData.id
        this.relations.relationType = 'CONSTRUCTION_UNIT'
        console.log(this.relations)
        context.http.post('cms/api/project-managements/relation', this.relations).then(res => {
          if (res.status === 200 || res.status === 201) {
            this.constructionDialogVisible = false
            this.relations = {}
            this.$emit('handleEdit', 0, this.projectDetailData.id)
            this.tab2Index = 5
            this.showEditBtn = true
          }
        })
      } else if (tab2Index === 6) {
        // if (this.otherRelations.telephone && this.otherRelations.telephone.length !== 0 && !reg.test(this.otherRelations.telephone)) {
        //   this.$message.error('请输入正确的手机号！')
        //   return
        // }
        this.otherRelations.projectManagementId = this.projectDetailData.id
        this.otherRelations.relationType = 'OTHER'
        context.http.post('cms/api/project-managements/relation', this.otherRelations).then(res => {
          if (res.status === 200 || res.status === 201) {
            this.constructionDialogVisible = false
            this.otherRelations = {}
            this.$emit('handleEdit', 0, this.projectDetailData.id)
            this.tab2Index = 6
            this.showEditBtn = true
          }
        })
      }
    },
    downloadFile (annexURL, annexName) {
      axios({
        method: 'GET',
        url: '/ywm/api/annex/download',
        params: {
          annexURL: annexURL,
          annexName: annexName
        },
        responseType: 'blob'
      }).then(res => {
        if (res.status === 200) {
          // this.previewXLSX(res.data)
          // this.previewDocx(res.data)
          this.previewPPT(res.data)
        }
      })
    },
    showImg (url, type) {
      if (!this.readOnly && type === 1) return
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    pictureClose () {
      this.showPicture = false
    },
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[inx].value = true
      if (inx === 0) {
        this.tabIndex = inx
      } else if (inx === 1) {
        this.cycleIndex = 0
        let f = this.projectDetail.projectCycles.every((item, index) => {
          return item.cycle && item.cycle !== ''
        })
        // if (!f) {
        //   this.changeNav(0)
        //   this.$message.error('期数不能为空')
        //   return
        // }
        this.tabIndex = inx
      } else if (inx === 2) {
        this.tabIndex = inx
        this.getAnnexesList('btn')
      }
    },
    changeTabIndex (inx) {
      this.tab2Index = inx
    },
    addRelations (tab2Index) {
      this.constructionDialogVisible = true
      if (tab2Index === 5) {
        this.constructionTitle = '新增施工单位'
      } else if (tab2Index === 6) {
        this.constructionTitle = '新增其他'
      }
      // this.projectDetail.relations.push({
      //   name: '',
      //   contacts: '',
      //   contactsPost: '',
      //   telephone: '',
      //   fixedTel: '',
      //   remark: '',
      //   relationType: 'CONSTRUCTION_UNIT'
      // })
    },
    createdDateFormat (row, column) {
      if (!row.createDateTime) return
      let n = row.createDateTime.replace('T', '  ').replace('Z', '')
      return n
    },
    delRelations (index) {
      this.projectDetail.relations.splice(index, 1)
    },
    delPreviewImage () {
      this.projectDetail.previewImage = ''
    },
    elOnEdit (obj) {
      this.$set(obj, 'elEdit', true)
    },
    setFile (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    preview (obj) {
      let inx = obj.annexName.indexOf('.')
      let fileType = obj.annexName.substring(inx)
      if (fileType === '.jpg' || fileType === '.png') {
        this.showImg(obj.annexURL, 2)
      } else if (fileType === '.pdf') {
        window.open(obj.annexURL)
      } else {
        this.$message.error('暂时不支持此类型文件预览！')
      }
    },
    cancelEl (obj) {
      obj.elEdit = false
      this.getAnnexesList()
    },
    postEl (obj) {
      if (!obj.annexNumber) {
        this.$message.error('请输入资料编号')
        return
      }
      if (!obj.annexName) {
        this.$message.error('请输入资料名称')
        return
      }
      context.http.put('cms/api/project-managements/annexes', obj).then(res => {
        if (res.status === 200 || res.status === 201) {
          obj.elEdit = false
          this.getAnnexesList()
          // this.$emit('handleEdit', 0, this.projectDetail.id)
        }
      })
    },
    deleteAnnex (item, index) {
      context.http.delete(`/cms/api/project-managements/annexes/${item.id}`).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getAnnexesList()
      })
    },
    formatInvestType (type) {
      let temp = ''
      if (type === 'INDEPENDENT') {
        temp = '独立'
      } else if (type === 'COOPERATE') {
        temp = '合作'
      }
      return temp
    },
    deleteAnnex2 (index) {
      this.enclosureList.splice(index, 1)
    },
    setAnnex (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.enclosureList = [{
        'annexName': annexName,
        'annexURL': annexURL
      }]
    },
    getAnnexesList (type) { // 获取整个项目的附件
      if (type === 'btn') {
        this.pager.currentPage = 1
      }
      let startEndTime = JSON.parse(JSON.stringify(this.startEndTime))
      startEndTime = startEndTime || ''
      if (startEndTime.length) {
        startEndTime.forEach((v, i) => {
          if (i === 0) {
            startEndTime[i] = this.timeReturn(v)
          } else {
            startEndTime[i] = this.timeReturn(v, '23:59:59')
          }
        })
      }
      context.http.get(`cms/api/project-managements/annexes?projectManagementId=${this.projectDetail.id}`, {
        annexType: this.annexType,
        annexNumber: this.annexNumber,
        createdUserName: this.createdUserName,
        startTime: startEndTime.length ? startEndTime[0] : '',
        endTime: startEndTime.length ? startEndTime[1] : '',
        sort: 'createdDate,desc',
        page: (this.pager.currentPage - 1),
        size: this.pager.pgSize
      }).then(res => {
        this.pager.total = Number(res.headers['x-total-count'])
        this.tableData = res.data
        this.tabIndex = 2
      }).catch(error => {
        console.info(error)
      })
    },
    currentSel () {
      this.pager.currentPage = 1
      this.getAnnexesList()
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.getAnnexesList()
    },
    init: function () {
      let container = this.$refs.container
      map = new AMap.Map(container, {
        resizeEnable: true
      })
      if (!geocoder) {
        geocoder = new AMap.Geocoder({
          city: '' // 城市设为北京，默认：“全国”
        })
      }
    },
    geoCode () {
      if (marker) {
        map.remove(marker)
      }
      var _this = this
      let lastIindex = this.provinceAddress.lastIndexOf('区')
      var address = this.provinceAddress.substring(0, lastIindex + 1) + this.projectDetail.address
      geocoder.getLocation(address, function (status, result) {
        if (status === 'complete' && result.geocodes.length) {
          var lnglat = result.geocodes[0].location
          _this.projectDetail.lat = result.geocodes[0].location.lat
          _this.projectDetail.lot = result.geocodes[0].location.lng
          marker = new AMap.Marker()
          marker.setLabel({
            offset: new AMap.Pixel(20, -20),
            content: result.geocodes[0].formattedAddress
          })
          map.add(marker)
          marker.setPosition(lnglat)
          map.setFitView(marker)
        } else { console.log(JSON.stringify(result)) }
      })
    },
    geoAddress () {
      if (marker) {
        map.remove(marker)
      }
      let _this = this
      let lnglat = [this.projectDetail.lot, this.projectDetail.lat]
      geocoder.getAddress(lnglat, function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          // result为对应的地理位置详细信息
          _this.provinceAddress = result.regeocode.formattedAddress
          _this.geoCode()
        }
      })
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    formatReocrd (value) {
      if (value === false) {
        return '不包括'
      } else if (value === true) {
        return '包括'
      } else {
        return value
      }
    },
    formaterProjectStatus (value) {
      if (value === 'RUNNING') {
        return '运营中'
      } else if (value === 'PREPARING') {
        return '筹备中'
      } else {
        return value
      }
    },
    formaterUseStatus (value) {
      if (value === 'USING') {
        return '使用中'
      } else if (value === 'DISABLE') {
        return '已停用'
      } else {
        return value
      }
    },
    formaterChargeTypeOptions (value) {
      let result = this.chargeTypeOptions.filter(item => item.value === value)
      if (result && result.length > 0) {
        return result[0].name
      } else {
        return ''
      }
    },
    // 省市区
    async formaterAddr () {
      if (this.projectDetail.district !== '') {
        this.address = await this.getAddrByCode(this.projectDetail.district)
      } else if (this.projectDetail.city !== '') {
        this.address = await this.getAddrByCode(this.projectDetail.city)
      } else if (this.projectDetail.province) {
        this.address = await this.getAddrByCode(this.projectDetail.province)
      }
    },
    async getAddrByCode (code) {
      let result = await context.http.get(`ywm/api/district-codes/${code}`)
      return result.data.address
    },
    async getOrganizeOptions () {
      let result = await context.http.get('uaa/api/organizes', { organizeType: 'COMPANY', useStatus: 'USING', page: 0, size: 100, sort: 'desc' })
      this.organizeOptions = result.data.map(item => {
        return { label: item.name, value: item.id }
      })
    },
    async setAreaOptionsDefault () {
      await this.getNodes()
      await this.getNodes([Number(this.projectDetail.province)])
      await this.getNodes([Number(this.projectDetail.province), Number(this.projectDetail.city)])
      this.areaOptions = [Number(this.projectDetail.province), Number(this.projectDetail.city), Number(this.projectDetail.district)]
    },
    handleItemChange (val) {
      this.getNodes(val)
    },
    addHandleItemChange () {
      this.projectDetail.province = String(this.areaOptions[0])
      this.projectDetail.city = String(this.areaOptions[1])
      this.projectDetail.district = String(this.areaOptions[2])
      let currentLabels = this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels
      let address = ''
      for (let i = 0; i < currentLabels.length; i++) {
        address += currentLabels[i]
      }
      this.provinceAddress = address
      this.dtTypeChange()
    },
    async getNodes (val) {
      let idArea
      let sizeArea
      if (!val) {
        idArea = null
        sizeArea = 0
      } else if (val.length === 1) {
        idArea = val[0]
        sizeArea = val.length // 3:一级 4:二级 6:三级
      } else if (val.length === 2) {
        idArea = val[1]
        sizeArea = val.length // 3:一级 4:二级 6:三级
      }
      let response = await context.http.get('/ywm/api/district-codes/parentId', { parentId: idArea })
      if (response.status === 200) {
        if (response.data) {
          let Items = response.data
          if (sizeArea === 0) { // 初始化 加载一级 省
            this.cascaderData = Items.map((value, i) => {
              return {
                id: value.id,
                name: value.name,
                cities: []
              }
            })
          } else if (sizeArea === 1) { // 点击一级 加载二级 市
            this.cascaderData.map((value, i) => {
              if (value.id === val[0]) {
                if (!value.cities.length) {
                  value.cities = Items.map((value, i) => {
                    return {
                      id: value.id,
                      name: value.name,
                      cities: []
                    }
                  })
                }
              }
            })
          } else if (sizeArea === 2) { // 点击二级 加载三级 区
            this.cascaderData.map((value, i) => {
              if (value.id === val[0]) {
                value.cities.map((value, i) => {
                  if (value.id === val[1]) {
                    if (!value.cities.length) {
                      value.cities = Items.map((value, i) => {
                        return {
                          id: value.id,
                          name: value.name
                        }
                      })
                    }
                  }
                })
              }
            })
          }
          this.$forceUpdate()
          // ++this.isResouceShow // 进行重新渲染Cascader
        } else {
          console.log(response.data.msg)
        }
      }
    },
    async imageChange (event) {
      this.errorField = false
      let path = ''
      let files = event.target.files
      if (files.length > 0) {
        if (files[0].size > (1024 * 1024 * 3) || (files[0].type !== 'image/png' && files[0].type !== 'image/jpeg')) {
          this.errorField = true
          this.errorTip = '上传图片格式不正确'
          return
        }
        let form = new FormData()
        form.append('file', files[0])
        context.http.post('/ywm/api/image-multipart', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          path = res.data
          this.projectDetail.previewImage = path
        }).catch(error => {
          console.info(error)
        })
      }
    },
    // 获取建筑结构枚举
    async buildingStructure () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=建筑结构')
      if (result.data) {
        this.buildingStructureOptions = []
        this.buildingStructureOptions = this.optionFor(result.data)
      }
    },
    // 获取建筑外立面枚举
    async buildingFacade () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=建筑外立面')
      if (result.data) {
        this.buildingFacadeOptions = []
        this.buildingFacadeOptions = this.optionFor(result.data)
      }
    },
    // 获取消防系统枚举
    async fireFightingSystem () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=消防系统')
      if (result.data) {
        this.fireFightingSystemOptions = []
        this.fireFightingSystemOptions = this.optionFor(result.data)
      }
    },
    // 获取供水系统枚举
    async waterSupplySystem () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=供水系统')
      if (result.data) {
        this.waterSupplySystemOptions = []
        this.waterSupplySystemOptions = this.optionFor(result.data)
      }
    },
    // 获取绿色环保枚举
    async greenEnvironmentProtection () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=绿色环保')
      if (result.data) {
        this.greenEnvironmentProtectionOptions = []
        this.greenEnvironmentProtectionOptions = this.optionFor(result.data)
      }
    },
    // 循环
    optionFor (data) {
      let arr = []
      data.forEach(v => {
        arr.push({
          name: v.value,
          value: v.id.toString()
        })
      })
      return arr
    },
    getDataAuthorityOptions () { // 统一请求项目列表
      context.http.get('cms/api/project-managements', { page: 0, size: 100, sort: 'desc', useStatus: 'USING' }).then(res => {
        this.$store.dispatch('projectManagementsAction', res.data)
      })
    },
    confirm (formName) {
      let f = this.projectDetail.projectCycles.every((item, index) => {
        return item.cycle && item.cycle !== ''
      })
      let flag = this.projectDetail.projectCycles.every((item, index) => {
        return item.endWorkDate && item.endWorkDate !== ''
      })
      if (this.projectDetail.projectCycles.length) {
        let projectCycles = this.projectDetail.projectCycles
        projectCycles.forEach((v, i) => {
          projectCycles[i] = this.submitDataSelect(projectCycles[i])
        })
        this.projectDetail.projectCycles = projectCycles
      }
      if (this.tabIndex === 0) { // 项目档案编辑提交
        // if (this.projectDetail.startDate && !this.projectDetail.endDate || !this.projectDetail.startDate && this.projectDetail.endDate) {
        //   this.$message.error('请输入土地权使用时间')
        //   return
        // }
        let _this = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (!this.projectDetail.previewImage) {
              this.errorField = true
              this.errorTip = '请上传项目图片'
              return false
            }
            if (this.projectDetail.sortNumber === '') {
              this.$message.error('请输入项目排序值')
              return false
            }
            context.http.put('cms/api/project-managements', this.projectDetail).then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                _this.$emit('query', false)
                this.getDataAuthorityOptions()
                this.showEditBtn = true
                this.onHide()
                this.$emit('handleEdit', 0, this.projectDetail.id)
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else { // 项目主要经济指标编辑提交
        context.http.put('cms/api/project-managements', this.projectDetail).then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            // this.$emit('drawerClose', false)
            // this.$emit('query', false)
            this.showEditBtn = true
            this.$emit('handleEdit', 0, this.projectDetail.id)
          }
        })
      }
    },
    parameTransferred (data, CCTstr) {
      let arr = []
      data.forEach(v => {
        if (CCTstr.includes(v.value)) {
          arr.push(v.name)
        }
      })
      CCTstr = CCTstr.toString()
      arr = arr.toString()
      return { arr, CCTstr }
    },
    addPipeline (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.enclosureList.length === 0) {
            this.$message.error('请上传资料附件！')
            return
          }
          this.meansData.projectManagementId = this.projectDetail.id
          this.meansData.annexURL = this.enclosureList[0].annexURL
          this.meansData.annexName = this.enclosureList[0].annexName
          context.http.post('cms/api/project-managements/annexes', this.meansData).then(res => {
            if (res.status === 200 || res.status === 201) {
              this.flowDialogVisible = false
              this.getAnnexesList()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    uploadData () {
      this.flowDialogVisible = true
      this.meansData = {}
      this.enclosureList = []
    },
    dtTypeChange () {
      this.geoCode()
    },
    onHide () {
      // map.destroy()
      this.$refs['fromDetail'].resetFields()
      this.tabIndex = 0
      this.showEditBtn = true
      this.$emit('drawerClose', false)
      localStorage.setItem('tabIndex', 1)
      this.tab2Index = 1
    },
    cancel () {
      this.showEditBtn = true
      this.readOnly = true
      this.$emit('handleEdit', 0, this.projectDetail.id)
    },
    async onEdit () {
      this.showEditBtn = false
      this.readOnly = false
      this.getProjectClass()
      this.getOrganizeOptions()
      this.setAreaOptionsDefault()
    },
    async getProjectClass () {
      let result = await context.http.get('/uaa/api/paramet-managements/name', { name: '项目分类' })
      this.projectClassOptions = result.data
      const projectManagementType = this.projectClassOptions.filter(item => item.id === this.projectDetail.projectManagementTypeId)
      if (!projectManagementType.length) {
        this.projectClassOptions.push({
          id: this.projectDetail.projectManagementTypeId,
          value: this.projectDetail.projectManagementTypeName
        })
      }
    },
    timeReturn (time, note) {
      let date = new Date(time)
      let m = date.getMonth() + 1
      m = m.toString().length === 2 ? m : `0${m}`
      let d = date.getDate()
      d = d.toString().length === 2 ? d : `0${d}`
      return `${date.getFullYear()}-${m}-${d}T${note || '00:00:00'}`
    },
    numberChinese (number) {
      // eslint-disable-next-line one-var
      var units = '个十百千万@#%亿^&~'
      var chars = '零一二三四五六七八九'
      var a = (number + '').split('')
      var s = []
      if (a.length > 12) {
        throw new Error('too big')
      } else {
        for (var i = 0, j = a.length - 1; i <= j; i++) {
          if (j === 1 || j === 5 || j === 9) { // 两位数 处理特殊的 1*
            if (i === 0) {
              if (a[i] !== '1') s.push(chars.charAt(a[i]))
            } else {
              s.push(chars.charAt(a[i]))
            }
          } else {
            s.push(chars.charAt(a[i]))
          }
          if (i !== j) {
            s.push(units.charAt(j - i))
          }
        }
      }
      // return s;
      return s.join('').replace(/零([十百千万亿@#%^&~])/g, function (m, d, b) { // 优先处理 零百 零千 等
        b = units.indexOf(d)
        if (b !== -1) {
          if (d === '亿') return d
          if (d === '万') return d
          if (a[j - b] === '0') return '零'
        }
        return ''
      }).replace(/零+/g, '零').replace(/零([万亿])/g, function (m, b) { // 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
        return b
      }).replace(/亿[万千百]/g, '亿').replace(/[零]$/, '').replace(/[@#%^&~]/g, function (m) {
        return { '@': '十', '#': '百', '%': '千', '^': '十', '&': '百', '~': '千' }[m]
      }).replace(/([亿万])([一-九])/g, function (m, d, b, c) {
        c = units.indexOf(d)
        if (c !== -1) {
          if (a[j - c] === '0') return d + '零' + b
        }
        return m
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.project-details {
  .ecoIndicators {
    .cycleIndex {
      padding: 15px 20px;
      height: 40px;
      > span {
        padding: 5px 20px;
        border: 1px solid #666;
        color: #666;
        cursor: pointer;
        margin-right: 15px;
        &.active {
          border: 1px solid #3575f6;
          color: #3575f6;
        }
      }
    }
  }
  .addCycle {
    display: flex;
    flex-direction: row-reverse;
    padding: 0 15px;
    margin-bottom: 15px;
    align-items: center;
    > span {
      cursor: pointer;
      font-size: 12px;
      color: #3575f6;
      > i {
        font-size: 12px;
      }
      > span {
        text-decoration: underline;
      }
    }
  }
  .cycle {
    padding: 0 15px;
    .body {
      ul {
        li {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          > div {
            width: 20%;
            font-size: 14px;
            color: #777777;
            text-align: center;
            > span {
            }
            .iconfont {
              color: #ed0000;
              cursor: pointer;
            }
          }
        }
      }
    }
    .head {
      height: 40px;
      background: #f7f8fa;
      display: flex;
      align-items: center;
      justify-content: space-between;
      > span {
        width: 20%;
        font-size: 14px;
        color: #777777;
        text-align: center;
      }
    }
  }
}
</style>
<style lang="scss">
@import "../../../../style/mixins.scss";
.ecoIndicators {
  min-height: 500px;
  margin-top: 15px;
  margin-bottom: 100px;
  background-color: #fff;
  .el-form {
    padding-top: 10px;
  }
  .el-form-item {
    width: 30%;
    margin-left: 20px;
    // margin-right: 16px;
    .el-form-item__content {
      span {
        // display: inline-block;
        // width: 100%;
        // height: 40px;
        // line-height: 40px;
      }
    }
  }
  .div_title{
    padding: 6px 20px;
    margin-bottom: 4px;
    h3{
      padding-left: 20px;
      font-size: 16px;
      position: relative;
      border-bottom: 1px solid #eee;
      padding-bottom: 6px;
    }
    h3::before{
      content: ' ';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 22px;
      background: #4381F7;
    }
  }
  .segmentation{
    height: 12px;
    background: #f7f7f7;
  }
}
.project-details {
  .drawer-head {
    margin: 15px 0 0 0;
    padding: 0 20px 20px 20px;
  }
  .dweditbtn {
    right: 20px !important;
  }
  .fileOn {
    .title {
      height: 40px;
      line-height: 40px;
      background-color: #fff;
      padding: 0 15px;
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      color: #262626;
    }
    .aliUpload {
      .oss_file {
        border-radius: 4px;
        height: 30px;
        line-height: 30px;
      }
    }
    .tableDiv {
      // padding: 0 20px;
      .search-div {
        display: inline-flex;
        background-color: #fff;
        width: 100%;
        position: relative;
        padding: 15px 0 15px 20px;
        .el-select {
          width: 200px;
          margin-right: 10px;
        }
        .el-input {
          // width: 200px;
          margin-right: 10px;
        }
        .query-btn {
          width: 100px;
          margin: 0;
        }
        .upload {
          position: absolute;
          right: 20px;
          color: #0f75ff;
          display: inline-block;
          border: 1px solid #0f75ff;
          font-size: 12px;
          border-radius: 4px;
          padding: 2px 4px;
          cursor: pointer;
        }
      }
      .el-table {
        padding: 0 20px;
      }
      .el-table__header {
        border: none;
      }
      .el-table__header thead tr th {
        background-color: #f7f8fa;
        border: none;
      }
      thead {
        background-color: #f7f8fa;
        border: none;
        color: #777 !important;
        font-weight: normal !important;
      }
      .el-table__row {
        .cell {
          display: flex;
          justify-content: center;
          // background-color: #F7F8FA;
        }
      }
      .elreadOnly,
      .elEdit {
        display: inline-flex;
        justify-content: center;
        i,
        div {
          cursor: pointer;
        }
      }
      .elEdit {
        span {
          cursor: pointer;
          margin: 0 5px;
        }
      }
    }
  }
  .tab {
    // margin: 10px 0;
    // padding: 0 30px;
    display: flex;
    justify-content: space-between;
    span {
      display: inline-block;
      width: 175px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border: 1px solid #3175f6;
      color: #596483;
      cursor: pointer;
      font-size: 16px;
    }
    .active {
      color: #ffffff;
      background-color: #3175f6;
    }
    div:first-child {
      display: flex;
      // :first-child {
      //   border-right: none;
      //   border-top-left-radius: 8px;
      //   border-bottom-left-radius: 8px;
      // }
      // :last-child {
      //   border-left: none;
      //   border-top-right-radius: 8px;
      //   border-bottom-right-radius: 8px;
      // }
    }
    div:last-child {
      font-size: 12px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      .icon-edit2 {
        width: 15px;
        height: 20px;
        margin-right: 4px;
        background: url(../../../../assets/edit.png) no-repeat;
        background-size: contain;
      }
    }
    .info_tab {
      height: 48px;
      width: 100%;
      padding: 0 20px;
      display: -ms-flexbox;
      display: flex;
      background-color: #fff;
      -ms-flex-pack: justify;
      justify-content: space-between;
      -ms-flex-align: center;
      align-items: center;
      border-bottom: 1px solid #ecedef;

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
  .tab2 {
    margin: 10px 0 20px 0;
    padding: 0 30px 0 16px;
    display: flex;
    justify-content: space-between;
    > div {
      > span {
        display: inline-block;
        width: 100px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        border: 1px solid #eaeaea;
        color: #777777;
        cursor: pointer;
        font-size: 14px;
      }
    }
    .noborderleft {
      border-left: none;
    }
    .noborderright {
      margin-right: none;
    }
    .active {
      color: #3575f6;
      background-color: #eef4ff;
      border: 1px solid #9fbfff;
    }
    div:first-child {
      display: flex;
      :first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      :last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
    div:last-child {
      font-size: 12px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      .icon-edit2 {
        width: 15px;
        height: 20px;
        margin-right: 4px;
        background: url(../../../../assets/edit.png) no-repeat;
        background-size: contain;
      }
    }
  }
  .drawer-head {
    border-bottom: 1px solid #ddd;
  }
  .post-details {
    width: 1000px;
    background: #f7f7f7;
    .main-content {
      overflow-y: scroll;
      margin: 0;
      border: none;
      @include scrollBarStyle;
      .cttitle {
        margin-bottom: 0;
        line-height: 26px;
        + span {
          color: #262626 !important;
          display: inline-block;
          min-height: 16px;
        }
      }
    }
  }
  .dc-right {
    width: 100%;
    margin-top: 15px;
    .dr-head {
      background-color: #fff;
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
      font-size: 16px;
      margin-bottom: 10px;
      font-weight: bold;
      border-bottom: 1px solid #f6f6f6;
    }
    .el-form-item {
      width: 21%;
      margin-left: 20px;
      margin-right: 10px;
      &:nth-of-type(4n) {
        // margin-right: 0;
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
    .inlinediv {
      display: inline-block;
      height: 91px;
      vertical-align: bottom;
      margin-right: 0px;
      width: 595px;
      .el-form-item {
        width: auto;
        margin-left: 0;
        margin-right: 0 !important;
      }
      .dateline {
        display: inline-block;
        width: 20px;
        border-bottom: 1px solid #bbbbbd;
        position: relative;
        left: 1px;
      }
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 200px;
    }
    .longdiv {
      display: inline-block;
      height: 91px;
      width: 30%;
      margin-right: 40px;
      .el-form-item {
        width: 100%;
      }
    }
    .map {
      width: 965px;
      height: 200px;
      border: 1px solid #ddd;
    }
    .construction {
      border-bottom: 1px solid #eeeeee;
      background-color: #fff;
      padding-top: 15px;
      &:first-child {
        padding-bottom: 15px;
        padding-top: 0;
      }
      &:last-child {
        border: none;
      }
      &.bgColor {
        background-color: #f7f8fa;
      }
    }
    .relatedinfor-table {
      padding: 0 16px;
      .table-ul {
        background: #fff;
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 40px;
        font-size: 14px;
        &:first-child {
          background: #f7f8fa;
        }
        li {
          width: 16%;
          text-align: center;
          overflow: hidden; /*超出部分隐藏*/
          white-space: nowrap; /*不换行*/
          text-overflow: ellipsis; /*超出部分文字以...显示*/
        }
        .operating {
          color: #3575f6;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
  .el-form-item {
    display: inline-block;
    vertical-align: top;
  }
  .el-select {
    width: 100%;
  }
  .el-select .el-select__tags {
    max-width: 68% !important;
  }
  .preview-title {
    margin-left: 16px;
    font-size: 14px;
  }
  .preview-wrap {
    display: flex;
    justify-content: flex-start;
    margin-top: 10px;
    .preview {
      width: 160px;
      height: 200px;
      border: 1px solid #ddd;
      margin: 0 30px 0 0;
      cursor: pointer;
      &:hover {
        .pw-bottom {
          background-color: #262626;
          display: block;
          span {
            position: absolute;
            bottom: 3px;
            color: #fff !important;
            left: 36%;
          }
        }
      }
      .pw-bottom {
        display: none;
        position: absolute;
        background-color: #262626;
        opacity: 0.7;
        text-align: center;
        color: #fff;
        width: 100%;
        height: 20px;
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
      .map {
        width: 684px;
        height: 200px;
        border: 1px solid #ddd;
      }
      .iconfont {
        position: absolute;
        top: -10px;
        right: -10px;
      }
    }
    + p {
      font-size: 12px;
      color: #777;
      margin: 0 0 10px 0;
    }
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
  .el-form-item__content {
    span {
      font-size: 14px !important;
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
  .defaultbtn {
    width: 90px !important;
    margin-left: 0 !important;
  }
  .dtAddmore {
    position: absolute;
    top: 20px;
    z-index: 99;
  }
  .construction {
  }
  .el-textarea textarea {
    height: 34px !important;
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
      margin: 10px 0;
      background-color: #fff;
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
.enclosureDialog {
  .dl-subtitle {
    display: inline-flex;
    align-items: center;
    width: 100%;
    margin-top: 20px;
  }
  .el-form-item {
    margin: 0 0 0 10px;
    width: 83%;
    .el-select {
      width: 100%;
    }
  }
  i {
    cursor: pointer;
  }
  .aliUpload {
    margin-left: 10px;
  }
  .enclosure {
    height: 28px;
    line-height: 28px;
    margin-left: 10px;
  }
  .el-dialog {
    background: #f7f7f7;
  }
  .el-dialog__header {
    border: none;
    background: #fff;
    margin: 0;
    padding: 20px;
    color: #262626;
    .el-dialog__title {
      font-size: 16px;
      font-weight: bold;
    }
  }
  .el-dialog__body {
    background: #fff;
    margin: 15px 0 15px 0;
    padding: 0 20px !important;
    border: none;
  }
  .el-dialog__footer {
    background: #fff;
  }
  .el-input__inner {
    height: 32px;
  }
  .el-input__icon {
    line-height: 32px;
  }
  .enclosure {
    margin-bottom: 0;
    div {
    }
  }
  .close-button {
    background-color: #fff !important;
    border: none;
    &:hover {
      background-color: #fff !important;
      color: #3575f6 !important;
    }
  }
  .defaultbtn {
    width: 90px !important;
  }
}
</style>
