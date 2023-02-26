<template>
  <div class="point-list">
    <span class="page_head_title">多种经营</span>
    <ul class="default_tab_block">
        <li v-if="hasAuthority('02030501')"
            @click="switchover('income')">
          <span>多经账单</span>
        </li>
        <li v-if="hasAuthority('02030510')"
            @click="switchover('contract')">
          <span>多经合同</span>
        </li>
        <li v-if="hasAuthority('02030515')"
            class="active">
          <span>多经点位</span>
        </li>
      </ul>
    <div class="pl-content">
      <div class="search-bar">
        <div style="display: flex;flex-wrap: wrap;align-items:center">
          <el-select :clearable="true"
                   v-model="projectManagementId"
                   placeholder="项目简称">
          <el-option v-for="item in projectManagement"
                     :key="item.id"
                     :label="item.referred"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select :clearable="true"
                   v-model="pointType"
                   placeholder="点位类型">
          <el-option v-for="item in pointTypeOptions"
                     :key="item.id"
                     :label="item.value"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-input
                  v-model="pointName"
                  placeholder="点位名称"></el-input>
        <el-select :clearable="true"
                   v-model="useStatus"
                   placeholder="点位状态">
          <el-option v-for="item in pointStatusOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <div class="query-btn"
             @click="querySearch">查询</div>
        </div>
        

        <div style="display: flex">
          
        <el-button class="tban tban1"
                         v-if="hasAuthority('02030516')"
               @click="newPipeline"><i class="iconfont icon-crm_xinzeng-"></i> 新增点位</el-button>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%">
          <el-table-column label="点位图片"
                           align="center">
            <template slot-scope="scope">
              <img v-if="scope.row.imgs.length"
                   :src="scope.row.imgs[0]"
                   alt=""
                   style="max-width:112px;max-height:88px">
            </template>
          </el-table-column>
          <el-table-column prop="projectName"
                           label="项目简称"
                           align="center"></el-table-column>
          <el-table-column prop="pointCode"
                           label="点位编号"
                           align="center"></el-table-column>
          <el-table-column prop="pointName"
                           label="点位名称"
                           align="center"></el-table-column>
          <el-table-column prop="pointTypeName"
                           label="点位类型"
                           align="center"></el-table-column>
          <el-table-column prop="description"
                           label="点位描述"
                           align="center"></el-table-column>
          <el-table-column label="操作"
                           align="center">
            <template slot-scope="scope">
              <el-button v-if="hasAuthority('02030518')"
                         @click="handleEdit(scope.$index, scope.row)"
                         class="el-button--primary operation-btn"
                         size="mini">查看</el-button>
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
                       :current-page="currentPage"
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
    </div>

    <el-dialog v-if="flowDialogVisible"
               title="新增点位"
               :visible.sync="flowDialogVisible"
               class="flowDialog">
      <el-form :model="addData"
               :rules="addFlowRules"
               ref="addFlowform">
        <div class="dl-subtitle">
          <p>项目<span class="required">*</span></p>
          <el-form-item prop="projectId">
            <el-select v-model="addData.projectId"
                       value-key="id"
                       placeholder="请选择">
              <el-option value="">请选择</el-option>
              <el-option v-for="item in projectManagements"
                         :key="item.id"
                         :label="item.referred"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="dl-subtitle">
          <p>点位编号<span class="required">*</span></p>
          <el-form-item prop="pointCode">
            <el-input placeholder="请输入编号"
                      maxlength="20"
                      v-model="addData.pointCode"
                      type="text"
                      @input.native="changeCode">
            </el-input>
          </el-form-item>
        </div>
        <div class="dl-subtitle">
          <p>点位名称<span class="required">*</span></p>
          <el-form-item prop="pointName">
            <el-input placeholder="请输入内容"
                      maxlength="20"
                      v-model="addData.pointName"
                      type="text">
            </el-input>
          </el-form-item>
        </div>
        <div class="dl-subtitle">
          <p>点位类型<span class="required">*</span></p>
          <el-form-item prop="pointType">
            <el-select v-model="addData.pointType"
                       value-key="id"
                       placeholder="请选择">
              <el-option value="">请选择</el-option>
              <el-option v-for="item in pointTypeOptions"
                         :key="item.id"
                         :label="item.value"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div style="height:112px"
             class="dl-subtitle">
          <p>点位描述</p>
          <el-form-item prop="description">
            <el-input class="point-textarea"
                      v-model="addData.description"
                      resize="none"
                      maxlength="50"
                      placeholder="请输入内容"
                      type="textarea">
            </el-input>
          </el-form-item>
        </div>
        <div style="height:auto"
             class="dl-subtitle upLoadDiv">
          <p>点位图片（{{addData.imgs.length}}/5）</p>
          <div>
            <div class="imgList"
                 v-for="(item,index) in addData.imgs"
                 :key="index">
              <div class="item">
                <img :src="item"
                     alt="">
                <i class="el-icon-error"
                   @click="deleteFn(item,index)"></i>
              </div>
            </div>
            <div class="upLoadComponents"
                 v-if="addData.imgs.length<5">
              <aliUpload class="aliUpload"
                         :upLoadText="upLoadText"
                         :fileType="fileType"
                         :iconShow="false"
                         @setAnnex="setAnnex" />
            </div>
          </div>
        </div>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="flowDialogVisible = false"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="addPipeline('addFlowform', '')"
                   class="defaultbtn dialog-confirmBtn">确 认</el-button>
      </div>
    </el-dialog>

    <pointDetails v-if="detailsdrawershow"
                  :detailsdrawershow="detailsdrawershow"
                  :detailsData="flowDetailsData"
                  :projectManagement="projectManagements"
                  :pointTypeOptions="pointTypeOptions"
                  :pointStatusOptions="pointStatusOptions"
                  @queryUpdate="query"
                  @drawerClose="drawerClose" />

  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import aliUpload from '@/components/aliUpload.vue'
