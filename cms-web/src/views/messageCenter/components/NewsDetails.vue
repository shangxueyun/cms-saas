<template>
  <el-drawer size='750px'
             :title="title"
             :visible.sync="drawer"
             :before-close="handleClose"
             :with-header="false">
    <div class="drawer__content">
      <div style="flex: 1">
        <div class="head">
          <div>
            <img :src="detailsData.facialPhoto"
                 v-if="detailsData.facialPhoto" />
            <span v-else>{{createUserName}}</span>
          </div>
          <div>{{detailsData.createUserName}}</div>
        </div>
        <!-- 收件通知 -->
        <div class="newsType"
             v-if="detailsData.messageCenterType === 'NOTIFY'">
          类型：<span>{{detailsData.notifyTypeDescription}}</span>
        </div>
        <div class="addressee">
          收件人：<span v-if="detailsData.onSendAll">全体成员</span>
          <span v-else
                v-for="(item, index) in detailsData.users"
                :key="index">{{item.userName}}</span>
        </div>
        <!-- 发件通知 -->
        <div v-if="detailsData.messageCenterType === 'NOTIFY' && onSend"
             class="already-read">
          <span @click="showlist = !showlist"
                v-if="onSendParent">查看读信状态</span>
          <i class="iconfont icon-bottom"
             v-if="onSendParent"
             @click="showlist = !showlist"
             :class="{'icon-top': showlist}"></i>
          <div class="already-list"
               v-if="showlist">
            <span v-for="(item, index) in detailsData.users"
                  :key='index'
                  :class="{'unread': !item.readed}">
              {{item.userName}}
              <i class="iconfont icon-cms_gou"
                 v-if="item.readed"></i>
            </span>
          </div>
        </div>
        <div class="news-title">
          <span>{{detailsData.title}}</span>
          <span>{{formateData(detailsData.sendTime)}}</span>
        </div>
        <div :class="detailsData.messageBussinessType === 'APPROVAL' ? 'news-content APPROVAL' : 'news-content'"
             v-if="detailsData.content"
             v-html="`${detailsData.content}`">
        </div>
        <a class="routeSkip"
           v-if="detailsData.messageBussinessType === 'APPROVAL'"
           style="color: #3575F6;cursor: pointer;padding-bottom: 20px;display: block;width: 68px;"
           @click="routeSkip(detailsData)">点击查看</a>
        <div class="enclosure"
             v-if="detailsData.annexes.length>0">
          <span>附件</span>
          <div class="enclosure-list"
               v-for="(item, index) in detailsData.annexes"
               :key="index">
            <span>{{item.annexName}}</span>
            <!-- <span @click="downloadFile(item)">
              <i class="iconfont icon-xiazai"></i>
            </span> -->
            <span>
              <ailPreview :ailObj="item"
                          :picturePreview="true"
                          :encrypt="true"
                          @setFile="setFile" />
              <aliDownLoad class="aliDownLoad2"
                           :item="item"
                           :encrypt="true" />
            </span>

          </div>
        </div>
      </div>
      <div class="drawer__footer">
        <el-button @click="handleClose">关 闭</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import context from '@/service'
