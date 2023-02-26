<template>
  <div>
    <div class="dl-head info_tab">
      <ul class="nav">
        <li @click="changeNav(index)"
            v-for="(item, index) in navList"
            :key="index"
            :class="item.value ? 'select_active' : ''">{{item.label}}</li>
      </ul>
    </div>
    <div>
      <el-form v-if="step1" 
                    :model="cardsData"
                    ref="cardsData"
                    :rules="addDataRules">
        <div class="card-serial clearfix" v-for="(item, index) in cardsData.cards" :key="index">
          <div class="serial-head">会员卡信息
            <span class="float-right" @click="addCards(cardsData.cards.length + 1)" v-if="index === 0 && !readOnly && cardsData.cards.length< 10"><i class="iconfont icon-add"></i></span>
            <span class="float-right" @click="delCards(index)" v-if="index !== 0 && index === cardsData.cards.length - 1 && index > dataLength - 1"><i class="iconfont icon-reduce"></i></span>
          </div>
          <el-form-item :label-width="formLabelWidth"
                        :prop="'cards.' + index + '.name'"
                        :rules="addDataRules.name"
                        style="margin-bottom: 20px;margin-left: 10px;vertical-align: top;">
            <div class="cttitle">会员卡名称<i class="required">*</i></div>
            <span v-if="readOnly">{{item.name}}</span>
            <el-input v-model="item.name" v-else
                      maxlength="20"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" style="margin-left: 10px;vertical-align: top;">
            <div class="cttitle">会员卡等级<i class="required">*</i></div>
            <span v-if="readOnly">{{item.memberCardLevelName}}</span>              
            <el-select v-model="item.memberCardLevel" v-else
                      disabled="disabled"
                      placeholder="请选择">
              <el-option v-for="item in levelOptions"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :prop="'cards.' + index + '.imageUrl'" 
                        :rules="addDataRules.imageUrl"
                        :label-width="formLabelWidth"
                        style="margin-left: 10px;margin-right: 0;display: inline-block;width: 200px">
            <div class="cttitle">会员卡图片<i class="required">*</i></div>
            <div class="buildingImg">
              <div style="position: relative;" v-if="item.imageUrl">
                <img :src="item.imageUrl">
                <i class="iconfont icon-jinakangbaoicons18" @click="deleteImg(index)" v-if="!readOnly"></i>
              </div>
              <div style="margin-top: 25px;" v-if="!item.imageUrl">
                <p>
                  <i class="iconfont icon-shangchuantupianicon"></i>
                </p>
                <span>上传图片</span>
                <input type="file"
                  @change="imageChange($event, index)"
                  accept="image/png, image/jpeg">
              </div>
            </div>
          </el-form-item>
        </div>
        <el-form-item :label-width="formLabelWidth"
                      :prop="cardsData.useStatus"
                      style="margin-bottom: 20px;vertical-align: top;margin-left: 0">
          <div class="cttitle">状态<i class="required">*</i></div>
          <span v-if="readOnly">{{cardsData.useStatusName}}</span>
          <el-select v-model="cardsData.useStatus" v-else
                    placeholder="请选择">
            <el-option v-for="item in statusOptions"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div v-else>
        <el-form>
            <div class="dc-right_div">
              <el-form-item :label-width="formLabelWidth" style="margin-left: 0">
                <div class="cttitle">升级因素<i class="required">*</i></div>
                <span v-if="readOnly">{{cardsData.factorType === 'AMOUNT' ? '累计消费金额' : '累计积分'}}</span>
                <el-select v-model="cardsData.factorType" v-else
                          placeholder="请选择">
                  <el-option v-for="item in upgradeOptions"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <div class="floorwrap">
                <div class="card-serial" v-for="(item, index) in liftings" :key="index">
                  <div class="serial-head">{{cardsData.cards[index + 1].name}}
                    <span class="float-right xiala" @click="itemShow(item)">
                      <i class="iconfont " :class="{'icon-right': !item.show, 'icon-xiala-': item.show}" style="top: 0;"></i>
                    </span>
                  </div>
                  <div v-if="item.show">
                    <div style="padding-left: 10px;margin-bottom: 10px;">
                      <span class="vertical"></span>
                      <span>会员卡升级设置</span>
                    </div>
                    <div v-for="(item2, index2) in item.upgradeArr" :key="index2">
                      <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;margin-left: 10px;margin-right: 0;vertical-align: top;">
                      <div class="cttitle">目标会员卡</div>
                      <span v-if="readOnly">{{cardsData.cards[index + 1].name}}</span>
                      <el-input v-model="cardsData.cards[index + 1].name" v-else
                                disabled="disabled"
                                placeholder="请输入内容"></el-input>
                      </el-form-item>
                      <el-form-item :label-width="formLabelWidth"
                                    style="margin-bottom: 20px;margin-left: 10px;margin-right: 0;vertical-align: top;">
                        <div class="cttitle">累计时间段</div>
                        <span v-if="readOnly">{{item2.riseTimeSlotName}}</span>
                        <el-select v-model="item2.riseTimeSlot" v-else  @change="forceUpdate()"
                                  placeholder="累计时间段">
                          <el-option v-for="item3 in timeSlotOptions"
                                    :key="item3.value"
                                    :label="item3.name"
                                    :value="item3.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item :label-width="formLabelWidth"
                                    style="margin-bottom: 20px;margin-left: 10px;margin-right: 0;vertical-align: top;">
                        <div class="cttitle">
                          <span v-if="cardsData.factorType === 'AMOUNT'">累计消费金额(元)</span>
                          <span v-else>累计积分</span>
                        </div>
                        <span v-if="readOnly">{{item2.condition}}</span>
                        <el-input v-model="item2.condition" v-else  @input="forceUpdate()"
                                  style="width: 170px"
                                  placeholder="请输入内容"></el-input>
                        <span class="addor" @click="addUpgrade(item, cardsData.cards[index + 1], index)" v-if="index2 === 0 && !readOnly && item.upgradeArr.length < 2">
                          <i class="iconfont icon-add"></i>
                        </span>
                      </el-form-item>
                      <span class="perhaps" v-if="index2 === 0 && item.upgradeArr.length > 1">或</span>
                    </div>
                    <!-- 降级设置 -->
                    <div style="padding-left: 10px;margin-bottom: 10px">
                      <span class="vertical"></span>
                      <span>会员卡降级设置</span>
                    </div>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;margin-left: 10px;margin-right: 0;vertical-align: top;">
                      <div class="cttitle">会员卡</div>
                      <span v-if="readOnly">{{cardsData.cards[index + 1].name}}</span>
                      <el-input v-model="cardsData.cards[index + 1].name" v-else
                                disabled="disabled"
                                placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;margin-left: 10px;margin-right: 0;vertical-align: top;">
                      <div class="cttitle">降级至</div>
                      <span v-if="readOnly">{{cardsData.cards[index].name}}</span>
                      <el-input v-model="cardsData.cards[index].name" v-else
                                disabled="disabled"
                                placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;margin-left: 10px;margin-right: 0;vertical-align: top;">
                      <div class="cttitle">累计时间段</div>
                      <span v-if="readOnly">{{ item.length > 2 ? item[2].riseTimeSlotName : item[1].riseTimeSlotName }}</span>
                      <el-select v-model="item[1].riseTimeSlot" v-if="!readOnly && item.length === 2 "
                                placeholder="累计时间段">
                        <el-option v-for="item in timeSlotOptions2"
                                  :key="item.value"
                                  :label="item.name"
                                  :value="item.value">
                        </el-option>
                      </el-select>
                      <el-select v-model="item[2].riseTimeSlot" v-if="!readOnly && item.length > 2"
                                placeholder="累计时间段">
                        <el-option v-for="item in timeSlotOptions2"
                                  :key="item.value"
                                  :label="item.name"
                                  :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth"
                                  style="margin-bottom: 20px;margin-left: 10px;margin-right: 0;vertical-align: top;">
                      <div class="cttitle">
                        <span v-if="cardsData.factorType === 'AMOUNT'">累计消费金额未达到(元)</span>
                        <span v-else>累计积分未达到</span>
                      </div>
                      <span v-if="readOnly">{{item.length > 2 ? item[2].condition : item[1].condition}}</span>
                      <el-input v-model="item[1].condition" v-if="!readOnly && item.length === 2"
                                maxlength="50"
                                placeholder="请输入内容"></el-input>
                    <el-input v-model="item[2].condition" v-if="!readOnly && item.length > 2"
                                maxlength="50"
                                placeholder="请输入内容"></el-input>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
          </el-form>
      </div>
    </div>

  </div>