import pointDetails from './components/pointDetails'
import { toLocaleString } from '@/utils/validate.js'
export default {
  name: 'point',
  components: {
    pointDetails,
    aliUpload
  },
  data () {
    return {
      accountEntry: true,
      adddialogVisible: false,
      detailsdrawershow: false,
      flowDialogVisible: false,
      flowExplain: '',
      addData: {
        imgs: []
      },
      addFlowRules: {
        projectId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        pointCode: [
          { required: true, message: '请填写点位编号', trigger: 'blur' }
        ],
        pointName: [
          { required: true, message: '请填写点位名称', trigger: 'blur' }
        ],
        pointType: [
          { required: true, message: '请选择点位类型', trigger: 'change' }
        ]
      },
      tableData: [],
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      flowDetailsData: {},
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
      projectManagementId: '', // 商圈
      projectManagement: [],
      projectManagements: [],
      pointType: '',
      pointTypeOptions: [],
      useStatus: 'USING',
      pointStatusOptions: [
        { value: 'USING', label: '使用中' },
        { value: 'DISABLE', label: '已停用' }
      ],
      pointName: '',
      upLoadText: '上传图片',
      flag: true,
      fileType: ['png', 'jpg', 'jpeg']
    }
  },
  created () {
    this.getProjectOptions()
    this.getDataAuthorityOptions()
    this.getFeeType()
    this.query()
  },
  mounted () { },
  methods: {
    async getProjectOptions () {
      let result = await context.http.get('cms/api/project-managements', { page: 0, size: 100, sort: 'desc', useStatus: 'USING' })
      this.projectManagement = result.data
    },
    getDataAuthorityOptions () {
      context.http.get('/cms/api/project-managements', { useStatus: 'USING' }).then(res => {
        this.projectManagements = res.data
      })
    },
    changeCode () {
      this.$nextTick(() => {
        if (this.addData.pointCode) {
          this.addData.pointCode = this.addData.pointCode.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g, '')
        }
      })
    },
    async getFeeType () {
      let result1 = await context.http.get('/uaa/api/paramet-managements/name', { name: '点位类型' })
      this.pointTypeOptions = result1.data
    },
    deleteFn (item, index) {
      this.addData.imgs.splice(index, 1)
    },
    setAnnex (annexURL) {  // 子组件上传成功返回文件url 和名字
      this.addData.imgs.push(annexURL)
    },
    querySearch () {
      this.currentPage = 1
      this.query()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    switchover (state) {
      if (state === 'contract') {
        this.$router.push({ name: 'MultipleContract' })
      } else if (state === 'income') {
        this.$router.push({ name: 'incomeList' })
      }
    },
    drawerClose () {
      this.detailsdrawershow = false
    },
    async newPipeline () {
      this.flowDialogVisible = true
    },
    addPipeline (formName) {
      if (this.flag) {
        this.flag = false
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('add', this.addData)
            let data = JSOG.parse(JSOG.stringify(this.addData))
            let _this = this
            context.http.post('/cms/api/management-points', data).then(res => {
              if (res) {
                _this.flowDialogVisible = false
                _this.query()
                _this.addData = {
                  imgs: []
                }
              }
              this.flag = true
              // test
            })
          } else {
            this.flag = true
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    async handleEdit (index, row) {
      let result = await context.http.get(`/cms/api/management-points/${row.id}`)
      this.flowDetailsData = result.data
      this.detailsdrawershow = true
    },
    async query (type, index) {
      if (index) this.currentPage = index
      let result = await context.http.get('cms/api/management-points', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'id,desc',
        pointName: this.pointName,
        pointType: this.pointType,
        useStatus: this.useStatus,
        projectId: this.projectManagementId
      })
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
    }
  }
}
</script>
<style lang="scss">
.point-list {
  .el-dialog {
    width: 750px;
  }
  .point-textarea {
    textarea {
      height: 100px;
    }
  }
  .oss_file {
    border: none !important;
    height: 100px;
    width: 100%;
    line-height: 130px;
    color: #3577f6;
    font-size: 12px;
  }
}
</style>
<style scoped lang="scss">
.point-list {
  font-size: 14px;
  background-color: #f9f9f9;

  .pl-content {
    width: 100%;
    margin: 0 auto;
    .search-bar {
      .el-input {
          width: 140px !important;
        }
        .el-select {
          width: 144px !important;
        }
      .swbtn {
        margin-left: 16px;
        font-size: 18px;
        width: 100px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-size: 18px;
        color: #000;
        background-color: #fff;
        margin-left: 16px;
        border-radius: 10px;
        cursor: pointer;
      }
      .btnselect {
        color: #fff;
        background-color: #42506c;
      }
      div {
        cursor: pointer;
      }
    }
    .bd-statistics {
      background-color: #fff;
      margin-bottom: 10px;
      box-shadow: 1px 2px 5px #eee;
      .statistics-title {
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        color: #333;
        font-weight: bold;
        padding-left: 20px;
        border-bottom: 1px solid #ededef;
      }
      .statistics-content {
        .contentItem {
          display: inline-block;
          padding: 20px 0 20px 20px;
        }
        .bd-number {
          margin-left: 6px;
          padding-right: 20px;
          font-size: 14px;
          font-weight: 400;
          font-family: PingFangSC;
          color: #353b4b;
          display: inline-block;
          min-width: 90px;
          .ci-title {
            font-weight: 400;
            height: 25px;
            line-height: 25px;
            color: #828692;
            font-size: 12px;
          }
          .ci-value {
            display: inline-block;
            font-size: 20px;
            margin-top: 4px;
          }
        }
        .borderstrip {
          width: 2px;
          height: 35px;
          background-color: #ecedef;
          display: inline-block;
          margin-top: 6px;
        }
      }
    }
    .plc-table {
      position: relative;
      .export {
        position: absolute;
        right: 20px;
        top: 5px;
        z-index: 9;
        span {
          display: inline-block;
          width: 60px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          /*background: rgba(222, 235, 254, 1);
          color: #5b9af8;
          opacity: 0.9;
          border-radius: 4px;*/
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
    .rent-control {
      border: 1px solid #96d050;
      background-color: #fff;
      color: #96d050;
      &:hover {
        background-color: #96d050;
        color: #fff;
      }
    }
    .editbtn {
      color: #3175d2;
      &:hover {
        color: #fff;
      }
    }
  }
  .ctc-foot {
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    padding: 60px 0 30px 20px;
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: #2f3f48;
      color: #fff;
    }
    .el-pagination.is-background .el-pager li:not(.disabled):hover {
      color: #999;
    }
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
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #d9dce2;
  }
  .el-table__row div {
    white-space: nowrap;
    .buildingImage {
      width: 120px;
      margin: 0 auto;
    }
  }
  .flowDialog {
    .dl-subtitle {
      display: block;
      width: 80%;
      margin: 20px auto 0;
      display: flex;
      height: 40px;
    }
    p {
      width: 110px;
      text-align: right;
      line-height: 40px;
      height: 40px;
      margin-right: 30px;
    }
    .el-form-item {
      margin: 0;
      flex: 1;
      .el-select {
        width: 100%;
      }
    }
    .upLoadDiv {
      margin-bottom: 20px;
      p {
        width: 110px;
        text-align: right;
      }
      > div {
        flex: 1;
      }
      .imgList {
        margin-right: 15px;
        margin-bottom: 10px;
        float: left;
        .item {
          width: 115px;
          height: 87px;
          position: relative;
          border: 1px solid #cecdcd;
          text-align: center;
          img {
            max-width: 113px;
            max-height: 85px;
          }
          > i {
            cursor: pointer;
            font-size: 20px;
            color: #b7b2b2;
            position: absolute;
            right: -10px;
            top: -10px;
          }
        }
      }
      .upLoadComponents {
        width: 115px;
        float: left;
        height: 87px;
        border: 1px dashed #d0d0d0ff;
        background: url(../../../../assets/plus.png) no-repeat center;
        .aliUpload {
        }
      }
    }
  }
}
.menu {
  height: 62px;
  line-height: 62px;
  border-bottom: 1px solid #eeeeee;
  margin-top: 15px;
  margin-bottom: 20px;
  background-color: #ffffff;
  // padding-left: 20px;
  span {
    display: inline-block;
    width: 200px;
    height: 62px;
    text-align: center;
    cursor: pointer;
    &.active {
      border-bottom: 3px solid #3577f6;
      color: #3577f6;
    }
  }
}
.el-autocomplete {
  width: 100%;
}
</style>
