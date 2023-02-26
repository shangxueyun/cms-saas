<template>
  <div class="tenant-details">
    <drawer :show="detailsdrawershow"
            class="drawer_new"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="tenant-details details-content bindFireControl details_content drawer-body"
           slot="drawer">
        <div class="main_comtent main_content">
          <div class="seachDiv">
            <el-select v-model="equirementTypeChildId"
                       size="small"
                       disabled
                       placeholder="设备小类"
                       clearable>
              <el-option v-for="(item,index) in getEquirementTypes25List"
                         :key="index"
                         :value="item.id"
                         :label="item.name"></el-option>
            </el-select>
            <div class="item">
              <el-input placeholder="设备名称"
                        size="small"
                        v-model="name"></el-input>
            </div>
            <div class="item">
              <el-input placeholder="安装地址"
                        size="small"
                        v-model="address"></el-input>
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
              <!-- <el-table-column width="55">
                <template slot-scope="scope">
                  <el-radio :label="scope.row.id"
                            v-model="selectionId"
                            @change.native="getTemplateRow(scope.$index,scope.row)">&nbsp;</el-radio>
                </template>
              </el-table-column> -->
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
    svgId: {},
    berthPlan: {
      type: String,
      default: ''
    },
    equipmentTypeId: {
      type: Array,
      default: []
    },
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
    projectManagementId: {}
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
      getEquirementTypes25List: [
        { id: 1, name: '灭火系统' },
        { id: 2, name: '报警系统' }
      ],
      name: '',
      address: '',
      selectionId: '',
      tableData: [],
      drawerTitle: '关联消防设备'
    }
  },
  computed: {

  },
  watch: {
    detailsdrawershow: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.equirementTypeChildId = this.equipmentTypeId[1]
          this.drawerTitle = this.berthPlan === 'FIRE_CONTROL' ? '关联消防设备' : '关联弱电设备'
          if (this.berthPlan === 'FIRE_CONTROL') { // 消防
            this.getDeviceList(2)
            this.getList_equirementsEnergy()
          } else if (this.berthPlan === 'WEAK_CURRENT') {
            this.getDeviceList(4)
            this.query()
          }
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
    getDeviceList (equirementTypeId) {
      context.http.get(`cms/api/equirementTypes/${equirementTypeId}`).then(res => {
        this.getEquirementTypes25List = res.data
      })
    },
    getList_equirementsEnergy_seach () {
      this.currentPage = 1
      this.getList_equirementsEnergy()
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.getList_equirementsEnergy()
    },
    query () {
      let params = {
        address: this.address,
        name: this.name,
        equirementTypeId: 4,
        equirementTypeChildId: this.equirementTypeChildId,
        projectManagementId: this.projectManagementId,
        page: (this.currentPage - 1),
        projectPlanId: this.svgId,
        // bol: true,
        size: this.pgSize,
        useStatus: 'USING'
      }
      context.http.get('/cms/api/equirements/svg', params).then(res => {
        this.tableData = res.data
        this.total = Number(res.headers['x-total-count'])
      }).catch(error => {
        console.log(error)
      })
    },
    getList_equirementsEnergy () { // 获取能耗设备列表
      let params = {
        address: this.address,
        equirementTypeChildId: this.equirementTypeChildId,
        name: this.name,
        projectPlanId: this.svgId,
        page: (this.currentPage - 1),
        size: this.pgSize,
        projectManagementId: this.projectManagementId
      }
      context.http.get('cms/api/equirements/fire', params).then(res => {
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
        this.$message.error('请选择消防设备')
        return
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
        if (dataType === '室内消火栓' || dataType === '室外消火栓' || dataType === '室内消火栓箱' || dataType === '手提式灭火器' || dataType === '火警报警装置' || dataType === '烟感探测器' || dataType === '火警报警按钮') {
          $(this.pevDocmentObj.target).attr({
            'stroke': '#000000',
            'fill': '#000000'
          })
        } else {
          $(this.pevDocmentObj.target).attr({
            'stroke': '#000000'
          })
        }
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
.bindFireControl {
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
.bindFireControl {
  width: 900px;
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
        margin-right: 30px;
        &.item {
          display: flex;
          align-items: center;
          .el-input {
            width: 210px;
          }
          .el-select {
            width: 210px;
          }
          > p {
            width: 100px;
          }
        }
        &.seachBtn {
          margin-right: 0;
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
