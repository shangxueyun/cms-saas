<template>
  <div class="tenant-details">
    <drawer :show="detailsdrawershow"
            class="drawer_new"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="tenant-details details-content bindEnergy details_content drawer-body"
           slot="drawer">
        <div class="main_comtent main_content">
          <div class="seachDiv">
            <el-select v-model="equirementTypeChildId"
                       disabled
                       placeholder="设备小类"
                       size="small"
                       clearable>
              <el-option v-for="(item,index) in getEquirementTypes25List"
                         :key="index"
                         :value="item.id"
                         :label="item.name"></el-option>
            </el-select>
            <el-select v-model="energyType"
                       size="small"
                       placeholder="能耗类型"
                       clearable>
              <el-option label="仪表"
                         value="METER"></el-option>
              <el-option label="开关"
                         value="SWITCH"></el-option>
              <el-option label="照明"
                         v-if="equirementTypeChildId===27"
                         value="LAMP"></el-option>
              <el-option label="空调"
                         v-if="equirementTypeChildId===27"
                         value="VRV"></el-option>
              <el-option label="其他"
                         value="OTHER"></el-option>
            </el-select>
            <div class="item">
              <p>设备名称</p>
              <el-input v-model="name"
                        size="small"></el-input>
            </div>
            <div class="item">
              <p>安装位置</p>
              <el-input v-model="address"
                        size="small"></el-input>
            </div>
            <div class="details_chaxun_btn"
                 @click="getList_equirementsEnergy_seach">查询</div>
          </div>
          <!-- table -->
          <div class="table">
            <el-table :data="tableData"
                      style="width: 100%"
                      ref="tableData"
                      :row-class-name="binded"
                      :row-key="getRowKeys"
                      @selection-change="handleSelectionChange">
              <el-table-column type="selection"
                               :reserve-selection="true"
                               width="55">
              </el-table-column>
              <el-table-column prop="code"
                               label="设备编号"
                               align="center"> </el-table-column>
              <el-table-column prop="name"
                               label="设备名称"
                               align="center"> </el-table-column>
              <el-table-column prop="equirementType.name"
                               label="设备小类"
                               align="center"> </el-table-column>
              <el-table-column label="能耗类型"
                               align="center"
                               :formatter="formatenergyType"> </el-table-column>
              <el-table-column label="仪表类型"
                               align="center"
                               :formatter="formatinstrumentType"> </el-table-column>
              <el-table-column prop="installPosition"
                               label="安装位置"
                               align="center"> </el-table-column>
            </el-table>
          </div>
          <div class="ctc-foot1">
            <span><span style="margin-right:10px">{{currentPage}}/{{Math.ceil(total/pgSize)}}页</span> 共{{total}}条记录</span>
            <el-pagination v-if="total > 0"
                           background
                           layout="prev, pager, next"
                           :page-size="pgSize"
                           :total="total"
                           :current-page="currentPage"
                           @current-change="current_change">
            </el-pagination>

          </div>
        </div>
      </div>
      <div slot="footer"
           class="slotfooter">
        <span @click="onHide"
              class="closeBtn">关闭</span>
        <span class="saveSubmit"
              @click="bindFun('false')">保存</span>
      </div>
    </drawer>
  </div>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import { error, debug } from 'util'
