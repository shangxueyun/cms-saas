<template>
  <div class="add-building">
    <div class="dl-head">
      <span class="step"
            :class="{stepActive: newlystep1, stepActivePast: newlystep2 || newlystep3}"><span style="font-size: 18px;">1</span>. 基本信息</span>
      <span class="step"
            v-if="addData.assetsType === 'BUILDING'"
            :class="{stepActive: newlystep2, stepActivePast: newlystep3}"><span style="font-size: 18px;">2</span>. 楼层信息</span>
      <span class="step"
            v-if="addData.assetsType === 'BUILDING'"
            :class="{stepActive: newlystep3}"><span style="font-size: 18px;">3</span>. 其他</span>
    </div>
    <div class="dl-content clearfix">
      <el-form :model="addData"
               ref="addData"
               :rules="addDataRules">
        <div class="step1"
             v-show="newlystep1">
          <div style="margin-bottom:15px;"
               class="dc-right">
            <div class="building-title"><i></i>基本信息</div>
            <div class="basic-item">
              <div class="basic-select">
                <div class="clearfix"
                     :class="selProject ? 'selectInput selectActive' : 'selectInput'">
                  <el-form-item :label-width="formLabelWidth"
                                prop="organizeId"
                                style="margin-bottom: 20px;margin-left: 0">
                    <div class="cttitle">管理企业<i class="required">*</i></div>
                    <div class="txt">{{addData.organizeName}}</div>
                    <!-- <el-select v-model="addData.organizeId" placeholder="请选择" @change="changProjectId">
                      <el-option v-for="item in organizesOptions" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select> -->
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth"
                                prop="projectId"
                                style="margin-bottom: 20px;margin-left: 0">
                    <div class="cttitle">项目<i class="required">*</i></div>
                    <div class="txt">{{addData.projectName}}</div>
                    <!-- <el-select v-model="addData.projectId" placeholder="请选择" @change='changeOrganize'>
                      <el-option v-for="item in projectOptions" :key="item.id" :label="item.projectName" :value="item.id">
                      </el-option>
                    </el-select> -->
                  </el-form-item>
                </div>
              </div>
            </div>
            <el-form-item :label-width="formLabelWidth"
                          prop="buildingName"
                          style="margin-bottom: 20px;margin-left:0">
              <div class="cttitle">名称<i class="required">*</i></div>
              <el-input v-model="addData.buildingName"
                        maxlength="30"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          prop="address"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">地址</div>
              <!-- <i class="required">*</i> -->
              <el-input v-model="addData.address"
                        maxlength="50"
                        placeholder="请输入地址">
                <template slot="prepend">
                  <el-select v-model="addData.addressType"
                             placeholder="请选择"
                             class="siteSelect">
                    <el-option v-for="item in siteOptions"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          prop=""
                          style="margin-bottom: 20px;margin-left:0">
              <div class="cttitle">用地类别</div>
              <el-select v-model="addData.buildingUse"
                         placeholder="请选择">
                <el-option v-for="item in landOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">投资方</div>
              <el-input v-model="addData.investor"
                        maxlength="20"
                        placeholder="请输入内容">

              </el-input>
            </el-form-item>
            <el-form-item prop="buildingHight"
                          :label-width="formLabelWidth"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">投资金额</div>
              <el-input v-model="addData.investorPrice"
                        type="number"
                        placeholder="请输入内容">
                <template slot="append">万元</template>
              </el-input>
            </el-form-item>
          </div>
          <div class="dc-right"
               style="margin-bottom:15px;">
            <div class="building-title"><i></i>类别<span style="color:red">*</span></div>
            <div style="margin-bottom: 20px;">
              <el-radio-group v-model="addData.assetsType"
                              @change='changeAssetsType'>
                <el-radio label="BUILDING">楼宇</el-radio>
                <el-radio label="FIELD">场地</el-radio>
                <el-radio label="LAND">土地</el-radio>
              </el-radio-group>
            </div>
            <!-- 楼宇类别显示 -->
            <el-form-item prop="upArea"
                          :label-width="formLabelWidth"
                          v-if="addData.assetsType === 'BUILDING'"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">地上建筑面积<i class="required">*</i></div>
              <el-input v-model="addData.upArea"
                        type="number"
                        @change="changeUpArea"
                        placeholder="请输入内容">
                <template slot="append">㎡</template>
              </el-input>
            </el-form-item>
            <el-form-item prop="upAmount"
                          :label-width="formLabelWidth"
                          v-if="addData.assetsType === 'BUILDING'"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">地上楼层<i class="required">*</i></div>
              <el-input v-model="addData.upAmount"
                        type="number"
                        placeholder="请输入内容">
              </el-input>
            </el-form-item>
            <el-form-item prop="downArea"
                          :label-width="formLabelWidth"
                          v-if="addData.assetsType === 'BUILDING'"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">地下建筑面积<i class="required">*</i></div>
              <el-input v-model="addData.downArea"
                        type="number"
                        @change="changeDownArea"
                        placeholder="请输入内容">
                <template slot="append">㎡</template>
              </el-input>
            </el-form-item>
            <el-form-item prop="downAmount"
                          :label-width="formLabelWidth"
                          v-if="addData.assetsType === 'BUILDING'"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">地下楼层<i class="required">*</i></div>
              <el-input v-model="addData.downAmount"
                        type="number"
                        placeholder="请输入内容">
              </el-input>
            </el-form-item>
            <el-form-item prop="buildingArea"
                          :label-width="formLabelWidth"
                          v-if="addData.assetsType === 'BUILDING'"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">可出租面积<i class="required">*</i></div>
              <el-input v-model="addData.buildingArea"
                        type="number"
                        placeholder="请输入内容">
                <template slot="append">㎡</template>
              </el-input>
            </el-form-item>
            <el-form-item prop="buildingHight"
                          :label-width="formLabelWidth"
                          v-if="addData.assetsType === 'BUILDING'"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">竣工年份</div>
              <el-date-picker style="width: 288px"
                              v-model="addData.endWorkDate"
                              value-format="yyyy"
                              type="year"
                              placeholder="竣工年份">
              </el-date-picker>
            </el-form-item>
            <div v-if="addData.assetsType === 'BUILDING'"
                 style="margin-bottom: 20px;">
              <el-switch @change='changeHava'
                         v-model="addData.havaCertificates"
                         active-text="有证"
                         inactive-text="无证"></el-switch>
            </div>
            <!-- 有证显示 -->
            <el-form-item :label-width="formLabelWidth"
                          v-if="addData.assetsType === 'BUILDING' && addData.havaCertificates"
                          prop="buildingUse"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">产权资产类别</div>
              <el-select v-model="addData.certificatesType"
                         placeholder="请选择">
                <el-option v-for="item in propertyOptions"
                           :key="item.value"
                           :label="item.value"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="buildingHight"
                          :label-width="formLabelWidth"
                          v-if="addData.assetsType === 'BUILDING' && addData.havaCertificates"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">权利人名称</div>
              <el-input v-model="addData.obligeeName"
                        placeholder="请输入内容">
              </el-input>
            </el-form-item>
            <el-form-item prop="buildingHight"
                          :label-width="formLabelWidth"
                          v-if="addData.assetsType === 'BUILDING' && addData.havaCertificates"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">产权证编号</div>
              <el-input v-model="addData.cqCode"
                        placeholder="请输入内容">
              </el-input>
            </el-form-item>
            <!-- 无证显示 -->
            <el-form-item :label-width="formLabelWidth"
                          v-if="addData.assetsType === 'BUILDING' && !addData.havaCertificates"
                          prop="buildingUse"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">无证资产类型</div>
              <el-select v-model="addData.certificatesType"
                         placeholder="请选择">
                <el-option v-for="item in nopropertyOptions"
                           :key="item.value"
                           :label="item.value"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="buildingHight"
                          :label-width="formLabelWidth"
                          v-if="addData.assetsType === 'BUILDING' && !addData.havaCertificates"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">建筑结构</div>
              <el-select v-model="addData.buildingStructure"
                         placeholder="请选择">
                <el-option v-for="item in buildingStrustOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="buildingHight"
                          :label-width="formLabelWidth"
                          v-if="addData.assetsType === 'BUILDING' && !addData.havaCertificates"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">经营方式</div>
              <el-select v-model="addData.managementMode"
                         placeholder="请选择">
                <el-option v-for="item in managementModeoptions"
                           :key="item.value"
                           :label="item.value"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="buildingHight"
                          :label-width="formLabelWidth"
                          v-if="addData.assetsType === 'BUILDING' && !addData.havaCertificates"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">承租方式</div>
              <el-select v-model="addData.leaseMode"
                         placeholder="请选择">
                <el-option v-for="item in managementModeoptions"
                           :key="item.value"
                           :label="item.value"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 场地显示 -->
            <el-form-item prop="buildingArea"
                          :label-width="formLabelWidth"
                          v-if="addData.assetsType === 'FIELD'"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">场地面积<i class="required">*</i></div>
              <el-input v-model="addData.buildingArea"
                        type="number"
                        placeholder="请输入内容">
                <template slot="append">㎡</template>
              </el-input>
            </el-form-item>
            <!-- 土地显示 -->
            <el-form-item prop="buildingArea"
                          :label-width="formLabelWidth"
                          v-if="addData.assetsType === 'LAND'"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">土地面积<i class="required">*</i></div>
              <el-input v-model="addData.buildingArea"
                        type="number"
                        placeholder="请输入内容">
                <template slot="append">亩</template>
              </el-input>
            </el-form-item>
          </div>
          <div class="dc-right"
               style="padding-top: 10px">
            <!-- <div style="height: 20px"></div> -->
            <el-form-item prop="buildingHight"
                          :label-width="formLabelWidth"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">项目内排序</div>
              <el-input v-model="addData.sortNumber"
                        type="number"
                        placeholder="请输入内容">
              </el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          prop="buildingUse"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">状态</div>
              <el-select v-model="addData.useStatus"
                         placeholder="请选择">
                <el-option v-for="item in useStatusOption"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>

        </div>
        <div class="step2"
             v-show="newlystep2">
          <div class="dc-right">
            <div class="building-title"><i></i>楼层信息</div>
            <el-form>
              <div style="padding-bottom:20px;"
                   class="dc-right_div">
                <div class="floorwrap">
                  <div class="fw-head">
                    <span></span>
                    <span style="width:120px;">楼层次序</span>
                    <span>楼层名称<i class="required">*</i></span>
                  </div>
                  <div class="fw-content"
                       v-for="(item, index) in addData.floorDTOSet1"
                       :key="'set1' + index">
                    <!-- <i class="icon fa-move"></i> -->
                    <span v-if='item.sortNumber == 1'>地上</span>
                    <span v-else></span>
                    <span style="width:120px;">
                      <p style="line-height:34px;text-align:center">{{item.sortNumber}}</p>
                    </span>
                    <span>
                      <el-input placeholder="请输入内容"
                                v-model="item.name"></el-input>
                    </span>
                  </div>
                  <div style=""></div>
                  <div class="fw-content"
                       v-for="(item, index) in addData.floorDTOSet2"
                       :key="'set2' + index">
                    <!-- <i class="icon fa-move"></i> -->
                    <span v-if='item.sortNumber == -1'>地下</span>
                    <span v-else></span>
                    <span style="width:120px;">
                      <p style="line-height:34px;text-align:center">{{item.sortNumber}}</p>
                    </span>
                    <span>
                      <el-input placeholder="请输入内容"
                                v-model="item.name"></el-input>
                    </span>
                  </div>
                </div>
              </div>
            </el-form>
          </div>
        </div>

        <div class="step3"
             v-show="newlystep3">
          <div style="min-height:145px;"
               class="dc-right">
            <div class="building-title"><i></i>其他</div>
            <el-form-item :label-width="formLabelWidth"
                          v-if="addData.assetsType === 'BUILDING'"
                          prop="buildingHigh"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">标准层高</div>
              <el-input v-model="addData.buildingHigh"
                        type="number"
                        oninput="if(value<0)value=0"
                        placeholder="请输入内容">
                <template slot="append">米</template>
              </el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          v-if="addData.assetsType === 'BUILDING'"
                          prop="elevatorAmount"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">客梯数</div>
              <el-input v-model="addData.elevatorAmount"
                        type="number"
                        oninput="if(value<0)value=0"
                        placeholder="请输入内容">
              </el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          v-if="addData.assetsType === 'BUILDING'"
                          prop="cargoLiftAmount"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">货梯数</div>
              <el-input v-model="addData.cargoLiftAmount"
                        type="number"
                        oninput="if(value<0)value=0"
                        placeholder="请输入内容">
              </el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          v-if="addData.assetsType === 'BUILDING'"
                          prop="boilerAmount"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">锅炉数量</div>
              <el-input v-model="addData.boilerAmount"
                        oninput="if(value<0)value=0"
                        type="number"
                        placeholder="请输入内容">
              </el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          v-if="addData.assetsType === 'BUILDING'"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">室内装修</div>
              <el-select v-model="addData.interiorDecoration"
                         placeholder="请选择">
                <el-option v-for="item in trimInteriorOpions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth"
                          v-if="addData.assetsType === 'BUILDING'"
                          style="margin-bottom: 20px;margin-left: 0">
              <div class="cttitle">外立面装修</div>
              <el-select v-model="addData.facadeDecoration"
                         placeholder="请选择">
                <el-option v-for="item in decorationOptions"
                           :key="item.value"
                           :label="item.value"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button style="background:#fff!important;border:0"
                 @click="dialogHide"
                 class="close-button"
                 v-if="newlystep1 && addData.assetsType === 'BUILDING'">取消</el-button>
      <el-button style="margin-left:0;width:90px!important"
                 type="primary"
                 @click="newlystepNoe('addData')"
                 class="defaultbtn dialog-confirmBtn"
                 v-if="newlystep1 && addData.assetsType === 'BUILDING'">下一步</el-button>
      <el-button style="background:#fff!important;border:0"
                 @click="dialogHide"
                 class="close-button"
                 v-if="newlystep1 && addData.assetsType !== 'BUILDING'">取消</el-button>
      <!-- @click="newlystepNoe('addData')" -->
      <el-button style="margin-left:0;width:90px!important"
                 type="primary"
                 class="defaultbtn dialog-confirmBtn"
                 @click="addStaff('addData2')"
                 v-if="newlystep1 && addData.assetsType !== 'BUILDING'">确定</el-button>
      <el-button style="background:#fff!important;border:0"
                 type="primary"
                 @click="previousStep"
                 class="close-button"
                 v-if="newlystep2">上一步</el-button>
      <el-button style="margin-left:0;width:90px!important"
                 type="primary"
                 @click="newlystepNoe2('addData')"
                 class="defaultbtn dialog-confirmBtn"
                 v-if="newlystep2">下一步</el-button>

      <el-button style="background:#fff!important;border:0"
                 type="primary"
                 @click="newlystep2=true;newlystep3=false"
                 class="close-button"
                 v-if="newlystep3">上一步</el-button>
      <el-button style="margin-left:0;width:90px!important"
                 type="primary"
                 class="defaultbtn dialog-confirmBtn"
                 v-if="newlystep3"
                 @click="addStaff('addData2')">确定</el-button>
    </div>
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>
<script>
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import moment from 'moment'
export default {
  name: 'organizationManage',
  components: {
    picturePrevie,
    aliUpload
  },
  props: {
    searchData: {
      type: Object,
      default: {}
    },
    buildDetailsShow: {
      type: Boolean,
      default: false
    },
    adddialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    var validateInput = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error('大于等于0'))
      } else {
        callback()
      }
    }
    return {
      checkList: ['USING', 'DISABLE'],
      useStatusOption: [{
        value: 'USING',
        label: '使用'
      }, {
        value: 'DISABLE',
        label: '停用'
      }],
      cascaderData: [],
      newlystep1: true,
      newlystep2: false,
      newlystep3: false,
      checkAll: false,
      natureWorkOptions: [],
      siteOptions: [{
        value: 'inTown',
        label: '镇内'
      }, {
        value: 'outTown',
        label: '镇外'
      }],
      areaOptions: [],
      addData: {
        floorDTOSet1: [],
        floorDTOSet2: [],
        floorDTOSet: [],
        useStatus: 'USING',
        addressType: 'inTown',
        assetsType: 'BUILDING',
        havaCertificates: true,
        interiorDecoration: null,
        organizeId: null,
        projectId: null,
        buildingArea: null
      },
      landOptions: [{
        value: 'RESIDENCE',
        label: '住宅用地'
      }, {
        value: 'INDUSTRY',
        label: '工业用地'
      }, {
        value: 'BUSSINESS',
        label: '商业用地'
      }, {
        value: 'COMPREHENSIVE',
        label: '综合用地'
      }, {
        value: 'PUBLIC',
        label: '公共用地'
      }, {
        value: 'RETAIN',
        label: '保留用地'
      }, {
        value: 'GREEN',
        label: '绿化用地'
      }, {
        value: 'OTHER',
        label: '其他用地'
      }],
      certificatesOptions: [{
        value: 'RESIDENCE',
        label: '住宅用地'
      }, {
        value: 'INDUSTRY',
        label: '工业用地'
      }, {
        value: 'BUSSINESS',
        label: '商业用地'
      }, {
        value: 'OFFICE',
        label: '办公用地'
      }, {
        value: 'COMPREHENSIVE',
        label: '综合用地'
      }, {
        value: 'PUBLIC',
        label: '公共用地'
      }, {
        value: 'RETAIN',
        label: '保留用地'
      }, {
        value: 'GREEN',
        label: '绿化用地'
      }, {
        value: 'OTHER',
        label: '其他用地'
      }],
      startFloor: '',
      closingFloor: '',
      addDataRules: {
        // organizeId: [
        //   { required: true, message: '请选择管理企业', trigger: 'blur' }
        // ],
        // projectId: [
        //   { required: true, message: '请选择项目', trigger: 'change' }
        // ],
        buildingName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        upArea: [
          { validator: validateInput, trigger: 'blur' }
        ],
        upAmount: [
          { validator: validateInput, trigger: 'blur' }
        ],
        downArea: [
          { validator: validateInput, trigger: 'blur' }
        ],
        downAmount: [
          { validator: validateInput, trigger: 'blur' }
        ],
        buildingArea: [
          { validator: validateInput, trigger: 'blur' }
        ]
      },
      // ,
      //   buildingHigh: [
      //     { validator: validateInput, trigger: 'blur' }
      //   ],
      //   elevatorAmount: [
      //     { validator: validateInput, trigger: 'blur' }
      //   ],
      //   cargoLiftAmount: [
      //     { validator: validateInput, trigger: 'blur' }
      //   ],
      //   boilerAmount: [
      //     { validator: validateInput, trigger: 'blur' }
      //   ]
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
      buildingOptions: [
        { name: '商场', value: 'MALL' },
        { name: '写字楼', value: 'OFFICE' }
      ],
      errorField: false,
      errorTip: '',
      formLabelWidth: '120px',
      dialogVisible: false,
      editdialogVisible: false,
      selHourse: false,
      selProject: false,
      projectList: [],
      chooseObj: {},
      errorProject: false,
      buildOptions: [
        { label: '商业', value: 'BUSSINESS' },
        { label: '办公', value: 'OFFICE' },
        { label: '厂房', value: 'FACTORY' },
        { label: '仓储', value: 'WAREHOUSE' },
        { label: '交通运输', value: 'TRAFFIC' },
        { label: '教育', value: 'EDUCATION' },
        { label: '其他', value: 'OTHER' }
      ],
      propertyOptions: [{
        value: '楼宇',
        label: ''
      }, {
        value: '厂房',
        label: ''
      }, {
        value: '商铺',
        label: ''
      }, {
        value: '其他',
        label: ''
      }],
      // 建筑结构
      buildingStrustOptions: [{
        value: '钢结构'
      }, {
        value: '钢混'
      }, {
        value: '砖墙'
      }, {
        value: '简易房'
      }, {
        value: '内插层'
      }, {
        value: '悬挑'
      }, {
        value: '阳光房'
      }, {
        value: '其他'
      }],
      managementModeoptions: [{
        value: '自用'
      }, {
        value: '转租'
      }],
      nopropertyOptions: [{
        value: '独立'
      }, {
        value: '加层'
      }, {
        value: '连接体'
      }, {
        value: '夹层'
      }, {
        value: '其他'
      }],
      decorationOptions: [{
        value: '涂料'
      }, {
        value: '幕墙'
      }, {
        value: '砖石'
      }, {
        value: '塑铝'
      }, {
        value: '其他'
      }],
      projectOptions: [],
      trimInteriorOpions: [{
        value: '毛胚'
      }, {
        value: '简装'
      }, {
        value: '精装'
      }],
      showPicture: false,
      imgArr: [],
      num: 0,
      upLoadText_cost: '上传图片',
      fileType_cost: ['png', 'jpg'],
      organizesOptions: [],
      fileSize: 3,
      iconImg: 'icon-shangchuantupianicon',
      olddownAmount: null,
      oldupAmount: null
    }
  },
  created () {
    // this.getAllOrganizes()
    this.initAddData()
  },
  mounted () {
    this.$dragging.$on('dragged', ({ value }) => {
    })
  },
  watch: {
    adddialogVisible: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.initAddData()
          // context.http.get('uaa/api/organizes/all/simple', {
          //   useStatus: this.checkList[0],
          //   organizeType: 'ENTERPRISE'
          // }).then(res => {
          //   if (res.status === 200) {
          //     this.organizesOptions = res.data
          //     let organizeId = this.searchData.organizeId
          //     let projectId = null
          //     context.http.get('cms/api/project-managements/byOrganizeId', {
          //       useStatus: this.checkList[0],
          //       organizeId: organizeId
          //     }).then(res => {
          //       if (res.status === 200) {
          //         this.projectOptions = res.data
          //         if (this.projectOptions.length > 0) {
          //           projectId = this.projectOptions[0].id
          //           let judge = false
          //           this.projectOptions.forEach((item, index) => {
          //             if (item.id === this.searchData.projectId) {
          //               projectId = this.searchData.projectId
          //               judge = true
          //             }
          //           })
          //           if (!judge) {
          //             projectId = this.projectOptions[0].id
          //           }
          //         }
          //         this.addData = {
          //           floorDTOSet: [],
          //           floorDTOSet1: [],
          //           useStatus: 'USING',
          //           addressType: 'inTown',
          //           assetsType: 'BUILDING',
          //           havaCertificates: true,
          //           interiorDecoration: null,
          //           organizeId,
          //           projectId,
          //           buildingArea: null
          //         }
          //       }
          //     })
          //   }
          // })
        }
      }
    }
  },
  methods: {
    initAddData () {
      if (sessionStorage.getItem('tenantDetail')) {
        this.addData = JSON.parse(sessionStorage.getItem('tenantDetail'))
        sessionStorage.setItem('floorDTOSet', JSON.stringify(this.addData.floorDTOSet))
        this.addData.projectName = this.searchData.projectName || this.addData.projectManagementDTO.projectName
        sessionStorage.removeItem('tenantDetail')
        // 如楼层信息未修改 无需赋默认值
        this.olddownAmount = this.addData.downAmount
        this.oldupAmount = this.addData.upAmount
        this.addData.floorDTOSet1 = []
        this.addData.floorDTOSet2 = []
        this.addData.floorDTOSet.forEach((item, index) => {
          if (item.sortNumber > 0) {
            this.addData.floorDTOSet1.push(item)
          } else {
            this.addData.floorDTOSet2.push(item)
          }
        })
        this.addData.floorDTOSet1.sort(this.compare('sortNumber'))
        this.addData.floorDTOSet2.sort(this.compare('sortNumber'))
      } else {
        // this.chooseObj = this.$route.query.itemChild
        this.getAllProject()
        this.addData = {
          floorDTOSet1: [],
          floorDTOSet2: [],
          floorDTOSet: [],
          useStatus: 'USING',
          addressType: 'inTown',
          assetsType: 'BUILDING',
          havaCertificates: true,
          interiorDecoration: null,
          organizeId: this.searchData.organizeId,
          organizeName: this.searchData.organizeName,
          projectId: this.searchData.projectId,
          projectName: this.searchData.projectName,
          buildingArea: null
        }
      }
    },
    compare (salesNum) {
      return function (a, b) {
        var val1 = a[salesNum]
        var val2 = b[salesNum]
        return val2 - val1
      }
    },
    changeUpArea (e) {
      if (this.addData.downArea && this.addData.upArea) {
        this.addData.upArea = Number(this.addData.upArea)
        this.addData.downArea = Number(this.addData.downArea)
        this.addData.buildingArea = this.addData.upArea + this.addData.downArea
      }
    },
    changeDownArea (e) {
      if (this.addData.downArea && this.addData.upArea) {
        this.addData.upArea = Number(this.addData.upArea)
        this.addData.downArea = Number(this.addData.downArea)
        this.addData.buildingArea = this.addData.upArea + this.addData.downArea
      }
    },
    changeHava (e) {
      this.addData.certificatesType = null
    },
    getAllOrganizes () {
      context.http.get('uaa/api/organizes/all/simple', {
        useStatus: this.checkList[0],
        organizeType: 'ENTERPRISE'
      }).then(res => {
        if (res.status === 200) {
          this.organizesOptions = res.data
          this.addData.organizeId = this.searchData.organizeId
          this.organizesOptions.forEach((item, index) => {
            if (item.id === this.addData.organizeId) {
              this.addData.organizeName = item.name
            }
          })
          this.getAllProject()
        }
      })
    },
    getAllProject () {
      context.http.get('cms/api/project-managements/byOrganizeId', {
        useStatus: this.checkList[0],
        organizeId: this.searchData.organizeId
      }).then(res => {
        if (res.status === 200) {
          this.projectOptions = res.data
          if (this.projectOptions.length > 0) {
            this.projectOptions.forEach((item, index) => {
              if (item.id === this.searchData.projectId) {
                this.addData.projectId = this.searchData.projectId
                this.chooseObj = item
              }
            })
          }
        }
      })
    },
    changeAssetsType (e) {
      this.addData.buildingArea = null
      if (this.addData.assetsType !== 'BUILDING') {
        this.addData.havaCertificates = null
      }
    },
    changeOrganize (e) {
      this.addData.projectId = e
      this.addData = this.addData
      this.projectOptions.forEach((item, index) => {
        if (item.id === e) {
          this.chooseObj = item
        }
      })
    },
    changProjectId (e) {
      this.addData.organizeId = e
      this.organizesOptions.forEach((item, index) => {
        if (item.id === e) {
          this.addData.organizeName = item.name
        }
      })
      this.getAllProject()
    },
    dialogHide () {
      this.newlystep1 = true
      this.newlystep2 = false
      this.newlystep3 = false
      this.$emit('dialogHide')
      this.$emit('query')
    },
    addFloor () {
      let startFloor = Number(this.addData.upAmount)
      let closingFloor = -Number(this.addData.downAmount)
      this.addData.floorDTOSet1 = []
      for (let i = 1; i <= startFloor; i++) {
        if (i !== 0) {
          this.addData.floorDTOSet1.push(
            {
              name: i + '',
              sortNumber: i,
              sort: i
            }
          )
        }
      }
      this.addData.floorDTOSet1.reverse()
      this.addData.floorDTOSet2 = []
      for (let i = closingFloor; i <= 0; i++) {
        if (i !== 0) {
          this.addData.floorDTOSet2.push(
            {
              name: i + '',
              sortNumber: i,
              sort: i
            }
          )
        }
      }
      this.addData.floorDTOSet2.reverse()
      this.addData = JSON.parse(JSON.stringify(this.addData))
    },
    reduce (index) {
      this.addData.floorDTOSet1.splice(index, 1)
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
      this.areaOptions = [Number(this.chooseObj.province), Number(this.chooseObj.city), Number(this.chooseObj.district)]
      this.errorProject = false
    },
    async queryProjectList () {
      let result = await context.http.get('cms/api/project-managements/listBar')
      this.projectList = result.data
      this.projectList.forEach(item => {
        if (Number(item.id) === Number(this.projectManagentId)) {
          this.chooseObj = item
        }
      })
      this.chooseItem('', this.chooseObj)
    },
    handleItemChange (val) {
      // this.getNodes(val)
    },
    addHandleItemChange () {
      this.addData.province = String(this.areaOptions[0])
      this.addData.city = String(this.areaOptions[1])
      this.addData.district = String(this.areaOptions[2])
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
          this.addData.buildingImage = path
        }).catch(error => {
          console.info(error)
        })
      }
    },
    newlystepNoe (formName) {
      if (this.addData.assetsType === 'BUILDING') {
        if (this.addData.upArea !== 0 && !this.addData.upArea) {
          this.$message({
            message: '请输入地上建筑面积',
            type: 'warning'
          })
          return
        }
        if (this.addData.upAmount !== 0 && !this.addData.upAmount) {
          this.$message({
            message: '请输入地上楼层',
            type: 'warning'
          })
          return
        }
        if (this.addData.downArea !== 0 && !this.addData.downArea) {
          this.$message({
            message: '请输入地下建筑面积',
            type: 'warning'
          })
          return
        }
        if (this.addData.downAmount !== 0 && !this.addData.downAmount) {
          this.$message({
            message: '请输入地下楼层',
            type: 'warning'
          })
          return
        }
        if (this.addData.buildingArea !== 0 && !this.addData.buildingArea) {
          this.$message({
            message: '请输入可出租面积',
            type: 'warning'
          })
          return
        }
      } else if (this.addData.assetsType === 'FIELD') {
        if (this.addData.buildingArea !== 0 && !this.addData.buildingArea) {
          this.$message({
            message: '请输入场地面积',
            type: 'warning'
          })
          return
        }
        delete this.addData.upArea
        delete this.addData.upAmount
        delete this.addData.downArea
        delete this.addData.downAmount
        delete this.addData.endWorkDate
        delete this.addData.havaCertificates
      } else if (this.addData.assetsType === 'LAND') {
        if (this.addData.buildingArea !== 0 && !this.addData.buildingArea) {
          this.$message({
            message: '请输入土地面积',
            type: 'warning'
          })
          return
        }
        delete this.addData.upArea
        delete this.addData.upAmount
        delete this.addData.downArea
        delete this.addData.downAmount
        delete this.addData.endWorkDate
        delete this.addData.havaCertificates
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.newlystep1 = false
          this.newlystep2 = true
          if (this.olddownAmount && this.oldupAmount && this.olddownAmount === this.addData.downAmount && this.oldupAmount === this.addData.upAmount) {
          } else {
            this.addFloor()
          }
        } else {
          return false
        }
      })
    },
    newlystepNoe2 () {
      var temp = []
      let sense = false
      let tempt = false
      if (this.addData.floorDTOSet1.length || this.addData.floorDTOSet2.length) {
        this.addData.floorDTOSet1.forEach((ele, index) => {
          temp.push(ele)
        })
        this.addData.floorDTOSet2.forEach((ele, index) => {
          temp.push(ele)
        })
        temp.forEach((e, i) => {
          if (!e.name) {
            tempt = true
          }
          for (let j = i + 1; j < temp.length; j++) {
            if (e.name === temp[j].name) {
              sense = true
            }
          }
        })
      }
      if (tempt) {
        this.$message({
          message: '楼层名称不可为空',
          type: 'warning'
        })
        return
      }
      if (sense) {
        this.$message({
          message: '楼层名称不可重复',
          type: 'warning'
        })
        return
      }
      this.addData.floorDTOSet = JSON.parse(JSON.stringify(this.addData.floorDTOSet1))
      if (this.addData.floorDTOSet2 && this.addData.floorDTOSet2.length) {
        this.addData.floorDTOSet2.forEach((item, index) => {
          this.addData.floorDTOSet.push(item)
        })
      }
      this.addData.floorDTOSet.sort(this.compareStep('sortNumber'))
      this.newlystep2 = false
      this.newlystep3 = true
    },
    compareStep (sortNumber) {
      return function (a, b) {
        var val1 = a[sortNumber]
        var val2 = b[sortNumber]
        return val2 - val1
      }
    },
    previousStep () {
      this.newlystep1 = true
      this.newlystep2 = false
      this.olddownAmount = this.addData.downAmount
      this.oldupAmount = this.addData.upAmount
    },
    async addStaff (formName) {
      if (this.buildDetailsShow) {
        this.editTenant()
      } else {
        this.addData.endWorkDate ? (this.addData.endWorkDate = moment(this.addData.endWorkDate).format('YYYY')) : null
        let postData = JSON.parse(JSON.stringify(this.addData))
        postData.projectManagementDTO = this.chooseObj
        // postData.floorDTOSet.forEach((element, index) => {
        //   element.sortNumber = index
        // })
        if (this.addData.assetsType === 'FIELD') {
          if (!this.addData.buildingArea) {
            this.$message({
              message: '请输入场地面积',
              type: 'warning'
            })
            return
          }
          this.addData.floorDTOSet = []
          delete this.addData.upArea
          delete this.addData.upAmount
          delete this.addData.downArea
          delete this.addData.downAmount
          delete this.addData.endWorkDate
          delete this.addData.havaCertificates
        } else if (this.addData.assetsType === 'LAND') {
          if (!this.addData.buildingArea) {
            this.$message({
              message: '请输入土地面积',
              type: 'warning'
            })
            return
          }
          this.addData.floorDTOSet = []
          delete this.addData.upArea
          delete this.addData.upAmount
          delete this.addData.downArea
          delete this.addData.downAmount
          delete this.addData.endWorkDate
          delete this.addData.havaCertificates
        }
        this.$refs['addData'].validate((valid) => {
          if (valid) {
            context.http.post('/cms/api/buildings', postData).then(res => {
              if (res.data) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                this.dialogHide()
                this.addData = {
                  buildingImages: [],
                  floorDTOSet1: [],
                  useStatus: 'USING'
                }
                this.newlystep1 = true
                this.newlystep2 = false
                this.newlystep3 = false
              }
            })
          }
        })
      }
    },
    editTenant () {
      if (this.addData.assetsType === 'BUILDING') {
        if (this.addData.upArea !== 0 && !this.addData.upArea) {
          this.$message({
            message: '请输入地上建筑面积',
            type: 'warning'
          })
          return
        }
        if (this.addData.upAmount !== 0 && !this.addData.upAmount) {
          this.$message({
            message: '请输入地上楼层',
            type: 'warning'
          })
          return
        }
        if (this.addData.downArea !== 0 && !this.addData.downArea) {
          this.$message({
            message: '请输入地下建筑面积',
            type: 'warning'
          })
          return
        }
        if (this.addData.downAmount !== 0 && !this.addData.downAmount) {
          this.$message({
            message: '请输入地下楼层',
            type: 'warning'
          })
          return
        }
        if (this.addData.buildingArea !== 0 && !this.addData.buildingArea) {
          this.$message({
            message: '请输入可出租面积',
            type: 'warning'
          })
          return
        }
        this.addData.endWorkDate ? (this.addData.endWorkDate = moment(this.addData.endWorkDate).format('YYYY')) : null
      } else if (this.addData.assetsType === 'FIELD') {
        if (this.addData.buildingArea !== 0 && !this.addData.buildingArea) {
          this.$message({
            message: '请输入场地面积',
            type: 'warning'
          })
          return
        }
        this.addData.havaCertificates = null
        this.addData.floorDTOSet = []
      } else if (this.addData.assetsType === 'LAND') {
        if (this.addData.buildingArea !== 0 && !this.addData.buildingArea) {
          this.$message({
            message: '请输入土地面积',
            type: 'warning'
          })
          return
        }
        this.addData.havaCertificates = null
        this.addData.floorDTOSet = []
      }
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          let oldFloorDTOSet = JSON.parse(sessionStorage.getItem('floorDTOSet'))
          console.log(oldFloorDTOSet, this.addData.floorDTOSet)
          this.addData.floorDTOSet.forEach((item, i) => {
            oldFloorDTOSet.forEach((ite, inde) => {
              if (item.sortNumber === ite.sortNumber) {
                item.id = ite.id
              }
            })
          })
          context.http.put('/cms/api/buildings', this.addData).then(res => {
            sessionStorage.removeItem('floorDTOSet')
            this.$emit('getTenantDetail', this.addData.id)
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.dialogHide()
            this.addData = {
              buildingImages: [],
              floorDTOSet1: [],
              useStatus: 'USING'
            }
            this.newlystep1 = true
            this.newlystep2 = false
            this.newlystep3 = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async natureWork () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=工作性质')
      this.natureWorkOptions = result.data
    },
    showImg1 (item, index) {
      let imgArr = []
      this.addData.buildingImages.forEach(item => {
        imgArr.push(item)
      })
      this.imgArr = imgArr
      this.num = index
      this.showPicture = true
    },
    pictureClose () {
      this.showPicture = false
    },
    deleteImg (index) {
      this.addData.buildingImages.splice(index, 1)
    },
    setAnnex1 (annexURL, annexName) {
      this.errorField = false
      this.addData.buildingImages.push(annexURL)
    },
    getBuildingRate () {
      if (this.addData.useArea && this.addData.buildingArea && this.addData.useArea > 0 && this.addData.buildingArea > 0) {
        this.addData.buildingRate = this.accMul(this.accDiv(this.addData.useArea, this.addData.buildingArea).toFixed(4), 100)
      } else {
        this.addData.buildingRate = null
      }
    },
    getItemRate (item) {
      // if (item.useArea && item.buildingArea && item.useArea > 0 && item.buildingArea > 0) {
      //   item.buildingRate = this.accMul(this.accDiv(item.useArea, item.buildingArea).toFixed(4), 100)
      // } else {
      //   item.buildingRate = null
      // }
    },
    accDiv (num1, num2) {
      let t1, t2, r1, r2
      try {
        t1 = num1.toString().split('.')[1].length
      } catch (e) {
        t1 = 0
      }
      try {
        t2 = num2.toString().split('.')[1].length
      } catch (e) {
        t2 = 0
      }
      r1 = Number(num1.toString().replace('.', ''))
      r2 = Number(num2.toString().replace('.', ''))
      return (r1 / r2) * Math.pow(10, t2 - t1)
    },
    accMul (num1, num2) {
      let m = 0
      let s1 = num1.toString()
      let s2 = num2.toString()
      try { m += s1.split('.')[1].length } catch (e) { }
      try { m += s2.split('.')[1].length } catch (e) { }
      return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
    }
  }
}
</script>
<style lang="scss">
@import "../../../../../style/config";
.add-building {
  font-size: 24px;
  .close-button:hover {
    color: #3577f6 !important;
  }
  .el-input__inner {
    height: 34px;
  }
  .el-textarea {
    .el-textarea__inner {
      height: 85px;
    }
  }
  .building-title {
    font-size: 16px;
    font-weight: bolder;
    padding-left: 12px;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    border-bottom: 1px solid #f6f6f6;
    position: relative;
    color: #262626;
    margin-bottom: 20px;
    i {
      display: block;
      position: absolute;
      left: 0;
      top: 12px;
      width: 4px;
      height: 16px;
      border-radius: 2px;
      background: #3575f6;
    }
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
    vertical-align: top;
    margin-bottom: 14px;
    margin-right: 23px;
    position: relative;
  }
  .line {
    display: inline-block;
    width: 36px;
    border-bottom: 1px solid #bbbbbd;
    margin-left: 36px;
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
    left: 0;
    position: relative;
    bottom: -6px;
    font-size: 12px;
  }
  .errorpjTip {
    color: red !important;
    font-size: 12px;
    width: 100%;
    float: left;
  }
  .el-radio__inner {
    width: 18px;
    height: 18px;
  }
  .el-radio__inner::after {
    width: 8px;
    height: 8px;
  }
  .el-dialog {
    width: 1000px !important;
    margin-top: 3vh !important;
    background: #f7f7f7 !important;
  }
  .dl-head {
    display: flex;
    justify-content: space-start;
    margin-top: 20px;
    margin-top: 0;
    height: 60px;
    align-items: center;
    margin-bottom: 15px;
    background: #fff;
    padding: 0 20px;
  }
  .step {
    display: inline-block;
    width: 300px;
    height: 40px;
    line-height: 40px;
    padding-left: 14px;
    font-size: 14px;
    background-color: #f9f9f9;
    color: #777;
    border-radius: 6px;
    margin-right: 20px;
    &:last-child {
      margin-right: 0;
    }
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
  .siteSelect {
    width: 80px;
  }
  .el-form-item__content {
    .el-cascader {
      width: 100%;
    }
    span {
      color: #666;
      height: 37px;
    }
  }
  .dl-content::-webkit-scrollbar {
    width: 4px !important;
    height: 4px !important;
  }
  .dl-content::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px #fff;
    background-color: #fff;
  }
  .dl-content::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px #cccccc;
  }
  .dl-content {
    width: 100%;
    // background: #fff;
    // padding: 0 20px;
    height: 600px;
    overflow-x: hidden;
    overflow-y: auto;
    margin-bottom: 15px;
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
            background: url(../../../../../assets/upload.png) no-repeat;
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
      width: 100%;
      background: #fff;
      padding: 0 20px;
      box-sizing: border-box;
      .dr-head {
        background-color: #fafafa;
        height: 40px;
        line-height: 40px;
        padding-left: 12px;
        font-size: 16px;
        margin-bottom: 24px;
      }
      .el-form-item {
        width: 30%;
        margin-left: 16px;
      }
      .dc-right_div {
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
        .addbdbtn {
          display: inline-block;
          width: 100px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border: 1px solid #0076da;
          font-size: 12px;
          border-radius: 4px;
          color: #0076da;
          cursor: pointer;
        }
        .underline {
          border-bottom: 1px solid #e5e5e5;
        }
        .floorwrap {
          font-size: 14px;
        }
        .fw-content {
          height: 40px;
          margin-bottom: 10px;
          position: relative;
          display: flex;
          padding-left: 30px;
          .el-input {
            width: 90%;
            margin: 0 auto;
            display: block;
          }
          i {
            display: inline-block;
          }
          .fa-move {
            background: url(../../../../../assets/move.png) no-repeat;
            background-size: contain;
            cursor: pointer;
            position: absolute;
            left: 12px;
            top: 7px;
          }
          .fa-delete {
            background: url(../../../../../assets/delete.png) no-repeat;
            background-size: contain;
          }
          span {
            display: block;
            width: 150px;
          }
        }
        .fw-head {
          height: 46px;
          width: 100%;
          background: #f7f8fa;
          display: flex;
          margin-top: 30px;
          margin-bottom: 5px;
          padding-left: 30px;
          > span {
            display: block;
            width: 150px;
            line-height: 46px;
            text-align: center;
          }
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
  .editbtn {
    color: #409eff;
  }
  .dialog-footer {
    height: 65px;
    background: #fff;
    text-align: right;
    margin: 0;
    height: 65px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 20px;
  }
  .buildingImg {
    width: 140px;
    height: 140px;
    text-align: center;
    border: 1px dashed #dfdfdf;
    cursor: pointer;
    position: relative;
    span {
      color: #3577f6;
    }
    img {
      width: 100%;
      height: 100%;
    }
    input {
      position: absolute;
      top: 0;
      right: 0;
      width: 140px;
      height: 140px;
      opacity: 0;
      cursor: pointer;
    }
    .icon-adds {
      background: url(../../../../../assets/plus.png) no-repeat;
      background-size: contain;
      margin-bottom: 6px;
    }
  }
  .basic-item {
    margin-bottom: 16px;
    p {
      font-size: 14px;
      margin-bottom: 6px;
    }
  }
  .basic-select {
    position: relative;
    cursor: pointer;
    .selectInput {
      height: 84px;
      border: 1px solid #e7e7e7;
      border-radius: 5px;
      padding: 8px 15px;
      &.selectActive {
        border: 1px solid #6473cb;
      }
      img {
        float: left;
        display: block;
        width: 100px;
        height: 54px;
        margin-right: 10px;
        margin-top: 10px;
      }
      span {
        float: left;
        color: #666666;
        display: block;
        line-height: 34px;
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
      top: 86px;
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
          width: 50px;
          height: 21.3px;
          margin-right: 20px;
        }
        span {
          display: block;
          line-height: 20px;
          font-size: 14px;
        }
      }
    }
  }

  .deviceDetails {
    width: 100px;
    height: 100px;
    margin-right: 0px !important;
    .oss_file {
      width: 100%;
      height: 100%;
      border: none;
      background: rgba(247, 249, 253, 1);
      border: 1px solid rgba(234, 234, 234, 1);
      border-radius: 2px;
      color: #3575f6;
      > i {
        font-size: 28px;
        position: absolute;
        display: block;
        text-align: center;
        width: 100%;
        left: 0;
        top: 0;
      }
      > span {
        position: absolute;
        top: 26px;
        left: 25px;
      }
    }
  }
  .tips {
    font-size: 12px;
    color: #999999;
    margin-top: 10px;
  }
  .imgBox {
    width: 100px;
    height: 100px;
    position: relative;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(234, 234, 234, 1);
    border-radius: 2px;
    > .bottomTips {
      height: 0px;
      position: absolute;
      left: 0px;
      bottom: 0px;
      width: 98px;
      background: rgba(38, 38, 38, 0.6);
      line-height: 25px;
      font-size: 12px;
      padding: 0 5px;
      cursor: pointer;
      color: #fefefe;
      text-align: center;
      transition: height 0.5s;
      overflow: hidden;
    }
    > .deleteImg {
      position: absolute;
      right: -10px;
      top: -8px;
      width: 16px;
      height: 16px;
      font-size: 14px;
      cursor: pointer;
      text-align: center;
      line-height: 16px;
    }
  }
  .imgBox:hover {
    > .bottomTips {
      height: 25px;
    }
  }
  .addItem {
    text-align: right;
    width: 100%;
    height: 20px;
    display: flex;
    justify-content: flex-end;
    span {
      display: flex;
      cursor: pointer;
      span {
        color: #3575f6;
        line-height: 20px;
        font-size: 16px;
        display: block;
        height: 20px;
      }
      span:last-child {
        font-size: 12px;
        margin-left: 4px;
        line-height: 18px;
        text-decoration: underline;
      }
    }
  }
}
</style>
