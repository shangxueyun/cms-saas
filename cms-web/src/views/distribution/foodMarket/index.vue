
<template>
  <div class="foodMarket">
    <span class="page_head_title">菜场管理</span>
    <div class="pl-content">
      <ul class="default_tab_block">
        <li class="active"
            v-if="hasAuthority('02050701')">
          <span>菜场配置</span>
        </li>
        <li @click="changeTab('deliveryman')"
            v-if="hasAuthority('02050705')">
          <span>配送员管理</span>
        </li>
        <!-- <li @click="changeTab('productConfig')"
            v-if="hasAuthority('02050108')">
          <span>平价菜管理</span>
        </li> -->
      </ul>
      <div class="search-bar">
        <div>
          <!-- <el-select v-model="seachParam.projectManagementId"
                     clearable
                     placeholder="项目简称">
            <el-option v-for="item in options1"
                       :key="item.id"
                       :label="item.referred"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-input placeholder="线上菜场名称"
                    v-model="seachParam.name"
                    style="width:200px"></el-input>
          <span class="query-btn"
                @click="queryRules">查询</span> -->
        </div>
        <div v-if="hasAuthority('02050702')">
          <el-button class="tban tban1"
                     @click="addGoodsOpen"><i class="iconfont icon-crm_xinzeng-"></i> 新增菜场</el-button>
        </div>
      </div>
      <div class="plc-table">
        <el-table :data="tableData"
                  style="width: 100%"
                  ref="multipleTable">
          <el-table-column prop="referred"
                           label="项目简称"
                           align="center" />
          <!-- <el-table-column prop="name"
                           label="线上菜场名称"
                           align="center" /> -->
          <el-table-column prop="lastModifiedDate"
                           :formatter="lastModifiedDateFormat"
                           label="最后配置时间"
                           align="center" />
          <el-table-column width="200px"
                           v-if="hasAuthority('02050703')"
                           label="操作"
                           align="left">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.$index, scope.row)"
                         class="el-button--primary operation-btn"
                         size="mini">
                查看
              </el-button>
              <!-- <span class="psScope"
                    @click="setMap(scope.$index, scope.row)">配送范围</span> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="total > 0"
           class="ctc-foot1">
        <span>
          <span style="margin-right:10px">{{currentPage}}/{{totalPages}}页</span> 共{{total}}条记录
        </span>
        <el-pagination background
                       layout="prev, pager, next"
                       :page-size=pgSize
                       :total="total"
                       :current-page="currentPage"
                       @current-change="current_change" />

        <div class="pagingnum">
          显示
          <select v-model="pgSize"
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
    <!-- 新增 -->
    <el-dialog title="新增菜场"
               :visible.sync="addGoodsDialogVisible"
               class="addGoodsDialog el_dialog_new "
               width="900px"
               @close="addGoodsDialogClose"
               :close-on-click-modal="false">
      <div class="dialog_content">
        <el-form :model="addData"
                 :rules="addFlowRules"
                 ref="addData">
          <div class="half_page_title"
               style="width:100%;margin-top:15px">
            <div><i></i>基本信息</div>
          </div>
          <div class="content content2">
            <el-form-item prop="projectManagementId">
              <span>项目简称<i class="required">*</i></span>
              <el-select v-model="addData.projectManagementId"
                         size="small"
                         style="width:100%"
                         placeholder="项目简称">
                <el-option v-for="item in options1"
                           :key="item.id"
                           :label="item.referred"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <span>追溯云账号</span>
              <el-input v-model="addData.tracedUserName"
                        maxlength="20"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item>
              <span>追溯云密码</span>
              <el-input v-model="addData.tracedPassWord"
                        maxlength="20"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item>
              <span>开通线上售卖</span>
              <el-select v-model="addData.onLineSell"
                         size="small"
                         style="width:100%">
                <el-option label="是"
                           :value="true"></el-option>
                <el-option label="否"
                           :value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width:100%">
              <span>智慧称锁屏图片</span>
              <div style="display:flex;flex-wrap: wrap;">
                <template v-if="addData.lockScreenPicture.length">
                  <div v-for="(item,index) in addData.lockScreenPicture"
                       :key="index"
                       style="width:140px;height:120px;margin-bottom:15px"
                       class="imgBox imgBoxModel">
                    <img :src="item"
                         style="object-fit: cover;"
                         @click="showImg(item)"
                         class="logoImg">
                    <div @click="showImg(item)"
                         class="bottomTips">预览图片</div>
                    <div class="iconfont icon-cms_cuowu deleteImg"
                         @click="deleLogo(index)"></div>
                  </div>
                </template>

                <aliUpload class="aliUpload deviceDetails aliUpload_new"
                           style="width:140px;height:120px"
                           :upLoadText="upLoadText_cost"
                           :fileType="fileType_cost"
                           :iconShow="false"
                           :iconImg="iconImg"
                           :uploadIcon="true"
                           v-if="addData.lockScreenPicture.length<5"
                           @setAnnex="setAnnex" />
              </div>
              <div class="tips">（最多可上传5张，建议尺寸：1366*768像素；支持格式JPG,PNG）</div>
            </el-form-item>
          </div>
          <div class="half_page_title"
               v-if="addData.onLineSell"
               style="width:100%;margin-top:15px">
            <div><i></i>配送配置</div>
          </div>
          <div class="content content2"
               v-if="addData.onLineSell">
            <el-form-item prop="name">
              <span>线上菜场名称<i class="required">*</i></span>
              <el-input v-model="addData.name"
                        maxlength="20"
                        size="small"></el-input>
            </el-form-item>
            <!-- <el-form-item prop="splitAccount">
              <span>分账接受账号<i class="required">*</i></span>
              <el-input v-model="addData.splitAccount"
                        type="number"
                        maxlength="20"
                        size="small"></el-input>
            </el-form-item> -->
            <el-form-item prop="distributionFee">
              <span>配送费(元)<i class="required">*</i></span>
              <el-input v-model="addData.distributionFee"
                        @input="clearNoNum('distributionFee')"
                        style="width:100%"
                        :min="0"
                        :controls="false"
                        size="small">
              </el-input>
            </el-form-item>
            <el-form-item prop="maxOrderNumber">
              <span>每半小时最多接单数量（单）<i class="required">*</i></span>
              <el-input type="number"
                        onkeyup="value=value.replace(/[^0-9]/g,'')"
                        onpaste="value=value.replace(/[^0-9]/g,'')"
                        oncontextmenu="value=value.replace(/[^0-9]/g,'')"
                        v-model="addData.maxOrderNumber"
                        size="small">
                <!-- <template slot="suffix">单</template> -->
              </el-input>
            </el-form-item>
            <el-form-item prop="startEndTime">
              <span>配送起止时间<i class="required">*</i></span>
              <div style="display: flex; align-items: center;justify-content: space-between;">
                <el-time-select v-model="addData.startTime"
                                style="width:130px"
                                :picker-options="{
                                  start: '00:00',
                                  step: '00:30',
                                  end: '24:00'
                                }"
                                size="small"
                                placeholder="选择时间">
                </el-time-select>
                <span> - </span>
                <el-time-select v-model="addData.endTime"
                                style="width:130px"
                                :picker-options="{
                                  start: '00:00',
                                  step: '00:30',
                                  end: '24:00'
                                }"
                                size="small"
                                placeholder="选择时间">
                </el-time-select>
              </div>
            </el-form-item>
            <el-form-item prop="customerServiceTelphone">
              <span>客服电话<i class="required">*</i></span>
              <el-input v-model="addData.customerServiceTelphone"
                        size="small"></el-input>
            </el-form-item>
            <el-form-item prop="autoCancelTime">
              <span>自动取消订单时间（分钟）<i class="required">*</i></span>
              <el-input type="number"
                        v-model="addData.autoCancelTime"
                        onkeyup="value=value.replace(/[^0-9]/g,'')"
                        onpaste="value=value.replace(/[^0-9]/g,'')"
                        oncontextmenu="value=value.replace(/[^0-9]/g,'')"
                        size="small">
                <!-- <template slot="suffix">分钟</template> -->
              </el-input>
            </el-form-item>
            <el-form-item prop="startGiveFee">
              <span>起送费(元)<i class="required">*</i></span>
              <el-input v-model="addData.startGiveFee"
                        @input="clearNoNum('startGiveFee')"
                        style="width:100%"
                        :min="0"
                        :controls="false"
                        size="small">
              </el-input>
            </el-form-item>
            <el-form-item style="margin-bottom:0">
              <span>限时优惠起止时间</span>
              <div style="display: flex; align-items: center;justify-content: space-between;">
                <el-time-select v-model="addData.discountStartTime"
                                style="width:130px"
                                :picker-options="{
                                  start: '00:00',
                                  step: '00:30',
                                  end: '24:00'
                                }"
                                size="small"
                                placeholder="选择时间">
                </el-time-select>
                <span> - </span>
                <el-time-select v-model="addData.discountEndTime"
                                style="width:130px"
                                :picker-options="{
                                  start: '00:00',
                                  step: '00:30',
                                  end: '24:00'
                                }"
                                size="small"
                                placeholder="选择时间">
                </el-time-select>
              </div>
            </el-form-item>
            <el-form-item></el-form-item>
          </div>
        </el-form>
        <div class="half_page_title"
             v-if="addData.onLineSell"
             style="width:100%;margin-top:15px">
          <div><i></i>配送范围</div>
          <span class="addWeixiu"
                @click="addAddressVisible=true"
                style="color: #00b362;cursor: pointer;font-weight: normal;font-size: 14px;">
            <i class="iconfont icon-crm_xinzeng-"></i>
            <a style="text-decoration: underline;">添加小区</a>
          </span>
        </div>
        <div class="addAddressContent"
             v-if="addData.onLineSell">
          <p style="font-size: 14px; color: #777777;">配送小区<i class="required">*</i></p>
          <div class="addressList">
            <el-tag v-for="(item,index) in addData.marketDistributionScopes"
                    :key="item.poiaddress"
                    @close="delAddress(item,index)"
                    closable>
              {{item.poiname}}
            </el-tag>
          </div>
        </div>
      </div>
      <div slot="footer"
           class="slotfooter">
        <span @click="addGoodsDialogClose"
              class="details_cannelBtn">取消</span>
        <span class="details_submitBtn"
              @click="addgoods()">确定</span>
      </div>
    </el-dialog>

    <!-- 新增小区 -->
    <el-dialog title=""
               :visible.sync="addAddressVisible"
               class="addGoodsDialog el_dialog_new "
               width="1000px"
               @close="addaddAddressClose"
               :close-on-click-modal="false">
      <div class="dialog_content"
           style="height: 800px;">
        <iframe id="mapPage"
                width="100%"
                height="100%"
                frameborder=0
                src="https://mapapi.qq.com/web/mapComponents/locationPicker/v/index.html?search=1&type=1&key=HKVBZ-QFR6U-TDJVR-2D3VV-VLDP6-6LFKS&referer=%E5%B0%8F%E8%B1%A1%E5%95%86%E7%AE%A1">
        </iframe>
      </div>
      <!-- <div slot="footer"
           class="slotfooter">
        <span @click="addaddAddressClose"
              class="details_cannelBtn">取消</span>
        <span class="details_submitBtn"
              @click="addgoods()">确定</span>
      </div> -->
    </el-dialog>
    <!-- 地图 -->
    <el-dialog title="配送范围"
               :visible.sync="mapDialogShow"
               class="addGoodsDialog el_dialog_new mapDialog"
               width="1200px"
               @close="mapDialogClose"
               :close-on-click-modal="false">
      <div class="dialog_content"
           style="position: relative;">
        <div id="container"></div>
        <div class="editBtn"
             v-if="hasAuthority('02050704')">
          <span class="edit"
                @click="edit">编辑配送范围</span>
          <span class="save"
                @click="save">保存配送范围</span>
        </div>
      </div>
      <div slot="footer"
           class="slotfooter">
        <span @click="mapDialogClose"
              class="details_cannelBtn">取消</span>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <foodMarketDetails :detailsdrawershow="detailsShow"
                       ref="foodMarketDetails"
                       :draweDetaileData="detaileData"
                       @showAddAddress="showAddAddress"
                       @drawerClose="drawerClose" />
    <!-- 图片预览 -->
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>
<script>
import context from '@/service'
import AMap from 'AMap'
import moment from 'moment'
import foodMarketDetails from './foodMarketDetails'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
export default {
  name: 'foodMarket',
  components: {
    foodMarketDetails,
    aliUpload,
    picturePrevie
  },
  data () {
    var startEndTime = (rule, value, callback) => {
      if (!this.addData.startTime || !this.addData.endTime) {
        return callback(new Error('请选择配送开始结束时间'))
      } else {
        callback()
      }
    }
    var startGiveFee = (rule, value, callback) => {
      if (this.addData.startGiveFee === '') {
        return callback(new Error('请输入起送费'))
      } else if (this.addData.startGiveFee === 0) {
        return callback(new Error('起送费必须大于0'))
      } else {
        callback()
      }
    }
    var discountStartEndTime = (rule, value, callback) => {
      if (!this.addData.discountStartTime || !this.addData.discountEndTime) {
        return callback(new Error('请选择限时优惠起止时间'))
      } else {
        callback()
      }
    }
    var checkPhone = (rule, value, callback) => {
      let regPone = null
      let mobile = /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/ // 最新16手机正则
      let tel = /^((0\d{2,3}-\d{4,8})|(1[3584]\d{9}))$/ // 座机
      if (value !== null && value.charAt(0) === '0') { // charAt查找第一个字符方法，用来判断输入的是座机还是手机号
        regPone = tel
      } else if (value !== null && value.charAt(0) !== '0') {
        regPone = mobile
      }
      if (regPone === null) {
        return callback(
          new Error('请输入电话')
        )
      } else if (!regPone.test(value)) {
        return callback(
          new Error("输入正确的电话格式,座机格式'区号-座机号码'")
        )
      } else {
        callback()
      }
    }
    return {
      iconImg: 'icon-shangchuantupianicon',
      upLoadText_cost: '上传图片',
      fileType_cost: ['png', 'jpg'],
      showPicture: false,
      imgArr: [],
      num: 0,
      addAddressVisible: false,
      editor: {},
      polygonArray: [],
      mapDialogShow: false,
      addData: {
        tracedUserName: '',
        tracedPassWord: '',
        lockScreenPicture: [],
        onLineSell: false,
        startTime: '',
        endTime: '',
        projectManagementId: '',
        name: '', //
        splitAccount: '', // 分账接收账号
        distributionStartTime: '', // 配送起时间
        distributionEndTime: '', // 配送止时间
        discountStartTime: '', // 限时优惠时间
        discountEndTime: '',
        maxOrderNumber: '', // 每半小时最多接单数量
        distributionFee: '', // 配送费
        startGiveFee: '', // 起送费
        customerServiceTelphone: '', // 客服电话
        autoCancelTime: '', // 自动取消订单时间
        marketDistributionScopes: [ // 范围描述
        ]
      },
      addFlowRules: {
        projectManagementId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入线上菜场名称', trigger: 'blur' }
        ],
        // splitAccount: [
        //   { required: true, message: '请输入分账接受账号', trigger: 'blur' }
        // ],
        startEndTime: [
          { validator: startEndTime, trigger: 'change' }
        ],
        discountStartEndTime: [
          { validator: discountStartEndTime, trigger: 'change' }
        ],
        maxOrderNumber: [
          { required: true, message: '请输入半小时最多接单数量', trigger: 'blur' }
        ],
        distributionFee: [
          { required: true, message: '请输入配送费', trigger: 'blur' }
        ],
        startGiveFee: [
          { required: true, validator: startGiveFee, trigger: 'blur' }
        ],
        customerServiceTelphone: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ],
        autoCancelTime: [
          { required: true, message: '请输入自动取消订单时间', trigger: 'blur' }
        ]
      },
      seachParam: {
        projectManagementId: '',
        name: ''
      },
      detailsShow: false,
      readonly: false,
      addGoodsDialogVisible: false,
      tableData: [],
      currentPage: 1,
      totalPages: 1,
      pgNum: 1,
      total: 0,
      pgSize: 15,
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
      detaileData: {
        orderTime: '',
        lockScreenPicture: []
      }
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
    let projectManagementId = this.$route.params.projectManagementId
    this.seachParam.projectManagementId = projectManagementId || ''
    this.query()
  },
  mounted () {
    let _this = this
    window.addEventListener('message', function (event) {
      // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
      var loc = event.data
      if (loc && loc.module === 'locationPicker') { // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
        // console.log('location', loc)
        let obj = {
          lat: loc.latlng.lat,
          lng: loc.latlng.lng,
          poiaddress: loc.poiaddress,
          poiname: loc.poiname
        }
        let flag
        if (_this.detailsShow) {
          flag = _this.detaileData.marketDistributionScopes.some((item, index) => {
            return item.poiname === obj.poiname
          })
        } else {
          flag = _this.addData.marketDistributionScopes.some((item, index) => {
            return item.poiname === obj.poiname
          })
        }
        if (flag) {
          _this.$message.error('该小区已经添加')
          return
        }
        _this.addAddressVisible = false
        _this.addData.marketDistributionScopes.push(obj)
        if (_this.detailsShow) { // 详情页编辑新增小区地址
          _this.detaileData.marketDistributionScopes.push(obj)
        }
      }
    }, false)
  },
  watch: {
    addGoodsDialogVisible: {
      handler: function (newVal, oldVal) {
        if (newVal) {

        }
      }
    }
  },
  methods: {
    deleLogo (index) {
      this.addData.lockScreenPicture.splice(index, 1)
    },
    setAnnex (annexURL, annexName) {
      this.addData.lockScreenPicture.push(annexURL)
    },
    delPreviewImage () {
      this.projectDetail.previewImage = ''
    },
    showImg (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    pictureClose () {
      this.showPicture = false
    },
    cheackSame (name, key) { // 检查是否有相同小区
      this[key].marketDistributionScopes.some((item, index) => {
        return item.poiname === name
      })
    },
    showAddAddress () {
      this.addAddressVisible = true
    },
    delAddress (item, index) {
      this.addData.marketDistributionScopes.splice(index, 1)
    },
    addaddAddressClose () {
      this.addAddressVisible = false
    },
    clearNoNum (key) {
      this.$nextTick(() => {
        let obj = this.addData[key]
        obj = obj.replace(/[^\d.]/g, '')  // 清除“数字”和“.”以外的字符
        obj = obj.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        obj = obj.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        // eslint-disable-next-line no-useless-escape
        obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')// 只能输入两个小数
        if (obj.indexOf('.') < 0 && obj !== '') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          obj = parseFloat(obj)
        }
        this.addData[key] = obj
      })

      // this.value = obj
    },
    handleEdit (index, row) {
      context.http.get(`ord/api/marketConfigs/${row.id}`).then(res => {
        if (res) {
          this.detaileData = res.data
          this.detailsShow = true
        }
      })
    },
    mapDialogClose () {
      this.polygonArray = []
      this.mapDialogShow = false
    },
    setMap (index, row) {
      context.http.get(`ord/api/marketConfigs/${row.id}`).then(res => {
        if (res) {
          this.mapDialogShow = true
          this.$nextTick(() => {
            // let center = [this.center.lng, this.center.lat]
            let center = [res.data.lng, res.data.lat]
            let map = new AMap.Map('container', {
              zoom: 16.8, // 初始化地图层级
              center: center // 初始化地图中心点
            })
            this.markCenter(map)
            this.editor = { _polygonEditor: {}, _polygon: {} }
            if (!res.data.marketDistributionScopes.length) { // 默认范围
              this.polygonArray.push([(center[0] - 0.005), (center[1] + 0.005)])
              this.polygonArray.push([(center[0] + 0.005), (center[1] + 0.005)])
              this.polygonArray.push([(center[0] + 0.005), (center[1] - 0.005)])
              this.polygonArray.push([(center[0] - 0.005), (center[1] - 0.005)])
            } else {
              this.polygonArray = res.data.marketDistributionScopes.map((item, index) => {
                let arr = [item.lng, item.lat]
                return arr
              })
            }
            console.log(this.polygonArray, center)
            this.editor._polygon = new AMap.Polygon({
              map: map,
              path: this.polygonArray,
              strokeColor: '#0000ff',
              strokeOpacity: 1,
              strokeWeight: 3,
              fillColor: '#f5deb3',
              fillOpacity: 0.35
            })
            map.setFitView()
            this.editor._polygonEditor = new AMap.PolyEditor(map, this.editor._polygon)
            AMap.event.addListener(this.editor._polygonEditor, 'end', obj => {
              let scopes = obj.target.w.path.map((item, index) => {
                let a = [item.lng, item.lat]
                return a
              })
              console.log(obj, scopes)
              res.data.marketDistributionScopes = scopes.map((item, index) => {
                return { lng: item[0], lat: item[1] }
              })
              let params = res.data
              console.log(params)
              context.http.put(`ord/api/marketConfigs`, params).then(result => {
                if (result) {
                  this.queryRules()
                  this.$message.success('保存成功')
                  this.mapDialogClose()
                }
              })
              // ---------------------
              // if (this.distributionScopes) {
              //   this.businessDistrictService.updateDistributionScope(this.businessDistrict.id, scopes).subscribe(res => {
              //     this.router.navigate(['../online-malls'])
              //   })
              // }
            })
          })
        }
      })
    },
    edit () {
      this.editor._polygonEditor.open()
    },
    save () {
      this.editor._polygonEditor.close()
    },
    markCenter (map) { // 设置中心点
      const marker = new AMap.Marker({
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        position: map.center
      })
      marker.setMap(map)
    },
    addgoods () {
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          let params = {}
          if (this.addData.onLineSell) {
            let curTime = moment().format('YYYY-MM-DD')
            this.addData.distributionStartTime = curTime + 'T' + this.addData.startTime + ':00.000Z'
            this.addData.distributionEndTime = curTime + 'T' + this.addData.endTime + ':00.000Z'
            let isAfter = moment(this.addData.distributionEndTime).isAfter(this.addData.distributionStartTime, 'minute')
            if (!isAfter) {
              this.$message.error('配送结束时间必须大于开始时间')
              return
            }
            // 优惠时间
            let s = curTime + 'T' + this.addData.discountStartTime + ':00.000Z'
            let e = curTime + 'T' + this.addData.discountEndTime + ':00.000Z'
            let isAfter1 = moment(e).isAfter(s, 'minute')
            if (this.addData.discountStartTime && !this.addData.discountEndTime || !this.addData.discountStartTime && this.addData.discountEndTime) {
              this.$message.error('请选择完整优惠起止时间')
              return
            }
            if (this.addData.discountStartTime && this.addData.discountEndTime && !isAfter1) {
              this.$message.error('限时优惠结束时间必须大于限时优惠开始时间')
              return
            }
            if (!this.addData.marketDistributionScopes.length) {
              this.$message.error('请选择配送小区')
              return
            }
            params = this.addData
          } else {
            params.projectManagementId = this.addData.projectManagementId
            params.tracedUserName = this.addData.tracedUserName
            params.tracedPassWord = this.addData.tracedPassWord
            params.lockScreenPicture = this.addData.lockScreenPicture
            params.onLineSell = this.addData.onLineSell
          }
          context.http.post(`ord/api/marketConfigs`, params).then(res => {
            if (res) {
              this.$message.success('新增成功')
              this.addGoodsDialogClose()
              this.queryRules()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async query () {
      let result = await context.http.get('ord/api/marketConfigs', {
        page: (this.currentPage - 1),
        size: this.pgSize,
        name: this.seachParam.name,
        projectManagementId: this.seachParam.projectManagementId
      })
      this.tableData = result.data
      this.total = Number(result.headers['x-total-count'])
      this.totalPages = Math.ceil(this.total / this.pgSize)
    },
    lastModifiedDateFormat (row, column) {
      let time = moment(row.lastConfigTime).format('YYYY-MM-DD HH:mm:ss')
      return time
    },
    drawerClose () {
      this.query()
      this.detailsShow = false
    },
    addGoodsDialogClose () {
      this.addData.lockScreenPicture = []
      this.$refs['addData'].resetFields()
      this.addGoodsDialogVisible = false
    },
    addGoodsOpen () {
      this.addData.tracedUserName = ''
      this.addData.tracedPassWord = ''
      this.addData.onLineSell = false
      this.addData.marketDistributionScopes = []
      this.addGoodsDialogVisible = true
    },
    changeTab (type) {
      this.$router.push({
        name: type,
        params: { projectManagementId: this.seachParam.projectManagementId }
      })
    },
    queryRules () {
      this.currentPage = 1
      this.pgSize = 15
      this.query()
    },
    current_change (currentPage) {
      this.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.currentPage = 1
      this.query()
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    }
  }
}
</script>
<style lang="scss">
.foodMarket {
  .el-input-number .el-input__inner {
    text-align: left;
  }
  .deviceDetails {
    width: 140px;
    height: 120px;
    margin-right: 0px !important;
    .oss_file {
      width: 100%;
      height: 100%;
      border: none;
      background-color: #eaeaea;
      border: 1px solid rgba(234, 234, 234, 1);
      border-radius: 4px;
      color: #3575f6;
      > i {
        font-size: 32px;
        position: absolute;
        top: 8px;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
      }
      > span {
        position: absolute;
        top: 40px;
        left: 0px;
      }
    }
  }
  .el-dialog__wrapper {
    &.addGoodsDialog {
      .el-dialog {
        .el-dialog__header {
          margin-bottom: 0px;
        }
        .el-dialog__body {
          background-color: #faf7fa;
          .steps {
            height: 60px;
            padding: 0 15px;
            border-top: 1px solid #f6f6f6;
            background-color: #ffffff;
            margin-bottom: 15px;
          }
          .dialog_content {
            background-color: #ffffff;
            margin-top: 0px;
            .checkbox-group {
              width: 100%;
              .el-checkbox {
                width: 20%;
                margin-top: 10px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.foodMarket {
  .addAddressContent {
    padding: 12px 20px;
    > p {
      margin-bottom: 10px;
    }
    .addressList {
      min-height: 50px;
      .el-tag {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }
  .editBtn {
    position: absolute;
    right: 5px;
    bottom: 0;
    > span {
      display: inline-block;
      height: 28px;
      line-height: 28px;
      background-color: #0d9bf2;
      color: #fff;
      border: 0;
      outline: none;
      padding-left: 5px;
      padding-right: 5px;
      border-radius: 3px;
      margin-bottom: 4px;
      cursor: pointer;
    }
  }
  #container {
    width: 100%;
    height: 500px;
  }
  .psScope {
    display: inline-block;
    width: 56px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border: 1px solid #f3af2c;
    border-radius: 3px;
    color: #f3af2c;
    cursor: pointer;
    &:hover {
      background: #f3af2c;
      color: #fff;
    }
  }
  .addGoodsDialog {
    .slotfooter {
      .save {
        margin-right: 12px;
        height: 32px;
        line-height: 32px;
        color: #3577f6;
        border: 1px solid #3577f6;
        background: rgba(53, 119, 246, 0.05);
      }
    }
    .el-form {
      padding: 0 !important;
      .content {
        padding: 15px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 100%;
        .el-form-item {
          width: 32%;
          .el-form-item__content {
            > span {
              margin-bottom: 5px;
              display: inline-block;
              height: 25px;
              display: -ms-flexbox;
              display: flex;
              -ms-flex-align: center;
              align-items: center;
              font-size: 14px;
              color: #777777;
            }
            > p {
              color: #666666;
              font-size: 12px;
              height: 40px;
              line-height: 40px;
            }
            .tips {
              font-size: 12px;
              color: #999999;
              margin-top: 10px;
            }
            // .imgBox {
            //   width: 140px;
            //   height: 120px;
            //   position: relative;
            //   background: rgba(255, 255, 255, 1);
            //   border: 1px solid rgba(234, 234, 234, 1);
            //   border-radius: 4px;
            //   > .bottomTips {
            //     height: 25px;
            //     position: absolute;
            //     left: 0px;
            //     bottom: 0px;
            //     width: 140px;
            //     background-color: #fdffff;
            //     display: flex;
            //     align-items: center;
            //     font-size: 12px;
            //     justify-content: space-between;
            //     padding: 0 5px;
            //     > span {
            //       display: inline-block;
            //       width: 60%;
            //       overflow: hidden;
            //       text-overflow: ellipsis;
            //       white-space: nowrap;
            //       padding: 0 5px;
            //     }
            //     > i {
            //       cursor: pointer;
            //     }
            //   }
            // }
          }
        }
      }
    }
  }
  .plc-table {
    .onlineBtn {
      display: inline-block;
      width: 56px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border: 1px solid rgba(68, 175, 105, 1);
      border-radius: 3px;
      color: #44af69;
      cursor: pointer;
    }
    .offlineBtn {
      display: inline-block;
      width: 56px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border: 1px solid #eb605b;
      border-radius: 3px;
      color: #eb605b;
      cursor: pointer;
    }
  }
  .plc-search {
    min-height: 70px;
    line-height: 0;
    background-color: #fff;
    margin: 20px 0;
    padding-left: 18px;
    padding-right: 18px;
    box-shadow: 1px 2px 5px #eee;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -ms-flex-pack: justify;
    justify-content: space-between;
    align-items: center;
    position: relative;
    > div {
      > div {
        margin-right: 15px;
      }
    }
  }
  .typeTab {
    height: 60px;
    line-height: 60px;
    background-color: #ffffff;
    margin-top: 15px;
    box-shadow: 4px 4px 4px 1px #eee;
    > span {
      display: inline-block;
      width: 120px;
      text-align: center;
      cursor: pointer;
      &.active {
        color: #3175d2;
        border-bottom: 2px solid #3175d2;
      }
    }
  }
}
</style>
<style lang="less">
.foodMarket .el-input__suffix {
  line-height: 32px;
}
</style>
