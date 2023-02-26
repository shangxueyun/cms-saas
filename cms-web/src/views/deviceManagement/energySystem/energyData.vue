<template>
  <div id="energySystem"
       class="energySystem">
    <span class="page_head_title">能耗系统</span>
    <div style="padding:0 20px;"
         class="search-bar">
      <div class="searbar-left">
        <el-select v-model="projectManagementId"
                   placeholder="项目"
                   @change='getBuliding'>
          <el-option v-for="item in projectManagementsList"
                     :key="item.id"
                     :label="item.referred"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="chartType"
                   placeholder="类型"
                   @change="query">
          <el-option v-for="(item,index) in getEquirementTypes25List"
                     :key="index"
                     :value="item.id"
                     :label="item.name"></el-option>
        </el-select>
      </div>
    </div>
    <ul class="default_tab_block">
      <li @click="roterTo('energy')"
          v-if="hasAuthority('03030101')">
        <span>能耗管线图</span>
      </li>
      <li class="active">
        <span>能耗数据</span>
      </li>
      <li @click="roterTo('energyEquipment')"
          v-if="hasAuthority('03030106')">
        <span>能耗设备</span>
      </li>
    </ul>
    <div class="search-bar">
      <div class="searbar-left">
        <span>
          <el-select v-model="watchType"
                     placeholder="表类型"
                     clearable>
            <el-option label="普通表"
                       value="ORDINARY_TABLE"></el-option>
            <el-option label="公共表"
                       value="PUBLIC_TABLE"></el-option>
            <el-option label="总表"
                       value="SUMMARY_TABLE"></el-option>
          </el-select>
        </span>
        <span>
          <el-input v-model="tenName"
                    placeholder="商户名称"
                    style="width:220px"></el-input>
        </span>
        <div class="query-btn"
             style="margin-top:0"
             @click="query">查询</div>
      </div>
      <div style="display:flex;align-items: center;">
        <el-button class="tban tban1"
                   @click="showAddenergyDataDialog"
                   v-if="hasAuthority('03030103')"><i class="iconfont icon-crm_xinzeng-"></i> 新增数据</el-button>

        <div style="height:30px;"
             v-if="hasAuthority('03030103')">
          <el-dropdown style="display:block;cursor:pointer"
                       trigger="hover">
            <div class="morebtn1 el-dropdown-link">
              <i class="icon-daochu"
                 style="font-size: 12px;margin-left:5px;"></i>
              <span>批量操作</span>
              <i class="el-icon-caret-bottom"
                 style="font-size: 14px;"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span class="disBlock"
                      @click="downLoadModel">下载模板</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span class="export-info"
                      style="postion: relative">导入数据
                  <input type="file"
                         style="position: absolute;opacity: 0;bottom: 17px;left: 0;width: 123px;"
                         @change="importModel($event)">
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="content">

      <div class="table">
        <el-table :data="tableData1"
                  style="width: 100%">
          <el-table-column prop="code"
                           label="设备编号"
                           align="center"></el-table-column>
          <el-table-column prop="name"
                           label="设备名称"
                           align="center"></el-table-column>
          <el-table-column prop="buildingName"
                           label="楼宇名称"
                           align="center"></el-table-column>
          <el-table-column label="仪表类型"
                           align="center"
                           :formatter="formatinstrumentType"></el-table-column>
          <el-table-column label="关联商户"
                           align="center"
                           :formatter="formatreferred"></el-table-column>
          <el-table-column label="时间"
                           align="center"
                           :formatter="formatconsumerTime"></el-table-column>
          <el-table-column label="用量"
                           align="center"
                           :formatter="formatconsumption1"></el-table-column>
          <el-table-column label="更新时间"
                           align="center"
                           :formatter="formatupdateTime"></el-table-column>
          <el-table-column label="操作"
                           align="center"
                           v-if="hasAuthority('03030104')">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)"
                         class="el-button--primary operation-btn"
                         plain
                         size="mini">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot1">
        <span><span style="margin-right:10px">{{currentPage}}/{{Math.ceil(total/pgSize)}}页</span> 共{{total}}条记录</span>
        <el-pagination v-if="total > 0"
                       background
                       layout="prev, pager, next"
                       :page-size=pgSize
                       :total="total"
                       :current-page.sync="currentPage"
                       @current-change="current_change">
        </el-pagination>
        <div class="pagingnum">
          显示 <select v-model="pgSize"
                  @change="currentSel">
            <option v-for="item in pgNumoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </option>
          </select>
          条目
        </div>
      </div>
    </div>
    <!-- 导入错误 -->
    <el-dialog v-if="errorPrompt"
               title="错误提示"
               :visible.sync="errorPrompt">
      <el-table :data="gridData"
                style="min-height: 200px;border-left: 1px solid #eee;border-right: 1px solid #eee;">
        <el-table-column property="fileName"
                         label="导入文件"
                         align="center"></el-table-column>
        <el-table-column label="导入结果"
                         align="center"
                         width="220px">
          <template slot-scope="scope">
            <span style="color: red">{{scope.row.result}}</span>
          </template>
        </el-table-column>
        <el-table-column property="address"
                         label="操作"
                         align="center"
                         width="140px">
          <template slot-scope="scope">
            <span class="export-error"
                  @click="downLoadModel(scope.$index, scope.row)">导出错误提示</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="errorPrompt = false"
                   class="close-button">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 新增能耗数据 -->
    <el-dialog title="新增能耗数据"
               :visible.sync="addenergyDataShow"
               width="800px"
               @close="addenergyDataClose">
      <el-form :model="addData"
               :rules="addFlowRules"
               ref="addData">
        <div class="energyDataHtml">
          <div class="item"
               style="width:330px;margin-right:30px">
            <span>设备编号<i class="required">*</i></span>
            <el-form-item prop="equirement.id">
              <el-input style="width:280px;"
                        v-model="addData.equirement.code"></el-input>
              <i class="seachDeviceIcon"
                 @click="showChosseDevDialog"></i>
            </el-form-item>
          </div>
          <div class="item">
            <span>设备名称</span>
            <el-form-item prop="equirement.name">
              <el-input style="width:330px;margin-right:30px"
                        v-model="addData.equirement.name"
                        disabled></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <span>能耗类型</span>
            <el-form-item prop="equirement.equirementType.name">
              <el-input style="width:330px;margin-right:30px"
                        v-model="addData.equirement.equirementType.name"
                        disabled></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <span>项目简称</span>
            <el-form-item prop="equirement.projectManagement.referred">
              <el-input style="width:330px;margin-right:30px"
                        v-model="addData.equirement.projectManagement.referred"
                        disabled></el-input>
            </el-form-item>
          </div>
          <div class="item"
               v-if="addData.equirement.tenant">
            <span>关联商户</span>
            <el-form-item prop="equirement.tenant.teantName">
              <el-input style="width:330px;margin-right:30px"
                        v-model="addData.equirement.tenant.teantName"
                        disabled></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <span>楼宇名称</span>
            <el-form-item prop="equirement.building.buildingName">
              <el-input style="width:330px;margin-right:30px"
                        v-model="addData.equirement.building.buildingName"
                        disabled></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <span>用量<i class="required">*</i></span>
            <el-form-item prop="consumption">
              <el-input style="width:280px;"
                        v-model="addData.consumption"
                        type="number"></el-input>
              <span style="display:inline-block;width:50px;margin-right:30px">{{addData.equirement.equirementType.name==='电'?'kw.h':'m³'}}</span>
            </el-form-item>
          </div>
          <div class="item">
            <span>时间<i class="required">*</i></span>
            <el-form-item prop="consumerTime">
              <el-date-picker v-model="addData.consumerTime"
                              type="month"
                              value-format="yyyy-MM-dd"
                              style="width:330px;margin-right:30px"
                              placeholder="选择月">
              </el-date-picker>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="addenergyDataClose"
                   class="close-button">关 闭</el-button>
        <el-button type="primary"
                   @click="addenergyDataFn('addData')"
                   class="defaultbtn dialog-confirmBtn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 能耗数据详情 -->
    <el-drawer title="能耗数据详情"
               :visible.sync="energyDataDetailShow"
               direction="rtl"
               @close="energyDataDetailCLose"
               size="900px">
      <div class="energyDataDetail">
        <div class="eChart">
          <p class="title">曲线图</p>
          <div class="seachDiv">
            <el-date-picker v-model="startDate1"
                            value-format="yyyy-MM-dd"
                            type="month"
                            :picker-options="pickerBeginDateBefore"
                            placeholder="起始月份">
            </el-date-picker>
            <span style="margin-right:15px;margin-left:15px;"> - </span>
            <el-date-picker v-model="endDate1"
                            value-format="yyyy-MM-dd"
                            type="month"
                            :picker-options="pickerBeginDateAfter"
                            placeholder="结束月份">
            </el-date-picker>
            <span class="query-btn"
                  @click="chartDetails"
                  style="margin-top:0">查询</span>
          </div>
          <div id="myChart"
               style="width:100%;height:500px"></div>
        </div>
        <div class="historyTable">
          <p class="title">历史数据</p>
          <div class="seachDiv">
            <el-date-picker v-model="startDate2"
                            value-format="yyyy-MM-dd"
                            type="month"
                            placeholder="起始月份">
            </el-date-picker>
            <span style="margin-right:15px;margin-left:15px;"> - </span>
            <el-date-picker v-model="endDate2"
                            value-format="yyyy-MM-dd"
                            type="month"
                            placeholder="结束月份">
            </el-date-picker>
            <span class="query-btn"
                  @click="searchHistoryTable"
                  style="margin-top:0">查询</span>
          </div>
          <div class="table3 details_table">
            <el-table :data="tableData2"
                      style="width: 100%"
                      ref="multipleTable">
              <el-table-column prop="equirement.code"
                               label="设备编号"
                               align="center"> </el-table-column>
              <el-table-column prop="equirement.name"
                               label="设备名称"
                               align="center"> </el-table-column>
              <el-table-column label="时间"
                               align="center"
                               :formatter="formatconsumerTime"> </el-table-column>
              <el-table-column label="用量"
                               align="center"
                               :formatter="formatconsumption"></el-table-column>
              <el-table-column label="操作"
                               v-if="hasAuthority('03030105')">
                <template slot-scope="scope">
                  <el-button @click="handleEdit1(scope.$index, scope.row)"
                             class="el-button--primary operation-btn"
                             plain
                             size="mini">编 辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="ctc-foot">
            <el-col :span="24">
              <span class="flex">
                <el-pagination v-if="total2 > 0"
                               background
                               layout="prev, pager, next"
                               :page-size=pgSize2
                               :total="total2"
                               :current-page="currentPage2"
                               @current-change="current_change2">
                </el-pagination>
              </span>
            </el-col>
          </div>
        </div>
      </div>
    </el-drawer>
    <!-- 编辑能耗数据 -->
    <el-drawer title="编辑能耗数据"
               :visible.sync="editenergyDataShow"
               class="energyDataHtml_editHtm"
               @close="editenergyDataClose"
               direction="rtl"
               size="850px">
      <el-form :model="addData"
               :rules="addFlowRules"
               ref="addData">
        <div class="energyDataHtml"
             style="padding-left: 30px">
          <div class="item"
               style="width:330px;margin-right:30px">
            <span>设备编号<i class="required">*</i></span>
            <el-form-item prop="equirement.id">
              <el-input v-model="addData.equirement.code"
                        disabled></el-input>
              <!-- <i class="seachDeviceIcon" @click="showChosseDevDialog" ></i> -->
            </el-form-item>
          </div>
          <div class="item">
            <span>设备名称</span>
            <el-form-item prop="equirement.name">
              <el-input style="width:330px;margin-right:30px"
                        v-model="addData.equirement.name"
                        disabled></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <span>能耗类型</span>
            <el-form-item prop="equirement.equirementType.name">
              <el-input style="width:330px;margin-right:30px"
                        v-model="addData.equirement.equirementType.name"
                        disabled></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <span>项目简称</span>
            <el-form-item prop="equirement.projectManagement.referred">
              <el-input style="width:330px;margin-right:30px"
                        v-model="addData.equirement.projectManagement.referred"
                        disabled></el-input>
            </el-form-item>
          </div>
          <div class="item"
               v-if="addData.equirement.tenant">
            <span>关联商户</span>
            <el-form-item prop="equirement.tenant.teantName">
              <el-input style="width:330px;margin-right:30px"
                        v-model="addData.equirement.tenant.teantName"
                        disabled></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <span>楼宇名称</span>
            <el-form-item prop="equirement.building.buildingName">
              <el-input style="width:330px;margin-right:30px"
                        v-model="addData.equirement.building.buildingName"
                        disabled></el-input>
            </el-form-item>
          </div>
          <div class="item">
            <span>用量<i class="required">*</i></span>
            <el-form-item prop="consumption">
              <el-input style="width:280px;"
                        v-model="addData.consumption"
                        type="number"></el-input>
              <span style="display:inline-block;width:50px;margin-right:30px">{{addData.equirement.equirementType.name==='电'?'kw.h':'m³'}}</span>
            </el-form-item>
          </div>
          <div class="item">
            <span>时间<i class="required">*</i></span>
            <el-form-item prop="consumerTime">
              <el-date-picker v-model="addData.consumerTime"
                              type="month"
                              value-format="yyyy-MM-dd"
                              style="width:330px;margin-right:30px"
                              placeholder="选择月">
              </el-date-picker>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="dialog-footer"
           style="position: absolute; bottom: 35px;display: flex;flex-direction: row-reverse;width: 100%;right: 0;">
        <el-button type="primary"
                   @click="editenergyDataFn('addData')"
                   class="defaultbtn dialog-confirmBtn"
                   style="margin: 0 20px;">确 定</el-button>
        <el-button @click="editenergyDataClose"
                   class="close-button">关 闭</el-button>
      </div>
    </el-drawer>
    <!-- 选择设备 -->
    <el-dialog title="选择仪表"
               :visible.sync="chosseDevDialogVisible"
               width="900px"
               id="chosseDevDialogVisible"
               class="chosseDevDialogVisible"
               @close="closeChosseDevDialog">
      <div class="seachDiv">
        <el-select placeholder="全部"
                   style="width:160px"
                   v-model="projectManagementId">
          <el-option v-for="(item,index) in projectManagementsList"
                     :key="index"
                     :label="item.referred"
                     :value="item.id"></el-option>
        </el-select>
        <el-select v-model="equirementTypeChildId"
                   style="width:160px">
          <el-option v-for="(item,index) in getEquirementTypes25List"
                     :key="index"
                     :value="item.id"
                     :label="item.name"></el-option>
        </el-select>
        <!-- <el-cascader :options="cascaderList" @change="handleChange1" style="width:160px" clearable></el-cascader> -->
        <el-select v-model="instrumentType_dialog"
                   placeholder="表类型"
                   style="width:160px">
          <el-option label="普通表"
                     value="ORDINARY_TABLE"></el-option>
          <el-option label="公共表"
                     value="PUBLIC_TABLE"></el-option>
          <el-option label="总表"
                     value="SUMMARY_TABLE"></el-option>
        </el-select>
        <el-input placeholder="设备名称"
                  style="width:160px"
                  v-model="devName"></el-input>
        <!-- <el-input placeholder="设备编号" style="width:160px" v-model="devNb"></el-input> -->
        <el-button class="secrchBtn"
                   type="primary"
                   @click="querySeach">查询</el-button>
      </div>
      <div class="table"
           id="table">
        <el-table :data="tableData"
                  style="width: 100%"
                  ref="tableData">
          <el-table-column width="55"
                           label="">
            <template slot-scope="scope">
              <el-radio :label="scope.row.id"
                        v-model="selectionId"
                        @change.native="getTemplateRow(scope.$index,scope.row)">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="projectManagement.referred"
                           label="项目简称"
                           align="center"> </el-table-column>
          <el-table-column prop="code"
                           label="设备编号"
                           align="center"> </el-table-column>
          <el-table-column prop="name"
                           label="设备名称"
                           align="center"> </el-table-column>
          <el-table-column prop="equirementType.name"
                           label="设备小类"
                           align="center"></el-table-column>
          <el-table-column label="仪表类型"
                           align="center"
                           :formatter="formatinstrumentType"></el-table-column>
          <el-table-column label="关联商户"
                           align="center"
                           :formatter="formatteantName"> </el-table-column>
          <el-table-column prop="installPosition"
                           label="安装位置"
                           align="center"> </el-table-column>
        </el-table>
      </div>
      <div class="ctc-foot">
        <el-col :span="24">
          <span class="flex">
            <el-pagination v-if="total1 > 0"
                           background
                           layout="prev, pager, next"
                           :page-size=pgSize1
                           :total="total1"
                           :current-page.sync="currentPage1"
                           @current-change="current_change1">
            </el-pagination>
          </span>
        </el-col>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeChosseDevDialog">返回</el-button>
        <el-button type="primary"
                   class="defaultbtn dialog-confirmBtn"
                   @click="selectdDevic">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import context from '@/service'
