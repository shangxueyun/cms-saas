<template>
  <el-drawer
    size="900px"
    :visible.sync="drawerShow"
    :direction="direction"
    :before-close="handleClose"
    :wrapperClosable="false"
  >
    <div slot="title" class="drawerTitle">
      <p style="font-size: 16px">备份数据记录</p>
      <span class="editBtn" @click="onAdd">
        <i class="iconfont icon-crm_xinzeng-"></i>
        <span>新增记录</span>
      </span>
    </div>
    <div class="search">
      <el-select
        v-model="seach.projectManagementId"
        filterable
        size="small"
        placeholder="项目简称"
      >
        <el-option
          v-for="item in tenantOption"
          :key="item.id"
          :label="item.referred"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-date-picker
        type="date"
        class="screen"
        value-format="yyyy-MM-dd"
        v-model="seach.startTime"
        clearable
        size="small"
        :picker-options="pickerBeginDayBefore"
        :editable="false"
        placeholder="上传时间"
        style="margin-right: 0"
      >
      </el-date-picker>
      <span style="color: #dadada; padding: 0 4px">—</span>
      <el-date-picker
        type="date"
        class="screen"
        :editable="false"
        clearable
        size="small"
        value-format="yyyy-MM-dd"
        v-model="seach.endTime"
        :picker-options="pickerBeginDayAfter"
        placeholder="上传时间"
      >
      </el-date-picker>
      <span class="query-btn" @click="queryRules">查询</span>
    </div>
    <div class="main_content">
      <div class="half_page_title" style="width: 100%">
        <div><i></i>数据记录</div>
      </div>
      <div class="plc-table">
        <el-table style="width: 100%" :data="tableData">
          <el-table-column
            label="项目简称"
            align="center"
            prop="projectManagementName"
          >
          </el-table-column>
          <el-table-column
            label="上传时间"
            prop="createTime"
            :formatter="createTimeFormat"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="userName"
            label="操作人"
            align="center"
          ></el-table-column>
          <el-table-column
            v-if="hasAuthority('02050405')"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <span class="view-btn" v-if="scope.row.annexURL && scope.row.annexName">
                <ailPreview
                  :ailObj="scope.row"
                  :encrypt="true"
                  @setFile="setFile"
                />
                <aliDownLoad :item="scope.row" :encrypt="true" />
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 预览图片 -->
    <picturePrevie
      v-if="showPicture"
      :imgList="imgArr"
      :num="num"
      @pictureClose="pictureClose"
    ></picturePrevie>
    <!-- 新增数据备份 -->
    <el-dialog
      title="新增数据备份"
      :visible.sync="addBackupShow"
      width="600px"
      :append-to-body="true"
      @close="addBackupClose"
      :close-on-click-modal="false"
      class="el_dialog_new"
    >
      <div class="dialog">
        <div class="item">
          <div class="dialog_item_title">项目简称<i class="required">*</i></div>
          <el-select
            v-model="addInfo.projectManagementId"
            filterable
            size="small"
            placeholder="项目简称"
          >
            <el-option
              v-for="item in tenantOption"
              :key="item.id"
              :label="item.referred"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <div class="item">
          <div class="dialog_item_title">
            附件<i class="required">*</i>
            <aliUpload
              v-if="!addInfo.annexName"
              :upLoadText="upLoadText_cost"
              :fileType="fileType_cost"
              @setAnnex="setAnnex"
            >
            </aliUpload>
          </div>
          <div class="dialog_item_info" v-if="addInfo.annexName">
            <span class="dialog_item_info_box">
              <svg class="icon" v-if="addInfo.annexName" aria-hidden="true">
                <use :xlink:href="getformat2(addInfo.annexName)"></use>
              </svg>
              <span class="dialog_item_info_name" :title="addInfo.annexName">{{
                addInfo.annexName
              }}</span>
            </span>
              <span class="deleteImg" @click="deleLogo"
                ><i class="el-icon-delete"></i
              ></span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <span @click="hideAddBackup" class="details_cannelBtn"
          >取消</span
        >
        <span
          class="details_submitBtn"
          style="margin: 6px 10px 6px 0"
          @click="dialogVisible"
          >确定</span
        >
      </span>
    </el-dialog>
    <div class="ctc-foot1" v-if="total > 0">
      <span
        ><span style="margin-right: 10px"
          >{{ currentPage }}/{{ totalPages }}页</span
        >
        共{{ total }}条记录</span
      >
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pgSize"
        :total="total"
        :current-page="currentPage"
        @current-change="current_change"
      >
      </el-pagination>
      <div class="pagingnum">
        显示
        <select v-model="pgSize" @change="currentSel">
          <option
            v-for="item in pgNumoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></option>
        </select>
        条目
      </div>
    </div>
  </el-drawer>
</template>

