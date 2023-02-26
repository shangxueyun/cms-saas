<!-- 维修记录-->
<template>
  <div class="repairRecordModel">
    <drawer :show="repairRecordModelshow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="mainlayout" style="width: 900px;" slot="drawer">
        <div class="main-content">
          <p style="border-top: 2px solid #eee; margin-bottom: 20px; height: 2px;"></p>
          <span class="addRepairShowFn" @click="addRepairShowFn"><i class="fa fa-pencil-square-o" aria-hidden="true" style="margin-right:5px"></i>新增维修</span>
          <div class="table">
            <el-table :data="repairRecordList" style="width: 100%">
              <el-table-column prop="repairDate" label="维修日期" align="center"></el-table-column>
              <el-table-column prop="equirementNo" label="设备编号" align="center"></el-table-column>
              <el-table-column prop="name" label="设备名称" align="center"></el-table-column>
              <el-table-column prop="repairUserName" label="维修人" align="center"></el-table-column>
              <el-table-column prop="repairStatus" label="维修结果" align="center" :formatter="formatRepairStatus"></el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope" >
                  <el-button @click="handleEdit(scope.$index, scope.row)" class="el-button--primary" size="mini">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- <div class="ctc-foot">
            <el-pagination v-if="total > 0"
                          background
                          layout="prev, pager, next"
                          :page-size=pgSize
                          :total="total"
                          @current-change="current_change">
            </el-pagination>
        </div> -->
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" style="position: relative;left: 10px;" class="close-button" @click="onHide">关闭</el-button>
        <!-- <el-button type="primary" class="close-button">保存</el-button> -->
      </div>
    </drawer>
  </div>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
export default {
  name: 'repairRecordModel',
  components: {
    Drawer
  },
  props: {
    repairRecordModelshow: {
      type: Boolean,
      default: false
    },
    repairRecordList: {
      type: Array
    }
  },
  data () {
    return {
      currentPage: 1,
      pgNum: 1,
      total: 1,
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
      drawerTitle: '维修记录'
    }
  },
  watch: {

  },
  methods: {
    formatRepairStatus (row, column) {
      if (row.repairStatus === 'COMPLETE') {
        return '维保完成'
      } else if (row.repairStatus === 'NO') {
        return '未完成'
      }
    },
    addRepairShowFn () {
      this.$emit('addRepairShowFn')
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      // this.query()
    },
    handleEdit (index, row) { // 查看单条维修记录详情
      this.$emit('repairDetailsShow', row.id)
    },
    onHide () {
      this.$emit('drawerClose', false)
    }
  }
}
</script>
<style lang="scss" scoped>
  .repairRecordModel{
    .addRepairShowFn{
      display: inline-block;
      width: 100px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      background-color: #49AF61;
      color: #fff;
      border-radius:3px;
      position: absolute;
      top: -40px;
      right: 45px;
      cursor: pointer;
      font-size: 14px;
      &:hover{
        background-color: #00954d;
      }
    }
    .table{
      padding-top:1px;
      border: 1px solid #eeeeee; 
    }
  }
</style>