import * as JSOG from 'jsog'
import axios from 'axios'
export default {
  name: 'energy',
  components: {

  },
  data () {
    return {
      instrumentType_dialog: '',
      equirementTypeChildId: '',
      myChart: null,
      tableData2: [],
      endDate1: '',
      startDate1: '',
      endDate2: '',
      startDate2: '',
      energyDataDetailShow: false,
      editenergyDataShow: false,
      addenergyDataShow: false,
      addData: {
        equirement: {
          id: null,
          code: '',
          name: '',
          equirementType: {
            name: ''
          },
          projectManagement: {
            referred: ''
          },
          tenant: {
            teantName: ''
          },
          building: {
            buildingName: ''
          }
        },
        consumption: '',
        consumerTime: ''
      },
      addFlowRules: {
        'equirement.id': [
          { required: true, message: '请选择设备', trigger: 'change' }
        ],
        consumption: [
          { required: true, message: '请输入用量', trigger: 'blur' }
        ],
        consumerTime: [
          { required: true, message: '请选择時間', trigger: 'blur' }
        ]
      },
      selectionArr: [], // 选中
      selectionId: '', // 选中
      devName: '',
      devNb: '',
      cascaderList: [], // 设备类型二级联选择器
      chosseDevDialogVisible: false,
      tableData: [
        {
          equirement: {
            id: null,
            code: '',
            name: '',
            equirementType: {
              name: ''
            },
            projectManagement: {
              referred: ''
            },
            tenant: {
              teantName: ''
            },
            building: {
              buildingName: ''
            }
          }
        }
      ],
      tableData1: [],
      gridData: [{
        fileName: '',
        result: '',
        id: ''
      }],
      errorPrompt: false,
      tenName: '',
      watchType: '',
      chartType: '',
      projectManagementsList: [],
      buildingName: '',
      repairDetailsData: {
        img: []
      }, // 维修记录详情1
      repairDetailsShow: false,
      devicesDetailsShow: false,
      bindedList: [], // 平面图接口返回的已绑定信息
      detailsShow: false,
      detailData: [],
      roomList: [], // 房间列表
      planeType: 'FLOOR', // 平面图类型
      projectManagementId: '', // 商圈
      floorName: '', // 楼层
      firstTenant: null, // 默认第一栋楼数据
      svgId: null, // 当前楼层整张svg图的id
      options1: [
        { label: '楼平面图', value: 'BUILDING' },
        { label: '层平面图', value: 'FLOOR' }
      ],
      options2: [],
      options3: [],
      svgHtml: '',
      color: '',
      selfTarget: '',
      event: '',
      dialogFromIsShow: false,
      shopInfo: {
        shopName: '',
        id: '',
        shopNum: ''
      },
      pevDocment: { // 选中的DOm 和之前的样式
        target: null,
        style: null
      },
      offset: {
        offsetX: null,
        offsetY: null
      },
      floorsItem: null,
      svgHtmlShow: false,
      equirementTypeTxt: '',
      defaultScale: '1',
      translateX: '0',
      translateY: '0',
      zoom: 1,
      planeStyle: '', // 详情类型 店铺详情ROOM  设备详情DEVICE
      detailsList: [], // 区域已绑定房源或设备信息列表svgList-list
      detailsName: '',
      repairRdNum: {},
      currentPage: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
      currentPage1: 1,
      total1: 0,
      pgSize1: 15,
      currentPage2: 1,
      total2: 0,
      pgSize2: 15,
      pgNumoptions: [
        {
          value: 15,
          label: '15'
        },
        {
          value: 30,
          label: '30'
        },
        {
          value: 50,
          label: '50'
        }
      ],
      getEquirementTypes25List: [],
      equirementId: '',
      pickerBeginDateBefore: {
        disabledDate: time => {
          let endDateVal = this.endDate1
          if (endDateVal) {
            let temp = new Date(endDateVal).getTime() - 365 * 24 * 60 * 60 * 1000
            return time.getTime() < new Date(temp).getTime()
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: time => {
          let beginDateVal = this.startDate1
          if (beginDateVal) {
            let temp = new Date(beginDateVal).getTime() + 364 * 24 * 60 * 60 * 1000
            return time.getTime() > new Date(temp).getTime()
          }
        }
      }
    }
  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
    this.projectManagementId = this.$route.params.projectManagementId ? this.$route.params.projectManagementId : this.projectManagementsList[0].id
    this.getBuliding()
    this.getEquirementTypes25()
    this.dateInit()
  },
  mounted () {

  },
  methods: {
    searchHistoryTable () {
      this.currentPage2 = 1
      this.tableData2Details()
    },
    formatreferred (row, column) {
      let referred = row.referred ? row.referred : '-'
      return referred
    },
    getEquirementTypes25 () {
      context.http.get('/cms/api/equirementTypes/25').then(res => {
        this.getEquirementTypes25List = res.data
        this.chartType = this.$route.params.equipmentType ? this.$route.params.equipmentType : this.getEquirementTypes25List[0].id
        this.query()
      })
    },
    formatconsumption (row, column) {
      if (row.equirement.equirementType.name === '电') {
        return row.consumption + 'kw.h'
      } else {
        return row.consumption + 'm³'
      }
    },
    formatconsumption1 (row, column) {
      if (row.equirementTypeName === '电') {
        return row.consumption + 'kw.h'
      } else {
        return row.consumption + 'm³'
      }
    },
    formatteantName (row, column) {
      if (row.tenant) {
        if (row.tenant.teantName) {
          return row.tenant.teantName
        } else {
          return '-'
        }
      } else {
        return '-'
      }
    },
    showAddenergyDataDialog () { // 打开新增弹窗
      this.addenergyDataShow = true
      this.$nextTick(() => {
        this.addData = {
          equirement: {
            id: null,
            code: '',
            name: '',
            equirementType: {
              name: ''
            },
            projectManagement: {
              referred: ''
            },
            tenant: {
              teantName: ''
            },
            building: {
              buildingName: ''
            }
          },
          consumption: '',
          consumerTime: ''
        }
        this.$refs['addData'].resetFields()
      })
    },
    editenergyDataClose () { // 关闭编辑弹窗
      // this.addData.equirement.code = ''
      // this.$refs['addData'].resetFields()
      this.editenergyDataShow = false
      this.tableData2Details()
    },
    handleEdit1 (index, row) { // 查看详情
      this.addData = this.tableData2[index]
      this.editenergyDataShow = true
    },
    drawLine (dateArray, useLevel) {
      this.myChart = this.$echarts.init(document.getElementById('myChart'))
      this.myChart.clear()
      let option = {
        xAxis: {
          axisLabel: {
            interval: 0
          },
          axisTick: {
            alignWithLabel: true
          },
          type: 'category',
          data: dateArray
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: useLevel,
          type: 'line',
          areaStyle: {},
          smooth: true
        }]
      }
      this.myChart.setOption(option)
    },
    chartDetails () { // 详情图标
      if (!this.startDate1 || !this.endDate1) {
        this.$message.error('请输入时间区间')
        return
      }
      context.http.get(`cms/api/energyData/diagram`, { equirementId: this.equirementId, from: this.startDate1, to: this.endDate1 }).then(res => {
        let data = JSOG.decode(res.data)
        let dateArray = [] // 时间
        let useLevel = [] // 用量
        data.forEach(ele => {
          dateArray.push((ele.consumerTime).substring(0, 7))
          useLevel.push(ele.consumption)
        })
        if (dateArray.length === 0) {
          dateArray = ['2019.01', '2019.02', '2019.03', '2019.04', '2019.05', '2019.06', '2019.07', '2019.08', '2019.09', '2019.10', '2019.11', '2019.12']
        }
        setTimeout(() => {
          this.drawLine(dateArray, useLevel)
        }, 200)
      })
    },
    tableData2Details () { // 详情历史数据
      if (!this.startDate2 || !this.endDate2) {
        this.$message.error('请输入时间区间')
        return
      }
      context.http.get(`cms/api/energyData/equirementId`, {
        equirementId: this.equirementId,
        from: this.startDate2,
        to: this.endDate2,
        page: (this.currentPage2 - 1),
        sort: 'consumerTime,desc',
        size: this.pgSize2
      }).then(res => {
        this.tableData2 = JSOG.decode(res.data)
        this.total2 = Number(res.headers['x-total-count'])
      })
    },
    energyDataDetailCLose () {
      this.currentPage2 = 1
      this.dateInit()
    },
    handleEdit (index, row) { // 查看
      this.energyDataDetailShow = true
      this.equirementId = row.equirementId
      context.http.get(`cms/api/energyData/equirementId`, {
        equirementId: row.equirementId,
        from: this.startDate2,
        to: this.endDate2,
        page: (this.currentPage2 - 1),
        size: this.pgSize2,
        sort: 'consumerTime,desc'
      }).then(res => {
        this.tableData2 = JSOG.decode(res.data)
        this.total2 = Number(res.headers['x-total-count'])
        context.http.get(`cms/api/energyData/diagram`, { equirementId: row.equirementId, from: this.startDate1, to: this.endDate1 }).then(result => {
          let data = result.data
          let dateArray = [] // 时间
          let useLevel = [] // 用量
          data.forEach(ele => {
            dateArray.push((ele.consumerTime).substring(0, 7))
            useLevel.push(ele.consumption)
          })
          if (dateArray.length === 0) {
            dateArray = ['2019.01', '2019.02', '2019.03', '2019.04', '2019.05', '2019.06', '2019.07', '2019.08', '2019.09', '2019.10', '2019.11', '2019.12']
          }
          setTimeout(() => {
            this.drawLine(dateArray, useLevel)
          }, 200)
        })
      })
    },
    dateInit () {
      let now = new Date()
      let next = new Date()
      this.startDate1 = now.getFullYear() + '-01-01'
      this.startDate2 = now.getFullYear() + '-01-01'
      this.endDate1 = this.getCurrentMonthLastDay()
      this.endDate2 = this.getCurrentMonthLastDay()
    },
    getCurrentMonthLastDay () {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      var day = new Date(year, month, 0)
      return year + '-' + month + '-' + day.getDate()
    },
    formatupdateTime (row, column) {
      return row.updateTime.replace('T', ' ')
    },
    formatconsumerTime (row, column) {
      return row.consumerTime.substring(0, 7)
    },
    formatinstrumentType (row, column) {
      switch (row.instrumentType) {
        case 'ORDINARY_TABLE':
          return '普通表'
        case 'PUBLIC_TABLE':
          return '公共表'
        case 'SUMMARY_TABLE':
          return '总表'
      }
    },
    query () {
      context.http.get('/cms/api/energyData/list',
        {
          projectManagementId: this.projectManagementId,
          equirementTypeChildId: this.chartType,
          page: (this.currentPage - 1),
          size: this.pgSize,
          instrumentType: this.watchType,
          referred: this.tenName
        }).then(res => {
          this.tableData1 = res.data
          this.total = Number(res.headers['x-total-count'])
        })
    },
    addenergyDataFn (formName) { // 新增能源数据
      let _this = this
      console.log(this.addData)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _this = this
          context.http.post('/cms/api/energyData', this.addData).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '新增成功'
              })
              _this.selectionId = ''
              _this.selectionArr = []
              _this.query()
              _this.addenergyDataClose()
            }
          })
        }
      })
    },
    editenergyDataFn (formName) { // 编辑能源数据
      let _this = this
      console.log(this.addData)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _this = this
          context.http.put('/cms/api/energyData', this.addData).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              let row = {}
              row.equirementId = this.equirementId
              _this.handleEdit('', row)
              _this.selectionId = ''
              _this.selectionArr = []
              _this.query()
              _this.editenergyDataClose()
            }
          })
        }
      })
    },
    selectdDevic () {
      if (this.selectionId === '') {
        this.$notify.error({
          title: '错误',
          duration: 2000,
          message: '请选择设备'
        })
        return
      }
      // this.addData.equirementId = this.selectionId
      // this.addData.name = this.selectionArr.name
      this.$set(this.addData, 'equirement', this.selectionArr)
      // this.$set(this.addData, 'equirementNo', this.selectionArr.code)
      // this.addData.equirementNo = this.selectionArr.code
      this.closeChosseDevDialog()
    },
    getTemplateRow (index, row) {                                 // 获取选中数据
      this.selectionArr = row
      // console.log(this.selectionId, this.selectionArr)
    },
    querySeach () {
      this.currentPage1 = 1
      this.showChosseDevDialog()
    },
    handleChange1 (value) { // 设备类型二级联选择器
      this.equirementType = value[value.length - 1]
      console.log(this.equirementType)
    },
    showChosseDevDialog () {
      this.getEquirementTypes()
      context.http.get('cms/api/equirements', {
        page: (this.currentPage1 - 1),
        size: this.pgSize1,
        sort: 'id,desc',
        energyType: 'METER',
        projectManagementId: this.projectManagementId,
        equirementTypeChildId: this.equirementTypeChildId,
        name: this.devName,
        equirementTypeId: 25,
        instrumentType: this.instrumentType_dialog,
        code: this.devNb
      }).then(result => {
        this.tableData = JSOG.decode(result.data)
        this.total1 = Number(result.headers['x-total-count'])
        console.log(this.total1)
        this.chosseDevDialogVisible = true
      })
    },
    async getEquirementTypes () { // 请求设备大小类
      this.cascaderList = []
      let result = await context.http.get('/cms/api/equirementTypes/tree')
      this.equirementTypes = result.data
      this.equirementTypes.forEach((element, index) => {
        this.cascaderList.push({ value: element.id, label: element.name, children: [] })
        element.child.forEach(item => {
          this.cascaderList[index].children.push({ value: item.id, label: item.name })
        })
      })
    },
    addenergyDataClose () { // 关闭新增弹窗
      this.selectionId = ''
      this.addData.equirement.code = ''
      this.$refs['addData'].resetFields()
      this.addenergyDataShow = false
    },
    closeChosseDevDialog () { // 关闭选择设备弹窗
      // this.tableData = []
      this.chosseDevDialogVisible = false
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    current_change2 (currentPage) {
      this.currentPage2 = currentPage
      this.tableData2Details()
    },
    current_change1 (currentPage) {
      this.currentPage1 = currentPage
      this.showChosseDevDialog()
    },
    roterTo (name, isestate) {
      this.$router.push({ name: name, params: { projectManagementId: this.projectManagementId, equipmentType: this.chartType } })
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    bindSuccessFun () {
      // this.checkFun()
    },
    floorDataFn (n) {
      this.firstTenant = n
      console.log(n)
    },
    async getDataAuthorityOptions (searchKey) { // 项目
      let result = await context.http.get('cms/api/project-managements', { page: 0, size: 100, sort: 'desc', useStatus: 'USING' })
      this.options2 = result.data
      this.projectManagementId = this.options2[0].id
      this.getBuliding()
    },
    async getBuliding () { // 楼宇
      let result = await context.http.get('cms/api/buildings/newList?sort=sortNumber,asc&sort=id,asc', { page: 0, size: 100, useStatus: 'USING', projectId: this.projectManagementId })
      if (result.data && result.data.length) {
        this.options1 = result.data
        this.options1.unshift({ id: null, buildingName: '层平面图' })
        this.buildingName = this.options1[0].id
      }
    },
    handleClose () {
      this.dialogFromIsShow = false
    },
    async downLoadModel (index, row) {
      let url = ''
      url = '/cms/api/energy_excel/file'
      if (row) {
        url = `/cms/api/energy_excel/upload?excelId=${row.id}`
      }
      axios({ method: 'GET', url: url, responseType: 'blob' }).then(res => {
        let url = window.URL.createObjectURL(new Blob([res.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        let fileName = res.headers['content-disposition'].substring(20)
        fileName = decodeURI(fileName)
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(url)
      })
    },
    importModel (event) {
      let files = event.target.files
      let form = new FormData()
      form.append('file', files[0])
      let name = files[0].name
      let index = name.lastIndexOf('.')
      let type = name.substr(index + 1).toLowerCase()
      if (files[0].size > (1024 * 1024 * 20)) {
        this.$message({
          message: '文件大小不能超过20M',
          type: 'error'
        })
        return
      }
      if (index > 0 && type !== 'xlsx' && type !== 'xls') {
        this.$message({
          message: '格式错误，请上传xlsx、xls格式文件',
          type: 'error'
        })
      } else {
        context.http.post('/cms/api/energy_excel/file', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
          if (res.status === 200) {
            this.queryExportResult(res.data.id)
            event.target.value = ''
          }
        }).catch(error => {
          event.target.value = ''
          console.info(error)
        })
      }
    },
    queryExportResult (id) {
      const loading = this.$loading({
        lock: true,
        text: '导入中',
        spinner: 'el-icon-loading el-import-loading',
        customClass: 'loading-icon',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      context.http.get(`/cms/api/energy_excel/detail?excelId=${id}`).then(res => {
        if (res.data.excelResult === '审核中') {
          setTimeout(res => {
            this.queryExportResult(id)
          }, 5000)
        } else if (res.data.excelResult === '失败') {
          this.errorPrompt = true
          this.gridData = [{
            fileName: res.data.name,
            result: res.data.remark,
            id: res.data.id
          }]
          loading.close()
        } else {
          this.$message({
            message: '导入成功！',
            type: 'success'
          })
          loading.close()
          this.query()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
svg polygon.bind,
svg path.bind,
svg rect.bind {
  stroke-width: "2px" !important;
  stroke: "#00ff00" !important;
  fill: "rgba(0,0,0,0.2)" !important;
}
.energyDataHtml_editHtm {
  .energyDataHtml {
    display: flex;
    margin-top: 20px;
    flex-wrap: wrap;
    > .item {
    }
    .seachDeviceIcon {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url(../../../assets/seachDeviceIcon.png) no-repeat;
      position: absolute;
      right: 15px;
      top: 12px;
      cursor: pointer;
    }
  }
}
.energySystem {
  .export-error {
    display: inline-block;
    width: 90px;
    height: 26px;
    line-height: 24px;
    text-align: center;
    border: 1px solid #3577f6;
    color: #3577f6;
    border-radius: 4px;
    cursor: pointer;
  }
  .energyDataHtml {
    display: flex;
    margin-top: 20px;
    flex-wrap: wrap;
    > .item {
    }
    .seachDeviceIcon {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url(../../../assets/seachDeviceIcon.png) no-repeat;
      position: absolute;
      right: 15px;
      top: 12px;
      cursor: pointer;
    }
  }
  .chosseDevDialogVisible {
    .seachDiv {
      height: 80px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .secrchBtn {
        width: 120px;
        height: 32px;
        line-height: 32px;
        padding: 0;
      }
    }
    .table {
      margin-top: 0;
      margin-bottom: 20px;
    }
    .ctc-foot {
      padding: 0px 0 30px 20px;
    }
  }
  .query-btn {
    display: inline-block;
  }
  .menuTab {
    height: 60px;
    margin-top: 15px;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 4px 4px 4px 1px #eee;
    > span {
      position: relative;
      display: inline-block;
      width: 120px;
      text-align: center;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
      font-size: 14px;
      &.active {
        color: #3577f6;
        border-bottom: 2px solid #3577f6;
      }
      > span {
        display: block;
        position: absolute;
        top: 20px;
        right: 6px;
        min-width: 16px;
        height: 16px;
        line-height: 16px;
        padding: 0 3px;
        font-weight: normal;
        color: white;
        text-align: center;
        text-shadow: 0 1px rgba(0, 0, 0, 0.2);
        border-radius: 16px;
        background: #cb444a;
        font-size: 12px;
      }
    }
  }
}
.seachDiv {
  height: 80px;
  background-color: #ffffff;
  margin-top: 15px;
  border-radius: 5px;
  // box-shadow: 4px 4px 4px 1px #eee;
  display: flex;
  align-items: center;
  // padding-left: 20px;
  span {
    margin-right: 40px;
  }
}
.search-bar {
  .marginRights {
    float: left;
    margin-right: 10px;
    .el-input {
      width: 140px !important;
      height: 40px !important;
      input {
        height: 40px !important;
        line-height: 40px !important;
      }
    }
    .el-select {
      width: 144px !important;
    }
    > .el-dropdown {
      cursor: pointer;
    }
  }
  .morebtn {
    border-radius: 4px;
    background-color: #65ac69;
    color: #f3af2c;
    height: 32px;
    width: 100px;
    line-height: 32px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    .icon-daochu {
      display: inline-block;
      width: 16px;
      height: 16px;
      background: url(../../../assets/add.png) no-repeat;
      background-size: contain;
      vertical-align: middle;
      margin-right: 4px;
      margin-left: 6px;
    }
  }
  .morebtn1 {
    border: 1px solid #f3af2c;
    color: #f3af2c;
    height: 30px;
    width: 105px;
    margin-left: 10px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    .icon-daochu {
      display: block;
      width: 16px;
      height: 16px;
      margin-right: 4px;
      background: url(../../../assets/daochu1.png) no-repeat;
      background-size: contain;
      margin-right: 4px;
    }
    span {
      display: block;
      line-height: 30px;
    }
    .el-icon-caret-bottom {
      display: block;
      width: 16px;
      height: 30px;
      line-height: 30px;
      font-size: 18px;
      margin-left: 2px;
    }
  }
}
.content {
  min-height: 750px;
  background-color: #ffffff;
  position: relative;
  padding-bottom: 50px;

  #svgDiv {
    height: 750px;
    position: relative;
  }
  #svgDiv > span {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    display: inline-block;
  }
  .noData {
    background-color: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 150px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 5px;
  }
}
svg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
svg path:hover {
  fill: #000;
  fill-opacity: 0.1;
}
svg polygon:hover {
  fill: #000;
  fill-opacity: 0.1;
}
svg rect:hover {
  fill: #000;
  fill-opacity: 0.1;
}
.upload {
  position: relative;
  display: inline-block;
  border-radius: 2px;
  cursor: pointer;
  margin-left: 20px;
  input {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}
</style>
<style>
#projectId .el-dialog__body {
  border-bottom: none;
  padding: 25px 25px 30px !important;
}
</style>

