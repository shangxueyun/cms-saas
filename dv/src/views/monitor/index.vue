<template>
  <div class="clearfix monitor">
    <div class="title">
      <span style="left: 11.24rem;">视频监控</span>
    </div>
    <div class="build-dialog clearfix">
      <div style="margin: 10px 0;">选择监控</div>
      <div id="scroll" style="height: 13rem;width: 6rem;overflow-y: scroll;">
        <el-tree
          :data="channelList"
          show-checkbox
          node-key="monitorId"
          :props="defaultProps"
          :check-strictly="true"
          :default-expanded-keys="[1]"
          :default-checked-keys="checkedKeys"
          accordion
          @check-change="handleCheckChange">
        </el-tree>
      </div>
      <!-- <div class="bd-title">选择楼宇</div>
      <div class="bd-list">
        <span :class="{bdactived: index === selIndex}" v-for="(item, index) in channelList" :key="index" @click="selectbd(item, index)">
          <div class="bdimg"></div>
          <p style="text-align: center">{{item.name}}</p>
        </span>
      </div>
      <div class="bd-title">选择监控</div>
      <div class="monitor-list">
        <span :class="{mtActived: item.ismtActived}" v-for="(item, index) in monitorlist[0].channelList" :key="index" @click="selectMt(item, index)">
          {{item.name}}
        </span>
      </div> -->
      <div class="btnwrap">
        <!-- <span @click="showDialog = false">取消</span> -->
        <span @click="determinePlay">播放</span>
      </div>
    </div>
    <div class="monitor-wrap">
      <div id="mviewl">
          <div id="obj">
            <object id="DPSDK_OCX" classid="CLSID:D3E383B6-765D-448D-9476-DFD8B499926D" style="width: 100%; height: 80%;" codebase="DpsdkOcx.cab#version=1.0.0.0"></object>
          </div>
      </div>
    </div>
    <div style="display: none" id="RetInfo">
    </div>
    <div style="display: none" id="GlobalInfo">
    </div>
  </div>
