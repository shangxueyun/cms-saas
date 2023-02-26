<template>
  <div class="addRepair_new">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="repairDetails_content_new"
           slot="drawer">
        <div class="content_inner">
          <div class="partLeft part">
            <div class="partTop">
              <p class="title">
                <i></i>
                <span>报修单信息</span>
              </p>
              <div class="content">
                <div class="item">
                  <span>报修编号<i>*</i></span>
                  <span>{{repairDetails.repairFormCode}}</span>
                </div>
                <div class="item">
                  <span>报修类型<i>*</i></span>
                  <span>{{repairDetails.repairType==='ROOMS'?'房源':repairDetails.repairType==='EQUIREMENT'?'设备':'其他'}}</span>
                </div>
                <div class="item"
                     v-if="isShow('EQUIREMENT')">
                  <span>设备编号<i>*</i></span>
                  <span>{{repairDetails.equirementNo}}</span>
                </div>
                <div class="item"
                     v-if="isShow('ROOMS')">
                  <span>房源号<i>*</i></span>
                  <span>{{repairDetails.roomsName}}</span>
                </div>
                <div class="item"
                     v-if="isShow('EQUIREMENT')">
                  <span>设备名称<i>*</i></span>
                  <span>{{repairDetails.name}}</span>
                </div>
                <div class="item"
                     v-if="isShow('ROOMS')">
                  <span>房源名称<i>*</i></span>
                  <span>{{repairDetails.name}}</span>
                </div>
                <div class="item">
                  <!-- v-if="isShow('BUILDING')||isShow('ROOMS')"> -->
                  <span>项目简称<i>*</i></span>
                  <span>{{repairDetails.projectName}}</span>
                </div>
                <div class="item">
                  <!-- v-if="isShow('BUILDING')||isShow('ROOMS')"> -->
                  <span>楼宇名称<i>*</i></span>
                  <span>{{repairDetails.buildingName}}</span>
                </div>
                <div class="item"
                     v-if="isShow('EQUIREMENT')">
                  <span>安装位置<i>*</i></span>
                  <span>{{repairDetails.installPosition}}</span>
                </div>
                <div class="item">
                  <span>问题简述<i>*</i></span>
                  <span>{{repairDetails.title}}</span>
                </div>
                <div class="item">
                  <span>报修原因<i>*</i></span>
                  <span class="cause">{{repairDetails.content}}</span>
                </div>
                <div class="annexesDiv">
                  <span>附件</span>
                  <div class="annexes">
                    <div class="list"
                         v-for="(item,index) in repairDetails.annexes"
                         :key="index">
                      <span>{{item.annexName}}</span>
                      <ailPreview :ailObj="item"
                                  :encrypt="true"
                                  :picturePreview="true"
                                  @setFile="setFile" />
                      <aliDownLoad :item="item" />

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="partBottom part">
              <div class="head">
                <p class="title">
                  <i></i>
                  <span>备注</span>
                </p>
                <div v-if="readOnly &&hasAddBtn==='edit'"
                     @click="readOnly=false">
                  <i class="iconfont icon-cms_bianji-">编辑</i>
                </div>
              </div>
              <div class="content">
                <el-input type="textarea"
                          v-if="!readOnly"
                          :rows="5"
                          maxlength="200"
                          resize="none"
                          v-model="repairDetails.remark">
                </el-input>
                <div v-else
                     class="textarea">{{repairDetails.remark}}</div>
                <div class="foot"
                     v-if="!readOnly">
                  <span class="save"
                        @click="saveFn">保存</span>
                  <span class="cannel"
                        @click="cannelFn">取消</span>
                </div>
              </div>
            </div>
          </div>
          <div class="partRight part">
            <div class="head">
              <p class="title">
                <i></i>
                <span>维修记录</span>
              </p>
              <span v-if="hasAddBtn==='add' && hasAuthority('03060104')"
                    class="addWeixiu"
                    @click="addweibaoOpen">
                <i class="iconfont icon-crm_xinzeng-"></i>
                <a style="text-decoration: underline;">新增维修</a>

              </span>
            </div>
            <div class="content">
              <el-timeline class="timelineBox"
                           v-if="repairRecordsList.length">
                <el-timeline-item placement="top"
                                  style="position:relative;"
                                  v-for="(item, index) in repairRecordsList"
                                  :key="index"
                                  :color="nodeColor(index)">
                  <div class="statusBox">
                    <div class="tjsh">{{formatRepairStatus(item.repairStatus)}}</div>
                    <div :class="{'first':index===0}">{{formatApprovalDate(item.repairDate)}}</div>
                  </div>
                  <div class="template">
                    <p><span>记录人：</span><span>{{item.recordUser}}</span></p>
                    <p><span>维修记录： </span><span v-html="item.recordString"></span></p>
                    <div class="annexesList"
                         v-for="(item2, idx2) in item.annexes"
                         :key="idx2">
                      <span class="annexName"
                            :title="item2.annexName">{{item2.annexName}}</span>
                      <div>
                        <ailPreview :ailObj="item2"
                                    :picturePreview="true"
                                    :encrypt="true"
                                    @setFile="setFile" />
                        <aliDownLoad :item="item2" />
                      </div>

                    </div>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </div>
      </div>
    </drawer>
  </div>
