
<template>
  <div class="rotationchart">
    <span class="page_head_title">小程序设置</span>
    <ul class="default_tab_block"
        v-if="hasAuthority('050801') && hasAuthority('050802')">
      <li :class="item.value ? 'active' : ''"
          @click="changeNav(index)"
          v-for="(item, index) in navList"
          :key="index"><span>{{item.label}}</span></li>
    </ul>
    <div class="search-bar">
      <div>
        <el-select v-model="projectManagementId"
                   clearable
                   placeholder="选择项目">
          <el-option v-for="item in pjOptions"
                     :key="item.id"
                     :label="item.referred"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="useStatus"
                   clearable
                   placeholder="状态"
                   v-if="step1">
          <el-option v-for="item in statusOptions"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value">
          </el-option>
        </el-select>
        <span class="query-btn"
              @click="queryList2()">查询</span>
      </div>
      <div v-if="hasAuthority('05080101')">
        <el-button class="tban tban1"
                   @click="addFloor"><i class="iconfont icon-crm_xinzeng-"></i> 新增轮播图</el-button>
      </div>
    </div>
    <div class="plc-table">
      <el-table :data="tableData"
                style="width: 100%"
                ref="multipleTable">
        <el-table-column prop="projectManagementReferred"
                         label="项目"
                         align="center"></el-table-column>
        <el-table-column prop="name"
                         label="轮播图名称"
                         align="center"></el-table-column>
        <el-table-column label="排序"
                         align="center">
          <template slot-scope="scope">
            <span>{{scope.row.sortNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态"
                         align="center">
          <template slot-scope="scope">
            <span>{{reviewStatus(scope.row.reviewStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column :formatter="formatTime"
                         label="更新时间"
                         align="center">
        </el-table-column>
        <el-table-column width="200"
                         label="操作"
                         style="padding-left: 50px;"
                         v-if="hasAuthority('05080102')"
                         align="center">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)"
                       class="el-button--primary operation-btn"
                       size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="ctc-foot1"
         v-if="total > 0">
      <span><span style="margin-right:10px">{{currentPage}}/{{Math.ceil(total/pgSize)}}页</span> 共{{total}}条记录</span>
      <el-pagination background
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

    <el-dialog title="新增轮播图"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               width="500px"
               class="el_dialog_new">
      <el-form :model="createForm"
               :rules="createRulese"
               style="margin: 0 20px 12px 20px;"
               ref="createaccount">
        <el-form-item prop="projectManagementId"
                      style="margin-right: 10px;">
          <div class="itemtitle">项目<i class="required">*</i></div>
          <el-select v-model="createForm.projectManagementId"
                     placeholder="请选择">
            <el-option v-for="item in pjOptions2"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.projectManagementId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name">
          <div class="itemtitle">轮播图名称<i class="required">*</i></div>
          <el-input v-model="createForm.name"
                    maxlength="20"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item prop="imgUrl"
                      style="margin-bottom: 20px;margin-right: 0;vertical-align: top;width: 230px">
          <div class="itemtitle">轮播图<i class="required">*</i></div>
          <div class="buildingImg"
               v-if="createForm.imgUrl">
            <img :src="createForm.imgUrl" />
            <i class="iconfont icon-cms_cuowu"
               v-if="createForm.imgUrl"
               @click="delImage2()"></i>
          </div>
          <div class="buildingImg"
               v-if="!createForm.imgUrl">
            <p>
              <i class="iconfont icon-shangchuantupianicon"></i>
            </p>
            <span>上传图片</span>
            <input type="file"
                   @change="imageChange($event, 'imgUrl')"
                   accept="image/png, image/jpeg">
          </div>
          <p style="font-size: 12px;color: #666;margin-top: 6px;white-space: nowrap;">(建议尺寸：<span style="color: #D51F24">710*270</span>像素；支持格式JPG,PNG)</p>
        </el-form-item>
        <el-form-item prop="sortNumber"
                      style="margin-bottom: 20px;margin-right: 0">
          <div class="itemtitle">排序</div>
          <el-input v-model="createForm.sortNumber"
                    maxlength="20"
                    type="number"
                    title=""
                    step="0"
                    onKeypress="return(/[0-9]/.test(String.fromCharCode(event.keyCode)))"
                    placeholder="请输入内容"></el-input>

        </el-form-item>
      </el-form>
      <div slot="footer"
           class="slotfooter">
        <span @click="dialogVisible = false"
              class="details_cannelBtn">取消</span>
        <span @click="confirm('createaccount')"
              class="details_submitBtn">确定</span>
      </div>
    </el-dialog>

    <el-drawer :visible.sync="detailsdrawershow"
               :append-to-body="true"
               :wrapperClosable="false"
               size="500px"
               class="rotationChartDetails">
      <div slot="title"
           class="drawerTitle">
        <p style="font-size: 16px">轮播图详情</p>
        <span class="editBtn"
              @click="onEdit"
              v-if="hasAuthority('05080103') && readOnly">
          <i class="iconfont icon-edit1"></i>
          编辑
        </span>
      </div>
      <div class="drawBody content">
        <div class="dr-head"><span class="vertical"></span>基础信息</div>
        <el-form :model="details"
                 :rules="createRulese"
                 style="margin: 0 20px 0 20px;"
                 ref="detailsData">
          <el-form-item prop="projectManagementId"
                        style="margin-right: 10px;width: 220px">
            <div class="itemtitle">项目<i class="required">*</i></div>
            <div v-if="readOnly">
              {{details.projectManagementReferred}}
            </div>
            <el-select v-model="details.projectManagementId"
                       v-else
                       placeholder="请选择">
              <el-option v-for="item in pjOptions2"
                         :key="item.id"
                         :label="item.referred"
                         :value="item.projectManagementId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="name">
            <div class="itemtitle">轮播图名称<i class="required">*</i></div>
            <div v-if="readOnly">
              {{details.name}}
            </div>
            <el-input v-model="details.name"
                      v-else
                      maxlength="20"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item prop="imgUrl"
                        style="margin-bottom: 20px;margin-right: 0;vertical-align: top;width: 230px">
            <div class="itemtitle">轮播图<i class="required">*</i></div>
            <div class="buildingImg"
                 v-if="details.imgUrl">
              <img :src="details.imgUrl" @click="showImg(details.imgUrl)"/>
              <i class="iconfont icon-cms_cuowu"
                 v-if="details.imgUrl && !readOnly"
                 @click="delImage()"></i>
              <div class="bottomTips">
                <span v-if="readOnly" @click="showImg(details.imgUrl)">预览图片</span>
                <span v-else>更换图片</span>
              </div>
              <input type="file"
                     v-if="!readOnly"
                     @change="imageChange($event, 'imgUrl2')"
                     accept="image/png, image/jpeg">
            </div>
            <div class="buildingImg"
                 v-if="!details.imgUrl">
              <p>
                <i class="iconfont icon-shangchuantupianicon"></i>
              </p>
              <span>上传图片</span>
              <input type="file"
                     @change="imageChange($event, 'imgUrl2')"
                     accept="image/png, image/jpeg">
            </div>
          </el-form-item>
          <el-form-item style="margin-bottom: 20px;margin-right: 0;width: 220px">
            <div class="itemtitle">排序</div>
            <div v-if="readOnly">
              {{details.sortNumber}}
            </div>
            <el-input v-model="details.sortNumber"
                      v-else
                      maxlength="20"
                      type="number"
                      title=""
                      step="0"
                      onKeypress="return(/[0-9]/.test(String.fromCharCode(event.keyCode)))"
                      placeholder="请输入内容"></el-input>

          </el-form-item>
          <el-form-item style="margin-right: 10px;">
            <div class="itemtitle">状态</div>
            <div v-if="readOnly">
              {{reviewStatus(details.reviewStatus)}}
            </div>
            <el-select v-model="details.reviewStatus"
                       v-else
                       placeholder="请选择">
              <el-option v-for="item in stateOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="drawfoot" v-if="!readOnly">
        <div class="slotfooter"
             style="position: absolute;right: 0;bottom: 6px">
          <span class="details_cannelBtn" @click="onHide">取消</span>
          <span class="details_submitBtn" @click="saveEdit('detailsData')">保存</span>
        </div>
      </div>
    </el-drawer>

    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>
<script>
import context from '@/service'
import picturePrevie from '@/components/picturePrevie.vue'
export default {
  name: 'floorManagement',
  components: {
    picturePrevie
  },
  data () {
    return {
      num: 0,
      imgArr: [],
      showPicture: false,
      stateOptions: [
        { value: 'USING', label: '上线' },
        { value: 'ENDING', label: '下线' }
      ],
      createForm: { imgUrl: '' },
      details: {},
      createRulese: {
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入轮播图名称', trigger: 'blur' }
        ],
        imgUrl: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        sortNumber: [
          { required: false, message: '', trigger: 'blur' }
        ]
      },
      title: '查看',
      detailsdrawershow: false,
      dialogVisible: false,
      useStatus: 'USING',
      options1: [],
      pjOptions: [],
      pjOptions2: [],
      projectManagementId: '',
      navList: [{
        label: '轮播图设置',
        value: true,
        hasAuthority: '050501'
      }, {
        label: '基本设置',
        value: false,
        hasAuthority: '050502'
      }],
      tableData: [],
      currentPage: 1,
      pgNum: 1,
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
      statusOptions: [
        { name: '全部', value: '' },
        { name: '上线', value: 'USING' },
        { name: '下线', value: 'ENDING' }
      ],
      step1: true,
      step2: false,
      readOnly: true,
      floorData: {},
      floorName: '',
      dialogStep1: true,
      isToExamine: false
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
    this.query()
    this.queryProject()
    this.queryProject2()
  },
  mounted () {

  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      if (this.step1) {
        this.query()
      } else {
        this.query('toexamine')
      }
    },
    changeNav (inx) {
      this.navList.forEach(item => {
        item.value = false
      })
      this.navList[inx].value = true
      if (inx === 0) {
        this.$router.push('/home/AppletSetup')
      } else if (inx === 1) {
        this.$router.push('/home/BasicSettings')
      }
    },
    changeStep (inx) {
      if (inx === 0) {
        this.dialogStep1 = true
      } else {
        this.dialogStep1 = false
      }
    },
    nextStep () {
      this.dialogStep1 = false
      this.$refs.floorDetail.nextStep()
    },
    previousStep () {
      this.dialogStep1 = true
      this.$refs.floorDetail.previousStep()
    },
    formatTime (row, column) {
      return row.updateTime.replace('T', ' ')
    },
    reviewStatus (val) {
      let res = ''
      if (val === 'USING') {
        res = '上线'
      } else if (val === 'ENDING') {
        res = '下线'
      }
      return res
    },
    async queryProject () {
      let result = await context.http.get('cms/api/project-managements?useStatus=USING')
      this.pjOptions = result.data
    },
    async queryProject2 () {
      let result = await context.http.get('crm/api/projectManagementSetups/userlist?useStatus=USING')
      this.pjOptions2 = result.data
    },
    queryList2 () {
      this.queryList()
    },
    queryList (type) {
      this.currentPage = 1
      this.query(type)
    },
    async query (type) {
      let result = await context.http.get('crm/api/carousel?sort=lastModifiedDate,desc', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        projectManagementId: this.projectManagementId,
        reviewStatus: this.useStatus
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
    },
    addFloor () {
      this.dialogVisible = true
    },
    currentSel () {
      this.currentPage = 1
      if (this.step1) {
        this.queryList()
      } else {
        this.queryList('toexamine')
      }
    },
    close () {
      this.query()
      this.dialogVisible = false
    },
    onHide () {
      this.readOnly = true
      this.handleEdit(0, this.details)
    },
    onEdit () {
      this.readOnly = false
      this.title = '编辑'
    },
    adopt () {
      this.$refs.floorDetail.adopt()
    },
    Reject () {
      this.$refs.floorDetail.Reject()
    },
    saveEdit (type) {
      this.$refs['detailsData'].validate((valid) => {
        if (valid) {
          context.http.put('crm/api/carousel', this.details).then(res => {
            if (res.status === 200) {
              this.handleEdit(0, this.details)
              this.readOnly = true
              this.query()
              this.$message({
                message: '保存成功！',
                type: 'success'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    confirm (type) {
      this.$refs['createaccount'].validate((valid) => {
        if (valid) {
          context.http.post('crm/api/carousel', this.createForm).then(res => {
            if (res.status === 201) {
              this.$refs['createaccount'].resetFields()
              this.dialogVisible = false
              this.query()
              this.$message({
                message: '新增成功！',
                type: 'success'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleEdit (i, row) {
      this.readOnly = true
      context.http.get(`crm/api/carousel/${row.id}`).then(res => {
        if (res.status === 200) {
          this.details = res.data
          this.detailsdrawershow = true
        }
      })
    },
    async imageChange (event, type) {
      this.errorField = false
      let path = ''
      let files = event.target.files
      if (files.length > 0) {
        // if (files[0].size > (1024 * 1024 * 3)) {
        //   this.errorField = true
        //   this.$message({
        //     showClose: true,
        //     message: '你上传的图片大小超过3M！',
        //     type: 'error'
        //   })
        //   event.target.value = ''
        //   return
        // }
        if (files[0].type !== 'image/png' && files[0].type !== 'image/jpeg' && files[0].type !== 'image/jpg') {
          this.$message({
            showClose: true,
            message: '你上传的图片格式必须为JPG、PNG！',
            type: 'error'
          })
          event.target.value = ''
          return
        }
        let form = new FormData()
        form.append('file', files[0])
        context.http.post('/ywm/api/image-multipart', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          if (res.status === 201) {
            path = res.data
            if (type === 'imgUrl') {
              this.createForm.imgUrl = path
            } else {
              this.details.imgUrl = path
            }
            event.target.value = ''
            this.$forceUpdate()
          }
        }).catch(error => {
          console.info(error)
        })
      }
    },
    delImage2 () {
      this.createForm.imgUrl = ''
    },
    delImage () {
      this.details.imgUrl = ''
      this.$forceUpdate()
    },
    showImg (url) {
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
.el-form-item {
  display: inline-block;
}
.floorManagement {
  .dl-head {
    margin-bottom: 20px !important;
  }
  .info_tab {
    height: 48px;
    display: -ms-flexbox;
    display: flex;
    background-color: #fff;
    box-shadow: 1px 2px 5px #eee;
    border-radius: 3px;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -ms-flex-align: center;
    align-items: center;
    padding-right: 44px;
    border-bottom: 1px solid #ecedef;
    margin-top: 15px;
    .nav {
      display: -ms-flexbox;
      display: flex;

      li.select_active {
        border-bottom: 2px solid #3175d2;
        color: #3175d2;
        font-weight: bolder;
      }

      li {
        width: 140px;
        text-align: center;
        font-size: 14px;
        color: #666;
        height: 46px;
        line-height: 46px;
        border-bottom: 2px solid #fff;
        cursor: pointer;
      }
    }
  }
  .plc-search {
    min-height: 70px;
    line-height: 0;
    background-color: #fff;
    margin: 20px 0;
    padding-left: 18px;
    padding-right: 18px;
    box-shadow: 1px 2px 5px #eee;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -ms-flex-pack: justify;
    justify-content: space-between;
    align-items: center;
    position: relative;
    > div {
      > div {
        margin-right: 15px;
      }
    }
  }
  .storage-button {
    background: rgba(242, 245, 250, 1) !important;
    border: 1px solid #3575f6 !important;
    color: #3575f6 !important;
  }
  .btndiv {
    .storage-button {
      background: rgba(242, 245, 250, 1) !important;
      border: 1px solid #3575f6 !important;
      color: #3575f6 !important;
      margin: 0 10px;
    }
  }
  .offlineBtn {
    display: inline-block;
    width: 56px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border: 1px solid #f3af2c;
    border-radius: 3px;
    color: #f3af2c;
    cursor: pointer;
    // margin-top: 3px;
    // margin-left: 10px;
  }
}
.drawBody {
  display: flex;
  flex-direction: column;
  height: 91%;
  background-color: #fff;
  margin-top: 12px;
  position: relative;
  .dr-head {
    background-color: #fff;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: bold;
    border-bottom: 1px solid #f6f6f6;
  }
  .vertical {
    display: inline-block;
    width: 4px;
    height: 18px !important;
    background-color: #3575f6;
    border-radius: 2px;
    vertical-align: sub;
    margin-right: 5px;
  }
}
.buildingImg {
  display: inline-block;
  width: 160px;
  height: 80px;
  text-align: center;
  border: 1px dashed #dfdfdf;
  cursor: pointer;
  position: relative;
  vertical-align: top;
  background-color: #f7f9fd;
  > div {
    width: 160px;
    height: 80px;
  }
  span {
    color: #3577f6;
  }
  img {
    width: 100%;
    height: 100%;
  }
  input {
    position: absolute;
    top: 0;
    right: 0;
    width: 160px;
    height: 80px;
    opacity: 0;
    cursor: pointer;
  }
  .icon-adds {
    background: url(../../../assets/plus.png) no-repeat;
    background-size: contain;
    margin-bottom: 6px;
  }
  .icon-cms_cuowu {
    font-size: 18px;
    position: absolute;
    top: -13px;
    right: -8px;
  }
  .icon-shangchuantupianicon {
    font-size: 24px;
    color: #105cee;
  }
  .icon-jinakangbaoicons18 {
    position: absolute;
    top: -8px;
    right: -8px;
    cursor: pointer;
    color: #105cee;
    z-index: 999;
  }
  > p {
    margin-top: 15px;
  }
  &:hover {
    .bottomTips {
      display: block;
    }
  }
  .bottomTips {
    display: none;
    height: 25px;
    line-height: 25px;
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 100%;
    background-color: #262626;
    opacity: 0.7;
    font-size: 12px;
    padding: 0 5px;
    text-align: center;
    > span {
      color: #fff;
    }
    > i {
      cursor: pointer;
      font-size: 14px;
      color: #333;
    }
  }
}
.itemtitle {
  color: #777777;
  margin-bottom: 10px;
}
.drawfoot {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 56px;
  background: rgba(255, 255, 255, 1);
}
</style>
<style lang="scss">
.rotationchart {
  .el-dialog__footer {
    padding-top: 20px;
  }
  .el-dialog__header {
    padding-left: 0;
  }
  .butwarp {
    .cell {
      text-align: left;
    }
  }
  .el_dialog_new {
    .el-input__inner {
      width: 220px;
      height: 32px;
      line-height: 32px;
    }
    .el-input__icon {
      line-height: 32px;
    }
    .el-dialog {
      background-color: #fff!important;
    }
    .el-dialog__header{
      border-bottom: 1px solid #F7F7F7!important;
    }
    .el-dialog__headerbtn{
      top: 15px;
    }
  }
  .el-dialog__header{
    margin-bottom: 12px;
  }
  .el-dialog__footer{
    margin-top: 12px;
  }
}
.rotationChartDetails {
  .el-input__inner {
    width: 220px;
    height: 32px;
    line-height: 32px;
  }
  .el-input__icon {
    line-height: 32px;
  }
  .el-drawer__header {
    height: 50px;
    margin: 0;
    padding: 0 20px 0;
    p {
      font-size: 16px;
      font-weight: bolder;
      color: #262626;
    }
    .editBtn {
      width: 48px;
      font-size: 12px;
      color: #3575f6;
    }
  }
  .el-drawer__body {
    margin: 0;
    padding: 0;
    background-color: #f7f7f7;
  }
  .itemtitle + div {
    font-size: 14px;
    color: #262626;
  }
}
</style>
