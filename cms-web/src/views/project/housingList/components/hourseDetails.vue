<template>
  <div>
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div slot="drawer"
           class="hourse-detail details-content">
        <div class="dwedBox">
          <div class="dweditbtn"
               @click="edit"
               v-if="hasAuthority('02020202')">
            <span class="iconfont icon-edit1"></span>
            <span>编辑</span>
          </div>
        </div>
        <div class="basicInfo associatedInfo">
          <h5>房源基本信息</h5>
          <div class="basic-content">
            <div class="basic-item"
                 style="width: 46%">
              <div class="wheelplanting"
                   style="position: relative;">
                <img :src="selectedImg"
                     v-if="selectedImg" />
                <img src="../../../../assets/berth-default.png"
                     v-else />
              </div>
              <div class="wheelp-list">
                <span class="iconfont icon-right iconRight"
                      @click="selectImg('reduce')"
                      v-if="detailData.imgUrls && detailData.imgUrls.length > 0"></span>
                <div v-for="(item, index) in detailData.imgUrls"
                     :key="index"
                     style="position: relative">
                  <img :src="item"
                       :class="{'imgborder': index === selectIndex}" />
                  <span class="iconfont icon-shanchu"
                        v-if="!readonly"
                        @click="delimg(index)"></span>
                </div>
                <span class="iconfont icon-right"
                      @click="selectImg('add')"
                      v-if="detailData.imgUrls && detailData.imgUrls.length > 0"
                      style="right: -3px"></span>
              </div>
              <div class="upload"
                   v-if="!readonly && detailData.imgUrls && detailData.imgUrls.length < 5">
                <span class="uploadbtn">+上传图片</span>
                <input type="file"
                       @change="imageChange($event)"
                       accept="image/png, image/jpeg">
                <span style="color: red;font-size: 12px;"
                      v-if="errorField">{{errorTip}}</span>
              </div>
            </div>
            <div class="basic-item"
                 style="width: 54%">
              <elForm class="form"
                      :model="detailData"
                      ref="detailData"
                      :rules="detailDataRules">
                <el-form-item :label-width="formLabelWidth"
                              prop="projectManagement"
                              label="项目">
                  <p v-if="readonly && detailData.projectManagement">{{detailData.projectManagement.projectName}}</p>
                  <el-select v-if="!readonly"
                             value-key="id"
                             v-model="detailData.projectManagement"
                             placeholder="请选择"
                             @change="chooseItem('project', detailData.projectManagement)">
                    <el-option v-for="item in projectList"
                               :key="item.id"
                               :label="item.projectName"
                               :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              prop="building"
                              label="选择楼宇">
                  <p v-if="readonly && detailData.building">{{detailData.building.buildingName}}</p>
                  <el-select v-if="!readonly"
                             value-key="id"
                             v-model="detailData.building"
                             placeholder="请选择"
                             @change="chooseItem('hourse', detailData.building)">
                    <el-option v-for="item in hourList"
                               :key="item.id"
                               :label="item.buildingName"
                               :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              prop="floor"
                              label="选择楼层">
                  <p v-if="readonly && detailData.floor">{{detailData.floor.name}}</p>
                  <el-select v-if="!readonly"
                             v-model="detailData.floor"
                             placeholder="请选择">
                    <el-option v-for="item in buildingList"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              prop="shopNumber"
                              label="房源号">
                  <p v-if="readonly">{{detailData.shopNumber}}</p>
                  <el-input v-else
                            v-model="detailData.shopNumber"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              prop="shopNumber"
                              label="所属省市区">
                  <p>{{provinces}}</p>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              prop="address"
                              label="具体地址">
                  <p v-if="readonly">{{detailData.address}}</p>
                  <el-input v-else
                            v-model="detailData.address"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              prop="buildingArea"
                              label="建筑面积/㎡">
                  <p v-if="readonly">{{detailData.buildingArea | toLocaleFixed}}</p>
                  <el-input v-else
                            v-model="detailData.buildingArea"
                            @input="getHsRate"
                            type="number"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              prop="useArea"
                              label="使用面积/㎡">
                  <p v-if="readonly">{{detailData.useArea}}</p>
                  <el-input v-else
                            v-model="detailData.useArea"
                            @input="getHsRate"
                            type="number"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              label="得房率">
                  <p v-if="readonly">{{detailData.getRoomsRate}}<span v-if="detailData.getRoomsRate">%</span></p>
                  <el-input v-else
                            v-model="detailData.getRoomsRate"
                            disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              label="预期业态">
                  <p v-if="readonly">{{industry(detailData.industry)}}</p>
                  <el-select v-else
                             v-model="detailData.industry"
                             placeholder="请选择">
                    <el-option label="生活配套"
                               value="LIFE"></el-option>
                    <el-option label="餐饮"
                               value="FOOD"></el-option>
                    <el-option label="零售"
                               value="RETAIL"></el-option>
                    <el-option label="亲子教育"
                               value="BDUCATION"></el-option>
                    <el-option label="娱乐"
                               value="CSE"></el-option>
                    <el-option label="金融"
                               value="FINANCIAL"></el-option>
                    <el-option label="房地产"
                               value="REALESTATE"></el-option>
                    <el-option label="其他"
                               value="SERVICE"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              prop="investmentStatus"
                              label="招商状态">
                  <p v-if="readonly">{{investmentStatus(detailData.investmentStatus)}}</p>
                  <el-select v-else
                             v-model="detailData.investmentStatus"
                             placeholder="请选择">
                    <el-option label="可招商"
                               value="OK"></el-option>
                    <el-option label="自用"
                               value="NO"></el-option>
                    <el-option label="虚拟房源"
                               value="FICTITIOUS"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              prop="expectedUnitPrice"
                              label="报价">
                  <p v-if="readonly">{{priceUnit(detailData.expectedUnitPrice, detailData.priceUnit)}}</p>
                  <div v-else
                       class="form-box">
                    <el-input v-model="detailData.expectedUnitPrice"></el-input>
                    <el-select v-model="detailData.priceUnit"
                               placeholder="请选择">
                      <el-option label="元/㎡天"
                                 value="M2DAYS"></el-option>
                      <el-option label="元/月"
                                 value="MONTH"></el-option>
                    </el-select>
                  </div>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              label="房源状态">
                  <p v-if="readonly">{{useStatus(detailData.useStatus)}}</p>
                  <el-select v-else
                             v-model="detailData.useStatus"
                             placeholder="请选择">
                    <el-option label="使用中"
                               value="USING"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth"
                              label="招商平面图优先展示">
                  <p v-if="readonly">{{formatFirstDisplay(detailData.firstDisplay)}}</p>
                  <el-select v-else
                             v-model="detailData.firstDisplay"
                             placeholder="请选择">
                    <el-option label="优先合同"
                               value="CONTRACT"></el-option>
                    <el-option label="优先客户列表"
                               value="YXTENANT"></el-option>
                  </el-select>
                </el-form-item>
              </elForm>
            </div>
          </div>
        </div>
        <div class="basicInfo"
             id="itemContent">
          <h5>房源工程条件</h5>
          <div v-if="detailData.projectConditions && detailData.projectConditions.length===0 && readonly"
               style="padding: 20px;">暂无数据</div>
          <div class="itemContent"
               :key="keyVersions"
               v-else>
            <div class="item"
                 v-for="(item,index) in EngInfoList"
                 :key="index"
                 v-show="item.isChecked||!readonly">
              <el-checkbox style="margin-right:15px"
                           @change="(value) => changeHandler(value,item,index)"
                           :checked="item.isChecked"
                           :disabled="readonly"></el-checkbox>
              <span style="display:inline-block;width:150px;margin-right:15px;color:#606266;overflow: hidden; text-overflow: ellipsis;white-space: nowrap;">{{item.value}}</span>
              <el-input v-if="!readonly"
                        v-model="item.needValue"
                        :disabled="!item.isChecked"
                        style="width:150px;margin-right:15px"></el-input>
              <span v-else
                    style="display:inline-block;width:150px;text-align:center;color:#333">{{item.needValue===''?'-':item.needValue}}</span>
              <span style="color:#333">{{item.description}}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!readonly"
           slot="footer"
           class="dialog-footer">
        <el-button @click="onHide"
                   class="close-button">关 闭</el-button>
        <el-button @click="addHourse('detailData')"
                   type="primary"
                   class="defaultbtn dialog-confirmBtn">确 认</el-button>
      </div>
    </drawer>
  </div>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
