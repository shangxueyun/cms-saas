<template>
  <div class="seach">
    <transition name="my-transition">
      <i class="el-icon-search searchIcon"
         v-if="seachIcon"
         @click="seachFn"></i>
      <el-input v-model="queryString"
                v-else
                ref="INPUT"
                class="seachInput"
                placeholder="请输入关键字搜索"
                @input="val=>{querySearch(val,false)}">
        <i slot="prefix"
           class="el-input__icon el-icon-search"></i>
        <i slot="suffix"
           @click="closeFn"
           class="el-input__icon el-icon-circle-close"></i>
      </el-input>
    </transition>
    <div class="content"
         v-if="isFocus">
      <div v-if="list1">
        <p>{{formatName(list1.queryType)}}（{{list1.page.totalElements}}）</p>
        <div>
          <div class="item"
               v-for="(item,index) in list1.page.content"
               :key="index"
               @click="handleEdit(index,item.id)">
            <span :title="item.name">{{item.name}}</span>
            <div :title="item.parantName"><span>{{item.parantName}}</span><i class="next"></i></div>
          </div>
        </div>
        <el-pagination background
                       v-if="page1.total>0"
                       layout="prev, pager, next"
                       :page-size="page1.pgSize"
                       :total="page1.total"
                       :current-page.sync="page1.currentPage"
                       @current-change="val=>{current_change(val,'PROJECT')}">
        </el-pagination>
      </div>
      <div v-if="list2">
        <p>{{formatName(list2.queryType)}}（{{list2.page.totalElements}}）</p>
        <div>
          <div class="item"
               v-for="(item,index) in list2.page.content"
               :key="index"
               @click="handleEdit1(index,item.id)">
            <span :title="item.name">{{item.name}}</span>
            <div :title="item.parantName"><span>{{item.parantName}}</span><i class="next"></i></div>
          </div>
        </div>
        <el-pagination background
                       v-if="page2.total>0"
                       layout="prev, pager, next"
                       :page-size="page2.pgSize"
                       :total="page2.total"
                       :current-page.sync="page2.currentPage"
                       @current-change="val=>{current_change(val,'BUILDING')}">
        </el-pagination>
      </div>
      <div v-if="list3">
        <p>{{formatName(list3.queryType)}}（{{list3.page.totalElements}}）</p>
        <div>
          <div class="item"
               v-for="(item,index) in list3.page.content"
               :key="index"
               @click="handleEdit2(index,item)">
            <span :title="item.name">{{item.name}}</span>
            <div><span>{{item.parantName}}</span><i class="next"></i></div>
          </div>
        </div>
        <el-pagination background
                       v-if="page3.total>0"
                       layout="prev, pager, next"
                       :page-size="page3.pgSize"
                       :total="page3.total"
                       :current-page.sync="page3.currentPage"
                       @current-change="val=>{current_change(val,'TENANT')}"></el-pagination>
      </div>
      <div class="noData"
           v-if="!list1&&!list2&&!list3">暂无数据</div>
    </div>
    <!-- 项目 -->
    <projectDetails :addProjectShow="addProjectShow"
                    :isFromSeach="true"
                    :projectDetailData="projectDetail"
                    @handleEdit="handleEdit"
                    @drawerClose="drawerClose" />
    <!-- 楼宇 -->
    <el-dialog title="编辑楼宇"
               :close-on-click-modal="false"
               :visible.sync="adddialogVisible"
               @close="$refs['addBuilding'].dialogHide()"
               class="addProjectdialog">
      <addBuilding ref="addBuilding"
                   @dialogHide="dialogHide"
                   @getTenantDetail='getTenantDetail'
                   :buildDetailsShow='buildDetailsShow'
                   :adddialogVisible='adddialogVisible'
                   :searchData="search" />
    </el-dialog>
    <buildingDetails class="buildingDetails"
                     :detailsdrawershow="buildDetailsShow"
                     @drawerClose="drawerClose1"
                     :tenantDetail="tenantDetail"
                     :contractsListData="contractsListData"
                     :buildingListData='buildingListData'
                     @getBuildingListData='getBuildingListData'
                     @getTenantDetail='getTenantDetail'
                     @dialogHide="dialogHide"
                     @showAddProjects='showAddProjects' />
    <!-- 客户详情 -->
    <tenantDetails :detailsdrawershow="detailsShow"
                   :tenantDetail="detailData"
                   :checkData='checkData'
                   ref="tenantDetails"
                   @riskDetailsShowFn="riskDetailsShowFn"
                   @queryExportResult="queryExportResult"
                   @affirmDialog="affirmDialog"
                   @drawerClose="detailsClose"
                   @handleEdit="handleEdit2"
                   v-if="detailsShow" />
    <!-- 风险详情 -->
    <riskDetails :detailsdrawershow="riskDetailsShow"
                 :tenantDetail="detailData"
                 :riskTab="riskTab"
                 @drawerClose="riskDetailsClose" />
    <!-- 合同详情 -->
    <contractsDetails :detailsdrawershow="contractsDetailsShow"
                      :detailData="contractsDetailData"
                      :withdrawalData="withdrawalData"
                      ref="contractsDetails"
                      @openAddDialog="openAddDialog"
                      @drawerClose="detailsCloses"
                      @showTenant="showTenant"
                      @handleEdit="handleEdit2" />
    <el-dialog title="提示"
               :visible.sync="centerDialogVisible"
               class="turnoverDialog"
               width="30%"
               center>
      <span>该客户目前可能未租赁房源，是否继续导入</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <span class="UpBtn1">
          <i>确 定</i>
          <input type="file"
                 @change="imageChange('addapp', $event)"
                 id="imageChange">
        </span>
      </span>
    </el-dialog>
    <!-- 导入错误 -->
    <el-dialog v-if="errorPrompt"
               title="错误提示"
               :visible.sync="errorPrompt">
      <el-table :data="gridData"
                style="min-height: 200px;border-left: 1px solid #eee;border-right: 1px solid #eee;">
        <el-table-column property="fileName"
                         label="导入文件"
                         align="center"></el-table-column>
        <el-table-column label="导入结果"
                         align="center"
                         width="220px">
          <template slot-scope="scope">
            <span style="color: red">{{scope.row.result}}</span>
          </template>
        </el-table-column>
        <el-table-column property="address"
                         label="操作"
                         align="center"
                         width="140px">
          <template slot-scope="scope">
            <span class="export-error"
                  @click="downLoadModel(scope.$index, scope.row,'home')">导出错误提示</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="errorPrompt = false"
                   class="close-button">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import projectDetails from '../../project/projectList/components/projectDetails.vue'
