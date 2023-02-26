<template>
  <div style="display: flex;flex-direction: column;height: 100%">
    <div class="energyDataDetail clearfix"
         style="flex: 1;">
      <div class="dc-right float-right conDetail">
        <div class="dr-head">基本信息</div>
        <elForm>
          <el-form-item :label-width="formLabelWidth"
                        style="margin-bottom: 20px;">
            <div class="cttitle">项目简称</div>
            <span>{{detailData.projectName}}</span>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
                        style="margin-bottom: 20px;margin-right:0">
            <div class="cttitle">报告名称</div>
            <span>{{detailData.reportName}}</span>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
                        prop="area"
                        style="margin-bottom: 20px;">
            <div class="cttitle">检测类型</div>
            <span>{{detailData.checkTypeValue}}</span>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
                        prop="iDNumber">
            <div class="cttitle">检测时间</div>
            <span>{{detailData.checkDate}}</span>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
                        v-if="detailData.checkType === 'CONNECTION'">
            <div class="cttitle">维保单位</div>
            <span>{{detailData.checkDept}}</span>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
                        style="margin-bottom: 20px;">
            <div class="cttitle">负责人</div>
            <span>{{detailData.principal}}</span>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
                        prop="yxContractNo">
            <div class="cttitle">创建时间</div>
            <span v-if="detailData.createTime">{{detailData.createTime.replace('T', ' ')}}</span>
          </el-form-item>
          <div style="margin-left: 16px;">
            <div class="cttitle">附件</div>
            <div class="enclosure-list"
                 v-for="(item, index) in detailData.annexes"
                 :key="index"
                 style="margin-bottom: 10px;">
              <div class="el-item">
                <span>{{item.annexName}}</span>
                <span v-if="item.annexName"
                      style="padding-left: 60px">
                  <i @click="downloadFile(item, index)"
                     class="iconfont icon-xiazaidaoru"
                     style="margin-right: 10px;cursor: pointer;"></i>
                </span>
              </div>
            </div>
          </div>
        </elForm>
      </div>
      <div class="dc-right float-right conDetail">
        <div class="dr-head"
             style="margin-bottom: 0">检测设备</div>
        <el-table :data="fcReDetails"
                  class="fcReDetails"
                  style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left"
                       inline
                       class="demo-table-expand"
                       style="width: 99%">
                <el-form-item label="备注："
                              style="width: 100%">
                  <span style="display: inline-block;margin-top: 10px;">{{ props.row.comment }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="设备小类"
                           prop="equipmentType">
          </el-table-column>
          <el-table-column label="设备编号"
                           prop="equipmentNo">
          </el-table-column>
          <el-table-column label="设备名称"
                           prop="equipmentName">
          </el-table-column>
          <el-table-column label="安装位置"
                           prop="installPosition">
          </el-table-column>
          <el-table-column label="检测结果"
                           prop="checkStatusValue">
            <template slot-scope="props">
              <span class="normal"
                    :class="{'abnormal' : props.row.checkStatusValue !== '正常'}">{{props.row.checkStatusValue}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="ctc-foot1">
          <span><span style="margin-right:10px">{{detailsPager.currentPage}}/{{Math.ceil(detailsPager.total/detailsPager.pgSize)}}
              页</span> 共{{detailsPager.total}}条记录</span>
          <el-pagination v-if="detailsPager.total > 0"
                         background
                         layout="prev, pager, next"
                         :page-size="detailsPager.pgSize"
                         :total="detailsPager.total"
                         :current-page.sync="detailsPager.currentPage"
                         @current-change="deCurrent_change">
          </el-pagination>
          <div class="pagingnum">
            显示 <select v-model="detailsPager.pgSize"
                    @change="deCurrentSel">
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
    </div>
    <div class="report-footer">
      <el-button @click="energyDataDetailClose"
                 class="close-button">关 闭</el-button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import context from '@/service'
export default {
  name: '',
  props: {
    detailData: {
      type: Object
    },
    energyDataDetailShow1: {
      type: Boolean
    }
  },
  watch: {
    energyDataDetailShow1: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.detailsPager.currentPage = 1
          this.fcReportsDetails(this.detailData.id)
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      fcReDetails: [],
      formLabelWidth: '',
      detailsPager: {
        total: 0,
        pgSize: 15,
        currentPage: 1
      },
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
    deCurrent_change (currentPage) {
      this.detailsPager.currentPage = currentPage
      this.fcReportsDetails(this.detailData.id)
    },
    fcReportsDetails (id) {
      context.http.get(`/cms/api/fcReports/${id}/details`,
        {
          sort: 'checkStatus',
          page: (this.detailsPager.currentPage - 1),
          size: this.detailsPager.pgSize
        }).then(res => {
          this.fcReDetails = res.data
          this.detailsPager.total = Number(res.headers['x-total-count'])
        })
    },
    energyDataDetailClose () {
      this.detailsPager.currentPage = 1
      this.$emit('update:energyDataDetailShow1', false)
    },
    deCurrentSel () {
      this.detailsPager.currentPage = 1
      this.fcReportsDetails(this.detailData.id)
    },
    downloadFile (item, index) {
      axios({
        method: 'GET',
        url: '/ywm/api/annex/download',
        params: {
          annexURL: item.annexURL,
          annexName: item.annexName
        },
        responseType: 'blob'
      }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', item.annexName)
        document.body.appendChild(link)
        link.click()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.cttitle{
  vertical-align: top;
}
.dc-right {
  width: 100%;
  margin-top: 20px;
}
.dc-right {
  width: 100%;
  margin-top: 20px;
  .dr-head {
    background-color: #fafafa;
    height: 40px;
    line-height: 40px;
    padding-left: 12px;
    font-size: 14px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ebebeb;
  }
  .el-form-item {
    display: inline-block;
    width: 29%;
    margin-left: 16px;
    margin-right: 10px;
    vertical-align: top;
    &:nth-of-type(2n) {
      margin-right: 0;
    }
  }
}
.conDetail {
  border: 1px solid rgb(235, 235, 235);
  .normal {
    color: #49af61;
  }
  .abnormal {
    color: #ff6665;
  }
}
.report-footer {
  text-align: right;
  border-top: 1px solid #ddd;
  margin-top: 20px;
  .el-button {
    margin-top: 20px;
  }
}
.ctc-foot1 {
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
</style>