export default {
  name: 'hoursedetails',
  components: {
    Drawer
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object,
      default: {
        projectConditions: []
      }
    }
  },
  watch: {
    detailData: {
      handler: function () {
        this.loadproject()
        if (this.detailData.imgUrls && this.detailData.imgUrls.length > 0) {
          this.selectedImg = this.detailData.imgUrls[0]
        } else {
          this.selectedImg = ''
          this.detailData.imgUrls = []
        }
        if (this.detailData.projectConditions.length > 0) {
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
        }
        context.http.get(`/ywm/api/district-codes/${this.detailData.projectManagement.district}`).then(res => {
          this.provinces = res.data.address
        })
      }
    }
  },
  created () {
    this.EngInfoList = this.$store.state.projectList // 工程条件列表
    this.EngInfoListInit(this.EngInfoList)
  },
  data () {
    var validatorArea = (rule, value, callback) => {
      if (Number(this.detailData.useArea) > Number(this.detailData.buildingArea)) {
        callback(new Error('使用面积不能大于建筑面积'))
      } else {
        callback()
      }
    }
    return {
      provinces: null,
      keyVersions: 0,
      EngInfoList: null,
      checked2: true,
      conditionCheckList: [],
      readonly: true,
      drawerTitle: '查看房源',
      formLabelWidth: '120px',
      selProject: false,
      selHourse: false,
      projectList: [],
      hourList: [],
      buildingList: [],
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
        industry: [
          { required: true, message: '请选择预期业态', trigger: 'change' }
        ],
        buildingArea: [
          { required: true, message: '请输入建筑面积', trigger: 'blur' },
          { trigger: 'blur', validator: validatorArea }
        ],
        useArea: [
          { trigger: 'blur', validator: validatorArea }
        ],
        investmentStatus: [
          { required: true, message: '请选择招商状态', trigger: 'change' }
        ],
        expectedUnitPrice: [
          { required: true, message: '报价', trigger: 'blur' }
        ]
      },
      selectIndex: 0,
      selectedImg: '',
      needValue: {
        KWHVvalue: '',
        SWWERvalue: '',
        WASTE_WATERvalue: '',
        FEED_WATERvalue: '',
        AIR_CONDITIONvalue: '',
        OIL_DIAINvalue: '',
        FLUEvalue: '',
        CASvalue: ''
      },
      decorate: {},
      errorField: false,
      errorTip: ''
    }
  },
  methods: {
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
    EngInfoListInit (arr) { // 初始化工程条件列表
      for (let i = 0; i < arr.length; i++) {
        this.$set(arr[i], 'isChecked', false)
        this.$set(arr[i], 'needValue', null)
      }
      // console.log(this.EngInfoList)
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
    addHourse (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.projectConditions()
          let detailData = JSON.parse(JSON.stringify(this.detailData))
          this.buildingList.forEach(item => {
            if (item.id === detailData.floor) {
              detailData.floor = item
            }
          })
          context.http.put('/cms/api/rooms', detailData).then(res => {
            this.$emit('drawerClose', false)
            this.$emit('query', false)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    formatFirstDisplay (str) {
      switch (str) {
        case 'CONTRACT':
          return '优先合同'
        case 'YXTENANT':
          return '优先客户列表'
      }
    },
    formatProjectTypey (val) { // 工程条件
      switch (val) {
        case 'KWH':
          return '用电量  用电需求'
        case 'SWWER':
          return '排污水  排污水管径需求'
        case 'WASTE_WATER':
          return '排废水  排废水管径需求'
        case 'FEED_WATER':
          return '给水  给水管径需求'
        case 'AIR_CONDITION':
          return '空调  空调制冷量需求'
        case 'OIL_DIAIN':
          return '排油  隔油池容积'
        case 'FLUE':
          return '烟道  排烟量需求'
        case 'CAS':
          return '燃气  燃气流量需求'
        default:
          return '-'
      }
    },
    formatProjectUnit (val) {
      switch (val) {
        case 'KWH':
          return 'kw'
        case 'SWWER':
          return 'mm'
        case 'WASTE_WATER':
          return 'mm'
        case 'FEED_WATER':
          return 'mm'
        case 'AIR_CONDITION':
          return 'w/㎡'
        case 'OIL_DIAIN':
          return 'm³'
        case 'FLUE':
          return 'm³/h'
        case 'CAS':
          return 'm³/h'
        default:
          return '-'
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onHide () {
      this.$emit('drawerClose', false)
      this.EngInfoListInit(this.EngInfoList)
      ++this.keyVersions
      this.readonly = true
      this.selProject = false
      this.selHourse = false
      this.drawerTitle = '查看房源'
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
        return '可招商'
      } else if (state === 'NO') {
        return '自用'
      } else if (state === 'FICTITIOUS') {
        return '虚拟房源'
      }
    },
    priceUnit (price, unit) {
      if (unit === 'M2DAYS') {
        return price ? price + '元/㎡天' : '-'
      } else if (unit === 'M2MONTH') {
        return price ? price + '元/㎡月' : '-'
      } else if (unit === 'DAY') {
        return price ? price + '元/天' : '-'
      } else if (unit === 'MONTH') {
        return price ? price + '元/月' : '-'
      }
    },
    useStatus (state) {
      if (state === 'USING') {
        return '使用中'
      } else if (state === 'DISABLE') {
        return '已停用'
      }
    },
    edit () {
      this.readonly = false
      this.drawerTitle = '房源详情编辑'
    },
    async loadproject () {
      context.http.get('/cms/api/project-managements', { useStatus: 'USING' }).then(res => {
        this.projectList = res.data
      })
      context.http.get('/cms/api/floors/building/' + this.detailData.building.id).then(res => {
        this.buildingList = res.data
      })
      context.http.get('/cms/api/buildings', { projectId: this.detailData.projectManagement.id }).then(res => {
        this.hourList = res.data.buildingListDTOS
      })
      context.http.get('/uaa/api/paramet-managements/name?name=' + '装修程度').then(res => {
        this.decorate = res.data
      })
    },
    choose (state) {
      if (this.readonly) return
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
    handleCheckedCitiesChange (value) {
      console.log(this.conditionCheckList)
    },
    checkboxChange (checked, value) {
      if (!checked) {
        this.needValue[value] = ''
      }
    },
    async imageChange (event) {
      this.errorField = false
      let path = ''
      let files = event.target.files
      let _this = this
      if (files.length > 0) {
        if (files[0].size > (1024 * 1024 * 3)) {
          this.errorField = true
          this.errorTip = '上传图片不能大于3M'
          return
        } else if (files[0].type !== 'image/png' && files[0].type !== 'image/jpeg') {
          this.errorField = true
          this.errorTip = '上传图片格式不正确'
          return
        }
        let form = new FormData()
        form.append('file', files[0])
        event.target.value = ''
        context.http.post('/ywm/api/image-multipart', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          path = res.data
          _this.detailData.imgUrls.push(path)
          this.selectedImg = this.detailData.imgUrls[0]
        }).catch(error => {
          console.info(error)
        })
      }
    },
    getHsRate () {
      if (this.detailData.useArea && this.detailData.buildingArea) {
        this.detailData.getRoomsRate = (this.detailData.useArea / this.detailData.buildingArea).toFixed(2) * 100
      }
    }
  }
}
</script>
<style lang="scss">
#itemContent {
  .itemContent {
    font-size: 14px;
    padding: 15px;
    .item {
      display: flex;
      min-height: 40px;
      // line-height: 50px;
      padding-left: 50px;
      margin-top: 10px;
      align-items: center;
      > span {
        display: inline-block;
        width: 150px;
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
.hourse-detail {
  width: 1280px;
  padding: 0px 20px;
  .dwedBox {
    position: relative;
    .dweditbtn {
      position: absolute;
      right: 20px;
      top: -30px;
      font-size: 14px;
      display: flex;
      width: 50px;
      height: 18px;
      cursor: pointer;
      justify-content: space-between;
      span {
        display: block;
        float: left;
        line-height: 18px;
        &:first-child {
          font-size: 18px;
        }
      }
    }
  }
  .basicInfo {
    border: 1px solid #f1f1f1;
    margin: 15px 0;
    width: 500px;
    display: inline-block;
    vertical-align: top;
    h5 {
      height: 40px;
      background: #fafafa;
      line-height: 40px;
      padding: 0 15px;
      font-size: 14px;
      color: #666666;
    }
    .basic-content {
      display: flex;
      justify-content: space-between;
      padding: 15px;
      .basic-item {
        width: 50%;
        p {
          font-size: 14px;
          color: #333;
          line-height: 14px;
          margin-bottom: 0;
          margin-top: 12px;
        }
        .basic-select {
          position: relative;
          cursor: pointer;
          .selectInput {
            height: 110px;
            border: 1px solid #e7e7e7;
            border-radius: 5px;
            padding: 0 15px;
            &.selectActive {
              border: 1px solid #6473cb;
            }
            img {
              float: left;
              display: block;
              width: 150px;
              height: 80px;
              margin-right: 10px;
              margin-top: 15px;
            }
            span {
              float: left;
              color: #666666;
              display: block;
              line-height: 110px;
              &.over-hiden {
                width: 180px;
                white-space: nowrap;
                word-break: break-all;
                text-overflow: ellipsis;
                overflow: hidden;
              }
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
            top: 115px;
            z-index: 9;
            padding: 15px 0px;
            box-shadow: 1px 2px 5px #ddd;
            height: 210px;
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
      }
      .wheelplanting {
        img {
          width: 230px;
          height: 170px;
        }
      }
      .wheelp-list {
        position: relative;
        width: 239px;
        div {
          width: 40px;
          height: 40px;
          display: inline-block;
          margin-right: 4px;
          &:last-of-type {
            margin-right: 0;
          }
          img {
            width: 100%;
            height: 100%;
            border: 1px solid #dadada;
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
          cursor: pointer;
          bottom: 14px;
        }
        .imgborder {
          border: 1px solid #409eff;
        }
        .icon-shanchu {
          position: absolute;
          top: -9px;
          right: -10px;
          color: #ccc;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          line-height: 18px;
          text-align: center;
          font-size: 16px;
          z-index: 1;
          background-size: contain;
          border: 1px solid #dadadd;
          cursor: pointer;
          background: url(../../../../assets/closed.png) no-repeat;
          background-size: contain;
        }
      }
      .upload {
        position: relative;
        .uploadbtn {
          display: inline-block;
          width: 66px;
          height: 24px;
          line-height: 20px;
          text-align: center;
          border: 1px solid #5e72e4;
          border-radius: 4px;
          color: #5e72e4;
          margin-top: 14px;
          cursor: pointer;
          font-size: 12px;
        }
        input {
          position: absolute;
          top: 15px;
          left: 0;
          width: 66px;
          height: 24px;
          opacity: 0;
          cursor: pointer;
        }
      }
    }
  }
  .associatedInfo {
    border: 1px solid #f1f1f1;
    margin: 15px 0 30px 0;
    width: 726px;
    h5 {
      height: 40px;
      background: #fafafa;
      line-height: 40px;
      padding: 0 15px;
      font-size: 14px;
      color: #666666;
    }
    .form {
      padding: 10px 0px 10px 0;
      .el-form-item {
        width: 376px;
        margin-right: 30px;
        margin-bottom: 20px;
        display: inline-block;
        .el-form-item__label {
          width: 140px !important;
        }
        .labelList {
          span {
            display: inline-block;
            margin-right: 15px;
            margin-bottom: 20px;
            height: 25px;
            padding: 0 6px 0 6px;
            background: #3577f6;
            color: #fff;
            line-height: 25px;
            font-size: 12px;
          }
        }
        &:nth-child(9) {
          width: 376px;
        }
        .el-form-item__content {
          line-height: 30px;
          margin-left: 146px !important;
        }
        .el-select {
          width: 100%;
        }
        .form-box {
          display: flex;
          justify-content: space-between;
          .el-input {
            width: 120px;
          }
          .el-select {
            width: 100px;
            .el-input {
              width: 100px;
            }
          }
        }
      }
      .addLabel {
        border: 1px solid #dcdfe6;
        padding: 10px;
        border-radius: 4px;
        input {
          width: 100px;
          height: 25px;
          display: block;
          float: left;
        }
        p {
          float: left;
          margin-right: 15px;
          margin-bottom: 20px;
          height: 25px;
          padding: 0 0px 0 6px;
          background: #3577f6;
          color: #fff;
          line-height: 25px;
          display: flex;
          border-radius: 4px;
          span {
            display: block;
            font-size: 12px;
            &:last-child {
              width: 25px;
              height: 25px;
              text-align: center;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  .condition-content {
    .el-checkbox-group {
      margin: 0 auto;
    }
    .el-input {
      margin: 0 10px;
      width: 150px;
    }
    .el-checkbox {
      display: block;
      margin-bottom: 10px;
    }
    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }
    .conditions-readonly {
      margin: 0 auto;
      font-size: 14px;
      div {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