export default {
  components: {
    Drawer
  },
  props: {
    equipmentTypeId: {
      type: Array,
      default: []
    },
    svgId: {},
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    bindParams: {
      type: Object,
      default: {
        id: '', // 平面图id
        svgId: '', // svgId
        roomId: '', // 房源id
        tenantId: '', // 客户id
        file: '' // svg文件
      }
    },
    defaultScale: {
    },
    pevDocmentObj: {
      type: Object,
      default: {
        target: null,
        style: null
      }
    },
    getEquirementTypes25List: {},
    projectManagementId: {},
    planeType: { // 楼/层平面类型
      type: String,
      default: ''
    }
  },
  created () {
  },
  mounted () {
  },
  data () {
    return {
      bindIds: [],
      // 获取row的key值
      getRowKeys (row) {
        return row.id
      },
      currentPage: 1,
      total: 0,
      pgSize: 15,
      energyType: '',
      equirementTypeChildId: '',
      name: '',
      selectionId: '',
      tableData: [],
      equirementName: '',
      equirement: '',
      address: '',
      drawerTitle: '关联能耗设备',
      addDevicDataRules: {
        'equirementType.parent.id': [
          { required: true, message: '请选择设备大类', trigger: 'change' }
        ]
      }
    }
  },
  computed: {

  },
  watch: {
    detailsdrawershow: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.equirementTypeChildId = this.equipmentTypeId[1]
          this.getList_equirementsEnergy()
        }
      },
      immediate: true
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.ids = []
      val.forEach(item => {
        this.ids.push(item.id)
      })
      this.bindIds = this.ids
      // console.log(val, this.ids)
    },
    binded (row, rowIndex) {
      if (row.row.svgId) {
        return 'bindedCLS'
      }
    },
    getList_equirementsEnergy_seach () {
      this.currentPage = 1
      this.getList_equirementsEnergy()
    },
    formatinstrumentType (row, column) {
      switch (row.instrumentType) {
        case 'ORDINARY_TABLE':
          return '普通表'
        case 'PUBLIC_TABLE':
          return '公共表'
        case 'SUMMARY_TABLE':
          return '总表'
        default:
          return '-'
      }
    },
    formatenergyType (row, column) {
      switch (row.energyType) {
        case 'METER':
          return '仪表'
        case 'SWITCH':
          return '开关'
        case 'LAMP':
          return '照明'
        case 'VRV':
          return '空调'
        case 'OTHER':
          return '其他'
      }
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.getList_equirementsEnergy()
    },
    getList_equirementsEnergy () { // 获取能耗设备列表
      let params = {
        address: this.address,
        equirementTypeChildId: this.equirementTypeChildId,
        energyType: this.energyType,
        name: this.name,
        projectPlanId: this.svgId,
        page: (this.currentPage - 1),
        size: this.pgSize,
        projectManagementId: this.projectManagementId
      }
      context.http.get('cms/api/equirements/energy', params).then(res => {
        this.tableData = res.data
        this.total = Number(res.headers['x-total-count'])
      }).catch(error => {
        console.log(error)
      })
    },
    getTemplateRow (index, row) {                                 // 获取选中数据
      this.selectionArr = row
      console.log(this.selectionId, this.selectionArr)
    },
    bindFun () { // 参数判断是否是创建完直接绑定
      if (this.pevDocmentObj.target) { // 绑定前    去掉默认样式
        $(this.pevDocmentObj.target).attr(this.pevDocmentObj.style)
      }
      if (!this.bindIds.length) {
        this.$message.error('请选择能耗设备')
        return
      }
      // 绑定前把绑定成功的样式传给后台
      if (this.pevDocmentObj.target) {
        $(this.pevDocmentObj.target).attr({
          'stroke-width': '2px',
          'stroke': '#00ff00'
        })
      }
      $('#svgHtml svg').css('transform', `scale(${this.defaultScale})`)
      let myFile = new File([$('#svgHtml').html()], 'test.svg', { type: 'image/svg+xml' })
      this.bindParams.file = myFile
      let form = new FormData()
      form.append('file', myFile)
      form.append('id', this.bindParams.id)
      form.append('equirementId', this.bindIds.toString())
      form.append('svgId', this.bindParams.svgId)
      context.http.post('cms/api/plan/binding', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
        this.$message({
          message: '绑定成功',
          type: 'success'
        })

        this.$emit('drawerClose', false)
        this.$emit('bindSuccess', res.data)
      }).catch(error => {
        this.$message({
          type: 'error',
          message: '绑定失败！'
        })
        // 绑定失败将样式置空
        $(this.pevDocmentObj.target).attr({
          'stroke': '#000000'
        })
        this.$emit('bindFail')
        console.info(error)
      })
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onHide () {
      // this.tenantIndex = 0
      this.$emit('drawerClose', false)
    }
  }
}
</script>
<style lang="scss" >
.bindEnergy {
  .table {
    border: none;
  }
  .el-table__header {
    border: none;
    thead tr th {
      background-color: #fafafa !important;
    }
  }
  .el-table th.is-leaf {
    border: none;
  }
}
</style>
<style lang="scss" scoped>
.bindEnergy {
  width: 1200px;
  margin-top: 15px;
  padding-bottom: 0;
  height: 100%;
  .main_comtent {
    padding: 0 15px !important;
    height: calc(100% - 60px); //根据实际页面需求设置高度 实现内容滚动
    .seachDiv {
      display: flex;
      height: 60px;
      align-items: center;
      > div {
        margin-right: 15px;
        &.item {
          display: flex;
          align-items: center;
          > p {
            width: 100px;
          }
        }
        &.seachBtn {
          width: 120px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          background-color: #3175f6ff;
          color: #fff;
          border-radius: 5px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
