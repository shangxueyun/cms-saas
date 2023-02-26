<template>
  <div class="tenantPersonDetails">
    <div class="backTitle"
         @click="backIndex">
      <i class="iconfont icon-fanhui"></i>
      随申码记录异常人员（{{date}})
    </div>
    <div class="content">
      <el-table :data="tableData"
                style="border:1px solid #eee">
        <el-table-column prop="tenantName"
                         label="商户"
                         align="center"></el-table-column>
        <el-table-column prop="buildingName"
                         label="楼宇"
                         align="center"></el-table-column>
        <el-table-column prop="roomName"
                         label="房源号"
                         align="center"></el-table-column>
        <el-table-column prop="tenantPersonnelName"
                         label="姓名"
                         align="center"></el-table-column>
        <el-table-column prop="createdDate"
                         label="上传时间"
                         align="center"></el-table-column>
        <el-table-column prop="describe"
                         label="异常原因"
                         align="center"></el-table-column>
        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button @click="showImg(scope.$index, scope.row.url)"
                       v-if="scope.row.url"
                       class="el-button--primary operation-btn"
                       size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="ctc-foot1"
           v-if="tableData && tableData.length > 0">
        <span><span style="margin-right:10px">{{pager3.currentPage}}/{{Math.ceil(pager3.total/pager3.pgSize)}}页</span> 共{{pager3.total}}条记录</span>
        <el-pagination v-if="pager3.total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size="pager3.pgSize"
                       :total="pager3.total"
                       :current-page.sync="pager3.currentPage"
                       @current-change="current_change3">
        </el-pagination>
        <div class="pagingnum">
          显示 <select v-model="pager3.pgSize"
                  @change="pgSizeSelectFn3">
            <option v-for="item in pager3.pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </option>
          </select>
          条目
        </div>
      </div>
    </div>

    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import picturePrevie from '@/components/picturePrevie.vue'
import * as JSOG from 'jsog'
import moment from 'moment'
export default {
  name: 'tenantPersonDetails',
  props: {

  },
  components: {
    picturePrevie
  },
  watch: {

  },
  data () {
    return {
      showPicture: false,
      imgArr: [],
      num: 0,
      date: '',
      tableData: [],
      pager3: {
        currentPage: 1,
        pgNum: 1,
        total: 0,
        pgSize: 5,
        pgNumoptions: [
          {
            value: 5,
            label: '5'
          },
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
    }
  },
  created () {
    let row = this.$route.query.row
    this.date = moment(row.uploadDate).format('YYYY年MM月DD日')
    this.getData(row)
    // console.log(row)
  },
  methods: {
    pictureClose () {
      this.showPicture = false
    },
    showImg (index, url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    getData (row) {
      context.http.get(`/gos/api/nucleicAcidStatisticsInfo`, {
        projectManagementId: row.projectManagementId,
        queryTime: row.uploadDate,
        page: (this.pager3.currentPage - 1),
        size: this.pager3.pgSize
      }).then(res => {
        console.log(3)
        if (res.status === 200) {
          this.tableData = res.data
          this.pager3.total = Number(res.headers['x-total-count'])
        }
      })
    },
    current_change3 (currentPage) {
      this.pager3.currentPage = currentPage
      this.getData()
    },
    pgSizeSelectFn3 () { // 切换显示条数
      this.pager3.currentPage = 1
      this.getData()
    },
    backIndex () {
      // this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.tenantPersonDetails {
  .backTitle {
    height: 50px;
    display: flex;
    align-items: center;
    // cursor: pointer;
  }
}
</style>
<style lang="scss">
.tenantPersonDetails {
  .bigImg {
    height: 800px;
    object-fit: contain;
  }
}
</style>

