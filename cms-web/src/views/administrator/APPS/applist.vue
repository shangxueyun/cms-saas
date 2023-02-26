<template>
  <div class="applist">
    <span class="page_head_title">应用商店</span>
    <div class="ct-content">
      <div class="ctc-search">
        <span>
          <el-checkbox-group v-model="checkList"
                             @change="bindCheckBox">
            <el-checkbox label="">全部</el-checkbox>
            <el-checkbox label="Installed">已安装</el-checkbox>
            <el-checkbox label="ToBeInstalled">待安装</el-checkbox>
            <el-checkbox label="UnderReview">审核中</el-checkbox>
          </el-checkbox-group>
        </span>
      </div>
      <div class="ctc-list"
           v-if="applistDataLength > 0">
        <div class="list-item"
             v-for="(item, index) in applistData"
             :key="index">
          <div class="li-head">
            <span>{{item.moduleName}}</span>
            <p class="alyinstalled"
               v-if="item.moduleStatus === 'Installed'">已安装</p>
            <span class="apply"
                  v-else-if="item.moduleStatus === 'ApplyInstall' && hasAuthority('01020101')"
                  @click="installapp(item, 'ApplyInstall', index)">申请安装</span>
            <span class="alyinstalled inaudit"
                  v-else-if="item.moduleStatus === 'UnderReview'">审核中</span>
            <span class="apply toBeInstalled"
                  :class="{downloading: download}"
                  v-else-if="item.moduleStatus === 'ToBeInstalled' && hasAuthority('01020102')"
                  @click="installapp(item, 'ToBeInstalled', index)">{{item.downloadWords}}</span>
            <span class="install"
                  v-else-if="item.moduleStatus === 'Installed'">已安装</span>
          </div>
          <div class="li-content">
            <div>
              <img :src="item.moduleLogo">
            </div>
            <div class="">
              <span>
                APP描述：{{item.description}}
              </span>
              <p>发布时间：{{TimeTrans(item.createdDate)}}
                <!-- <span @click="configAuthority(item)" v-if="item.moduleStatus === 'Installed'">配置权限</span> -->
              </p>
            </div>
          </div>
            <progressbar type="success" :start="item.download" :value="item.barValue" animate="animate"/>
        </div>
      </div>
    </div>
    <!-- <el-dialog title="配置权限" :visible.sync="dialogFormVisible" class="drawer">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" class="close-button">关 闭</el-button>
        <el-button type="primary" @click="confirmRelease('addRuleForm')" class="defaultbtn dialog-confirmBtn">确 认</el-button>
      </div>
    </el-dialog> -->
    <el-dialog :visible.sync="dialogTableVisible"
               class="resdialog">
      <div class="success-icon">
        <img src="../../../assets/success.png"
             alt="">
      </div>
      <div class="rescontent">
        <h3>提示信息</h3>
        <p>你的申请已提交，我们会尽快跟你联系！</p>
        <span @click="dialogTableVisible=false">知道了</span>
      </div>
    </el-dialog>
    <!-- 配置权限 -->
    <configurationAuthority ref="authority"
                            :permissiondrawershow="jurisdictionShow"
                            :roleObj="configureRole"
                            :roleData="roleData"
                            :existingAuthority="existingAuthority"
                            @drawerClose="permissionClose" />

    
  </div>
