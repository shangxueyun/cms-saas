<template>
  <div class="tenant-details">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            class="new_vue_drawer"
            :wrapperClosable="false"
            @on-hide="onHide('close')">
      <div class="tenant-details details-content" slot="drawer" id="adminUnit">
        <div class="adminUnit_top">
          <div class="basicInfo">
            <p class="title"><i></i>基本信息</p>
            <div class="dweditbtn" v-if="readOnly" @click="edit"><i class="iconfont icon-edit1"></i>编辑</div>
            <div class="content">
              <el-form :model="tenantDetail"  ref="tenantDetail"  :rules="tenantDetailRules">
                <el-form-item prop="deptName">
                  <div class="cttitle">关联单位<i class="required">*</i></div>
                  <span v-if="readOnly" class="txt">{{tenantDetail.deptName}}</span>
                  <el-input v-else v-model="tenantDetail.deptName" style="width:300px" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item prop="address">
                  <div class="cttitle">办公地址<i class="required">*</i></div>
                  <span v-if="readOnly" class="txt">{{tenantDetail.address}}</span>
                  <el-input v-else v-model="tenantDetail.address" style="width:300px" maxlength="50"></el-input>
                </el-form-item>
                <!-- <el-form-item prop="officialUrl">
                  <div class="cttitle">官方网站</div>
                  <span v-if="readOnly" class="txt">{{tenantDetail.officialUrl}}</span>
                  <el-input v-else v-model="tenantDetail.officialUrl" style="width:300px"></el-input>
                </el-form-item> -->
                <el-form-item>
                  <div class="cttitle">联系电话</div>
                  <span v-if="readOnly" class="txt">{{tenantDetail.deptTel}}</span>
                  <el-input v-else v-model="tenantDetail.deptTel" style="width:300px"></el-input>
                </el-form-item>
                <el-form-item>
                  <div class="cttitle">简介</div>
                  <span style="word-wrap: break-word;word-break: normal;"
                        v-html="formatreplace(tenantDetail.introduction)" v-if="readOnly" class="txt">{{tenantDetail.introduction}}</span>
                  <el-input class="adminTextear" v-else type="textarea"
                            placeholder="请输入500字以内"
                            resize="none"
                            maxlength="500" 
                            v-model="tenantDetail.introduction"
                            style="width:300px;height:88px;"></el-input>
                </el-form-item>


                <div class="head_contacts">
                  <span>联系人<i style="color:red">*</i></span>
                  <span>职务</span>
                  <span>手机</span>
                </div>
                <span class="body_contacts" v-for="(item,index) in tenantDetail.contacts" :key="index">
                  <div class="contacts_li">
                    <span :title="item.name" v-if="readOnly" class="txt">{{item.name}}</span>
                    <el-input v-else v-model="item.name" style="width:110px" maxlength="10"></el-input>                   
                  </div>
                  <div class="contacts_li">
                    <span :title="item.post" v-if="readOnly" class="txt">{{item.post}}</span>
                    <el-input v-else v-model="item.post" style="width:110px" maxlength="10"></el-input>      
                  </div>
                  <div class="contacts_li">
                    <span :title="item.telephone" v-if="readOnly" class="txt">{{item.telephone}}</span>
                    <el-input v-else v-model="item.telephone" style="width:128px" maxlength="20" onkeyup="value=value.replace(/[^0-9]/g,'')"></el-input>
                    <div v-if="!readOnly" class="toolContent">
                      <i class="iconfont icon-lajixiang"
                        v-if="index>0"
                        @click="subItem(item,index)"></i>
                    </div>                    
                  </div>
                </span>
                <div v-if="!readOnly" class="addItem">
                  <span @click="addItem()"><span class="iconfont icon-add-new"></span><span>继续添加</span></span>
                </div>
              </el-form>
              <div style="padding-right:0;" slot="footer" v-if="!readOnly" class="dialog-footer">
                <el-button style="padding:12px 5px;width:60px;background:#ffffff!important;border:0;" @click="onHide" class="close-button">取消</el-button>
                <el-button style="padding:12px 5px;width:60px!important;margin-left:0;" type="primary" @click="editTenant('tenantDetail')" class="defaultbtn dialog-confirmBtn">保存</el-button>
              </div>
            </div>
          </div>
           <div class="collapse">
            <p class="title"><i></i>历史资料存档</p>
            <span class="iconfont icon-shangchuanfujianicon">
                            <aliUpload class="aliUpload emergencyAliUpload"
                                        style="display: inline-block;"
                                        :upLoadText="upLoadText_data"
                                        :fileSize="fileSize"
                                        :fileType="fileType_data"
                                        :iconShow="false"
                                        @setAnnex="setAnnex_data" />
                          </span>
                <div class="collapseContent">
                  <div class="annexesHead">
                    <span>文件名</span>
                    <span>上传时间</span>
                    <span>操作</span>
                  </div>
                  <div style="padding:0;display: flex;justify-content: space-around;" v-for="(item,index) in tenantDetail.annexes"
                        :key="index">
                    <span :title="item.annexName">{{item.annexName}}</span>
                    <span>{{item.createTime.substring(0, 19).replace('T', ' ')}}</span>
                    <span>
                      <aliDownLoad :item="item"
                                    style="margin-right:10px;display: inline-block;width:auto;height:auto" />
                      <i class="iconfont icon-lajixiang"
                          @click="dataDel(index)"></i>
                    </span>
                  </div>
                </div>
          </div>
        </div>
        <div class="recordList">
            <p class="title"><i></i>记录信息 </p>
            <div class="addbtn" @click="addflowList"><i class="iconfont icon-cms_xiegenjin-1"></i>新增记录</div>
            <div class="timelineDiv">
              <el-timeline class="timeline" v-if="timeLineListData.length>0">
                <el-timeline-item
                                  style="position:relative;min-height: 80px;"
                                  v-for="(item, index) in timeLineListData"
                                  :key="index"
                                  size="normal"
                                  :color="nodeColor(index)">
                  <div class="timeLineBox">
                    <div class="recodeIcon" v-if="index===0">记录</div>
                    <div :class="{'first':index===0, 'timeLineTip': true}">{{formatApprovalDate(item.recordDate)}}</div>
                  </div>
                  <div class="template">
                    <p><span>记录人：</span>{{item.writter}}</p>
                    <p><span>发生事件：</span>{{item.title}}</p>
                    <p><span>发生内容：</span>{{item.content}}</p>
                    <div class="annexes">
                      <p v-for="(items, i) in item.annexes" :key="i">
                        <span>{{items.annexName}}</span>
                        <aliDownLoad :item="items" style="margin-right:10px;display: inline-block;width:auto;height:auto"/>
                      </p>
                    </div>
                  </div>
                </el-timeline-item>
              </el-timeline>
              <!-- <span v-else>暂无数据</span> -->
            </div>
          </div>
       

      </div>
    </drawer>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import Drawer from '@/components/drawer.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import aliUpload from '@/components/aliUpload.vue'
