<template>
  <div class="personal-info-wrap">
    <div class="mainlayout personal-info mainlayout1">
      <div class="main-content">
        <div class="personalInfo">
          <div class="head clearfix">
            <div class="head-portrait float-left"
                 v-if="detailsInfo.facialPhoto">
              <img :src="detailsInfo.facialPhoto" />
              <span class="hover-tip">更换头像
                <aliUpload class="aliUpload"
                           :upLoadText="upLoadText"
                           :fileType="fileType"
                           :iconShow="false"
                           @setAnnex="setAnnex" />
              </span>
            </div>
            <div class="head-portrait float-left default-hportrait"
                 v-else>
              <span class="">{{detailsInfoName}}</span>
              <span class="hover-tip">更换头像
                <aliUpload class="aliUpload"
                           :upLoadText="upLoadText"
                           :fileType="fileType"
                           :iconShow="false"
                           @setAnnex="setAnnex" />
              </span>
            </div>
            <div class="infomation float-left">
              <p>{{detailsInfo.name}}
                <span v-if="detailsInfo.positiveState === 'PROBATION' && detailsInfo.jobStatus === 'ONJOB'">试用期</span>
                <span v-else-if="detailsInfo.jobStatus === 'RESIGNA'">离职</span>
                <span v-else>正式</span>
              </p>
              <p>
                <span v-if="detailsInfo.organizeDTO">{{detailsInfo.organizeDTO.parent.name}}</span>
                <span class="verticalline"
                      v-if="detailsInfo.organizeDTO"></span>
                <span v-if="detailsInfo.organizeDTO">{{detailsInfo.organizeDTO.name}}</span>
                <span class="verticalline"
                      v-if="detailsInfo.organizeDTO"></span>
                <span>{{detailsInfo.userPostManagements[0].userPostName}}</span>
              </p>
              <p>
                手机号：<span>{{detailsInfo.telephone}}</span>
              </p>
            </div>
            <div class="float-right">
              <el-dropdown trigger="hover">
                <div class="morebtn el-dropdown-link">更多</div>
                <el-dropdown-menu slot="dropdown">
                  <!-- <el-dropdown-item>
                      <router-link to="personalCenter">人事变动</router-link>
                  </el-dropdown-item> -->
                  <el-dropdown-item @click.native="resignationdialogVisible = true"
                                    v-if="detailsInfo.jobStatus === 'ONJOB' && hasAuthority('01010303')">办理离职</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="regularTips"
               v-if="detailsInfo.positiveState === 'PROBATION' && detailsInfo.jobStatus === 'ONJOB'">
            入职时间：{{TimeTrans(detailsInfo.entryTime)}}，{{detailsInfo.trialCycleValue}}，预计转正日期{{detailsInfo.yjPositiveDate}}
            <span @click="regulardialogVisible = true"
                  v-if="hasAuthority('01010304')">办理转正 >></span>
          </div>
          <el-tabs v-model="activeName"
                   @tab-click="handleClick">
            <el-tab-pane label="个人信息"
                         name="first">
              <div class="personal-info">
                <div class="pi-head">
                  基本信息
                  <span class="editbtns"
                        @click="readonly=false"
                        v-if="readonly">
                    <i class="iconfont icon-edit1"></i>
                    编辑
                  </span>
                  <div v-else
                       class="savebtns">
                    <div @click="cancel">取消</div>
                    <div @click="saveInfo('detailsInfos')">保存</div>
                  </div>
                </div>
                <el-form :model="detailsInfo"
                         ref="detailsInfos"
                         :rules="detailsRules">
                  <el-form-item :label-width="formLabelWidth"
                                prop="name"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">姓名<i>*</i></div>
                    <div v-if="readonly"
                         class="read-only">{{detailsInfo.name}}</div>
                    <el-input v-model="detailsInfo.name"
                              placeholder="请输入内容"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">英文名</div>
                    <div v-if="readonly"
                         class="read-only">{{detailsInfo.englishName}}</div>
                    <el-input v-model="detailsInfo.englishName"
                              placeholder="请输入内容"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                prop="sex"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">性别<i>*</i></div>
                    <div v-if="readonly"
                         class="read-only">{{detailsInfo.sex === 'MAN' ? '男' : '女'}}</div>
                    <el-select v-model="detailsInfo.sex"
                               placeholder="请选择"
                               v-else>
                      <el-option v-for="item in sexOptions"
                                 :key="item.value"
                                 :label="item.name"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                prop="telephone"
                                style="margin-bottom: 20px;">
                    <div class="cttitle"
                         style="display: flex;">
                      <div>手机号<i>*</i></div>
                      <div v-if="readonly">{{detailsInfo.onHidePhone?'（通讯录不显示手机号）':'（通讯录显示手机号）'}}</div>
                      <el-checkbox v-model="detailsInfo.onHidePhone"
                                   v-else>通讯录不显示手机号</el-checkbox>
                    </div>
                    <div v-if="readonly"
                         class="read-only">{{detailsInfo.telephone}}</div>
                    <el-input v-model="detailsInfo.telephone"
                              placeholder="请输入内容"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">证件类型</div>
                    <div v-if="readonly"
                         class="read-only">{{detailsInfo.certificateValue}}</div>
                    <el-select v-model="detailsInfo.certificate"
                               placeholder="请选择"
                               v-else>
                      <el-option v-for="item in documentTypeOptions"
                                 :key="item.id"
                                 :label="item.value"
                                 :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                prop="iDNumber">
                    <div class="cttitle">证件号码</div>
                    <div v-if="readonly"
                         class="read-only">{{detailsInfo.iDNumber}}</div>
                    <el-input v-model="detailsInfo.iDNumber"
                              @blur="dtTypeChange"
                              placeholder="请输入内容"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">出生日期</div>
                    <div v-if="readonly"
                         class="read-only">{{detailsInfo.birthday}}</div>
                    <el-date-picker v-else
                                    v-model="detailsInfo.birthday"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">年龄</div>
                    <div class="read-only">{{detailsInfo.age}}</div>
                    <!-- <el-input v-model="detailsInfo.age"
                              placeholder="请输入内容"
                              type="number"
                              v-else></el-input> -->
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">属相</div>
                    <div v-if="readonly"
                         class="read-only">{{FormatChineseZodiac(detailsInfo.chineseZodiac)}}</div>
                    <el-select v-model="detailsInfo.chineseZodiac"
                               v-else
                               placeholder="请选择">
                      <el-option v-for="item in zodiacOptions"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">星座</div>
                    <div v-if="readonly"
                         class="read-only">{{FormatZodiac(detailsInfo.zodiac)}}</div>
                    <el-select v-model="detailsInfo.zodiac"
                               v-else
                               placeholder="请选择">
                      <el-option v-for="item in constellationOptions"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">血型</div>
                    <div v-if="readonly"
                         class="read-only">{{FormatBloodType(detailsInfo.bloodType)}}</div>
                    <el-select v-model="detailsInfo.bloodType"
                               v-else
                               placeholder="请选择">
                      <el-option v-for="item in bloodTypeOptions"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">籍贯</div>
                    <div v-if="readonly"
                         class="read-only">{{detailsInfo.birthPlace}}</div>
                    <el-input v-model="detailsInfo.birthPlace"
                              placeholder="请输入内容"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">户口性质</div>
                    <div v-if="readonly"
                         class="read-only">{{FormatHousehold(detailsInfo.household)}}</div>
                    <el-select v-model="detailsInfo.household"
                               v-else
                               placeholder="请选择">
                      <el-option v-for="item in householdOptions"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">户口所在地</div>
                    <div v-if="readonly"
                         class="read-only">{{detailsInfo.householdAdress}}</div>
                    <el-input v-model="detailsInfo.householdAdress"
                              placeholder="请输入内容"
                              maxlength="100"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">婚姻状态</div>
                    <div v-if="readonly"
                         class="read-only">{{FormatMaritalStatus(detailsInfo.maritalStatus)}}</div>
                    <el-select v-model="detailsInfo.maritalStatus"
                               v-else
                               placeholder="请选择">
                      <el-option v-for="item in maritalOptions"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">是否已育</div>
                    <div v-if="readonly"
                         class="read-only">{{FormatBirthFlg(detailsInfo.birthFlg)}}</div>
                    <el-select v-model="detailsInfo.birthFlg"
                               v-else
                               placeholder="请选择">
                      <el-option v-for="item in fertileOptions"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">政治面貌</div>
                    <div v-if="readonly"
                         class="read-only">{{FormatPoliticalA(detailsInfo.politicalAppearance)}}</div>
                    <el-select v-model="detailsInfo.politicalAppearance"
                               v-else
                               placeholder="请选择">
                      <el-option v-for="item in politicalOptions"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">民族</div>
                    <div v-if="readonly"
                         class="read-only">{{detailsInfo.nation}}</div>
                    <el-input v-model="detailsInfo.nation"
                              placeholder="请输入内容"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">参加工作时间</div>
                    <div v-if="readonly"
                         class="read-only">{{detailsInfo.startWorkTime}}</div>
                    <el-date-picker v-else
                                    v-model="detailsInfo.startWorkTime"
                                    value-format="yyyy-MM-dd"
                                    @change="selectStartWorkTime"
                                    type="date"
                                    placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">工龄</div>
                    <div v-if="readonly"
                         class="read-only">{{detailsInfo.wAge}}</div>
                    <el-input v-model="detailsInfo.wAge"
                              placeholder="请输入内容"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">健康状况</div>
                    <div v-if="readonly"
                         class="read-only">{{detailsInfo.healthStatus}}</div>
                    <el-input v-model="detailsInfo.healthStatus"
                              placeholder="请输入内容"
                              maxlength="100"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">有无违法违纪行为</div>
                    <div v-if="readonly"
                         class="read-only">{{detailsInfo.illegal}}</div>
                    <el-input v-model="detailsInfo.illegal"
                              placeholder="请输入内容"
                              maxlength="100"
                              v-else></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div class="personal-info"
                   style="margin-top: 20px;">
                <div class="pi-head">
                  通讯信息
                  <span class="editbtns"
                        @click="communicationReadonly=false"
                        v-if="communicationReadonly"><i class="iconfont icon-edit1"></i>
                    编辑</span>
                  <div v-else
                       class="savebtns">
                    <div @click="cancel">取消</div>
                    <div @click="saveInfo('detailsInfotx')">保存</div>
                  </div>
                </div>
                <el-form ref="detailsInfotx"
                         :model="detailsInfo">
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">个人邮箱</div>
                    <div v-if="communicationReadonly"
                         class="read-only">{{detailsInfo.pEmail}}</div>
                    <el-input v-model="detailsInfo.pEmail"
                              placeholder="请输入内容"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">现居住地</div>
                    <div v-if="communicationReadonly"
                         class="read-only">{{detailsInfo.address}}</div>
                    <el-input v-model="detailsInfo.address"
                              placeholder="请输入内容"
                              maxlength="100"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">QQ</div>
                    <div v-if="communicationReadonly"
                         class="read-only">{{detailsInfo.qq}}</div>
                    <el-input v-model="detailsInfo.qq"
                              placeholder="请输入内容"
                              maxlength="50"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">微信</div>
                    <div v-if="communicationReadonly"
                         class="read-only">{{detailsInfo.wechat}}</div>
                    <el-input v-model="detailsInfo.wechat"
                              placeholder="请输入内容"
                              maxlength="50"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                prop="telephone"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">工作固话</div>
                    <div v-if="communicationReadonly"
                         class="read-only">{{detailsInfo.fixedTelephone}}</div>
                    <el-input v-model="detailsInfo.fixedTelephone"
                              placeholder="请输入内容"
                              maxlength="50"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">紧急联系人</div>
                    <div v-if="communicationReadonly"
                         class="read-only">{{detailsInfo.urgentContact}}</div>
                    <el-input v-model="detailsInfo.urgentContact"
                              placeholder="请输入内容"
                              maxlength="50"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">紧急联系人关系</div>
                    <div v-if="communicationReadonly"
                         class="read-only">{{detailsInfo.urgentRelation}}</div>
                    <el-input v-model="detailsInfo.urgentRelation"
                              placeholder="请输入内容"
                              maxlength="50"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">紧急联系人电话</div>
                    <div v-if="communicationReadonly"
                         class="read-only">{{detailsInfo.urgentTelphone}}</div>
                    <el-input v-model="detailsInfo.urgentTelphone"
                              maxlength="50"
                              placeholder="请输入内容"
                              v-else></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div class="personal-info"
                   style="margin-top: 20px;">
                <div class="pi-head">
                  教育信息
                  <span class="editbtns"
                        @click="educationReadonly=false"
                        v-if="educationReadonly"><i class="iconfont icon-edit1"></i>
                    编辑</span>
                  <div v-else
                       class="savebtns">
                    <div @click="cancel">取消</div>
                    <div @click="saveInfo('detailsInfojy')">保存</div>
                  </div>
                </div>
                <el-form ref="detailsInfojy"
                         :model="detailsInfo">
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">最高学历</div>
                    <div v-if="educationReadonly"
                         class="read-only">{{FormatEducation(detailsInfo.education)}}</div>
                    <el-select v-model="detailsInfo.education"
                               v-else
                               placeholder="请选择">
                      <el-option v-for="item in educationOptions"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">学历类型</div>
                    <div v-if="educationReadonly"
                         class="read-only">{{FormatEducationType(detailsInfo.educationType)}}</div>
                    <el-select v-model="detailsInfo.educationType"
                               v-else
                               placeholder="请选择">
                      <el-option v-for="item in politicalTypeOptions"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">毕业学校</div>
                    <div v-if="educationReadonly"
                         class="read-only">{{detailsInfo.school}}</div>
                    <el-input v-model="detailsInfo.school"
                              placeholder="请输入内容"
                              maxlength="50"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">专业</div>
                    <div v-if="educationReadonly"
                         class="read-only">{{detailsInfo.profession}}</div>
                    <el-input v-model="detailsInfo.profession"
                              placeholder="请输入内容"
                              maxlength="50"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">入学时间</div>
                    <div v-if="educationReadonly"
                         class="read-only">{{detailsInfo.startStudyTime}}</div>
                    <el-date-picker v-else
                                    v-model="detailsInfo.startStudyTime"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">毕业时间</div>
                    <div v-if="educationReadonly"
                         class="read-only">{{detailsInfo.endStudyTime}}</div>
                    <el-date-picker v-else
                                    v-model="detailsInfo.endStudyTime"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane label="在职信息"
                         name="second">
              <div class="personal-info">
                <div class="pi-head">
                  基本信息
                  <span class="editbtns"
                        @click="secondReadonly=false"
                        v-if="secondReadonly"><i class="iconfont icon-edit1"></i>
                    编辑</span>
                  <div v-else
                       class="savebtns">
                    <div @click="cancel">取消</div>
                    <div @click="saveInfo('detailsInfozh')">保存</div>
                  </div>
                </div>
                <el-form :model="detailsInfo"
                         ref="detailsInfozh"
                         :rules="detailsRules2">
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">工号</div>
                    <div v-if="secondReadonly"
                         class="read-only">{{detailsInfo.jobNumber}}</div>
                    <el-input v-model="detailsInfo.jobNumber"
                              placeholder="请输入内容"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                prop="entryTime"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">入职时间<i>*</i></div>
                    <div v-if="secondReadonly"
                         class="read-only">{{TimeTrans(detailsInfo.entryTime)}}</div>
                    <el-date-picker v-else
                                    v-model="detailsInfo.entryTime"
                                    @change="selectEntryTime"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                prop="natureWork"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">工作性质<i>*</i></div>
                    <div v-if="secondReadonly"
                         class="read-only">{{detailsInfo.natureWorkValue}}</div>
                    <el-select v-model="detailsInfo.natureWork"
                               @change="natureWorkChange"
                               placeholder="请选择"
                               v-else>
                      <el-option v-for="item in natureWorkOptions"
                                 :key="item.id"
                                 :label="item.value"
                                 :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <div style="text-align: right"
                       v-if="!secondReadonly">
                    <span class='per-detail plus'
                          style="cursor: pointer;"
                          @click="plus">+</span>
                  </div>
                  <div v-for="(item, index) in detailsInfo.userPostManagements"
                       :key="index">
                    <el-form-item :label-width="formLabelWidth"
                                  :prop="'userPostManagements.'+ index + '.organize'"
                                  :rules="{required: true, message: '请选择组织', trigger: 'blur'}"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">组织<i>*</i></div>
                      <div v-if="secondReadonly"
                           class="read-only">
                        <span v-if="item.organize">
                          {{item.organize.name}}
                        </span>
                      </div>
                      <el-cascader v-else
                                   change-on-select
                                   expand-trigger="hover"
                                   :options="organizationOptions"
                                   v-model="item.organize.id"
                                   @change="handleChange(arguments, index)">
                      </el-cascader>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  :prop="'userPostManagements.'+ index + '.userPostId'"
                                  :rules="detailsRules2.userPostId"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">岗位<i>*</i>
                        <span v-if="secondReadonly && item.onMaster"
                              class="postTips">主要职务</span>
                        <el-checkbox v-else-if="!secondReadonly"
                                     v-model="item.onMaster">主要职务</el-checkbox>
                      </div>
                      <div v-if="secondReadonly"
                           class="read-only">{{item.userPostName}}</div>
                      <el-select v-model="item.userPostId"
                                 placeholder="请选择"
                                 v-else>
                        <el-option v-for="item2 in item.postOptions"
                                   :key="item2.id"
                                   :label="item2.name"
                                   :value="item2.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">职务名称
                        <span class="reduce"
                              @click="reduce(index)"
                              v-if="detailsInfo.userPostManagements.length > 1 && index > 0 && !secondReadonly">-</span>
                      </div>
                      <div v-if="secondReadonly"
                           class="read-only">{{item.jobTitle}}</div>
                      <el-input v-model="item.jobTitle"
                                placeholder="请输入内容"
                                v-else></el-input>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="positiveState"
                                  :rules="inputDisable === true ? [{  message: '请选择', trigger: 'blur' }] : detailsRules2.positiveState"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">是否转正<i>*</i></div>
                      <div v-if="secondReadonly"
                           class="read-only">{{detailsInfo.positiveState === 'TURNPOSITIVE' ? '转正' : detailsInfo.positiveState === 'PROBATION' ? '试用期' : '没有转正'}}</div>
                      <el-select v-model="detailsInfo.positiveState"
                                 :disabled=inputDisable
                                 placeholder="请选择"
                                 v-else>
                        <el-option v-for="item in positiveStateOptions"
                                   :key="item.value"
                                   :label="item.name"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="trialCycle"
                                  :rules="inputDisable === true ? [{ message: '请选择', trigger: 'blur' }] : detailsRules2.trialCycle">
                      <div class="cttitle">试用期<i>*</i></div>
                      <div v-if="secondReadonly"
                           class="read-only">{{detailsInfo.trialCycleValue}}</div>
                      <el-select v-model="detailsInfo.trialCycle"
                                 :disabled=inputDisable
                                 placeholder="请选择"
                                 v-else>
                        <el-option v-for="item in trialCycleOptions"
                                   :key="item.id"
                                   :label="item.value"
                                   :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="email"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">企业邮箱</div>
                      <div v-if="secondReadonly"
                           class="read-only">{{detailsInfo.email}}</div>
                      <el-input v-model="detailsInfo.email"
                                placeholder="请输入内容"
                                v-else></el-input>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">司龄</div>
                      <div v-if="secondReadonly"
                           class="read-only">{{detailsInfo.cAge}}</div>
                      <el-input v-model="detailsInfo.cAge"
                                :disabled=inputReadNnly
                                placeholder="请输入内容"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">工作地点<i></i>
                        <span @click="newPlaceDialog = true"
                              v-if="!secondReadonly">+ 创建新的工作地点</span>
                      </div>
                      <div v-if="secondReadonly"
                           class="read-only">{{detailsInfo.workPlaceValue}}</div>
                      <el-select v-model="detailsInfo.workPlaceId"
                                 placeholder="请选择"
                                 v-else>
                        <el-option v-for="item in locationOptions"
                                   :key="item.id"
                                   :label="item.name"
                                   :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-form>
              </div>
              <div class="personal-info">
                <div class="pi-head">
                  合同信息
                  <span class="jobContracts-op"
                        @click="addJobContracts"
                        v-if="!contractReadonly">+</span>
                  <span class="jobContracts-op"
                        @click="deleteJobContracts"
                        v-if="!contractReadonly && detailsInfo.jobContracts && detailsInfo.jobContracts.length > 1">-</span>
                  <span class="editbtns"
                        @click="contractReadonly=false"
                        v-if="contractReadonly"><i class="iconfont icon-edit1"></i>
                    编辑</span>
                  <div v-else
                       class="savebtns">
                    <div @click="cancel">取消</div>
                    <div @click="saveInfo('detailsInfoht')">保存</div>
                  </div>
                </div>
                <el-form ref="detailsInfoht"
                         :model="detailsInfo">
                  <div v-for="(item, index) in detailsInfo.jobContracts"
                       :key="index"
                       class="contracts-div">
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">合同编号</div>
                      <div v-if="contractReadonly"
                           class="read-only">{{item.contractNo}}</div>
                      <el-input v-model="item.contractNo"
                                placeholder="请输入内容"
                                maxlength="50"
                                v-else></el-input>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">合同类型</div>
                      <div v-if="contractReadonly"
                           class="read-only">{{FormatContractType(item.contractType)}}</div>
                      <el-select v-model="item.contractType"
                                 v-else
                                 placeholder="请选择">
                        <el-option v-for="item in contractTypeOptions"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">合同开始时间</div>
                      <div v-if="contractReadonly"
                           class="read-only">{{item.startTime}}</div>
                      <el-date-picker v-else
                                      v-model="item.startTime"
                                      value-format="yyyy-MM-dd"
                                      type="date"
                                      placeholder="选择日期">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  :rules="inputDisable === true ? [{  message: '请选择', trigger: 'blur' }] : detailsRules2.positiveState"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">合同结束时间</div>
                      <div v-if="contractReadonly"
                           class="read-only">{{item.endTime}}</div>
                      <el-date-picker v-else
                                      v-model="item.endTime"
                                      value-format="yyyy-MM-dd"
                                      type="date"
                                      @change="endTimeChange(item)"
                                      placeholder="选择日期">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                      <div class="cttitle">合同状态</div>
                      <div class="read-only">{{FormatContractStatus(item.contractStatus)}}</div>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="email"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">合同签订时间</div>
                      <div v-if="contractReadonly"
                           class="read-only">{{item.signTime}}</div>
                      <el-date-picker v-else
                                      v-model="item.signTime"
                                      value-format="yyyy-MM-dd"
                                      type="date"
                                      placeholder="选择日期">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">合同企业<i></i>
                        <span @click="newCompanyDialog = true;companyName=''"
                              v-if="!contractReadonly">+ 创建新的合同企业</span>
                      </div>
                      <div v-if="contractReadonly"
                           class="read-only">{{item.company}}</div>
                      <el-select v-model="item.companyId"
                                 @change="changeCompany(item)"
                                 placeholder="请选择"
                                 v-else>
                        <el-option v-for="item2 in companyOptions"
                                   :key="item2.id"
                                   :label="item2.name"
                                   :value="item2.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  prop="email"
                                  style="margin-bottom: 20px;">
                      <div class="cttitle">合同备注</div>
                      <div v-if="contractReadonly"
                           class="read-only">{{item.remark}}</div>
                      <el-input v-model="item.remark"
                                placeholder="请输入内容"
                                maxlength="50"
                                v-else></el-input>
                    </el-form-item>
                  </div>
                </el-form>
              </div>
              <div class="personal-info">
                <div class="pi-head">
                  工资卡/社保信息
                  <span class="editbtns"
                        @click="socialReadonly=false"
                        v-if="socialReadonly"><i class="iconfont icon-edit1"></i>
                    编辑</span>
                  <div v-else
                       class="savebtns">
                    <div @click="cancel">取消</div>
                    <div @click="saveInfo('detailsInfogz')">保存</div>
                  </div>
                </div>
                <el-form ref="detailsInfogz"
                         :model="detailsInfo">
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">工资卡开户行</div>
                    <div v-if="socialReadonly"
                         class="read-only">{{detailsInfo.blank}}</div>
                    <el-input v-model="detailsInfo.blank"
                              maxlength="50"
                              placeholder="请输入内容"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                prop="entryTime"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">银行卡号</div>
                    <div v-if="socialReadonly"
                         class="read-only">{{detailsInfo.blankCard}}</div>
                    <el-input v-model="detailsInfo.blankCard"
                              placeholder="请输入内容"
                              maxlength="30"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                prop="natureWork"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">个人社保账号</div>
                    <div v-if="socialReadonly"
                         class="read-only">{{detailsInfo.socialAccount}}</div>
                    <el-input v-model="detailsInfo.socialAccount"
                              placeholder="请输入内容"
                              maxlength="50"
                              v-else></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px;">
                    <div class="cttitle">个人公积金账号</div>
                    <div v-if="socialReadonly"
                         class="read-only">{{detailsInfo.fundAccount}}</div>
                    <el-input v-model="detailsInfo.fundAccount"
                              placeholder="请输入内容"
                              maxlength="50"
                              v-else></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane label="材料附件"
                         name="third"
                         style="box-shadow:0px 3px 6px 0px rgba(190,199,208,0.2);border: 1px solid #fff;">
              <div class="personal-info material-annex">
                <div class="pi-head">
                  员工附件
                  <span class="adddynamicbtn"
                        style="width: 82px">+ 上传附件
                    <aliUpload class="aliUploads"
                               :upLoadText="upLoadText"
                               :fileType="fileTypes"
                               :iconShow="false"
                               @setAnnex="setAnnexs" />
                  </span>
                </div>
                <div class="ma-head">
                  <span>附件名称</span>
                  <span>操作</span>
                </div>
                <div class="ma-content"
                     v-for="(item, index) in detailsInfoAnnexes"
                     :key="index">
                  <span>{{item.annexName}}</span>
                  <span>
                    <i class="iconfont icon-xiazaidaoru"
                       @click="annexDownload(item, index)"
                       style="cursor: pointer;"></i>
                    <i class="iconfont icon-lajixiang"
                       @click="annexDelete(item, index)"
                       style="margin-left: 10px;cursor: pointer;"></i>
                  </span>
                </div>
              </div>
              <div class="page"
                   v-if="pager.total > 15">
                <div class="pagingnum">显示 <select v-model="pager.pgSize"
                          @change="pgSizeSelectFn">
                    <option v-for="item in pager.pgNumoptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </option>
                  </select>
                  条目 <span style="padding-left: 30px">显示从{{pager.pgSize*(pager.currentPage - 1) + 1}}到{{pager.pgSize*pager.currentPage}}项结果，共<span class="style: red">{{pager.total}}</span>条</span>
                </div>
                <el-pagination v-if="pager.total > 0"
                               background
                               layout="prev, pager, next"
                               :page-size=pager.pgSize
                               :total="pager.total"
                               :current-page="pager.currentPage"
                               @current-change="current_change">
                </el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="成长记录"
                         name="Fourth">
              <div class="personal-info"
                   style="margin-bottom: 0;padding-bottom: 20px;">
                <div class="pi-head">
                  成长记录
                  <span class="adddynamicbtn"
                        @click="dynamicdialogVisible = true">+ 添加成长记录</span>
                </div>
                <div class="dynamic-content">
                  <div class="steps-warp">
                    <div class="steps"
                         v-for="(item, index) in detailsInfo.userDynamics"
                         :key="index">
                      <div>{{TimeTrans(item.occurTime)}}</div>
                      <div class="content">
                        <p>
                          <span v-if="item.dynamicType === 'ENTRY'">入职</span>
                          <span v-else-if="item.dynamicType === 'TURNPOSITIVE'">转正</span>
                          <span v-else-if="item.dynamicType === 'RESIGNATION'">离职</span>
                        </p>
                        <p>{{item.description}}</p>
                        <p v-for="(item2, index2) in item.annexes"
                           :key="index2">附件：{{item2.annexName}} <i class="iconfont icon-xiazaidaoru"
                             @click="annexDownload(item2, index2)"
                             style="cursor: pointer;margin-left: 10px;"></i></p>
                      </div>
                      <i class="iconfont icon-shanchu-"
                         @click="delDynamic(item,index)"></i>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <el-dialog title="添加成长记录"
                     :visible.sync="dynamicdialogVisible"
                     :close-on-click-modal="false"
                     class="employeedynamic-dynamic"
                     append-to-body>
            <el-form :model="formOpenact">
              <el-form-item :label-width="formLabelWidth">
                <div class="cttitle"
                     style="margin-top: 16px;">时间</div>
                <el-date-picker v-model="occurTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth">
                <div class="cttitle">记录</div>
                <el-input resize="none"
                          type="textarea"
                          :rows="2"
                          maxlength="100"
                          placeholder="100字以内"
                          v-model="description">
                </el-input>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth">
                <span class="cttitle">附件</span>
                <span class="adddEnclosurebtn">+ 上传附件</span>
                <aliUpload class="enclosure-aliUploads"
                           :upLoadText="upLoadText"
                           :fileType="fileTypes"
                           :iconShow="false"
                           @setAnnex="setDynamicAnnexs" />
                <div style="margin: -15px 0 0 50px">
                  <div v-for="(item, index) in dynamicAnnexes"
                       :key="index">{{item.annexName}} <i class="iconfont icon-lajixiang"
                       @click="deleFile(item, index)"
                       style="cursor: pointer;margin-left: 10px;"></i></div>
                </div>
              </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
              <el-button @click="dynamicdialogVisible = false"
                         class="close-button">关 闭</el-button>
              <el-button type="primary"
                         @click="adddYnamic"
                         class="defaultbtn dialog-confirmBtn">确认</el-button>
            </div>
          </el-dialog>
          <el-dialog title="办理离职"
                     :visible.sync="resignationdialogVisible"
                     :close-on-click-modal="false"
                     class="employeedynamic-resignation"
                     append-to-body>
            <el-form :model="quitData"
                     ref="quitDataForm"
                     :rules="quitRules">
              <el-form-item prop="resignaId">
                <div class="cttitle">离职原因<i class="required">*</i></div>
                <el-select v-model="quitData.resignaId"
                           placeholder="请选择">
                  <el-option v-for="item in resignaOptions"
                             :key="item.id"
                             :label="item.value"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="margin-left: 18%"
                            prop="resignaDate">
                <div class="cttitle">离职日期<i class="required">*</i></div>
                <el-date-picker v-model="quitData.resignaDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item style="width: 100%"
                            prop="resignaReason">
                <div class="cttitle">离职原因说明<i class="required">*</i></div>
                <el-input resize="none"
                          type="textarea"
                          :rows="2"
                          maxlength="100"
                          placeholder="100字以内"
                          v-model="quitData.resignaReason">
                </el-input>
              </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
              <el-button @click="resignationdialogVisible = false"
                         class="close-button">关 闭</el-button>
              <el-button type="primary"
                         @click="resignation('quitDataForm')"
                         class="defaultbtn dialog-confirmBtn">确认</el-button>
            </div>
          </el-dialog>
          <el-dialog title="办理转正"
                     :visible.sync="regulardialogVisible"
                     :close-on-click-modal="false"
                     class="employeedynamic-resignation"
                     append-to-body>
            <el-form :model="regularData"
                     ref="regularDataForm"
                     :rules="regularRules">
              <el-form-item>
                <div class="cttitle"
                     style="margin-top: 16px;">预计转正日期<i class="required">*</i></div>
                <span style="display: inline-block;">{{detailsInfo.yjPositiveDate}}</span>
              </el-form-item>
              <el-form-item style="margin-left: 18%"
                            prop="regularDate">
                <div class="cttitle"
                     style="margin-top: 16px;">实际转正日期<i class="required">*</i></div>
                <el-date-picker v-model="regularData.regularDate"
                                :picker-options="pickerOptions"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item style="width: 100%">
                <div class="cttitle">转正说明</div>
                <el-input resize="none"
                          type="textarea"
                          :rows="2"
                          maxlength="100"
                          placeholder="100字以内"
                          v-model="regularData.regularReason">
                </el-input>
              </el-form-item>
            </el-form>
            <div slot="footer"
                 class="dialog-footer">
              <el-button @click="regulardialogVisible = false"
                         class="close-button">关 闭</el-button>
              <el-button type="primary"
                         @click="regular('regularDataForm')"
                         class="defaultbtn dialog-confirmBtn">确认转正</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
    <el-dialog title="新增合同企业"
               :visible.sync="newCompanyDialog"
               :append-to-body="true"
               center>
      <div style="padding: 30px 0 40px 0;">
        <div style="padding-bottom: 10px;">合同企业</div>
        <el-input v-model="companyName"
                  placeholder="请输入内容"></el-input>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="newCompanyDialog = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   @click="addCompany">确 认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增工作地点"
               :visible.sync="newPlaceDialog"
               :append-to-body="true"
               center>
      <div style="padding: 30px 0 40px 0;">
        <div style="padding-bottom: 10px;">工作地点<span style="color: red">*</span></div>
        <el-input v-model="locationName"
                  placeholder="请输入内容"></el-input>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="newPlaceDialog = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   @click="addLocation">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import IdentityCodeValid from '@/utils/checkIdent'