</template>
<script>
import progressbar from '@/components/progressbar'
import configurationAuthority from './components/configurationAuthority'
import context from '@/service'
// import * as hub from '@/service/eventHub'
export default {
  name: 'applist',
  components: {
    configurationAuthority,
    progressbar
  },
  data () {
    return {
      download: false,
      downloadWords: '安装',
      barValue: 0,
      drawerShow: false,
      jurisdictionShow: false,
      checkList: [''],
      dialogTableVisible: false,
      applistData: [{
        moduleApplieDTOs: [],
        downloadWords: '安装'
      }],
      addData: {
        openLevel: 'Section',
        onToll: false,
        moduleName: '',
        moduleLogo: ''
      },
      detailsData: {
        openLevel: '',
        onToll: '',
        moduleName: '',
        moduleLogo: ''
      },
      rules: {
        moduleName: [
          { required: true, message: '请输入APP名称', trigger: 'blur' }
        ]
      },
      errorField: false,
      errorTip: '',
      formLabelWidth: '120px',
      dialogFormVisible: false,
      dialogVisible: false,
      createdDate: '',
      applistDataLength: 0,
      configureRole: {},
      roleData: [],
      existingAuthority: []
    }
  },
  created () {
    this.query()
  },
  mounted () {

  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onHide () {
      this.drawerShow = false
    },
    permissionClose (data) {
      this.jurisdictionShow = false
    },
    bindCheckBox (value) {
      this.checkList = []
      this.checkList.push(value[1])
      this.query()
    },
    monitor (index) {
      this.applistData[index].download = true
      this.applistData[index].barValue = 100
      setTimeout(() => {
        this.applistData[index].download = false
        this.applistData[index].barValue = 0
        this.query()
      }, 2000)
      this.$forceUpdate()
    },
    async configAuthority (item) {
      this.configureRole = item
      // let res = await context.http.get(`uaa/api/roles/${item.id}`)
      // this.existingAuthority = res.data.authorities
      let result = await context.http.get('/uaa/api/authorities/module', { moduleNames: item.moduleName })
      this.roleData = result.data
      this.jurisdictionShow = true
    },
    LevelTrans (val) {
      if (val === 'All') {
        val = '全部可见'
      } else if (val === 'Section') {
        val = '授权可见'
      } else if (val === 'Disable') {
        val = '停用'
      }
      return val
    },
    TimeTrans (val) {
      if (val) {
        return val.substring(0, 10)
      }
      return ''
    },
    release () {
      this.dialogFormVisible = true
    },
    async query () {
      let code = localStorage.getItem('tenantKey')
      let result = await context.http.get('ywm/api/module-managements/authorization', { moduleStatus: this.checkList[0], corporateCustomerCode: code })
      this.applistData = result.data
      this.applistDataLength = result.data.length
      this.applistData.forEach(ele => {
        ele.download = false
        ele.barValue = 0
        ele.downloadWords = '安装'
      })
    },
    async installapp (item, type, index) {
      let code = localStorage.getItem('tenantKey')
      let result = await context.http.post('ywm/api/module-applies', { customerCode: code, moduleManagement: { id: item.id } })
      if (result.data) {
        if (type === 'ApplyInstall') {
          this.dialogTableVisible = true
        } else {
          item.downloadWords = '安装中'
          // item.download = true
          this.monitor(index)
        }
      }
    },
    confirmRelease (formName) {
      this.dialogTableVisible = true
      if (!this.addData.moduleLogo) {
        this.errorField = true
        this.errorTip = '请上传APP LOGO'
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          context.http.post('ywm/api/module-managements', this.addData).then(res => {
            if (res.status === 200 || res.status === 201) {
              this.dialogFormVisible = false
              this.query()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/config";
.applist {
  font-size: 16px;
  background-color: #f9f9f9;
  .ct-content {
    width: 100%;
    margin: 0 auto;
    .ctc-search {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      box-shadow: none;
      span {
        div {
          display: inline-block;
        }
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
      .addbtn {
        width: 138px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-size: 16px;
        color: #fff;
        background-color: #65ac69;
        margin-right: 30px;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
          background-color: #00954d;
        }
        i {
          font-size: 20px;
          margin-right: 6px;
          vertical-align: middle;
        }
      }
      div {
        cursor: pointer;
      }
    }
    .ctc-list {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      padding-top: 15px;
      .list-item {
        width: 375px;
        height: 190px;
        background-color: #fff;
        border: 1px solid #fff;
        border-radius: 8px;
        margin: 0 15px 30px 15px;
        -moz-box-shadow: 2px 2px 4px #e5e5e5;
        -webkit-box-shadow: 2px 2px 4px #e5e5e5;
        box-shadow: 2px 2px 4px #e5e5e5;
        &:hover {
          border: 1px solid #5e72e4;
        }
        // &:nth-child(4n) {
        //   margin-right: 0;
        // }
      }
      .li-head {
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span:first-child {
          display: inline-block;
          font-size: 18px;
          margin-left: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 250px;
        }
        span:last-child {
          font-size: 18px;
          margin-right: 16px;
          width: 76px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border-radius: 5px;
          font-size: 14px;
          cursor: pointer;
        }
        .apply {
          border: 1px solid #5e72e4;
          color: #5e72e4;
          &:hover {
            background-color: #3349c8;
            border-color: #3349c8;
            color: #fff;
          }
        }
        .toBeInstalled {
          border: 1px solid #92cf48;
          background-color: #92cf48;
          color: #fff;
          &:hover {
            background-color: #92cf48;
            border: 1px solid #92cf48;
          }
        }
        .downloading{
          border: 1px solid #fff;
          background-color: #fff;
          color: #92cf48;
          &:hover {
            background-color: #fff;
            border: 1px solid #fff;
            color: #92cf48;
          }
        }
        .install {
          background-color: #92cf48;
          color: #fff;
        }
        .alyinstalled {
          color: #000;
          font-size: 14px;
          margin-right: 16px;
        }
        .inaudit {
          color: #634cbe;
        }
        border-bottom: 1px solid #e5e5e5;
      }
      .li-content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 3px;
        font-size: 14px;
        div:first-child {
          margin: 16px 20px 0 16px;
        }
        div:nth-of-type(2) {
          height: 100px;
          margin-right: 4px;
          position: relative;
          margin-top: 10px;
          width: 63%;
          span {
            display: inline-block;
            width: 100%;
            height: 72px;
            line-height: 25px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          p {
            position: absolute;
            bottom: 0;
            span {
              background-color: #3577f6;
              border-color: #3577f6;
              color: #fff;
              width: 76px;
              height: 30px;
              line-height: 30px;
              text-align: center;
              border-radius: 5px;
              font-size: 14px;
              position: relative;
              top: 10px;
              cursor: pointer;
            }
          }
        }
        // div:nth-of-type(2)::after {
        //   content:"...";
        //   font-weight:bold;
        //   position:absolute;
        //   bottom:0;
        //   right:0;
        //   padding:0 20px 1px 45px;
        //   background:url(http://lidada.org/wp-content/uploads/2017/11/overflow_bg.png) repeat-y;
        // }
        img {
          width: 100px;
          height: 100px;
          border-radius: 10px;
          border: 1px solid #ddd;
        }
        .operation {
          height: 100px;
          p {
            width: 48px;
            height: 30px;
            line-height: 30px;
            border: 1px solid #99a4b8;
            border-radius: 4px;
            text-align: center;
            position: relative;
            cursor: pointer;
            &:hover {
              background-color: #f6f6f6;
            }
          }
          p:first-child {
            left: 24px;
            top: 5px;
          }
          p:last-child {
            left: 24px;
            bottom: -50px;
          }
        }
      }
    }
    @media (max-width: 1500px) {
      .ctc-list {
        width: 1024px;
        margin: 0 auto;
        .li-content div:nth-of-type(2) {
          width: 58% !important;
        }
      }
      .list-item {
        margin: 0 3px 30px 3px !important;
        width: 334px !important;
        // &:nth-child(3n) {
        //   margin-right: 0 !important;
        // }
      }
    }
    @media (min-width: 1501px) and (max-width: 1700px) {
      .list-item {
        // &:nth-child(3n) {
        //   margin-right: 0 !important;
        // }
        // &:nth-child(4n) {
        //   margin-right: 44px !important;
        // }
        margin: 0 15px 30px 15px !important;
      }
    }
  }
  .el-dialog__header,
  .el-dialog__body {
    margin: 0 40px;
    padding-left: 0;
    border-bottom: none;
  }
  .el-dialog__body {
    padding: 10px 0 0 0;
    height: 85%;
  }
  .el-form-item {
    display: inline-block;
    width: 100%;
  }
  .line {
    display: inline-block;
    width: 36px;
    border-bottom: 1px solid #bbbbbd;
    margin-left: 36px;
  }

  .el-form-item {
    margin-bottom: 14px;
  }
  .el-form-item__content {
    margin-top: 10px;
  }
  .defaultbtn {
    background-color: #5e72e4 !important;
    border-color: #5e72e4 !important;
  }
  .dl-subtitle {
    font-size: 16px;
  }
  .el-dialog__body {
    color: #000;
  }
  .required {
    color: $color-red-1;
    font-size: 16px;
    position: relative;
    top: 4px;
    left: 1px;
  }
  .applogo {
    margin-bottom: 10px;
    div {
      display: inline-block;
    }
    .logo {
      width: 100px;
      min-height: 100px;
      border: 1px dashed #cccccc;
      border-radius: 10px;
      img {
        width: 100%;
        height: auto;
      }
    }
    .upload {
      vertical-align: top;
      margin-left: 14px;
      position: relative;
      input {
        position: absolute;
        top: 34px;
        right: 18px;
        width: 88px;
        height: 34px;
        opacity: 0;
        cursor: pointer;
      }
      .uploadbtn {
        display: inline-block;
        width: 88px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        border: 1px solid #5e72e4;
        border-radius: 8px;
        color: #5e72e4;
        margin: 34px 0 10px 0;
        cursor: pointer;
        .icon-upload {
          background: url(../../../assets/upload.png) no-repeat;
          position: relative;
          top: 2px;
        }
      }
      p {
        font-size: 12px;
      }
    }
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: #5e72e4;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #5e72e4;
    background: #5e72e4;
  }
  .el-radio__label {
    color: #777;
  }
  .readonly {
    margin: 10px 0 20px 0;
    color: #666666;
  }
  .errorTip {
    color: red !important;
    width: 150px !important;
    left: 13px;
    position: relative;
    bottom: -75px;
  }
  .el-radio__inner {
    width: 18px;
    height: 18px;
  }
  .el-radio__inner::after {
    width: 8px;
    height: 8px;
  }
  .mainlayout {
    height: 90%;
    width: 900px;
    .drawer-content {
      width: 848px;
      height: 94%;
      margin: 0 auto;
      -moz-box-shadow: 0 0 10px #e5e5e5;
      -webkit-box-shadow: 0 0 10px #e5e5e5;
      box-shadow: 0 0 10px #e5e5e5;
      .permission-list {
        height: 40%;
        border-bottom: 1px solid #eeeeee;
        .pl-left {
          width: 20%;
          height: 100%;
          border-right: 1px solid #eee;
          p {
            height: 15%;
            background-color: #3577f6;
            color: #fff;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
          }
        }
        .pl-right {
          width: 78%;
          height: 100%;
          padding-top: 26px;
          .plr-item:nth-of-type(2) {
            margin-top: 40px;
          }
        }
      }
      .permission-role {
        height: 60%;
        margin: 40px 20px 0 20px;
        p {
          margin-bottom: 20px;
          font-size: 16px;
        }
        .el-select {
          width: 100%;
        }
        .pr-bottom {
          margin-top: 25%;
          p {
            margin-bottom: 10px;
          }
          p:last-child {
            color: #898989;
            span {
              font-size: 14px;
            }
          }
        }
      }
    }
    .checkAll {
      font-size: 16px;
      .el-checkbox__label {
        font-size: 16px;
      }
    }
  }
  .resdialog {
    .el-dialog {
      width: 500px;
      height: 300px;
      border-radius: 8px;
    }
    .success-icon {
      text-align: center;
    }
    .rescontent {
      text-align: center;
      margin-top: 20px;
      h3 {
        color: #333;
      }
      p {
        font-size: 16px;
        margin: 20px 0;
      }
      span {
        display: inline-block;
        width: 140px;
        height: 40px;
        line-height: 40px;
        background-color: #3577f6;
        color: #fff;
        border-radius: 4px;
        margin-bottom: 10px;
        cursor: pointer;
      }
    }
  }
}
</style>
