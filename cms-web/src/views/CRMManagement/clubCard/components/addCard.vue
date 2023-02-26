<template>
  <div class="add-cards">
     <div class="dl-head">
        <span class="step"
              :class="{stepActive: newlystep1, stepActivePast: newlystep2}"><span style="font-size: 20px;">1</span>. 基本信息</span>
        <span class="step"
              :class="{stepActive: newlystep2}"><span style="font-size: 20px;">2</span>. 设置升降级</span>
      </div>
      <div class="dl-content clearfix">
        <div class="step1"
             v-show="newlystep1">
          <div class="dc-right">
            <el-form :model="addData"
                     ref="addData"
                     :rules="addDataRules">
              <div class="card-serial clearfix" v-for="(item, index) in addData.cards" :key="index">
                <div class="serial-head">序号{{index + 1}} 
                  <span class="float-right" @click="addCards(addData.cards.length + 1)" v-if="index === 0 && addData.cards.length < 10"><i class="iconfont icon-add"></i></span>
                  <span class="float-right" @click="delCards(index)" v-if="index !== 0 && index === addData.cards.length - 1"><i class="iconfont icon-reduce"></i></span>
                </div>
                <el-form-item :label-width="formLabelWidth"
                              :prop="'cards.' + index + '.name'"
                              :rules="addDataRules.name"
                              style="margin-bottom: 20px;margin-left: 14px;vertical-align: top;">
                  <div class="cttitle">会员卡名称<i class="required">*</i></div>
                  <el-input v-model="item.name"
                            maxlength="20"
                            placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" style="margin-left: 10px;vertical-align: top;">
                  <div class="cttitle">会员卡等级<i class="required">*</i></div>              
                  <el-select v-model="item.memberCardLevel"
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
                              style="margin-left: 30px;margin-right: 0;display: inline-block;width: 200px">
                  <div class="cttitle">会员卡图片<i class="required">*</i></div>
                  <div class="buildingImg">
                    <img :src="item.imageUrl" v-if="item.imageUrl">
                    <div style="margin-top: 40px;" v-else>
                      <p>
                        <i class="iconfont icon-shangchuantupianicon"></i>
                      </p>
                      <span>上传图片</span>
                    </div>
                    <input type="file"
                        @change="imageChange($event, index)"
                        accept="image/png, image/jpeg">
                  </div>
                </el-form-item>
              </div>
              <!-- <el-form-item :label-width="formLabelWidth"
                              style="margin-bottom: 20px;vertical-align: top;margin-left: 0">
                  <div class="cttitle">状态<i class="required">*</i></div>
                  <el-select v-model="addData.useStatus"
                            placeholder="请选择">
                    <el-option v-for="item in statusOptions"
                              :key="item.value"
                              :label="item.name"
                              :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item> -->
            </el-form>
          </div>
        </div>
        <div class="step2"
             v-show="newlystep2">
          <div class="dc-right">
            <el-form>
              <div class="dc-right_div">
                <el-form-item :label-width="formLabelWidth" style="margin-left: 0">
                  <div class="cttitle">升级因素<i class="required">*</i></div>
                  <el-select v-model="addData.factorType"
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
                    <div class="serial-head">{{item.name}}
                      <span class="float-right xiala" @click="item[0].show = !item[0].show">
                        <i class="iconfont " :class="{'icon-right': !item[0].show, 'icon-xiala-': item[0].show}" style="top: -4px;"></i>
                      </span>
                    </div>
                    <div v-if="item[0].show">
                      <div style="padding-left: 14px;margin-bottom: 10px;">
                        <span class="vertical"></span>
                        <span>会员卡升级设置</span>
                      </div>
                      <div v-for="(item2, index2) in item.upgradeArr" :key="index2">
                        <el-form-item :label-width="formLabelWidth"
                                      style="margin-bottom: 20px;margin-left: 14px;margin-right: 0;vertical-align: top;">
                          <div class="cttitle">目标会员卡</div>
                          <el-input v-model="item2.name"
                                    disabled="disabled"
                                    placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item :label-width="formLabelWidth"
                                      style="margin-bottom: 20px;margin-left: 10px;margin-right: 0;vertical-align: top;">
                          <div class="cttitle">累计时间段</div>
                          <el-select v-model="item2.riseTimeSlot" @change="forceUpdate()"
                                    placeholder="累计时间段">
                            <el-option v-for="item3 in timeSlotOptions"
                                      :key="item3.value"
                                      :label="item3.name"
                                      :value="item3.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item :label-width="formLabelWidth"
                                      style="margin-bottom: 20px;margin-left: 10px;margin-right: 0;vertical-align: top;width: 265px">
                          <div class="cttitle">
                            <span v-if="addData.factorType === 'AMOUNT'">累计消费金额(元)</span>
                            <span v-else>累积积分</span>
                          </div>
                          <el-input v-model="item2.condition" @input="forceUpdate()"
                                    style="width: 234px"
                                    placeholder="请输入内容"></el-input>
                          <span class="addor" @click="addUpgrade(item.upgradeArr, item, index)" v-if="index2 === 0 && item.upgradeArr.length < 2">
                            <i class="iconfont icon-add"></i>
                          </span>
                        </el-form-item>
                        <span class="perhaps" v-if="index2 === 0 && item.upgradeArr.length > 1">或</span>
                      </div>
                      <!-- 降级设置 -->
                      <div style="padding-left: 14px">
                        <span class="vertical"></span>
                        <span>会员卡降级设置</span>
                      </div>
                      <el-form-item :label-width="formLabelWidth" v-if="item[1] && item[1].name"
                                    style="margin-bottom: 20px;margin-left: 14px;margin-right: 0;vertical-align: top;">
                        <div class="cttitle">会员卡</div>
                        <el-input v-model="item[1].name"
                                  disabled="disabled"
                                  placeholder="请输入内容"></el-input>
                      </el-form-item>
                      <el-form-item :label-width="formLabelWidth"
                                    style="margin-bottom: 20px;margin-left: 14px;margin-right: 0;vertical-align: top;">
                        <div class="cttitle">降级至</div>
                        <el-input v-model="addData.cards[index].name"
                                  disabled="disabled"
                                  placeholder="请输入内容"></el-input>
                      </el-form-item>
                      <el-form-item :label-width="formLabelWidth"
                                    style="margin-bottom: 20px;margin-left: 10px;margin-right: 0;vertical-align: top;">
                        <div class="cttitle">累计时间段</div>
                        <el-select v-model="item[1].riseTimeSlot" style="width: 234px"
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
                          <span v-if="addData.factorType === 'AMOUNT'">累计消费金额未达到(元)</span>
                          <span v-else>累计积分未达到</span>
                        </div>
                        <el-input v-model="item[1].condition"
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
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogHide"
                   class="close-button"
                   v-if="newlystep1">关 闭</el-button>
        <el-button type="primary"
                   @click="newlystepNoe('addData')"
                   class="defaultbtn dialog-confirmBtn"
                   v-if="newlystep1">下一步</el-button>
        <el-button type="primary"
                   @click="previousStep"
                   class="close-button"
                   v-if="newlystep2">上一步</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   v-if="newlystep2"
                   @click="addStaff('addData2')">确 认</el-button>
      </div>
  </div>
