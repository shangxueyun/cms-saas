<template>
  <div id='brandLibrary'
       class="brandLibrary">
    <span class="page_head_title">品牌库</span>
    <div class="search-bar">
      <div>
        <el-select v-model="businessTypeId"
                   placeholder="一级业态"
                   @change='firstOptionsChanged'>
          <el-option v-for="item in firstOptions"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="businessTypeParentId"
                   placeholder="二级业态">
          <el-option v-for="item in secendOptions"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="brandStatus"
                   placeholder="状态">
          <el-option v-for="item in status"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="name"
                  placeholder="请输入品牌名搜索"
                  style="width:200px"></el-input>
        <span class="query-btn"
              @click="getbrands()"
              v-if="hasAuthority('08020104')">查询</span>
      </div>
      <div>
        <el-button class="tban tban1"
                   @click="toAddBrand"
                   v-if="hasAuthority('08020101')"><i class="iconfont icon-crm_xinzeng-"></i> 增加品牌</el-button>
        <span class="upload"
              v-if="hasAuthority('08020102')">
          <el-button class="tban tban5"><i class="iconfont icon-cms_daorushuju-"></i> 导入品牌</el-button>
          <input type="file"
                 @change="imageChange('addapp', $event)">
        </span>
        <el-button class="tban tban2"
                   @click="downLoadModel"
                   v-if="hasAuthority('08020103')"><i class="iconfont icon-xiazai1"></i> 下载模版</el-button>
      </div>
    </div>
    <div class="content">
      <el-table :data="tableData"
                style="border:1px solid #eee">
        <el-table-column prop="date"
                         label="logo图"
                         align="center">
          <template slot-scope="scope">
            <img src="../../../assets/noBrand.png"
                 alt="商品图片"
                 style="width: 50px;height: 50px"
                 v-if="!scope.row.imageLogo">
            <img :src="getImgUrl(scope.row)"
                 alt="商品图片"
                 style="width: 50px;height: 50px"
                 v-else>
          </template>
        </el-table-column>
        <el-table-column prop="chineseName"
                         label="中文名称"
                         align="center"></el-table-column>
        <el-table-column prop="englishName"
                         label="英文名称"
                         align="center"></el-table-column>
        <el-table-column prop="businessType"
                         label="业态"
                         align="center"
                         :formatter='formatBusinessType'></el-table-column>
        <el-table-column prop="brandPosition"
                         label="品牌定位"
                         align="center"
                         :formatter='formatBrandPosition'></el-table-column>
        <el-table-column prop="perCapitaConsumer"
                         label="人均消费"
                         align="center"
                         :formatter='formatPerCapitaConsumer'></el-table-column>
        <el-table-column prop="brandStatus"
                         label="状态"
                         align="center"
                         :formatter="formatBrandStatus"></el-table-column>
        <el-table-column label="操作"
                         align="center"
                         width="200"
                         v-if="hasAuthority('08020105')">
          <template slot-scope="scope">
            <el-button type="primary"
                       size="mini"
                       @click="toDetails(scope.$index, scope.row)">品牌档案</el-button>
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
                @change="pgSizeSelectFn">
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
</template>
<script>
import context from '@/service'
import axios from 'axios'
export default {
  name: 'brandLibrary',
  components: {

  },
  data () {
    return {
      loading: false,
      businessTypeId: '', // 一级业态
      firstOptions: [],
      secendOptions: [],
      status: [{ label: '正常', value: 'Normal' }, { label: '异常', value: 'Abnormal' }, { label: '停业', value: 'ShutDown' }],
      businessTypeParentId: '',
      brandStatus: '',
      name: '',
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
  created () {
    console.log('index.vue')
  },
  mounted () {
    this.getbrands()
    this.getbusinessTypes()
  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    formatBrandStatus (row, column) {
      switch (row.brandStatus) {
        case 'Normal':
          return '正常'
        case 'Abnormal':
          return '异常'
        case 'ShutDown':
          return '停业'
        default:
          return '-'
      }
    },
    formatPerCapitaConsumer (row, column) { // 人均消费
      if (row.perCapitaConsumer) {
        var arr = row.perCapitaConsumer.split(',')
        var text = ''
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] === 'High') {
            text = text + '高消费' + '，'
          } else if (arr[i] === 'Ordinary') {
            text = text + '普通消费' + '，'
          } else if (arr[i] === 'Low') {
            text = text + '低消费' + '，'
          }
        }
        return text
      } else {
        return '-'
      }
    },
    formatBrandPosition (row, column) { // 品牌定位
      switch (row.brandPosition) {
        case 'Extravagant':
          return '奢侈'
        case 'LightExtravagant':
          return '轻奢'
        case 'Fashion':
          return '时尚'
        case 'Public':
          return '大众'
        case 'Economics':
          return '经济'
        default:
          return '-'
      }
    },
    formatBusinessType (row, column) { // 业态
      if (row.businessType && row.businessType.parent) {
        return row.businessType.parent.name + ' - ' + row.businessType.name
      } else if (row.businessType) {
        return row.businessType.name
      } else {
        return '-'
      }
    },
    toDetails (index, row) {
      this.$router.push({ name: 'addBrand', params: { id: row.id, pageType: 'details' } })
    },
    formatbusinessType () {
      this.firstOptions.forEach(item => {
        if (item.id === this.businessTypeId) {
          this.businessTypeId = item
        }
      })
      this.secendOptions.forEach(item => {
        if (item.id === this.businessTypeParentId) {
          this.businessTypeParentId = item
        }
      })
    },
    async getbrands () { // 获取品牌库
      let result = await context.http.get('ywm/api/brands', { businessTypeId: this.businessTypeParentId, businessTypeParentId: this.businessTypeId, brandStatus: this.brandStatus, name: this.name, page: (this.currentPage - 1), size: this.pgSize })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
    },
    async getbusinessTypes () { // 获取一级业态
      let result = await context.http.get('ywm/api/businessTypes', {})
      let data = result.data
      this.firstOptions = data
    },
    async firstOptionsChanged () { // 选中一级业态 请求二级业态
      let result = await context.http.get('ywm/api/businessTypes', { parentId: this.businessTypeId })
      let data = result.data
      this.secendOptions = data
    },
    toAddBrand () { // 增加品牌
      this.$router.push({ name: 'addBrand', params: { pageType: 'add' } })
    },
    getImgUrl (row) {
      return row.imageLogo
    },
    pgSizeSelectFn () { // 切换显示条数
      this.currentPage = 1
      this.getbrands()
    },
    current_change (currentPage) { // 切换页码
      this.currentPage = currentPage
      this.getbrands()
    },
    async downLoadModel () {
      axios({ method: 'GET', url: '/ywm/api/brands/file', params: { referred: this.referred, page: (this.currentPage - 1), size: this.pgSize, sort: 'id,desc' }, responseType: 'blob' }).then(res => {
        console.log(res)
        let url = window.URL.createObjectURL(new Blob([res.data]))
        console.log(url)
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
    imageChange (state, event) {
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      let name = files[0].name
      let index = name.lastIndexOf('.')
      let type = name.substr(index + 1).toLowerCase()
      if (index > 0 && type !== 'xlsx' && type !== 'xls') {
        this.$message({
          message: '格式错误，请上传xlsx格式文件',
          type: 'error'
        })
      } else {
        context.http.post('/ywm/api/brands/file', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          this.getbrands()
          this.$message({
            message: '导入成功！',
            type: 'success'
          })
        }).catch(error => {
          console.info(error)
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.brandLibrary {
  .seachDiv {
    margin-bottom: 20px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    border: 1px solid #eee;
    padding: 0 20px;
    min-height: 80px;
    .item {
      display: flex;
      align-items: center;
      > span {
        display: inline-block;
        width: 80px;
      }
    }
  }
  .content {
    background-color: #ffffff;
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
  .el-col-18 {
    padding: 0 30px;
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
.flex {
  display: flex;
  justify-content: space-between;
}
.upload {
  position: relative;
  display: inline-block;
  border-radius: 2px;
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
  input {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 24px;
    opacity: 0;
  }
}
@media screen and (max-width: 1600px) {
  .item1 {
    margin-top: 18px;
  }
}
</style>