</template>
<script>
import context from '@/service'
export default {
  name: 'detail',
  props: {
    cardsData: {
      type: Object
    }
  },
  data () {
    return {
      useStatus: '',
      navList: [{
        label: '会员卡信息',
        value: true
      }, {
        label: '升降级设置',
        value: false
      }],
      formLabelWidth: '220',
      addDataRules: {
        name: [
          { required: true, message: '请输入会员卡名称', trigger: 'blur' }
        ],
        imageUrl: [
          { required: true, message: '请上传会员卡图片', trigger: 'change' }
        ],
        useStatus: [
          { required: false, message: '请选择会员卡状态', trigger: 'change' }
        ]
      },
      levelOptions: [
        { name: '1', value: 'One' },
        { name: '2', value: 'Two' },
        { name: '3', value: 'Three' },
        { name: '4', value: 'Four' },
        { name: '5', value: 'Five' },
        { name: '6', value: 'Six' },
        { name: '7', value: 'Seven' },
        { name: '8', value: 'Eight' },
        { name: '9', value: 'Nine' },
        { name: '10', value: 'Ten' }
      ],
      timeSlotOptions: [
        { name: '当日', value: 'Now' },
        { name: '1个月', value: 'One' },
        { name: '2个月', value: 'Two' },
        { name: '3个月', value: 'Three' },
        { name: '4个月', value: 'Four' },
        { name: '5个月', value: 'Five' },
        { name: '6个月', value: 'Six' },
        { name: '7个月', value: 'Seven' },
        { name: '8个月', value: 'Eight' },
        { name: '9个月', value: 'Nine' },
        { name: '10个月', value: 'Ten' },
        { name: '11个月', value: 'Eleven' },
        { name: '1年', value: 'Twelve' },
        { name: '2年', value: 'TwentyFour' }
      ],
      timeSlotOptions2: [
        { name: '1个月', value: 'One' },
        { name: '2个月', value: 'Two' },
        { name: '3个月', value: 'Three' },
        { name: '4个月', value: 'Four' },
        { name: '5个月', value: 'Five' },
        { name: '6个月', value: 'Six' },
        { name: '7个月', value: 'Seven' },
        { name: '8个月', value: 'Eight' },
        { name: '9个月', value: 'Nine' },
        { name: '10个月', value: 'Ten' },
        { name: '11个月', value: 'Eleven' },
        { name: '1年', value: 'Twelve' },
        { name: '2年', value: 'TwentyFour' }
      ],
      statusOptions: [
        { name: '使用中', value: 'USING' },
        { name: '已停用', value: 'DISABLE' }
      ],
      upgradeOptions: [
        { name: '累计消费金额', value: 'AMOUNT' },
        { name: '累计积分', value: 'INTEGRAL' }
      ],
      step1: true,
      readOnly: true,
      liftings: []
    }
  },
  created () {
    this.dataLength = this.cardsData.cards.length
    let arr = this.cardsData.liftings
    let liftings1 = JSON.parse(JSON.stringify(arr))
    for (let i = 0; i < liftings1.length; i++) {
      liftings1[i].show = true
      if (liftings1[i].length > 2) {
        liftings1[i].upgradeArr = [liftings1[i][0], liftings1[i][1]]
      } else {
        liftings1[i].upgradeArr = [liftings1[i][0]]
      }
    }
    this.liftings = liftings1
  },
  methods: {
    changeNav (inx) {
      if (!this.readOnly) return
      this.changeNav2(inx)
    },
    changeNav2 (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[inx].value = true
      if (inx === 0) {
        this.step1 = true
      } else if (inx === 1) {
        this.step1 = false
      }
      this.$emit('changeStep', inx)
    },
    itemShow (item) {
      item.show = !item.show
      this.$forceUpdate()
    },
    onEdit () {
      this.readOnly = false
    },
    onClose () {
      this.readOnly = true
    },
    deleteImg (index) {
      this.cardsData.cards[index].imageUrl = ''
    },
    addCards (index) {
      if (this.cardsData.cards.length === 10) {
        return
      }
      let memberCardLevel = ''
      switch (index) {
        case 1:
          memberCardLevel = 'One'
          break
        case 2:
          memberCardLevel = 'Two'
          break
        case 3:
          memberCardLevel = 'Three'
          break
        case 4:
          memberCardLevel = 'Four'
          break
        case 5:
          memberCardLevel = 'Five'
          break
        case 6:
          memberCardLevel = 'Six'
          break
        case 7:
          memberCardLevel = 'Seven'
          break
        case 8:
          memberCardLevel = 'Eight'
          break
        case 9:
          memberCardLevel = 'Nine'
          break
        case 10:
          memberCardLevel = 'Ten'
          break
        default:
          break
      }
      this.cardsData.cards.push({
        'name': '',
        'imageUrl': null,
        'memberCardLevel': memberCardLevel,
        'useStatus': 'USING'
      })
      this.liftings.push([
        {
          'liftingType': 'RISE',
          'riseTimeSlot': '',
          'condition': ''
        }, {
          'liftingType': 'DROP',
          'riseTimeSlot': '',
          'condition': ''
        }
      ])

      let liftings1 = this.liftings
      for (let i = 0; i < liftings1.length; i++) {
        if (i === liftings1.length - 1) {
          liftings1[i].show = true
          liftings1[i].upgradeArr = [{
            'liftingType': 'RISE',
            'riseTimeSlot': '',
            'condition': ''
          }]
        }
      }
      console.log(this.liftings)
    },
    delCards () {
      this.cardsData.cards.pop()
      this.liftings.pop()
    },
    async imageChange (event, index) {
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
          if (res.status === 201) {
            path = res.data
            this.cardsData.cards[index].imageUrl = path
          }
        }).catch(error => {
          console.info(error)
        })
      }
    },
    nextStep () {
      this.$refs['cardsData'].validate((valid) => {
        if (valid) {
          this.changeNav2(1)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    previousStep () {
      this.changeNav2(0)
    },
    addUpgrade (item2, item, index) {
      item2.upgradeArr.push({
        'name': item.name,
        'liftingType': 'RISE',
        'riseTimeSlot': '',
        'condition': ''
      })
      this.$forceUpdate()
    },
    forceUpdate () {
      this.$forceUpdate()
    },
    saveEdit () {
      let liftings = []
      this.liftings.forEach(ele => {
        if (ele.upgradeArr.length === 1) {
          liftings.push([ele.upgradeArr[0], ele[1]])
        } else {
          liftings.push([ele.upgradeArr[0], ele.upgradeArr[1], ele[ele.length - 1]])
        }
      })
      this.cardsData.liftings = liftings
      let flag = true
      liftings.forEach(ele => {
        ele.forEach(ele2 => {
          if (!ele2.riseTimeSlot || !ele2.condition) {
            this.$message.error('请填写完整信息')
            flag = false
            return
          }
        })
      })
      if (flag) {
        context.http.put('crm/api/memberCards', this.cardsData).then(res => {
          if (res.status === 200) {
            this.$emit('onHide')
            this.$emit('query')
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .dl-head {
    margin-bottom: 20px!important;
  }
  .info_tab {
    height: 48px;
    display: -ms-flexbox;
    display: flex;
    background-color: #fff;
    box-shadow: 1px 2px 5px #eee;
    border-radius: 3px;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -ms-flex-align: center;
    align-items: center;
    padding-right: 44px;
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
  .card-serial{
    border:1px solid rgba(235,235,235,1);
    font-size: 14px;
    margin-bottom: 10px;
    .serial-head{
      font-size: 14px;
      padding: 10px 14px;
      margin-bottom: 10px;
      background:rgba(250,250,250,1);
      > span {
        display: inline-block;
        width: 16px;
        height: 16px;
        line-height: 16px;
        border: 1px solid #3575F6;
        border-radius: 2px;
        text-align: center;
        cursor: pointer;
        i {
          color: #3575F6;
          position: relative;
          right: 1px;
        }
      }
    }
  }
  .el-form-item {
    display: inline-block;
    width: 31%;
    margin-left: 16px;
  }
  .buildingImg{
    width: 160px;
    height: 100px;
    text-align: center;
    border: 1px dashed #dfdfdf;
    cursor: pointer;
    position: relative;
    > div{
      width: 160px;
      height: 100px;
    }
    span{
      color: #3577f6;
    }
    img{
      width: 100%;
      height: 100%;
    }
    input {
      position: absolute;
      top: 0;
      right: 0;
      width: 160px;
      height: 140px;
      opacity: 0;
      cursor: pointer;
    }
    .icon-adds{
      background: url(../../../../assets/plus.png) no-repeat;
      background-size: contain;
      margin-bottom: 6px;
    }
    i {
      color: #0076da;
      font-size: 24px;
    }
    .icon-jinakangbaoicons18 {
      position: absolute;
      top: -8px;
      right: -8px;
      cursor: pointer;
      color: #105cee;
      z-index: 999;
    }
  }
  .cttitle{
    font-size: 12px;
  }
  .cttitle +span {
    font-size: 12px;
  }
  .dc-right_div {
    margin-top: 20px;
    font-size: 12px;
    .cttitle span:nth-of-type(2) {
      color: #0f75ff;
      font-size: 12px;
      float: right;
      cursor: pointer;
    }
    .psotmaster span {
      color: #666 !important;
    }
    .addbdbtn{
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
    .underline{
      border-bottom: 1px solid #e5e5e5;
    }
    .floorwrap{
      font-size: 14px;
      .xiala{
        width: 16px;
        border: none;
      }
      .vertical{
        display: inline-block;
        width: 4px;
        height: 16px;
        vertical-align: text-bottom;
        background:rgba(53,119,246,1);
      }
    }
    .fw-content{
      height: 40px;
      margin-bottom: 16px;
      .el-input{
        width: 60%;
      }
      i{
        display: inline-block;
      }
      .fa-move{
        background: url(../../../../assets/move.png) no-repeat;
        background-size: contain;
        cursor: pointer;
      }
      .fa-delete{
        background: url(../../../../assets/delete.png) no-repeat;
        background-size: contain;
      }
    }
    .fw-head{
      margin: 20px 0;
    }
    .addor{
      display: inline-block;
      width: 16px;
      height: 16px;
      line-height: 16px;
      border: 1px solid #3575F6;
      border-radius: 2px;
      text-align: center;
      cursor: pointer;
      margin-left: 4px;
      i {
        color: #3575F6;
        position: relative;
        right: 1px;
      }
    }
    .perhaps{
      width:20px;
      height:20px;
      background:rgba(53,117,246,1);
      opacity:0.5;
      border-radius:1px;
      margin-left: 15px;
      margin-bottom: 20px;
      display: inline-block;
      color: #fff;
      text-align: center;
    }
  }
</style>
