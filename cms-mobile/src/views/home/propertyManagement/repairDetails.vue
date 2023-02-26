<template>
  <div class="repairDetails">
    <div class="head">
      <i class="back mintui mintui-back"
         @click="toRepairList"></i>
      <div class="headTab">{{repairDetails.repairType === 'BUILDING' ? (repairDetails.roomsName ? repairDetails.roomsName : '详情') : repairDetails.name}}</div>
    </div>
    <div class="content">
      <div class="basic-information">
        <div class="content-title">报修单信息</div>
        <div class="ul-warp">
          <div class="content-ul">
            <span>报修编号</span>
            <span>{{repairDetails.repairFormCode}}</span>
          </div>
          <div class="content-ul">
            <span>报修类型</span>
            <span>{{repairDetails.repairType==='ROOMS'?'房源':repairDetails.repairType==='EQUIREMENT'?'设备':'其他'}}</span>
          </div>
          <div v-if="isShow('EQUIREMENT')"
               class="content-ul">
            <span>设备编号</span>
            <span>{{repairDetails.equirementNo}}</span>
          </div>
          <div v-if="isShow('ROOMS')"
               class="content-ul">
            <span>房源号</span>
            <span>{{repairDetails.roomsName}}</span>
          </div>
          <div class="content-ul">
            <span>项目简称</span>
            <span>{{repairDetails.projectName}}</span>
          </div>
          <div class="content-ul content-ul-wrap" v-if="repairDetails.repairType === 'BUILDING'">
            <span>报修位置</span>
            <span>{{repairDetails.repairPosition ? repairDetails.repairPosition : repairDetails.buildingName}}</span>
          </div>
          <div class="content-ul" v-else>
            <span>楼宇名称</span>
            <span>{{repairDetails.buildingName}}</span>
          </div>
          <div v-if="isShow('EQUIREMENT')"
               class="content-ul">
            <span>设备名称</span>
            <span>{{repairDetails.name}}</span>
          </div>
          <div v-if="isShow('ROOMS')"
               class="content-ul">
            <span>房源名称</span>
            <span>{{repairDetails.name}}</span>
          </div>
          <div v-if="isShow('EQUIREMENT')"
               class="content-ul">
            <span>安装位置</span>
            <span>{{repairDetails.installPosition}}</span>
          </div>
          <!-- <div v-if="repairDetails.repairType !== 'EQUIREMENT'" -->
          <div class="content-ul content-ul-wrap">
            <span>问题简述</span>
            <span>{{repairDetails.title}}</span>
          </div>
          <div class="content-ul content-ul-wrap">
            <span>报修原因</span>
            <span>{{repairDetails.content}}</span>
          </div>
        </div>
        <div style="margin-bottom:0;"
             class="basic-information information-new">
          <div class="content-title">附件</div>
          <div v-if="repairDetails.annexes && repairDetails.annexes.length"
               class="an">
            <div class="an-item"
                 v-for="(item, index) in repairDetails.annexes"
                 :key="index">
              <div class="image">
                <svg class="icon"
                     aria-hidden="true">
                  <use :xlink:href="getformat(item.annexName)"></use>
                </svg>
              </div>
              <div class="annex-name">{{item.annexName}}</div>
              <div class="operating">
                <ailPreview :ailObj="item"
                            :encrypt="true"
                            class="ailPreview" />
              </div>
            </div>
          </div>
          <div v-else
               class="noData_text">暂无数据</div>
        </div>
      </div>
      <div class="basic-information">
        <div class="content-title remarkTitle">
          <span>备注</span>
          <i class="iconfont iconbianji"
             v-if="role==='YUNYING' && !remarkEdit"
             @click="remarkEdit=true"></i>
          <div class="btn"
               v-if="role==='YUNYING' && remarkEdit">
            <span @click="remarkEditCannel">取消</span>
            <span @click="saveFn">保存</span>
          </div>
        </div>
        <div class="content-remark"
             v-if="!remarkEdit">{{repairDetails.remark}}</div>
        <textarea placeholder="请输入备注"
                  class="textarea"
                  v-else
                  :rows="5"
                  maxlength="200"
                  v-model="repairDetails.remark"></textarea>
      </div>
      <div style="margin-bottom:0;"
           class="basic-information">
        <div class="content-title">维修记录</div>
        <div>
          <repair-record :repairId="repairId"
                         :repairDetails="repairDetails"
                         :role="role"></repair-record>
        </div>
      </div>
      <div class="loadAll contractLoadAll">
        <span>-</span>
        <p>已经到底了</p>
        <span>-</span>
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import ailPreview from '@/components/ailPreview.vue'
import common from '@/utils/common.js'
import repairRecord from './repairRecord'
import { Toast } from 'vant'
let roterFrom = null
export default {
  name: 'repairDetails',
  components: { ailPreview, repairRecord },
  data () {
    return {
      remarkEdit: false,
      repairId: '',
      role: 'YUNYING', // YUNYING 运营  WUYE  物业
      repairDetails: {}
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'repairList' || from.name === 'repairsInfo') {
      roterFrom = from.name
    } else if (from.name === 'addWeixiu') {
      roterFrom = sessionStorage.getItem('roterFrom')
    }
    next()
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  created () {
    if (roterFrom === 'repairsInfo') {
      this.role = 'YUNYING'
    } else if (roterFrom === 'repairList') {
      this.role = 'WUYE'
    }
    this.repairId = this.$route.query.repairId
    this.getRepairDetails()
  },
  mounted () {
    this.$parent.$refs['content'].scrollTop = 0
  },
  methods: {
    remarkEditCannel () {
      context.http.get(`cms/api/repair-forms/${this.repairDetails.id}`).then(res => {
        this.repairDetails = res.data
        this.remarkEdit = false
      })
    },
    saveFn () {
      context.http.put(`cms/api/repair-forms/remark`, { id: this.repairDetails.id, remark: this.repairDetails.remark }).then(res => {
        if (res) {
          Toast('保存成功')
          this.repairDetails = res.data
          this.remarkEdit = false
        }
      })
    },
    toRepairList () {
      sessionStorage.removeItem('roterFrom')
      this.$router.replace({ name: roterFrom })
      // this.$router.go(-1)
    },
    async getRepairDetails () {
      let res = await context.http.get(`cms/api/repair-forms/${this.repairId}`)
      this.repairDetails = res.data
    },
    isShow (n) { // 是否展示
      if (n === this.repairDetails.repairType) {
        return true
      } else {
        return false
      }
    },
    getformat (annexName) {
      return common.getformat(annexName)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../style/config";
.repairDetails {
  .noData_text {
    height: rem(80);
    line-height: rem(80);
    text-align: center;
    color: #878a9a;
  }
  .head {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: rem(40);
    line-height: rem(40);
    overflow: hidden;
    text-align: center;
    font-size: rem(16);
    background: #fff;
    display: flex;
    justify-content: space-between;
    z-index: 9;
    box-shadow: 0px 1px 4px 0px rgba(230, 230, 230, 0.5);
    .headTab {
      text-align: center;
      margin: 0 auto;
      color: #444547;
      font-size: rem(16);
      width: rem(300);
    }
    .back {
      position: fixed;
      left: 0;
      top: 0;
      width: rem(40);
      height: rem(40);
      font-size: rem(18);
      color: #000000;
      &:first-child {
        float: left;
      }
    }
    .addBtn {
      width: rem(40);
      height: rem(40);
      position: relative;
      i {
        font-size: rem(18);
        color: #444547;
        font-size: rem(18);
      }
    }
    .selected {
      color: #0139a4;
    }
  }
  .content {
    width: 100%;
    position: relative;
    top: rem(40);
  }
  .basic-information {
    margin-bottom: rem(10);
    background: #fff;
  }
  .textarea {
    width: 90%;
    margin: rem(10);
    padding: rem(5);
    background: #fafafa;
  }
  .content-title {
    color: #18191a;
    font-size: rem(17);
    height: rem(40);
    line-height: rem(40);
    font-weight: bold;
    padding-left: rem(14);
    border-bottom: rem(1) solid #f0f0f0;
    &.remarkTitle {
      display: flex;
      justify-content: space-between;
      padding-right: rem(15);
      > .btn {
        font-size: rem(13);
        font-weight: normal;
        > span {
          color: #3575f6;
          margin-left: rem(15);
          &:first-child {
            color: #858c94;
          }
        }
      }
      > i {
        font-size: rem(18);
        font-weight: normal;
      }
      > span {
      }
    }
  }
  .information-new {
    margin: 0;
    margin-top: rem(10);
    padding-bottom: rem(10);
    .content-title {
      color: #858c94;
      font-size: rem(15);
      height: rem(20);
      line-height: rem(20);
      font-weight: 500;
      padding-left: rem(14);
      border-bottom: 0;
      > span {
        font-size: rem(13);
      }
    }
  }
  .content-remark {
    font-size: rem(15);
    line-height: rem(21);
    color: #18191a;
    padding: rem(15) rem(14) rem(40);
  }
  .ul-warp {
    margin: 0 0 0 rem(14);
    border-bottom: rem(1) solid #f0f0f0;
    padding-bottom: rem(16);
    &:last-child {
      border: none;
    }
  }
  .content-ul {
    display: flex;
    justify-content: space-between;
    padding-top: rem(16) !important;
    padding-right: rem(14);
    font-size: rem(15);
    line-height: rem(20);
    > span {
      color: #18191a;
      &:first-child {
        color: #858c94;
        min-width: rem(64);
        margin-right: rem(10);
      }
    }
  }
  .content-ul-wrap {
    display: block;
    > span {
      display: block;
      line-height: rem(20);
      word-break: break-all;
      &:first-child {
        margin-bottom: rem(8);
      }
    }
  }
  .list {
    padding-left: rem(14);
    li {
      padding: rem(16) rem(14) rem(16) 0;
      position: relative;
      background: #fff;
      border-bottom: rem(1) solid #f0f0f0;
      &:last-child {
        border: 0;
      }
      > p {
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin-bottom: rem(6);
        > span {
          display: block;
          line-height: rem(20);
          color: #858c94;
          font-size: rem(15);
          width: rem(90);
          text-align: right;
        }
        > span:first-child {
          text-align: left;
          flex: 1;
          color: #18191a;
          font-weight: 600;
          font-size: rem(15);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: rem(5);
          > span {
            background: #eff6ff;
            height: rem(17);
            font-weight: 500;
            line-height: rem(17);
            font-size: rem(12);
            color: #0139a4;
            padding: 0 rem(3);
            vertical-align: center;
            margin-left: rem(12);
          }
        }
      }
      > div {
        > p {
          color: #444547;
          font-size: rem(14);
          margin-bottom: rem(8);
          &:last-child {
            margin-bottom: 0;
          }
          span {
            color: #858c94;
          }
        }
        > .momoInfo {
          font-size: rem(15);
          color: #18191a;
        }
        > .momoDate {
          font-size: rem(13);
          color: #858c94;
          text-align: right;
        }
      }
      > span {
        position: absolute;
        right: rem(10);
        top: rem(45);
        font-size: rem(17);
        color: #c6c6c6;
      }
    }
  }
  .an-item {
    display: flex;
    align-items: center;
    padding: rem(14) rem(14) 0;
    position: relative;
    &:nth-of-type(2) {
      margin-top: 0;
    }
    .image {
      margin-right: rem(10);
    }
    .annex-name {
      width: 80%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-bottom: rem(4);
    }
    .operating {
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }
  }
  .contractLoadAll {
    background: #fff;
    padding-top: rem(20);
    > p {
      // width: rem(80);
    }
  }
}
</style>
