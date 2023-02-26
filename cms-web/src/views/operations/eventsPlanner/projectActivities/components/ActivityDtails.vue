<template>
  <div class="tenant-information">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @scroll="woListScroll"
            @on-edit="onEdit"
            @on-hide="onHide">
      <div class="tenant-details details-content clearfix" slot="drawer" style="padding-bottom: 0">
        <div class="activityContent">
          <div class="leftPart" :style="{top:topNum,height:leftPartHeight}">
            <div class="top">
              <div class="imgDIv" @mouseenter="showArrow=true" @mouseleave="showArrow=false">
                <img v-if="detailsData.images.length<=0 || detailsData.activityStatus==='CLOSED'" :src="berthImg" alt="" style="width: 100%;height: 100%;">
                <el-carousel v-if="detailsData.images.length>0 && detailsData.activityStatus!=='CLOSED'" height="190px" width="270px" :autoplay="false">
                  <el-carousel-item v-for="item in detailsData.images" :key="item">
                    <img :src="item" alt="" style="max-width:270px;max-height:190px;">
                  </el-carousel-item>
                </el-carousel>
                <div class="shadeBox" v-if="detailsData.activityStatus==='CLOSED'">已关闭</div>
              </div>
              <div class="actName">{{detailsData.name}}</div>
              <div class="actTime">{{detailsData.startDate}} - {{detailsData.endDate}}</div>
              <div class="projectName">{{detailsData.projectRefferd}}</div>
              <span class="typeTips">{{formatStatus(detailsData.activityStatus)}}</span>
            </div>
            <div class="bottom">
              <div>{{detailsData.organizer}}</div>
              <div v-if="detailsData.principal"><span style="color:#0E75FF" >{{detailsData.principal}}</span>提供运营支持服务</div>
            </div>
          </div>
          <div class="rightPart">
            <div class="main_content">
              <div class="menuTab">
                <span :class="{'active':menuTab===1}" @click="menuTabChange(1)">筹备执行</span>
                <span :class="{'active':menuTab===2}" @click="menuTabChange(2)">评估阶段</span>
              </div>
              <div class="activityInfo" v-show="menuTab===1">
                <p class="title">
                  <span>活动信息</span>
                  <span class="editBtn" @click="onEdit" v-if="hasAuthority('02030407')">
                    <i data-v-9c1f67fc="" aria-hidden="true" class="icon icon-edit2"></i>
                    编辑
                  </span>
                </p> 
                  <el-form :model="detailsData" :rules="addFlowRules" ref="detailsData">
                    <div class="activityInfo_content">
                      <div class="item">
                        <span>活动名称<i class="required">*</i></span>
                        <el-form-item prop="name" v-if="!readOnly">
                          <el-input style="width:300px" v-model="detailsData.name" maxlength="20"></el-input>
                        </el-form-item>
                        <p v-else class="readOnlyTxt">{{detailsData.name}}</p>
                      </div>
                      <div class="item">
                        <span>活动时间<i class="required">*</i></span>
                        <el-form-item prop="startDate">
                          <el-date-picker
                            v-if="!readOnly"
                            style="width:300px"
                            v-model="startEndTime"
                            type="daterange"
                            range-separator="-"
                            value-format="yyyy-MM-dd"
                            :editable="false"
                            @change="startEndTimeChange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                          </el-date-picker>
                          <p v-else class="readOnlyTxt">{{formatTime(detailsData.startDate,detailsData.endDate)}}</p>
                        </el-form-item>
                      </div>
                      <div class="item">
                        <span>所属项目<i class="required">*</i></span>
                        <el-form-item v-if="!readOnly" prop="projectId">
                          <el-select v-model="detailsData.projectId" placeholder="选择项目" style="width:300px" clearable >
                            <el-option
                              v-for="item in options1"
                              :key="item.id"
                              :label="item.projectName"
                              :value="item.id">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <p v-else class="readOnlyTxt">{{detailsData.projectRefferd}}</p>
                      </div>
                      <div class="item">
                        <span>活动地点<i class="required">*</i></span>
                        <el-form-item prop="place" v-if="!readOnly">
                          <el-input style="width:300px" v-model="detailsData.place" maxlength="20"></el-input>
                        </el-form-item>
                        <p v-else class="readOnlyTxt">{{detailsData.place}}</p>
                      </div>
                      <div class="item">
                        <span>举办方</span>
                        <el-form-item prop="organizer" v-if="!readOnly">
                          <el-input style="width:300px" v-model="detailsData.organizer" maxlength="20"></el-input>
                        </el-form-item>
                        <p v-else class="readOnlyTxt">{{detailsData.organizer}}</p>
                      </div>
                      <div class="item">
                        <span>负责人</span>
                        <el-form-item prop="principal" v-if="!readOnly">
                          <el-input style="width:300px" v-model="detailsData.principal" maxlength="20"></el-input>
                        </el-form-item>
                        <p v-else class="readOnlyTxt">{{detailsData.principal}}</p>
                      </div>
                      <div class="item">
                        <span>预计费用/元<i class="required">*</i></span>
                        <el-form-item prop="amount" v-if="!readOnly">
                          <el-input style="width:300px" v-model="detailsData.amount" maxlength="15"></el-input>
                        </el-form-item>
                        <p v-else class="readOnlyTxt">{{detailsData.amount}}</p>
                      </div>
                      <div class="item">
                        <span>活动描述</span>
                        <el-form-item prop="description" v-if="!readOnly">
                          <el-input style="width:300px" type="textarea" :rows="2" v-model="detailsData.description" maxlength="500"></el-input>
                        </el-form-item>
                        <p v-else class="readOnlyTxt">{{detailsData.description}}</p>
                      </div>
                      <div class="item">
                        <span>原因/初衷</span>
                        <el-form-item prop="reason" v-if="!readOnly">
                          <el-input style="width:300px" type="textarea" :rows="2" v-model="detailsData.reason" maxlength="500"></el-input>
                        </el-form-item>
                        <p v-else class="readOnlyTxt">{{detailsData.reason}}</p>
                      </div>
                      <div class="item">
                        <span>目标设定<i class="required">*</i></span>
                        <el-form-item prop="target" v-if="!readOnly">
                          <el-input style="width:300px" type="textarea" :rows="2" v-model="detailsData.target" maxlength="500"></el-input>
                        </el-form-item>
                        <p v-else class="readOnlyTxt">{{detailsData.target}}</p>
                      </div>
                      <div class="item">
                        <span>活动状态</span>
                        <el-form-item prop="type" v-if="!readOnly">
                          <el-select style="width:300px" v-model="detailsData.activityStatus">
                            <el-option label="筹备执行" value="EXECUTING"></el-option>
                            <el-option label="评估" value="ASSESS"></el-option>
                            <el-option label="存档" value="ARCHIVE"></el-option>
                            <el-option label="已关闭" value="CLOSED"></el-option>
                          </el-select>
                        </el-form-item>
                        <p v-else class="readOnlyTxt">{{formatStatus(detailsData.activityStatus)}}</p>
                      </div>
                    </div>
                    <div class="upLoadDiv">
                      <p>活动图片<span v-if="!readOnly">（{{detailsData.images.length}}/5）</span></p>
                      <div>
                        <div class="imgList" v-for="(item,index) in detailsData.images" :key="index" v-if="!readOnly">
                          <div class="item">
                            <img :src="item" alt="" @click="showImg(item,index)">
                            <i class="el-icon-error" @click="deleteFn(item,index)"></i>
                          </div>
                        </div>
                        <div class="imgList" v-for="(item,index) in detailsData.images" :key="index" v-if="readOnly">
                          <div class="item">
                            <img :src="item" alt="" @click="showImg(item,index)">
                          </div>
                        </div>
                        <div class="upLoadComponents" v-if="detailsData.images.length<5 && !readOnly">
                          <aliUpload class="aliUpload"
                            :upLoadText="upLoadText"
                            :fileType="fileType"
                            :iconShow="false"
                            @setAnnex="setAnnex"
                          />
                        </div>
                      </div>
                    </div>
                  </el-form>
                  <div class="btndiv" style="margin-top: 50px; display: flex; flex-direction: row-reverse;padding-right: 30px;" v-if="!readOnly">
                    <el-button type="primary" style="width:100px;margin-left: 25px;" @click="editSave('detailsData')">确认</el-button>
                    <el-button style="width:100px" @click="onHide">取消</el-button>
                  </div>
              </div>
              <div class="partMenu" v-if="menuTab===1">
                <span :class="{'active':partMenu===1}" @click="partMenuChange(1)">任务计划</span>
                <span :class="{'active':partMenu===2}" @click="partMenuChange(2)">费用项</span>
                <span :class="{'active':partMenu===3}" @click="partMenuChange(3)">资料存档</span>
              </div>
              <div class="planPart" v-show="partMenu===1 && menuTab===1">
                <p class="title">
                  <span>任务计划</span>
                  <span class="addPlan" @click="addPlanFun" v-if="hasAuthority('02030407')"><i class="el-icon-plus" style="margin:0 5px;"></i>添加任务</span>
                </p> 
                <div class="table details_table">
                  <el-table :data="detailsData.taskPlans"  style="width: 100%">
                    <el-table-column type="expand" width="40px">
                      <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                          <el-form-item label="备注">
                            <span>{{props.row.remark}}</span>
                          </el-form-item>
                        </el-form>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column label="时间" :formatter="formatPlanTime" align="center"></el-table-column> -->
                    <el-table-column label="时间" align="center" width="190px">
                      <template slot-scope="scope">
                        <p>{{scope.row.startDate}} - {{scope.row.endDate}}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="任务" prop="content" align="center"></el-table-column>
                    <el-table-column label="负责人" prop="principal" align="center"></el-table-column>
                    <el-table-column label="完成情况" :formatter="formatdoFlg" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" v-if="hasAuthority('02030407')">
                      <template slot-scope="scope">
                        <span @click="planEdit(scope.$index, scope.row)" style="color:#3577F6;cursor: pointer;">编辑</span>
                        <span @click="planDel(scope.$index, scope.row)" style="color:#3577F6;cursor: pointer;">删除</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <div class="costPart costPart1" v-show="partMenu===2 && menuTab===1">
                <p class="title">
                  <span>费用项</span>
                  <span class="addCost" @click="addCostFun" v-if="hasAuthority('02030407')"><i class="el-icon-plus" style="margin:0 5px;"></i>添加费用</span>
                </p> 
                <div class="table">
                  <el-table :data="detailsData.costs"  style="width: 100%">
                    <el-table-column type="expand" width="40px">
                      <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                          <el-form-item label="备注">
                            <span>{{props.row.remark}}</span>
                          </el-form-item>
                        </el-form>
                      </template>
                    </el-table-column>
                    <el-table-column  label="名称" prop="name" align="center"></el-table-column>
                    <el-table-column label="预计金额" prop="yjAmount" align="center"></el-table-column>
                    <el-table-column label="实际金额" prop="sjAmount" align="center"></el-table-column>
                    <el-table-column label="附件"  align="center">
                      <template slot-scope="scope">
                        <span style="position:relative;display: block;color:#3577f6;cursor:pointer" title="点击下载附件">{{scope.row.annexDTO.annexName}}<aliDownLoad :item="scope.row.annexDTO"/></span>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" v-if="hasAuthority('02030407')">
                      <template slot-scope="scope">
                        <span @click="costEdit(scope.$index, scope.row)" style="color:#3577F6;cursor: pointer;">编辑</span>
                        <span @click="costDel(scope.$index, scope.row)" style="color:#3577F6;cursor: pointer;">删除</span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="totalDiv">
                    <div>
                      <span>备用金</span>
                      <span>{{detailsData.costsPrice}}</span>
                    </div>
                    <div>
                      <span>合计</span>
                      <span>{{detailsData.costsYjAmount}}</span>
                      <span>{{detailsData.costsSjAmount}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="costPart dataPart" v-show="partMenu===3 && menuTab===1">
                <p class="title">
                  <span>资料存档</span>
                  <span class="addCost" v-if="hasAuthority('02030407')">
                    <i class="el-icon-plus" style="margin: 0 5px;"></i>
                    <aliUpload class="aliUpload"
                      :upLoadText="upLoadText_data"
                      :fileSize="fileSize"
                      :fileType="fileType_data"
                      :iconShow="false"
                      @setAnnex="setAnnex_data"
                    />
                  </span>
                  
                </p> 
                <div class="table">
                  <el-table :data="detailsData.annexes"  style="width: 100%">
                    <el-table-column  label="文件名称" prop="annexName" align="center"></el-table-column>
                    <el-table-column label="上传成功时间"  align="center" :formatter="formatCreatedDate"></el-table-column>
                    <el-table-column label="操作" align="center" v-if="hasAuthority('02030407')">
                      <template slot-scope="scope">
                        <!-- <span @click="dataDownLoad(scope.$index, scope.row)" style="color:#3577F6;cursor: pointer;">编辑</span> -->
                        <aliDownLoad  :item="scope.row"/>
                        <span @click="dataDel(scope.$index, scope.row)" style="color:#3577F6;cursor: pointer;">删除</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <div class="assessPart" v-show="menuTab===2">
                <div style="padding-right:15px;margin-top: 20px;height: 40px;">
                  <span class="editBtn" @click="assessEdit" v-if="hasAuthority('02030407')">
                    <i class="icon icon-edit2"></i>
                    编辑
                  </span>
                </div>
                <div class="detailsInfo">
                  <div class="item">
                    <p class="title">预计花费</p>
                    <div class="content">{{detailsData.amount}}</div>
                  </div>
                  <div class="item">
                    <p class="title">实际花费</p>
                    <div class="content">{{detailsData.sjAmount}}</div>
                  </div>
                  <div class="item" style="height:150px;">
                    <p class="title">目标设定</p>
                    <div class="content" style="height:110px;overflow-y: auto;">{{detailsData.target}}</div>
                  </div>
                  <div class="item" style="height:150px;">
                    <p class="title">实际完成</p>
                    <div class="content" style="height:110px;overflow-y: auto;" v-if="assReadonly">{{detailsData.result}}</div>
                    <el-input style="width:325px" type="textarea" :rows="5" v-else v-model="detailsData.result" maxlength="500"></el-input>
                  </div>
                </div>
                <div class="participant">
                  <div class="title">
                    <span>评估会议参与人</span>
                    <div v-if="!assReadonly">
                      <el-autocomplete
                        v-model="autocompleteText"
                        class="inline-input"
                        :fetch-suggestions="querySearch"
                        @select="handleSelect"
                      ></el-autocomplete>
                      <span class="addmembers" @click="addmembers"><i class="el-icon-plus"></i>新增</span>
                    </div>
                  </div>
                  <div class="content">
                    <div v-for="(item,index) in detailsData.members" :key="index"><span>{{item}}</span><i class="el-icon-close" @click="delMembers(item,index)" v-if="!assReadonly"></i></div>
                  </div>
                </div>
                <div class="summary">
                  <div class="title">活动总结</div>
                  <div class="content" v-if="assReadonly">{{detailsData.summary}}</div>
                  <el-input style="width:100%" type="textarea" :rows="5" v-else v-model="detailsData.summary" maxlength="500"></el-input>
                </div> 
                <div class="btndiv" style="margin-top: 50px; display: flex; flex-direction: row-reverse;padding-right: 30px;" v-if="!assReadonly">
                    <el-button type="primary" style="width:100px;margin-left: 25px;" @click="savePart2">确认</el-button>
                    <el-button style="width:100px" @click="onHide">取消</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </drawer>   
    <picturePrevie v-if="showPicture" :imgList="imgArr" :num="num"  @pictureClose="pictureClose"></picturePrevie>
    <!-- 编辑/添加任务计划 -->
    <el-dialog :title="planDialogTitle" :visible.sync="planDialogVisible" width="520px" @close="planDialogClose">
      <div class="planContent">
        <el-form :model="addData_plan" :rules="addFlowRules_plan" ref="addData_plan">
          <div class="item" style="width:100%">
            <span>时间<i class="required">*</i></span>
            <el-form-item prop="startDate">
              <el-date-picker
                  style="width:250px"
                  v-model="startEndTime_plan"
                  @change="startEndTimeChange_plan"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="item">
            <span>任务<i class="required">*</i></span>
            <el-form-item prop="content">
              <el-input style="width:210px" v-model="addData_plan.content" maxlength="20"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <span>负责人<i class="required">*</i></span>
            <el-form-item prop="principal">
              <el-input style="width:210px" v-model="addData_plan.principal" maxlength="10"></el-input>
            </el-form-item>
          </div>
          <div class="item" style="width:100%">
            <span>备注</span>
            <el-form-item prop="remark">
              <el-input type="textarea" :rows="3" placeholder="100字以内"  v-model="addData_plan.remark" maxlength="100"></el-input>
            </el-form-item>
          </div>
          <div class="item" v-if="planDialog==='edit'">
            <span>完成情况<i class="required">*</i></span>
            <el-form-item prop="doFlg">
              <el-select style="width:210px" v-model="addData_plan.doFlg">
                  <el-option label="未完成" :value="false"></el-option>
                  <el-option label="已完成" :value="true"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="planDialogClose">取 消</el-button>
        <el-button type="primary" @click="savePlanDialog('addData_plan')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑/新增费用 -->
    <el-dialog :title="costDialogTitle" :visible.sync="costDialogVisible" width="520px" @close="costDialogClose">
      <el-form :model="addData_cost" :rules="addFlowRules_cost" ref="addData_cost">
        <div class="costDialog_content">
          <div class="item">
            <span>名称<i class="required">*</i></span>
            <el-form-item prop="name">
              <el-input style="width:210px" v-model="addData_cost.name" maxlength="20"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <span>预计金额<i class="required">*</i></span>
            <el-form-item prop="yjAmount">
              <el-input style="width:210px" v-model="addData_cost.yjAmount" maxlength="15" type="number"></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <span>实际金额</span>
            <el-form-item prop="sjAmount">
              <el-input style="width:210px" v-model="addData_cost.sjAmount" maxlength="15" type="number"></el-input>
            </el-form-item>
          </div>
          <div class="item" style="width:100%">
            <span>备注</span>
            <el-form-item prop="remark">
              <el-input type="textarea" :rows="3" placeholder="100字以内"  v-model="addData_cost.remark" maxlength="100"></el-input>
            </el-form-item>
          </div>
          <div v-if="addData_cost.annexDTO.annexName" class="costFile">
            <span>{{addData_cost.annexDTO.annexName}}</span>
            <i class="el-icon-delete" @click="delCostFile"></i>
          </div>
          <div class="aliUpload_cost" v-else>
            <i class="el-icon-upload2"></i>
            <aliUpload class="aliUpload"
                  :upLoadText="upLoadText_cost"
                  :fileType="fileType_cost"
                  :iconShow="false"
                  @setAnnex="setAnnex_cost"
                />
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="costDialogClose">取 消</el-button>
        <el-button type="primary" @click="saveCostDialog('addData_cost')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除弹窗 -->
    <el-dialog title="删除确认" :visible.sync="DELDialogVisible" width="520px" @close="DELDialogClose" center class="delDialog">
      <div class="delDialog_content">
        <i class="el-icon-warning-outline" ></i>
        <span>{{delTxt}}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogClose">取 消</el-button>
        <el-button type="primary" @click="delFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import context from '@/service'
import axios from 'axios'
import aliUpload from '@/components/aliUpload.vue'
import aliDownLoad from '@/components/aliDownLoad.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import Drawer from '@/components/drawer.vue'
import { error } from 'util'
import OSS from 'ali-oss'
export default {
  components: {
    Drawer,
    picturePrevie,
    aliDownLoad,
    aliUpload
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    detailsData: {
      type: Object,
      default: {}
    }
  },
  watch: {
    // detailsData1: {
    //   handler (oldVal, newVal) {
    //     this.detailsData = newVal
    //     console.log(111)
    //   },
    //   deep: true
    // }
  },
  data () {
    return {
      delTxt: '是否删除文件？',
      partMenu: 1,
      leftPartHeight: null,
      fileSize: 100,
      showArrow: false,
      berthImg: require('../../../../../assets/berth-default.png'),
      dataDelIndex: null, // 删除资料存档索引
      upLoadText_data: '上传附件',
      fileType_data: [],
      costDialogType: 'add',
      deleteType: null,
      deleteId: null,
      startEndTime_plan: [],
      planDialog: 'add', // 新增计划弹窗类型  add  edit
      imagesIndex: 0,
      startEndTime: [],
      autocompleteText: '',
      assReadonly: true,
      menuTab: 1,
      topNum: '20px',
      tableData2: [{
        id: '12987122',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333'
      }],
      fileType_cost: ['pdf', 'png', 'jpg'],
      upLoadText_cost: '上传凭证（发票，收据）',
      addData_cost: {// 编辑新增费用入参
        name: null,
        yjAmount: null,
        sjAmount: null,
        remark: null,
        annexDTO: {
          annexURL: null,
          annexName: null
        }
      },
      addFlowRules_cost: {
        name: [
          { required: true, message: '请输入费用名称', trigger: 'change' }
        ],
        yjAmount: [
          { required: true, message: '请输入预计金额', trigger: 'change' }
        ]
      },
      costDialogVisible: false, // 新增编辑费用弹窗
      tableData1: [{
        id: '12987122',
        name: '好滋好味鸡蛋仔好滋好味鸡蛋仔好滋好味鸡蛋仔好滋好',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333'
      }],
      DELDialogVisible: false, // 删除弹窗
      addData_plan: { // 编辑新增计划入参
        startDate: null,
        endDate: null,
        content: null,
        principal: null,
        remark: null,
        doFlg: null
      },
      addFlowRules_plan: {
        startDate: [
          { required: true, message: '请选择活动时间', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入任务内容', trigger: 'change' }
        ],
        principal: [
          { required: true, message: '请输入负责人', trigger: 'change' }
        ]
      },
      planDialogVisible: false,
      planDialogTitle: '编辑任务计划',
      costDialogTitle: '编辑费用',
      showPicture: false,
      imgArr: [],
      num: [],
      fileType: ['png', 'jpg'],
      upLoadText: '上传图片',
      readOnly: true,
      drawerTitle: '查看活动详情',
      addFlowRules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择活动时间', trigger: 'change' }
        ],
        projectId: [
          { required: true, message: '请选择活动项目', trigger: 'change' }
        ],
        place: [
          { required: true, message: '请输入活动地点', trigger: 'change' }
        ],
        amount: [
          { required: true, message: '请输入预计费用', trigger: 'change' }
        ],
        target: [
          { required: true, message: '请输入目标设定', trigger: 'change' }
        ],
        tenantId: [
          { required: true, message: '请输入客户名称', trigger: 'change' }
        ]
      },
      usersList: []
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
  },
  mounted () {
    this.getUserList()
    let winHeight
    if (window.innerHeight) {
      winHeight = window.innerHeight
    } else if ((document.body) && (document.body.clientHeight)) {
      winHeight = document.body.clientHeight
    }
    this.leftPartHeight = winHeight - 80 + 'px'
    console.log(this.leftPartHeight)
  },
  methods: {
    partMenuChange (n) {
      this.partMenu = n
    },
    formatCreatedDate (row, column) {
      if (row.createTime) {
        return row.createTime.replace('T', '  ').replace('Z', '  ')
      }
      return '-'
    },
    formatdoFlg (row, column) {
      if (row.doFlg) {
        return '已完成'
      } else {
        return '未完成'
      }
    },
    formatPlanTime (row, column) {
      return row.startDate + ' - ' + row.endDate
    },
    planEdit (index, row) { // 编辑任务计划
      this.startEndTime_plan = []
      context.http.get(`/cms/api/task-plans/${row.id}`).then(res => {
        this.addData_plan = res.data
        this.startEndTime_plan.push(this.addData_plan.startDate)
        this.startEndTime_plan.push(this.addData_plan.endDate)
        this.planDialogTitle = '编辑任务计划'
        this.planDialog = 'edit'
        this.planDialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    costDialogClose () { // 关闭费用弹窗
      this.addData_cost = {
        name: null,
        yjAmount: null,
        sjAmount: null,
        remark: null,
        annexDTO: {
          annexURL: null,
          annexName: null
        }
      }
      this.costDialogVisible = false
      this.$refs['addData_cost'].resetFields()
    },
    delDialogClose () {
      this.DELDialogVisible = false
    },
    costEdit (index, row) { // 费用编辑
      context.http.get(`/cms/api/costs/${row.id}`).then(res => {
        this.addData_cost = res.data
        this.costDialogTitle = '费用编辑'
        this.costDialogType = 'edit'
        this.costDialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    addCostFun () { // 添加费用弹窗
      this.costDialogTitle = '添加费用'
      this.costDialogType = 'add'
      this.costDialogVisible = true
    },
    saveCostDialog (formName) { // 编辑新增费用提交
      let _this = this
      this.addData_cost.planActivityId = this.detailsData.id // 企划活动id
      if (this.costDialogType === 'add') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            context.http.post('/cms/api/costs', this.addData_cost).then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '新增成功'
                })
                _this.costDialogClose()
                _this.$emit('detailsUpdate', this.detailsData.id)
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            context.http.put('/cms/api/costs', this.addData_cost).then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '编辑成功'
                })
                _this.costDialogClose()
                _this.$emit('detailsUpdate', this.detailsData.id)
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    DELDialogClose () { // 关闭删除弹窗
      this.DELDialogVisible = false
    },
    addPlanFun () { // 添加任务弹窗
      this.planDialogTitle = '添加任务计划'
      this.planDialog = 'add'
      this.planDialogVisible = true
    },
    subImagesIndex () { // -
      if (this.imagesIndex > 0) {
        this.imagesIndex--
      }
    },
    prvImagesIndex () { // +
      if (this.imagesIndex < this.detailsData.images.length - 1) {
        this.imagesIndex++
      }
    },
    startEndTimeChange_plan (time) {
      if (time) {
        this.addData_plan.startDate = time[0]
        this.addData_plan.endDate = time[1]
      } else {
        this.addData_plan.startDate = null
        this.addData_plan.endDate = null
      }
    },
    startEndTimeChange (time) { // 编辑模式时间修改
      if (time) {
        this.detailsData.startDate = time[0]
        this.detailsData.endDate = time[1]
      } else {
        this.detailsData.startDate = null
        this.detailsData.endDate = null
      }
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
      // return true
    },
    editSave (formName) { // 编辑提交
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          context.http.put('/cms/api/plan-activities', this.detailsData).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              _this.onHide()
              _this.$emit('queryUpdate')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    formatTime (s, e) {
      return s + ' - ' + e
    },
    formatStatus (type) {
      switch (type) {
        case 'EXECUTING':
          return '筹备执行'
        case 'ASSESS':
          return '评估'
        case 'ARCHIVE':
          return '存档'
        case 'CLOSED':
          return '已关闭'
      }
    },
    getUserList () {
      let usersList = this.$store.state.usersList
      this.usersList = usersList.map(item => {
        return {value: item.name, id: item.id}
      })
      // console.log(this.usersList)
    },
    querySearch (queryString, callback) {
      var restaurants = this.usersList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
        // 调用 callback 返回建议列表的数据
      callback(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {
      console.log(item, this.autocompleteText)
    },
    delMembers (item, index) {
      this.detailsData.members.splice(index, 1)
      // context.http.put('/cms/api/plan-activities', this.detailsData).then(res => {
      //   if (res) {
      //     this.$message({
      //       type: 'success',
      //       message: '删除成功'
      //     })
      //     this.$emit('detailsUpdate', this.detailsData.id)
      //   }
      // })
    },
    addmembers () { // 新增评估参与人
      if (this.autocompleteText === '') {
        this.$message.error('请选择评估参与人')
        return
      }
      if (this.detailsData.members.length === 20) {
        this.$message.error('评估参与人最多20人')
        return
      }
      this.detailsData.members.push(this.autocompleteText)
      this.autocompleteText = ''
      // context.http.put('/cms/api/plan-activities', this.detailsData).then(res => {
      //   if (res) {
      //     this.$message({
      //       type: 'success',
      //       message: '参与人新增成功'
      //     })
      //     this.$emit('detailsUpdate', this.detailsData.id)
      //   }
      // })
    },
    savePart2 () {
      context.http.put('/cms/api/plan-activities', this.detailsData).then(res => {
        if (res) {
          this.$message({
            type: 'success',
            message: '提交成功'
          })
          this.onHide()
          this.$emit('queryUpdate', this.detailsData.id)
        }
      })
    },
    assessEdit () { // 评估阶段编辑模式
      this.assReadonly = !this.assReadonly
    },
    menuTabChange (n) {
      this.menuTab = n
    },
    woListScroll (e) {
      this.topNum = 20 + e.target.scrollTop + 'px'
      // console.log(e.target.scrollTop)
    },
    delCostFile () { // 费用文件删除
      this.addData_cost.annexDTO = {
        annexURL: null,
        annexName: null
      }
    },
    setAnnex_cost (annexURL, annexName) { // 费用文件上传
      this.addData_cost.annexDTO.annexURL = annexURL
      this.addData_cost.annexDTO.annexName = annexName
    },
    setAnnex_data (annexURL, annexName) { // 资料存档上传
      // this.detailsData.annexes = []
      this.detailsData.annexes.push({
        annexURL: annexURL,
        annexName: annexName
      })

      context.http.put('/cms/api/plan-activities', this.detailsData).then(res => {
        if (res) {
          // this.$message({
          //   type: 'success',
          //   message: '保存成功'
          // })
          this.$emit('detailsUpdate', this.detailsData.id)
        }
      })
    },
    savePlanDialog (formName) { // 提交任务计划
      let _this = this
      this.addData_plan.planActivityId = this.detailsData.id // 企划活动id
      if (this.planDialog === 'add') {
        delete this.addData_plan.doFlg
        this.$refs[formName].validate((valid) => {
          if (valid) {
            context.http.post('/cms/api/task-plans', this.addData_plan).then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '新增成功'
                })
                _this.planDialogClose()
                _this.$emit('detailsUpdate', this.detailsData.id)
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            context.http.put('/cms/api/task-plans', this.addData_plan).then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '编辑成功'
                })
                _this.planDialogClose()
                _this.$emit('detailsUpdate', this.detailsData.id)
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    planDialogClose () { // 关闭任务计划
      this.startEndTime_plan = []
      this.addData_plan = { // 编辑新增计划入参
        startDate: null,
        endDate: null,
        content: null,
        principal: null,
        remark: null,
        doFlg: null
      }
      this.planDialogVisible = false
      this.$refs['addData_plan'].resetFields()
    },
    planDel (index, row) { // 计划确认删除弹窗
      this.delTxt = '是否删除任务计划？'
      this.deleteType = 'plan' // 删除类型
      this.deleteId = row.id
      this.DELDialogVisible = true
    },
    costDel (index, row) { // 费用确认删除弹窗
      this.delTxt = '是否删除费用项？'
      this.deleteType = 'cost' // 删除类型
      this.deleteId = row.id
      this.DELDialogVisible = true
    },
    dataDel (index, row) { // 资料删除
      this.delTxt = '是否删除文件？'
      this.deleteType = 'data' // 删除类型
      this.dataDelIndex = index
      this.DELDialogVisible = true
    },
    delFun () { // 删除函数
      if (this.deleteType === 'plan') {
        context.http.delete(`cms/api/task-plans/${this.deleteId}`).then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.DELDialogVisible = false
            this.$emit('detailsUpdate', this.detailsData.id)
          }
        })
      } else if (this.deleteType === 'cost') {
        context.http.delete(`cms/api/costs/${this.deleteId}`).then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.DELDialogVisible = false
            this.$emit('detailsUpdate', this.detailsData.id)
          }
        })
      } else if (this.deleteType === 'data') {
        this.detailsData.annexes.splice(this.dataDelIndex, 1)
        context.http.put('/cms/api/plan-activities', this.detailsData).then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.DELDialogVisible = false
            this.$emit('detailsUpdate', this.detailsData.id)
          }
        })
      }
    },
    deleteFn (item, index) {
      this.detailsData.images.splice(index, 1)
    },
    pictureClose () {
      this.showPicture = false
    },
    showImg (item, index) {
      let imgArr = []
      this.detailsData.images.forEach(item => {
        imgArr.push(item)
      })
      this.imgArr = imgArr
      this.num = index
      this.showPicture = true
    },
    setAnnex (annexURL) {  // 子组件上传成功返回文件url 和名字
      this.detailsData.images.push(annexURL)
    },
    onHide () {
      this.partMenu = 1
      this.menuTab = 1
      this.readOnly = true
      this.assReadonly = true
      this.$emit('drawerClose', false)
    },
    onEdit () {
      if (this.startEndTime.length === 0) {
        this.startEndTime.push(this.detailsData.startDate)
        this.startEndTime.push(this.detailsData.endDate)
      } else {
        this.startEndTime[0] = this.detailsData.startDate
        this.startEndTime[1] = this.detailsData.endDate
      }
      this.readOnly = false
    }
  }
}
</script>
<style lang="scss">
.activityContent  .dataPart{
  .oss_file{
    height: 28px;
    line-height: 28px;
  }
}
.costPart1{
  .aliDownload{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    .icon-xiazaidaoru{
      display: block;
      width: 100%;
      height: 100%;
    }
    .icon-xiazaidaoru::before{
      content: "";
    }
  }
}
.summary{
  .el-textarea,.el-textarea__inner{
    height: auto!important;
  }
}
.participant{ //评估参与人
  .title{
    .el-input__inner{
      height: 28px;
      width: 100px;
    }
    .el-autocomplete{
      width: 100px;
    }
  }
}
.dataPart{
  .aliDownload{
    display: inline-block;
    width: auto;
    height: auto;
    margin-right: 15px;
    cursor: pointer;
    .icon-xiazaidaoru{
      font-family:'微软雅黑'!important;
      font-size: 14px;
    }
    >.icon-xiazaidaoru::before{
      content: '下载'!important;
    }
    color: #0E75FF;
  }
}
.aliUpload_cost{
  position: relative;
  .el-icon-upload2{
    position: absolute;
    top: 15px;
    left: 10px;
  }
  .oss_file{
    height: 40px;
    width: 100%;
    line-height: 40px;
    color: #333;
    font-size: 12px;
    padding: 0 10px 0 30px;
    border: 1px solid #eeeeee;
  }
}
  .delDialog_content{
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    padding: 30px;
    i{
      font-size: 50px;
      color: #E27774;
      margin-bottom: 20px
    }
    span{
      color: #5D6165;
      font-size:16px; 
    }
  }
  .costDialog_content{
      display: flex;
      padding: 20px 0;
      flex-wrap: wrap;
      justify-content: space-between;
    .item{
      >span{
        margin-bottom: 5px;
        display: block;
      }
      .el-textarea textarea{
        height: auto;
      }
    }
    .costFile{
      >span{
        display: inline-block;
        width: 200px;
        margin-right: 15px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      >i{
        font-size: 16px;
        cursor: pointer;
      }
    }
  }
  .planContent{
    >.el-form{
      display: flex;
      padding: 20px 0;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .item{
      >span{
        margin-bottom: 5px;
        display: block;
      }
      .el-textarea textarea{
        height: auto;
      }
    }
  }
  .projectActivities{
    .delDialog{
      .el-dialog__header, .el-dialog__body{
        border: none;
      }
    }
  }
  .activityContent{
    .el-carousel__item{
      text-align: center;
    }
    .el-carousel__button{
      width:5px;
      height:5px;
      border-radius: 5px;
    }
    .btnDiv{      
      .el-button{
        width: 100px;
      }
    }
    .item{
      >.el-date-editor,>.el-select,>.el-textarea{
        margin-bottom: 22px;
      }
      .el-textarea textarea{
        height: auto!important;
      }
    }
    .oss_file{
      border:none!important;
      height: 100px;
      width: 100%;
      line-height: 150px;
      color: #3577F6;
      font-size: 12px;
    }
    .demo-table-expand {
      font-size: 0;
    }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
    padding: 10px;
    display: flex;
    align-items: center;
  }
  }
</style>
<style lang="scss" scoped>
.tenant-information {
  width: 100%;
  height: 100%;
  .activityContent{
    width: 1050px;
    padding: 20px;
    display: flex;
    flex-wrap: nowrap;
    position: relative;
    .item{
        flex-direction:column;
        >span{
          display: block;
          margin-bottom: 5px;
        }
        .readOnlyTxt{
          font-size: 12px;
          color: #999;
          // height: 40px;
          // line-height: 40px;
          width: 300px;
          padding: 8px;
        }
      }
    .rightPart{
      min-height: 700px;
      // border: 1px solid #eee;
      width: 100%;
      padding-left: 330px;
      padding-bottom: 50px;
      .main_content{
        .partMenu{
          display: flex;
          margin: 50px 0 20px 0;
          >span{
            display: inline-block;
            width: 175px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border: 1px solid #3577F6;
            color: #596483FF;
            cursor: pointer;
            font-size: 16px;
            &:first-child{
              border-right: none;
              border-top-left-radius: 8px;
              border-bottom-left-radius: 8px;
            }
            &:last-child{
              border-left: none;
              border-top-right-radius: 8px;
              border-bottom-right-radius: 8px;
            }
            &.active{
              color: #ffffff;
              background-color: #3577F6;
            }
          }
        }
        .menuTab{
          height: 60px;
          line-height: 60px;
          box-shadow: 1px 1px 10px #eee;
          font-size: 12px;
          >span{
            display: inline-block;
            width: 100px;
            text-align: center;
            cursor: pointer;
            &.active{
              border-bottom:2px solid #3175F6; 
              color:#3175F6;
            }
          }
        }
        .costPart{
          // margin-top: 50px;
          border: 1px solid #eeeeee;
          .totalDiv{
            >div{
              height: 40px;
              color: #606266;
              line-height: 40px;
              border-bottom: 1px solid #eeeeee;
              span{
                display: inline-block;
                text-align: center;
                width: 125px;
                &:first-child{
                  width: 175px;
                  padding-left: 50px;
                }
              }
            }
          }
          .title{
            height: 40px;
            line-height: 40px;
            padding-left: 15px;
            background-color: #F1F1F1;
            font-size: 14px;
            color:#666;
            justify-content: space-between;
            display: flex;
            padding-right: 15px;
            .addCost{
              display: flex;
              justify-content: center;
              align-items: center;
              width: 88px;
              height: 28px;
              line-height: 28px;
              border: 1px solid #3175F6;
              color: #3175F6;
              border-radius: 5px;
              cursor: pointer;
              margin-top: 6px;
              font-size: 12px;
            }
            
          }
        }
        .planPart{
          // margin-top: 50px;
          border: 1px solid #eeeeee;
          .title{
            height: 40px;
            line-height: 40px;
            padding-left: 15px;
            background-color: #F1F1F1;
            font-size: 14px;
            color:#666;
            justify-content: space-between;
            display: flex;
            padding-right: 15px;
            .addPlan{
              display: flex;
              justify-content: center;
              align-items: center;
              width: 88px;
              height: 28px;
              line-height: 28px;
              border: 1px solid #3175F6;
              color: #3175F6;
              border-radius: 5px;
              cursor: pointer;
              margin-top: 6px;
              font-size: 12px;
            }
            
          }
        }
        .assessPart{
          .editBtn{
            cursor: pointer;
            float: right;
            .icon-edit2{
              width: 15px;
              height: 20px;
              margin-right: 4px;
              background: url(../../../../../assets/edit.png) no-repeat;
              background-size: contain;
            }
          }
          .detailsInfo{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            .item{
              width: 325px;
              height: 100px;
              border: 1px solid #F1F1F1;
              margin-bottom: 25px;
              .title{
                height: 40px;
                line-height: 40px;
                padding-left: 15px;
                background-color: #FAFAFA;
                font-size: 14px;
              }
              .content{
                height: 60px;
                background-color: #F4F4F4;
                color: #666;
                font-size: 12px;
                padding: 10px;
              }
              .el-textarea{
                .el-textarea__inner{
                  height: 110px!important;
                }
              }
            }
          }
          .summary{

          }
          .participant,.summary{ //评估参与人
            min-height: 150px;
            border: 1px solid #eeeeee;
            padding-top:1px; 
            margin-bottom: 20px;
            .title{
              height: 40px;
              line-height: 40px;
              padding-left: 15px;
              background-color: #FAFAFA;
              font-size: 14px;
              display: flex;
              justify-content: space-between;
              padding-right: 15px;
              >div{
                font-size: 12px;
                >span{
                  display: inline-block;
                  width: 70px;
                  height: 28px;
                  line-height: 28px;
                  border: 1px solid #3577F6;
                  color: #3577F6;
                  cursor: pointer;
                  border-radius:5px;
                  text-align: center;
                  >i{
                    margin-right: 5px;
                  } 
                }
              }
            }
            .content{
              padding: 10px;
              display: flex;
              flex-wrap: wrap;
              >div{
                font-size: 12px;
                background-color: #F4F4F4;
                border: 1px solid #F1F1F1;
                border-radius: 3px;
                color: #666;
                margin: 0 30px 10px 0;
                width: 100px;
                height: 30px;
                text-align: center;
                display: flex;
                align-items: center;
                >span{
                  display: inline-block;
                  width: 70px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                >i{
                  margin-left: 5px;
                  cursor: pointer;
                }
              }
            }
          }
        }
        .activityInfo{
          // min-height: 800px;
          border: 1px solid #eee;
          margin-top: 20px;
          padding-bottom: 50px;
          .upLoadDiv{
            padding-left: 20px;
            >div{
              display: flex;
              flex-wrap: wrap;
              margin: 15px 0;
            }
            .imgList{
                margin-right: 10px;
                margin-bottom: 10px;
              .item{
                  width: 115px;
                  height: 86px;
                  position: relative;
                  text-align: center;
                  // border: 1px solid #cecdcd;
                img{
                  max-width: 113px;
                  max-height: 84px;
                }
                >i{
                  cursor: pointer;
                  font-size: 20px;
                  color: #B7B2B2;
                  position: absolute;
                  right: -10px;
                  top: -10px;
                }
              }
            }
            .upLoadComponents{
              width: 115px;
              height: 100px;
              border: 1px dashed #D0D0D0FF;
              background: url(../../../../../assets/plus.png) no-repeat center;
              .aliUpload{
                
              }
            }
          }
          .title{
            height: 40px;
            line-height: 40px;
            padding-left: 15px;
            background-color: #F1F1F1;
            font-size: 14px;
            color:#666;
            justify-content: space-between;
            display: flex;
            padding-right: 15px;
            .editBtn{
              cursor: pointer;
              .icon-edit2{
                width: 15px;
                height: 20px;
                margin-right: 4px;
                background: url(../../../../../assets/edit.png) no-repeat;
                background-size: contain;
              }
            }
          }
          .activityInfo_content{
            padding: 20px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
          }
        }
      }
    }
    .leftPart{
      width: 310px;
      // height: 965px;
      height: 65%;
      box-shadow: 1px 1px 10px 0px #ababab;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: absolute;
      top: 20px;
      left: 15px;
      .bottom{
        padding: 20px;
        color: #666;
        font-size: 14px;
        :first-child{
          margin-bottom: 10px;
        }
      }
      .typeTips{
        padding: 5px 10px;
        font-size: 14px;
        background-color: #0E75FF;
        margin-left: 20px;
        color: #fff;
        border-radius: 3px;
      }
      .actName{
        font-size: 18px;
        font-weight: bold;
        padding:0 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 10px;
      }
      .projectName{
        padding:0 20px;
        font-size: 14px;
        color: #666;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 10px;
      }
      .actTime{
        padding:0 20px;
        font-size: 14px;
        color: #666;
        margin-bottom: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .imgDIv{
        width: 310px;
        height: 230px;
        position: relative;
        padding: 20px;
        text-align: center;
        .shadeBox{
          width: 270px;
          height: 190px;
          position: absolute;
          top: 20px;
          left: 20px;
          text-align: center;
          line-height: 190px;
          color: #fff;
          background-color: rgba(0, 0, 0, 0.38);
        }
        .ICON{
          position: absolute;
          font-size: 36px;
          top: 50%;
          transform:translateY(-50%);
          background-color: rgba(255, 255, 255, .5);
          cursor: pointer;
          &.el-icon-arrow-left{
            left: 20px;
          }
          &.el-icon-arrow-right{
            right: 20px;
          }
        }
      }
    }
  }
}
</style>