export default {
  components: {
    Drawer,
    aliDownLoad,
    aliUpload
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    tenantDetail: {
      type: Object,
      default: {
        annexes: []
      }
    },
    timeLineListData: {
      type: Array,
      default: []
    }
  },
  watch: {

  },
  data () {
    var validateTel = (rule, value, callback) => {
      let reg = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
      if (value === '' || value === undefined) {
        // callback(new Error('请输入部门电话'))
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('格式错误'))
      } else {
        callback()
      }
    }
    var validateUrl = (rule, value, callback) => {
      let reg = new RegExp(/^[hH][tT][tT][pP]([sS]?):\/\/(\S+\.)+\S{2,}$/)
      if (value === '' || value === undefined) {
        // callback(new Error('请输入官方网址'))
        callback()
      } else if (!reg.test(value)) {
        callback(new Error('格式错误'))
      } else {
        callback()
      }
    }
    return {
      tenantDetailRules: {
        officialUrl: [
          { validator: validateUrl, trigger: 'blur' }
        ],
        deptTel: [
          { validator: validateTel, trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '请输入关联单位', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入办公地址', trigger: 'blur' }
        ]
      },
      drawerTitle: '关联单位',
      readOnly: true,
      upLoadText_data: '上传附件',
      fileSize: 100,
      fileType_data: []
    }
  },
  mounted () {

  },
  methods: {
    nodeColor (index) {
      return index === 0 ? '#3575F6' : '#D3DBEB'
    },
    addflowList () {
      // 参数为关联单位id
      this.$emit('showflowListDialoag', this.tenantDetail.id)
    },
    formatApprovalDate (time) {
      if (time) {
        time = time.substr(0, time.lastIndexOf('T'))
        return time
      }
    },
    editTenant () {
      let contactsTurn = false
      this.tenantDetail.contacts.forEach(item => {
        if (!item.name) {
          contactsTurn = true
        }
      })
      if (contactsTurn) {
        this.$message({
          type: 'error',
          message: '请完善联系人'
        })
        return
      }
      this.$refs['tenantDetail'].validate((valid) => {
        if (valid) {
          context.http.put('/cms/api/chargeDept', this.tenantDetail).then(res => {
            this.onHide()
            this.$emit('refreshQuery', this.tenantDetail.projectId)
            this.$message({
              type: 'success',
              message: '保存成功'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onHide (state) {
      this.readOnly = true
      if (state === 'close') {
        this.$emit('drawerClose', false)
      } else {
        this.$emit('detail', this.tenantDetail.id)
      }
    },
    edit () {
      this.readOnly = false
    },
    setAnnex_data (annexURL, annexName) { // 资料存档上传
      let tenantDetail = JSON.parse(JSON.stringify(this.tenantDetail))
      tenantDetail.annexes.push({
        annexURL: annexURL,
        annexName: annexName
      })
      context.http.put('/cms/api/chargeDept', tenantDetail).then(res => {
        this.$set(this.tenantDetail, 'annexes', res.data.annexes)
        this.$forceUpdate()
      })
    },
    dataDel (index) {
      this.tenantDetail.annexes.splice(index, 1)
      this.$forceUpdate()
      context.http.put('/cms/api/chargeDept', this.tenantDetail).then(res => {
      })
    },
    subItem (item, index) {
      this.tenantDetail.contacts.splice(index, 1)
    },
    addItem (item, index) { // 加减联系人
      // if (this.tenantDetail.contacts.length === 5) {
      //   this.$message({
      //     type: 'error',
      //     message: '最多添加5名联系人'
      //   })
      //   return
      // }
      this.tenantDetail.contacts.push(
        { name: '', post: '', telephone: '' }
      )
    },
    formatreplace (description) {
      if (!description) {
        return
      }
      let html = description.replace(/\n/g, '<br/>')
      return html
    }
  }
}
</script>
<style lang="scss" scope>
.tenant-details {
  .el-input__inner{
    height:32px;
  }
  .el-input__icon {
    line-height: 32px;
  }
  .close-button:hover{
    color:#3577F6!important;
  }
  .details-content{
    &#adminUnit{
      width: 1110px;
      .adminUnit_top{
        width: 450px;
      }
    }
    .title{
      font-size: 16px;
      font-weight: bolder;
      padding-left: 26px;
      height: 40px;
      line-height: 40px;
      background-color: #fff;
      border-bottom: 1px solid #F6F6F6;
      position:relative;
      color:#262626;
      i{
        display: block;
        position: absolute;
        left:15px;
        top:12px;
        width:4px;
        height:16px;
        border-radius:2px;
        background: #3575F6;
      }
    }
    .basicInfo{
      width: 450px;
      border-radius: 2px;
      position: relative;
      background: #fff;
      .dweditbtn{
        font-size: 12px;
        border-radius: 4px;
        cursor: pointer;
        position: absolute;
        right: 20px;
        top: 12px;
        color:#3575f6;
        .icon-edit1 {
          // width: 15px;
          // height: 20px;
          margin-right: 4px;
          line-height: 16px;
          // background: url(../../../../assets/bianji-hover.png) no-repeat;
          // background-size: contain;
        }
      }
      .content{
        padding:15px 15px;
        height:420px;
        .el-form{
          text-align: center;
          height:328px;
          overflow-y: auto!important;
          overflow-x: hidden;
          .el-form-item{
            width: 100%;
            margin-bottom: 25px;
          }
          .el-form-item__content{
            display: flex;
            align-items: center;
            .cttitle{
              margin-bottom: 0px;
              width: 80px;
              margin-right: 10px;
              text-align: left;
              color:#777777;
            }
            .txt{
              display: inline-block;
              width: 300px;
              text-align: left;
            }
            .el-form-item__error{
              width: 100%;
              text-align: center;
            }
          }
        }
        .el-form::-webkit-scrollbar {
          width: 4px!important;
          height: 4px!important;
        }
        .el-form::-webkit-scrollbar-track {
          box-shadow: inset 0 0 6px #fff;
          background-color: #fff;
        }
        .el-form::-webkit-scrollbar-thumb {
          border-radius: 10px;
          box-shadow: inset 0 0 6px #cccccc;
        }
        .dialog-footer {
          margin-top: 25px;
          height: auto;
        }
        .head_contacts{
          width:100%;
          background: #F7F8FA;
          height:40px;
          display: flex;
          margin-bottom:5px;
          justify-content: start;
          span{
            display: block;
            width:33.3%;
            line-height: 40px;
            margin-right:0px;
            color:#777777;
          }
        }
        .body_contacts{
          display: block;
          display: flex;
          border-bottom:1px solid #F6F6F6;
          justify-content: start;
          .contacts_li{
            width: 33.3%;
            height:40px;
            line-height: 40px;
            text-align: center;
          }
          .el-form-item{
            margin-bottom:5px;
            margin-top: 5px;
            width:110px;
            margin-right:18px;
            position: relative;
            .txt{
              width:110px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              text-align: center;
              height:40px;
              line-height: 40px;
            }
          }
          .el-form-item:last-child{
            width:148px;
            .txt{
              width:148px;
            }
          }
          .el-input__inner{
            padding: 8px;
          }
          .toolContent {
            position: absolute;
            right: -14px;
            top:10px;
            cursor: pointer;
            i {
              font-size: 18px;
              color: #D92E20;
            }
          }
        }
        .addItem{
          text-align: right;
          height:20px;
          display: flex;
          justify-content: flex-end;
          margin-top:5px;
          padding-right:10px;
          box-sizing: border-box;
          span{
            display: flex;
            cursor: pointer;
            span{
              color:#3575F6;
              line-height: 20px;
              font-size: 16px;
              display: block;
              height:20px;
            }
            span:last-child{
              font-size: 12px;
              margin-left:4px;
              line-height: 18px;
              text-decoration: underline;
            }
          }
        }
      }
      
    }
    .recordList{
      width: 610px;
      border-radius: 2px;
      margin-left: 15px;
      position: relative;
      .annexes{
        color:#005CB3;
        .icon-download{
          cursor: pointer;
        }
      }
      .addbtn{
        position: absolute;
        right: 0px;
        top: 40px;
        z-index: 2;
        height:26px;
        background: #EEF4FF;
        border:1px solid #9FBFFF;
        border-radius: 26px;
        line-height: 26px;
        font-size: 12px;
        color:#3575F6;
        padding-left:16px;
        width:82px;
        margin-top:20px;
        margin-right:20px;
        i{
          display: block;
          position: absolute;
          left:9px;
          top:0;
          font-size: 12px;
          line-height: 26px;
        }
      }
      .timelineDiv{
        display: flex;
        padding: 35px 0 20px;
        padding-left:180px;
        width: 100%;
        position: relative;
        left: 0;
        right: 0;
        height:740px;
        overflow-y: auto!important;
        background: #fff;
        .timeline {
          .downLoad {
            height: 26px;
            line-height: 26px;
            border: 1px solid #d3dbeb;
            border-radius: 12px;
            padding: 0px 10px;
            width: 150px;
            display: flex;
            justify-content: space-between;
            > i {
              font-size: 14px;
              font-style: normal;
              color: #005cb3;
            }
          }
          p {
            font-size: 14px;
            color:#777777;
            span{
              color: #262626;
            }
          }
          .annexes{
            p{
              color:#005CB3;
              span{
                color:#005CB3;
              }
            }
          }
          .imgBox {
            width: 40px;
            height: 40px;
            position: absolute;
            left: 30px;
            top: 12px;
            > .userImg {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              cursor: pointer;
            }
            .noImg {
              width: 40px;
              height: 40px;
              line-height: 40px;
              border-radius: 50%;
              background-color: #3575f6;
              color: #ffffff;
              font-size: 12px;
              cursor: pointer;
              padding: 0 5px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              text-align: center;
            }
            .noNameNoImg {
              width: 40px;
              height: 40px;
            }
          }
          .timeLineBox {
            position: absolute;
            left: -160px;
            top: 0;
            width: 150px;
            text-align: center;
            display: flex;
            flex-direction: column;
            font-size: 12px;
            >.recodeIcon{
              background-color: #3575f6;
              color: #fff;
              border-radius: 4px;
              display: inline-block;
              width: 60px;
              height: 20px;
              line-height: 20px;
            }
            .timeLineTip {
              top: 0px;
            }
            > div {
              position: absolute;
              right: 0;
            }
            >.first {
              color: #3575f6 !important;
              top:30px;
            }
          }
          p {
            margin-bottom: 5px;
          }
        }
      }
      >.timelineDiv::-webkit-scrollbar {
        width: 4px!important;
        height: 4px!important;
      }
      >.timelineDiv::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px #fff;
        background-color: #fff;
      }
      >.timelineDiv::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 6px #cccccc;
      }
    }
  }

  .collapse {
    background: #fff;
    width: 100%;
    margin-top: 15px;
    position: relative;
    margin-bottom: 15px;
    >span{
      display: block;
      width:80px;
      height:24px;
      border:1px solid rgba(15,117,255,1);
      border-radius:4px;
      position:absolute;
      right:15px;
      top:8px;
      color:rgba(15,117,255,1);
      line-height: 24px;
      padding-left:6px;
      >div{
        display: block!important;
        position: absolute;
        right:0;
        top:0;
        width: auto;
        height: auto;
        margin: 0;
        border: none;
      }
      .oss_file{
        height:24px;
        line-height: 24px;
        width:80px;
        cursor: pointer;
        input{
          font-size:0;
          cursor: pointer;
        }
        span{
          width:60px;
          display: block;
          position: absolute;
          right:0;
          top:0;
          line-height: 24px;
        }
      }
    }
    .collapseTitle {
      padding: 0 15px;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .collapseContent {
      width:100%;
      padding:15px;
      height:266px;
      overflow: auto;
      > div {
        width:100%;
        padding: 0 15px;
        height: 40px;
        display: flex;
        align-items: center;
        > span {
          width:120px;
          display: block;
          text-align: center;
          i {
            cursor: pointer;
          }
          &:first-child {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        >span:nth-child(2) {
          width:150px;
        }
      }
      .annexesHead{
        background: #F7F8FA;
        padding:0;
        color:#777777;
        display: flex;
        justify-content: space-around;
      }
    }
    .collapseContent::-webkit-scrollbar {
      width: 4px!important;
      height: 4px!important;
    }
    .collapseContent::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px #fff;
      background-color: #fff;
    }
    .collapseContent::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 6px #cccccc;
    }
  }
  .new_vue_drawer{
    .drawer-head{
      background: #fff;
      margin:0;
      padding:20px 30px 20px 30px;
    }
    .drawer{
      background: #F7F7F7;
    }
    .tenant-details{
      padding-top:15px;
      padding-left:20px;
      padding-right:20px;
      display: flex;
      justify-content: space-between;
    }
  }
  .adminTextear{
    textarea{
      height:100%;
    }
  }
}
</style>
