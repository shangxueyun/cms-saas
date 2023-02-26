<template>
    <div id="addShop">
     <div class="pageTitle">
        <span style="font-size:18px"></span>
        <span>
          <el-button size="small"   v-if="childPageType==='add'" @click="addShop('addParm')">保 存</el-button>
          <el-button size="small" style="color:#409eff"   v-if="childPageType==='details'&& edit" @click="editSubmitFn('addParm')">保  存</el-button>
          <el-button size="small" style="color:#409eff"   v-if="childPageType==='details'&&!edit"  @click="editBtnFn" >编辑</el-button>
        </span>
      </div>
      <!-- <div class="buttonDiv" v-if="edit">
        <el-button type="success" v-if="childPageType==='details'" @click="editSubmitFn('addParm')">保  存</el-button>
        <el-button type="success" v-if="childPageType==='add'" @click="addShop('addParm')">新 增</el-button>
        <span class="editBtn" @click="editBtnFn" v-if="!edit">编辑</span>
      </div> -->
      <el-form :model="addParm" :rules="rules" ref="addParm">
        <div class="pageHeader">
          <el-col :span="2">
            <img :src="addParm.storeImageLogo" alt="logo" class="logo" v-if="!edit && addParm.storeImageLogo">
            <img src="../../../../assets/noStore.png" alt="logo" class="logoImg" v-if="!edit && !addParm.storeImageLogo">
            <div class="dc-left" v-if="edit">
              <div class="head-portrait">
                <div class="hp-img" v-if="addParm.storeImageLogo">
                  <img :src="addParm.storeImageLogo ? addParm.storeImageLogo :'' ">
                </div>
                <div class="hp-img " v-else :class="isUploaded && addParm.storeImageLogo==''? 'isUploaded':'' "><span class="upLoadText">上传门店图</span>  </div>
                <div class="upload" :class="{redborder:edit}">
                  <input type="file"
                        @change="imageChange('addapp', $event)"
                        accept="image/png, image/jpeg">
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="item2">
              <span>门店名称<i class="red" v-if="edit">*</i>：</span>
              <p v-if="!edit">{{addParm.storeName}}</p>
              <el-form-item prop="storeName" style="margin-right:20px">
                <el-input v-model="addParm.storeName" v-if="edit" style="width: 120px;margin-right:30px" placeholder="请输入店名"></el-input>
              </el-form-item>
              <p v-if="!edit">状态：{{brandStatusText(addParm.brandStatus)}}</p>
              <!-- <div v-else> -->
                <span v-if="edit">状态<i class="red">*</i>：</span>
                <el-form-item prop="brandStatus" v-if="edit">
                  <el-select  v-model="addParm.brandStatus"  style="width:120px;margin-right:30px">
                  <el-option v-for="item in statusArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                </el-form-item>
              <!-- </div> -->
            </div>
          </el-col>
          <el-col :span="2" :offset="8">
            
          </el-col>
        </div>
        <div class="basicInfo">
          <p class="title">基本信息</p>
          <div class="content"> 
            <el-row style="margin-bottom:15px;" class="felx">
              <span class="item">
                <p>所属商圈<i class="red" v-if="edit">*</i>：</p><p class="w150" v-if="!edit">{{vivewData.mallName}}</p>
                <el-form-item prop="mallName" v-else>
                  <el-input v-model="addParm.mallName" style="width:150px;margin-right:20px" ></el-input>
                </el-form-item>
              </span>
              <span class="item">
                <p>店铺面积：</p><p class="w150" v-if="!edit">{{vivewData.storeArea}}㎡</p>
                <el-input v-model="addParm.storeArea" style="width:150px;margin-right:20px" v-else><template slot="append">㎡</template></el-input>
              </span>
              <span class="item">
                <p>人均消费：</p><p class="w150" v-if="!edit">￥{{vivewData.perCapitaConsumer}}</p>
                <el-input v-model="addParm.perCapitaConsumer" style="width:150px;margin-right:20px" v-else><template slot="prepend">￥</template></el-input>
              </span>
              <span class="item">
                <p>门店地址<i class="red" v-if="edit">*</i>：</p><p class="" v-if="!edit">{{vivewData.storeAdress}}</p>
                <el-form-item prop="storeAdress" v-else>
                  <el-input v-model="addParm.storeAdress" style="width:150px;margin-right:20px" ></el-input>
                </el-form-item>
              </span>
            </el-row>
            <el-row style="margin-bottom:15px;" class="felx">
              <span class="item">
                <p>覆盖半径<i class="red" v-if="edit">*</i>：</p><p class="w150" v-if="!edit">{{formatcoverageRadius(addParm.coverageRadius)}}</p>
                <el-form-item prop="coverageRadius">
                  <el-select v-model="addParm.coverageRadius" style="width: 150px;margin-right:20px" v-if="edit">
                    <el-option
                      v-for="item in radiusArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </span>
              <span class="item">
                <p>经营年限：</p><p class="w150" v-if="!edit">{{vivewData.businessLife}}年</p>
                <el-input v-model="addParm.businessLife" style="width:150px;margin-right:20px" v-else><template slot="append">年</template></el-input>
              </span>
              <span class="item">
                <p>同行排名：</p><p class="w150" v-if="!edit">{{vivewData.rank}}</p>
                <el-input v-model="addParm.rank" style="width:150px;margin-right:20px" v-else></el-input>
              </span>
              <span class="item">
                <p>营业时间：</p><p class="w150" v-if="!edit">{{businessTime(addParm.businessStartTime,addParm.businessEndTime)}}</p>
                  <el-time-select
                    v-model="addParm.businessStartTime"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '24:00'
                    }" v-if="edit" style="width:100px;margin-right:20px">
                  </el-time-select>
                  <p v-if="edit"> - </p>
                  <el-time-select
                    v-model="addParm.businessEndTime"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '24:00',
                      minTime: addParm.businessStartTime
                    }" v-if="edit" style="width:100px;margin-right:20px">
                  </el-time-select>
              </span>
            </el-row>
            <el-row style="margin-bottom:15px;" class="felx">
              <span class="item">
                <p>租金价格：</p><p class="w150" v-if="!edit">￥{{vivewData.rentPrice}}</p>
                <el-input v-model="addParm.rentPrice" style="width:150px;margin-right:20px" v-else></el-input>
              </span>
              <span class="item">
                <p>经营情况：</p><p class="w150" v-if="!edit">{{manageStatusText(addParm.manageStatus)}}</p>
                <el-select v-model="addParm.manageStatus" style="width: 150px;margin-right:20px" v-if="edit">
                  <el-option label="未知" value="NO"></el-option>
                  <el-option label="盈利" value="Profit"></el-option>
                  <el-option label="持平" value="Fair"></el-option>
                  <el-option label="亏损" value="Loss"></el-option>
                </el-select>
              </span>
              <span class="item">
                <p>好评度：</p><p class="w150" v-if="!edit">{{praiseDegreeText(addParm.praiseDegree)}}</p>
                <el-select v-model="addParm.praiseDegree" style="width: 150px;margin-right:20px" v-if="edit">
                  <el-option label="未知" value="NO"></el-option>
                  <el-option label="满意" value="Good"></el-option>
                  <el-option label="一般" value="Commonly"></el-option>
                  <el-option label="不满意" value="NotGood"></el-option>
                </el-select>
              </span>
              <span class="item">
                <p>开业时间：</p><p class="w150" v-if="!edit">{{vivewData.openTime}}</p>
                <el-date-picker
                  v-model="addParm.openTime"
                  type="date"
                  style="width:150px;margin-right:20px" v-else
                  value-format="yyyy-MM-dd"
                  placeholder="开业时间">
                </el-date-picker>
              </span>
            </el-row>
          </div>
        </div>     
      </el-form>
    </div>
