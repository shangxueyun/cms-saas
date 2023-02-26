<template>
  <div class="loop">
    <div class="search-bar">
      <div style="display: flex;flex-wrap: wrap;align-items:center">
        <!-- <el-select placeholder="楼宇"
                   v-model="buildingId"
                   @change="getFloor"
                   clearable
                   style="width:200px;margin-right:10px">
          <el-option v-for="(item,index) in bnulidingList"
                     :key="item.id"
                     :label="item.buildingName"
                     :value="item.id"></el-option>
        </el-select>
        <el-select placeholder="楼层"
                   v-model="floorId"
                   clearable
                   size="small">
          <el-option v-for="(item,index) in floorList"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select> -->
        <el-input v-model="loopName"
                  style="width: 200px"
                  placeholder="回路名称"></el-input>
        <el-input v-model="loopRemarks"
                  style="width: 200px"
                  placeholder="回路说明"></el-input>
        <el-select v-model="lightingGroupId"
                   clearable
                   size="small">
          <el-option v-for="item in groupList"
                     :value="item.id"
                     :label="item.name"
                     :key="item.id"></el-option>
        </el-select>
        <el-select v-model="onOff"
                   clearable
                   size="small">
          <el-option label="全部状态"
                     value=""></el-option>
          <el-option label="开启"
                     value="true"></el-option>
          <el-option label="关闭"
                     value="false"></el-option>
        </el-select>
        <span style="background-color:#3575f6"
              @click="querySeach"
              class="query-btn">查询</span>
      </div>
      <div class="btnDiv">
        <el-button class="tban tban1"
                   v-if="hasAuthority('03080107')"
                   @click="addRepFn"><i class="iconfont icon-crm_xinzeng-"></i> 新增回路</el-button>
      </div>
    </div>
    <!-- <div class="status-bar">
      <span>总计：{{lightingTotal}}</span>
      <span>正常：{{lightingNormal}}</span>
      <span>异常：{{lightingError}}</span>
    </div> -->
    <div class="table">
      <el-table :data="tableData"
                :key="tableDataKey"
                style="width: 100%">
        <el-table-column label="回路图片"
                         align="center">
          <template slot-scope="scope"
                    v-if="scope.row.imgurls && scope.row.imgurls.length > 0">
            <img :src="scope.row.imgurls[0]"
                 style="width: 60px; height: 40px" />
          </template>
        </el-table-column>
        <el-table-column prop="projectManagementName"
                         label="项目简称"
                         align="center"></el-table-column>
        <el-table-column prop="lightingGatewayName"
                         label="网关名称"
                         align="center"></el-table-column>
        <el-table-column prop="name"
                         label="回路名称"
                         align="center"></el-table-column>
        <el-table-column prop="interfaces"
                         label="TagID"
                         align="center"></el-table-column>
        <el-table-column prop="lightingGroupName"
                         label="所属群组"
                         align="center"></el-table-column>
        <el-table-column :formatter="formatter"
                         prop="loopType"
                         label="状态"
                         align="center"></el-table-column>
        <el-table-column prop="onOff"
                         v-if="hasAuthority('03080108')"
                         label="开关"
                         align="center">
          <template slot-scope="scope">
            <el-switch @change="changeOnOff(scope.row.onOff, scope.row)"
                       v-model="scope.row.onOff"
                       active-color="#13ce66"
                       inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         v-if="hasAuthority('03080109')||hasAuthority('03080110')"
                         align="center">
          <template slot-scope="scope">
            <el-button class="el-button--primary operation-btn"
                       size="mini"
                       v-if="hasAuthority('03080109')"
                       @click="handleEdit(scope.$index, scope.row)">查看</el-button>
            <el-button type="danger"
                       size="mini"
                       v-if="hasAuthority('03080110')"
                       @click="deleteFn(scope.row)"
                       plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="ctc-foot">
      <span><span style="margin-right:10px">{{currentPage}}/{{Math.ceil(total/pgSize)}}页</span> 共{{total}}条记录</span>
      <el-pagination v-if="total > 0"
                     background
                     layout="prev, pager, next"
                     :page-size=pgSize
                     :total="total"
                     :current-page.sync="currentPage"
                     @current-change="current_change">
      </el-pagination>
      <div class="pagingnum">
        显示 <select v-model="pgSize"
                @change="currentSel">
          <option v-for="item in pgNumoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
          </option>
        </select>
        条目
      </div>
    </div>
    <!-- 新增回路-->
    <el-dialog class="addRep"
               title="新增回路"
               :visible.sync="detailsShow"
               @close="drawerClose">
      <div class="tenant-details addFrom">
        <div class="tenant-details details-content">
          <div class="main-content"
               style="border:none">
            <el-form :model="addData"
                     ref="addData"
                     :rules="addDataRules">
              <div class="basInfo">
                <p class="title"><span class="vertical"></span>基本信息</p>
                <div class="content">
                  <div class="form">
                    <el-form-item prop="projectManagementId">
                      <span>项目简称<i class="required">*</i></span>
                      <el-select v-model="addData.projectManagementId"
                                 @change="patrolTypeChange"
                                 size="small"
                                 placeholder="请选择">
                        <el-option v-for="item in projectManagementsList"
                                   :key="item.id"
                                   :label="item.referred"
                                   :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="name"
                                  style="margin-left: 40px">
                      <span>回路名称<i class="required">*</i></span>
                      <el-input v-model="addData.name"
                                maxlength="50"></el-input>
                    </el-form-item>
                    <!-- <el-form-item prop="buildingId">
                      <span>楼宇<i class="required">*</i></span>
                      <el-select v-model="addData.buildingId"
                                 @change="getFloor2"
                                 size="small"
                                 placeholder="请选择">
                        <el-option v-for="item in bnulidingList"
                                   @click.native="addData.buildingName = item.buildingName"
                                   :key="item.id"
                                   :label="item.buildingName"
                                   :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="floorId"
                                  style="margin-left: 40px">
                      <span>楼层<i class="required">*</i></span>
                      <el-select placeholder="楼层"
                                 v-model="addData.floorId"
                                 size="small">
                        <el-option v-for="(item,index) in floorList"
                                   @click.native="addData.floorName = item.name"
                                   :key="item.id"
                                   :label="item.name"
                                   :value="item.id"></el-option>
                      </el-select>
                    </el-form-item> -->
                  </div>
                </div>
              </div>

              <div class="basInfo">
                <p class="title"><span class="vertical"></span>关联信息</p>
                <div class="content">
                  <div class="form">
                    <el-form-item prop="lightingGatewayId">
                      <span>网关选择<i class="required">*</i></span>
                      <el-select v-model="addData.lightingGatewayId"
                                 size="small"
                                 placeholder="请选择">
                        <el-option v-for="(item, index) in gatewaySelectList"
                                   @click.native="gatewaySelectIndex = index;"
                                   :key="item.id"
                                   :label="item.name"
                                   :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="interfaces"
                                  style="margin-left: 40px">
                      <span>TagID<i class="required">*</i></span>
                      <el-input v-model="addData.interfaces"
                                type="text"
                                maxlength="50"></el-input>
                    </el-form-item>
                    <!-- <el-form-item prop="interfaces">
                      <span>接口选择<i class="required">*</i></span>
                      <el-select v-model="addData.interfaces"
                                 size="small"
                                 placeholder="请选择">
                        <el-option v-for="(item, index) in interfacesList"
                                   :key="item"
                                   :label="item"
                                   :value="item"></el-option>
                      </el-select>
                    </el-form-item> -->
                    <el-form-item style="width: 96%">
                      <span>回路说明</span>
                      <el-input v-model="addData.remark"
                                type="textarea"
                                placeholder="您可输入此回路包含的照明设备数量，具体位置等信息"
                                maxlength="50"></el-input>
                    </el-form-item>
                    <div style="margin-left: 15px;">
                      <span>回路图片</span>
                      <div class="upLoadDiv">
                        <div>
                          <div class="imgList"
                               v-for="(item,index) in addData.imgurls"
                               :key="index">
                            <div class="item">
                              <img :src="item"
                                   alt="">
                              <div @click="showImg(item,index)"
                                   class="bottomTips">预览图片</div>
                              <i class="deleteBtn iconfont icon-cms_cuowu"
                                 @click="delImg(item,index)"></i>
                            </div>
                          </div>
                          <div class="upLoadComponents"
                               v-if="addData.imgurls.length<9">
                            <i class="iconfont icon-shangchuantupianicon"></i>
                            <aliUpload class="aliUpload"
                                       :upLoadText="upLoadText"
                                       :fileType="fileType"
                                       :iconShow="false"
                                       @setAnnex="setAnnex" />
                          </div>
                        </div>
                        <p>（最多可上传9张,建议尺寸：<span style="color:#F00">200＊300</span>像素；支持格式JPG,PNG，不大于2M）</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-form>
          </div>
        </div>
        <div slot="footer"
             style="text-align: right;padding: 8px 20px 8px;"
             class="dialog-footer">
          <el-button @click="drawerClose"
                     class="close-button">取消</el-button>
          <el-button type="primary"
                     class="defaultbtn dialog-confirmBtn"
                     @click="addFrom('addData')">确定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 确认删除弹窗 -->
    <el-dialog :visible.sync="DELDialogVisible"
               class="delaffirm"
               width="400px"
               center>
      <div class="deleteDialog">
        <img src="../../../assets/delete1.png"
             style="width: 64px;height: 64px" />
        <div>
          <p>提示</p>
          <span v-if="hasGroup">此回路已绑定群组，确认删除？</span>
          <span v-else>确认删除？</span>
        </div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="DELDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="delFun">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 图片预览 -->
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
    <!-- 回路详情 -->
    <el-drawer title="回路详情"
               :visible.sync="DetailShow"
               :wrapperClosable="false"
               @close="detailClose"
               direction="rtl"
               size="746px"
               class="getway-drawer newDrawer">
      <span slot="title"
            style="position: relative;color: #262626;font-size: 16px;font-weight: bold;">
        回路详情
        <span style="position: absolute;right: 0;cursor: pointer;color: #3575F6;font-size: 12px;font-weight: normal;"
              @click="editDetails"
              v-if="readOnly&&hasAuthority('03080108')"><i class="iconfont icon-edit1"></i>编辑</span>
      </span>
      <loop-details :detailData="loopDetailData"
                    :DetailShow.sync="DetailShow"
                    @setreadOnly="setreadOnly"
                    @handleEdit="handleEdit"
                    @query="query"
                    ref="loopDetails"></loop-details>
    </el-drawer>
  </div>
