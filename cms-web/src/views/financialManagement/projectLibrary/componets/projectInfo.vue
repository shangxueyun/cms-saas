<template>
    <div id="projectInfo">
      <div class="pageTitle">
        <span style="font-size:18px"></span>
        <span>
          <el-button size="small"  @click="submitFun('addParm')" v-if="pageType==='add'">保 存</el-button>
          <el-button style="color:#409eff" size="small"  @click="changeFun('addParm')" v-if="pageType==='details' && edit " >保存</el-button>
          <el-button style="color:#409eff" size="small"  @click="editBtnFn" v-if="pageType==='details' && !edit && hasAuthority('08020206')">编辑</el-button>
        </span>
      </div>
      <el-form :model="addParm" :rules="rules" ref="addParm" >
        <div class="pageHeader">
          <el-col :span="2">
            <img :src="addParm.imageLogo" alt="logo" class="logoImg" v-if="!edit && addParm.imageLogo">
            <img src="../../../../assets/noProject.png" alt="logo" class="logoImg" v-if="!edit && !addParm.imageLogo">
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
                <p v-if="!edit">项目名称：{{vivewData.name}}</p>
                <span v-if="edit">项目名称<i class="red">*</i>：</span>
                <el-form-item prop="name">
                  <el-input v-model="addParm.name" v-if="edit" :disabled="edit && pageType==='details'" style="width: 200px;margin-right:30px" @input="nameChnage"></el-input>
                </el-form-item>
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
                <span class="item item1">
                  <p v-if="!edit">关联企业：</p><p v-if="!edit" class="min150">{{vivewData.affiliatedCompany}}</p> 
                  <p v-if="!edit">项目所属省市区<i class="red">*</i>：</p><p class="min150" v-if="!edit">{{vivewData.addrProvince}}</p>
                  <p v-if="edit">关联企业：</p>
                  <el-input v-model="addParm.affiliatedCompany" style="width: 150px;margin-right:20px" v-if="edit"></el-input>
                  <p v-if="edit">项目所属省市区<i class="red">*</i>：</p>
                  <el-form-item prop="addrProvince">
                    <el-input v-model="addParm.addrProvince" style="width: 150px;margin-right:20px" v-if="edit"></el-input>
                  </el-form-item>
                  <p>项目地址<i class="red">*</i>：</p><p  v-if="!edit" class="min150">{{vivewData.addrAddress}}</p>
                  <el-form-item prop="addrAddress">
                    <el-input v-model="addParm.addrAddress" style="width:150px;margin-right:20px" v-if="edit"></el-input>
                  </el-form-item>
                </span>
            </el-row>
            <el-row>
              <span class="item item1">
                <p>项目阶段：</p><p class="min150"  v-if="!edit">{{vivewData.projectStage}}</p>
                <el-input v-model="addParm.projectStage" style="width:150px;margin-right:20px" v-else></el-input>
                <p>商业类型<i class="red">*</i>：</p><p class="min150"  v-if="!edit">{{formatBusinessType(vivewData.businessType)}}</p>
                <el-select v-model="addParm.businessType" style="width: 150px;margin-right:20px" v-else>
                  <el-option v-for="(item,index) in businessTypeArr" 
                  :label="item.label"
                  :value="item.value"
                  :key="index">
                  </el-option>
                </el-select>
                <p>企业类型：</p><p class="min150" v-if="!edit">{{vivewData.companyType}}</p>
                <el-input v-model="addParm.companyType" style="width:150px;margin-right:20px" v-else></el-input>
              </span>
            </el-row>
          </div>
        </div>
        <div class="details">
          <p class="title">其他信息</p>
          <div class="content">
            <el-row style="margin-bottom:15px">
              <span class="felx">
                <div class="item">
                  <p>建筑面积：</p><p v-if="!edit" class="min150">{{vivewData.bulidArea}} <span v-if="vivewData.bulidArea !=='-'">㎡</span></p>
                  <el-input v-model="addParm.bulidArea" v-else style="width:150px"><template slot="append" >㎡</template></el-input>
                </div>
                <div class="item">
                  <p>占地面积：</p><p v-if="!edit" class="min150">{{vivewData.coveredArea}} <span v-if="vivewData.coveredArea !=='-'">㎡</span></p>
                  <el-input v-model="addParm.coveredArea" v-else style="width:150px"><template slot="append" >㎡</template></el-input>
                </div>
                <div class="item">
                  <p>管理面积：</p><p v-if="!edit" class="min150">{{vivewData.managementArea}} <span v-if="vivewData.managementArea !=='-'">㎡</span></p>
                  <el-input v-model="addParm.managementArea" v-else style="width:150px"><template slot="append" >㎡</template></el-input>
                </div>
                <div class="item">
                  <p>平均租金：</p><p v-if="!edit" class="min150">{{vivewData.avgRent}} <span v-if="vivewData.avgRent !=='-'">元/㎡</span></p>
                  <el-input v-model="addParm.avgRent" v-else style="width:150px"><template slot="append" >元/㎡</template></el-input>
                </div>
              </span>
            </el-row>
            <el-row style="margin-bottom:15px">
              <div class="felx">
                <div class="item">
                  <p>入驻商家数量：</p><p v-if="!edit" class="min150">{{vivewData.shopNumber}}</p>
                  <el-input v-model="addParm.shopNumber" v-else style="width:150px"></el-input>
                </div>
                <div class="item">
                  <p>综合评分：</p><p v-if="!edit" class="min150">{{vivewData.compositeScore}} <span v-if="vivewData.compositeScore !=='-'">分</span></p>
                  <el-input v-model="addParm.compositeScore" v-else style="width:150px"><template slot="append" >分</template></el-input>
                </div>
                <div class="item">
                  <p>商圈排名：</p><p v-if="!edit" class="min150">{{vivewData.rank}} <span v-if="vivewData.rank !=='-'">名</span></p>
                  <el-input v-model="addParm.rank" v-else style="width:150px"><template slot="append" >分</template></el-input>
                </div>
                <div class="item">
                  <p>消费能力：</p><p class="" v-if="!edit">{{formatPerCapitaConsumer(vivewData.perCapitaConsumer)}}</p>
                  <el-select v-model="addParm.perCapitaConsumer" style="width: 150px;margin-right:20px" v-else>
                    <el-option
                      v-for="item in perCapitaConsumerArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </el-row>
            <el-row style="margin-bottom:15px">
                <div class="felx">
                  <div class="item">
                    <p>覆盖半径：</p><p v-if="!edit" class="min150">{{vivewData.coverageRadius}} <span v-if="vivewData.coverageRadius !=='-'">km</span></p>
                    <el-input v-model="addParm.coverageRadius" v-else style="width:150px"><template slot="append" >km</template></el-input>
                  </div>
                  <div class="item">
                    <p>人流量：</p><p class="min150" v-if="!edit">{{formatPeopleFlow(addParm.peopleFlow)}}</p>
                    <el-select v-model="addParm.peopleFlow"  style="width: 150px;margin-right:20px" v-else>
                    <el-option
                      v-for="item in peopleFlow"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  </div>
                  <div class="item">
                    <p>营业期限：</p><p v-if="!edit" class="min150">{{vivewData.businessStartTime}}&nbsp;-&nbsp;{{vivewData.businessEndTime}}</p>
                    <el-date-picker
                      v-model="addParm.businessStartTime"
                      type="date"
                      placeholder="开始日期"
                      value-format="yyyy-MM-dd"
                      style="width:150px"
                      v-if="edit">
                    </el-date-picker>
                    <p v-if="edit"> &nbsp;- &nbsp;</p>
                    <el-date-picker
                      v-model="addParm.businessEndTime"
                      value-format="yyyy-MM-dd"                     
                      type="date"
                      placeholder="结束日期"
                       style="width:150px"
                      v-if="edit">
                    </el-date-picker>
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
    window.nameTest = false
    export default {
      name: 'projectInfo',
      data () {
        var isRepetition = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('请输入项目名称'))
          } else if (window.nameTest) {
            return callback(new Error('项目名称已存在'))
          } else {
            callback()
          }
        }
        return {
          rules: {
            name: [
              { required: true, message: '请输入项目名称', trigger: 'change' },
              { validator: isRepetition, trigger: 'blur' }
            ],
            brandStatus: [
              { required: true, message: '请选择状态', trigger: 'change' }
            ],
            addrProvince: [
              { required: true, message: '请输入项目所属省市区', trigger: 'change' }
            ],
            addrAddress: [
              { required: true, message: '请输入项目地址', trigger: 'change' }
            ],
            businessType: [
              { required: true, message: '请选择商业类型', trigger: 'change' }
            ]
          },
          edit: false,
          pageType: '',
          shopAreaText: '', // 店铺要求面积
          addParm: {// 后台交互
            imageLogo: null,
            name: null, // 项目名称
            affiliatedCompany: null, // 关联企业
            brandStatus: null, // 状态
            addrProvince: null, // 所属市区
            addrAddress: null, // 项目地址
            projectStage: null, // 项目阶段
            businessType: null, // 商业类型
            companyType: null, // 企业类型
            bulidArea: null, // 建筑面积
            coveredArea: null, // 占地面积
            managementArea: null, // 管理面积
            avgRent: null, // 平均租金
            shopNumber: null, // 商家数量
            compositeScore: null, // 综合评分
            rank: null, // 排名
            perCapitaConsumer: null, // 人均消费
            coverageRadius: null, // 覆盖半径
            peopleFlow: null, // 人流量
            businessStartTime: null, // 营业开始时间
            businessEndTime: null// 营业结束时间
          },
          vivewData: {// x详情页面展示数据
          },
          addParmView: {// 页面展示

          },
          businessTypeArr: [// 商业类型
             {label: '主题商场', value: 'ThemeMall'},
             {label: '仓储式商场', value: 'StorageMall'},
             {label: '大型综合超市', value: 'Supermarket'},
             {label: '百货楼', value: 'DepartmentStore'},
             {label: '购物中心', value: 'ShopMall'},
             {label: '其他', value: 'Other'}
          ],
          businessTypeParentId: '',
          brandStatusArr: [
            {label: '正常', value: 'Normal'},
            {label: '异常', value: 'Abnormal'},
            {label: '停业', value: 'ShutDown'}
          ],
          firstOptions: [],
          secendOptions: [],
          perCapitaConsumerArr: [// 消费能力
            {label: '高消费', value: 'High'},
            {label: '普通消费', value: 'Ordinary'},
            {label: '低消费', value: 'Low'}
          ],
          peopleFlow: [// 人流量
            {label: '人口密集', value: 'Dense'},
            {label: '人口稀疏', value: 'Sparse'},
            {label: '人口适中', value: 'Moderate'}
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
        this.pageType = this.$route.params.pageType
        if (this.$route.params.pageType === 'add') {
          this.edit = true
        }
        if (this.$route.params.id && this.$route.params.pageType === 'details') {
          this.detailsData(this.$route.params.id)
        } else if (this.$route.params.pageType === 'add') {

        } else {
          this.$router.push({name: 'projectLibrary'})
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
        async nameChnage (name) {
          if (!this.addParm.name) {
            return false
          }
          let result = await context.http.get('ywm/api/projectLibrarys/isName?name=' + name)
          if (result.data) {
            window.nameTest = true
          } else {
            window.nameTest = false
          }
        },
        goBack () { // 浏览器返回
          this.$router.replace({name: 'projectLibrary'})
        },
        editBtnFn () {
          this.edit = !this.edit
        },
        async detailsData (detID) { // 详情数据
          let result = await context.http.get('ywm/api/projectLibrarys/' + detID)
          this.addParm = result.data
          for (var i in this.addParm) {
            if (!this.addParm[i]) {
              this.vivewData[i] = '-'
            } else {
              this.vivewData[i] = this.addParm[i]
            }
          }
        },
        submitFun (addParm) { // 新增
          this.$refs[addParm].validate((valid) => {
            if (valid) {
              let self = this
              context.http.post('ywm/api/projectLibrarys', this.addParm).then(res => {
                if (res) {
                  this.$message({
                    message: '新增记录成功！',
                    type: 'success'
                  })
                  setTimeout(function () {
                    self.$router.push({path: '/home/projectLibrary'})
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
              console.log(this.addParm)
              context.http.put('ywm/api/projectLibrarys', this.addParm).then(res => {
                if (res) {
                  this.$message({
                    message: '保存成功',
                    type: 'success'
                  })
                  setTimeout(function () {
                    self.$router.push({path: '/home/projectLibrary'})
                  }, 800)
                }
              })
            } else {
              console.log('error submit!!')
              return false
            }
          })
        },
        farmatBrandStatus (n) { // 状态
          for (var i = 0; i < this.brandStatusArr.length; i++) {
            if (n === this.brandStatusArr[i].value) {
              return this.brandStatusArr[i].label
            }
          }
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
        },
        formatBusinessType (str) { // 商业类型转换
          switch (str) {
            case 'ThemeMall':
              return '主题商场'
            case 'StorageMall':
              return '仓储式商场'
            case 'Supermarket':
              return '大型综合超市'
            case 'DepartmentStore':
              return '百货楼'
            case 'ShopMall':
              return '购物中心'
            case 'Other':
              return '其他'
            default:
              return '-'
          }
        },
        formatPerCapitaConsumer (str) { // 消费能力
          switch (str) {
            case 'High':
              return '高消费'
            case 'Ordinary':
              return '普通消费'
            case 'Low':
              return '低消费'
            default:
              return '-'
          }
        },
        formatPeopleFlow (str) { // 人流量
          switch (str) {
            case 'Dense':
              return '人口密集'
            case 'Sparse':
              return '人口稀疏'
            case 'Moderate':
              return '人口适中'
            default:
              return '-'
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
.min150{
  min-width: 150px;
}
.w150{
  width: 150px;
}
.w120{
  width: 120px;
}
.w50{
  width: 50px;
}
.w80{
  width: 80px;
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