</template>
<script>
import context from '@/service'
export default {
  name: 'addCard',
  components: {
  },
  props: {
    projectManagentId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      cascaderData: [],
      newlystep1: true,
      newlystep2: false,
      checkList: [''],
      checkAll: false,
      natureWorkOptions: [],
      areaOptions: [],
      addData: {
        cards: [
          {
            'name': '',
            'imageUrl': null,
            'memberCardLevel': 'One',
            'useStatus': 'USING'
          }
        ],
        useStatus: 'USING',
        factorType: 'AMOUNT',
        liftings: [{
          'name': '',
          'liftingType': 'RISE',
          'factorType': 'AMOUNT',
          'riseTimeSlot': 'One',
          'condition': 1000
        }]
      },
      startFloor: '',
      closingFloor: '',
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
      upgradeArr: [],
      liftings: [[{
        'name': '',
        'liftingType': '',
        'memberCardId': null,
        'factorType': '',
        'riseTimeSlot': '',
        'condition': null,
        upgradeArr: [{
          'name': '',
          'liftingType': '',
          'memberCardId': null,
          'factorType': '',
          'riseTimeSlot': '',
          'condition': null}]
      }, {
        'name': '',
        'liftingType': '',
        'memberCardId': null,
        'factorType': '',
        'riseTimeSlot': '',
        'condition': null
      }]]
    }
  },
  created () {
  },
  mounted () {
    this.$dragging.$on('dragged', ({ value }) => {
    })
  },
  methods: {
    dialogHide () {
      this.$emit('dialogHide')
      this.$emit('query')
    },
    addCards (index) {
      if (this.addData.cards.length === 10) {
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
      this.addData.cards.push({
        'name': '',
        'imageUrl': null,
        'memberCardLevel': memberCardLevel,
        'useStatus': 'USING'
      })
    },
    delCards () {
      this.addData.cards.pop()
    },
    addFloor () {
      if (!this.startFloor || !this.closingFloor) {
        return false
      }
      this.addData.floorDTOSet = []
      let addNumber = this.startFloor > 0 ? this.closingFloor - this.startFloor + 1 : this.closingFloor - this.startFloor + 1
      let cycles = this.startFloor
      addNumber = addNumber + Number(cycles)
      let sortNumber = 0
      for (let i = Number(cycles); i < addNumber; i++) {
        if (i !== 0) {
          this.addData.floorDTOSet.push(
            {
              name: i,
              sortNumber: sortNumber++
            }
          )
        }
      }
      this.addData.floorDTOSet.reverse()
    },
    addUpgrade (item2, item, index) {
      item2.push({
        'name': item[0].name,
        'liftingType': 'RISE',
        'riseTimeSlot': '',
        'condition': ''
      })
      this.$forceUpdate()
    },
    forceUpdate () {
      this.$forceUpdate()
    },
    reduce (index) {
      this.addData.floorDTOSet.splice(index, 1)
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
    handleItemChange (val) {
      this.getNodes(val)
    },
    addHandleItemChange () {
      this.addData.province = String(this.areaOptions[0])
      this.addData.city = String(this.areaOptions[1])
      this.addData.district = String(this.areaOptions[2])
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
            this.addData.cards[index].imageUrl = path
          }
        }).catch(error => {
          console.info(error)
        })
      }
    },
    newlystepNoe (formName) {
      if (!this.chooseObj) {
        this.errorProject = true
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let liftings = JSON.parse(JSON.stringify(this.addData.cards))
          liftings.shift()
          let arr = []
          let liftingType = ''
          liftings.forEach((ele, i) => {
            arr.push([{
              'name': ele.name,
              'liftingType': 'RISE',
              'riseTimeSlot': '',
              'condition': '',
              'show': true
            }, {
              'name': ele.name,
              'liftingType': 'DROP',
              'riseTimeSlot': '',
              'condition': ''
            }])
          })
          // this.liftings = arr
          let liftings1 = JSON.parse(JSON.stringify(arr))
          for (let i = 0; i < liftings1.length; i++) {
            liftings1[i].upgradeArr = [liftings1[i][0]]
          }
          this.liftings = liftings1
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
    async addStaff (formName) {
      let liftings = []
      this.liftings.forEach(ele => {
        if (ele.upgradeArr.length === 1) {
          liftings.push([ele.upgradeArr[0], ele[1]])
        } else {
          liftings.push([ele.upgradeArr[0], ele.upgradeArr[1], ele[2]])
        }
      })
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
        this.addData.liftings = liftings
        context.http.post('/crm/api/memberCards', this.addData).then(res => {
          if (res.data) {
            this.dialogHide()
            this.addData = {
              cards: [
                {
                  'name': '',
                  'imageUrl': null,
                  'memberCardLevel': 'One',
                  'useStatus': 'USING'
                }
              ],
              useStatus: 'USING',
              factorType: 'AMOUNT',
              liftings: [{
                'name': '',
                'liftingType': 'RISE',
                'factorType': 'AMOUNT',
                'riseTimeSlot': 'One',
                'condition': 1000
              }]
            }
            this.newlystep1 = true
            this.newlystep2 = false
          }
        })
      }
    },
    async natureWork () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=工作性质')
      this.natureWorkOptions = result.data
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config.scss";
.add-cards {
  font-size: 24px;
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
    margin-bottom: 14px;
    margin-right: 23px;
    &:nth-of-type(3n) {
      margin-right: 0;
    }
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
    left: -32px;
    position: relative;
    bottom: -66px;
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
    width: 900px !important;
    margin-top: 3vh !important;
  }
  .dl-head {
    display: flex;
    justify-content: space-start;
    margin-top: 20px;
  }
  .step {
    display: inline-block;
    width: 440px;
    height: 50px;
    line-height: 50px;
    padding-left: 14px;
    font-size: 16px;
    background-color: #f9f9f9;
    color: #777;
    border-radius: 6px;
    margin-right: 48px;
    &:last-child{
      margin-right: 0
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
  .el-form-item__content {
    .el-cascader {
      width: 100%;
    }
    span {
      color: #666;
    }
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
            background: url(../../../../assets/upload.png) no-repeat;
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
      margin-top: 20px;
      .dr-head {
        background-color: #fafafa;
        height: 40px;
        line-height: 40px;
        padding-left: 12px;
        font-size: 16px;
        margin-bottom: 24px;
      }
      .el-form-item {
        width: 31%;
        margin-left: 16px;
        &:nth-of-type(3n) {
          margin-right: 0;
        }
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
  .dialog-footer{
    border-top: 1px solid #e5e5e5;
    padding: 20px 0;
    text-align: right;
  }
  .buildingImg{
    // width: 140px;
    height: 140px;
    text-align: center;
    border: 1px dashed #dfdfdf;
    cursor: pointer;
    position: relative;
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
      width: 140px;
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
  }
  .basic-item{
    margin-bottom: 16px;
    p {
      font-size: 14px;
      margin-bottom: 6px;
    }
  }
  .basic-select{
    position: relative;
    cursor: pointer;
    .selectInput{
      height: 80px;
      border:1px solid #e7e7e7;
      border-radius:5px;
      padding:0 15px;
      &.selectActive{
        border:1px solid #6473cb;
      }
      img{
        float: left;
        display: block;
        width:150px;
        height:50px;
        margin-right:10px;
        margin-top:15px;
      }
      span{
        float: left;
        color:#666666;
        display: block;
        line-height: 80px;
        font-size: 14px;
        &:last-child{
          float: right;
          color: #6473cb;
        }
      }
    }
    .selectBox{
      width:100%;
      border:1px solid #e7e7e7;
      border-radius: 3px;
      background: #fff;
      position: absolute;
      left:0;
      top:86px;
      z-index: 9;
      padding:15px 0px;
      box-shadow: 1px 2px 5px #ddd;
      overflow-y: auto;
      li{
        border-bottom:1px solid #e7e7e7;
        padding:10px 15px;
        display: flex;
        &:hover{
          background: #eee;
        }
        img{
          display: block;
          width:50px;
          height:21.3px;
          margin-right:20px;
        }
        span{
          display: block;
          line-height: 20px;
          font-size: 14px;
        }
      }
    }
  }
  .card-serial{
    border:1px solid rgba(235,235,235,1);
    font-size: 14px;
    margin-bottom: 10px;
    .serial-head{
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
