<template>
  <div class="riskAssessment">
    <div class="content">
      <div v-for="(item,index) in listData"
           :key="index"
           class="item"
           :class="{'none':!item.value}">
        <p>{{item.label}}</p>
        <p @click="riskDetails(item.value,index)">{{item.value}}</p>
      </div>
      <div class="time"
           v-if="updateTime">
        上次同步日期：
        <span>{{updateTime}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import * as hub from '@/service/eventHub'
import { decrypt } from '@/utils/validate'
export default {
  name: 'businessInfor',
  props: {
    tenantDetail: {
      type: Object,
      default: {}
    },
    tabActive: {
      type: Number,
      default: 0
    }
  },
  watch: {
    tabActive: {
      handler: function (val, oldVal) {

      },
      immediate: true
    }
  },
  created () {
    this.getCountData()
    this.getUpdateTime()
  },
  mounted () {
    hub.eventHub.$on('teantName', function (msg) {
      this.tenantDetail.teantName = msg
    })
  },
  data () {
    return {
      listData: [],
      updateTime: null
    }
  },
  methods: {
    syncRisk () { // 同步风险信息
      // let params = {
      //   tenantId: 655,
      //   tenantName: '上海爱尚鲜花股份有限公司'
      // }
      let params = {
        tenantId: this.tenantDetail.id,
        tenantName: this.tenantDetail.teantName
      }
      context.http.get('/cms/api/tenantRisk', params).then(res => {
        if (res.status === 200) {
          let data = res.data
          let arr = [
            { label: '失信数据', value: data.DISHONESTY },
            { label: '被执行数据', value: data.EXECUTED },
            { label: '裁判文书', value: data.REFEREE },
            { label: '经营异常', value: data.MANAGEMENT },
            { label: '行政处罚', value: data.ADMINISTRATION },
            { label: '环保处罚', value: data.ENVIRONMENT },
            { label: '欠税公告', value: data.TAXARREARS },
            { label: '税收违法', value: data.TAXVIOLATION }
          ]
          this.listData = arr
          this.getUpdateTime()
          this.$message.success('风险信息获取成功')
        } else {
          this.$message.error('服务器错误，请稍后重试')
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    getCountData () {
      // let params = {
      //   tenantId: 655,
      //   tenantName: '上海爱尚鲜花股份有限公司'
      // }
      let params = {
        tenantId: this.tenantDetail.id,
        tenantName: this.tenantDetail.teantName
      }
      context.http.get('/cms/api/tenantRisk/count', params).then(res => {
        if (res.status === 200) {
          let data = res.data
          let arr = [
            { label: '失信数据', value: data.DISHONESTY },
            { label: '被执行数据', value: data.EXECUTED },
            { label: '裁判文书', value: data.REFEREE },
            { label: '经营异常', value: data.MANAGEMENT },
            { label: '行政处罚', value: data.ADMINISTRATION },
            { label: '环保处罚', value: data.ENVIRONMENT },
            { label: '欠税公告', value: data.TAXARREARS },
            { label: '税收违法', value: data.TAXVIOLATION }
          ]
          this.listData = arr
        }
      })
    },
    getUpdateTime () {
      // let params = {
      //   tenantId: 655,
      //   tenantName: '上海爱尚鲜花股份有限公司'
      // }
      let params = {
        tenantId: this.tenantDetail.id,
        tenantName: this.tenantDetail.teantName
      }
      context.http.get('/cms/api/tenantRisk/time', params).then(res => {
        if (res.status === 200) {
          if (res.data) {
            // this.updateTime = this.formatDate(res.data)
            this.updateTime = res.data
          }
        }
      })
    },
    formatDate (date) {
      var year = date.getFullYear()
      var month = this.format(date.getMonth() + 1)
      var da = this.format(date.getDate())
      // var h = this.format(date.getHours())
      // var m = this.format(date.getMinutes())
      // var s = this.format(date.getSeconds())
      // return year + '-' + month + '-' + da + ' ' + h + ':' + m + ':' + s
      return year + '-' + month + '-' + da
    },
    format (val) {
      return Number(val) < 10 ? '0' + val : '' + val
    },
    riskDetails (val, i) {
      if (val) {
        this.$emit('riskDetailsShowFn', i)
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    }
  }
}
</script>
<style lang="scss" scoped>
.riskAssessment {
  .content {
    padding: 15px;
    display: flex;
    flex-wrap: wrap;
    min-height: 470px;
    align-content: flex-start;
    position: relative;
    .item {
      font-size: 14px;
      color: #787878;
      width: 25%;
      margin-bottom: 25px;
      > p:last-child {
        cursor: pointer;
        color: #ea0101;
        margin-top: 10px;
        &:hover {
          text-decoration: underline;
        }
      }
      &.none {
        > p:last-child {
          cursor: text;
          color: #272727;
          &:hover {
            text-decoration: none;
          }
        }
      }
    }
    .time {
      position: absolute;
      bottom: 30px;
      right: 30px;
      > span {
        color: #3676f6;
      }
    }
  }
}
</style>
