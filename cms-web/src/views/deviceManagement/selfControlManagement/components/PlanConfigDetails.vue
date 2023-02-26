<template>
  <div class="PlanConfigDetails">
    <drawer class="drawer_new"
            :show="detailsdrawershow"
            :showEditBtn="readOnly && hasAuthority('03080118')"
            @on-edit="onEdit"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="details_content drawer-body"
           slot="drawer">
        <div class="main_content"
             style="height:100%;padding:0;background-color: #F7F7F7;">
          <el-form :model="draweDetaileData"
                   ref="draweDetaileData"
                   :rules="addDataRules">
            <div class="basInfo">
              <div class="half_page_title"
                   style="width:100%">
                <div><i></i>
                  基本信息
                </div>
              </div>
              <div class="content">
                <div class="form">
                  <el-form-item prop="projectManagementId">
                    <span>项目简称<i class="required">*</i></span>
                    <p v-if="readOnly">{{draweDetaileData.projectManagementName}}</p>
                    <el-select v-else
                               v-model="draweDetaileData.projectManagementId"
                               disabled
                               style="width:320px"
                               size="small"
                               placeholder="请选择">
                      <el-option v-for="item in projectManagementsList"
                                 :key="item.id"
                                 :label="item.referred"
                                 :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="name">
                    <span>计划名称<i class="required">*</i></span>
                    <p v-if="readOnly">{{draweDetaileData.name}}</p>
                    <el-input v-else
                              v-model="draweDetaileData.name"
                              style="width:320px"
                              size="small"
                              maxlength="50"></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>
            <div class="basInfo"
                 style="margin-top:15px">
              <div class="half_page_title"
                   style="width:100%">
                <div><i></i>
                  日期选择
                  <span style="color:#ED0000;font-size: 12px;">提示:日期选择建议覆盖一整年，未覆盖日期系统回路默认为关闭状态</span>
                </div>
                <div class="addBtn"
                     v-if="!readOnly"
                     @click="addItem"><span class="iconfont icon-crm_xinzeng-"></span><span class="btn">添加日期</span></div>
              </div>
              <div class="planList">
                <div class="head">
                  <span>日期选择</span>
                  <span>开启时间段</span>
                </div>
                <span v-for="(item,index) in draweDetaileData.dates"
                      :key="index">
                  <div class="list"
                       v-if="readOnly">
                    <div>{{item.startDate}} ~ {{item.endDate}}</div>
                    <div>
                      <span v-for="(itm,idx) in item.times"
                            :key="idx">{{itm.startTime}} 至 {{itm.endTime}}</span>
                    </div>
                  </div>
                  <div class="item"
                       v-else
                       :class="{'error':index===errIndex}">
                    <div>
                      <!-- <p>日期选择<span class="required">*</span></p> -->
                      <el-date-picker style="width:220px"
                                      size="small"
                                      v-model="item.dateArr"
                                      type="daterange"
                                      :editable="false"
                                      format="MM-dd"
                                      value-format="timestamp"
                                      :picker-options="pickerOptions"
                                      range-separator="至"
                                      start-placeholder="开始日期"
                                      end-placeholder="结束日期"
                                      v-if="show"
                                      @change="(value) => dateChange(value,index)">
                      </el-date-picker>
                    </div>
                    <div>
                      <!-- <p>开启时间段<span class="required">*</span></p> -->
                      <div class="timeArr">
                        <el-button class="time_export"
                                   type="primary"
                                   size="mini">+
                          <el-time-picker is-range
                                          v-model="timeArr"
                                          range-separator="至"
                                          format="HH:mm"
                                          value-format="HH:mm"
                                          @change="(value) => timeChange(value,index)">
                          </el-time-picker>
                        </el-button>
                        <div class="timeItemContent">
                          <div class="timeItem"
                               v-for="(itm,idx) in item.times"
                               :key="idx">
                            <span>{{itm.startTime}}- {{itm.endTime}}</span>
                            <i class="iconfont icon-cms_cuowu"
                               @click="deltimeItem(index,idx)"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="del icon-shanchu- iconfont"
                         @click="delItem(index)"></div>
                  </div>
                </span>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <div slot="footer"
           v-if="!readOnly"
           class="dialog-footer">
        <span @click="cannelFn"
              class="details_cannelBtn"
              style="background:none">取消</span>
        <span class="saveSubmit"
              @click="addFrom()">保存</span>
      </div>
    </drawer>
  </div>
</template>

