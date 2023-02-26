<template>
  <div class="potClienDetails intention-tenant">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="details-content"
           slot="drawer">
        <div class="main-content"
             style="padding: 0 20px;">
          <div class="contentLeft">
            <el-form :model="draweDetaileData"
                     ref="draweDetaileData"
                     :rules="TenantDTORules">
              <div class="yxInfo">
                <div class="title">
                  <span><i class="icon"></i>意向客户档案</span>
                  <i class="iconfont icon-cms_bianji-"
                     style="color:#3575F6;font-weight: normal;cursor:pointer;font-size: 14px;"
                     @click="yxInfoEdit=!yxInfoEdit"
                     v-if="hasAuthority('02020403') && !yxInfoEdit">
                    <span style="font-size:12px;margin-left:3px">编辑</span>
                  </i>
                </div>
                <div class="itemContent">
                  <div class="item firstItem"
                       v-if="!yxInfoEdit">
                    <span class="name">{{draweDetaileData.referred}}</span>
                    <span v-if="!draweDetaileData.beTenant && !yxInfoEdit && hasAuthority('02020405')"
                          @click="toBeTenement"
                          class="btn">转为客户</span>
                  </div>
                  <div class="item"
                       :class="{'itemEdit':yxInfoEdit}">
                    <span>项目<i>*</i></span>
                    <div>
                      <span v-if="!yxInfoEdit">{{draweDetaileData.projectManagementDTO.referred}}</span>
                      <el-form-item prop="projectManagementId"
                                    v-else>
                        <el-select value-key="id"
                                   size="small"
                                   style="width:100%"
                                   v-model="draweDetaileData.projectManagementDTO">
                          <el-option v-for="item in options2"
                                     :key="item.id"
                                     :label="item.referred"
                                     :value="item">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="item"
                       :class="{'itemEdit':yxInfoEdit}">
                    <span>意向客户类型<i>*</i></span>
                    <div>
                      <span v-if="!yxInfoEdit">{{draweDetaileData.customerType==='COMPANY'?'企业':'个人'}}</span>
                      <div style="display:flex;"
                           v-else>
                        <el-radio v-model="draweDetaileData.customerType"
                                  label="COMPANY">企业</el-radio>
                        <el-radio v-model="draweDetaileData.customerType"
                                  label="PERSONAL">个人</el-radio>
                      </div>
                    </div>
                  </div>
                  <div class="item"
                       :class="{'itemEdit':yxInfoEdit}">
                    <span>{{draweDetaileData.customerType==='COMPANY'?'企业名称':'姓名'}}<i>*</i></span>
                    <div>
                      <span v-if="!yxInfoEdit">{{draweDetaileData.yxTenantName}}</span>
                      <el-form-item prop="yxTenantName"
                                    v-else>
                        <el-input size="small"
                                  v-model="draweDetaileData.yxTenantName"
                                  maxlength="50"
                                  onblur="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="item"
                       :class="{'itemEdit':yxInfoEdit}">
                    <span>品牌名称<i>*</i></span>
                    <div>
                      <span v-if="!yxInfoEdit">{{draweDetaileData.referred}}</span>
                      <el-form-item prop="referred"
                                    v-else>
                        <el-input v-model="draweDetaileData.referred"
                                  maxlength="20"
                                  size="small"
                                  onblur="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="item"
                       :class="{'itemEdit':yxInfoEdit}">
                    <span>用途<i>*</i></span>
                    <div>
                      <span v-if="!yxInfoEdit">{{draweDetaileData.tenantUseDescription}}</span>
                      <el-form-item prop="tenantUse"
                                    v-else>
                        <el-select v-model="draweDetaileData.tenantUse"
                                   value-key="value"
                                   style="width:100%"
                                   @change="industry(draweDetaileData.tenantUse, 'change')"
                                   size="small">
                          <el-option v-for="item in tenantUseList"
                                     :key="item.value"
                                     :label="item.label"
                                     :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="item"
                       :class="{'itemEdit':yxInfoEdit}">
                    <span>行业<i>*</i></span>
                    <div>
                      <span v-if="!yxInfoEdit">{{draweDetaileData.industryName}}</span>
                      <el-form-item prop="industryId"
                                    v-else>
                        <el-select v-model="draweDetaileData.industryId"
                                   value-key="id"
                                   style="width:100%"
                                   size="small"
                                   @change="industryChange">
                          <el-option v-for="item in industryList"
                                     :key="item.id"
                                     :label="item.value"
                                     :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="item"
                       :class="{'itemEdit':yxInfoEdit}">
                    <span>需求面积/m²<i>*</i></span>
                    <div>
                      <span v-if="!yxInfoEdit">{{draweDetaileData.lowArea}}-{{draweDetaileData.highArea}}m²</span>
                      <span v-else
                            style="display:flex;align-items: center;border: 1px solid #dcdfe6; border-radius: 4px;">
                        <el-form-item prop="lowArea">
                          <el-input v-model="draweDetaileData.lowArea"
                                    style="width:130px"
                                    class="noborder"
                                    size="small"
                                    onkeyup="value=value.replace(/[^0-9\.]/g,'')"></el-input>
                        </el-form-item>
                        <span style="margin:0 5px;color:#999;display: inline-block">—</span>
                        <el-form-item prop="highArea">
                          <el-input v-model="draweDetaileData.highArea"
                                    class="noborder"
                                    style="width:130px"
                                    size="small"
                                    onkeyup="value=value.replace(/[^0-9\.]/g,'')"></el-input>
                        </el-form-item>
                      </span>
                    </div>
                  </div>
                  <div class="item"
                       :class="{'itemEdit':yxInfoEdit}">
                    <span>心理价位<i>*</i></span>
                    <!-- border: 1px solid #dcdfe6; border-radius: 4px; -->
                    <div :class="{hasBorder:yxInfoEdit}">
                      <span v-if="!yxInfoEdit">{{draweDetaileData.lowPrice}}-{{draweDetaileData.highPrice}} {{draweDetaileData.priceUnit==='M2DAYS'?'元/m²·天':draweDetaileData.priceUnit==='MONTH'?'元/月':'元/年'}}</span>
                      <span v-else>
                        <el-input v-model="draweDetaileData.lowPrice"
                                  class="noborder"
                                  style="width:70px"
                                  size="small"
                                  onkeyup="value=value.replace(/[^0-9\.]/g,'')"></el-input>
                        <span style="margin:0 5px;color:#999">—</span>
                        <el-input v-model="draweDetaileData.highPrice"
                                  style="width:70px"
                                  size="small"
                                  class="noborder"
                                  onkeyup="value=value.replace(/[^0-9\.]/g,'')"></el-input>
                        <el-select v-model="draweDetaileData.priceUnit"
                                   size="small"
                                   class="noborder priceSelect"
                                   style="width:119px;">
                          <el-option v-for="(item,index) in options3"
                                     :key="index"
                                     :label="item.label"
                                     :value="item.value"></el-option>
                        </el-select>
                      </span>
                    </div>
                  </div>
                  <div class="item"
                       :class="{'itemEdit':yxInfoEdit}">
                    <span>预计开店时间</span>
                    <div>
                      <span v-if="!yxInfoEdit">{{draweDetaileData.signDate}}</span>
                      <el-date-picker value-format="yyyy-MM-dd"
                                      style="width:100%"
                                      size="small"
                                      v-model="draweDetaileData.signDate"
                                      v-else
                                      type="date"
                                      placeholder="选择日期">
                      </el-date-picker>
                    </div>
                  </div>
                  <div class="item"
                       :class="{'itemEdit':yxInfoEdit}">
                    <span>联系人<i>*</i></span>
                    <div>
                      <span v-if="!yxInfoEdit">{{draweDetaileData.contact}}</span>
                      <el-input v-else
                                size="small"
                                v-model="draweDetaileData.contact"></el-input>
                    </div>
                  </div>
                  <div class="item"
                       :class="{'itemEdit':yxInfoEdit}">
                    <span>联系电话<i>*</i></span>
                    <div>
                      <span v-if="!yxInfoEdit">{{draweDetaileData.telephone}}</span>
                      <el-form-item prop="telephone"
                                    v-else>
                        <el-input v-model="draweDetaileData.telephone"
                                  size="small"
                                  onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="item"
                       :class="{'itemEdit':yxInfoEdit}">
                    <span>跟进人<i>*</i></span>
                    <div>
                      <span v-if="!yxInfoEdit">{{followNameFormat(draweDetaileData.followId)}}</span>
                      <el-select v-else
                                 v-model="draweDetaileData.followId"
                                 style="width:100%"
                                 size="small"
                                 :disabled="!hasAuthority('02020404')"
                                 @change="changefN">
                        <el-option v-for="(item,index) in uesrName"
                                   :key="index"
                                   :label="item.name"
                                   :value="item.id">
                        </el-option>
                      </el-select>
                      <!-- <el-input  v-model="draweDetaileData.telephone" ></el-input> -->
                    </div>
                  </div>
                  <div class="item"
                       :class="{'itemEdit':yxInfoEdit}">
                    <span>意向客户来源</span>
                    <div>
                      <span v-if="!yxInfoEdit">{{draweDetaileData.customerSource}}</span>
                      <el-select v-else
                                 v-model="draweDetaileData.customerSourceId"
                                 value-key="id"
                                 size="small"
                                 style="width:100%"
                                 @change="customerSourceChange">
                        <el-option v-for="(item,index) in yxkhFrom"
                                   :key="index"
                                   :label="item.value"
                                   :value="item.id"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="item"
                       :class="{'itemEdit':yxInfoEdit}">
                    <span>状态</span>
                    <div>
                      <span v-if="!yxInfoEdit">{{draweDetaileData.using ? '使用中' : '已停用'}}</span>
                      <el-select v-else
                                 v-model="draweDetaileData.using"
                                 value-key="id"
                                 size="small"
                                 style="width:100%">
                        <el-option v-for="(item,index) in usingOptions"
                                   :key="value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div style="display:flex;flex-direction:row-reverse;padding: 0 20px 20px 0;">
                  <el-button type="primary"
                             v-if="yxInfoEdit"
                             size="small"
                             @click="yxInfoSave">保 存</el-button>
                  <el-button style="margin-right:15px"
                             v-if="yxInfoEdit"
                             size="small"
                             @click="yxInfoEdit=false;EditCannel()">取 消</el-button>
                </div>
              </div>
              <div class="intro">
                <div class="title">
                  <span><i class="icon"></i>意向客户简介</span>
                  <i class="iconfont icon-cms_bianji-"
                     style="color:#3575F6;font-weight: normal;cursor:pointer;font-size: 14px;"
                     @click="introEdit=!introEdit"
                     v-if="hasAuthority('02020403') && !introEdit">
                    <span style="font-size:12px;margin-left:3px">编辑</span>
                  </i>
                </div>
                <div class="content">
                  <div class="item">
                    <span>意向客户网站</span>
                    <div>
                      <span v-if="!introEdit"
                            style="text-decoration: underline; color: #3575F6;cursor: pointer;"
                            @click="openUrl(draweDetaileData.website)">
                        {{draweDetaileData.website}}
                      </span>
                      <el-input v-else
                                size="small"
                                v-model="draweDetaileData.website"
                                maxlength="50"></el-input>
                    </div>
                  </div>
                  <div class="item">
                    <span>意向客户简介</span>
                    <div>
                      <div style="width:100%;word-wrap: break-word;word-break: normal;font-size: 14px;color: #262626;"
                           v-if="!introEdit"
                           v-html="formatreplace(draweDetaileData.introduction)"></div>
                      <el-input v-else
                                type="textarea"
                                resize='none'
                                maxlength="200"
                                :rows='3'
                                placeholder="请输入内容(200字以内）"
                                v-model="draweDetaileData.introduction">
                      </el-input>
                    </div>
                  </div>
                  <div class="item">
                    <span>档案文件</span>
                    <div style="display: flex;justify-content: space-between;align-items: center;">
                      <aliUpload class="aliUpload deviceDetails"
                                 :upLoadText="draweDetaileData.annexes.length>0?'继续上传':'上传文件'"
                                 :fileType="fileType_cost"
                                 :iconShow="false"
                                 :iconImg="iconImg"
                                 :uploadIcon="true"
                                 v-if="introEdit"
                                 @setAnnex="setAnnex" />
                      <div class="annexList"
                           :style="{width:!introEdit?'100%':'70%'}">
                        <div v-for="(item, index) in draweDetaileData.annexes"
                             :key="index">
                          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{item.annexName}}</span>
                          <!-- <i v-if="!introEdit"
                             @click="downloadFile(item, index)"
                             class="iconfont icon-xiazaidaoru"></i> -->
                          <aliDownLoad class="aliDownLoad1"
                                       v-if="!introEdit"
                                       :item="item"
                                       :encrypt="true" />
                          <i v-else
                             @click="deleFile(item, index)"
                             class="iconfont icon-lajixiang"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style="display:flex;flex-direction:row-reverse;padding: 0 20px 20px 0;">
                  <el-button type="primary"
                             v-if="introEdit"
                             size="small"
                             @click="introSave">保 存</el-button>
                  <el-button style="margin-right:15px"
                             v-if="introEdit"
                             size="small"
                             @click="introEdit=false;EditCannel()">取 消</el-button>
                </div>
              </div>
              <!-- <div class="project">
                <div class="title"><span>房源工程条件</span><i class="editBtn"
                     @click="projectEdit=!projectEdit"
                     v-if="hasAuthority('02020403')"></i></div>
                <div class="itemContent"
                     :key="keyVersions">
                  <div class="item"
                       v-for="(item,index) in project"
                       :key="index"
                       v-show="item.isChecked||projectEdit">
                    <el-checkbox style="margin-right:15px"
                                 @change="(value) => changeHandler(value,item,index)"
                                 :checked="item.isChecked"
                                 :disabled="!projectEdit"></el-checkbox>
                    <span style="display:inline-block;width:120px;margin-right:15px">{{item.value}}</span>
                    <el-input v-if="projectEdit"
                              v-model="item.needValue"
                              :disabled="!item.isChecked"
                              style="width:150px;margin-right:15px"></el-input>
                    <span v-else
                          style="display:inline-block;width:150px;text-align:center">{{item.needValue===''?'-':item.needValue}}</span>
                    <span>{{item.description}}</span>
                  </div>
                </div>
                <div v-if="draweDetaileData.projectConditions && draweDetaileData.projectConditions.length===0 && !projectEdit"
                     style="padding: 20px;">暂无数据</div>
                <div style="display:flex;flex-direction:row-reverse;padding: 0 20px 20px 0;">
                  <el-button type="primary"
                             v-if="projectEdit"
                             @click="yxInfoSave">保 存</el-button>
                  <el-button style="margin-right:15px"
                             v-if="projectEdit"
                             @click="projectEdit=false">关 闭</el-button>
                </div>
              </div> -->
            </el-form>
          </div>
          <div class="contentRight">
            <div class="title">
              <span>
                <i class="icon"></i>
                <!-- <span>意向客户档案</span> -->
                最新跟进人：{{draweDetaileData.newFollowName}}
              </span>
              <span style="font-weight: normal;">
                <span style="font-size:14px;color:#777777">招商进度：</span>
                {{dealOddsFormat(draweDetaileData.dealOdds)}}
              </span>
            </div>
            <div class="tab">
              <div>
                <span v-for="(item,index) in menuTab"
                      :key="index"
                      :class="{'active':contentRightTabIndex===index}"
                      @click="tabChange(index)">{{item}}</span>
              </div>
              <i @click="storeStateEdit=!storeStateEdit"
                 v-if="contentRightTabIndex===1 && tableData.length>0 && !storeStateEdit">
                <i class="iconfont icon-edit"></i>
                修改当前状态</i>
              <div style=""
                   v-else>
                <el-button style="margin-right:15px"
                           size="small"
                           v-if="storeStateEdit"
                           @click="storeCannel">取 消</el-button>
                <el-button type="primary"
                           size="small"
                           v-if="storeStateEdit"
                           @click="storeStateSave">保 存</el-button>
              </div>
            </div>
            <div v-if="contentRightTabIndex===0"
                 class="tableDiv"
                 style="padding-left: 150px; padding-top: 10px;">
              <span @click="addProgressFn"
                    class="addProgress"
                    style="z-index: 100;">
                <i class="iconfont icon-cms_xiegenjin-1"></i>
                写跟进
              </span>
              <!-- <el-timeline :reverse="reverse" class="timeline"> -->
              <el-timeline class="timeline">
                <el-timeline-item placement="top"
                                  style="position:relative;"
                                  v-for="(item, index) in timeLineListData"
                                  :key="index"
                                  :color="nodeColor(index)">
                  <!-- :timestamp="item.followTime.replace('T','  ')" -->
                  <div class="statusBox">
                    <div class="tjsh">{{formatTimeLineTitle(item.followRecordType)}}</div>
                    <div :class="{'first':index===0}">{{formatApprovalDate(item.followTime)}}</div>
                  </div>
                  <div class="template">
                    <p><span>{{item.followRecordType==='INPUT'?'录入人':'跟进人'}}：</span><span>{{item.followName}}</span></p>
                    <p v-if="item.followRecordType==='FOLLOW'"><span>跟进记录：</span><span v-html="formatreplace(item.followContent)"></span></p>
                    <p v-if="item.followRecordType==='FOLLOW' && item.yxRooms!==''"><span>意向房源：</span><span :title="item.yxRooms"
                            style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{item.yxRooms}}</span></p>
                    <p v-if="item.followRecordType==='FOLLOW' && item.price!==''&& item.price"><span>报价：</span><span>{{item.price}} {{item.priceUnit==='M2DAYS'?'元/m²·天':item.priceUnit==='MONTH'?'元/月':'元/年'}}</span></p>
                    <p v-if="item.followRecordType==='FOLLOW' && item.leaseYear!==''"><span>租赁年限：</span><span>{{item.leaseYear}}年</span></p>
                    <p v-if="item.followRecordType==='FOLLOW' && item.increment!==''"><span>递增：</span><span>{{item.increment}}</span></p>
                    <p v-if="item.followRecordType==='INPUT'">录入了一个意向客户</p>
                    <p v-if="item.followRecordType==='PROCESS_RUNING'">{{item.yxTenantDTO.referred}}的合同审批中</p>
                    <p v-if="item.followRecordType==='PROCESS_AGREED'">{{item.yxTenantDTO.referred}}的合同审批通过</p>
                    <div v-if="item.followRecordType==='FOLLOW' && item.annexes.length!==0"
                         style="display:flex;">
                      <!-- <span style="width:75px;">附件：</span> -->
                      <div style="flex:1">
                        <div class="enclosure-list"
                             v-for="(item1, index1) in item.annexes"
                             :key="index1">
                          <div style="color:#005CB3;font-size:12px;display:flex"
                               class="el-item">
                            <span>{{item1.annexName}}</span>
                            <span style="display:flex;margin-left:10px;"
                                  v-if="item1.annexName">
                              <aliDownLoad class="aliDownLoad1"
                                           style="margin-right:15px"
                                           :item="item1"
                                           :encrypt="true" />
                              <ailPreview :ailObj="item1"
                                          :encrypt="true"
                                          @setFile="setFile" />
                              <!-- <i style="font-size:14px;cursor:pointer;line-height:17px;" @click="deleFile(item1, index1)"
                                 class="iconfont icon-lajixiang"
                                 v-if="yxInfoEdit"></i> -->
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
            <div v-if="contentRightTabIndex===1"
                 class="tableDiv details_table"
                 style="padding:0 15px">
              <el-table :data="tableData"
                        style="width: 100%">
                <el-table-column align="center"
                                 prop="yxTenant.projectManagement.referred"
                                 label="项目"></el-table-column>
                <el-table-column align="center"
                                 width="80"
                                 prop="rooms.building.buildingName"
                                 label="楼宇"></el-table-column>
                <el-table-column align="center"
                                 width="80"
                                 prop="rooms.floor.name"
                                 label="楼层"></el-table-column>
                <el-table-column align="center"
                                 width="120"
                                 prop="rooms.shopNumber"
                                 label="房源号"></el-table-column>
                <el-table-column align="center"
                                 prop="price"
                                 label="报价"
                                 :formatter="priceFormat"></el-table-column>
                <el-table-column align="center"
                                 label="当前状态">
                  <template slot-scope="scope">
                    <span v-if="!storeStateEdit">{{dealOddsFormat(scope.row.dealOdds)}}</span>
                    <span v-else>
                      <el-select v-model="scope.row.dealOdds">
                        <el-option v-for="(item,index) in storeStatusList"
                                   :key="index"
                                   :label="item.label"
                                   :disabled="item.disabled"
                                   :value="item.value"></el-option>
                      </el-select>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作"
                                 align="center"
                                 v-if="hasAuthority('02020402')">
                  <template slot-scope="scope">
                    <el-button class="el-button--primary operation-btn"
                               size="mini"
                               @click="shopDetails(scope.$index, scope.row)">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <!-- <div slot="footer" class="dialog-footer">
          <el-button @click="onHide('YxTenantDTO')" class="close-button">关闭</el-button>
          <el-button type="primary"  class="defaultbtn dialog-confirmBtn">确 定</el-button>
        </div> -->
    </drawer>

    <!-- 写跟进 -->
    <el-dialog title="跟进"
               width="800px"
               :visible.sync="addProgressFrom"
               @close="addProgressClose"
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
                              style="width:100%"
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
                         @change="imageChange($event)"></div>
              </div>
              <div class="enclosure-list"
                   v-for="(item, index) in followRecordDTOParams.annexes"
                   :key="index">
                <div class="el-item">
                  <span>{{item.annexName}}</span>
                  <span v-if="item.annexName">
                    <i @click="deleFile1(item, index,'flow')"
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
            <el-button @click="addProgressClose">关 闭</el-button>
          </div>
        </div>
      </el-form>
    </el-dialog>

    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>

