<template>
    <div class="emergency">
      <span class="page_head_title">应急事项</span>
      <div class="search-bar">
        <div style="display: flex;flex-wrap: wrap;align-items:center">
          <el-select v-model="projectManagementId" placeholder="选择项目" style="width:200px" clearable>
            <el-option
              v-for="item in options1"
              :key="item.id"
              :label="item.referred"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="status" style="width:200px" clearable>
            <el-option label="待处理" value="WAIT"></el-option>
            <el-option label="处理中" value="ONDEAL"></el-option>
            <el-option label="已处理" value="DEALED"></el-option>
          </el-select>
          <el-date-picker
            size="small"
            v-model="startEndTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            clearable
            :editable="false"
            style="width:250px" 
            @change="startEndTimeChange"
            >
          </el-date-picker>
          <div class="query-btn" @click="querySeach">查询</div>
        </div>
        <div class="searbar-left">
          <el-button class="tban tban1"
                      @click="addActivity" v-if="hasAuthority('03020102')"><i class="iconfont icon-crm_xinzeng-"></i> 新增应急事项</el-button>
          <el-button class="tban tban6" @click="exportData" v-if="hasAuthority('03020104')"><i class="iconfont icon-cms_daochushuju-"></i> 导出excel</el-button>
        </div>
      </div>
      <div class="tableList">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="eventCode" label="事项编号" align="center"></el-table-column>
          <el-table-column prop="projectManagementRefferd" label="项目简称" align="center"></el-table-column>
          <el-table-column prop="eventRefferd" label="事项简述" align="center"></el-table-column>
          <el-table-column prop="happenDate" label="发生时间" align="center"  width="200px"></el-table-column>
          <el-table-column prop="followUser" label="跟进人" align="center"></el-table-column>
          <el-table-column label="事项状态" align="center" :formatter="formatStatus"></el-table-column>        
          <el-table-column label="操作"  width="300px" align="center" v-if="hasAuthority('03020101')">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)" class="el-button--primary operation-btn" size="mini">查看</el-button>  
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot1">
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
      <el-dialog title="新增应急事项" :visible.sync="addActivityDialogVisible"  class="addActivityDialog" width="650px" @close="addActivityClose" :close-on-click-modal="false">
        <el-form :model="addData" :rules="addFlowRules" ref="addData">
          <div class="content">
            <p class="title" style="width:100%">基本信息</p>
            <div class="content_main">
              <div class="item">
                <span>项目简称<i class="required">*</i></span>
                <el-form-item prop="projectManagementId">
                <el-select v-model="addData.projectManagementId" placeholder="选择项目" style="width:240px" clearable>
                  <el-option
                    v-for="item in options1"
                    :key="item.id"
                    :label="item.referred"
                    :value="item.id">
                  </el-option>
                </el-select>
                </el-form-item>
              </div>
              <div class="item">
                <span>事项简述<i class="required">*</i></span>
                <el-form-item prop="eventRefferd">
                  <el-input style="width:240px" v-model="addData.eventRefferd" placeholder="请输入内容" maxlength="30"></el-input>
                </el-form-item>
              </div>
              <div class="item">
                <span>发生时间<i class="required">*</i></span>
                <el-form-item prop="happenDate" >
                  <el-date-picker
                    v-model="addData.happenDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    :editable="false"
                    style="width:240px"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </div>
              <div class="item">
                <span>发生地点<i class="required">*</i></span>
                <el-form-item prop="happenPlace">
                  <el-input style="width:240px" v-model="addData.happenPlace" maxlength="20" placeholder="请输入内容"></el-input>
                </el-form-item>
              </div>
              <div class="item">
                <span>跟进人<i class="required">*</i></span>
                <el-form-item prop="followUser">
                  <el-input style="width:240px" v-model="addData.followUser" maxlength="10" placeholder="请输入内容"></el-input>
                </el-form-item>
              </div>
              <div class="item">
                <span>事项状态<i class="required">*</i></span>
                <el-form-item prop="eventStatus">
                  <el-select v-model="addData.eventStatus" style="width:240px">
                    <el-option label="待处理" value="WAIT"></el-option>
                    <el-option label="处理中" value="ONDEAL"></el-option>
                    <el-option label="已处理" value="DEALED"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="item">
                <span>事项详情</span>
                <el-form-item prop="eventContent">
                  <el-input type="textarea" :rows="3" placeholder="请输入内容"  v-model="addData.eventContent" maxlength="80" style="width:240px"></el-input>
                </el-form-item>
              </div>
              <div class="item">
                <span>处理结果</span>
                <el-form-item prop="result">
                  <el-input type="textarea" :rows="3" placeholder="请输入内容"  v-model="addData.result" maxlength="80" style="width:240px"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="collapse">
            <el-collapse v-model="activeNames">
              <el-collapse-item name="1">
                <template slot="title">
                  <div class="collapseTitle">
                    <span>附件</span>
                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <span class="iconfont icon-moreif"></span>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                          <span class="iconfont icon-attachment">
                            <aliUpload class="aliUpload emergencyAliUpload" style="display: inline-block;"
                              :upLoadText="upLoadText_data"
                              :fileSize="fileSize"
                              :fileType="fileType_data"
                              :iconShow="false"
                              @setAnnex="setAnnex_data"
                            />
                          </span>
                          </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </template>
                <div class="collapseContent">
                  <div v-for="(item,index) in addData.annexes" :key="index">
                    <span>{{item.annexName}}</span>
                    <span>
                      <aliDownLoad  :item="item" style="margin-right:10px;display: inline-block;width:auto;height:auto"/>
                      <i class="iconfont icon-lajixiang" @click="dataDel(index)"></i>
                    </span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addActivityClose" class="close-button">关 闭</el-button>
          <el-button type="primary" @click="saveaddActivityFrom('addData')" class="defaultbtn dialog-confirmBtn">确 定</el-button>
        </div>
      </el-dialog>
      <!-- ------------------------------------------------------------------------------------------------------------------------------------------ -->
      <!-- ------------------------------------------------------------------------------------------------------------------------------------------ -->
      <!-- ------------------------------------------------------------------------------------------------------------------------------------------ -->
      <!-- ------------------------------------------------------------------------------------------------------------------------------------------ -->
      <el-drawer :visible.sync="detailsdrawershow"  :append-to-body="true" :wrapperClosable="false" size="800px"  @close="onHide"  class="addActivityDialog1">
        <div slot="title" class="drawerTitle">
          <p>{{readOnly?'应急事项详情':'编辑应急事项'}}</p>
          <span class="editBtn" @click="onEdit" v-if="readOnly && hasAuthority('03020103')"> <i class="icon icon-edit2"></i> 编辑 </span>
        </div>
        <div class="drawBody content">
          <el-form :model="detailData" :rules="addFlowRules" ref="detailData">
          <p class="title" style="width:100%">基本信息</p>
            <div class="content_main">
              <div class="item">
                <span>项目简称<i class="required">*</i></span>
                <el-form-item prop="projectManagementId">
                <el-select v-model="detailData.projectManagementId" placeholder="选择项目" style="width:240px" clearable v-if="!readOnly">
                  <el-option
                    v-for="item in options1"
                    :key="item.id"
                    :label="item.referred"
                    :value="item.id">
                  </el-option>
                </el-select>
                <p class="readOnlyTxt" v-else>{{detailData.projectManagementRefferd}}</p>
                </el-form-item>
              </div>
              <div class="item">
                <span>事项简述<i class="required">*</i></span>
                <el-form-item prop="eventRefferd" >
                  <el-input style="width:240px" v-model="detailData.eventRefferd" placeholder="请输入" maxlength="30" v-if="!readOnly"></el-input>
                  <p class="readOnlyTxt" v-else>{{detailData.eventRefferd}}</p>
                </el-form-item>
              </div>
              <div class="item">
                <span>发生时间<i class="required">*</i></span>
                <el-form-item prop="happenDate" >
                  <el-date-picker
                    v-if="!readOnly"
                    v-model="detailData.happenDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    :editable="false"
                    style="width:240px"
                    placeholder="选择日期">
                  </el-date-picker>
                  <p class="readOnlyTxt" v-else>{{detailData.happenDate}}</p>
                </el-form-item>
              </div>
              <div class="item">
                <span>发生地点<i class="required">*</i></span>
                <el-form-item prop="happenPlace">
                  <el-input style="width:240px" v-model="detailData.happenPlace" maxlength="20" placeholder="请输入内容" v-if="!readOnly"></el-input>
                  <p class="readOnlyTxt" v-else>{{detailData.happenPlace}}</p>
                </el-form-item>
              </div>
              <div class="item">
                <span>跟进人<i class="required">*</i></span>
                <el-form-item prop="followUser">
                  <el-input style="width:240px" v-model="detailData.followUser" maxlength="10" placeholder="请输入内容" v-if="!readOnly"></el-input>
                  <p class="readOnlyTxt" v-else>{{detailData.followUser}}</p>
                </el-form-item>
              </div>
              <div class="item">
                <span>事项状态<i class="required">*</i></span>
                <el-form-item prop="eventStatus">
                  <el-select v-model="detailData.eventStatus" style="width:240px" v-if="!readOnly">
                    <el-option label="待处理" value="WAIT"></el-option>
                    <el-option label="处理中" value="ONDEAL"></el-option>
                    <el-option label="已处理" value="DEALED"></el-option>
                  </el-select>
                  <p class="readOnlyTxt" v-else>{{formatEventStatus(detailData.eventStatus)}}</p>
                </el-form-item>
              </div>
              <div class="item">
                <span>事项详情</span>
                <el-form-item prop="eventContent">
                  <el-input type="textarea" :rows="3" placeholder="请输入内容"  v-model="detailData.eventContent" maxlength="80" style="width:240px" v-if="!readOnly"></el-input>
                  <p class="readOnlyTxt" v-else style="word-wrap: break-word;word-break: normal;">{{detailData.eventContent}}</p>
                </el-form-item>
              </div>
              <div class="item">
                <span>处理结果</span>
                <el-form-item prop="result">
                  <el-input type="textarea" :rows="3" placeholder="请输入内容"  v-model="detailData.result" maxlength="80" style="width:240px" v-if="!readOnly"></el-input>
                  <p class="readOnlyTxt" v-else style="word-wrap: break-word;word-break: normal;">{{detailData.result}}</p>
                </el-form-item>
              </div>
            </div>
            </el-form>
        </div>
        <div class="collapse">
              <el-collapse v-model="activeNames" @change="collapseChange">
                <el-collapse-item name="1">
                  <template slot="title">
                    <div class="collapseTitle">
                      <span>附件</span>
                      <el-dropdown v-if="!readOnly">
                        <span class="el-dropdown-link">
                          <span class="iconfont icon-moreif"></span>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item>
                            <span class="iconfont icon-attachment">
                              <aliUpload class="aliUpload emergencyAliUpload" style="display: inline-block;"
                                :upLoadText="upLoadText_data"
                                :fileSize="fileSize"
                                :fileType="fileType_data"
                                :iconShow="false"
                                @setAnnex="setAnnex_data1"
                              />
                            </span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </template>
                  <div class="collapseContent">
                    <div v-for="(item,index) in detailData.annexes" :key="index">
                      <span>{{item.annexName}}</span>
                      <span>
                        <aliDownLoad  :item="item" style="margin-right:10px;display: inline-block;width:auto;height:auto"/>
                        <i class="iconfont icon-lajixiang" @click="dataDel1(index)" v-if="!readOnly"></i>
                      </span>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
        <div class="btndiv" style="margin-top: 50px; display: flex; flex-direction: row-reverse;padding-right: 30px;">
          <el-button type="primary" style="width:100px;margin-left: 25px;" @click="confirm('detailData')" v-if="!readOnly">确认</el-button>
          <el-button style="width:100px" @click="onHide">关闭</el-button>
        </div>  
      </el-drawer>
    </div>