</template>
<script>
import context from '@/service'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import Drawer from '@/components/drawer.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import ailPreview from '@/components/ailPreview.vue'
import * as JSOG from 'jsog'
export default {
  components: {
    Drawer,
    aliUpload,
    aliDownLoad,
    ailPreview,
    picturePrevie
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    recordType: {
      type: Boolean,
      default: false
    },
    hasAddBtn: {
      type: String,
      default: 'none'
    },
    repairDetails: {
      type: Object,
      default: {}
    },
    drawerTitle: {
      type: String,
      default: '维修单详情'
    }
  },
  watch: {
    detailsdrawershow: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.menuTabChange()
        }
      },
      immediate: true
    }
  },
  created () {

  },
  mounted () {
  },
  data () {
    return {
      readOnly: true,
      repairRecordsList: [] // 维保记录列表
    }
  },
  computed: {

  },
  methods: {
    menuTabChange () {
      let id = this.repairDetails.id
      context.http.get(`/cms/api/repair-forms/${id}/repair-records`).then(res => {
        this.repairRecordsList = res.data
      }).catch(error => {
        console.info(error)
      })
    },
    nodeColor (index) {
      return index === 0 ? '#3575F6' : '#D3DBEB'
    },
    saveFn () {
      context.http.put(`/cms/api/repair-forms/remark`, { id: this.repairDetails.id, remark: this.repairDetails.remark }).then(res => {
        if (res) {
          this.$message.success('保存成功')
          this.readOnly = true
        }
      })
    },
    cannelFn () {
      this.readOnly = true
      context.http.get(`/cms/api/repair-forms/${this.repairDetails.id}`).then(res => {
        this.$emit('refreshDetailsData', res.data)
      })
    },
    setFile () {

    },
    formatApprovalDate (time) {
      if (time.indexOf('T') !== -1) {
        time = time.substr(0, time.lastIndexOf('T'))
        return time
      } else {
        return time
      }
    },
    addweibaoOpen () {
      this.$emit('addweibaoOpen', this.repairDetails)
    },
    formatRepairStatus (n) {
      switch (n) {
        case 'COMPLETE':
          // return '维保完成'
          return '已处理'
        case 'NO':
          // return '未完成'
          return '处理中'
      }
    },
    isShow (n) { // 是否展示
      if (n === this.repairDetails.repairType) {
        return true
      } else {
        return false
      }
    },
    onHide () {
      this.$emit('drawerClose', false)
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    }
  }
}
</script>
<style lang="scss" scoped>
.addRepair_new {
  .repairDetails_content_new {
    width: 900px;
    margin: 15px;
    height: calc(100% - 81px);
    .content_inner {
      display: flex;
      justify-content: space-between;
      height: 100%;
      .part {
        .title {
          height: 45px;
          padding-left: 15px;
          font-size: 16px;
          font-weight: bold;
          color: #262626;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #f6f6f6;
          > i {
            display: inline-block;
            width: 4px;
            height: 16px;
            background: rgba(53, 117, 246, 1);
            border-radius: 2px;
            margin-right: 5px;
          }
        }
        .content {
          height: calc(100% - 45px);
          overflow-y: auto;
          padding: 15px;
          > .item {
            display: flex;
            margin-bottom: 20px;
            > span {
              font-size: 14px;
              &:first-child {
                color: #787878;
                > i {
                  font-style: normal;
                  color: red;
                }
              }
              &:last-child {
                padding-left: 15px;
                flex: 1;
                color: #262626;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                &.cause {
                  white-space: normal;
                }
              }
            }
          }
          > .annexesDiv {
            > span {
              color: #787878;
            }
            > .annexes {
              .list {
                color: #272727;
                padding: 5px 0;
                border-bottom: 1px solid #f3f3f3;
                display: flex;
                > span {
                  width: 90%;
                }
              }
            }
          }
          &::-webkit-scrollbar {
            width: 4px !important;
            height: 4px !important;
          }
          &::-webkit-scrollbar-track {
            box-shadow: inset 0 0 6px #fff;
            background-color: #fff;
          }
          &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            box-shadow: inset 0 0 6px #cccccc;
          }
        }
        &.partLeft {
          width: 330px;
          .partTop {
            height: calc(100% - 295px);
            margin-bottom: 15px;
            background: #fff;
          }
          .partBottom {
            height: 280px;
            background: #fff;
            .head {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-right: 15px;
              border-bottom: 1px solid #f6f6f6;
              > div {
                cursor: pointer;
                > .iconfont {
                  font-size: 12px;
                  color: #3676f6;
                }
              }
              > .title {
                border: none;
              }
            }
            .textarea {
              height: 160px;
              overflow-y: auto;
              &::-webkit-scrollbar {
                width: 4px !important;
                height: 4px !important;
              }
              &::-webkit-scrollbar-track {
                box-shadow: inset 0 0 6px #fff;
                background-color: #fff;
              }
              &::-webkit-scrollbar-thumb {
                border-radius: 10px;
                box-shadow: inset 0 0 6px #cccccc;
              }
            }
            .foot {
              display: flex;
              flex-direction: row-reverse;
              > span {
                cursor: pointer;
                width: 70px;
                height: 32px;
                line-height: 32px;
                text-align: center;
                margin-top: 15px;
                color: #777;
                border-radius: 4px;
                &.save {
                  background-color: #2a6ef0;
                  color: #fff;
                }
              }
            }
          }
        }
        &.partRight {
          background: #fff;
          width: 550px;
          .head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-right: 15px;
            border-bottom: 1px solid #f6f6f6;
            > div {
              cursor: pointer;
              > .iconfont {
                font-size: 12px;
                color: #3676f6;
              }
            }
            > .title {
              border: none;
            }
            > .addWeixiu {
              color: #00b362;
              cursor: pointer;
            }
          }
          .content {
            .timelineBox {
              padding-left: 120px;
              padding-top: 30px;
              overflow: hidden;
              // &::-webkit-scrollbar {
              //   width: 4px !important;
              //   height: 4px !important;
              // }
              // &::-webkit-scrollbar-track {
              //   box-shadow: inset 0 0 6px #fff;
              //   background-color: #fff;
              // }
              // &::-webkit-scrollbar-thumb {
              //   border-radius: 10px;
              //   box-shadow: inset 0 0 6px #cccccc;
              // }
              .statusBox {
                position: absolute;
                left: -160px;
                top: 0;
                width: 150px;
                text-align: center;
                display: -ms-flexbox;
                display: flex;
                -ms-flex-direction: column;
                flex-direction: column;
                font-size: 12px;
                > div {
                  position: absolute;
                  right: 0;
                  &:first-child {
                    display: inline-block;
                    width: 60px;
                    height: 20px;
                    line-height: 20px;
                    &.shangxian {
                      background: #3575f6;
                      border-radius: 4px;
                      color: #ffffff;
                    }
                    &.xiaxian {
                      background: #f99a12;
                      border-radius: 4px;
                      color: #ffffff;
                    }
                    &.shenhe {
                      background: #f99a12;
                      border-radius: 4px;
                      color: #ffffff;
                    }
                    &.tjsh {
                      background: #83bf68;
                      border-radius: 4px;
                      color: #ffffff;
                    }
                  }
                  &:last-child {
                    &.first {
                      top: 30px;
                      color: #3575f6;
                    }
                    top: 30px;
                    color: #999999;
                  }
                }
              }
              .template {
                position: relative;
                top: -13px;
                left: 0px;
                > p {
                  display: flex;
                  margin-bottom: 5px;
                  span {
                    display: block;
                  }
                  > span:first-child {
                    font-size: 14px;
                    color: #333333;
                    width: 75px;
                    font-weight: bolder;
                  }
                  > span:last-child {
                    font-size: 14px;
                    flex: 1;
                    color: #777777;
                  }
                }
                .annexesList {
                  display: flex;
                  justify-content: space-between;
                  font-size: 12px;
                  color: #1373ff;
                  height: 26px;
                  line-height: 26px;
                  padding: 0 10px;
                  margin-bottom: 10px;
                  border: 1px solid rgba(210, 220, 237, 1);
                  border-radius: 14px;
                  .annexName {
                    margin-right: 10px;
                    cursor: pointer;
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                  > div {
                    display: flex;
                    cursor: pointer;
                    font-size: 14px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.addRepair_new {
  .wrap {
    height: 100%;
    background-color: #f7f7f7;
    .drawer-head {
      background-color: #fff;
      margin: 0;
      padding: 15px 0 15px 15px;
    }
  }
}
</style>
