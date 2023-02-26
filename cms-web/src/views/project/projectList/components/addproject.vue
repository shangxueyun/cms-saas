<template>
  <div class="add-project">
    <div class="dl-content clearfix">
      <el-form :model="addData"
               ref="addData"
               :rules="addDataRules">
        <div class="dc-right float-right margin-b">
          <div class="dr-head"><span class="vertical"></span>基本信息</div>
          <el-form-item prop="organizeId">
            <div class="cttitle">管理企业<i class="required">*</i></div>
            <el-select @change="NameOptions"
                       v-model="addData.organizeId"
                       placeholder="管理企业">
              <el-option v-for="item in projectNameOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="projectCode">
            <div class="cttitle">项目代码</div>
            <el-input v-model="addData.projectCode"
                      maxlength="30"
                      placeholder="请输入内容"></el-input>
          </el-form-item>

          <el-form-item prop="projectName"
                        style="margin-bottom: 20px;">
            <div class="cttitle">项目名称<i class="required">*</i></div>
            <el-input v-model="addData.projectName"
                      maxlength="30"
                      placeholder="请输入内容"></el-input>
          </el-form-item>

          <el-form-item prop="outRentName">
            <div class="cttitle">对外招租名称<i class="required">*</i></div>
            <el-input v-model="addData.outRentName"
                      maxlength="30"
                      placeholder="请输入内容"></el-input>
          </el-form-item>

          <el-form-item>
            <div class="cttitle">资产投资方式</div>
            <el-select v-model="addData.investType"
                       placeholder="资产投资方式">
              <el-option v-for="item in investTypeOption"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <div class="cttitle">农方股权比例（%）</div>
            <el-input v-model="addData.ruralEquityRatio"
                      maxlength="30"
                      placeholder="请输入内容"></el-input>
          </el-form-item>

          <el-form-item prop="areaOptions"
                        style="margin-bottom: 20px;">
            <div class="cttitle">省市区<i class="required">*</i></div>
            <el-cascader v-model="addData.areaOptions"
                         placeholder="请选择省市区"
                         ref="cascaderAddr"
                         :options="cascaderData"
                         @active-item-change="handleItemChange"
                         @change="addHandleItemChange"
                         :props="{
                            value: 'id',
                            label: 'name',
                            children: 'cities'
                          }">
            </el-cascader>
          </el-form-item>

          <el-form-item prop="address">
            <div class="cttitle">地址<i class="required">*</i></div>
            <el-input v-model="addData.address"
                      maxlength="50"
                      @blur="dtTypeChange"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <div style="padding-left: 16px">
            <div style="margin-bottom: 10px">地理位置</div>
            <div class="map"
                 ref="container"></div>
          </div>
          <div class="dr-head"><span class="vertical"></span>项目图片<i class="required">*</i></div>
          <el-form-item prop="previewImage">
            <div class="clearfix"
                 style="display: inline-block">
              <div class="preview-wrap">
                <div class="preview">
                  <i class="iconfont icon-cms_cuowu"
                     v-if="addData.previewImage"
                     @click="delPreviewImage()"></i>
                  <img :src="addData.previewImage"
                       v-if="addData.previewImage" />
                  <div class="tips"
                       v-else>
                    <i class="iconfont icon-shangchuantupianicon"></i>
                    <p>上传图片</p>
                  </div>
                  <input type="file"
                         @change="imageChange($event)"
                         accept="image/png, image/jpeg">
                  <div v-if="errorField"
                       class="errorTip">{{errorTip}}</div>
                </div>
              </div>
              <p>(最多可上传1张,建议尺寸：160x182像素；支持格式JPG,PNG)</p>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import AMap from 'AMap'