<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import aliUpload from '@/components/aliUpload.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import * as hub from '@/service/eventHub'
import picturePrevie from '@/components/picturePrevie.vue'
import axios from 'axios'
import * as JSOG from 'jsog'
import ailPreview from '@/components/ailPreview.vue'
export default {
  name: 'potClienDtl',
  components: {
    Drawer,
    aliDownLoad,
    picturePrevie,
    aliUpload,
    ailPreview
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    draweDetaileData: {
      type: Object,
      default: function () {
        return {
          projectManagementDTO: {
            projectName: ''
          }
        }
      }
    },
    options2: {
      type: Array,
      default: []
    },
    timeLineListData: {

    },
    isAllYXtenant: {
      type: Boolean,
      default: true
    },
    project: {

    }
  },
  created () {
    this.uesrName = this.$store.state.usersList
    this.customerSource()// 客户来源
    // console.log(this.draweDetaileData)
  },
  data () {
    var checkPhone = (rule, value, callback) => {
      if (value) {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      } else {
        callback()
      }
    }
    return {
      addProgressFrom: false, // 新增更近记录
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
      addProgressRules: {
        followTime: [
          { required: true, message: '请填写跟进时间', trigger: 'change' }
        ],
        followContent: [
          { required: true, message: '请填写跟进记录', trigger: 'change' }
        ]
      },
      fileType_cost: [],
      iconImg: 'icon-shangchuanfujianicon',
      introEdit: false, // 简介编辑状态
      keyVersions: 0,
      yxkhFrom: [], // 客户来源列表
      reverse: true,
      storeStatusList: [
        { label: '无意向', value: 'ZERO', disabled: false },
        { label: '招商跟进中', value: 'FIFTY', disabled: false },
        { label: '签约审批中', value: 'NINETY', disabled: true },
        { label: '合同执行中', value: 'HUNDRED', disabled: true }
      ],
      tableData: [],
      contentRightTabIndex: 0,
      menuTab: ['跟进信息', '意向房源列表'],
      yxkhFromId: '',
      options3: [
        { label: '元/m²·天', value: 'M2DAYS' },
        { label: '元/月', value: 'MONTH' },
        { label: '元/年', value: 'YEAR' }
      ],
      options3Id: '',
      industryList: [],
      industryListId: '',
      yxInfoEdit: false, // 意向客户档案是否能编辑
      projectEdit: false, // 房源工程条件是否能编辑
      storeStateEdit: false, // 表格房源招商状态是否能编辑
      drawerTitle: '意向客户详情',
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
      yearsList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      activeName: 1,
      building: { // 房源房源信息

      },
      uesrName: [],
      switchTurn: false,
      selectSpan: [],
      organizationShow: false,
      filterText: '',
      orgListCopy: [],
      checkedKeys: [],
      activeNames: ['1'],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      showPicture: false,
      imgArr: [],
      num: 0,
      usingOptions: [{
        value: true,
        label: '使用中'
      }, {
        value: false,
        label: '已停用'
      }]
    }
  },
  mounted () {

  },
  watch: {
    draweDetaileData: {
      handler (newValue, oldValue) {
        this.draweDetaileData = newValue
        this.industry(this.draweDetaileData.tenantUse)
        this.projectConditionsFormat()
        this.contentRightTabIndex = 0
        this.queryOrganizeList()
        // console.log(this.project)
      },
      deep: true,
      immediate: true
    },
    filterText (val) {
      this.$refs.treeForm.filter(val)
    }
  },
  methods: {
    async industry (tenantUse, change) {
      let name = ''
      if (tenantUse === 'SHOP') {
        name = '业态'
      } else if (tenantUse === 'WORK') {
        name = '行业'
      } else {
        name = '菜场业态'
      }
      let result = await context.http.get(`/uaa/api/paramet-managements/name?name=${name}`)
      // const length = result.data.filter(item => Number(item.id) === Number(this.draweDetaileData.industryId)).length
      if (change) {
        this.draweDetaileData.industryId = ''
        this.draweDetaileData.industryName = ''
      }
      this.industryList = result.data
    },
    setFile (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    pictureClose () {
      this.showPicture = false
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
      this.followRecordDTOParams.yxTenantDTO = this.draweDetaileData
    },
    addFlowList () { // 新增更近记录
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
      this.followRecordDTOParams.yxTenantDTO = this.draweDetaileData
      this.$refs['followRecordDTOParams'].validate((valid) => {
        if (valid) {
          context.http.post('cms/api/followRecord', this.followRecordDTOParams).then(res => {
            context.http.get(`cms/api/followRecords/${this.followRecordDTOParams.yxTenantDTO.id}`).then(result => {
              this.$message({
                type: 'success',
                message: '新增成功'
              })
              this.addProgressFrom = false
              this.addProgressFromClose()
              this.addProgressClose()
              this.$emit('addFlowListSuccess', result.data) // 新增跟进成功 参数为跟进信息
              context.http.get(`cms/api/yxTenant/${this.draweDetaileData.id}`).then(res => {
                if (res) {
                  this.detaileData = res.data
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
    changeSwitch (val) {
      this.selectSpan = []
      this.$message({
        message: '切换成功',
        type: 'success'
      })
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
    addProgressClose () {
      this.filterText = ''
      this.addProgressFrom = false
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
    EditCannel () {
      this.$emit('refreshList', this.draweDetaileData)
    },
    shopDetails (index, row) {
      console.log(row.rooms.id)
      this.$emit('shopDetails', row.rooms.id)
    },
    openUrl (url) {
      if (url.indexOf('https://') === -1) {
        window.open('https://' + url)
      } else {
        window.open(url)
      }
    },
    introSave () {
      this.$refs['draweDetaileData'].validate((valid) => {
        if (valid) {
          context.http.put('cms/api/yxTenant', this.draweDetaileData).then(res => {
            this.yxInfoEdit = false
            this.introEdit = false
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.$emit('refreshList', data)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    setAnnex (annexURL, annexName) {
      // this.$set(this.draweDetaileData, 'coverImg', annexURL)
      this.draweDetaileData.annexes.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
    },
    formatreplace (description) {
      if (!description) {
        return
      }
      let html = description.replace(/\n/g, '<br/>')
      return html
    },
    async customerSource () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=客户来源')
      this.yxkhFrom = result.data
    },
    priceFormat (row, column) {
      let priceUnit = ''
      if (row.priceUnit === 'M2DAYS') {
        priceUnit = '元/m²·天'
      } else if (row.priceUnit === 'M2MONTH') {
        priceUnit = '元/m²·月'
      } else if (row.priceUnit === 'MONTH') {
        priceUnit = '元/月'
      } else if (row.priceUnit === 'YEAR') {
        priceUnit = '元/年'
      }
      if (row.price) {
        return row.price + priceUnit
      } else {
        return '-'
      }
    },
    changeHandler (value, item, index) {
      if (!value) {
        this.$set(this.project[index], 'needValue', null)
        this.$set(this.project[index], 'isChecked', false)
      } else {
        this.$set(this.project[index], 'needValue', '')
        this.$set(this.project[index], 'isChecked', true)
      }
      this.$forceUpdate()
    },
    projectConditionsFormat () {
      let projectData = this.draweDetaileData.projectConditions || []
      for (let i = 0; i < projectData.length; i++) {
        for (let k = 0; k < this.project.length; k++) {
          if (Number(projectData[i].projectType) === this.project[k].id) {
            this.$set(this.project[k], 'needValue', projectData[i].needValue ? projectData[i].needValue : '')
            this.$set(this.project[k], 'isChecked', true)
          }
        }
      }
      ++this.keyVersions
    },
    storeCannel () {
      this.storeStateEdit = false
      this.tabChange(1)
    },
    async toBeTenement () { // 转为客户
      let result = await context.http.get(`cms/api/yxTenantRooms/${this.draweDetaileData.id}`)
      if (result.data.length <= 0) {
        this.$message({
          message: '请先绑定意向房源',
          type: 'warning'
        })
        return
      }
      this.$router.push({ 'name': 'tenantInfo', params: { pageFrom: 'potClienDtl', addDataFromPotClienDtl: this.draweDetaileData } })
    },
    changefN () {
      for (let i = 0; i < this.uesrName.length; i++) {
        if (this.draweDetaileData.followId === this.uesrName[i].id) {
          this.draweDetaileData.followName = this.uesrName[i].name
        }
      }
    },
    followNameFormat (id) {
      for (let i = 0; i < this.uesrName.length; i++) {
        if (id === this.uesrName[i].id) {
          return this.uesrName[i].name
        }
      }
    },
    getProjectConditions () { // 便利工程条件格式
      let project = this.project
      this.draweDetaileData.projectConditions = []
      for (let i = 0; i < project.length; i++) {
        if (project[i].needValue || project[i].needValue === '') {
          this.draweDetaileData.projectConditions.push({
            projectType: project[i].id,
            needValue: project[i].needValue
          })
        }
      }
    },
    yxInfoSave () { // 意向客户档案保存
      this.$refs['draweDetaileData'].validate((valid) => {
        if (valid) {
          context.http.put('cms/api/yxTenant', this.draweDetaileData).then(res => {
            this.yxInfoEdit = false
            this.projectEdit = false
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            // this.draweDetaileData.projectConditions = res.data.projectConditions
            // this.projectConditionsFormat()
            this.$emit('refreshList', res.data)
            // this.dialogFormVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    customerSourceChange () { // 改变意向客户来源
      for (let i = 0; i < this.yxkhFrom.length; i++) {
        if (this.draweDetaileData.customerSourceId === this.yxkhFrom[i].id) {
          this.draweDetaileData.customerSource = this.yxkhFrom[i].value
          return
        }
      }
    },
    industryChange () { // 改变业态
      for (let i = 0; i < this.industryList.length; i++) {
        if (this.draweDetaileData.industryId === this.industryList[i].id) {
          this.draweDetaileData.industryName = this.industryList[i].value
          return
        }
      }
    },
    storeStateSave () { // 保存提交意向房源列表状态
      context.http.put('cms/api/yxTenantRooms/list', this.tableData).then(res => {
        this.storeStateEdit = false
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.$emit('refreshList')
        console.log(this.tableData)
      })
    },
    dealOddsFormat (status) { //
      switch (status) {
        case 'ZERO':
          return '无意向'
        case 'FIFTY':
          return '招商跟进中'
        case 'NINETY':
          return '签约审批中'
        case 'HUNDRED':
          return '合同执行中'
        default:
          return '-'
      }
    },
    addProgressFn () {
      this.getRooms(this.draweDetaileData.projectManagementDTO.id) // 新增更近记录页面项目房源信息
    },
    async getRooms (id) {
      let res = await context.http.get('/cms/api/rooms/projectManagement?projectManagementId=' + id)
      this.building = res.data
      this.addProgressFrom = true
      this.switchTurn = false
      this.selectSpan = []
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
    tabChange (index) {
      this.contentRightTabIndex = index
      if (index === 1) {
        context.http.get(`cms/api/yxTenantRooms/${this.draweDetaileData.id}`).then(res => {
          this.contentRightTabIndex = index
          this.tableData = JSOG.decode(res.data)
        }).catch(error => {
          console.info(error)
        })
      } else {
        this.contentRightTabIndex = index
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onHide () {
      for (let i = 0; i < this.project.length; i++) {
        this.$set(this.project[i], 'isChecked', false)
        this.$set(this.project[i], 'needValue', null)
      }
      this.projectEdit = false
      this.yxInfoEdit = false
      console.log('onHide')
      this.$emit('drawerClose', false)
    },
    deleFile (item, index) {
      this.draweDetaileData.annexes.splice(index, 1)
    },
    deleFile1 (item, index) {
      this.followRecordDTOParams.annexes.splice(index, 1)
    },
    downloadFile (item, index) {
      axios({
        method: 'GET',
        url: '/ywm/api/annex/download',
        params: {
          annexURL: item.annexURL,
          annexName: item.annexName.replace(/,/g, '-')
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
    imageChange (event) {
      let files = event.target.files
      let fileSize = files[0].size
      let form = new FormData()
      form.append('file', files[0])
      let name = files[0].name
      if (parseInt(fileSize) > 1024 * 1024 * 20) { // 不大于20M
        this.$message({
          message: '文件大小不超过20M',
          type: 'error'
        })
        return
      }
      event.target.value = ''
      context.http.post('/ywm/api/image-multipart', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.followRecordDTOParams.annexes.push({
          'annexName': name,
          'annexURL': res.data
        })
      }).catch(error => {
        console.info(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.potClienDetails {
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

  .drawer-head {
    border-bottom: 1px solid #eee;
  }
  .details-content {
    width: 1290px;
    height: 860px;
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
    .main-content {
      display: flex;
      justify-content: space-between;
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
          > .icon {
            display: inline-block;
            width: 4px;
            height: 16px;
            background: rgba(53, 117, 246, 1);
            border-radius: 2px;
            margin-right: 5px;
          }
        }
        .editBtn {
          display: inline-block;
          width: 46px;
          height: 18px;
          background-image: url(../../../../../assets/editBtn.png);
          cursor: pointer;
        }
      }
      .contentLeft {
        width: 520px;
        .intro {
          background-color: #ffffff;
          border-radius: 4px;
          margin-top: 15px;
          .content {
            padding: 15px;
            height: 200px;
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
              box-shadow: inset 0 0 6px #ccc;
            }
            .item {
              display: flex;
              min-height: 40px;
              margin-bottom: 15px;
              // line-height: 50px;
              align-items: center;
              > div {
                width: 70%;
              }
              > span {
                display: inline-block;
                width: 28%;
                font-size: 14px;
                color: #777777;
                > i {
                  color: #ff0000;
                  font-style: normal;
                }
              }
              > div {
                > span {
                  font-size: 14px;
                  color: #262626;
                }
              }
              .annexList {
                // width: 230px;
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
            }
          }
        }
        .yxInfo {
          min-height: 650px;
          background-color: #ffffff;
          border-radius: 4px;
          .itemContent {
            padding: 15px;
            height: 550px;
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
              min-height: 32px;
              // line-height: 50px;
              align-items: center;
              > span {
                display: inline-block;
                width: 150px;
                font-size: 14px;
                color: #777777;
                > i {
                  color: #ff0000;
                  font-style: normal;
                }
              }
              > div {
                width: 300px;
                &.hasBorder {
                  border: 1px solid #dcdfe6;
                  border-radius: 4px;
                }
                > span {
                  font-size: 14px;
                  color: #262626;
                }
              }
              &.firstItem {
                justify-content: space-between;
                > span {
                  &.name {
                    color: #262626;
                    font-size: 16px;
                  }
                  &.btn {
                    width: auto;
                    padding: 0 8px;
                    height: 26px;
                    line-height: 26px;
                    text-align: center;
                    cursor: pointer;
                    background: rgba(238, 244, 255, 1);
                    border: 1px solid rgba(159, 191, 255, 1);
                    border-radius: 4px;
                    font-size: 12px;
                    color: rgba(53, 117, 246, 1);
                  }
                }
              }
            }
            .itemEdit {
              margin-bottom: 20px;
            }
          }
        }
        .project {
          margin-top: 20px;
          min-height: 380px;
          border: 1px solid #eeeeee;
          .itemContent {
            display: flex;
            flex-direction: column;
            padding: 35px 0;
            > .item {
              display: flex;
              margin-right: 0;
              height: 50px;
              padding-left: 60px;
              line-height: 50px;
            }
          }
        }
      }
      .contentRight {
        width: 710px;
        min-height: 750px;
        background-color: #ffffff;
        border-radius: 4px;
        .addProgress {
          display: inline-block;
          width: 82px;
          color: #3575f6;
          height: 26px;
          line-height: 26px;
          text-align: center;
          background: #eef4ff;
          border: 1px solid #9fbfff;
          border-radius: 14px;
          cursor: pointer;
          position: relative;
          right: -440px;
          top: 0px;
        }
        .tableDiv {
          height: 815px;
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
        .tab {
          height: 34px;
          line-height: 34px;
          display: flex;
          justify-content: space-between;
          padding: 0 15px;
          margin: 15px 0;
          // border-bottom: 1px solid #eeeeee;
          > div {
            > span {
              display: inline-block;
              width: 140px;
              text-align: center;
              height: 34px;
              cursor: pointer;
              background-color: #f8f8f8;
              color: #777777;
              font-size: 14px;
              border-radius: 2px;
              &.active {
                // border-bottom: 2px solid #3175f6;
                color: #3575f6;
                background-color: #eef4ff;
              }
            }
          }
          i {
            font-style: normal;
            cursor: pointer;
            color: #6eaeeb;
          }
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
              width: 75px !important;
              font-weight: bolder;
            }
            > span:last-child {
              font-size: 14px;
              flex: 1;
              color: #777777;
            }
          }
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
      // width: 48%;
      padding-left: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
<style lang="scss">
.intention-tenant {
  .el-item {
    .ailPreview {
      i {
        cursor: pointer;
      }
    }
  }
  .el-button--primary {
    color: #fff;
    background-color: #3575f6;
    border-color: #3575f6;
  }
  .deviceDetails {
    width: 80px;
    height: 80px;
    margin-right: 15px !important;
    .oss_file {
      width: 100%;
      height: 100%;
      border: none;
      background-color: #f7f9fd;
      border: 1px solid #eaeaea;
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
  .itemEdit {
    .el-form-item {
      margin-bottom: 0;
    }
    .noborder {
      .el-input__inner {
        border: none;
        text-align: center;
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
  .drawer-head {
    > i.el-icon-close {
      color: #b9b9b9;
      font-size: 20px;
    }
    > .drawer-title {
      font-size: 16px;
      font-weight: bold;
      color: #262626;
    }
  }
  .details-content {
    background-color: #f8f6f9;
    margin-top: 0;
    padding-top: 15px;
    padding-bottom: 30px;
  }
}
</style>