import { Calculator, decrypt } from '@/utils/validate'
export default {
  name: 'personal',
  components: {
    aliUpload
  },
  props: {
    detailsInfo: {
      type: Object,
      default: function () {
        return {
          facialPhoto: '',
          organizeDTO: {
            name: '',
            userPost: '',
            parent: { name: '' }
          },
          userPostManagements: [{
            organizeId: [],
            userPostId: '',
            onMaster: true
          }],
          userDynamics: [{
            user: { workPlace: { name: '' } }
          }],
          jobContracts: [{
            contractNo: '',
            contractType: '',
            contractStatus: '',
            endTime: '',
            remark: '',
            signTime: '',
            startTime: ''
          }]
        }
      }
    }
  },
  data () {
    var _this = this
    var validateIDNumber = (rule, value, callback) => {
      if (_this.detailsInfo.certificate === 2) {
        // var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (!IdentityCodeValid(value).pass) {
          callback(new Error('请输入正确的身份证号码'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      upLoadText: '',
      fileType: ['png', 'jpeg', 'jpg'],
      fileTypes: [],
      currentDataLength: 0,
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
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      occurTime: '',
      description: '',
      organizeDTO: [],
      drawerTitle: '员工详情信息',
      activeName: 'first',
      readonly: true,
      contractReadonly: true,
      socialReadonly: true,
      communicationReadonly: true,
      educationReadonly: true,
      secondReadonly: true,
      dynamicdialogVisible: false,
      resignationdialogVisible: false,
      inputDisable: false,
      activeReset: false,
      resignaDate: '',
      value: '',
      formLabelWidth: '',
      detailsInfoName: '',
      formOpenact: {},
      options: [{
        value: '选项1',
        label: '黄金糕'
      }],
      sexOptions: [
        { name: '男', value: 'MAN' },
        { name: '女', value: 'WOMAN' }
      ],
      documentTypeOptions: [],
      natureWorkOptions: [],
      positiveStateOptions: [
        {
          name: '试用期',
          value: 'PROBATION'
        },
        {
          name: '转正',
          value: 'TURNPOSITIVE'
        },
        {
          name: '没有转正',
          value: 'NOTMUST'
        }
      ],
      trialCycleOptions: [],
      organizationOptions: [],
      postOptions: [],
      locationOptions: [],
      companyOptions: [],
      nationalityOptions: [],
      newCompanyDialog: false,
      newPlaceDialog: false,
      regulardialogVisible: false,
      companyName: '',
      locationName: '',
      resignaOptions: [],
      quitData: {
        resignaId: '',
        resignaDate: '',
        resignaReason: ''
      },
      regularData: {
        regularDate: '',
        regularReason: ''
      },
      quitRules: {
        resignaId: [
          { required: true, message: '请选择离职原因', trigger: 'change' }
        ],
        resignaDate: [
          { required: true, message: '请选择离职日期', trigger: 'change' }
        ],
        resignaReason: [
          { required: true, message: '请输入离职原因说明', trigger: 'blur' }
        ]
      },
      regularRules: {
        regularDate: [
          { required: true, message: '请选择转正日期', trigger: 'change' }
        ],
        regularReason: [
          { required: true, message: '请输入转正说明', trigger: 'blur' }
        ]
      },
      detailsRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        telephone: [
          { required: true, pattern: /^1[23456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        iDNumber: [
          { validator: validateIDNumber, trigger: 'blur' }
        ]
      },
      detailsRules2: {
        entryTime: [
          { required: true, message: '请选择入职时间', trigger: 'change' }
        ],
        natureWork: [
          { required: true, message: '请选择工作性质', trigger: 'change' }
        ],
        positiveState: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        trialCycle: [
          { required: true, message: '请选择试用期', trigger: 'change' }
        ],
        organizeId: [
          { required: true, message: '请选择组织', trigger: 'change' }
        ],
        userPostId: [
          { required: true, message: '请选择岗位', trigger: 'change' }
        ],
        email: [
          { pattern: /^([a-zA-Z]|[0-9])(\w|\/-)+@[a-zA-Z0-9_-]+\.([a-zA-Z]{2,4})$/, message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      },
      inputReadNnly: false,
      detailsInfoAnnexes: [],
      dynamicAnnexes: [],
      enclosureName: '',
      organizeIdList: [],
      zodiacOptions: [
        { label: '请选择', value: '' }, { label: '鼠', value: 'RAT' }, { label: '牛', value: 'OX' }, { label: '虎', value: 'TIGER' }, { label: '兔', value: 'HARE' }, { label: '龙', value: 'DRAGON' }, { label: '蛇', value: 'SNAKE' }, { label: '马', value: 'HORSE' }, { label: '羊', value: 'SHEEP' }, { label: '猴', value: 'MONKEY' }, { label: '鸡', value: 'ROOSTER' }, { label: '狗', value: 'DOG' }, { label: '猪', value: 'BOAR' }
      ],
      constellationOptions: [
        { label: '请选择', value: '' }, { label: '白羊座', value: 'ARIES' }, { label: '金牛座', value: 'TAURUS' }, { label: '双子座', value: 'GEMINI' }, { label: '巨蟹座', value: 'CANCER' }, { label: '狮子座', value: 'LEO' }, { label: '处女座', value: 'VIRGO' }, { label: '天秤座', value: 'LIBRA' }, { label: '天蝎座', value: 'SCORPIO' }, { label: '射手座', value: 'SAGITTATIUS' }, { label: '摩羯座', value: 'CAPRICORN' }, { label: '水瓶座', value: 'AQUARIUS' }, { label: '双鱼座', value: 'PISCES' }
      ],
      bloodTypeOptions: [
        { label: '请选择', value: '' }, { label: 'A', value: 'A' }, { label: 'B', value: 'B' }, { label: 'AB', value: 'AB' }, { label: 'O', value: 'O' }, { label: 'Rh阴性', value: 'RHNEGATIVE' }, { label: 'Rh阳性', value: 'RHPOSITIVE' }
      ],
      maritalOptions: [
        { label: '请选择', value: '' }, { label: '未婚', value: 'UNMARRIED' }, { label: '已婚', value: 'MARRIED' }, { label: '离异', value: 'DIVORCE' }
      ],
      householdOptions: [
        { label: '请选择', value: '' }, { label: '城市户口', value: 'CITY' }, { label: '农业户口', value: 'AGRICULTURE' }, { label: '集体户口', value: 'COLLECTIVE' }
      ],
      fertileOptions: [
        { label: '请选择', value: ' ' }, { label: '是', value: true }, { label: '否', value: false }
      ],
      politicalOptions: [
        { label: '请选择', value: '' }, { label: '党员', value: 'PARTYMEMBER' }, { label: '团员', value: 'LEAGUEMEMBER' }, { label: '群众', value: 'MASSES' }, { label: '预备党员', value: 'PROBATIONARYMEMBER' }, { label: '其他', value: 'OTHER' }
      ],
      educationOptions: [
        { label: '请选择', value: '' }, { label: '小学', value: 'PRIMARY' }, { label: '初中', value: 'JUNIOR' }, { label: '高中', value: 'SENIOR' }, { label: '中专', value: 'SPECIAL' }, { label: '技校', value: 'TECHNICAL' }, { label: '职高', value: 'PROFESSIONAL' }, { label: '大专', value: 'UNIVERSITIES' }, { label: '本科', value: 'UNDERGRADUATE' }, { label: '硕士', value: 'MASTER' }, { label: '博士', value: 'DOCTOR' }, { label: '博士后', value: 'POSTDOCTOR' }, { label: '其他', value: 'OTHER' }
      ],
      politicalTypeOptions: [
        { label: '请选择', value: '' }, { label: '统招', value: 'GENERAL' }, { label: '自考', value: 'SELF' }, { label: '成人高考', value: 'ADULT' }
      ],
      contractTypeOptions: [
        { label: '请选择', value: '' }, { label: '固定期限合同', value: 'FIXEDTERM' }, { label: '无固定期限合同', value: 'NOFIXEDTERM' }, { label: '实习协议', value: 'INTERNSHIP' }, { label: '劳务合同', value: 'SERVICE' }, { label: '返聘协议', value: 'REEMPLOYMENT' }, { label: '劳务派遣合同', value: 'DISPATCH' }, { label: '借调合同', value: 'SECONDMENT' }, { label: '其他', value: 'OTHER' }
      ]
    }
  },
  watch: {
    detailsInfo: {
      handler: function () {
        this.organizeIdList = []
        this.documentType()
        this.nationality()
        this.trialCycle()
        this.natureWork()
        this.publicCompany()
        this.publicLocation()
        this.getOrganization()
        this.resigna()
        this.selectEntryTime()
        this.selectStartWorkTime()
        if (this.detailsInfo.userPostManagements) {
          this.detailsInfo.userPostManagements.forEach((ele, index) => {
            let parentId = this.getOrganizeId(ele.organize)
            if (parentId.length >= 2) {
              parentId.reverse()
            }
            ele.organizeId = [...parentId, ele.organize.id]
            this.getUserposts(ele.organize.id, index)
          })
          console.log('a', this.detailsInfo.userPostManagements)
        }
        this.detailsInfoName = this.detailsInfo.name.length > 2 ? (this.detailsInfo.name).substring(this.detailsInfo.name.length - 2) : this.detailsInfo.name

        if (this.detailsInfo.natureWorkValue === '兼职' || this.detailsInfo.natureWorkValue === '实习' || this.detailsInfo.natureWorkValue === '外包' ||
          this.detailsInfo.natureWorkValue === '退休返聘' || this.detailsInfo.natureWorkValue === '劳务外包') {
          this.inputDisable = true
          if (this.detailsInfo.positiveState) {
            this.detailsInfo.positiveState = 'NOTMUST'
          }
          if (this.detailsInfo.trialCycle) {
            this.detailsInfo.trialCycle = -1
          }
        } else {
          this.inputDisable = false
        }
        if (this.detailsInfo.jobContracts.length === 0) {
          this.detailsInfo.jobContracts = [{
            contractNo: '',
            contractType: '',
            contractStatus: '',
            endTime: '',
            remark: '',
            signTime: '',
            startTime: ''
          }]
        }
        this.queryAnnexes()
        this.detailsInfo.iDNumber = this.decryptMsg(this.detailsInfo.iDNumber)
      }
    }
  },
  created () {
  },
  methods: {
    decryptMsg (val) {
      const val2 = decrypt(val)
      return val2
    },
    dtTypeChange () {
      if (this.detailsInfo.certificate === 2) {
        this.IDinfo = true
        if (this.detailsInfo.iDNumber && this.detailsInfo.iDNumber.length === 18) {
          this.IdCard(this.detailsInfo.iDNumber)
        }
      } else {
        this.IDinfo = false
      }
    },
    IdCard (userCard) {
      let birthday = userCard.substring(6, 10) + '-' + userCard.substring(10, 12) + '-' + userCard.substring(12, 14)
      var myDate = new Date()
      var month = myDate.getMonth() + 1
      var day = myDate.getDate()
      var age = myDate.getFullYear() - userCard.substring(6, 10) - 1
      if (userCard.substring(10, 12) < month || userCard.substring(10, 12) === month && userCard.substring(12, 14) <= day) {
        age++
      }
      this.detailsInfo.birthday = birthday
      this.detailsInfo.age = age
      let shengxiao = Calculator.shengxiao(birthday)
      let astro = Calculator.astro(userCard.substring(6, 10), userCard.substring(10, 12), userCard.substring(12, 14))
      this.$set(this.detailsInfo, 'chineseZodiac', shengxiao)
      this.$set(this.detailsInfo, 'zodiac', astro)
    },
    changeCompany (item) {
      let selectObj = this.companyOptions.filter((currentValue, index) => {
        return item.companyId === currentValue.id
      })
      item.company = selectObj[0].name
    },
    setAnnex (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.detailsInfo.facialPhoto = annexURL
      this.saveInfo('detailsInfos')
    },
    setAnnexs (annexURL, annexName) {
      let data = {
        'userId': this.detailsInfo.id,
        'annexName': annexName,
        'annexURL': annexURL
      }
      this.uploadAnnexes(data)
    },
    setDynamicAnnexs (annexURL, annexName) {
      this.dynamicAnnexes.push({
        'annexName': annexName,
        'annexURL': annexURL
      })
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    cancel () {
      this.pager.currentPage = 1
      this.onHide()
      this.$emit('resetData')
    },
    onHide () {
      this.$refs['detailsInfos'].resetFields()
      this.$refs['detailsInfozh'].resetFields()
      this.$emit('drawerClose', false)
      this.$emit('queryStaffInfo', false)
      this.readonly = true
      this.communicationReadonly = true
      this.educationReadonly = true
      this.secondReadonly = true
      this.contractReadonly = true
      this.socialReadonly = true
    },
    FormatChineseZodiac (vals) {
      let val = ''
      switch (vals) {
        case 'RAT':
          val = '鼠'
          break
        case 'OX':
          val = '牛'
          break
        case 'TIGER':
          val = '虎'
          break
        case 'HARE':
          val = '兔'
          break
        case 'DRAGON':
          val = '龙'
          break
        case 'SNAKE':
          val = '蛇'
          break
        case 'HORSE':
          val = '马'
          break
        case 'SHEEP':
          val = '羊'
          break
        case 'MONKEY':
          val = '猴'
          break
        case 'ROOSTER':
          val = '鸡'
          break
        case 'DOG':
          val = '狗'
          break
        case 'BOAR':
          val = '猪'
          break
      }
      return val
    },
    FormatZodiac (vals) {
      let val = ''
      switch (vals) {
        case 'ARIES':
          val = '白羊座'
          break
        case 'TAURUS':
          val = '金牛座'
          break
        case 'GEMINI':
          val = '双子座'
          break
        case 'CANCER':
          val = '巨蟹座'
          break
        case 'LEO':
          val = '狮子座'
          break
        case 'VIRGO':
          val = '处女座'
          break
        case 'LIBRA':
          val = '天秤座'
          break
        case 'SCORPIO':
          val = '天蝎座'
          break
        case 'SAGITTATIUS':
          val = '射手座'
          break
        case 'CAPRICORN':
          val = '摩羯座'
          break
        case 'AQUARIUS':
          val = '水瓶座'
          break
        case 'PISCES':
          val = '双鱼座'
          break
      }
      return val
    },
    FormatBloodType (vals) {
      let val = ''
      switch (vals) {
        case 'A':
          val = 'A'
          break
        case 'B':
          val = 'B'
          break
        case 'AB':
          val = 'AB'
          break
        case 'O':
          val = 'O'
          break
        case 'RHNEGATIVE':
          val = 'Rh阴性'
          break
        case 'RHPOSITIVE':
          val = 'Rh阳性'
          break
      }
      return val
    },
    FormatHousehold (vals) {
      let val = ''
      switch (vals) {
        case 'CITY':
          val = '城市户口'
          break
        case 'AGRICULTURE':
          val = '农业户口'
          break
        case 'COLLECTIVE':
          val = '集体户口'
          break
      }
      return val
    },
    FormatMaritalStatus (vals) {
      let val = ''
      switch (vals) {
        case 'UNMARRIED':
          val = '未婚'
          break
        case 'MARRIED':
          val = '已婚'
          break
        case 'DIVORCE':
          val = '离异'
          break
      }
      return val
    },
    FormatBirthFlg (vals) {
      let val = ''
      switch (vals) {
        case true:
          val = '是'
          break
        case false:
          val = '否'
          break
      }
      return val
    },
    FormatPoliticalA (vals) {
      let val = ''
      switch (vals) {
        case 'PARTYMEMBER':
          val = '党员'
          break
        case 'LEAGUEMEMBER':
          val = '团员'
          break
        case 'MASSES':
          val = '群众'
          break
        case 'PROBATIONARYMEMBER':
          val = '预备党员'
          break
        case 'OTHER':
          val = '其他'
          break
      }
      return val
    },
    FormatEducation (vals) {
      let val = ''
      switch (vals) {
        case 'PRIMARY':
          val = '小学'
          break
        case 'JUNIOR':
          val = '初中'
          break
        case 'SENIOR':
          val = '高中'
          break
        case 'SPECIAL':
          val = '中专'
          break
        case 'TECHNICAL':
          val = '技校'
          break
        case 'PROFESSIONAL':
          val = '职高'
          break
        case 'UNIVERSITIES':
          val = '大专'
          break
        case 'UNDERGRADUATE':
          val = '本科'
          break
        case 'MASTER':
          val = '硕士'
          break
        case 'DOCTOR':
          val = '博士'
          break
        case 'POSTDOCTOR':
          val = '博士后'
          break
        case 'OTHER':
          val = '其他'
          break
      }
      return val
    },
    FormatEducationType (vals) {
      let val = ''
      switch (vals) {
        case 'GENERAL':
          val = '统招'
          break
        case 'SELF':
          val = '自考'
          break
        case 'ADULT':
          val = '成人高考'
          break
        case 'SPECIAL':
          val = '中专'
          break
      }
      return val
    },
    FormatContractType (vals) {
      let val = ''
      switch (vals) {
        case 'FIXEDTERM':
          val = '固定期限合同'
          break
        case 'NOFIXEDTERM':
          val = '无固定期限合同'
          break
        case 'INTERNSHIP':
          val = '实习协议'
          break
        case 'SERVICE':
          val = '劳务合同'
          break
        case 'REEMPLOYMENT':
          val = '返聘协议'
          break
        case 'DISPATCH':
          val = '劳务派遣合同'
          break
        case 'SECONDMENT':
          val = '借调合同'
          break
        case 'OTHER':
          val = '其他'
          break
      }
      return val
    },
    FormatContractStatus (vals) {
      let val = ''
      switch (vals) {
        case 'WAIT':
          val = '待执行'
          break
        case 'EXECUTING':
          val = '执行中'
          break
        case 'OVERTIME':
          val = '已过期'
          break
      }
      return val
    },
    plus () {
      this.detailsInfo.userPostManagements.push(
        {
          organizeId: [],
          userPostId: '',
          onMaster: false,
          organize: { id: '' }
        }
      )
    },
    reduce (index) {
      this.detailsInfo.userPostManagements.splice(index, 1)
    },
    addJobContracts () {
      this.detailsInfo.jobContracts.push(
        {
          contractNo: '',
          contractType: '',
          contractStatus: '',
          endTime: '',
          remark: '',
          signTime: '',
          startTime: ''
        }
      )
    },
    deleteJobContracts () {
      this.detailsInfo.jobContracts.pop()
    },
    endTimeChange (item) {
      let startTime = Date.parse(item.startTime)
      let endTime = Date.parse(item.endTime)
      let noweTime = Date.parse(new Date())
      if (startTime > noweTime) {
        item.contractStatus = 'WAIT'
      } else if (endTime < noweTime) {
        item.contractStatus = 'OVERTIME'
      } else if (startTime < noweTime < endTime) {
        item.contractStatus = 'EXECUTING'
      }
    },
    natureWorkChange () {
      let natureWork = this.natureWorkOptions.filter((item) => {
        return item.id === this.detailsInfo.natureWork
      })
      if (natureWork[0].value === '兼职' || natureWork[0].value === '实习' || natureWork[0].value === '退休返聘' || natureWork[0].value === '劳务外包') {
        this.inputDisable = true
        if (this.detailsInfo.positiveState) {
          this.detailsInfo.positiveState = 'NOTMUST'
        }
        if (this.detailsInfo.trialCycle) {
          this.detailsInfo.trialCycle = ''
        }
      } else {
        this.inputDisable = false
      }
    },
    getOrganizeId (organize) {
      if (organize.parent) {
        let organizeId = organize.parent.id
        this.organizeIdList.push(organizeId)
        if (organize.parent.parent) {
          this.getOrganizeId(organize.parent)
        }
      }
      return this.organizeIdList
    },
    async turnpositive () {
    },
    handleClick () {
    },
    openAccount () { },
    async addCompany () {
      let result = await context.http.post('/uaa/api/public-classes', { name: this.companyName, publicStatus: 'COMPANY' })
      if (result.data) {
        this.newCompanyDialog = false
        this.publicCompany()
      }
    },
    async addLocation () {
      let result = await context.http.post('/uaa/api/public-classes', { name: this.locationName, publicStatus: 'LOCATION' })
      if (result.data) {
        this.newPlaceDialog = false
        this.publicLocation()
      }
    },
    async adddYnamic () {
      let result = await context.http.post('/uaa/api/user-dynamics', { userId: this.detailsInfo.id, occurTime: this.occurTime + 'T00:00:00Z', dynamicType: 'CUSTOMIZE', description: this.description, annexes: this.dynamicAnnexes })
      if (result.data) {
        this.occurTime = ''
        this.description = ''
        this.dynamicAnnexes = []
        this.dynamicdialogVisible = false
        this.$emit('queryStaffInfo', false)
        this.activeReset = true
        this.queryYnamic()
      }
    },
    delDynamic (item, index) {
      context.http.delete(`uaa/api/user-dynamics/${item.id}`).then(result => {
        if (result.status === 200) {
          this.detailsInfo.userDynamics.splice(index, 1)
          this.$message.success('删除成功')
          this.queryYnamic()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    queryYnamic () {
      context.http.get(`uaa/api/users/${this.detailsInfo.id}`).then(result => {
        if (result.status === 200) {
          this.detailsInfo = result.data
        }
      })
    },
    TimeTrans (val) {
      if (val) {
        return val.substring(0, 10)
      }
      return ''
    },
    handleChange (value, index) {
      let val = value[0]
      let organizeId = val[(val.length) - 1]
      this.detailsInfo.organizeDTO = {
        id: organizeId,
        name: '',
        userPost: '',
        parent: { name: '' }
      }
      this.detailsInfo.userPostManagements[index].userPostId = ''
      this.getUserposts(val[(val.length) - 1], index)
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
          this.detailsInfo.facialPhoto = path
        }).catch(error => {
          console.info(error)
        })
      }
    },
    annexDownload (item, index) {
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
    annexDelete (item, index) {
      context.http.delete(`/uaa/api/annexes/${item.id}`).then(res => {
        if (res.status === 200) {
          if (this.currentDataLength === 1 && this.pager.currentPage >= 2) {
            this.pager.currentPage = this.pager.currentPage - 1
          }
          this.queryAnnexes()
        }
      })
    },
    uploadAnnexes (data) {
      context.http.post('/uaa/api/annexes', data).then(res => {
        if (res) {
          this.queryAnnexes()
        }
      })
    },
    async getUserposts (organizeId, index) {
      let result = await context.http.get('/uaa/api/user-posts/organize', { organizeId: organizeId })
      if (result.data) {
        this.postOptions = result.data
        this.detailsInfo.userPostManagements[index].postOptions = result.data
        if (this.postOptions.length === 0) {
          this.detailsInfo.userPostManagements[index].userPostId = ''
        }
        this.$forceUpdate()
      }
    },
    async saveInfo (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 合同信息校验
          let jobContracts = this.detailsInfo.jobContracts
          for (let i = 0; i < jobContracts.length; i++) {
            if (jobContracts[i].contractNo || jobContracts[i].contractType || jobContracts[i].startTime ||
              jobContracts[i].endTime || jobContracts[i].signTime || jobContracts[i].companyId) {
              if (!jobContracts[i].contractNo || !jobContracts[i].contractType || !jobContracts[i].startTime ||
                !jobContracts[i].endTime || !jobContracts[i].signTime || !jobContracts[i].companyId) {
                this.$message({
                  showClose: true,
                  message: '合同信息请输入完整',
                  type: 'error'
                })
                return false
              }
            }
          }
          let putData = JSON.parse(JSON.stringify(this.detailsInfo))
          putData.userPostManagements.forEach(ele => {
            if (Array.isArray(ele.organize.id)) {
              let organizeId = ele.organize.id[(ele.organize.id.length) - 1]
              ele.organize = { id: organizeId }
            }
            delete ele.organizeId
          })
          if (putData.jobContracts[0].contractNo === '') {
            putData.jobContracts = []
          }
          if (!putData.zodiac) {
            putData.zodiac = null
          }
          context.http.put('uaa/api/users', putData).then(res => {
            if (res.data) {
              this.pager.currentPage = 1
              _this.onHide()
              _this.$emit('updateData')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async resignation (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let putData = { id: this.detailsInfo.id, resignaDate: this.quitData.resignaDate, resignaId: this.quitData.resignaId, resignaReason: this.quitData.resignaReason }
          context.http.put('uaa/api/users/resignation', putData).then(res => {
            if (res.data) {
              _this.resignationdialogVisible = false
              this.onHide()
              this.$emit('resetData')
              this.quitData = { resignaId: '', resignaDate: '', resignaReason: '' }
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async regular (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let putData = { id: this.detailsInfo.id, sjPositiveDate: this.regularData.regularDate, positiveReason: this.regularData.regularReason }
          context.http.put('uaa/api/users/turnpositive', putData).then(res => {
            if (res.data) {
              _this.regulardialogVisible = false
              this.onHide()
              this.regularData = { sjPositiveDate: '', positiveReason: '' }
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async documentType () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=证件类型')
      this.documentTypeOptions = result.data
    },
    async nationality () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=国籍')
      this.nationalityOptions = result.data
    },
    async trialCycle () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=试用期')
      this.trialCycleOptions = result.data
    },
    async natureWork () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=工作性质')
      this.natureWorkOptions = result.data
    },
    async resigna () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=离职原因')
      this.resignaOptions = result.data
    },
    async publicCompany () {
      let result = await context.http.get('/uaa/api/public-classes/company')
      this.companyOptions = result.data
    },
    async publicLocation () {
      let result = await context.http.get('/uaa/api/public-classes/location')
      this.locationOptions = result.data
    },
    async getOrganization () {
      let result = await context.http.get('uaa/api/organizes/tree', { postFlg: false })
      let organizationOptions = result.data.organizeTree
      let cascaderData = []
      organizationOptions.forEach(item => {
        cascaderData.push(this.parseOrganize(item))
      })
      this.organizationOptions = cascaderData
    },
    parseOrganize (organizeTree) {
      if (organizeTree.leaf) {
        return { value: organizeTree.data.id, label: organizeTree.data.name }
      } else {
        return {
          value: organizeTree.data.id,
          label: organizeTree.data.name,
          children: organizeTree.children.map(item => {
            return this.parseOrganize(item)
          })
        }
      }
    },
    deleFile (item, index) {
      this.dynamicAnnexes.splice(index, 1)
    },
    queryAnnexes () {
      context.http.get('uaa/api/annexes', { userId: this.detailsInfo.id, page: (this.pager.currentPage - 1), size: this.pager.pgSize, sort: 'desc' }).then(res => {
        if (res.status === 200) {
          this.detailsInfoAnnexes = res.data
          this.pager.total = Number(res.headers['x-total-count'])
          this.currentDataLength = res.data.length
        }
      })
    },
    pgSizeSelectFn () { // 切换显示条数
      this.pager.currentPage = 1
      this.queryAnnexes()
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.queryAnnexes()
    },
    selectEntryTime () {
      let tartTime = new Date(Date.parse(this.detailsInfo.entryTime))
      let cAge = Calculator.dateBetween(tartTime)
      this.$set(this.detailsInfo, 'cAge', cAge)
      this.inputReadNnly = true
    },
    selectStartWorkTime () {
      let startTime = new Date(Date.parse(this.detailsInfo.startWorkTime))
      let wAge = Calculator.dateBetween(startTime)
      this.$set(this.detailsInfo, 'wAge', wAge)
    }
  }
}
</script>
<style lang="scss">
.personal-info-wrap {
  height: calc(100% - 61px);
  .mainlayout1 {
    height: 100%;
    .main-content {
      height: 100%;
      .el-tabs {
        height: calc(100% - 170px);
        .el-tabs__content {
          height: calc(100% - 60px);
          overflow-y: auto;
          overflow-x: hidden;
          background-color: #f9f9f9;
        }
        .el-tabs__content::-webkit-scrollbar {
          width: 4px !important;
          height: 4px !important;
        }
        .el-tabs__content::-webkit-scrollbar-track {
          box-shadow: inset 0 0 6px #fff;
          background-color: #fff;
        }
        .el-tabs__content::-webkit-scrollbar-thumb {
          border-radius: 10px;
          box-shadow: inset 0 0 6px #cccccc;
        }
      }
    }
  }
}
.mainlayout1 {
  .main-content {
    padding: 0!important;
    .personalInfo {
      height: 100%;
      .head {
        border-bottom: 1px solid #f0f2f3;
        background-color: #ffffff;
        border-radius: 4px;
        -moz-box-shadow: 0px 1px 8px #e5e5e5;
        -webkit-box-shadow: 0px 1px 8px #e5e5e5;
        box-shadow: 0px 1px 8px #e5e5e5;
        height: 140px;
        .head-portrait {
          width: 100px;
          height: 100px;
          border: 1px solid #f0f2f3;
          border-radius: 50%;
          margin: 28px 28px 0 40px;
          position: relative;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
          input {
            position: absolute;
            top: 0;
            right: 0;
            width: 100px;
            height: 30px;
            opacity: 0;
            cursor: pointer;
          }
          .hover-tip {
            display: none;
            position: absolute;
            width: 99px;
            height: 32px;
            line-height: 32px;
            background: rgba(0, 0, 0, 1);
            opacity: 0.6;
            color: #fff;
            bottom: 0;
            left: 0;
            cursor: pointer;
            text-align: center;
          }
          &:hover {
            .hover-tip {
              display: inline-block;
            }
          }
          .aliUpload {
            position: relative;
            top: -32px;
          }
        }
        .default-hportrait {
          background-color: #409eff;
          line-height: 90px;
          text-align: center;
          color: #fff;
        }
        .infomation {
          padding-top: 28px;
          p:nth-of-type(1) {
            font-size: 16px;
            span {
              display: inline-block;
              width: 70px;
              height: 26px;
              line-height: 26px;
              border-radius: 16px;
              text-align: center;
              font-size: 14px;
              background-color: #fff8ef;
              color: #e99a56;
              border: 1px solid #e99a56;
              margin-left: 16px;
            }
          }
          p:nth-of-type(2) {
            margin: 10px 0;
            color: #666;
            font-size: 14px;
            .verticalline {
              display: inline-block;
              width: 1px;
              height: 10px;
              border: 1px solid #cccccc;
              margin: 0 10px;
            }
          }
          p:last-child {
            color: #666;
            font-size: 14px;
            span {
              color: #000;
            }
          }
        }
        .morebtn {
          width: 80px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          background-color: #65ac69;
          color: #fff;
          border-radius: 4px;
          margin: 80px 10px 0 0;
          cursor: pointer;
        }
      }
      .el-tabs {
        // background-color: #fff;
        // margin-top: 20px;
      }
      .el-tabs__header {
        background-color: #fff;
        box-shadow: 0px 1px 8px #e5e5e5;
      }
      .el-tabs__item {
        width: 200px;
        text-align: center;
      }
      .el-tabs__content {
        height: 100%;
        // overflow: auto;
        border-radius: 4px;
        box-shadow: none;
      }
      .el-tab-pane {
        height: 100%;
        .personal-info {
          background-color: #fff;
          margin-bottom: 20px;
          // -moz-box-shadow: 0px 1px 8px #e5e5e5;
          // -webkit-box-shadow: 0px 1px 8px #e5e5e5;
          // box-shadow: 0px 1px 8px #e5e5e5;
        }
        .material-annex {
          margin-bottom: 0;
          .ma-head {
            background-color: #fafafa;
            height: 30px;
            line-height: 30px;
            display: flex;
            justify-content: space-between;
            span {
              display: inline-block;
              width: 10%;
              font-size: 12px;
              &:first-child {
                width: 85%;
                padding-left: 40px;
              }
            }
          }
          .ma-content {
            background-color: #fff;
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid #eeeeee;
            span {
              display: inline-block;
              width: 10%;
              font-size: 12px;
              &:first-child {
                padding-left: 40px;
                width: 85%;
              }
              &:last-child {
                text-align: center;
              }
            }
          }
        }
      }
      .personal-info {
        .pi-head {
          font-size: 14px;
          height: 50px;
          line-height: 50px;
          padding-left: 15px;
          border-bottom: 1px solid #d6d6d6;
          position: relative;
        }
        .editbtns {
          display: block;
          float: right;
          margin: 0 20px 0 0;
          font-size: 12px;
          cursor: pointer;
          i {
            line-height: 16px;
          }
          color: #3575f6;
        }
        .savebtns {
          float: right;
          width: 90px;
          height: 26px;
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          margin-right: 20px;
          div {
            width: 44px;
            height: 26px;
            line-height: 26px;
            text-align: center;
            border-radius: 4px;
            font-size: 12px;
            color: #777777;
            cursor: pointer;
            &:last-child {
              background: rgba(42, 110, 240, 1);
              box-shadow: 0px 1px 2px 0px rgba(79, 139, 255, 0.5);
              color: #fff;
            }
          }
        }
        .adddynamicbtn {
          width: auto;
          border: 1px solid #0f75ff;
          border-radius: 4px;
          color: #0f75ff;
          cursor: pointer;
          font-size: 12px;
          padding: 2px 6px;
          margin-left: 20px;
          position: absolute;
          height: 22px;
          line-height: 17px;
          right: 20px;
          top: 14px;
          input {
            position: absolute;
            right: 0;
            width: 100%;
            height: 20px;
            opacity: 0;
            cursor: pointer;
          }
        }
        .el-form {
          padding: 30px 15px;
        }
        .el-form-item {
          width: 30%;
          margin-right: 42px;
          display: inline-block;
          vertical-align: top;
          &:nth-of-type(3n) {
            margin-right: 0;
          }
          .cttitle {
            color: #7085a1;
            font-size: 12px;
            margin-bottom: 10px;
            i {
              font-style: normal;
              color: red;
              vertical-align: sub;
            }
            span:nth-of-type(2) {
              float: right;
            }
          }
          .el-select {
            width: 100%;
          }
        }
        .dynamic-content {
          margin: 40px;
          .steps-warp {
            .steps {
              min-height: 70px;
              padding-left: 30px;
              display: flex;
              justify-content: flex-start;
              border-left: 1px solid #eeefef;
              font-size: 12px;
              > div {
                &.content {
                  width: 80%;
                }
              }
              > i {
                &.iconfont {
                  cursor: pointer;
                }
              }
              &:last-child {
                height: auto;
                min-height: auto;
                border: none;
              }
              &:before {
                content: "";
                display: inline-block;
                width: 10px;
                height: 10px;
                background-color: #cbcccd;
                border-radius: 50%;
                position: relative;
                left: -35px;
                top: 1px;
              }
              div:nth-of-type(2) {
                margin-left: 40px;
              }
            }
          }
        }
        .cttitle {
          span {
            color: #0f75ff;
            font-size: 12px;
            float: right;
            cursor: pointer;
          }
          .postTips {
            color: #666;
            float: none;
            margin-left: 6px;
          }
          .el-checkbox {
            margin-left: 6px;
            span {
              float: none !important;
              color: #666;
              margin-left: 0;
            }
          }
        }
        .jobContracts-op {
          display: inline-block;
          color: #0f75ff;
          font-size: 20px;
          margin: 0 10px 0 20px;
          cursor: pointer;
        }
        .contracts-div {
          border-bottom: 1px solid #e5e5e5;
          padding-top: 10px;
          &:last-child {
            border: none;
          }
          &:first-child {
            padding-top: 0;
          }
        }
      }
    }
  }
  .aliUploads {
    opacity: 0;
    position: relative;
    top: -26px;
  }
  .el-form-item__content {
    width: 100%;
    display: inline-block;
    // height: 91px;
    vertical-align: bottom;
    .read-only {
      height: 40px;
      width: 190px;
      font-size: 12px;
    }
    .el-cascader {
      width: 100%;
    }
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .regularTips {
    background-color: #ecfafa;
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    span {
      float: right;
      color: #0f75ff;
      padding-right: 20px;
      cursor: pointer;
    }
  }
}
.enclosure-aliUploads {
  opacity: 0;
  top: -20px;
  position: relative;
  input {
    left: 37px;
  }
}
.adddEnclosurebtn {
  width: 80px;
  border: 1px solid #0f75ff;
  border-radius: 4px;
  color: #0f75ff !important;
  cursor: pointer;
  font-size: 12px;
  padding: 2px 6px;
  margin-left: 20px;
  height: 22px;
  line-height: 17px;
}
@media screen and (min-width: 1500px) {
  .per-detail {
    padding-right: 4%;
  }
}
</style>
