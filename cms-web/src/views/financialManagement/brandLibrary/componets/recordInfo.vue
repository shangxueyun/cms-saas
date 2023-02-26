<template>
    <div id="recordInfo">
      <div class="pageTitle">
        <span style="font-size:18px"></span>
        <span>
          <el-button size="small"  @click="submitFun('addParm')" v-if="pageType==='add'">保 存</el-button>
          <el-button style="color:#409eff" size="small"  @click="changeFun('addParm')" v-if="pageType==='details' && edit " >保存</el-button>
          <el-button style="color:#409eff" size="small"  @click="editBtnFn" v-if="pageType==='details' && !edit && hasAuthority('08020106')">编辑</el-button>
        </span>
      </div>
      <el-form :model="addParm" :rules="rules" ref="addParm" >
        <div class="pageHeader">
          <el-col :span="2">
            <img :src="addParm.imageLogo" alt="logo" class="logoImg" v-if="!edit && addParm.imageLogo">
            <img src="../../../../assets/noBrand.png" alt="logo" class="logoImg" v-if="!edit && !addParm.imageLogo">
            <div class="dc-left" v-if="edit">
              <div class="head-portrait">
                <div class="hp-img" v-if="addParm.imageLogo">
                  <img :src="addParm.imageLogo">
                </div>
                <div class="hp-img " v-else :class="isUploaded && addParm.imageLogo==''? 'isUploaded':'' ">
                  <span class="upLoadText">上传logo</span>                  
                  </div>
                <div class="upload" :class="{redborder:edit}">
                  <input type="file"
                        @change="imageChange('addapp', $event)"
                        accept="image/png, image/jpeg">
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="20">
            <div class="item2">
                <p v-if="!edit" style="font-size:18px">{{vivewData.chineseName}}</p>
                <span v-if="edit">中文名称<i class="red">*</i>：</span>
                <el-form-item prop="chineseName">
                  <el-input v-model="addParm.chineseName" v-if="edit" style="width: 200px;margin-right:30px" :disabled="edit && pageType==='details'" @input="chineseNameChnage"></el-input>
                </el-form-item>
                <p v-if="!edit">{{vivewData.englishName}}</p>
                <span v-if="edit">英文名称：</span>
                <el-input v-model="addParm.englishName"  v-if="edit" style="width: 200px;margin-right:30px" :disabled="edit && pageType==='details'"></el-input>
                <p v-if="!edit">状态：{{farmatBrandStatus(addParm.brandStatus)}}</p>    
                 <el-form-item prop="brandStatus" v-else>      
                    <span >状态<i class="red">*</i>：</span>
                    <el-select  v-model="addParm.brandStatus"  style="width:120px;margin-right:30px">
                      <el-option v-for="item in brandStatusArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                </el-form-item>
            </div>
          </el-col>
          <el-col :span="2">
            
          </el-col>
        </div>
        <div class="basicInfo">
          <p class="title">基本信息</p>
          <div class="content">
            <el-row style="margin-bottom:15px;">
              <el-col :span="10">
                <span class="item item1">
                  <p v-if="!edit">一级业态：</p><p v-if="!edit" class="" style="width:150px">{{businessTypetext1}}</p> 
                  <p v-if="!edit">二级业态：</p><p class="" v-if="!edit" style="width:150px">{{businessTypetext2}}</p>
                  <p v-if="edit">一级业态<i class="red">*</i>：</p>
                  <el-form-item prop="businessType">
                    <el-select v-model="addParm.businessType" style="width: 150px;margin-right:20px" v-if="edit"  @change='firstOptionsChanged' >
                      <el-option
                        v-for="item in firstOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <p v-if="edit">二级业态：</p>
                  <el-select v-model="businessTypeParentId"  style="width: 150px;margin-right:20px" v-if="edit">
                    <el-option
                      v-for="item in secendOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </span>
              </el-col>
              <el-col :span="14">
                <span class="item item2">
                <p>企业类型：</p><p class="w150" v-if="!edit">{{vivewData.companyType}}</p>
                <el-input v-model="addParm.companyType" style="width:150px;margin-right:20px" v-else></el-input>
                <p>企业地址：</p><p  v-if="!edit">{{vivewData.companyAddress}}</p>
                <el-input v-model="addParm.companyAddress" style="width:400px;margin-right:20px" v-else></el-input>
                </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <span class="item item1">
                  <p>电话/邮箱：</p><p class="w150"  v-if="!edit">{{vivewData.telephone}}</p>
                  <el-input v-model="addParm.telephone" style="width:150px;margin-right:20px" v-else></el-input>
                  <p>成立时间：</p><p class="w150"  v-if="!edit">{{vivewData.foundingTime}}</p>
                  <el-date-picker
                    v-model="addParm.foundingTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width:150px;margin-right:20px" v-else
                    placeholder="成立时间">
                </el-date-picker>
                </span>
              </el-col>
              <el-col :span="14">
                <span class="item item2">
                  <p>企业名称：</p><p class="w150"  v-if="!edit">{{vivewData.companyName}}</p>
                  <el-input v-model="addParm.companyName" style="width:150px;margin-right:20px" v-else></el-input>
                  <p>官网链接：</p><p class=""  v-if="!edit">{{vivewData.officialWebsiteUrl}}</p>
                  <el-input v-model="addParm.officialWebsiteUrl" style="width:400px;margin-right:20px" v-else></el-input>
                </span>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="details">
          <p class="title">详细信息</p>
          <div class="content">
            <el-row style="margin-bottom:15px">
              <span class="felx">
                <div class="item">
                  <p>品牌定位<i class="red">*</i>：</p><p v-if="!edit" class="w120">{{farMatBrandPosition(addParm.brandPosition)}}</p>
                  <el-form-item prop="brandPosition" v-else>
                    <el-select v-model="addParm.brandPosition"  style="width: 120px;margin-right:20px">
                      <el-option
                        v-for="item in orientationArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>              
                </div>
                <div class="item">
                  <p>合作期限：</p>
                  <p class="" v-if="!edit">{{vivewData.cooperationStart}} </p>
                  <p v-if="!edit && vivewData.cooperationStart!=='-'">&nbsp;至&nbsp;</p>
                  <p class="" v-if="!edit && vivewData.cooperationStart!=='-'"> {{vivewData.cooperationEnd}}</p>
                  <el-date-picker
                    v-model="addParm.cooperationStart"
                    style="width:150px"
                    type="date"
                    value-format="yyyy-MM-dd"
                    v-if="edit"
                    placeholder="开始日期">
                  </el-date-picker>
                  <p v-if="edit">&nbsp;-&nbsp;</p>
                  <el-date-picker
                    v-model="addParm.cooperationEnd"
                    style="width:150px"
                    type="date"
                    value-format="yyyy-MM-dd"
                    v-if="edit"
                    placeholder="结束日期">
                  </el-date-picker>
                </div>
                <div class="item">
                  <p>加盟费用：</p><p v-if="!edit" class="">{{vivewData.franchiseFee}} <span v-if="vivewData.franchiseFee !=='-'">W</span></p>
                  <el-input v-model="addParm.franchiseFee" v-else style="width:150px"><template slot="append" >W</template></el-input>
                </div>
                <div class="item">
                  <p>覆盖半径：</p><p v-if="!edit" class="">{{vivewData.coverageRadius}} <span v-if="vivewData.coverageRadius!=='-'">KM</span></p>
                  <el-input v-model="addParm.coverageRadius" v-else style="width:120px"><template slot="append" >KM</template></el-input>
                </div>
                <div class="item">
                  <p>年营业额：</p><p v-if="!edit" class="">{{formatFnnualTurnover(addParm.annualTurnover)}}</p>
                  <el-select v-model="addParm.annualTurnover" style="width:150px" v-else>
                    <el-option
                      v-for="item in volumeArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </span>
            </el-row>
            <el-row style="margin-bottom:15px">
              <div class="felx">
                <div class="item" style="width:100%">
                  <p>店铺要求面积：</p><p class="" v-if="!edit">{{farmatShopArea(addParm.shopArea)}}</p>
                    <el-checkbox-group v-model="addParm.shopArea" style="display: flex;align-items: center;" v-else>
                      <el-checkbox label="1">0-10㎡</el-checkbox>
                      <el-checkbox label="2">10-50㎡</el-checkbox>
                      <el-checkbox label="3">50-100㎡</el-checkbox>
                      <el-checkbox label="4">100-200㎡</el-checkbox>
                      <el-checkbox label="5">200㎡以上</el-checkbox>
                      <el-checkbox label="0">无要求</el-checkbox>
                    </el-checkbox-group>
                </div>
              </div>
            </el-row>
            <el-row style="margin-bottom:15px">
                <div class="felx">
                  <div class="item" style="width:100%">
                    <p>开店方式：</p><p class="" v-if="!edit">{{farmatOpenShopMethod(addParm.openShopMethod)}}</p>
                    <el-checkbox-group v-model="addParm.openShopMethod" style="display: flex;align-items: center;" v-else>
                      <el-checkbox label="Pool">联营</el-checkbox>
                      <el-checkbox label="Direct">直营</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
            </el-row>
            <el-row style="margin-bottom:15px">
                <div class="felx">
                  <div class="item" style="width:100%">
                    <p>适合楼层：</p><p class="" v-if="!edit">{{farmatFitFloors(addParm.fitFloors)}}</p>
                    <el-checkbox-group v-model="addParm.fitFloors" style="display: flex;align-items: center;" v-else>
                      <el-checkbox label="B1">-1F</el-checkbox>
                      <el-checkbox label="FF">1F</el-checkbox>
                      <el-checkbox label="MiddleFloor">2-5F</el-checkbox>
                      <el-checkbox label="TopFloor">最高层</el-checkbox>
                      <el-checkbox label="NO">无要求</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
            </el-row>
            <el-row style="margin-bottom:15px">
                <div class="felx">
                  <div class="item" style="width:100%">
                    <p>人均消费：</p><p class="" v-if="!edit">{{farmatPerCapitaConsumer(addParm.perCapitaConsumer)}}</p>
                    <el-checkbox-group v-model="addParm.perCapitaConsumer" style="display: flex;align-items: center;" v-else>
                      <el-checkbox label="High">高消费</el-checkbox>
                      <el-checkbox label="Ordinary">普通消费</el-checkbox>
                      <el-checkbox label="Low">低消费</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
            </el-row>
            <el-row style="margin-bottom:15px">
                <div class="felx">
                  <div class="item" style="width:100%">
                    <p>消费人群：</p><p class="" v-if="!edit">{{farmatConsumerGroup(addParm.consumerGroup)}}</p>
                    <el-checkbox-group v-model="addParm.consumerGroup" style="display: flex;align-items: center;" v-else>
                      <el-checkbox label="MiddleAndOld">中老年</el-checkbox>
                      <el-checkbox label="Young">青少年</el-checkbox>
                      <el-checkbox label="Man">男性</el-checkbox>
                      <el-checkbox label="Woman">女性</el-checkbox>
                      <el-checkbox label="Student">学生</el-checkbox>
                      <el-checkbox label="OfficeWork">上班族</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
            </el-row>
            <el-row style="margin-bottom:15px">
                <div class="felx">
                  <div class="item" style="width:100%">
                    <p style="width:100px;text-align:left">类似品牌：</p><p class="" >{{analogyBrand}}</p>
                  </div>
                </div>
            </el-row>
          </div>
        </div>
      </el-form>
    </div>