</template>

<script>
  import context from '@/service'
  export default {
    name: 'addShop',
    components: {

    },
    data () {
      return {
        rules: {
          storeName: [
             { required: true, message: '请输入门店名称', trigger: 'change' }
          ],
          brandStatus: [
             { required: true, message: '请选择状态', trigger: 'change' }
          ],
          mallName: [
             { required: true, message: '请输入商圈', trigger: 'change' }
          ],
          storeAdress: [
             { required: true, message: '请输入门店地址', trigger: 'change' }
          ],
          coverageRadius: [
             { required: true, message: '请选择覆盖半径', trigger: 'change' }
          ]
        },
        cid: null,
        childPageType: '',
        edit: false,
        radiusArr: [// 覆盖半径
          {value: 1, label: '1 - 3KM'},
          {value: 2, label: '4 - 6KM'},
          {value: 3, label: '7 - 10KM'},
          {value: 4, label: '11 - 30KM'}
        ],
        statusArr: [// 状态
          {label: '正常', value: 'Normal'},
          {label: '异常', value: 'Abnormal'},
          {label: '停业', value: 'ShutDown'}
        ],
        currentPage: 1,
        total: 10,
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
        ],
        addParm: {
          brand: {id: null},
          storeImageLogo: null, // 店logo
          storeName: null, // 店名
          brandStatus: null, // 状态
          mallName: null, // 所属商圈
          storeArea: null, // 店铺面积
          perCapitaConsumer: null, // 人均消费
          storeAdress: null,
          coverageRadius: null, // 覆盖半径
          businessLife: null, // 经营年限
          rank: null, // 同行排名
          businessStartTime: null,
          businessEndTime: null, // 营业时间
          rentPrice: null, // 租金价格
          manageStatus: null, // 经营情况
          praiseDegree: null, // 好评度.
          openTime: null// 开业时间
        },
        vivewData: {}, // 页面详情展示数据
        isUploaded: false
      }
    },
    created () {
      console.log(this.$route.params)
      this.cid = this.$route.params.cid
      this.childPageType = this.$route.params.childPageType
      if (this.cid) {
        this.detailsData(this.cid)
      }
      if (this.$route.params.childPageType === 'add') {
        this.edit = true
        this.addParm.brand.id = this.$route.params.id
      }
    },
    mounted () {
  
    },
    methods: {
      formatcoverageRadius (str) { // 覆盖半径：
        if (str) {
          for (var i = 0; i < this.radiusArr.length; i++) {
            if (str === this.radiusArr[i].value) {
              return this.radiusArr[i].label
            }
          }
        } else {
          return '-'
        }
      },
      praiseDegreeText (str) { // 好评度
        switch (str) {
          case 'NO':
            return '未知'
          case 'Good':
            return '满意'
          case 'Commonly':
            return '一般'
          case 'NotGood':
            return '不满意'
          default:
            return '-'
        }
      },
      manageStatusText (str) { // 经营情况
        switch (str) {
          case 'NO':
            return '未知'
          case 'Profit':
            return '盈利'
          case 'Fair':
            return '持平'
          case 'Loss':
            return '亏损'
          default:
            return '-'
        }
      },
      businessTime (strat, end) { // 营业时间
        if (strat && end) {
          return strat.substring(11, 16) + '  -  ' + end.substring(11, 16)
        } else {
          return '-'
        }
      },
      brandStatusText (str) { // 状态
        if (str) {
          for (var i = 0; i < this.statusArr.length; i++) {
            if (str === this.statusArr[i].value) {
              return this.statusArr[i].label
            }
          }
        } else {
          return '-'
        }
      },
      async detailsData (detID) { // 详情数据
        let result = await context.http.get('ywm/api/stores/' + detID)
        this.addParm = result.data
        for (var i in this.addParm) {
          if (!this.addParm[i]) {
            this.vivewData[i] = '-'
          } else {
            this.vivewData[i] = this.addParm[i]
          }
        }
        console.log(this.addParm, this.vivewData)
      },
      addShop (addParm) { // 新增
        this.$refs[addParm].validate((valid) => {
          if (valid) {
            if (this.addParm.businessStartTime && this.addParm.businessEndTime) {
              this.addParm.businessStartTime = '2019-04-01' + 'T' + this.addParm.businessStartTime + ':00.000Z'
              this.addParm.businessEndTime = '2019-04-01' + 'T' + this.addParm.businessEndTime + ':00.000Z'
            } else {
              this.addParm.businessStartTime = null
              this.addParm.businessEndTime = null
            }
            // this.addParm.brand.id = this.$route.params.id
            console.log(this.addParm)
            context.http.post('ywm/api/stores', this.addParm).then(res => {
              if (res) {
                this.$message({
                  message: '新增记录成功！',
                  type: 'success'
                })

                this.$router.push({name: 'shopInfo', params: this.$route.params})
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      editSubmitFn (addParm) { // 保存
        console.log('保存')
        console.log(this.addParm)
        this.$refs[addParm].validate((valid) => {
          if (valid) {
            let self = this
            this.addParm.businessStartTime = '2019-04-01' + 'T' + this.addParm.businessStartTime + ':00.000Z'
            this.addParm.businessEndTime = '2019-04-01' + 'T' + this.addParm.businessEndTime + ':00.000Z'
            console.log(this.addParm)
            this.addParm.brand = {}
            // delete this.addParm.version
            // delete this.addParm.brand
            this.addParm.brand.id = this.$route.params.id
            context.http.put('ywm/api/stores', this.addParm).then(res => {
              if (res) {
                this.$message({
                  message: '保存成功！',
                  type: 'success'
                })
                this.$router.push({name: 'shopInfo', params: this.$route.params})
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      editBtnFn () {
        this.edit = !this.edit
        if (this.edit) {
          this.addParm.businessStartTime = this.addParm.businessStartTime ? this.addParm.businessStartTime.substring(11, 16) : ''
          this.addParm.businessEndTime = this.addParm.businessEndTime ? this.addParm.businessEndTime.substring(11, 16) : ''
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
              this.addParm.storeImageLogo = path
            }
          }).catch(error => {
            console.info(error)
          })
        }
      },
      deleteFn (index, row) {
  
      },
      pgSizeSelectFn () { // 切换显示条数
        this.currentPage = 1
        // this.getDataList()
      },
      current_change (currentPage) { // 切换页码
        this.currentPage = currentPage
        // this.getDataList()
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
  .pageHeader{
    padding: 15px 30px;
    height: 110px;
    border-bottom: 1px solid #eee;
    background-color: #fff;
    .logoImg {
      height: 80px;
      width: 80px;
    }
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
  }
  .item2{
    height: 80px;
    line-height: 80px;
    display: flex;
    align-items:center;
    p{
      // width: 150px;
      text-align: center
    }
    .el-input__inner{
      width: 150px;
      text-align: center
    }
  }
  .basicInfo{
    margin-top: 20px;
    background-color: #fff;
    .title{
      font-size: 18px;
      height: 50px;
      line-height: 50px;
      margin-bottom: 15px;
      border-bottom: 1px solid #eeeeee;
      padding-left: 15px;
    }
    .content{
      padding-left: 30px;
      padding-bottom: 120px;
      .felx{
        display: flex;
      }
      .item{
        display: flex;
        margin-right: 50px;
        p{
          text-align: center;
          margin-right:20px; 
          height: 40px;
          line-height: 40px;
        }
      }
    }
}
.red{
    color: rgb(255, 0, 0);
    padding: 0 5px 0 0;
    font-size: 14px;
}
.w150{
  width: 150px;
}
.w300{
    width: 300px;
}
.buttonDiv{
  display: flex;
  justify-content:center
}
</style>
