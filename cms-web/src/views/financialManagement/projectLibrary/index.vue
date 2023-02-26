<template>
  <div id="projectLibrary"
       class="brandLibrary">
    <span class="page_head_title">项目库</span>
    <div class="search-bar">
      <div>
        <el-input v-model="name"
                  placeholder="项目名"
                  style="width:200px;"></el-input>
        <el-select v-model="brandStatus"
                   placeholder="状态">
          <el-option v-for="item in status"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="businessTypeId"
                   placeholder="商业类型">
          <el-option v-for="item in businessTypeArr"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <span class="query-btn"
              @click="getbrands()"
              v-if="hasAuthority('08020204')">查询</span>
      </div>
      <div>
        <el-button class="tban tban1"
                   @click="toAddBrand"
                   v-if="hasAuthority('08020201')"><i class="iconfont icon-crm_xinzeng-"></i> 增加项目</el-button>
        <span class="upload"
              v-if="hasAuthority('08020202')">
          <el-button class="tban tban5"><i class="iconfont icon-cms_daorushuju-"></i> 导入项目</el-button>
          <input type="file"
                 @change="imageChange('addapp', $event)">
        </span>
        <el-button class="tban tban2"
                   @click="downLoadModel"
                   v-if="hasAuthority('08020203')"><i class="iconfont icon-xiazai1"></i> 下载模版</el-button>
      </div>
    </div>
    <div class="content">
      <el-table :data="tableData"
                style="border:1px solid #eee">
        <el-table-column prop="date"
                         label="项目图"
                         align="center">
          <template slot-scope="scope">
            <img src="../../../assets/noProject.png"
                 alt="商品图片"
                 style="width: 50px;height: 50px"
                 v-if="!scope.row.imageLogo">
            <img :src="getImgUrl(scope.row)"
                 alt="商品图片"
                 style="width: 50px;height: 50px"
                 v-else>
          </template>
        </el-table-column>
        <el-table-column prop="name"
                         label="项目名称"
                         align="center"></el-table-column>
        <el-table-column label="项目企业"
                         align="center"
                         :formatter="formatAffiliatedCompany"></el-table-column>
        <el-table-column prop="addrAddress"
                         label="地址"
                         align="center"></el-table-column>
        <el-table-column prop="brandStatus"
                         label="状态"
                         align="center"
                         :formatter="formatBrandStatus"></el-table-column>
        <el-table-column label="操作"
                         align="center"
                         width="200"
                         v-if="hasAuthority('08020205')">
          <template slot-scope="scope">
            <el-button type="primary"
                       size="mini"
                       @click="toDetails(scope.$index, scope.row)">项目档案</el-button>
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
  name: 'projectLibrary',
  components: {

  },
  data () {
    return {
      loading: false,
      status: [{ label: '正常', value: 'Normal' }, { label: '异常', value: 'Abnormal' }, { label: '停业', value: 'ShutDown' }],
      brandStatus: '',
      name: '',
      businessTypeId: '',
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
      ],
      businessTypeArr: [// 商业类型
        { label: '主题商场', value: 'ThemeMall' },
        { label: '仓储式商场', value: 'StorageMall' },
        { label: '大型综合超市', value: 'Supermarket' },
        { label: '百货楼', value: 'DepartmentStore' },
        { label: '购物中心', value: 'ShopMall' },
        { label: '其他', value: 'Other' }
      ]
    }
  },
  created () {
    this.getbrands()
  },
  mounted () {

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
    formatAffiliatedCompany (row, column) {
      if (row.affiliatedCompany) {
        return row.affiliatedCompany
      } else {
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
    toDetails (index, row) {
      this.$router.push({ name: 'addProject', params: { id: row.id, pageType: 'details' } })
    },
    async getbrands () { // 获取品牌库
      let result = await context.http.get('ywm/api/projectLibrarys', { name: this.name, brandStatus: this.brandStatus, businessType: this.businessTypeId, page: (this.currentPage - 1), size: this.pgSize })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
    },
    async firstOptionsChanged () { // 选中一级业态 请求二级业态
      let result = await context.http.get('ywm/api/businessTypes', { parentId: this.businessTypeId })
      let data = result.data
      this.secendOptions = data
    },
    toAddBrand () { // 增加品牌
      this.$router.push({ name: 'addProject', params: { pageType: 'add' } })
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
    async downLoadModel (projectLibrarys) {
      axios({ method: 'GET', url: '/ywm/api/projectLibrarys/file', params: { referred: this.referred, page: (this.currentPage - 1), size: this.pgSize, sort: 'id,desc' }, responseType: 'blob' }).then(res => {
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
      if (index > 0 && type !== 'xlsx') {
        this.$message({
          message: '格式错误，请上传xlsx格式文件',
          type: 'error'
        })
      } else {
        context.http.post('/ywm/api/projectLibrarys/file', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
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

<style  lang="scss" scoped>
.brandLibrary {
  .content {
    background-color: #ffffff;
  }
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