</template>
<script>
import service from '@/service'
import axios from 'axios'
import * as JSOG from 'jsog'
export default {
  name: 'monitor',
  data () {
    return {
      mallId: '',
      channelList: [],
      monitorlist: [{channelList: []}],
      MonitorTotal: '',
      mgAry: [],
      checkedKeys: [],
      tenantKey: '',
      token: '',
      defaultProps: {
        children: 'monitorChannels',
        label: 'name'
      },
      count: 1
    }
  },
  created () {
    this.mallId = this.$route.query.mallId
    let tenantKey = this.$route.query.tenantKey
    this.tenantKey = tenantKey.replace('/', '')
    window.sessionStorage.setItem('token', this.$route.query.token)
    window.localStorage.setItem('tenantKey', this.tenantKey)
  },
  mounted () {
    this.$nextTick(function () {
      setTimeout(this.ocxinit1(), 500)
    })
  },
  methods: {
    login () {
      sessionStorage.removeItem('token')
      service.user.login('admin', 'admin')
    },
    handleCheckChange (data, checked, indeterminate) {
      if (checked) {
        this.mgAry.push(data.monitorId)
      } else {
        let index = this.mgAry.indexOf(data.monitorId)
        this.mgAry.splice(index, 1)
      }
    },
    ocxinit1 () {
      setTimeout(this.ocxinit(), 500)
    },
    mallDeploy () {
      axios({ method: 'GET', url: `/rms/api/mallDeploy/tree?mallId=${this.mallId}`, timeout: 20000 }).then(res => {
        if (res.status === 200) {
          this.channelList = JSOG.decode(res.data)
          this.channelList.forEach(ele => {
            ele.disabled = true
          })
          // 默认展示9个视频监控
          let monitorChannels = this.channelList[2].monitorChannels.slice(0, 9)
          let defaultmc = []
          monitorChannels.forEach(ele => {
            defaultmc.push(ele.monitorId)
          })
          this.checkedKeys = defaultmc
          this.mgAry = this.checkedKeys
          this.determinePlay()
        }
      }).catch(err => {
        console.log(err, '123213')
      })
    },
    determinePlay () {
      if (!this.mgAry || this.mgAry.length === 0) {
        return
      }
      this.showDialog = false
      this.ButtonStartRealplayByWndNoOnclick()
    },
    ButtonStartRealplayByWndNoOnclick () {
      var obj = document.getElementById('DPSDK_OCX')
      // let gWndId = obj.DPSDK_CreateSmartWnd(0, 0, 100, 100)
      // eslint-disable-next-line no-unused-vars
      var nWndNo = obj.DPSDK_GetSelWnd(this.gWndId)
      // eslint-disable-next-line no-unused-vars
      var tdid = '1000085$1$0$0,1000085$1$0$1,1000085$1$0$2,1000085$1$0$3'
      let maoqiaomt = this.mgAry
      for (var i = 0; i < maoqiaomt.length; i++) {
        this.ShowCallRetInfo(obj.DPSDK_StartRealplayByWndNo(this.gWndId, i, maoqiaomt[i],
                              '2', '1', '1'), '播放视频 ')
      }
      // this.ShowCallRetInfo(obj.DPSDK_StartRealplayByWndNo(this.gWndId, 1, '1000109$1$0$3',
      //                         '2', '1', '1'), '播放视频 ')
    },
    ButtonLoginOnclick () {
      var obj = document.getElementById('DPSDK_OCX')
      this.ShowCallRetInfo(obj.DPSDK_Login('117.184.24.130', '9000', 'yunwu', 'admin234'), '登录 ')
    },
    ButtonCreateWndOnclick (gWndId) {
      var obj = document.getElementById('DPSDK_OCX')
      obj.DPSDK_SetWndCount(gWndId, 9)// 窗口数量
      obj.DPSDK_SetSelWnd(gWndId, 0)
    },
    ShowCallRetInfo (nRet, strInfo) {
      var str = ' '
      if (nRet === 0) {
        str = strInfo + ' 成功！ '
      } else {
        str = strInfo + '失败！错误码： ' + nRet
      }
      document.getElementById('RetInfo').innerText = str
    },
    ocxinit () {
      var obj = document.getElementById('DPSDK_OCX')
      let gWndId = obj.DPSDK_CreateSmartWnd(0, 0, 100, 100)
      this.gWndId = gWndId
      this.ButtonCreateWndOnclick(gWndId)
      obj.DPSDK_SetToolBtnVisible(7, false)
      obj.DPSDK_SetToolBtnVisible(9, false)
      obj.DPSDK_SetControlButtonShowMode(1, 0)
      obj.DPSDK_SetControlButtonShowMode(2, 0)
      this.ButtonLoginOnclick()
      this.mallDeploy()
    },
    selectbd (item, index) {
      this.selIndex = index
      let monitorlist = this.channelList.filter((ele) => {
        return ele.id === item.id
      })
      this.monitorlist = monitorlist
    },
    selectMt (item, index) {
      if (this.mgAry.length > 4) {
        return
      }
      item.ismtActived = !item.ismtActived
      if (item.ismtActived) {
        this.mgAry.push(item.id)
      } else {
        let index = this.mgAry.indexOf(item.id)
        this.mgAry.splice(index, 1)
      }
    }
  }
}
</script>
<style lang="scss">
@import "../../style/mqO2O.scss";
  .monitor{
    .title{
      background: url(../../assets/titlebg.png) no-repeat;
      background-position: px2rem(20);
      background-size: contain;
      > span {
        position: absolute;
        font-size: px2rem(100);
        font-family:MicrosoftYaHei-Bold;
        font-weight:bold;
        color:rgba(255,255,255,0);
        line-height: px2rem(56);
        -webkit-text-stroke:1px rgba(255,255,255,1);
        color: #e7f0ff;
        left: px2rem(900);
        top: px2rem(66);
      }
    }
    .build-dialog{
      width: 6rem;
      min-height: 7rem;
      margin: 0.3rem 0 1rem 1rem;
      color: #fff;
      float: left;
      .bd-title{
        padding: 0.4rem 0 0.2rem 0.4rem;
      }
    }
    .bd-list{
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin:0 0 0 0.4rem;
      min-height: 100px;
      span{
        margin-right: 0.4rem;
      }
      .bdimg{
        width: 0.8rem;
        height: 0.8rem;
        background: url(../../assets/building.png) no-repeat;
        background-size: contain;
        cursor: pointer;
      }
      .bdactived{
        color: #6a6ec1;
        .bdimg{
          background: url(../../assets/buildingactive.png) no-repeat;
          background-size: contain;
        }
      }
    }
    .monitor-list{
      width: 90%;
      margin-left: 0.4rem;
      min-height: 100px;
      span{
        display: inline-block;
        min-width: 2rem;
        height: 0.5rem;
        line-height: 0.5rem;
        text-align: center;
        border: 1px solid #fff;
        border-radius: 2px;
        margin: 0.2rem 0.1rem 0 0;
        padding: 0 6px;
        cursor: pointer;
      }
      .mtActived {
        background: url(../../assets/hook.png) right bottom no-repeat;
        background-size: contain;
        border: 1px solid #00d8dc;
        color: #00d8dc;
      }
    }
    .btnwrap{
      float: right;
      margin: 0.6rem 0.2rem 0.2rem 0;
      span{
        display: inline-block;
        width: 1.8rem;
        height: 0.5rem;
        line-height: 0.5rem;
        text-align: center;
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
        &:first-child{
          border: 1px solid #6c81aa;
          margin-right: 0.2rem;
        }
        &:last-child {
          background-color: #00c9a8;
          border: 1px solid #00c9a8;
        }
      }
    }
    .monitor-wrap{
      float: left;
      margin: 0 auto;
      margin-top: 1rem;
      margin-left: 2rem;
      width: 15.5rem;
      #mviewl{
        width: px2rem(2550);
        height: px2rem(1600);
      }
      #obj{
        width: px2rem(2550);
        height: px2rem(1600);
        display:block;
        margin:auto;
      }
    }
    .el-tree {
      background: #354068;
      color: #fff;
      opacity: 0.9;
    }
    .el-tree:focus>.el-tree-node__content {
      background-color: #20263f;
      opacity: 0.9;
    }
    .el-tree-node:focus>.el-tree-node__content {
      background-color: #20263f;
      opacity: 0.9;
    }
    .el-tree .el-tree-node__content:hover{
      background-color: #20263f;
      opacity: 0.9;
    }
    .el-tree-node__children .el-tree-node__content{
      &:hover {
        background-color: #20263f;
        opacity: 0.9;
      }
    }
    .is-current{
      .el-tree-node__content {
        &:hover{
          background-color: #20263f;
          opacity: 0.9;
        }
      }
    }
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    ::-webkit-scrollbar
    {
        width: 4px;
        height: 4px;
        background-color: rgb(25, 38, 70);
    }

    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track
    {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 10px;
        background-color: rgb(25, 38, 70);
    }

    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb
    {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: #8187e5;
    }
    #scroll{
        scrollbar-arrow-color: #20263f; /**//*三角箭头的颜色*/
        scrollbar-face-color: #20263f; /**//*立体滚动条的颜色*/
        scrollbar-3dlight-color: #20263f; /**//*立体滚动条亮边的颜色*/
        scrollbar-highlight-color: #20263f; /**//*滚动条空白部分的颜色*/
        scrollbar-shadow-color: #20263f; /**//*立体滚动条阴影的颜色*/
        scrollbar-darkshadow-color: #20263f; /**//*立体滚动条强阴影的颜色*/
        scrollbar-track-color: #20263f; /**//*立体滚动条背景颜色*/
        scrollbar-base-color:#20263f; /**//*滚动条的基本颜色*/
    }
  }
</style>
