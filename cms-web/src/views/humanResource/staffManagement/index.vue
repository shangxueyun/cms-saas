<template>
  <div class="staffManage">
    <span class="page_head_title">员工档案</span>
    <div class="ct-content">
      <div class="search-bar">
        <div class="searbar-left">
          <!-- <el-select style="width: 200px"
                     v-model="projectManagementId"
                     :clearable="onGroupPersonnel"
                     placeholder="项目"
                     size="small">
            <el-option v-for="item in projectOptions"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select> -->
          <el-cascader :options="organizationOptions1"
                       v-if="onGroupPersonnel"
                       change-on-select
                       clearable
                       expand-trigger="hover"
                       v-model="organizeId">
          </el-cascader>
          <el-cascader :options="enterpriseUser"
                       v-else
                       change-on-select
                       clearable
                       expand-trigger="hover"
                       v-model="organizeId">
          </el-cascader>
          <!-- <el-select v-model="enterpriseUserId"
                     v-else
                     placeholder="请选择"
                     clearable
                     size="small">
            <el-option v-for="item in enterpriseUser"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select> -->
          <el-input v-model="inputValue"
                    size="small"
                    placeholder="工号/姓名/岗位"></el-input>
          <el-select style="width: 200px"
                     v-model="useStatus"
                     placeholder="请选择"
                     size="small">
            <el-option v-for="item in statusOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <div class="query-btn"
               @click="indexQuery">查询</div>
        </div>
        <div class="searbar-left">
          <el-button style="margin-right: 10px"
                     class="tban tban1"
                     v-if="hasAuthority('01010301')"
                     @click="release"><i class="iconfont icon-crm_xinzeng-"></i> 新增员工</el-button>
          <el-dropdown trigger="hover">
            <div class="morebtn el-dropdown-link">
              <i class="icon-daochu"
                 style="font-size: 12px; margin-left: 10px"></i>
              批量操作
              <i class="el-icon-arrow-down el-icon--right"
                 style="font-size: 12px"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span @click="downLoadModel">下载导入模版</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span class="export-info"
                      style="postion: relative">导入员工信息
                  <input type="file"
                         style="
                      position: absolute;
                      opacity: 0;
                      bottom: 17px;
                      left: 0;
                      width: 123px;
                    "
                         @change="importModel($event)" />
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!-- <el-checkbox-group v-model="checkList"
                         @change="bindCheckBox">
        <el-checkbox label="">全部</el-checkbox>
        <el-checkbox label="ONJOB">在职</el-checkbox>
        <el-checkbox label="RESIGNA">离职</el-checkbox>
      </el-checkbox-group> -->
      <div class="ctc-table">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column prop="jobNumber"
                           label="工号"
                           align="center">
          </el-table-column>
          <el-table-column label="姓名（英文名）"
                           align="center">
            <template slot-scope="scope">
              {{ scope.row.name }}
              <span v-if="scope.row.englishName">({{ scope.row.englishName }})</span>
            </template>
          </el-table-column>
          <el-table-column label="组织"
                           align="center">
            <template slot-scope="scope"
                      v-if="scope.row.userPostManagements">
              <p v-for="(item, index) in scope.row.userPostManagements"
                 :key="index">
                {{ item.organize.name }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="岗位"
                           align="center">
            <template slot-scope="scope"
                      v-if="scope.row.userPostManagements">
              <p v-for="(item, index) in scope.row.userPostManagements"
                 :key="index">
                {{ item.userPostName }}
                <span v-if="!item.onMaster">(兼)</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="natureWorkValue"
                           label="工作性质"
                           align="center">
          </el-table-column>
          <el-table-column prop="positiveState"
                           label="是否转正"
                           :formatter="stateFormat"
                           align="center">
          </el-table-column>
          <el-table-column prop="jobStatus"
                           label="是否在职"
                           :formatter="jobStateFormat"
                           align="center">
          </el-table-column>
          <el-table-column label="操作"
                           v-if="hasAuthority('01010302')"
                           align="center">
            <template slot-scope="scope">
              <el-button class="operation-btn"
                         size="mini"
                         @click="handleEdit(scope.$index, scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot1">
        <span><span style="margin-right: 10px">{{ currentPage }}/{{ Math.ceil(total / pgSize) }}页</span>
          共{{ total }}条记录</span>
        <el-pagination v-if="total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size="pgSize"
                       :total="total"
                       :current-page="currentPage"
                       @current-change="current_change">
        </el-pagination>
        <div class="pagingnum">
          显示
          <select v-model="pgSize"
                  @change="currentSel">
            <option v-for="item in pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"></option>
          </select>
          条目
        </div>
      </div>
    </div>
    <el-dialog title="添加员工"
               :close-on-click-modal="false"
               :visible.sync="editdialogVisible"
               class="addStaffdialog">
      <div class="dl-content clearfix">
        <div class="step1">
          <div class="dc-right float-right">
            <div class="dr-head">个人信息</div>
            <el-form :model="addData"
                     ref="addData"
                     :rules="addDataRules">
              <el-form-item :label-width="formLabelWidth"
                            prop="name">
                <div class="cttitle">姓名<i class="required">*</i></div>
                <el-input v-model="addData.name"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px">
                <div class="cttitle">英文名</div>
                <el-input v-model="addData.englishName"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            prop="sex"
                            style="margin-bottom: 20px">
                <div class="cttitle">性别<i class="required">*</i></div>
                <el-select v-model="addData.sex"
                           placeholder="请选择">
                  <el-option v-for="item in sexOptions"
                             :key="item.value"
                             :label="item.name"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            prop="telephone"
                            style="margin-bottom: 20px">
                <div class="cttitle"
                     style="display: flex">
                  手机号<span style="color: red; vertical-align: sub; margin-right: 15px">*</span>
                  <el-checkbox v-model="addData.onHidePhone">通讯录不显示手机号</el-checkbox>
                  <!-- <i class="icon question-mark-icon"></i> -->
                </div>
                <el-input v-model="addData.telephone"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px">
                <div class="cttitle">证件类型</div>
                <el-select v-model="addData.certificate"
                           placeholder="请选择">
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
                <el-input v-model="addData.iDNumber"
                          @blur="dtTypeChange"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="vertical-align: top">
                <div class="cttitle">出生日期</div>
                <span v-if="IDinfo">{{ addData.birthday }}</span>
                <el-date-picker v-else
                                v-model="addData.birthday"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <!-- <el-form-item :label-width="formLabelWidth"
                            style="vertical-align: top">
                <div class="cttitle">年龄</div>
                <span v-if="IDinfo">{{ addData.age }}</span>
                <el-input v-else
                          v-model="addData.age"
                          type="number"
                          placeholder="请输入内容"></el-input>
              </el-form-item> -->
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px">
                <div class="cttitle">属相</div>
                <el-select v-model="addData.chineseZodiac"
                           placeholder="请选择">
                  <el-option v-for="item in zodiacOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px">
                <div class="cttitle">星座</div>
                <el-select v-model="addData.zodiac"
                           placeholder="请选择">
                  <el-option v-for="item in constellationOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="step2">
            <div class="dc-right float-right">
              <el-form :model="addData"
                       ref="addData2"
                       :rules="addDataRules2">
                <div class="dc-right_div">
                  <div class="dr-head">在职信息</div>
                  <el-form-item :label-width="formLabelWidth">
                    <div class="cttitle">工号</div>
                    <el-input v-model="addData.jobNumber"
                              placeholder="请输入内容"></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                prop="entryTime"
                                style="margin-bottom: 20px">
                    <div class="cttitle">入职时间<i class="required">*</i></div>
                    <el-date-picker v-model="addData.entryTime"
                                    @change="selectEntryTime"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                prop="natureWork"
                                style="margin-bottom: 20px">
                    <div class="cttitle">工作性质<i class="required">*</i></div>
                    <el-select v-model="addData.natureWork"
                               @change="natureWorkChange"
                               placeholder="请选择">
                      <el-option v-for="item in natureWorkOptions"
                                 :key="item.id"
                                 :label="item.value"
                                 :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <div style="text-align: right; padding-right: 21px">
                    <span class="plus"
                          @click="plus">+</span>
                  </div>
                  <div v-for="(item, index) in addData.userPostManagements"
                       :key="index">
                    <el-form-item :label-width="formLabelWidth"
                                  :prop="'userPostManagements.' + index + '.organizeId'"
                                  :rules="addDataRules2.organizeId">
                      <div class="cttitle">组织<i class="required">*</i></div>
                      <el-cascader :options="organizationOptions1"
                                   v-if="onGroupPersonnel"
                                   change-on-select
                                   expand-trigger="hover"
                                   v-model="item.organizeId"
                                   @change="handleChange">
                      </el-cascader>
                      <el-cascader :options="enterpriseUser"
                                   v-else
                                   change-on-select
                                   clearable
                                   expand-trigger="hover"
                                   v-model="item.organizeId"
                                   @change="handleChange">
                      </el-cascader>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  :prop="'userPostManagements.' + index + '.userPostId'"
                                  :rules="addDataRules2.userPostId"
                                  style="margin-bottom: 20px">
                      <div class="cttitle psotmaster">
                        <span style="color: red !important; vertical-align: sub">*</span>
                        <i style="font-style: normal; padding-right: 10px">岗位</i>
                        <!-- <el-checkbox v-model="item.onMaster" @change="cliclCheckbox(item, index)">主要职务</el-checkbox> -->
                        <i class="post"
                           :class="{ psActive: item.onMaster }"
                           @click="cliclCheckbox(item, index)"></i>主要职务
                        <el-tooltip class="item"
                                    effect="dark"
                                    placement="right-start">
                          <div slot="content">
                            支持一位员工添加多个岗位，如多个岗位中分为主职和兼职，<br />可在岗位前勾选
                          </div>
                          <i class="icon question-mark-icon"></i>
                        </el-tooltip>
                      </div>
                      <el-select v-model="item.userPostId"
                                 placeholder="请选择">
                        <el-option v-for="item2 in postOptions"
                                   :key="item2.id"
                                   :label="item2.name"
                                   :value="item2.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px">
                      <div class="cttitle">
                        职务名称
                        <span class="reduce"
                              @click="reduce(index)"
                              v-if="
                            addData.userPostManagements.length > 1 && index > 0
                          ">-</span>
                      </div>
                      <el-input v-model="item.jobTitle"
                                placeholder="请输入内容"></el-input>
                    </el-form-item>
                  </div>
                  <el-form-item :label-width="formLabelWidth"
                                prop="positiveState"
                                :rules="
                      inputDisable === true
                        ? [{ message: '请选择', trigger: 'blur' }]
                        : addDataRules2.positiveState
                    "
                                style="margin-bottom: 20px">
                    <div class="cttitle">是否转正<i class="required">*</i></div>
                    <el-select :disabled="inputDisable"
                               v-model="addData.positiveState"
                               placeholder="请选择">
                      <el-option v-for="item in positiveStateOptions"
                                 :key="item.value"
                                 :label="item.name"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                prop="trialCycle"
                                :rules="
                      inputDisable === true
                        ? [{ message: '请选择', trigger: 'blur' }]
                        : addDataRules2.trialCycle
                    "
                                style="margin-bottom: 20px">
                    <div class="cttitle">试用期<i class="required">*</i></div>
                    <el-select :disabled="inputDisable"
                               v-model="addData.trialCycle"
                               placeholder="请选择">
                      <el-option v-for="item in trialCycleOptions"
                                 :key="item.id"
                                 :label="item.value"
                                 :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                prop="email">
                    <div class="cttitle">工作邮箱</div>
                    <el-input v-model="addData.email"
                              placeholder="请输入内容"></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px">
                    <div class="cttitle">司龄</div>
                    <el-input v-model="addData.cAge"
                              :disabled="inputReadNnly"
                              placeholder="请输入内容"></el-input>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                style="margin-bottom: 20px; width: 63%">
                    <div class="cttitle">
                      工作地点<span></span>
                      <span @click="newPlaceDialog = true">+ 创建新的工作地点</span>
                    </div>
                    <el-select v-model="addData.workPlaceId"
                               placeholder="请选择">
                      <el-option v-for="item in locationOptions"
                                 :key="item.id"
                                 :label="item.name"
                                 :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <!-- <div class="dc-right_div">
                    <div class="dr-head">工作信息</div>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;width: 95%">
                      <div class="cttitle">合同企业<span></span>
                        <span @click="newCompanyDialog = true">+ 创建新的合同企业</span>
                      </div>
                      <el-select v-model="addData.contractCompanyId"
                                placeholder="请选择">
                        <el-option v-for="item in companyOptions"
                                  :key="item.id"
                                  :label="item.name"
                                  :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;width: 95%">
                      <div class="cttitle">工作地点<span></span>
                        <span @click="newPlaceDialog = true">+ 创建新的工作地点</span>
                      </div>
                      <el-select v-model="addData.workPlaceId"
                                placeholder="请选择">
                        <el-option v-for="item in locationOptions"
                                  :key="item.id"
                                  :label="item.name"
                                  :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div> -->
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="editdialogVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   @click="addStaff('addData2')">确 认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增合同企业"
               :close-on-click-modal="false"
               :visible.sync="newCompanyDialog"
               center>
      <div style="padding: 30px 0 40px 0">
        <div style="padding-bottom: 10px">合同企业</div>
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
               :close-on-click-modal="false"
               :visible.sync="newPlaceDialog"
               center>
      <div style="padding: 30px 0 40px 0">
        <div style="padding-bottom: 10px">
          工作地点<span style="color: red">*</span>
        </div>
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
    <el-dialog title="错误提示"
               :visible.sync="errorPrompt">
      <el-table :data="gridData"
                style="
          min-height: 200px;
          border-left: 1px solid #eee;
          border-right: 1px solid #eee;
        ">
        <el-table-column property="fileName"
                         label="导入文件"
                         align="center"></el-table-column>
        <el-table-column label="导入结果"
                         align="center"
                         width="220px">
          <template slot-scope="scope">
            <span style="color: red">{{ scope.row.result }}</span>
          </template>
        </el-table-column>
        <el-table-column property="address"
                         label="操作"
                         align="center"
                         width="140px">
          <template slot-scope="scope">
            <span class="export-error"
                  @click="downLoadModel(scope.$index, scope.row)">导出错误提示</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="errorPrompt = false"
                   class="close-button">关 闭</el-button>
      </span>
    </el-dialog>
    <personalInfo :detailsdrawershow="detailsShow"
                  @drawerClose="detailsClose"
                  :detailsInfo="detailsInfo"
                  @handleEdit="handleEdit"
                  @query="query" />
  </div>
</template>
<script>
import axios from 'axios'
import context from '@/service'
import { Calculator } from '@/utils/validate'
import IdentityCodeValid from '@/utils/checkIdent'
import personalInfo from './components/personalInfo'
export default {
  name: 'organizationManage',
  components: {
    personalInfo
  },
  data () {
    var _this = this
    var validateIDNumber = (rule, value, callback) => {
      if (_this.addData.certificate === 2) {
        // var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        // if (!reg.test(value)) {
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
      enterpriseUserId: '',
      enterpriseUser: [],
      organizeId: [],
      projectManagementId: '',
      useStatus: 'ONJOB',
      projectOptions: [],
      statusOptions: [
        {
          value: 'ONJOB',
          label: '在职'
        },
        {
          value: 'RESIGNA',
          label: '离职'
        },
        {
          value: '',
          label: '全部'
        }
      ],
      detailsInfo: {
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
        }]
      },
      gridData: [{
        fileName: '',
        result: '',
        id: ''
      }],
      errorPrompt: false,
      organizeDTO: [],
      locationName: '',
      companyName: '',
      detailsShow: false,
      newCompanyDialog: false,
      newPlaceDialog: false,
      newlystep1: true,
      newlystep2: false,
      checkList: [''],
      checkAll: false,
      checkedCities: ['上海', '北京'],
      checked: false,
      organizationType: [],
      documentTypeOptions: [],
      nationalityOptions: [],
      natureWorkOptions: [],
      companyOptions: [],
      locationOptions: [],
      organizationOptions: [],
      organizationOptions1: [], // 组织树
      postOptions: [],
      zodiacOptions: [
        { label: '请选择', value: '' }, { label: '鼠', value: 'RAT' }, { label: '牛', value: 'OX' }, { label: '虎', value: 'TIGER' }, { label: '兔', value: 'HARE' }, { label: '龙', value: 'DRAGON' }, { label: '蛇', value: 'SNAKE' }, { label: '马', value: 'HORSE' }, { label: '羊', value: 'SHEEP' }, { label: '猴', value: 'MONKEY' }, { label: '鸡', value: 'ROOSTER' }, { label: '狗', value: 'DOG' }, { label: '猪', value: 'BOAR' }
      ],
      constellationOptions: [
        { label: '请选择', value: '' }, { label: '白羊座', value: 'ARIES' }, { label: '金牛座', value: 'TAURUS' }, { label: '双子座', value: 'GEMINI' }, { label: '巨蟹座', value: 'CANCER' }, { label: '狮子座', value: 'LEO' }, { label: '处女座', value: 'VIRGO' }, { label: '天秤座', value: 'LIBRA' }, { label: '天蝎座', value: 'SCORPIO' }, { label: '射手座', value: 'SAGITTATIUS' }, { label: '摩羯座', value: 'CAPRICORN' }, { label: '水瓶座', value: 'AQUARIUS' }, { label: '双鱼座', value: 'PISCES' }
      ],
      tableData: [],
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
      ],
      positiveStateOptions: [
        {
          name: '试用期',
          value: 'PROBATION'
        },
        {
          name: '正式',
          value: 'TURNPOSITIVE'
        }
      ],
      trialCycleOptions: [],
      addData: {
        facialPhoto: '',
        onHidePhone: true,
        userPostManagements: [{
          organizeId: [],
          userPostId: '',
          onMaster: true
        }]
      },
      addDataRules: {
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
      addDataRules2: {
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
      options: [],
      sexOptions: [
        { name: '男', value: 'MAN' },
        { name: '女', value: 'WOMAN' }
      ],
      errorField: false,
      errorTip: '',
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      formLabelWidth: '120px',
      dialogFormVisible: false,
      dialogVisible: false,
      editdialogVisible: false,
      readonly: true,
      createdDate: '',
      dataLength: 0,
      inputValue: '',
      IDinfo: false,
      inputDisable: false,
      inputReadNnly: false,
      onGroupPersonnel: false
    }
  },
  created () {
    // let user = JSON.parse(sessionStorage.getItem('user'))
    // this.onGroupPersonnel = user.onGroupPersonnel
    this.onGroupPersonnel = true
    if (this.onGroupPersonnel) {
      this.getOrganization1()
    } else {
      this.getEnterpriseuser()
    }
    this.query()
  },
  methods: {
    async getEnterpriseuser () { // 非集团人士权限 组织列表
      let result = await context.http.get('uaa/api/organizes/enterprise/user?onTree=true')
      // this.enterpriseUser = result.data
      let organizationOptions = result.data
      let cascaderData = []
      organizationOptions.forEach(item => {
        cascaderData.push(this.parseOrganize2(item))
      })
      this.enterpriseUser = cascaderData
    },
    async getOrganization1 () { // 集团人士权限 组织树
      let result = await context.http.get('uaa/api/organizes/tree', { postFlg: false })
      let organizationOptions1 = result.data.organizeTree
      let cascaderData = []
      organizationOptions1.forEach(item => {
        cascaderData.push(this.parseOrganize(item))
      })
      this.organizationOptions1 = cascaderData
    },
    async query () {
      let organizeId = ''
      // if (this.onGroupPersonnel) {
      //   organizeId = this.organizeId.length ? this.organizeId[this.organizeId.length - 1] : ''
      // } else {
      //   organizeId = this.enterpriseUserId
      // }
      organizeId = this.organizeId.length ? this.organizeId[this.organizeId.length - 1] : ''
      let result = await context.http.get('uaa/api/users', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'id,desc',
        organizeId: organizeId,
        jobStatus: this.useStatus,
        queryName: this.inputValue
      })
      this.tableData = result.data
      this.dataLength = result.data.length
      this.total = Number(result.headers['x-total-count'])
    },
    async queryProjectManagement () {
      let user = JSON.parse(sessionStorage.getItem('user'))
      this.onGroupPersonnel = user.onGroupPersonnel
      context.http.get('/uaa/api/organizes/userPost?flag=false', { useStatus: 'USING' }).then(res => {
        if (res.status === 200) {
          this.projectOptions = res.data
          if (this.onGroupPersonnel) {
            this.projectManagementId = ''
          } else {
            this.projectManagementId = res.data[0].id
          }
          if (sessionStorage.getItem('searchInfo')) {
            let searchInfo = JSON.parse(sessionStorage.getItem('searchInfo'))
            console.log(searchInfo)
            this.currentPage = searchInfo.currentPage
            this.pgSize = searchInfo.pgSize
            this.projectManagementId = searchInfo.organizeId
            this.useStatus = searchInfo.jobStatus
            this.inputValue = searchInfo.queryName
            sessionStorage.removeItem('searchInfo')
            this.query()
          } else {
            this.query()
          }
        }
      })
    },
    indexQuery () {
      this.currentPage = 1
      this.query()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    stateFormat (row, column) {
      let positiveState = ''
      if (row.natureWorkValue === '兼职' || row.natureWorkValue === '实习' || row.natureWorkValue === '外包' ||
        row.natureWorkValue === '退休返聘' || row.natureWorkValue === '劳务外包') {
        if (row.positiveState) {
          positiveState = '没有转正'
        }
      } else {
        positiveState = row.positiveState === 'PROBATION' ? '试用期' : '正式'
      }
      return positiveState
    },
    jobStateFormat (row, column) {
      return row.jobStatus === 'ONJOB' ? '在职' : '离职'
    },
    natureWorkChange () {
      let natureWork = this.natureWorkOptions.filter((item) => {
        return item.id === this.addData.natureWork
      })
      if (natureWork[0].value === '兼职' || natureWork[0].value === '实习' || natureWork[0].value === '退休返聘' || natureWork[0].value === '劳务外包') {
        this.inputDisable = true
        if (this.addData.positiveState) {
          this.addData.positiveState = ''
        }
        if (this.addData.trialCycle) {
          this.addData.trialCycle = ''
        }
      } else {
        this.inputDisable = false
      }
    },
    plus () {
      this.addData.userPostManagements.push(
        {
          organizeId: [],
          userPostId: '',
          onMaster: false
        }
      )
    },
    reduce (index) {
      this.addData.userPostManagements.splice(index, 1)
    },
    cliclCheckbox (item, index) {
      console.log(item)
      if (!item.onMaster) {
        this.addData.userPostManagements[index].onMaster = true
        this.addData.userPostManagements.forEach((ele, indx) => {
          if (index !== indx) {
            ele.onMaster = false
          }
        })
      } else {
        this.addData.userPostManagements[index].onMaster = false
      }
      console.log(item)
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    bindCheckBox (value) {
      this.checkList = []
      this.checkList.push(value[1])
      this.currentPage = 1
      this.query()
    },
    detailsClose () {
      this.detailsShow = false
    },
    dtTypeChange () {
      if (this.addData.certificate === 2) {
        this.IDinfo = true
        if (this.addData.iDNumber && this.addData.iDNumber.length === 18) {
          this.IdCard(this.addData.iDNumber)
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
      this.addData.birthday = birthday
      this.addData.age = age
      let shengxiao = Calculator.shengxiao(birthday)
      let astro = Calculator.astro(userCard.substring(6, 10), userCard.substring(10, 12), userCard.substring(12, 14))
      this.$set(this.addData, 'chineseZodiac', shengxiao)
      this.$set(this.addData, 'zodiac', astro)
    },
    async handleEdit (index, row) {
      this.$router.push({ name: 'personalDetail', query: { userId: row.id } })
      let searchInfo = {
        currentPage: this.currentPage,
        pgSize: this.pgSize,
        organizeId: this.projectManagementId,
        jobStatus: this.useStatus,
        queryName: this.inputValue
      }
      console.log(searchInfo, '详情跳转')
      sessionStorage.setItem('searchInfo', JSON.stringify(searchInfo))
    },
    release () {
      this.editdialogVisible = true
      this.documentType()
      this.nationality()
      this.trialCycle()
      this.natureWork()
      this.publicCompany()
      this.publicLocation()
      this.getOrganization()
    },
    async imageChange (type, event) {
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
          if (type === 'addapp') {
            this.addData.facialPhoto = path
          }
        }).catch(error => {
          console.info(error)
        })
      }
    },
    newlystepNoe (formName) {
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
      this.newlystep1 = true
      this.newlystep2 = false
    },
    handleChange (value) {
      this.getUserposts(value[(value.length) - 1])
    },
    async addStaff (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let postData = JSON.parse(JSON.stringify(this.addData))
          if (this.IDinfo) {
            postData.birthday = postData.birthday + 'T13:55:38Z'
          }
          postData.userPostManagements.forEach(ele => {
            let organizeId = ele.organizeId[(ele.organizeId.length) - 1]
            delete ele.organizeId
            ele.organize = { id: organizeId }
          })
          if (postData.positiveState === '') {
            postData.positiveState = 'NOTMUST'
          }
          if (postData.trialCycle === '') {
            postData.trialCycle = -1
          }
          if (!postData.zodiac) {
            postData.zodiac = null
          }
          context.http.post('/uaa/api/users', postData).then(res => {
            if (res.data) {
              this.editdialogVisible = false
              this.addData = {
                facialPhoto: '',
                userPostManagements: [{
                  organizeId: [],
                  userPostId: '',
                  onMaster: true
                }]
              }
              this.query()
              this.newlystep1 = true
              this.newlystep2 = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async getUserposts (organizeId) {
      let result = await context.http.get('/uaa/api/user-posts/organize', { organizeId: organizeId })
      if (result.data) {
        this.postOptions = result.data
      }
    },
    async addLocation () {
      let result = await context.http.post('/uaa/api/public-classes', { name: this.locationName, publicStatus: 'LOCATION' })
      if (result.data) {
        this.newPlaceDialog = false
        this.publicLocation()
      }
    },
    async addCompany () {
      let result = await context.http.post('/uaa/api/public-classes', { name: this.companyName, publicStatus: 'COMPANY' })
      if (result.data) {
        this.newCompanyDialog = false
        this.publicCompany()
      }
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
    parseOrganize2 (organizeTree) {
      if (organizeTree.child.length === 0) {
        return { value: organizeTree.id ? organizeTree.id : organizeTree.userPostId ? organizeTree.userPostId : organizeTree.userId, label: organizeTree.name }
      } else {
        return {
          value: organizeTree.id ? organizeTree.id : organizeTree.userPostId ? organizeTree.userPostId : organizeTree.userId,
          label: organizeTree.name,
          children: organizeTree.child.map(item => {
            return this.parseOrganize2(item)
          })
        }
      }
    },
    async downLoadModel (index, row) {
      let url = ''
      url = '/uaa/api/user-excel/file'
      if (row) {
        url = `/uaa/api/user-excel/upload?excelId=${row.id}`
      }
      axios({ method: 'GET', url: url, responseType: 'blob' }).then(res => {
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
    importModel (event) {
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
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
        context.http.post('/uaa/api/user-excel/file', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          if (res.status === 200) {
            this.queryExportResult(res.data.id)
            event.target.value = ''
          }
        }).catch(error => {
          event.target.value = ''
          console.info(error)
        })
      }
    },
    queryExportResult (id) {
      const loading = this.$loading({
        lock: true,
        text: '导入中',
        spinner: 'el-icon-loading el-import-loading',
        customClass: 'loading-icon',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      context.http.get(`/uaa/api/user-excel/detail?excelId=${id}`).then(res => {
        if (res.data.excelResult === '审核中') {
          setTimeout(res => {
            this.queryExportResult(id)
          }, 5000)
        } else if (res.data.excelResult === '失败') {
          this.errorPrompt = true
          this.gridData = [{
            fileName: res.data.name,
            result: res.data.remark,
            id: res.data.id
          }]
          loading.close()
        } else {
          this.$message({
            message: '导入成功！',
            type: 'success'
          })
          loading.close()
          this.query()
        }
      })
    },
    selectEntryTime () {
      let tartTime = new Date(Date.parse(this.addData.entryTime))
      let cAge = Calculator.dateBetween(tartTime)
      this.$set(this.addData, 'cAge', cAge)
      this.inputReadNnly = true
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/config";
.staffManage {
  font-size: 16px;
  background-color: #f9f9f9;
  .ct-content {
    width: 100%;
    margin: 0 auto;
    .search-bar {
      .el-input {
        width: 200px;
      }
      .btnselect {
        color: #fff;
        background-color: #42506c;
      }
      div {
        cursor: pointer;
      }
      .morebtn {
        border: 1px solid #f3af2c;
        color: #f3af2c;
        height: 32px;
        width: 120px;
        line-height: 32px;
        border-radius: 4px;
        .icon-daochu {
          display: inline-block;
          width: 16px;
          height: 16px;
          background: url(../../../assets/daochu1.png) no-repeat;
          background-size: contain;
          vertical-align: text-top;
          margin-right: 4px;
        }
      }
    }
    .ctc-list {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      padding-top: 15px;
      .list-item {
        width: 375px;
        height: 190px;
        background-color: #fff;
        border: 1px solid #fff;
        border-radius: 8px;
        margin-bottom: 30px;
        margin-right: 44px;
        -moz-box-shadow: 2px 2px 4px #e5e5e5;
        -webkit-box-shadow: 2px 2px 4px #e5e5e5;
        box-shadow: 2px 2px 4px #e5e5e5;
        &:hover {
          border: 1px solid #5e72e4;
        }
        &:nth-child(4n) {
          margin-right: 0;
        }
      }
      .li-head {
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span:first-child {
          display: inline-block;
          font-size: 18px;
          margin-left: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 250px;
        }
        span:last-child {
          font-size: 18px;
          margin-right: 16px;
          width: 76px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border-radius: 5px;
          font-size: 14px;
          cursor: pointer;
        }
        .apply {
          border: 1px solid #5e72e4;
          color: #5e72e4;
          &:hover {
            background-color: #3349c8;
            border-color: #3349c8;
            color: #fff;
          }
        }
        .install {
          background-color: #92cf48;
          color: #fff;
        }
        .alyinstalled {
          color: #000;
          font-size: 14px;
          margin-right: 16px;
        }
        border-bottom: 1px solid #e5e5e5;
      }
      .li-content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 14px;
        div:first-child {
          margin: 16px 20px 0 16px;
        }
        div:nth-of-type(2) {
          height: 100px;
          margin-right: 4px;
          position: relative;
          margin-top: 10px;
          span {
            display: inline-block;
            height: 72px;
            line-height: 25px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          p {
            position: absolute;
            bottom: 0;
            span {
              background-color: #3577f6;
              border-color: #3577f6;
              color: #fff;
              width: 76px;
              height: 30px;
              line-height: 30px;
              text-align: center;
              border-radius: 5px;
              font-size: 14px;
              position: relative;
              top: 10px;
              cursor: pointer;
            }
          }
        }
        // div:nth-of-type(2)::after {
        //   content:"...";
        //   font-weight:bold;
        //   position:absolute;
        //   bottom:0;
        //   right:0;
        //   padding:0 20px 1px 45px;
        //   background:url(http://lidada.org/wp-content/uploads/2017/11/overflow_bg.png) repeat-y;
        // }
        img {
          width: 100px;
          height: 100px;
          border-radius: 10px;
          border: 1px solid #ddd;
        }
        .operation {
          height: 100px;
          p {
            width: 48px;
            height: 30px;
            line-height: 30px;
            border: 1px solid #99a4b8;
            border-radius: 4px;
            text-align: center;
            position: relative;
            cursor: pointer;
            &:hover {
              background-color: #f6f6f6;
            }
          }
          p:first-child {
            left: 24px;
            top: 5px;
          }
          p:last-child {
            left: 24px;
            bottom: -50px;
          }
        }
      }
    }
  }
  .post {
    display: inline-block;
    width: 14px;
    height: 14px;
    background: url(../../../assets/checkbox.png) no-repeat;
    background-size: contain;
    cursor: pointer;
    position: relative;
    top: 3px;
    margin-right: 6px;
  }
  .psActive {
    background: url(../../../assets/ac-checkbox.png) no-repeat;
    background-size: contain;
  }
  .el-dialog__header,
  .el-dialog__body {
    margin: 0 40px;
    padding-left: 0;
  }
  .el-dialog__body {
    padding: 10px 0 0 0;
    height: 85%;
  }
  .el-form-item {
    display: inline-block;
    width: 100%;
  }
  .line {
    display: inline-block;
    width: 36px;
    border-bottom: 1px solid #bbbbbd;
    margin-left: 36px;
  }

  .el-form-item {
    margin-bottom: 14px;
  }
  .el-form-item__content {
    line-height: inherit;
  }
  .defaultbtn {
    background-color: #3577f6 !important;
    border-color: #5e72e4 !important;
  }
  .dl-subtitle {
    font-size: 16px;
  }
  .el-dialog__body {
    color: #000;
  }
  .required {
    color: $color-red-1;
    font-size: 16px;
    position: relative;
    top: 4px;
    left: 1px;
  }
  .applogo {
    margin-bottom: 10px;
    div {
      display: inline-block;
    }
    .logo {
      width: 100px;
      min-height: 100px;
      border: 1px dashed #cccccc;
      border-radius: 10px;
      img {
        width: 100%;
        height: auto;
      }
    }
    .upload {
      vertical-align: top;
      margin-left: 14px;
      position: relative;
      input {
        position: absolute;
        top: 34px;
        right: 18px;
        width: 88px;
        height: 34px;
        opacity: 0;
        cursor: pointer;
      }
      .uploadbtn {
        display: inline-block;
        width: 88px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        border: 1px solid #5e72e4;
        border-radius: 8px;
        color: #5e72e4;
        margin: 34px 0 10px 0;
        cursor: pointer;
        .icon-upload {
          background: url(../../../assets/upload.png) no-repeat;
          position: relative;
          top: 2px;
        }
      }
      p {
        font-size: 12px;
      }
    }
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: #5e72e4;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #5e72e4;
    background: #5e72e4;
  }
  .el-radio__label {
    color: #777;
  }
  .readonly {
    margin: 10px 0 20px 0;
    color: #666666;
  }
  .errorTip {
    color: red !important;
    width: 150px !important;
    left: 13px;
    position: relative;
    bottom: -75px;
  }
  .el-radio__inner {
    width: 18px;
    height: 18px;
  }
  .el-radio__inner::after {
    width: 8px;
    height: 8px;
  }
  .addStaffdialog {
    .el-dialog {
      width: 800px !important;
      margin-top: 3vh !important;
    }
    .dl-head {
      display: flex;
      justify-content: space-start;
      margin-top: 20px;
    }
    .step {
      display: inline-block;
      width: 218px;
      height: 50px;
      line-height: 50px;
      padding-left: 14px;
      font-size: 16px;
      background-color: #f9f9f9;
      color: #777;
      border-radius: 6px;
      margin-right: 20px;
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
      vertical-align: top;
    }
    .el-select {
      width: 100%;
    }
    .el-form-item__content {
      .el-cascader {
        width: 100%;
      }
      span {
        color: #666;
      }
      font-size: 12px;
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
              background: url(../../../assets/upload.png) no-repeat;
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
      }
      .dc-right {
        border: 1px solid #e7e7e7;
        margin-top: 20px;
        .dr-head {
          background-color: #fafafa;
          height: 40px;
          line-height: 40px;
          padding-left: 12px;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .el-form-item {
          width: 30%;
          margin-left: 16px;
          // vertical-align: top;
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
    }
  }
  .resdialog {
    .el-dialog {
      width: 500px;
      height: 300px;
      border-radius: 8px;
    }
    .success-icon {
      text-align: center;
    }
    .rescontent {
      text-align: center;
      margin-top: 20px;
      h3 {
        color: #333;
      }
      p {
        font-size: 16px;
        margin: 20px 0;
      }
      span {
        display: inline-block;
        width: 140px;
        height: 40px;
        line-height: 40px;
        background-color: #3577f6;
        color: #fff;
        border-radius: 4px;
        margin-bottom: 10px;
        cursor: pointer;
      }
    }
  }
  .addpostdialog {
    .el-dialog {
      width: 800px;
    }
    .el-select {
      width: 100%;
    }
    .el-form-item {
      width: 30%;
      margin-bottom: 20px !important;
      margin-right: 30px;
      &:nth-of-type(3n) {
        margin-right: 0;
      }
    }
    .cttitle {
      margin-bottom: 4px;
    }
    .el-dialog__body {
      padding-top: 10px !important;
    }
    .el-textarea__inner {
      height: 100px;
    }
  }
  .editbtn {
    color: #409eff;
  }
  .drawer-head {
    border: none;
  }
  .plus {
    font-size: 14px;
    cursor: pointer;
    color: #409eff;
  }
  .reduce {
    float: right;
    cursor: pointer;
    color: #409eff !important;
    padding-right: 5px;
  }
  .export-error {
    display: inline-block;
    width: 90px;
    height: 26px;
    line-height: 24px;
    text-align: center;
    border: 1px solid rgba(53, 119, 246, 1);
    color: #3577f6;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: rgba(53, 119, 246, 1);
      color: #fff;
    }
  }
}
</style>