</template>
<script>
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import LoopDetails from './LoopDetails.vue'
export default {
  name: 'Loop',
  components: {
    aliUpload,
    picturePrevie,
    LoopDetails
  },
  props: {
    projectId: {
      type: Number,
      default: ''
    }
  },
  watch: {
    projectId: {
      handler (newValue, oldValue) {
        if (newValue) {
          this.lightingGroupId = ''
          this.query()
          this.groupSelect()
          this.addData.projectManagementId = this.projectId
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      loopName: '',
      loopRemarks: '',
      DELDialogVisible: false,
      loopDetailData: {},
      DetailShow: false,
      tableData: [],
      detailsShow: false,
      buildingId: '',
      floorId: '',
      lightingGroupId: '',
      onOff: '',
      addData: {
        projectManagementId: '',
        name: '',
        lightingGatewayId: '',
        interfaces: '',
        remark: '',
        imgurls: []
      },
      addDataRules: {
        name: [
          { required: true, message: '请输入回路名称', trigger: 'blur' }
        ],
        buildingId: [
          { required: false, message: '请选择楼宇', trigger: 'change' }
        ],
        floorId: [
          { required: false, message: '请选择楼层', trigger: 'change' }
        ],
        lightingGatewayId: [
          { required: true, message: '请选择网关', trigger: 'change' }
        ],
        interfaces: [
          { required: true, pattern: /(^[1-9]\d*$)/, message: '请输入正确的TagID', trigger: 'blur' }
        ],
        lightingControllerId: [
          { required: false, message: '请选择控制器ID', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入回路说明', trigger: 'change' }
        ]
      },
      patrolType: '',
      useStatus: '',
      projectManagementId: '',
      upLoadText: '上传图片',
      fileType: ['jpg', 'png'],
      num: 1,
      imgArr: [],
      showPicture: false,
      bnulidingList: [],
      floorList: [],
      buildingName: '',
      floorName: '',
      gatewaySelectList: [{
        lightingControllerDTOList: []
      }],
      gatewaySelectIndex: 0,
      interfacesList: [],
      currentPage: 1,
      total: 0,
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
      lightingError: 0,
      lightingNormal: 0,
      lightingTotal: 0,
      readOnly: true,
      groupList: [],
      hasGroup: false,
      tableDataKey: 0
    }
  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
    this.addData.projectManagementId = this.projectId
    // this.query()
    // this.groupSelect()
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
      // return true
    },
    TagIDFormatter (id) {
      if (!(/(^[1-9]\d*$)/.test(id))) {
        alert('数量不是正整数!!!')
        return false
      }
    },
    formatter (row, column) {
      return row.loopType === 'NORMAL' ? '正常' : '异常'
    },
    detailClose () {
      this.DetailShow = false
      this.readOnly = true
      this.$refs.loopDetails.close()
    },
    editDetails () {
      this.readOnly = false
      this.$refs.loopDetails.edit()
    },
    setreadOnly () {
      this.readOnly = true
    },
    deleteFn (row) {
      this.DELDialogVisible = true
      this.deleteRow = row
      this.hasGroup = false
      if (row.lightingGroupName) this.hasGroup = true
    },
    delFun () {
      const row = this.deleteRow
      context.http.delete(`/rms/api/lightingLoop/${row.id}`).then(res => {
        this.DELDialogVisible = false
        this.query()
      })
    },
    async query () {
      let param = {
        page: (this.currentPage - 1),
        size: this.pgSize,
        projectManagementId: this.projectId,
        name: this.loopName,
        remark: this.loopRemarks,
        lightingGroupId: this.lightingGroupId,
        onOff: this.onOff,
        sort: 'createdDate,desc'
      }
      let result = await context.http.get('/rms/api/lightingLoop', param)
      if (result.status === 200) {
        this.tableDataKey++
        this.tableData = result.data
        this.total = Number(result.headers['x-total-count'])
        this.lightingError = Number(result.headers['lighting-error'])
        this.lightingNormal = Number(result.headers['lighting-normal'])
        this.lightingTotal = Number(result.headers['lighting-total'])
      }
    },
    async getBuliding (flag) { // 楼宇
      let result = await context.http.get('/cms/api/buildings/newList?sort=sortNumber,asc&sort=id,asc', { page: 0, size: 100, useStatus: 'USING', projectId: this.projectId })
      if (result.data && result.data.length) {
        this.bnulidingList = result.data
        if (!flag) {
          this.buildingId = this.bnulidingList[0].id
          this.getFloor(flag)
        }
      } else {
        this.bnulidingList = []
      }
    },
    async getFloor (flag) { // 楼层
      if (!this.buildingId) {
        this.floorList = []
        this.buildingId = ''
        return
      }
      let result = await context.http.get(`/cms/api/floors/building/${this.buildingId}`)
      this.floorList = result.data
      if (this.floorList.length > 0) {
        if (!flag) this.buildingId = this.floorList[0].id
      }
    },
    async getFloor2 (flag) {
      if (!this.addData.buildingId) {
        this.floorList = []
        this.addData.buildingId = ''
        return
      }
      let result = await context.http.get(`cms/api/floors/building/${this.addData.buildingId}`)
      this.floorList = result.data
      if (this.floorList.length > 0) {
        if (!flag) this.addData.buildingId = this.floorList[0].id
      }
    },
    async gatewayList () {
      let result = await context.http.get(`/rms/api/lightingGateway/list/${this.addData.projectManagementId}`)
      if (result.status === 200) {
        this.gatewaySelectList = result.data
      }
    },
    async changeOnOff (value, row) {
      try {
        const result = await context.http.put(`/rms/api/lightingLoop/onOff`, row)
        if (result.status === 200) {
          this.$message.success('操作成功')
        }
      } catch (error) {
        row.onOff = !row.onOff
      }
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    setAnnex (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
      this.addData.imgurls.push(annexURL)
    },
    showImg (item, index) {
      let imgArr = []
      this.addData.imgurls.forEach(item => {
        imgArr.push(item)
      })

      this.imgArr = imgArr
      this.num = index
      this.showPicture = true
    },
    delImg (item, index) {
      this.addData.imgurls.splice(index, 1)
    },
    pictureClose () {
      this.showPicture = false
    },
    async handleEdit (index, row) {
      context.http.get(`/rms/api/lightingLoop/${row.id}`).then(res => {
        this.loopDetailData = res.data
        this.DetailShow = true
      })
    },
    patrolTypeChange () {
      this.addData.lightingGatewayId = ''
      this.gatewayList()
    },
    async interfaceSelect (controllerId) {
      this.addData.interfaces = ''
      let loopId = ''
      let result = await context.http.get(`/rms/api/lightingLoop/interfaces?loopId=${loopId}&controllerId=${controllerId}`)
      if (result.data && result.data.length) {
        this.interfacesList = result.data.filter(item => {
          return item.length < 2
        })
      } else {
        this.interfacesList = []
      }
    },
    addRepFn () {
      this.detailsShow = true
      this.gatewayList()
      this.$nextTick(() => {
        this.$refs['addData'].resetFields()
        this.addData = {
          projectManagementId: this.projectId,
          name: '',
          lightingGatewayId: '',
          interfaces: '',
          remark: '',
          imgurls: []
        }
      })
    },
    drawerClose () {
      this.detailsShow = false
    },
    async addFrom (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          context.http.post(`/rms/api/lightingLoop`, this.addData).then(res => {
            if (res.status === 201) {
              this.detailsShow = false
              this.$message.success('新增成功')
              this.query()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async groupSelect () {
      let result = await context.http.get(`/rms/api/lightingGroup/list/${this.projectId}`)
      if (result.status === 200) {
        this.groupList = result.data
      }
    },
    querySeach () {
      this.currentPage = 1
      this.query()
    }
  }
}
</script>
<style lang="scss">
.energySystem {
  .el-drawer .el-drawer__header {
    margin: 10px 20px 0 20px;
    border-bottom: none;
  }
}
.loop {
  .delaffirm {
    .el-dialog__header {
      border: none;
    }
    .el-dialog__body {
      margin: 0 35px !important;
      border-bottom: none;
      padding: 30px 0 !important;
      background-color: #fff;
    }
    .el-dialog__footer {
      text-align: right !important;
    }
  }
  .el-dialog__body {
    .deleteDialog {
      display: flex;
      div {
        margin-left: 15px;
        display: flex;
        flex-wrap: wrap;
        p {
          color: #666666;
          font-size: 20px;
          font-weight: 600;
          width: 100%;
        }
      }
    }
  }
  .tableData {
    .el-table__body-wrapper {
      &::-webkit-scrollbar {
        width: 4px !important;
        height: 4px !important;
      }

      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px #fff;
        background-color: #fff;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 6px #cccccc;
      }
    }
  }
  .addRep {
    .el-dialog {
      width: 746px;
      margin-top: 3vh !important;
    }
    .el-dialog__header {
      margin: 0 20px !important;
      padding: 15px 0 15px 0 !important;
      border: none;
    }
    .el-dialog__title {
      font-weight: bold;
      border: none;
      font-size: 16px;
    }
    .el-dialog__body {
      margin: 0 !important;
      background-color: #f7f7f7;
      border: none;
    }
  }
  .basInfo {
    border: none !important;
    background-color: #fff;
  }
  .readOnlyTxt {
    color: #262626 !important;
  }
  .el-form-item__content {
    > span {
      color: #777 !important;
    }
  }
  .el-input__icon {
    line-height: 34px;
  }
  .ctc-foot {
    justify-content: normal;
    flex-direction: row-reverse;
    align-items: center;
    color: #3f5fbf;
    font-size: 12px;
    padding: 60px 20px 30px 20px;
    .pagingnum {
      color: #3f5fbf;
      font-size: 12px;
      select {
        width: 65px;
        height: 28px;
        border-radius: 2px;
        border-color: #f6f6f7;
        color: #3577f6;
      }
    }
    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .el-pager li {
      margin: 0 5px;
      background-color: transparent;
      color: #3f5fbf;
      min-width: 30px;
      border-radius: 2px;
      font-size: 14px;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      border-radius: 50%;
      background-color: #3f5fbf !important;
      color: #fff !important;
    }
  }
  .upLoadComponents {
    width: 100px;
    height: 100px;
    border: 1px solid #d0d0d0ff;
    position: relative;
    background: url(../../../assets/plus.png) no-repeat center;
    > i {
      font-size: 36px;
      color: #3575f6;
      position: absolute;
      top: 25%;
      left: 32%;
    }
    .aliUpload {
      height: 100%;
      background: #f7f9fd;
      .oss_file {
        border: none !important;
        height: 100px !important;
        width: 100%;
        line-height: 195px;
        color: #3577f6;
        .upLoadText {
          position: relative;
          top: -20px;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.search-bar {
  > div {
    > span {
      display: inline-block;
      width: 110px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      cursor: pointer;
      // color: #fff;
      border-radius: 3px;
      &:first-child {
        // background-color: #3577f6;
      }
      &:first-child:hover {
        background-color: #2a6ef0;
      }
      &:last-child {
      }
      &:last-child:hover {
        background-color: #f0f9f3;
      }
    }
  }
}
.status-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  span {
    display: inline-block;
    min-width: 80px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    margin-left: 20px;
    border-radius: 3px;
    color: #fff;
    &:first-child {
      background-color: #3575f6;
    }
    &:nth-child(2) {
      background-color: #67c23a;
    }
    &:nth-child(3) {
      background-color: #f56c6c;
    }
  }
}
.table {
  padding-top: 1px;
  .el-button--primary {
    color: #409eff;
  }
}
.btnDiv {
  display: flex;
  align-items: center;
  span {
    border: 1px solid #44af69;
    color: #44af69;
    background-color: #fff;
    line-height: 31px !important;
  }
}
.tenant-details.addFrom {
  .el-input__inner {
    height: 32px;
  }
  .el-input__icon {
    line-height: 32px;
  }
}
.addFrom {
  .ctc-foot {
    padding: 20px 20px 30px 20px;
  }
  .frequency {
    display: flex;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    .el-input {
      width: 55%;
    }
    .el-select {
      width: 45% !important;
      .el-input {
        width: 100%;
      }
    }
    .el-input__inner {
      border: none;
    }
  }
  .textarea {
    border: none;
  }
  .el-select {
    width: 100%;
  }
}
.addFrom {
  .table {
    .normal {
      color: #49af61;
    }
    .abnormal {
      color: #ff6665;
    }
  }
  .el-select {
    width: 100%;
  }
  .main-content {
    padding-top: 20px;
    margin: 0;
    .vertical {
      display: inline-block;
      width: 4px;
      height: 16px;
      background-color: #3575f6;
      border-radius: 2px;
      vertical-align: middle;
      margin-right: 5px;
    }
    .title {
      padding-left: 20px;
      font-size: 16px;
    }
    .mainInfo {
      height: 60px;
      border: 1px solid #dadada;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      justify-content: space-between;
      font-size: 14px;
    }
    .basInfo {
      border: 1px solid #dadada;
      padding: 1px 0;
      // min-height: 500px;
      // width: 900px;
      margin-bottom: 20px;
      .queryParams {
        padding: 10px 0 0 15px;
        .query-btn {
          display: inline-block;
          width: 80px;
          margin: 0;
        }
      }
    }
    .content {
      padding: 15px;
      .addequipment {
        color: #3575f6;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
      .form {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          width: 45%;
          margin-left: 15px;
          .el-form-item__content {
            > span {
              margin-bottom: 5px;
              display: inline-block;
            }
            > .readOnlyTxt {
              height: 40px;
              line-height: 40px;
              font-size: 14px;
              color: #262626;
            }
            /* .seachDeviceIcon {
                display: inline-block;
                width: 20px;
                height: 20px;
                background: url(../../../../assets/seachDeviceIcon.png) no-repeat;
                position: absolute;
                right: 10px;
                top: 33px;
                cursor: pointer;
              } */
            .el-textarea__inner {
              resize: none !important;
            }
          }
        }
      }
    }
  }
  .dialog-footer {
    background-color: #fff;
  }
  .close-button {
    color: #666 !important;
    background-color: #fff !important;
    border: none !important;
    &:hover {
      color: #3575f6 !important;
    }
  }
  .defaultbtn {
    width: 90px !important;
    margin-left: 0;
  }
}
.upLoadDiv {
  > div {
    display: flex;
    flex-wrap: wrap;
    margin: 15px 0;
  }
  .imgList {
    margin-right: 10px;
    margin-bottom: 10px;
    .item {
      width: 100px;
      height: 100px;
      position: relative;
      border: none;
      &:hover > .bottomTips {
        height: 25px;
      }
      > i.deleteBtn {
        position: absolute;
        right: -8px;
        top: -8px;
        cursor: pointer;
      }
      .bottomTips {
        display: inline-block;
        height: 0px;
        position: absolute;
        left: 0px;
        bottom: 0px;
        width: 100%;
        text-align: center;
        background: rgba(38, 38, 38, 0.6);
        line-height: 25px;
        font-size: 12px;
        padding: 0 5px;
        cursor: pointer;
        color: #fefefe;
        text-align: center;
        transition: height 0.5s;
        overflow: hidden;
      }
      img {
        width: 100px;
        height: 100px;
      }
      > div {
        height: 30px;
        line-height: 30px;
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        align-items: center;
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.7);
        > span {
          display: inline-block;
          width: 70%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        > i {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
