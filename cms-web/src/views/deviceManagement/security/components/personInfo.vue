<template>
  <div class="personInfo">
    <div class="person-card">
      <div class="dr-head"><span style="font-size: 14px;color:#333333">基本信息</span></div>
      <div class="form-item">
        <div class="cttitle">工号<i style="color:red">*</i></div>
        <span>{{detailsData.code}}</span>
      </div>
      <div class="form-item">
        <div class="cttitle">姓名<i style="color:red">*</i></div>
        <span>{{detailsData.name}}</span>
      </div>
      <div class="form-item">
        <div class="cttitle">性别<i style="color:red">*</i></div>
        <span>{{sexFormatter(detailsData.sex)}}</span>
      </div>
      <div class="form-item">
        <div class="cttitle">联系方式<i style="color:red">*</i></div>
        <span>{{detailsData.telephone}}</span>
      </div>
      <div class="form-item">
        <div class="cttitle">籍贯</div>
        <span>{{detailsData.nativePlace}}</span>
      </div>
      <div class="form-item">
        <div class="cttitle">出生日期</div>
        <span>{{detailsData.birth}}</span>
      </div>
      <div class="form-item">
        <div class="cttitle">身份证号码</div>
        <span>{{detailsData.certificate}}</span>
      </div>
      <div class="form-item">
        <div class="cttitle">民族</div>
        <span>{{detailsData.national}}</span>
      </div>
      <div class="form-item">
        <div class="cttitle">健康状况</div>
        <span>{{detailsData.health}}</span>
      </div>
      <div class="form-item">
        <div class="cttitle">现居地址</div>
        <span>{{detailsData.address}}</span>
      </div>
    </div>
    <div class="person-card">
      <div class="dr-head"><span style="font-size: 14px;color:#333333">在职信息</span></div>
      <div class="form-item">
        <div class="cttitle">项目简称<i style="color:red">*</i></div>
        <span>{{detailsData.projectManagement}}</span>
      </div>
      <div class="form-item">
        <div class="cttitle">职务</div>
        <span>{{detailsData.duty}}</span>
      </div>
      <div class="form-item">
        <div class="cttitle">岗位名称<i style="color:red">*</i></div>
        <span>{{positionFormatter(detailsData.position)}}</span>
      </div>
      <div class="form-item">
        <div class="cttitle">岗位职责</div>
        <span>{{detailsData.responsibility}}</span>
      </div>
      <div class="form-item">
        <div class="cttitle">入职时间<i style="color:red">*</i></div>
        <span>{{detailsData.entryDate}}</span>
      </div>
      <div class="form-item">
        <div class="cttitle">在职状态<i style="color:red">*</i></div>
        <span>{{jobStatusFormatter(detailsData.jobStatus)}}</span>
      </div>
    </div>
    <slot name="footer"></slot>
  </div>
</template>
<script>
export default {
  props: {
    detailsData: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
    }
  },
  watch: {
  },
  created () {
  },
  methods: {
    sexFormatter (rowSex) {
      let sex
      switch (rowSex) {
        case 'MAN':
          sex = '男'
          break
        case 'WOMAN':
          sex = '女'
          break
      }
      return sex
    },
    positionFormatter (rowPosition) {
      let position
      switch (rowPosition) {
        case 'GUARD':
          position = '保安'
          break
        case 'CLEANER':
          position = '保洁'
          break
      }
      return position
    },
    jobStatusFormatter (rowJobStatus) {
      let jobStatus
      switch (rowJobStatus) {
        case 'ONJOB':
          jobStatus = '在职'
          break
        case 'RESIGNA':
          jobStatus = '离职'
          break
      }
      return jobStatus
    }
  }
}
</script>
<style scope lang="scss">
.personInfo{
  .dialog-footer{
    padding:20px 0;
    border-top:1px solid #E5E5E5;
    margin-top:180px;
    text-align: right;
  }
  .person-card {
    width: 100%;
    border: 1px solid #e7e7e7;
    margin-bottom:16px;
    .dr-head {
      background-color: #fafafa;
      height: 40px;
      line-height: 40px;
      padding-left: 12px;
      font-size: 14px!important;
      color: #333333!important;
      margin-bottom: 24px;
    }
    .form-item {
      display: inline-block;
      width: 30%;
      margin-left: 16px;
      margin-bottom:24px;
      vertical-align: top;
      &:nth-of-type(3n) {
        margin-right: 0;
      }
      >span{
        display: block;
        height:18px;
        line-height: 18px;
      }
    }
  }
}
</style>