import * as hub from '@/service/eventHub'
import aliDownLoad from '@/components/aliDownLoad.vue'
import ailPreview from '@/components/ailPreview.vue'
import axios from 'axios'
export default {
  name: 'NewsDetails',
  components: {
    aliDownLoad,
    ailPreview
  },
  props: {
    showDrawer: {
      type: Boolean,
      default: false
    },
    newsType: {
      type: String,
      default: 'MESSAGE'
    },
    onSendParent: {
      type: Boolean,
      default: false // false收件 true发件
    },
    newsId: {
      type: Number,
      default: null
    }
  },
  // 11
  data () {
    return {
      title: '查看消息',
      drawer: false,
      showlist: false,
      onSend: false,
      detailsData: {
        annexes: []
      },
      createUserName: '',
      addresseeList: [],
      enclosureList: [],
      alreadyList: [],
      DetailsdetailsData: '',
      processInstanceInfo: '',
      contractStatus: '',
      taskId: '',
      contractInfo: '',
      billList: '',
      processDefineName: '',
      contractNo: '',
      brandTitle: ''
    }
  },
  // watch: {
  //   showDrawer: function (newVal, oldVal) {
  //     this.drawer = newVal
  //     if (newVal) {
  //       this.getDetails()
  //     }
  //   }
  // },
  created () {
    this.drawer = this.showDrawer
    if (this.drawer) this.getDetails()
  },
  methods: {
    setFile () {

    },
    handleClose () {
      this.$emit('drawClose')
    },
    downloadFile (item) {
      axios({ method: 'GET', url: '/ywm/api/annex/download', params: { annexURL: item.annexUrl, annexName: item.annexName }, responseType: 'blob' }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', item.annexName)
        document.body.appendChild(link)
        link.click()
      })
    },
    getDetails () {
      context.http.get(`/mps/api/messageCenters/${this.newsId}`).then(res => {
        if (res.status === 200) {
          hub.eventHub.$emit('getMessage')
          this.detailsData = res.data
          if (this.detailsData.messageCenterType === 'MESSAGE') {
            this.title = '查看消息'
          } else {
            this.title = '查看通知'
          }
          this.createUserName = this.detailsData.createUserName.length > 2
            ? (this.detailsData.createUserName).substring(this.detailsData.createUserName.length - 2) : this.detailsData.createUserName
          let createUser = sessionStorage.getItem('user')
          createUser = JSON.parse(createUser)
          if (this.detailsData.createUserId === createUser.id) {
            this.onSend = true
          }
        }
      }).catch(error => {
        console.info(error)
      })
    },
    routeSkip (row) {
      context.http.get(`/cms/api/process-instances/${row.bussinessIds[0] ? row.bussinessIds[0] : ''}`).then(result => { // 请求合同号和流程名称
        this.processDefineName = result.data.processDefineName
        this.contractNo = result.data.contractNo
        this.brandTitle = result.data.title
        let data = result.data
        // 存数据
        if (data.processDefineTypeName === '合同新增' || data.processDefineTypeName === '合同签订' || data.processDefineTypeName === '合同续签') { // 合同签订 or 合同续签
          if (row.ccTaskId) {
            context.http.get(`/cms/api/process-cctask/now/${row.ccTaskId}`).then(res => { // 请求流程图
              this.DetailsdetailsData = res.data
              this.processInstanceInfo = data
              this.queryContractInfo(row, data)
              // test
            })
          } else {
            context.http.get('/cms/api/process-task-versions/now/' + data.id).then(res => { // 请求流程图
              this.DetailsdetailsData = res.data
              this.processInstanceInfo = data
              this.queryContractInfo(row, data)
              // test
            })
          }
        } else if (data.processDefineTypeName === '合同退租') { // 合同退租
          this.$router.push({
            name: 'contractTenancy',
            params: {
              messageObject: row,
              messageHttp: result.data,
              brandTitle: this.brandTitle,
              processDefineName: result.data.processDefineName,
              contractNo: this.contractNo,
              row: result.data
            }
          })
        } else if (data.processDefineTypeName === '减免') { // 减免
          this.$router.push({
            name: 'derate',
            params: {
              messageObject: row,
              messageHttp: result.data,
              brandTitle: this.brandTitle,
              processDefineName: result.data.processDefineName,
              contractNo: this.contractNo,
              row: result.data
            }
          })
        } else if ((row.processApproval === 'REJECT' || row.processApproval === 'WITHDRAW') && row.processDetailType === 'START') { // 通用审批再次发起
          this.$router.push({
            name: 'relaunch',
            params: {
              messageObject: row,
              messageHttp: result.data,
              brandTitle: this.brandTitle,
              processDefineName: result.data.processDefineName,
              contractNo: this.contractNo,
              row: result.data
            }
          })
        } else { // 通用审批
          //         this.brandTitle = this.$route.params.brandTitle
          // this.approvalOperation = this.$route.params.approvalOperation
          // this.finshed = this.$route.params.finshed
          // this.processDefineName = this.$route.params.processDefineName
          // this.contractNo = this.$route.params.contractNo
          // this.getApprovalInfo(this.$route.params.row.businessId)
          // this.getProcessTasks(this.$route.params.row.id)
          // this.withdraw = this.$route.params.row.processStatus === 'RUNING'
          // this.showOnRent = this.$route.params.onRent === 1
          // this.NunOnRent = this.$route.params.onRent
          // this.followDetailsData = this.$route.params.row
          this.$router.push({
            name: 'customApproval',
            params: {
              messageObject: row,
              messageHttp: result.data,
              brandTitle: this.brandTitle,
              processDefineName: result.data.processDefineName,
              contractNo: this.contractNo,
              row: result.data
            }
          })
        }
      })
    },
    queryContractInfo (row, data) {
      context.http.get('/cms/api/contracts/' + this.processInstanceInfo.businessId).then(res => { // businessId业务合同详情id 用于请求合同详情
        this.contractInfo = res.data
        this.contractStatus = res.data.contractStatus
        this.taskId = res.data.taskId // taskId 任务id  用于提交任务（审核通过、驳回 重新发起等）
        this.queryBill(row, data)
      })
    },
    queryBill (row, data) {
      context.http.get(`/cms/api/bills/business/approve/${this.contractInfo.id}?businessType=`).then(res => {
        this.billList = res.data
        this.$router.push({
          name: 'approverCenterDetails',
          params: {
            row: data,
            messageObject: row,
            messageHttp: data,
            detailsData: this.DetailsdetailsData,
            processInstanceInfo: this.processInstanceInfo,
            approvalOperation: this.approvalOperation,
            contractInfo: this.contractInfo,
            billList: this.billList,
            contractStatus: this.contractStatus,
            finshed: this.finshed,
            taskId: this.taskId,
            processDefineName: this.processDefineName,
            contractNo: this.contractNo,
            onRent: this.onRent,
            brandTitle: this.brandTitle
          }
        })
      })
    },
    formateData (val) {
      if (val) {
        return val.replace('T', '  ')
      } else {
        return '-'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.drawer__content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.drawer__footer {
  text-align: right;
  margin-top: 10px;
}
.head {
  div {
    font-size: 16px;
    display: inline-block;
    color: #333;
    span {
      display: inline-block;
      width: 52px;
      height: 52px;
      background: rgba(53, 117, 246, 1);
      border-radius: 50%;
      text-align: center;
      line-height: 52px;
      color: #fff;
    }
    img {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      vertical-align: middle;
    }
    &:first-child {
      margin-right: 20px;
      font-size: 20px;
    }
  }
}
.newsType {
  color: #666;
  margin-top: 20px;
  span {
    color: #333;
  }
}
.addressee {
  color: #666;
  margin-top: 20px;
  span {
    display: inline-block;
    min-width: 70px;
    height: 24px;
    line-height: 24px;
    background: #eaf1fe;
    border-radius: 12px;
    color: #3575f6;
    text-align: center;
    margin-right: 10px;
    padding: 0 4px;
  }
}
.already-read {
  margin-top: 20px;
  > span {
    color: #3575f6;
    text-decoration: underline;
    cursor: pointer;
  }
  > i {
    color: #3575f6;
    cursor: pointer;
    font-size: 12px;
  }
}
.already-list {
  margin-top: 10px;
  span {
    color: #666;
    margin-right: 10px;
  }
  i {
    font-size: 12px;
  }
}
.unread {
  color: #eb605b !important;
}
.news-title {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  span {
    color: #333;
    &:last-child {
      color: #666;
    }
  }
}
.news-content {
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  margin-top: 20px;
  padding: 20px 0;
}
.APPROVAL {
  padding-bottom: 4px;
  border-bottom: none;
}
.enclosure {
  margin-top: 20px;
}
.routeSkip {
  position: relative;
}
.routeSkip::after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 712px;
  border-bottom: 1px solid #e5e5e5;
}
.enclosure-list {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  border-bottom: 1px solid #e5e5e5;
  font-size: 12px;
  i {
    cursor: pointer;
  }
  span {
    margin-bottom: 6px;
    display: flex;
  }
}
</style>