<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import moment from 'moment'
import axios from 'axios'
import * as JSOG from 'jsog'
export default {
  name: 'TenantGoods',
  components: {
    Drawer
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    draweDetaileDataProps: {
      type: Object,
      default: {

      }
    }
  },
  created () {
  },
  watch: {
    detailsdrawershow: {
      handler (newValue, oldValue) {
        if (newValue) {
          this.projectManagementsList = this.$store.state.projectManagementsList
          // this.draweDetaileData = JSON.parse(JSON.stringify(this.draweDetaileDataProps))
          this.draweDetaileData = this.deepCopy(this.draweDetaileDataProps)
          // console.log(this.draweDetaileData)
        }
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      show: true,
      draweDetaileData: {},
      deleteDialog: false,
      errIndex: null,
      timeArr: [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)],
      readOnly: true,
      drawerTitle: '计划详情',
      projectManagementsList: [],
      addDataRules: {
        projectManagementId: [
          { required: true, message: '请选择项目简称', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入计划名称', trigger: 'blue' }
        ]
      },
      pickerOptions: {
        disabledDate: time => {
          let start = moment().startOf('year').valueOf()
          let end = moment().endOf('year').valueOf()
          return time.getTime() < start || time.getTime() > end
        }
      }
    }
  },
  mounted () {

  },
  methods: {
    timeChange (value, index) {
      if (value) {
        this.draweDetaileData.dates[index].times.push({ startTime: value[0], endTime: value[1] })
        this.$nextTick(() => {
          this.timeArr = [new Date(2016, 9, 10, 0, 0), new Date(2016, 9, 10, 23, 59)]
        })
      }
    },
    deepCopy (obj) {
      var result = Array.isArray(obj) ? [] : {}
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object') {
            result[key] = this.deepCopy(obj[key])
          } else {
            result[key] = obj[key]
          }
        }
      }
      return result
    },
    dateChange (value, index) {
      this.show = true
      // console.log(this.draweDetaileData.dates)
    },
    dataTest () { // 日期校验重复
      this.flag = false
      try {
        let datas = this.draweDetaileData.dates
        let startArr = []
        let endArr = []
        let result = 0
        datas.forEach((item, index) => {
          item.idnx = index
          item.startDate = item.dateArr[0]
          item.endDate = item.dateArr[1]
          item.times.forEach((itm, idx) => {
            itm.startTime = moment(moment().startOf('year').format('YYYY-MM-DD') + ' ' + itm.startTime + ':00').valueOf()
            itm.endTime = moment(moment().startOf('year').format('YYYY-MM-DD') + ' ' + itm.endTime + ':00').valueOf()
          })
          item.times.sort(function (a, b) {
            return a.startTime - b.startTime
          })
          for (let i = 1; i < item.times.length; i++) {
            if (item.times[i].startTime <= item.times[i - 1].endTime) {
              this.errIndex = index
              result += 1
              break
            }
          }
          item.times.forEach((itm, idx) => {
            itm.startTime = moment(itm.startTime).format('HH:mm')
            itm.endTime = moment(itm.endTime).format('HH:mm')
          })
          if (result) {
            this.flag = true
            throw new Error('LoopTerminates')
          }
        })
        datas.sort(function (a, b) {
          return a.startDate - b.startDate
        })
        for (let k = 1; k < datas.length; k++) {
          if (datas[k].startDate <= datas[k - 1].endDate) {
            this.errIndex = datas[k].idnx
            result += 1
          }
        }
        // console.log(datas, this.errIndex)
        return result > 0
      } catch (e) {
        if (e.message !== 'LoopTerminates') throw e
      }
    },
    addFrom () {
      this.$refs['draweDetaileData'].validate((valid) => {
        if (valid) {
          let mark = false
          if (!this.draweDetaileData.dates.length) {
            this.$message.error('日期选择 、开启时间段不能为空')
            return
          }
          this.draweDetaileData.dates.forEach((item, index) => { // 判断 日期选择 、开启时间段不能为空
            if (item.dateArr.length === 0 || item.times.length === 0) {
              mark = true
            }
          })
          if (mark) {
            this.$message.error(' 日期选择 、开启时间段不能为空')
            return
          }
          if (this.dataTest() || this.flag) {
            this.$message.error('所选时间有重叠，请重新选择')
            return
          }
          this.errIndex = null
          this.draweDetaileData.dates.forEach((item, index) => {
            item.startDate = moment(item.startDate).format('MM-DD')
            item.endDate = moment(item.endDate).format('MM-DD')
            // delete item.dateArr
          })
          delete this.draweDetaileData.groupId
          delete this.draweDetaileData.groupName
          delete this.draweDetaileData.remark
          // console.log(this.draweDetaileData)
          context.http.put(`rms/api/lightingPlan`, this.draweDetaileData).then(res => {
            if (res) {
              this.readOnly = true
              this.$message.success('保存成功')
              // this.onHide()
              this.$emit('saveSuccess')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addItem () {
      let item = {
        endDate: '',
        dateArr: [],
        startDate: '',
        times: []
      }
      this.draweDetaileData.dates.push(item)
      console.log(this.draweDetaileData.dates)
    },
    delItem (index) {
      if (this.draweDetaileData.dates.length === 1) {
        let item = {
          endDate: '',
          dateArr: [],
          startDate: '',
          times: []
        }
        this.$set(this.draweDetaileData.dates, 0, item)
        return
      }
      this.draweDetaileData.dates.splice(index, 1)
    },
    deltimeItem (index, idx) { // 删除时间
      this.draweDetaileData.dates[index].times.splice(idx, 1)
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onEdit () {
      this.readOnly = false
      // console.log(this.draweDetaileData.dates)
    },
    cannelFn () {
      this.draweDetaileData = this.deepCopy(this.draweDetaileDataProps)
      this.$refs['draweDetaileData'].resetFields()
      this.readOnly = true
    },
    onHide () {
      this.readOnly = true
      this.errIndex = null
      this.$refs['draweDetaileData'].resetFields()
      this.$emit('drawerClose', false)
    }
  }
}
</script>
<style lang="scss" >
.PlanConfigDetails {
  .el-table::before {
    height: 0;
  }
}
</style>
<style lang="scss" scoped>
.PlanConfigDetails {
  .main_content {
    .basInfo {
      width: 100%;
    }
  }
}
</style>
<style lang="scss" scoped>
.PlanConfigDetails {
  .dialog-footer {
    > span {
      display: inline-block;
      color: #777777;
      height: 34px;
      line-height: 34px;
      text-align: center;
      padding: 0 21px;
      cursor: pointer;
      background: rgba(243, 244, 250, 1);
      border-radius: 4px;
      margin-left: 10px;
      &.saveBtn {
        border: 1px solid rgba(53, 117, 246, 1);
        color: #3575f6;
      }
      &.saveSubmit,
      &.passBtn {
        background: rgba(53, 117, 246, 1);
        color: #fff;
      }
      &.rejectBtn {
        color: #e0434e;
        background: rgba(253, 235, 237, 1);
        border: 1px solid #c1bdbd;
      }
    }
  }
  .details_content {
    width: 750px;
    height: calc(100% - 80px) !important;
    .el-form {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .form {
        display: flex;
        justify-content: space-between;
        padding: 15px;
        .el-form-item {
          width: 47%;
          .el-form-item__content {
            > span {
              margin-bottom: 5px;
              display: inline-block;
              height: 25px;
              display: -ms-flexbox;
              display: flex;
              -ms-flex-align: center;
              align-items: center;
              font-size: 14px;
              color: #777777;
            }
            > p {
              color: #262626;
              font-size: 14px;
              height: 40px;
              line-height: 40px;
            }
            .tips {
              font-size: 12px;
              color: #999999;
              margin-top: 10px;
            }
          }
          .deviceDetails {
            width: 140px;
            height: 120px;
            margin-right: 0px !important;
          }
        }
      }
      .planList {
        padding: 15px;
        .list {
          display: flex;
          padding: 10px;
          justify-content: space-between;
          margin-bottom: 10px;
          border-bottom: 1px solid #f3f3f3;
          min-height: 32px;
          & > div {
            &:first-child {
              width: 35%;
              text-align: center;
            }
            &:last-child {
              width: 55%;
              > span {
                padding: 2px 10px;
                background: rgba(53, 117, 246, 0.2);
                color: #3575f6;
                border-radius: 10px;
                display: inline-block;
                margin-bottom: 5px;
                margin-right: 5px;
              }
            }
          }
        }
        .head {
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f7f8fa;
          font-size: 14px;
          color: #777777;
          // padding: 0 250px 0 50px;
          > span {
            width: 50%;
            text-align: center;
            padding-right: 170px;
            &:first-child {
              padding-right: 100px;
            }
          }
        }
        .item {
          display: flex;
          padding: 10px;
          justify-content: space-between;
          margin-bottom: 10px;
          border-bottom: 1px solid #f3f3f3;
          &.error {
            border: 1px solid #d01522;
          }
          > div {
            display: flex;
            align-items: center;
            > p {
              margin-right: 10px;
            }
            &.del {
              color: #ed0000;
              cursor: pointer;
              margin-right: 15px;
            }
            .timeArr {
              min-height: 32px;
              border: 1px solid #dcdfe6;
              box-sizing: border-box;
              color: #606266;
              background-color: #fff;
              background-image: none;
              border-radius: 4px;
              display: flex;
              align-items: center;
              padding: 0 10px;
              .timeItemContent {
                width: 280px;
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                .timeItem {
                  padding: 2px 8px;
                  background-color: #f5f5f5;
                  border-radius: 10px;
                  margin: 5px 0px 5px 10px;
                  > i {
                    cursor: pointer;
                  }
                }
              }
            }
          }
        }
      }
      .half_page_title {
        > div {
          &:first-child {
            > span {
              font-size: 12px;
              font-weight: normal;
              margin-left: 15px;
            }
          }
        }
        .addBtn {
          color: #00b361;
          font-size: 14px;
          font-weight: normal;
          cursor: pointer;
          > span {
            &.iconfont {
              font-size: 16px;
              margin-right: 5px;
            }
            &.btn {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
  .item-attribute {
    width: 100%;
    margin-bottom: 20px;
    p {
      margin: 10px 0;
    }
    .el-checkbox {
      margin-top: 8px;
      width: 20%;
    }
  }
}
</style>