<script>
import axios from 'axios'
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import { getformat } from '@/utils/validate.js'
import aliDownLoad from '@/components/aliDownLoad.vue'
import ailPreview from '@/components/ailPreview.vue'
export default {
  name: 'backupData',
  components: {
    aliUpload,
    aliDownLoad,
    ailPreview,
    picturePrevie
  },
  props: {
    drawerShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      seach: {
        projectManagementId: '',
        startTime: '',
        endTime: ''
      },
      tenantOption: [],
      pickerBeginDayBefore: {
        disabledDate: time => {
          let endDateVal = this.seach.endTime
          if (endDateVal) {
            let temp = new Date(endDateVal).getTime() - 365 * 24 * 60 * 60 * 1000
            return time.getTime() < new Date(temp).getTime() || time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      pickerBeginDayAfter: {
        disabledDate: time => {
          let beginDateVal = this.seach.startTime
          if (beginDateVal) {
            let temp = new Date(beginDateVal).getTime() + 365 * 24 * 60 * 60 * 1000
            return time.getTime() > new Date(temp).getTime() || time.getTime() < (new Date(beginDateVal).getTime() - 24 * 60 * 60 * 1000)
          }
        }
      },
      direction: 'rtl',
      addBackupShow: false,
      addInfo: {
        projectManagementId: '',
        annexName: '',
        annexURL: ''
      },
      upLoadText_cost: '上传附件',
      showPicture: false,
      imgArr: [],
      num: 0,
      fileSize: 5,
      fileType_cost: [],
      iconImg: 'icon-shangchuantupianicon',
      ailPreview: false,
      currentPage: 1,
      totalPages: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      tableData: [],
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
  watch: {
    drawerShow: {
      handler: function (val, oldVal) {
        if (val === true) { // 数据备份组件显示
          this.tenantOption = this.$store.state.projectManagementsList
          this.init()
          this.query()
        }
      }
    },
    addBackupShow: {
      handler: function (val, oldVal) {
        if (val === true) { // 新增数据弹框显示
          this.addInfo.projectManagementId = this.seach.projectManagementId
        }
      }
    }
  },
  methods: {
    handleClose () {
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      this.$emit('drawerClose')
      // })
      // .catch(_ => { })
    },
    onAdd () {
      this.addBackupShow = true
    },
    init () {
      this.seach.projectManagementId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.tenantOption[0].id
      this.seach.startTime = ''
      this.seach.endTime = ''
      this.currentPage = 1
      this.pgSize = 15
    },
    addBackupClose () {
      this.addBackupShow = false
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    createTimeFormat (row, column) {
      if (row.createTime) {
        return row.createTime.replace('T', ' ')
      }
    },
    queryRules () {
      this.currentPage = 1
      // this.pgSize = 15
      this.query()
    },
    async query () {
      let result = await context.http.get('/gos/api/annexes', {
        startDate: this.seach.startTime,
        endDate: this.seach.endTime,
        page: (this.currentPage - 1),
        size: this.pgSize,
        sort: 'createdDate,desc',
        projectManagementId: this.seach.projectManagementId
      })
      if (result.status === 200) {
        this.tableData = result.data
        this.total = Number(result.headers['x-total-count'])
        this.totalPages = Math.ceil(this.total / this.pgSize)
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
    setAnnex (annexURL, annexName) {
      this.addInfo.annexName = annexName
      this.addInfo.annexURL = annexURL
    },
    deleLogo () {
      this.addInfo.annexName = ''
      this.addInfo.annexURL = ''
    },
    getformat2 (str) {
      return getformat(str)
    },
    dialogVisible () {
      if (!this.addInfo.annexName) {
        this.$message({
          message: '请上传附件！',
          type: 'warning'
        })
        return
      }
      context.http.post('/gos/api/annexes', this.addInfo).then(res => {
        if (res.status === 201) {
          this.$message({
            message: '新增成功！',
            type: 'success'
          })
          this.hideAddBackup()
          // this.seach.projectManagementId = this.addInfo.projectManagementId
          this.query()
        }
      })
    },
    hideAddBackup () {
      this.addBackupShow = false
      this.addInfo.annexName = ''
      this.addInfo.annexURL = ''
    },
    setFile (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    pictureClose () {
      this.showPicture = false
    }
  }
}
</script>

<style lang="scss" scoped>
.drawerTitle {
  > span {
    width: 100px !important;
    color: #00b361;
    > span {
      text-decoration: underline;
    }
  }
}
.search {
  > div {
    width: 160px;
  }
  .query-btn {
    display: inline-block;
    text-align: center;
    width: 80px;
    cursor: pointer;
  }
}
.main_content {
  .half_page_title {
    margin: 10px 0;
  }
  .plc-table {
    .cell {
      .view-btn {
        display: flex;
        justify-content: center;
      }
    }
  }
}
.el_dialog_new {
  .el-dialog__body {
    .dialog {
      padding: 10px 20px;
      height: 140px;
      display: flex;
      justify-content: space-between;
      .item {
        width: 45%;
        .dialog_item_title {
          height: 30px;
          line-height: 30px;
          display: flex;
          margin-bottom: 5px;
          > i {
            margin-right: 10px;
          }
        }
        .dialog_item_info {
          height: 20px;
          width: 100%;
          position: relative;
          .dialog_item_info_box {
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 90%;
          }
            .deleteImg {
              position: absolute;
              top: 0;
              right: 6px;
            }
        }
      }
    }
  }
  .el-dialog__footer {
    margin-top: 0 !important;
  }
}
</style>