import addBuilding from '../../project/projectList/buildingList/components/addBuilding'
import buildingDetails from '../../project/projectList/buildingList/components/buildingDetails'
import tenantDetails from '../../operationManagement/tenantInfo/components/tenantDetails'
import riskDetails from '../../operationManagement/tenantInfo/components/riskDetails'
import contractsDetails from '@/views/contractManagement/contractsList/components/contractsDetails'
import moment from 'moment'
export default {
  components: {
    projectDetails,
    addBuilding,
    buildingDetails,
    tenantDetails,
    contractsDetails,
    riskDetails
  },
  props: {

  },
  watch: {

  },
  computed: {
    showList () {
      return this.list1 || this.list2 || this.list3
    }
  },
  data () {
    return {
      // 项目
      addProjectShow: false,
      projectDetail: {},
      // 楼宇、
      buildDetailsShow: false,
      tenantDetail: {
        projectManagementDTO: {},
        endWorkDate: null
      },
      contractsListData: [],
      buildingListData: [],
      builddetailsData: {},
      adddialogVisible: false,
      search: {
        organizeId: null,
        organizeName: '',
        projectId: null,
        projectName: null,
        addressOrName: '',
        assetsType: '',
        status: 'USING'
      },
      // 企业客户
      detailsShow: false,
      detailData: {},
      checkData: [],
      errorPrompt: false,
      riskTab: 0,
      riskDetailsShow: false,
      contractsDetailsShow: false,
      contractsDetailData: {},
      withdrawalData: {},
      centerDialogVisible: false,
      flag: false, // flag  true代表经营数据 false税收数据
      shopOption: [],
      workOption: [],
      marketOption: [],
      gridData: [{
        fileName: '',
        result: '',
        id: ''
      }],
      // -----------
      seachIcon: true,
      isFocus: false,
      list1: null,
      list2: null,
      list3: null,
      page1: {
        currentPage: 1,
        total: 0,
        pgSize: 5
      },
      page2: {
        currentPage: 1,
        total: 0,
        pgSize: 5
      },
      page3: {
        currentPage: 1,
        total: 0,
        pgSize: 5
      },
      params: [
        {
          queryType: 'PROJECT',
          queryWork: '',
          size: 5,
          page: 0
        },
        {
          queryType: 'BUILDING',
          queryWork: '',
          size: 5,
          page: 0
        },
        {
          queryType: 'TENANT',
          queryWork: '',
          size: 5,
          page: 0
        }
      ],
      queryString: ''
    }
  },
  mounted () {

  },
  methods: {
    // 项目
    handleEdit (index, id) {
      if (this.hasAuthority('02010102')) {
        this.queryProjectDetail(id)
        this.addProjectShow = true
      }
    },
    async queryProjectDetail (id) {
      let result = await context.http.get(`cms/api/project-managements/${id}`)
      this.projectDetail = result.data
    },
    drawerClose () {
      this.addProjectShow = false
    },
    // 楼宇、
    drawerClose1 () {
      this.buildDetailsShow = false
    },
    showAddProjects () {
      this.addBuildingTitle = '编辑楼宇'
      sessionStorage.setItem('tenantDetail', JSON.stringify(this.tenantDetail))
      this.adddialogVisible = true
    },
    async handleEdit1 (index, id) {
      let result = await context.http.get(`cms/api/buildings/${id}`)
      this.tenantDetail = result.data
      if (this.tenantDetail.endWorkDate) {
        this.tenantDetail.endWorkDate = moment(this.tenantDetail.endWorkDate + '').format('YYYY')
      }
      this.assetId = id
      this.buildDetailsShow = true

      // 查询跟进记录
      // let lineListResult = await context.http.get(`/cms/api/roomsFollowRecord/roomId/${row.id}`, {
      //   zcFollowType: 'BUILDING'
      // })
      // this.timeLineListData = lineListResult.data

      // 查询合同列表
      let contractsResult = await context.http.get(`/cms/api/contracts/building?buildingId=${id}`)
      this.contractsListData = contractsResult.data
      // 查询管理负责人列表
      let buildingResult = await context.http.get(`/cms/api/buildingManageUser/buildingId/${id}`)
      this.buildingListData = buildingResult.data
    },
    async getBuildingListData (id) {
      let buildingResult = await context.http.get(`/cms/api/buildingManageUser/buildingId/${id}`)
      this.buildingListData = buildingResult.data
    },
    async getTenantDetail (id) {
      let result = await context.http.get(`cms/api/buildings/${id}`)
      this.tenantDetail = result.data
      if (this.tenantDetail.endWorkDate) {
        this.tenantDetail.endWorkDate = moment(this.tenantDetail.endWorkDate + '').format('YYYY')
      }
    },
    dialogHide () {
      this.adddialogVisible = false
    },
    // 企业客户
    riskDetailsClose () {
      this.riskDetailsShow = false
    },
    riskDetailsShowFn (i) {
      this.riskTab = i
      this.riskDetailsShow = true
    },
    queryExportResult (id, flag) { // flag  true代表经营数据 false税收数据
      this.flag = flag
      const loading = this.$loading({
        lock: true,
        text: '导入中',
        spinner: 'el-icon-loading el-import-loading',
        customClass: 'loading-icon',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let url = ''
      if (flag) {
        url = `/cms/api/tenantBusiness-excel/detail?excelId=${id}`
      } else {
        url = `/cms/api/tenantTax-excel/detail?excelId=${id}`
      }
      context.http.get(url).then(res => {
        if (res.data.excelResult === '审核中') {
          setTimeout(res => {
            this.queryExportResult(id, flag)
          }, 5000)
        } else if (res.data.excelResult === '失败') {
          this.errorPrompt = true
          this.gridData = [{
            fileName: res.data.name,
            result: res.data.remark,
            id: res.data.id
          }]
          loading.close()
        } else {
          this.$message({
            message: '导入成功！',
            type: 'success'
          })
          // console.log(this.$refs['tenantDetails'].$refs['dynamicComponent1'])
          this.$refs['tenantDetails'].$refs['dynamicComponent1'].queryFn()
          loading.close()
          // this.query()
        }
      })
    },
    queryExportDetail (id) {
      const loading = this.$loading({
        lock: true,
        text: '导入中',
        spinner: 'el-icon-loading el-import-loading',
        customClass: 'loading-icon',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // context.http.get(`/cms/api/tenant-excel/detail?excelId=${id}`).then(res => {
      context.http.get(`/cms/api/tenantTax-excel/detail`).then(res => {
        if (res.data.excelResult === '审核中') {
          setTimeout(res => {
            this.queryExportDetail(id)
          }, 5000)
        } else if (res.data.excelResult === '失败') {
          this.errorPrompt = true
          this.gridData = [{
            fileName: res.data.name,
            result: res.data.remark,
            id: res.data.id
          }]
          loading.close()
        } else {
          this.errorPrompt = false
          this.$message({
            message: '导入成功！',
            type: 'success'
          })
          loading.close()
          this.query()
        }
      })
    },
    async downLoadModel (index, row, isHome) { // isHome首页导入租户报错
      let url = ''
      if (row) { // flag  true代表经营数据 false税收数据
        // if (isHome === 'home') {
        //   url = `/cms/api/tenant-excel/upload?excelId=${row.id}`
        // } else {
        url = this.flag ? `/cms/api/tenantBusiness-excel/upload?excelId=${row.id}` : `/cms/api/tenantTax-excel/upload?excelId=${row.id}`
        // }
      }
      axios({ method: 'GET', url: url, responseType: 'blob' }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        let fileName = res.headers['content-disposition'].substring(20)
        fileName = decodeURI(fileName)
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(url)
      })
    },
    affirmDialog (contractId, tenantId) {
      this.centerDialogVisible = true
      this.contractId = contractId
      this.tenantId = tenantId
      // console.log(contractId, tenantId)
    },
    detailsClose (id) {
      if (!id) {
        this.detailsShow = false
        return
      }
      context.http.get(`/cms/api/contracts/${id}`).then(res => {
        if (res.status === 200) {
          this.contractsDetailData = res.data
          this.detailsShow = false
          this.contractsDetailsShow = true
        }
      })
    },
    handleEdit2 (index, row) {
      let id = row.id
      context.http.get('/cms/api/tenant/' + id).then(res => {
        if (!res.data.building) {
          res.data.building = { id: '', buildingName: '' }
        }
        context.http.get('/cms/api/enterpriseRooms/tenantId/' + id).then(result => {
          this.checkData = result.data
        })
        this.detailData = res.data
        this.detailData.industryIdid = []
        // this.detailData.iDNumber = this.decryptMsg(this.detailData.iDNumber)
        this.detailsShow = true
        this.$nextTick(() => {
          // console.log(this.$refs.tenantDetails)
        })
      })
    },
    showTenant (index, row) {
      let id = row.id
      this.handleEdit(0, id)
      this.contractsDetailsShow = false
    },
    openAddDialog () {
      this.$router.push({ name: 'contractsList', params: { pageFrom: 'TenantInformation' } })
    },
    detailsCloses () {
      this.contractsDetailsShow = false
      this.detailsShow = true
    },
    imageChange (state, event) {
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      form.append('contractId', this.contractId)
      form.append('tenantId', this.tenantId)
      let name = files[0].name
      let index = name.lastIndexOf('.')
      let type = name.substr(index + 1).toLowerCase()
      if (index > 0 && type !== 'xlsx' && type !== 'xls') {
        this.$message({
          message: '格式错误，请上传xlsx格式文件',
          type: 'error'
        })
      } else {
        context.http.post('/cms/api/tenantTurnover/file', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          this.centerDialogVisible = false
          this.$message({
            message: '导入成功！',
            type: 'success'
          })
          this.$refs.tenantDetails.getTurnoverList()// 调用子组件方法从新请求列表
          document.getElementById('imageChange').value = ''
          // this.getTurnoverList()
        }).catch(error => {
          document.getElementById('imageChange').value = ''
          console.info(error)
        })
      }
    },
    // ---------------------------------------------
    closeFn () {
      this.queryString = ''
      this.list1 = null
      this.list2 = null
      this.list3 = null
      this.isFocus = false
      this.seachIcon = true
    },
    seachFn () {
      this.seachIcon = false
      this.$nextTick(() => {
        this.$refs.INPUT.focus()
      })
    },
    current_change (currentPage, type) {
      // console.log(currentPage, type)
      this.querySearch(this.queryString.replace(/\s+/g, ''), true)
    },
    async querySearch (queryString, isCurrentChange) {
      queryString = queryString.replace(/\s+/g, '') // 去掉空格
      if (!queryString || queryString === '') {
        this.list1 = null
        this.list2 = null
        this.list3 = null
        this.isFocus = false
        return false
      }
      this.isFocus = true
      if (!isCurrentChange) {
        this.page1.currentPage = 1
        this.page2.currentPage = 1
        this.page3.currentPage = 1
      }
      let params = this.params.map((item, index) => {
        item.queryWork = this.queryString.replace(/\s+/g, '')
        if (item.queryType === 'PROJECT') {
          item.page = this.page1.currentPage - 1
        } else if (item.queryType === 'BUILDING') {
          item.page = this.page2.currentPage - 1
        } else if (item.queryType === 'TENANT') {
          item.page = this.page3.currentPage - 1
        }
        return item
      })
      let result = await context.http.post('/cms/api/homePage/query', params)
      let data = result.data
      this.list1 = null
      this.list2 = null
      this.list3 = null
      for (let i = 0; i < data.length; i++) {
        if (data[i].queryType === 'PROJECT') {
          this.list1 = data[i]
          this.page1.total = Number(this.list1.page.totalElements)
        } else if (data[i].queryType === 'BUILDING') {
          this.list2 = data[i]
          this.page2.total = Number(this.list2.page.totalElements)
        } else if (data[i].queryType === 'TENANT') {
          this.list3 = data[i]
          this.page3.total = Number(this.list3.page.totalElements)
        }
      }
      // this.$nextTick(() => {
      //   if (!this.queryString || this.queryString === '') {
      //     this.list1 = null
      //     this.list2 = null
      //     this.list3 = null
      //     this.isFocus = false
      //   }
      // })
    },
    formatName (queryType) {
      // PROJECT("项目"),  BUILDING("楼宇"),TENANT("企业");
      if (queryType === 'PROJECT') {
        return '项目'
      } else if (queryType === 'BUILDING') {
        return '楼宇'
      } else if (queryType === 'TENANT') {
        return '企业'
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    }
  }
}
</script>
<style lang="scss">
.seach {
  .el-input {
    &.seachInput {
      .el-input__inner {
        width: 250px;
        height: 30px;
        line-height: 30px;
        border-radius: 15px;
        background-color: #5b7cde;
        color: #fff;
        border: 0;
      }
      .el-input__prefix,
      .el-input__suffix {
        cursor: pointer;
        color: #fff;
        font-size: 18px;
        top: -5px;
      }
    }
  }
  .el-pagination {
    height: 30px;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #2f3f48;
    color: #fff;
  }
  .el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: #999;
  }
  .pagingnum {
    font-size: 14px;
    text-align: center;
    color: #777;
    select {
      width: 70px;
      height: 28px;
      border-radius: 2px;
    }
  }
  .addProjectdialog .el-dialog {
    width: 1000px;
    margin-top: 5vh !important;
    background: #f7f7f7;
    .el-dialog__header {
      background: #fff;
      margin: 0;
      border-bottom: 1px solid #f6f6f6;
      padding: 16px 20px;
      color: #262626;
      .el-dialog__title {
        font-size: 16px;
        font-weight: bolder;
        color: #262626;
      }
    }
    .el-dialog__body {
      margin: 0;
    }
  }
  .buildingDetails {
    .drawer-title {
      line-height: 20px;
    }
    .el-form .el-form-item__content {
      line-height: 20px !important;
    }
  }
  .tenantDetailsClass {
    .tenant-title {
      line-height: 19px;
    }
    .headTabs.headTabs2 .content .item {
      line-height: normal;
    }
    .followUpRecord .timeline .timeLineTitle {
      line-height: normal;
    }
    .followUpRecord .timeline .template p {
      line-height: normal;
    }
    .followUpRecord .timeline .template .enclosure-list {
      line-height: normal;
    }
  }
  .turnoverDialog {
    .el-dialog--center .el-dialog__body {
      padding: 25px 25px 30px !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.my-transition-enter-active {
  transition: all 0.3s ease;
}
.my-transition-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.my-transition-enter, .my-transition-leave-to
/* .slide-fade-leave-active 用于 2.1.8 以下版本 */ {
  width: 0;
  opacity: 0;
}
.seach {
  margin-right: 20px;
  position: relative;
  display: flex;
  align-items: center;
  .searchIcon {
    position: relative;
    top: 0px;
    font-size: 18px;
    color: #fff;
  }
  > .content {
    width: 500px;
    min-height: 100px;
    background-color: #fff;
    position: absolute;
    top: 47px;
    left: 0;
    z-index: 100;
    border-radius: 5px;
    box-shadow: 0px 2px 2px 0px rgba(86, 86, 86, 0.35);
    padding: 30px 20px;
    > div {
      color: #333333;
      font-size: 14px;
      &.noData {
        color: #777;
        text-align: center;
      }
      > p {
        font-size: 16px;
        font-weight: bolder;
        padding-left: 20px;
      }
      > div {
        > .item {
          padding-left: 20px;
          padding-right: 15px;
          display: flex;
          justify-content: space-between;
          cursor: pointer;
          height: 35px;
          align-items: center;
          > span {
            width: 250px;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:nth-child(2) {
              color: #777;
              font-size: 12px;
            }
          }
          &:hover {
            color: #3575f6;
            background-color: #e0edf8;
            i.next {
              background: url(../../../assets/next1.png) no-repeat;
            }
          }
          > div {
            display: flex;
            align-items: center;
            > span {
              width: 100px;
              text-align: right;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            i.next {
              display: block;
              width: 20px;
              height: 20px;
              margin-left: 15px;
              background: url(../../../assets/next.png) no-repeat;
            }
          }
        }
      }
    }
  }
}
</style>