</template>

<script>
  import context from '@/service'
  import axios from 'axios'
  import aliUpload from '@/components/aliUpload.vue'
  import aliDownLoad from '@/components/aliDownLoad.vue'
  export default {
    name: 'emergency',
    components: {
      aliDownLoad,
      aliUpload
    },
    created () {
      this.options1 = this.$store.state.projectManagementsList
      this.query()
      // 。
    },
    data () {
      return {
        detailData: { // 详情   编辑详情
        },
        detailsdrawershow: false,
        readOnly: true,
        fileType_data: ['docx', 'doc', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'png', 'jpg'],
        fileSize: 100,
        upLoadText_data: '上传附件',
        activeNames: '1',
        addActivityDialogVisible: false,
        addData: {
          projectManagementId: null,
          eventRefferd: null,
          happenDate: null,
          happenPlace: null,
          followUser: null,
          eventStatus: null,
          eventContent: null,
          result: null,
          annexes: []
        },
        addFlowRules: {
          projectManagementId: [
          { required: true, message: '请选择项目简称', trigger: 'change' }
          ],
          eventRefferd: [
          { required: true, message: '请输入事项简述', trigger: 'change' }
          ],
          happenDate: [
          { required: true, message: '请选择发生时间', trigger: 'change' }
          ],
          happenPlace: [
          { required: true, message: '请输入发生地点', trigger: 'change' }
          ],
          followUser: [
          { required: true, message: '请输入跟进人', trigger: 'change' }
          ],
          eventStatus: [
          { required: true, message: '请选择事项状态', trigger: 'change' }
          ]
        },
        projectManagementId: '',
        status: '',
        startEndTime: '',
        startDate: '',
        endDate: '',
        tableData: [],
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
        ]
      }
    },
    methods: {
      collapseChange (n) {
        console.log(n)
      },
      async exportData () {
        axios({method: 'GET', url: '/cms/api/emergency/report', params: {projectManagementId: this.projectManagementId, eventStatus: this.status, endDate: this.endDate, startDate: this.startDate}, responseType: 'blob'}).then(res => {
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
      onEdit () {
        this.readOnly = false
      },
      async confirm (formName) { // 编辑提交岗位信息
        let _this = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            context.http.put('cms/api/emergency', this.detailData).then(res => {
              if (res) {
                _this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                _this.onHide()
                _this.query()
              }
            }).catch(err => {
              if (err) {
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      onHide () {
        this.readOnly = true
        this.detailsdrawershow = false
        this.$refs['detailData'].resetFields()
      },
      dataDel (index) {
        this.addData.annexes.splice(index, 1)
      },
      dataDel1 (index) {
        this.detailData.annexes.splice(index, 1)
      },
      handleEdit (index, row) { // 查看
        context.http.get(`/cms/api/emergency/${row.id}`).then(res => {
          this.detailData = res.data
          this.detailsdrawershow = true
          this.activeNames = ['1']
        }).catch(error => {
          console.log(error)
        })
      },
      setAnnex_data (annexURL, annexName) { // 资料存档上传
        this.addData.annexes.push({
          annexURL: annexURL,
          annexName: annexName
        })
      },
      setAnnex_data1 (annexURL, annexName) { // 资料存档上传
        this.detailData.annexes.push({
          annexURL: annexURL,
          annexName: annexName
        })
      },
      saveaddActivityFrom (formName) { // 新增应急事项
        let _this = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            context.http.post('/cms/api/emergency', this.addData).then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '新增成功'
                })
                _this.addActivityClose()
                _this.query()
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      addActivityClose () {
        this.addActivityDialogVisible = false
        this.addData.annexes = []
        this.$refs['addData'].resetFields()
      },
      addActivity () { // 新增活动
        this.addActivityDialogVisible = true
      },
      async query () {
        let param = {
          projectManagementId: this.projectManagementId,
          eventStatus: this.status,
          endDate: this.endDate,
          startDate: this.startDate,
          page: (this.currentPage - 1),
          size: this.pgSize
          // sort: 'startDate,id,desc'
        }
        let result = await context.http.get('/cms/api/emergency', param)
        this.tableData = result.data
        this.total = Number(result.headers['x-total-count'])
      },
      current_change (currentPage) {
        this.currentPage = currentPage
        this.query()
      },
      currentSel () {
        this.currentPage = 1
        this.query()
      },
      formatStatus (row, column) {
        switch (row.eventStatus) {
          case 'WAIT':
            return '待处理'
          case 'ONDEAL':
            return '处理中'
          case 'DEALED':
            return '已处理'
        }
      },
      formatEventStatus (eventStatus) {
        switch (eventStatus) {
          case 'WAIT':
            return '待处理'
          case 'ONDEAL':
            return '处理中'
          case 'DEALED':
            return '已处理'
        }
      },
      hasAuthority (code) {
        return context.user.hasAuthority(code)
      // return true
      },
      formatTime (row, column) {
        return row.startDate + ' - ' + row.endDate
      },
      startEndTimeChange (time) {
        if (time) {
          this.startDate = time[0]
          this.endDate = time[1]
        } else {
          this.startDate = null
          this.endDate = null
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
.emergencyAliUpload{
  .oss_file{
    width: 60px;
    height: auto;
    border:none;
    color:#888;
  }
}
.addActivityDialog1{
    .el-collapse-item__header{
      height: 40px;
      line-height: 40px;
      background-color: #FAFAFA;
      font-size: 14px;
    }
    .collapse{
      margin: 0 20px;
      border-left:1px solid #eeeeee; 
      border-right:1px solid #eeeeee; 
      .collapseTitle{
        padding: 0 15px;
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      .collapseContent{
        >div{
          padding: 0 15px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #eeeeee;
          >span{
            i{
              cursor: pointer;
            }
            &:first-child{
              display: inline-block;
              width: 300px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
    .content{
      border: 1px solid #eee;
      margin: 20px;
      .title{
        height: 40px;
        line-height: 40px;
        background-color: #FAFAFA;
        font-size: 14px;
        padding-left: 15px;
      }
      .content_main{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 20px;
        .item{
          flex-direction:column;
        >span{
          display: block;
          margin-bottom: 5px;
        }
        .readOnlyTxt{
              width: 240px;
              font-size: 12px;
              color: #999;
              padding: 8px;
            }
      }
      }
    }
}
.emergency{
  .el-dialog__body{
    margin: 0;
    padding-bottom: 20px!important;
  }
  .el-collapse-item__header{
    height: 40px;
    line-height: 40px;
    background-color: #FAFAFA;
    font-size: 14px;
  }
  .el-dialog__header{
    margin: 0 20px;
  }
  .addActivityDialog{
    .content{
      .item{
        >.el-date-editor,>.el-select,>.el-textarea{
          margin-bottom: 22px;
        }
        .el-textarea textarea{
          height: auto!important;
        }
      }
    }
  }
  .el-button{
    padding: 7px 20px;
    font-size: 14px!important;
    &::before{
      font-size: 16px;
      margin-right: 6px;
    }
    &.icon-xiazai1{
      color: #9EC469;
      &:hover{
        border-color: #b8e47b;
        background-color: #b8e47b;
        color: #fff;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.emergency{
  .collapseTitle{
    padding: 0 15px;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .collapseContent{
    padding: 0 15px;
    >div{
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      >span{
        i{
          cursor: pointer;
        }
        &:first-child{
          display: inline-block;
          width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .addActivityDialog{
    .collapse{
      margin: 0 20px;
      border-left:1px solid #eeeeee; 
      border-right:1px solid #eeeeee; 
    }
    .content{
      border: 1px solid #eee;
      margin: 20px;
      .title{
        height: 40px;
        line-height: 40px;
        background-color: #FAFAFA;
        font-size: 14px;
        padding-left: 15px;
      }
      .content_main{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 20px;
        .item{
          flex-direction:column;
        >span{
          display: block;
          margin-bottom: 5px;
        }
      }
      }
    }
  }
  .seachDiv{
    background-color: #ffffff;
    margin-top: 15px;
    border-radius:5px; 
    box-shadow: 4px 4px 4px 1px #eee;
    display: flex;
    padding: 0 20px;
    justify-content: space-between;
    flex-wrap: wrap;
    > div {
      > div {
        margin-right: 20px;
      }
    }
  }
  .query-btn{
    display: inline-block;
  }
  .addbtn{
    margin-top: 0;
    width: 120px;
    // margin-left: 340px;
  }
  .tableList{
    border-top: 1px solid #eee;
    padding: 1px;
  }
}
</style>
