<template>
  <div class="tenant-details">
    <drawer :show="detailsdrawershow" :title="drawerTitle" @on-hide="onHide">
      <div class="tenant-details details-content" slot="drawer">
        <div class="main-content">
          <div class="tabMenu">
            <span>设备类型：</span>
            <el-select v-model="equipmentListId" placeholder="请选择设备类型" style="width:300px" @change="equipmentTypeChange">
              <el-option
                v-for="item in equipmentList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="table" id="table">
          <el-table :data="tableData" style="width: 100%" ref="multipleTable" :row-class-name="binded">
            <el-table-column width="55" label="">
              <template slot-scope="scope">
                <el-radio :label="scope.row.id" v-model="selectionId" :disabled="scope.row.svgId?true:false" @change.native="getTemplateRow(scope.$index,scope.row)">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="设备名称"  align="center"> </el-table-column>
            <el-table-column prop="code" label="设备编号"  align="center"> </el-table-column>
            <el-table-column prop="brand"  label="品牌"  align="center"> </el-table-column>
            <el-table-column prop="address"  label="具体位置" align="center"> </el-table-column>
          </el-table>
          </div>
          <div class="ctc-foot">
            <el-col :span="24">
              <span class="flex">
                <el-pagination v-if="totalC > 0"
                              background
                              layout="prev, pager, next"
                              :page-size=15
                              :total="totalC"
                              :current-page="currentPageC"
                              @current-change="current_change">
                </el-pagination>
              </span>
            </el-col>
        </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button @click="onHide" class="close-button">关闭</el-button>
          <el-button type="primary"  class="defaultbtn dialog-confirmBtn" @click="bindFun">确 定</el-button>
        </div>
    </drawer>
  </div>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
export default {
  components: {
    Drawer
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: []
    },
    bindParams: {
      type: Object,
      default: {
        id: '', // 平面图id
        svgId: '', // svgId
        roomId: '', // 房源id
        file: '' // svg文件
      }
    },
    pevDocmentObj: {
      type: Object,
      default: {
        target: null,
        style: null
      }
    },
    totalC: {
      type: Number,
      default: 0
    },
    currentPageC: {
      type: Number,
      default: 1
    },
    defaultScale: {
    },
    translateX: {
    },
    translateY: {
    }
  },
  created () {

  },
  mounted () {
  },
  data () {
    return {
      drawerTitle: '关联设备',
      equipmentListId: '',
      equipmentId: null, // 设备id
      equipmentList: [
        {label: '全部', value: ''},
        {label: '电梯系统', value: 'ELEVATOR'},
        {label: '强电', value: 'STRONGCURRENT'},
        {label: '暖通', value: 'HVAC'},
        {label: '给排水系统', value: 'WATERSUPPLY'},
        {label: '停车场管理系统', value: 'PARKINGAREA'},
        {label: '多媒体信息发布系统', value: 'MEDIARELEASE'},
        {label: '大屏幕投影系统', value: 'PROJECTION'},
        {label: '安防监控系统', value: 'SECURITYMONITOR'},
        {label: '楼宇自控系统', value: 'AUTOCONTROL'},
        {label: '消防报警系统', value: 'FIREALARM'},
        {label: '电子巡更系统', value: 'PATROL'},
        {label: '电话通讯系统', value: 'TELCONTACT'},
        {label: '门禁系统', value: 'ENTRANCEGUARD'},
        {label: '闭路电视监控系统', value: 'VIDEOMONITOR'},
        {label: '音乐广播系统', value: 'BROADCASTING'}
      ],
      selectionArr: [], // 选中
      selectionId: ''// 选中
    }
  },
  computed: {

  },
  methods: {
    current_change (currentPage) { // 切换页码
      // this.currentPage = currentPage
      // this.getDataList()
      this.$emit('current_change', currentPage)
    },
    binded (row, rowIndex) {
      if (row.row.svgId) {
        return 'bindedCLS'
      }
    },
    bindFun () {
      this.bindParams.roomId = this.selectionId// 选中设备id
      if (this.bindParams.roomId === '' || !this.bindParams.roomId) {
        this.$message({
          message: '请选择设备',
          type: 'error'
        })
        return
      }
      if (!this.selectionArr.svgId) { // 判断此房间是否已经绑定
        $('#svgHtml svg').css('transform', `scale(${this.defaultScale}) translate(${this.translateX},${this.translateY})`)
        let myFile = new File([$('#svgHtml').html()], 'test.svg', {type: 'image/svg+xml'})
        this.bindParams.file = myFile
        let form = new FormData()
        form.append('file', myFile)
        form.append('id', this.bindParams.id)
        form.append('equirementId', this.bindParams.roomId)
        form.append('svgId', this.bindParams.svgId)
        context.http.post('cms/api/plan/binding', form, { headers: {'Content-Type': 'multipart/form-data'} }).then(res => {
          this.$message({
            message: '绑定成功',
            type: 'success'
          })
          this.$emit('drawerClose', false)
          this.$emit('bindSuccess', true)
        }).catch(error => {
          console.info(error)
        })
      } else {
        this.$message({
          message: '该设备已经绑定',
          type: 'error'
        })
        this.$emit('drawerClose', false)
      }
    },
    equipmentTypeChange () { // 根据设备类型查列表
      console.log(this.equipmentListId)
      this.$emit('equirementTypeFn', this.equipmentListId)
    },
    onHide () {
      this.$emit('drawerClose', false)
      this.selectionId = ''
    },
    getTemplateRow (index, row) {                                 // 获取选中数据
      this.selectionArr = row
      console.log(this.selectionId, this.selectionArr)
    }
  }
}
</script>
<style lang="scss" >
  .tenant-details .dialog-footer{
        margin-top: -60px;
  }
  #table .el-table .bindedCLS {
    background: #eeeeee;
  }
.tabMenu{
  padding-top: 20px;
  border-top: 1px solid #eee;
}
.table{
  margin-top: 30px;
  margin-bottom: 30px;
}
#table  .tips{
    padding-left: 35px;
    margin-top: 15px;
    font-size: 10px;
    span{
      &:first-child{
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #f00;
      }
    }
  }
  .binded{
    color: #f00;
  }
  .tenant-details {
    width: 900px;
    .main-content {
      padding: 0 30px;
    }
  }
  .tower{
    span{
      display: inline-block;
      width: 165px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      border: 1px solid #cecece;
      cursor: pointer;
      &.active{
        color: #ffffff;
        background-color: #3175f6;
      }
    }
  }
  .floor{
    display: flex;
    align-items: center;
    margin-top: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid #cecece;
    .floorName{
      width: 10%;
      font-size: 18px;
      font-weight: 600;
    }
    .floorDtl{
      span{
        display: inline-block;
        width: 90px;
        height: 90px;
        text-align: center;
        border: 1px solid #cecece;
        border-radius:5px;
        margin-right: 20px;
        margin-bottom: 20px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        .innerContent{
          width: 100%;
          height: 100%;
          i{
            font-style: normal;
            display: inline-block;
            width: 100%;
            height: 20px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            &:first-child{
              margin-top: 20px;
            }
          }
        }
        &.active{
          border: 1px solid #3175f6;
          .iconCheack{
            display: inline-block;
            width: 40px;
            height: 40px;
            background: url(../../../../assets/iconCheack.png) no-repeat;
            position: absolute;
            right: 0;
            bottom: 0;
          }
        } 
      }
    }
  }
</style>
