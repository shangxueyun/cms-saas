<template>
  <div class="addEnergyData">
    <el-form :model="addData"
             :rules="addFlowRules"
             ref="addData">
      <div class="energyDataHtml">
        <div class="item">
          <span>设备编号</span>
          <p>{{detailsData.code}}</p>
        </div>
        <div class="item">
          <span>设备名称</span>
          <p>{{detailsData.name}}</p>
        </div>
        <div class="item">
          <span>能耗类型</span>
          <p>{{detailsData.equirementType.name}}</p>
        </div>
        <div class="item">
          <span>项目简称</span>
          <p>{{detailsData.projectManagement.referred}}</p>
        </div>
        <div class="item"
             v-if="detailsData.instrumentType==='ORDINARY_TABLE' && detailsData.energyType==='METER'">
          <span>关联商户</span>
          <p>{{detailsData.tenant.referred}}</p>
        </div>
        <div class="item">
          <span>楼宇名称</span>
          <p>{{detailsData.building.buildingName}}</p>
        </div>
        <div class="item"
             v-if="detailsData.instrumentType!=='ORDINARY_TABLE'"></div>
        <div class="item">
          <span>用量<i class="required">*</i></span>
          <el-form-item prop="consumption">
            <el-input v-model="addData.consumption"
                      style="width:70%"
                      size="small"
                      type="number"></el-input>
            <span style="display:inline-block;width:50px;">{{detailsData.equirementType.name==='电'?'kw.h':'m³'}}</span>
          </el-form-item>
        </div>
        <div class="item">
          <span>时间<i class="required">*</i></span>
          <el-form-item prop="consumerTime">
            <el-date-picker v-model="addData.consumerTime"
                            size="small"
                            type="month"
                            value-format="yyyy-MM-dd"
                            placeholder="选择月">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="item"></div>
      </div>
    </el-form>
    <div class="slotfooter">
      <span @click="addEnergyDataClose('addData')"
            class="details_cannelBtn">关闭</span>
      <span @click="saveData('addData')"
            class="details_submitBtn">确定</span>
    </div>
  </div>
</template>

<script>
import context from '@/service'
import * as JSOG from 'jsog'
import axios from 'axios'
export default {
  name: 'addEnergyData',
  components: {},
  props: {
    addEnergyDataShow: {
      type: Boolean,
      default: false
    },
    energyData: {
      type: Object,
      default: null
    },
    energyModuleType: {
      type: String,
      default: 'add'
    },
    detailsData: {
      type: Object,
      default: {
        id: null,
        code: '',
        name: '',
        equirementType: {
          name: ''
        },
        projectManagement: {
          referred: ''
        },
        tenant: {
          teantName: ''
        },
        building: {
          buildingName: ''
        }
      }
    }
  },
  watch: {
    addEnergyDataShow: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          if (this.energyModuleType === 'edit') {
            this.addData.consumption = this.energyData.consumption
            this.addData.consumerTime = this.energyData.consumerTime
            this.detailsData = this.energyData.equirement
          }
        }
      },
      immediate: true
    }
  },
  created () {
  },
  mounted () {

  },
  data () {
    return {
      addData: {
        consumption: '',
        consumerTime: ''
      },
      addFlowRules: {
        consumption: [
          { required: true, message: '请输入用量', trigger: 'blur' }
        ],
        consumerTime: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    addEnergyDataClose () {
      this.$refs['addData'].resetFields()
      this.$emit('addEnergyDataClose')
    },
    saveData (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {}
          params.equirement = this.detailsData
          params.consumption = this.addData.consumption
          params.consumerTime = this.addData.consumerTime
          console.log(params)
          if (this.energyModuleType === 'add') {
            context.http.post('/cms/api/energyData', params).then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '新增成功'
                })
                this.$emit('refresh')
                this.addEnergyDataClose()
              }
            })
          } else {
            params.id = this.energyData.id
            context.http.put('/cms/api/energyData', params).then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                this.$emit('refresh')
                this.addEnergyDataClose()
              }
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.addEnergyData {
  .energyDataHtml {
    display: flex;
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: space-between;
    > .item {
      width: 28%;
      margin-left: 20px;
      margin-top: 15px;
      > span {
        color: #777;
      }
      > p {
        color: #262626;
        margin-top: 10px;
      }
      > .el-form-item {
        margin-top: 10px;
      }
    }
  }
}
</style>

