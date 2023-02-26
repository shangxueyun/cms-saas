<template>
  <div id="serviceManagement">
    <div class="title">
      <span style="font-size: 16px">服务信息</span>
      <!-- <aliUpload
        :upLoadText="upLoadText"
        @setAnnex="setAnnex"
      /> -->
      <el-button type="success" icon="fa-pencil-square-o" @click="dialogFrom" v-if="hasAuthority('05020101')">新增礼品</el-button>
    </div>
    <div class="content">
      <el-table :data="tableData">
        <el-table-column prop="name" label="礼物名称" align="center"></el-table-column>
        <el-table-column label="缩略图" align="center" >
          <template slot-scope="scope">
            <img :src="scope.row.image" alt="商品图片" style="width: 50px;height: 50px">
          </template>
        </el-table-column>
        <el-table-column prop="price" label="礼物价格" align="center"></el-table-column>
        <!--<el-table-column prop="time" label="兑换时间" align="center"></el-table-column>-->
        <el-table-column label="有效时间" align="center" :formatter="usefulTimeFun" width="200"></el-table-column>
        <el-table-column prop="socket" label="库存数" align="center"></el-table-column>
        <el-table-column label="状态" align="center" :formatter="onSaleFun"></el-table-column>
        <el-table-column prop="remain" label="剩余数量" align="center"></el-table-column>
        <el-table-column  label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button type="warning" v-if="scope.row.onSale && hasAuthority('05020102')" @click="upDownOnSale(scope.$index, scope.row,'下架')">下架</el-button>
            <el-button type="success" v-if="!scope.row.onSale && hasAuthority('05020102')" @click="upDownOnSale(scope.$index, scope.row,'上架')">上架</el-button>
            <el-button class="btnDel" v-if="!scope.row.onSale && hasAuthority('05020103')" @click="delOnSale(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="ctc-foot">
      <div class="pagingnum">显示
        <select v-model="pgSize" @change="pgSizeSelectFn">
          <option v-for="item in pgNumoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
          </option>
        </select>
        条目
        <span style="padding-left: 30px">显示从{{pgSize*(currentPage - 1) + 1}}到{{pgSize*currentPage}}项结果，共<span class="style: red">{{total}}</span>条</span>
      </div>
        <el-pagination v-if="total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size=pgSize
                       :total="total"
                       :current-page="currentPage"
                       @current-change="current_change">
        </el-pagination>
    </div>
    <el-dialog :visible.sync="dialogFromIsShow" title="新增礼品" :before-close="handleClose">
      <el-form :model="fromData" label-position="top" :rules="rules" ref="fromData">
        <el-form-item label="礼品名称"  prop="name">
          <el-input v-model="fromData.name" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="礼品价格"  prop="price">
          <el-input v-model="fromData.price"><template slot="append">￥</template></el-input>
        </el-form-item>
        <el-form-item label="兑换积分" prop="score">
          <el-input v-model="fromData.score"></el-input>
        </el-form-item>
        <el-form-item label="礼品介绍" prop="description">
          <el-input v-model="fromData.description" type="textarea" row="3" resize="none" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="有效时间">
          <el-date-picker
            v-model="datePickTime"
            size="large"
            type="daterange"
            range-separator="-"

            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
            @change="dataPickFn">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="库存数" prop="socket">
          <el-input v-model="fromData.socket"></el-input>
        </el-form-item>
        <div style="margin-bottom: 40px" class="uploadImg">
          <p>礼品图片<i class="red">*</i></p>
          <div class="dc-left">
            <div class="head-portrait">
              <div class="hp-img" v-if="addData.facialPhoto">
                <img :src="addData.facialPhoto">
              </div>
              <div class="hp-img " v-else :class="isUploaded && addData.facialPhoto==''? 'isUploaded':'' "></div>
              <div class="upload">
                <span class="uploadbtn">
                  <i class="icon icon-upload"></i> 上传图片
                </span>
                <input type="file"
                       @change="imageChange('addapp', $event)"
                       accept="image/png, image/jpeg">
                <p>建议尺寸：<span style="color: red">500*500</span>像素</p>
              </div>

            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('fromData')">取 消</el-button>
        <el-button type="primary" @click="submitForm('fromData')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import context from '@/service'
  import aliUpload from '@/components/aliUpload.vue'
  export default {
    name: 'serviceManagement',
    components: {
      aliUpload
    },
    data () {
      return {
        upLoadText: '上传图片',
        accept: 'image/jpeg,image/png,image/gif',
        imageUrl: '',
        datePickTime: '',
        errorField: false,
        dialogFromIsShow: false,
        currentPage: 1,
        total: 0,
        pgSize: 20,
        pgNumoptions: [
          {
            value: 20,
            label: '20'
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
        fromData: {
          name: '',
          price: '',
          score: '',
          description: '',
          usefulTime: '',
          usefulEndTime: '',
          image: ''
        },
        tableData: [
          {name: '三叶风扇', img: '', price: '300', time: '2019-03-01', effeTime: '2019-03-01', number: '200', status: '下架', residueNumber: '120'}
        ],
        rules: {
          name: [
            { required: true, message: '请输入礼品名称', trigger: 'blur' },
            { max: 15, message: '长度不能超过15个字符', trigger: 'blur' }
          ],
          price: [
            { message: '礼品价格为数字', pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, trigger: 'change' }
          ],
          score: [
            {message: '兑换积分为整数', pattern: /^[+]{0,1}(\d+)$/}
          ]
        },
        isUploaded: false, // 是否上传了图片
        addData: {
          facialPhoto: '',
          userPostManagements: [{
            organizeId: [],
            userPostId: '',
            onMaster: true
          }]
        }
      }
    },
    created () {
      this.getDataList()
    },
    mounted () {
    },
    methods: {
      setAnnex (annexURL, annexName) {  // 子组件上传成功返回文件url 和名字
        // this.addData.annexes.push({
        //   'annexName': annexName,
        //   'annexURL': annexURL
        // })
        console.log(annexURL, annexName)
      },
      hasAuthority (code) {
        return context.user.hasAuthority(code)
      },
      handleClose () {
        this.datePickTime = ''
        this.fromData.name = ''
        this.fromData.price = ''
        this.fromData.socket = ''
        this.fromData.description = ''
        this.fromData.usefulTime = ''
        this.fromData.usefulEndTime = ''
        this.fromData.image = ''
        this.addData.facialPhoto = ''
        this.dialogFromIsShow = false
      },
      async imageChange (type, event) {
        this.errorField = false
        let path = ''
        let files = event.target.files
        if (files.length > 0) {
          if (files[0].type !== 'image/png' && files[0].type !== 'image/jpeg') {
            this.$message({
              type: 'error',
              message: '上传图片格式不正确'
            })
            return
          }
          if (files[0].size > (1024 * 1024 * 3)) {
            this.$message({
              type: 'error',
              message: '图片大小不可大于3M'
            })
            return
          }
          let form = new FormData()
          form.append('file', files[0])
          context.http.post('/ywm/api/image-multipart', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
            path = res.data
            if (type === 'addapp') {
              this.isUploaded = false// 去掉未上传图片样式
              this.addData.facialPhoto = path
              this.fromData.image = path
            }
          }).catch(error => {
            console.info(error)
          })
        }
      },
      async getDataList () {
        let result = await context.http.get('crm/api/gifts', {page: (this.currentPage - 1), size: this.pgSize})
        this.tableData = result.data
        this.total = Number(result.headers['x-total-count'])
      },
      upDownOnSale (index, row, tips) { // 上下架操作
        context.http.put('crm/api/gifts/sale', row).then(res => {
          if (res) {
            this.$message({
              message: tips + '成功！',
              type: 'success'
            })
            this.getDataList()
          }
        })
      },
      delOnSale (index, row) { // 删除礼品操作
        context.http.delete(`crm/api/gifts/${row.id}`).then(res => {
          if (res) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.getDataList()
          }
        })
      },
      dataPickFn (n) {
        if (n) {
          this.fromData.usefulTime = n[0]
          this.fromData.usefulEndTime = n[1]
        } else {
          this.fromData.usefulTime = ''
          this.fromData.usefulEndTime = ''
        }
      },
      onSaleFun (row, column) {
        return row.onSale ? '上架中' : '已下架'
      },
      usefulTimeFun (row, column) {
        if (row.usefulTime && row.usefulEndTime) {
          return row.usefulTime + ' --  ' + row.usefulEndTime
        } else {
          return ''
        }
      },
      dialogFrom () {
        this.dialogFromIsShow = true
      },
      submitForm (formName) { // 提交表单
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.addData.facialPhoto === '') {
              this.$message.error('请上传礼品图片')
              this.isUploaded = true
            } else {
              context.http.post('crm/api/gifts', this.fromData).then(res => {
                if (res) {
                  this.$message({
                    message: '新增礼品成功！',
                    type: 'success'
                  })
                  this.addData.facialPhoto = ''
                  this.$refs[formName].resetFields()
                  this.dialogFromIsShow = false
                  this.getDataList()
                }
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) { // 取消表单
        this.$refs[formName].resetFields()
        this.dialogFromIsShow = false
      },
      current_change (currentPage) {
        this.currentPage = currentPage
        this.getDataList()
      },
      pgSizeSelectFn () {
        this.currentPage = 1
        this.getDataList()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .content{
    background: #FFFFFF;
    margin-top: 30px;
    border: 1px solid #eee;
    min-height: 500px;
  }
  .head-portrait {
    padding-top: 20px;
    text-align: center;
    display: flex;
    .hp-img {
      width: 100px;
      height: 100px;
      border: 1px dashed #dfdfdf;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .upload {
      vertical-align: top;
      position: relative;
      margin: 25px 0 0 20px;
      .uploadbtn {
        display: inline-block;
        width: 88px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        border: 1px solid #5e72e4;
        border-radius: 8px;
        color: #5e72e4;
        margin-top: 14px;
        cursor: pointer;
        .icon-upload {
          background: url(../../../assets/upload.png) no-repeat;
          position: relative;
          top: 2px;
          width: 14px;
        }
      }
      input {
        position: absolute;
        top: 14px;
        right: 20px;
        width: 88px;
        height: 34px;
        opacity: 0;
        cursor: pointer;
      }
    }
    p {
      font-size: 12px;
      margin-top: 10px;
      color: #666;
    }
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .btnDel{
    color: red;
  }
  .red{
    color: red;
  }
  .avatar-uploader{
    border: 1px dashed #d9d9d9;
  }
  .avatar-uploader .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .uploadImg .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .uploadBox{
    margin-top: 10px;
    display: flex;
    align-items: flex-end;
  }
  #serviceManagement .el-form-item__label{
    line-height: 30px;
    padding-bottom: 0px;
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
    .el-col-18{
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
  .head-portrait .isUploaded{
    border: 1px dashed #f00;
  }
</style>
