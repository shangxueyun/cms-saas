<template>
  <div class="RelatedInformation">
    <app-header :title="tenantDetailAame"
                class="retitle"
                :mode="false"
                :onBackCallBack="goBack">
    </app-header>
    <div class="content-warp">
      <!-- 内容区域 -->
      <div class="content"
           id="content">
        <!-- 基本信息 -->
        <div class="tenant-infor">
          <div class="basic-information">
            <div class="content-title">基本信息</div>
            <div class="ul-warp"
                 v-if="relateType !== 'otherRelations'">
              <div class="content-ul">
                <span>{{tenantDetailAame}}</span>
                <span>{{tenantDetail.name}}</span>
              </div>
              <div class="content-ul"
                   v-if="tenantDetailAame === '施工单位'">
                <span>施工内容</span>
                <span>{{tenantDetail.content}}</span>
              </div>
              <div class="content-ul">
                <span>联系人</span>
                <span>{{tenantDetail.contacts}}</span>
              </div>
              <div class="content-ul">
                <span>联系人职务</span>
                <span>
                  {{tenantDetail.contactsPost}}
                </span>
              </div>
              <div class="content-ul">
                <span>手机号</span>
                <span>
                  {{tenantDetail.telephone}}
                </span>
              </div>
              <div class="content-ul">
                <span>公司固话</span>
                <span>{{tenantDetail.fixedTel}}</span>
              </div>
              <div class="content-ul">
                <span>备注</span>
                <span v-html="formatreplace(tenantDetail.remark)">{{tenantDetail.remark}}</span>
              </div>
            </div>
            <!-- ---------------------------------------------------------- -->
            <div class="ul-warp"
                 v-else>
              <div class="content-ul">
                <span>单位名称</span>
                <span>{{tenantDetail.name}}</span>
              </div>
              <div class="content-ul">
                <span>联系人</span>
                <span>{{tenantDetail.contacts}}</span>
              </div>
              <div class="content-ul">
                <span>联系人电话</span>
                <span>
                  {{tenantDetail.telephone}}
                </span>
              </div>
              <div class="content-ul">
                <span>备注</span>
                <span v-html="formatreplace(tenantDetail.remark)">{{tenantDetail.remark}}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 记录信息 -->
        <div class="followUp-record"
             v-bind:style="{ minHeight: minHeight + 'px' }">
          <div class="basic-information">
            <div class="content-title">记录信息</div>
            <follow-record :relatedId="relatedId"
                           :relateType="relateType"
                           :projectId="projectId"
                           :active="active"></follow-record>
          </div>
        </div>
        <!-- 附件 -->
        <div class="total-expenses">
          <div class="basic-information">
            <div class="content-title an-title">附件
              <i class="iconfont iconcms_fujiantianjia">添加附件
                <aliUpload class="aliUpload"
                           @setAnnex="setAnnex" />
              </i>
            </div>
            <div class="ul-warp">
              <div class="annex common">
                <div class="an-item"
                     v-for="(item, index) in tenantDetailAnnexes"
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
                    <span @click="delEnclosure(item.id)"
                          class="delcl"><i class="iconfont iconcms_shanchu-233"></i></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="loadAll contractLoadAll">
          <span>-</span>
          <p>已经到底了</p>
          <span>-</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import context from '@/service'