var map, marker
var geocoder
// var placeSearch
export default {
  data () {
    return {
      value1: '',
      step1: true,
      step2: false,
      step3: false,
      addData: {
        previewImage: '',
        projectName: '',
        organizeId: '',
        originalProjectName: '',
        projectCode: '',
        outRentName: '',
        investType: null,
        ruralEquityRatio: ''
      },
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
      offerReocrdOptions: [
        { name: '不包括', value: false },
        { name: '包括', value: true }
      ],
      addDataRules: {
        organizeId: [{
          required: true,
          message: '请输入管理企业',
          trigger: 'change'
        }],
        projectName: [{
          required: true,
          message: '请输入项目名称',
          trigger: 'blur'
        }],
        // projectCode: [{
        //   required: true,
        //   message: '请输入项目代码',
        //   trigger: 'blur'
        // }],
        outRentName: [{
          required: true,
          message: '请输入对外招租名称',
          trigger: 'blur'
        }],
        referred: [{
          required: true,
          message: '请输入项目简称',
          trigger: 'blur'
        }],
        areaOptions: [{
          required: true,
          message: '请选择省市区',
          trigger: 'change'
        }],
        // previewImage: [{
        //   required: true,
        //   message: '请上传项目图片',
        //   trigger: 'blur'
        // }],
        address: [{
          required: true,
          message: '请输入地址',
          trigger: 'blur'
        }]
      },
      telRules: {
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
        }],
        telephone: [{
          pattern: /^1[23456789]\d{9}$/,
          message: '请输入正确的手机号码',
          required: false,
          trigger: 'blur'
        }],
        fixedTel: [{
          pattern: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,
          message: '请输入正确的固话',
          required: false,
          trigger: 'blur'
        }]
      },
      documentTypeOptions: {},
      pickerOptions0: {},
      pickerOptions1: {},
      cascaderData: [],
      companyOptions: [],
      errorField: true,
      errorTip: '',
      center: [],
      provinceAddress: '',
      projectNameOptions: [],
      onGroupPersonnel: false
    }
  },
  created () {
    this.step1 = true
    this.step2 = false
    this.step3 = false
  },
  mounted () {
    this.getNodes()
    let user = JSON.parse(sessionStorage.getItem('user'))
    this.onGroupPersonnel = user.onGroupPersonnel
    if (this.onGroupPersonnel) {
      this.getProjectClass()
    } else {
      this.getProjectClass2()
    }
    this.init()
  },
  methods: {
    NameOptions (row) {
      let itemCh = this.projectNameOptions.map(item => {
        if (row === item.id) {
          return item.name
        }
      })
      this.addData.originalProjectName = itemCh.toString().replace(/,/g, '')
    },
    addCycle () {
      let item = { cycle: '', startWorkDate: '', endWorkDate: '', practiceDate: '' }
      this.addData.projectCycles.push(item)
    },
    cycleChange (val) {
      let o = val ? [{ cycle: '', startWorkDate: '', endWorkDate: '', practiceDate: '' }] : []
      this.$set(this.addData, 'projectCycles', o)
    },
    init: function () {
      let container = this.$refs.container
      map = new AMap.Map(container, {
        resizeEnable: true
      })
    },
    dtTypeChange (e) {
      this.geoCode()
    },
    async getProjectClass () {
      let result = await context.http.get('uaa/api/organizes/all/simple?organizeType=ENTERPRISE&useStatus=USING')
      this.projectNameOptions = result.data
      // this.addData.projectManagementTypeId = this.projectClassOptions.filter(item => item.value === '默认项目分类')[0].id
    },
    async getProjectClass2 () {
      let result = await context.http.get('uaa/api/organizes/enterprise/user?organizeType=ENTERPRISE&useStatus=USING')
      this.projectNameOptions = result.data
    },
    parseOrganize (organizeTree) {
      if (organizeTree.leaf) {
        return { value: organizeTree.data.id ? organizeTree.data.id : organizeTree.data.userPostId ? organizeTree.data.userPostId : organizeTree.data.userId, label: organizeTree.data.name }
      } else {
        return {
          value: organizeTree.data.id ? organizeTree.data.id : organizeTree.data.userPostId ? organizeTree.data.userPostId : organizeTree.data.userId,
          label: organizeTree.data.name,
          children: organizeTree.children.map(item => {
            return this.parseOrganize(item)
          })
        }
      }
    },
    geoCode () {
      if (!geocoder) {
        geocoder = new AMap.Geocoder({
          city: '' // 城市设为北京，默认：‘全国”
        })
      }
      if (marker) {
        map.remove(marker)
      }
      var _this = this
      var address = this.provinceAddress + this.addData.address
      geocoder.getLocation(address, function (status, result) {
        if (status === 'complete' && result.geocodes.length) {
          var lnglat = result.geocodes[0].location
          // console.log('lnglat', result.geocodes[0])
          _this.addData.lat = result.geocodes[0].location.lat
          _this.addData.lot = result.geocodes[0].location.lng
          marker = new AMap.Marker()
          marker.setLabel({
            offset: new AMap.Pixel(20, -20),
            content: result.geocodes[0].formattedAddress
          })
          map.add(marker)
          marker.setPosition(lnglat)
          map.setFitView(marker)
        } else {
          console.log(JSON.stringify(result))
        }
      })
    },
    getCascaderObj (val, opt) {
      return val.map(function (value, index, array) {
        for (var itm of opt) {
          if (itm.id === value) {
            opt = itm.cities
            return itm
          }
        }
        return null
      })
    },
    handleItemChange (val) {
      this.getNodes(val)
    },
    addHandleItemChange (item) {
      this.addData.province = String(this.addData.areaOptions[0])
      this.addData.city = String(this.addData.areaOptions[1])
      this.addData.district = String(this.addData.areaOptions[2])
      let currentLabels = this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels
      let address = ''
      for (let i = 0; i < currentLabels.length; i++) {
        address += currentLabels[i]
      }
      this.provinceAddress = address
    },
    addRelations () {
      this.addData.relations.push({
        name: '',
        contacts: '',
        contactsPost: '',
        telephone: '',
        fixedTel: '',
        remark: '',
        relationType: 'CONSTRUCTION_UNIT'
      })
    },
    addOtherRelations () {
      this.addData.otherRelations.push({
        name: '',
        contacts: '',
        contactsPost: '',
        telephone: '',
        fixedTel: '',
        remark: '',
        relationType: 'OTHER'
      })
    },
    delRelations (index) {
      this.addData.relations.splice(index, 1)
    },
    delOtherRelations (index) {
      this.addData.otherRelations.splice(index, 1)
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
      let response = await context.http.get('/ywm/api/district-codes/parentId', {
        parentId: idArea
      })
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
        context.http.post('/ywm/api/image-multipart', form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          path = res.data
          this.addData.previewImage = path
          event.target.value = ''
        }).catch(error => {
          console.info(error)
        })
      }
    },
    delPreviewImage () {
      this.addData.previewImage = ''
    },
    nextStep () {
      if (this.step1) {
        this.$refs['addData1'].validate((valid) => {
          if (valid) {
            this.step1 = false
            this.step2 = true
            this.step3 = false
            this.$emit('changeStep', 'step2')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else if (this.step2) {
        this.step1 = false
        this.step2 = false
        this.step3 = true
        this.$emit('changeStep', 'step3')
      }
    },
    previousStep () {
      if (this.step2) {
        this.step1 = true
        this.step2 = false
        this.step3 = false
        this.$emit('changeStep', 'step1')
      } else if (this.step3) {
        this.step1 = false
        this.step2 = true
        this.step3 = false
        this.$emit('changeStep', 'step2')
      }
    },
    async addProject () {
      let _this = this
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          if (!this.addData.previewImage) {
            this.errorField = true
            this.errorTip = '请上传项目图片'
            return false
          }
          // 避免编辑关联信息报错新增传入空数据
          this.addData.propertyOwnerRelation = {
            contacts: '',
            contactsPost: '',
            fixedTel: '',
            name: '',
            relationType: 'PROPERTY_OWNER',
            remark: '',
            telephone: ''
          }
          this.addData.bulidUnitRelation = {
            contacts: '',
            contactsPost: '',
            fixedTel: '',
            name: '',
            relationType: 'BULID_UNIT',
            remark: '',
            telephone: ''
          }
          this.addData.designUnitRelation = {
            contacts: '',
            contactsPost: '',
            fixedTel: '',
            name: '',
            relationType: 'DESIGN_UNIT',
            remark: '',
            telephone: ''
          }
          this.addData.supervisorRelation = {
            contacts: '',
            contactsPost: '',
            fixedTel: '',
            name: '',
            relationType: 'SUPERVISOR_UNIT',
            remark: '',
            telephone: ''
          }
          this.addData.relations = [
            {
              contacts: '',
              contactsPost: '',
              fixedTel: '',
              name: '',
              relationType: 'CONSTRUCTION_UNIT',
              remark: '',
              telephone: ''
            }
          ]
          this.addData.otherRelations = [
            {
              contacts: '',
              contactsPost: '',
              fixedTel: '',
              name: '',
              relationType: 'OTHER',
              remark: '',
              telephone: ''
            }
          ]
          this.addData.sortNumber = 0
          delete this.addData.areaOptions
          context.http.post('/cms/api/project-managements', this.addData).then(res => {
            if (res) {
              _this.$emit('dialogClose')
              _this.$emit('query')
              this.resetData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetData () {
      this.addData = {
        previewImage: '',
        onBillContainFirstOfferReocrd: false,
        propertyOwnerRelation: {
          name: '',
          contacts: '',
          contactsPost: '',
          telephone: '',
          fixedTel: '',
          remark: '',
          relationType: 'PROPERTY_OWNER'
        },
        bulidUnitRelation: {
          name: '',
          contacts: '',
          contactsPost: '',
          telephone: '',
          fixedTel: '',
          remark: '',
          relationType: 'BULID_UNIT'
        },
        designUnitRelation: {
          name: '',
          contacts: '',
          contactsPost: '',
          telephone: '',
          fixedTel: '',
          remark: '',
          relationType: 'DESIGN_UNIT'
        },
        supervisorRelation: {
          name: '',
          contacts: '',
          contactsPost: '',
          telephone: '',
          fixedTel: '',
          remark: '',
          relationType: 'SUPERVISOR_UNIT'
        },
        relations: [
          {
            name: '',
            contacts: '',
            contactsPost: '',
            telephone: '',
            fixedTel: '',
            remark: '',
            relationType: 'CONSTRUCTION_UNIT'
          }
        ]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.add-project {
  .ecoIndicators {
    .cycleIndex {
      padding: 15px 20px;
      height: 40px;
      > span {
        padding: 5px 20px;
        border: 1px solid #666;
        color: #666;
        cursor: pointer;
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
.add-project {
  .dl-head {
    padding: 10px 20px 10px 20px;
    background-color: #fff;
    .step {
      display: inline-block;
      width: 30%;
      height: 40px;
      line-height: 40px;
      padding-left: 14px;
      font-size: 16px;
      background-color: #f9f9f9;
      color: #777;
      border-radius: 6px;
      margin-right: 38px;
    }
    .stepActive {
      color: #fff;
      background-color: #3175d2;
    }
  }
  .margin-b {
    margin-bottom: 15px;
  }
  .dc-right {
    width: 100%;
    margin-top: 15px;
    background-color: #fff;
    .dr-head {
      background-color: #fff;
      color: #262626;
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
      font-size: 14px;
      margin-bottom: 24px;
      font-weight: bold;
      border-bottom: 1px solid #f6f6f6;
      .vertical {
        display: inline-block;
        width: 4px;
        height: 16px;
        background-color: #3575f6;
        border-radius: 2px;
        vertical-align: sub;
        margin-right: 5px;
      }
    }
    .cttitle {
      color: #777;
    }
    .el-form-item {
      width: 21%;
      margin-left: 20px;
      margin-right: 10px;
      vertical-align: top;
      &:nth-of-type(3n) {
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
      margin-right: 23px;

      .el-form-item {
        width: 200px;
        margin-left: 0;
        margin-right: 0 !important;
      }

      .dateline {
        display: inline-block;
        width: 10px;
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
      width: 45%;
      margin-right: 40px;

      .el-form-item {
        width: 100%;
      }
    }
    .construction {
      background-color: #f7f8fa;
      margin: 0 20px 15px;
      padding-top: 10px;
      position: relative;
      .delrelations {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 12px;
        background-color: #999;
        color: #fff;
        width: 74px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        cursor: pointer;
        z-index: 99;
        i {
          font-size: 12px;
        }
      }
    }
  }

  .el-form-item {
    display: inline-block;
  }

  .el-select {
    width: 100%;
  }

  .el-cascader {
    width: 100%;
  }

  .preview-title {
    // margin-left: 20px;
  }

  .preview-wrap {
    display: flex;
    justify-content: flex-start;
    margin: 10px 0;
    .preview {
      width: 160px;
      height: 182px;
      border: 1px solid #f7f9fd;
      margin: 0 30px 0 0;
      position: relative;
      background: #f7f9fd;
      &:hover {
        .pw-bottom {
          background-color: #4893fc;
        }
      }
      .pw-bottom {
        position: absolute;
        background-color: #4883f6;
        text-align: center;
        color: #fff;
        width: 100%;
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

      input {
        position: absolute;
        top: 0;
        right: 0;
        width: 160px;
        height: 198px;
        opacity: 0;
        cursor: pointer;
      }
      .tips {
        color: #3575f6;
        text-align: center;
        margin-top: 60px;
        i {
          font-size: 32px;
        }
      }
      .icon-cms_cuowu {
        cursor: pointer;
        position: absolute;
        top: -10px;
        right: -10px;
      }
    }

    .map {
      width: 910px;
      height: 200px;
      border: 1px solid #ddd;
    }

    .errorTip {
      color: red;
      bottom: -18px;
      position: absolute;
    }
    + p {
      font-size: 12px;
      color: #777;
      margin: 0 0 10px 0;
    }
  }
  .map {
    width: 910px;
    height: 200px;
    border: 1px solid #ddd;
    margin-bottom: 20px;
  }
  .addmore {
    position: absolute;
    right: 20px;
    color: #3575f6;
    cursor: pointer;
    i {
      vertical-align: bottom;
    }
    span {
      font-size: 12px;
      font-weight: initial;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .el-textarea textarea {
    height: 34px;
  }
}
</style>