</template>

<script>
  import context from '@/service'
  window.chineseNameTest = false
  export default {
    name: 'recordInfo',
    data () {
      var isRepetition = (rule, value, callback) => {
        console.log(value)
        if (!value) {
          return callback(new Error('请输入品牌名称'))
        } else if (window.chineseNameTest) {
          return callback(new Error('品牌名已存在'))
        } else {
          callback()
        }
      }
      return {
        rules: {
          chineseName: [
             { required: true, message: '请输入中文名称', trigger: 'blur' },
             { validator: isRepetition, trigger: 'blur' }
          ],
          brandStatus: [
             { required: true, message: '请选择状态', trigger: 'change' }
          ],
          businessType: [
             { required: true, message: '请选择业态', trigger: 'change' }
          ],
          brandPosition: [
             { required: true, message: '请选择品牌定位', trigger: 'change' }
          ]
        },
        edit: false,
        pageType: '',
        businessTypetext1: '',
        businessTypetext2: '',
        shopAreaText: '', // 店铺要求面积
        addParm: {// 后台交互
          imageLogo: null,
          chineseName: null,
          englishName: null,
          brandStatus: null,
          businessType: null,
          companyType: null,
          companyAddress: null,
          telephone: null,
          email: null,
          foundingTime: null, // 成立时间
          companyName: null,
          officialWebsiteUrl: '', // 官网链接
          brandPosition: '', // 品牌定位
          cooperationStart: null, // 起始时间
          cooperationEnd: null, // 结束时间
          franchiseFee: null, // 加盟费用
          coverageRadius: null, // 覆盖面积
          annualTurnover: null, // 营业额
          shopArea: [], // 店铺面积
          openShopMethod: [], // 开店方式
          fitFloors: [], // 楼层
          perCapitaConsumer: [], // 人均消费
          consumerGroup: [] // 消费人群
        },
        vivewData: {// x详情页面展示数据
        },
        addParmView: {// 页面展示

        },
        businessTypeParentId: '',
        brandStatusArr: [
          {label: '正常', value: 'Normal'},
          {label: '异常', value: 'Abnormal'},
          {label: '停业', value: 'ShutDown'}
        ],
        firstOptions: [],
        secendOptions: [],
        orientationArr: [// 品牌定位
          {label: '奢侈', value: 'Extravagant'},
          {label: '轻奢', value: 'LightExtravagant'},
          {label: '时尚', value: 'Fashion'},
          {label: '大众', value: 'Public'},
          {label: '经济', value: 'Economics'}
        ],
        analogyBrand: '', // 类似品牌
        volumeArr: [// 营业额
          {label: '未 知', value: 0},
          {label: '0 ~ 100 W', value: 1},
          {label: '100 ~ 1000 W', value: 2},
          {label: '1000 W 以上', value: 3}
        ],
        statusVal: '',
        isUploaded: false, // 是否上传了图片
        addData: {
          facialPhoto: 'http://dev-img.yunwutech.com/h0IQ0mgw63xa7FgUUfOM',
          userPostManagements: [{
            organizeId: [],
            userPostId: '',
            onMaster: true
          }]
        }
      }
    },
    created () {
      this.getbusinessTypes()
      console.log(this.$route.params)
      this.pageType = this.$route.params.pageType
      if (this.$route.params.pageType === 'add') {
        this.edit = true
      }
      if (this.$route.params.id && this.$route.params.pageType === 'details') {
        this.renderHtml()
      } else if (this.$route.params.pageType === 'add') {

      } else {
        this.$router.push({name: 'brandLibrary'})
      }
    },
    mounted () {
        // 监听浏览器返回事件
      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL)
        window.addEventListener('popstate', this.goBack, false)
      }
    },
    destroyed () {
      window.removeEventListener('popstate', this.goBack, false)
    },
    methods: {
      hasAuthority (code) {
        return context.user.hasAuthority(code)
      },
      async chineseNameChnage (name) {
        if (!this.addParm.chineseName) {
          return false
        }
        let result = await context.http.get('ywm/api/brands/isChineseName?chineseName=' + name)
        if (result.data) {
          window.chineseNameTest = true
        } else {
          window.chineseNameTest = false
        }
      },
      goBack () { // 浏览器返回
        if (this.$route.params.from) {
          this.$router.replace({name: this.$route.params.from})
        } else {
          this.$router.replace({name: 'brandLibrary'})
        }
      },
      editBtnFn () {
        this.edit = !this.edit
        if (this.edit) { // 编辑模式
          this.addParm.shopArea = this.addParm.shopArea ? this.addParm.shopArea.split(',') : []
          this.addParm.openShopMethod = this.addParm.openShopMethod ? this.addParm.openShopMethod.split(',') : []
          this.addParm.fitFloors = this.addParm.fitFloors ? this.addParm.fitFloors.split(',') : []
          this.addParm.perCapitaConsumer = this.addParm.perCapitaConsumer ? this.addParm.perCapitaConsumer.split(',') : []
          this.addParm.consumerGroup = this.addParm.consumerGroup ? this.addParm.consumerGroup.split(',') : []
          if (this.addParm.businessType.parent) {
            this.businessTypeParentId = this.addParm.businessType.id
            this.addParm.businessType = this.addParm.businessType.parent.id
          } else {
            this.addParm.businessType = this.addParm.businessType.id
          }
          this.getSecendOp(this.addParm.businessType)
        } else {
          this.renderHtml()
        }
      },
      async getSecendOp (id) { // 编辑模式请求二级业态
        let result = await context.http.get('ywm/api/businessTypes', {parentId: id})
        this.secendOptions = result.data
      },
      renderHtml () {
        let id = this.$route.params.id
        if (id) {
          this.detailsData(id)
        }
      },
      async detailsData (detID) { // 详情数据
        let result = await context.http.get('ywm/api/brands/' + detID)
        this.addParm = result.data
        for (var i in this.addParm) {
          if (!this.addParm[i]) {
            this.vivewData[i] = '-'
          } else {
            this.vivewData[i] = this.addParm[i]
          }
        }
        this.businessTypetext2 = this.addParm.businessType.name
        if (this.addParm.businessType.parent) {
          this.businessTypetext1 = this.addParm.businessType.parent.name
        } else {
          this.businessTypetext1 = this.addParm.businessType.name
          this.businessTypetext2 = '-'
        }

        this.getRandom(this.addParm.businessType.id, this.addParm.brandPosition, detID)
      },
      async getRandom (id, p, bid) { // 请求类似品牌 id 业态ID  p品牌定位
        let result = await context.http.get('ywm/api/brands/random/', {businessTypeId: id, brandPosition: p, id: bid})
        let data = result.data
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            if (data[i].chineseName !== '' && data[i].chineseName) {
              this.analogyBrand += data[i].chineseName
            }
          }
        } else {
          this.analogyBrand = '-'
        }
      },
      strAndendTimeFn (d) { // 合作期限
        this.addParm.cooperationStart = d[0] // 起始时间
        this.addParm.cooperationEnd = d[1] // 结束时间
      },
      submitFun (addParm) { // 新增
        this.$refs[addParm].validate((valid) => {
          if (valid) {
            let self = this
            this.arrToString()
            this.farmatBusinessType()
            context.http.post('ywm/api/brands', this.addParm).then(res => {
              if (res) {
                this.$message({
                  message: '新增记录成功！',
                  type: 'success'
                })
                setTimeout(function () {
                  self.$router.push({path: '/home/brandLibrary'})
                }, 800)
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      async changeFun (addParm) { // 保存
        console.log('品牌保存')
        this.$refs[addParm].validate((valid) => {
          if (valid) {
            let self = this
            this.arrToString()
            this.farmatBusinessType()
            for (var i in this.addParm) {
              if (this.addParm[i] === '--') {
                this.addParm[i] = null
              }
            }
            context.http.put('ywm/api/brands', this.addParm).then(res => {
              if (res) {
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                })
                setTimeout(function () {
                  self.$router.push({path: '/home/brandLibrary'})
                }, 800)
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      arrToString () {
        if (this.addParm.consumerGroup) {
          this.addParm.consumerGroup = this.addParm.consumerGroup.join(',')
        }
        if (this.addParm.fitFloors) {
          this.addParm.fitFloors = this.addParm.fitFloors.join(',')
        }
        if (this.addParm.openShopMethod) {
          this.addParm.openShopMethod = this.addParm.openShopMethod.join(',')
        }
        if (this.addParm.perCapitaConsumer) {
          this.addParm.perCapitaConsumer = this.addParm.perCapitaConsumer.join(',')
        }
        if (this.addParm.shopArea) {
          this.addParm.shopArea = this.addParm.shopArea.join(',')
        }
      },
      stringToarr () {

      },
      farmatBusinessType () {
        for (var i = 0; i < this.firstOptions.length; i++) {
          if (this.addParm.businessType === this.firstOptions[i].id) {
            this.addParm.businessType = this.firstOptions[i]
          }
        }
        for (var j = 0; j < this.secendOptions.length; j++) {
          if (this.businessTypeParentId === this.secendOptions[j].id) {
            this.addParm.businessType = this.secendOptions[j]
          }
        }
      },
      farmatConsumerGroup (str) {
        if (str && typeof (str) === 'string') {
          let arr = str.split(',')
          let nArr = [
          {label: '中老年', value: 'MiddleAndOld'},
          {label: '青少年', value: 'Young'},
          {label: '男性', value: 'Man'},
          {label: '女性', value: 'Woman'},
          {label: '学生', value: 'Student'},
          {label: '上班族', value: 'OfficeWork'}
          ]
          let text = ''
          for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < nArr.length; j++) {
              if (arr[i] === nArr[j].value) {
                text = text + nArr[j].label + ' ，'
              }
            }
          }
          return text.substring(0, text.length - 1)
        } else {
          return '-'
        }
      },
      farmatPerCapitaConsumer (str) { // 人均消费
        if (str && typeof (str) === 'string') {
          let arr = str.split(',')
          let nArr = [
          {label: '高消费', value: 'High'},
          {label: '普通消费', value: 'Ordinary'},
          {label: '低消费', value: 'Low'}
          ]
          let perCapitaConsumerLabel = ''
          for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < nArr.length; j++) {
              if (arr[i] === nArr[j].value) {
                perCapitaConsumerLabel = perCapitaConsumerLabel + nArr[j].label + ' ，'
              }
            }
          }
          return perCapitaConsumerLabel.substring(0, perCapitaConsumerLabel.length - 1)
        } else {
          return '-'
        }
      },
      farmatFitFloors (str) { // 适合楼层
        if (str && typeof (str) === 'string') {
          let arr = str.split(',')
          let nArr = [
          {label: '-1F', value: 'B1'},
          {label: '1F', value: 'FF'},
          {label: '2-5F', value: 'MiddleFloor'},
          {label: '最高层', value: 'TopFloor'},
          {label: '无要求', value: 'NO'}
          ]
          let fitFloorsLabel = ''
          for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < nArr.length; j++) {
              if (arr[i] === nArr[j].value) {
                fitFloorsLabel = fitFloorsLabel + nArr[j].label + ' ，'
              }
            }
          }
          return fitFloorsLabel.substring(0, fitFloorsLabel.length - 1)
        } else {
          return '-'
        }
      },
      farmatOpenShopMethod (str) { // 开店方式
        if (str && typeof (str) === 'string') {
          let arr = str.split(',')
          let nArr = [
          {label: '联营', value: 'Pool'},
          {label: '直营', value: 'Direct'}
          ]
          let openShopMethodLabel = ''
          for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < nArr.length; j++) {
              if (arr[i] === nArr[j].value) {
                openShopMethodLabel = openShopMethodLabel + nArr[j].label + ' ，'
              }
            }
          }
          return openShopMethodLabel.substring(0, openShopMethodLabel.length - 1)
        } else {
          return '-'
        }
      },
      farmatShopArea (str) { // 店铺要求面积
        if (str && typeof (str) === 'string') {
          let arr = str.split(',')
          let narr = [
          {label: '0-10㎡', value: 1},
          {label: '10-50㎡', value: 2},
          {label: '50-100㎡', value: 3},
          {label: '100-200㎡', value: 4},
          {label: '200㎡以上', value: 5},
          {label: '无要求', value: 0}
          ]
          let shopAreaLabel = ''
          for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < narr.length; j++) {
              if (Number(arr[i]) === narr[j].value) {
                shopAreaLabel = shopAreaLabel + narr[j].label + ' ， '
              }
            }
          }
          return shopAreaLabel.substring(0, shopAreaLabel.length - 1)
        } else {
          return '-'
        }
      },
      farMatBrandPosition (n) { // 品牌定位
        for (var i = 0; i < this.orientationArr.length; i++) {
          if (n === this.orientationArr[i].value) {
            return this.orientationArr[i].label
          }
        }
      },
      farmatBrandStatus (n) { // 状态
        for (var i = 0; i < this.brandStatusArr.length; i++) {
          if (n === this.brandStatusArr[i].value) {
            return this.brandStatusArr[i].label
          }
        }
      },
      formatFnnualTurnover (n) { // 年营业额：
        if (!n) {
          return '-'
        } else {
          for (var i = 0; i < this.volumeArr.length; i++) {
            if (n === this.volumeArr[i].value) {
              return this.volumeArr[i].label
            }
          }
        }
      },
      async getbusinessTypes () { // 获取一级业态
        let result = await context.http.get('ywm/api/businessTypes', {})
        let data = result.data
        this.firstOptions = data
      },
      async firstOptionsChanged () { // 选中一级业态 请求二级业态
        this.businessTypeParentId = ''
        let result = await context.http.get('ywm/api/businessTypes', {parentId: this.addParm.businessType})
        let data = result.data
        this.secendOptions = data
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
              this.isUploaded = false// 去掉未上传图片样式
              this.addParm.imageLogo = path
            }
          }).catch(error => {
            console.info(error)
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.pageTitle{
    height: 50px;
    line-height: 50px;
    padding: 0 50px 0 0;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    padding-left: 15px;
    border:1px solid #eee
}
.buttonDiv{
  display: flex;
  justify-content:center
}
.details{
  background-color: #fff;
  margin-top: 20px;
  border: 1px solid #eee;
  .content{
        padding-left: 30px;
  }
  .felx{
    display: flex;
    .item{
      display: flex;
      margin-right: 50px;
      p{
        text-align: center;
        // margin-right:20px; 
        height: 40px;
        line-height: 40px;
      }
    }
  }
}
.w150{
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.w120{
  width: 120px;
    overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.w50{
  width: 50px;
    overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.w80{
  width: 80px;
    overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.title{
    font-size: 18px;
    height: 50px;
    line-height: 50px;
    margin-bottom: 15px;
    border-bottom: 1px solid #eee;
    padding-left: 20px;
}
.red{
    color: rgb(255, 0, 0);
    padding: 0 5px 0 0;
    font-size: 14px;
}
.basicInfo{
  background-color: #fff;
  margin-top: 20px;
  border: 1px solid #eee;
  .content{
    padding-left: 30px;
    padding-bottom: 30px;
    .item{
      display: flex;
      p{
        text-align: center;
        margin-right:20px; 
        height: 40px;
        line-height: 40px;
        &.w150{
          width: 150px;
        }
      }
    }
  }
}
.pageHeader{
    padding: 20px 30px;
    height: 120px;
    border: 1px solid #eee;
    background-color: #fff;
  .head-portrait {
    text-align: center;
    display: flex;
    .hp-img {
      width: 80px;
      height: 80px;
      border-radius:50%; 
      overflow: hidden;
      background-color: #4d67fb;
      .upLoadText{
        background-color: rgba($color: #000000, $alpha: 0.5);
        color:#fff;
        position: relative;
        bottom: -45px;
        display: inline-block;
        height: 40px;
        line-height: 24px;
        font-size: 10px;
        width: 100%;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .upload {
      vertical-align: top;
      position: absolute;
      width: 80px;
      height: 80px;
      &.redborder{
        // border: 1px solid #f00;
        border-radius:50%; 
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
        margin-top: 14px;
        cursor: pointer;
        .icon-upload {
          background: url(../../../../assets/upload.png) no-repeat;
          position: relative;
          top: 2px;
          width: 14px;
        }
      }
      input {
        position: absolute;
        width: 80px;
        height: 80px;
        opacity: 0;
        cursor: pointer;
        left: 0;
        top: 0;
      }
    }
    p {
      font-size: 12px;
      margin-top: 10px;
      color: #666;
    }
  }
  .item2{
    display: flex;
    align-items: center;
    p{
      width: 150px;
      text-align: center
    }
    .el-input__inner{
      width: 150px;
      text-align: center
    }
  }
  .logoImg {
    height: 80px;
    width: 80px;
  }
  .item{
    p{
      margin-left: 30px;
      display: inline;
      width: 100px;
    }
  } 
  span{
    display: inline;
    height: 80px;
    line-height: 80px;
  }
  .editBtn{
    cursor: pointer;
  }
}

</style>
