<template>
  <div class="manual-entry">
    <div class="dl-content clearfix">
      <el-form :model="addData"
               ref="addData"
               :rules="addDataRules">
        <div class="dc-right">
          <div class="dr-head">基本信息</div>
          <el-form-item prop="nickName">
            <div class="cttitle">会员昵称<i class="required">*</i></div>
            <el-input v-model="addData.nickName" maxlength="8"></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 20px;">
            <div class="cttitle">性别</div>
            <el-select v-model="addData.sex"
                       placeholder="请选择">
              <el-option v-for="item in sexOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-bottom: 20px;">
            <div class="cttitle">出生年月</div>
              <el-date-picker v-model="addData.birthday"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="选择日期">
              </el-date-picker>
          </el-form-item>
          <el-form-item prop="telephone">
            <div class="cttitle">手机号<i class="required">*</i></div>
            <el-input v-model="addData.telephone"
                      type="tel"
                      maxlength="11"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
        </div>
        <div class="dc-right invoice-information"
             style="margin-bottom: 100px;">
          <div class="dr-head">积分信息</div>
          <el-form-item prop="score">
            <div class="cttitle">当前积分<i class="required">*</i></div>
            <el-input v-model="addData.score"
                      type="number"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 20px;" prop="totalScore">
            <div class="cttitle">累计积分<i class="required">*</i></div>
            <el-input v-model="addData.totalScore"
                      type="number"
                      maxlength="50"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 20px;">
            <div class="cttitle">累计消费</div>
            <el-input v-model="addData.consume"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 20px;">
            <div class="cttitle">订单完成量</div>
            <el-input v-model="addData.orderNum"
                      type="number"
                      maxlength="50"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 20px;width: 63%">
            <div class="cttitle">会员地址</div>
            <el-input v-model="addData.address"
                      placeholder="请输入内容" maxlength="25"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import context from '@/service'
export default {
  data () {
    return {
      addData: {},
      sexOptions: [
        {
          value: 'MALE',
          label: '男'
        },
        {
          value: 'FEMALE',
          label: '女'
        }
      ],
      addDataRules: {
        nickName: [
          { required: true, message: '请输入会员昵称', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '请输入当前积分', trigger: 'blur' }
        ],
        totalScore: [
          { required: true, message: '请输入累计积分', trigger: 'blur' }
        ],
        telephone: [
          { required: true, pattern: /^1[23456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ]
      },
      center: [],
      selHourse: false,
      selProject: false,
      chooseObj: {},
      projectList: []
    }
  },
  mounted () {
  },
  methods: {
    manualInput () {
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          context.http.post('/crm/api/members', this.addData).then(res => {
            if (res.status === 201) {
              this.addData = {}
              this.$emit('dialogClose')
              this.$emit('query')
            }
          })
        } else {
          console.log('create account fail!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
.manual-entry {
  .el-autocomplete {
    width: 100%;
  }
  .dc-right {
    width: 100%;
    border: 1px solid #e7e7e7;
    margin-top: 20px;
    .dr-head {
      background-color: #fafafa;
      height: 40px;
      line-height: 40px;
      padding-left: 12px;
      font-size: 14px;
      margin-bottom: 24px;
      font-weight: bold;
      span {
        color: #5364c5;
        font-size: 12px;
        margin-left: 20px;
        font-weight: normal;
        cursor: pointer;
      }
    }
    .el-form-item {
      width: 22%;
      margin-left: 16px;
      margin-right: 10px;
      &:nth-of-type(4n) {
        margin-right: 0;
      }
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 200px;
    }
  }
  .basic-item {
    width: 97%;
    margin: 0 auto;
    margin-bottom: 16px;
    p {
      font-size: 14px;
      margin-bottom: 6px;
    }
  }
  .basic-select {
    position: relative;
    cursor: pointer;
    .selectInput {
      height: 80px;
      border: 1px solid #e7e7e7;
      border-radius: 5px;
      padding: 0 15px;
      &.selectActive {
        border: 1px solid #6473cb;
      }
      img {
        float: left;
        display: block;
        width: 150px;
        height: 50px;
        margin-right: 10px;
        margin-top: 15px;
      }
      span {
        float: left;
        color: #666666;
        display: block;
        line-height: 80px;
        font-size: 14px;
        &:last-child {
          float: right;
          color: #6473cb;
        }
      }
    }
    .selectBox {
      width: 100%;
      border: 1px solid #e7e7e7;
      border-radius: 3px;
      background: #fff;
      position: absolute;
      left: 0;
      top: 86px;
      z-index: 9;
      padding: 15px 0px;
      box-shadow: 1px 2px 5px #ddd;
      overflow-y: auto;
      li {
        border-bottom: 1px solid #e7e7e7;
        padding: 10px 15px;
        display: flex;
        &:hover {
          background: #eee;
        }
        img {
          display: block;
          width: 50px;
          height: 21.3px;
          margin-right: 20px;
        }
        span {
          display: block;
          line-height: 20px;
          font-size: 14px;
        }
      }
    }
  }
  .invoice-information {
    .el-form-item {
      width: 30%;
    }
  }
  .el-form-item {
    display: inline-block;
  }
  .el-select {
    width: 100%;
  }
  .el-cascader {
    width: 100%;
  }
  .el-textarea__inner {
    height: 70px;
    font-size: 12px;
  }
  .preview-title {
    margin-left: 16px;
  }
  .preview-wrap {
    display: flex;
    justify-content: flex-start;
    margin: 10px 0;
    .preview {
      width: 160px;
      height: 140px;
      border: 1px solid #ddd;
      margin: 0 30px 0 16px;
      position: relative;
      .pw-bottom {
        position: absolute;
        background-color: #4883f6;
        text-align: center;
        color: #fff;
        width: 100%;
        bottom: 0;
        font-size: 14px;
        .upload-icon {
          background: url(../../../../assets/upload-white.png) no-repeat;
          background-size: contain;
          width: 12px;
          height: 12px;
          margin: 6px 6px 6px 0;
        }
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
        height: 140px;
        opacity: 0;
        cursor: pointer;
      }
    }
    .map {
      width: 684px;
      height: 200px;
      border: 1px solid #ddd;
    }
    .errorTip {
      color: red;
      bottom: -18px;
      position: absolute;
    }
  }
}
</style>