import AppHeader from '@/components/appHead'
import ailPreview from '@/components/ailPreview.vue'
import FollowRecord from './FollowRecord'
import myMixin from '../approvalCenter/mixin.js'
import * as JSOG from 'jsog'
import common from '@/utils/common.js'
import aliUpload from '@/components/aliUpload.vue'
import { MessageBox } from 'mint-ui'
export default {
  name: 'relatedInformation',
  components: { AppHeader, ailPreview, FollowRecord, aliUpload },
  mixins: [myMixin],
  data () {
    return {
      Xiaomi: true,
      tenantDetailAame: '',
      active: 0,
      tenantDetail: {
        projectManagementDTO: {
          referred: ''
        }
      },
      minHeight: '',
      relatedId: this.$route.query.relatedId,
      tenantDetailAnnexes: []
    }
  },
  created () {
    this.projectId = this.$route.query.projectId
    this.relateType = this.$route.query.relateType
    if (this.relateType === 'propertyOwnerRelation') {
      this.tenantDetailAame = '产权人'
    } else if (this.relateType === 'bulidUnitRelation') {
      this.tenantDetailAame = '项目建设单位'
    } else if (this.relateType === 'designUnitRelation') {
      this.tenantDetailAame = '项目设计单位'
    } else if (this.relateType === 'supervisorRelation') {
      this.tenantDetailAame = '监理单位'
    } else if (this.relateType === 'relations') {
      this.tenantDetailAame = '施工单位'
    } else if (this.relateType === 'otherRelations') {
      this.tenantDetailAame = '其他'
    }
    this.getDetails()
  },
  mounted () {
    this.$nextTick(() => {
      this.minHeight = 100
    })
  },
  methods: {
    goBack () {
      this.$router.replace({ name: 'projectDetail', query: { 'id': this.projectId } })
    },
    getformat (annexName) {
      return common.getformat(annexName)
    },
    getDetails () {
      context.http.get(`cms/api/project-managements/relation/${this.relatedId}`).then(res => {
        if (res.status === 200) {
          this.tenantDetail = res.data
        }
      })
      this.getTenantDetailAnnexes()
    },
    getTenantDetailAnnexes () {
      context.http.get(`cms/api/annexes?projectManagementRelationId=${this.relatedId}`).then(res => {
        if (res.status === 200) {
          this.tenantDetailAnnexes = res.data
        }
      })
    },
    formatreplace (description) {
      if (!description) {
        return
      }
      let html = description.replace(/\n/g, '<br/>')
      return html
    },
    setAnnex (annexURL, annexName) {
      const annexes = {
        projectManagementRelationId: this.relatedId,
        annexURL: annexURL,
        annexName: annexName
      }
      context.http.post(`cms/api/annexes`, annexes).then(res => {
        if (res.status === 201) {
          this.getTenantDetailAnnexes()
          this.$forceUpdate()
        }
      })
    },
    delEnclosure (delId) {
      let _this = this
      MessageBox.confirm('', {
        message: '是否删除该附件？',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        confirmButtonClass: 'confirmButton',
        cancelButtonClass: 'cancelButton'
      }).then(action => {
        if (action === 'confirm') {
          _this.delFun(delId)
        }
      })
    },
    delFun (delId) {
      context.http.delete(`cms/api/annexes/${delId}`).then(res => {
        if (res.status === 200) {
          this.getTenantDetailAnnexes()
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import "../../../style/config";
.RelatedInformation {
  .retitle {
    .title {
      padding-left: rem(30);
    }
    .right_btn {
      width: rem(74) !important;
    }
  }
}
</style>
<style lang="scss" scoped>
@import "../../../style/config";
.postbtn {
  color: #0139a4;
  font-size: rem(14);
}
.content-warp {
  font-size: rem(15);
}
.content-head {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  padding: rem(16) rem(14) rem(20) rem(14);
  margin-bottom: rem(10);
  img {
    width: rem(90);
    height: rem(90);
    border: 1px solid #fff;
    border-radius: rem(6);
  }
  .head-info {
    color: #18191a;
    p {
      margin-bottom: rem(14);
      text-align: right;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.underline {
  width: rem(70);
  height: rem(3);
  background: rgba(1, 57, 164, 1);
  border-radius: rem(2);
  position: relative;
  top: rem(6);
}
/* 内容区的样式 */
.content {
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  top: rem(48);
}
.content > div {
  width: 100%;
  // max-height: rem(2000);
  margin-bottom: rem(10);
  &:last-child {
    margin: 0;
  }
}
.contractstatus {
  &.EXECUTING {
    color: #1cc296;
  }
  &.MATURITY {
    color: #fc5159;
  }
  &.WITHDRAWAL {
    color: #858c94;
  }
}
.basic-information {
  margin-bottom: rem(10);
  background: #fff;
}
.content-title {
  color: #18191a;
  font-size: rem(17);
  height: rem(40);
  line-height: rem(40);
  font-weight: bold;
  padding-left: rem(14);
  border-bottom: rem(1) solid #f0f0f0;
}
.sub-title {
  color: #18191a;
  font-size: rem(15);
  font-weight: bold;
  margin-top: rem(14);
}
.ul-warp {
  margin: 0 rem(14) 0 rem(14);
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
  font-size: rem(15);
  > span {
    color: #18191a;
    &:first-child {
      color: #858c94;
      min-width: rem(64);
      margin-right: rem(10);
    }
  }
}
.content-div {
  padding-top: rem(16) !important;
  font-size: rem(15);
  > span {
    color: #858c94;
  }
  div {
    padding-top: rem(10);
    color: #18191a;
  }
}
.an-item {
  display: flex;
  align-items: center;
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
  .ailPreview {
    flex: 1;
    text-align: right;
  }
  .operating {
    display: flex;
    justify-content: space-between;
  }
}
.an-title {
  display: flex;
  justify-content: space-between;
  .iconfont {
    color: #023c8f;
    font-size: rem(14);
    position: relative;
    margin-right: rem(14);
  }
  .iconcms_fujiantianjia:before {
    padding-right: rem(6);
  }
  .aliUpload {
    width: rem(80);
    height: rem(20);
  }
}
</style>
