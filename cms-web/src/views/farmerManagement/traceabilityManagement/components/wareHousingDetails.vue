<template>
  <div class="orderBillDetails" v-if="detailsWareHouseshow">
    <drawer
      class="drawer_new"
      :show="detailsWareHouseshow"
      @on-edit="onEdit"
      :showEditBtn=" // 刷卡;已上传成功及不需要上传溯源;tenantGoods为null;均不展示编辑按钮
        readOnly &&
        uploadStatus &&
        projectManagementDate.recordType !== 'CARD_ENTER' &&
        (!!projectManagementDate.tenantGoods && !!projectManagementDate.tenantGoods.goodsDepot&& !!projectManagementDate.tenantGoods.goodsDepot.id)
      "
      :title="drawerTitle"
      @on-hide="onHide"
    >
      <!-- :showEditBtn="readOnly && hasAuthority('02050103')" -->
      <div class="details_content drawer-body" slot="drawer">
        <div
          class="main_content"
          style="height: 100%; padding: 0; background-color: #f7f7f7"
        >
          <div class="half_page_title" style="width: 100%">
            <div><i></i>基本信息</div>
          </div>
          <div class="contentItem" style="min-height: 100px">
            <div class="item">
              <span>项目简称</span>
              <p>
                {{
                  projectManagementDate.recordType !== "CARD_ENTER"
                    ? projectManagementDate.tenantGoods.projectManagementName
                    : projectManagementDate.cardRecord.projectManagementName
                }}
              </p>
            </div>
            <div class="item">
              <span>品牌名称</span>
              <!-- <p>{{ projectManagementDate.tenantGoods.tenantName }}</p> -->
              <p>
                {{
                  projectManagementDate.recordType !== "CARD_ENTER"
                    ? projectManagementDate.tenantGoods.tenantName
                    : projectManagementDate.cardRecord.tenantName
                }}
              </p>
            </div>
            <div
              class="item"
              v-if="projectManagementDate.recordType === 'CARD_ENTER'"
            >
              <span>商品编码</span>
              <p>{{ projectManagementDate.cardRecord.saasCode }}</p>
            </div>
            <div class="item">
              <span>商品名称</span>
              <!-- <p>{{ projectManagementDate.tenantGoods.name }}</p> -->
              <p>
                {{
                  projectManagementDate.recordType !== "CARD_ENTER"
                    ? projectManagementDate.tenantGoods.name
                    : projectManagementDate.cardRecord.saasName
                }}
              </p>
            </div>
            <div class="item">
              <span>采购数量</span>
              <p>
                <span v-if="projectManagementDate.recordType !== 'CARD_ENTER'">
                  {{ projectManagementDate.number }}
                </span>
                <span v-if="projectManagementDate.recordType !== 'CARD_ENTER'">
                  {{ projectManagementDate.tenantGoods.unitName }}
                </span>
                <span
                  v-else-if="projectManagementDate.recordType === 'CARD_ENTER'"
                >
                  {{ projectManagementDate.cardRecord.dealWeight }}
                </span>
              </p>
            </div>
            <div class="item">
              <span>进价</span>
              <p>
                <span v-if="projectManagementDate.recordType !== 'CARD_ENTER'"
                  >{{ wareHouseData.purchPrice }}元</span
                >
                <span v-if="projectManagementDate.recordType === 'CARD_ENTER'"
                  >{{
                    (
                      projectManagementDate.cardRecord.dealAmount /
                      projectManagementDate.cardRecord.dealWeight
                    ).toFixed(2)
                  }}元</span
                >
                <span
                  v-if="
                    wareHouseData.unitName &&
                    projectManagementDate.recordType !== 'CARD_ENTER'
                  "
                  >/{{ wareHouseData.unitName }}</span
                >
              </p>
            </div>
            <div
              class="item"
              v-show="projectManagementDate.recordType !== 'CARD_ENTER'"
            >
              <span>操作人</span>
              <p>{{ projectManagementDate.userName }}</p>
            </div>
            <div class="item">
              <span>来源</span>
              <p>
                {{ tracedFormat(projectManagementDate.recordType) }}
              </p>
            </div>
            <div
              class="item"
              v-show="projectManagementDate.recordType !== 'CARD_ENTER'"
            >
              <span>对应刷卡记录</span>
              <p>{{ wareHouseData.cardRecordNumber }}</p>
            </div>
          </div>
          <div class="half_page_title" style="width: 100%">
            <div><i></i>上传信息</div>
          </div>
          <div class="contentItem" style="min-height: 80px">
            <div class="item" style="width: 220px">
              <span>上传状态</span>
              <p>
                {{ tracedStatusFormat(projectManagementDate.tracedStatus) }}
              </p>
            </div>
            <div
              class="item"
              v-if="projectManagementDate.tracedStatus === 'FAIL'"
            >
              <span>失败原因</span>
              <p>{{ projectManagementDate.errorMsg }}</p>
            </div>
          </div>
          <!-- 刷卡溯源信息 -->
          <div v-if="projectManagementDate.recordType === 'CARD_ENTER' && projectManagementDate.cardRecord && projectManagementDate.cardRecord.id">
            <div
              class="half_page_title"
              style="width: 100%"
            >
              <!-- v-if="projectManagementDate.recordType === 'CARD_ENTER'" -->
              <div><i></i>溯源信息</div>
            </div>
            <div
              class="contentItem"
              style="min-height: 200px"
            >
              <!-- v-if="projectManagementDate.recordType === 'CARD_ENTER'" -->
              <el-form
                :rules="wareHouseRules"
                ref="editData"
                :model="wareHouseData"
              >
                <el-form-item prop="supplierName" label-width="30px">
                  <span>供应商名称</span>
                  <p :title="projectManagementDate.supplierName">
                    {{ projectManagementDate.supplierName }}
                  </p>
                </el-form-item>
                <el-form-item prop="recordDate" label-width="30%">
                  <span>入库时间</span>
                  <p>{{ recordCardDate }}</p>
                </el-form-item>
                <el-form-item prop="productionBatch" label-width="30%">
                  <span>生产批次号</span>
                  <p :title="projectManagementDate.cardRecord.batchCode">
                    {{ projectManagementDate.cardRecord.batchCode }}
                  </p>
                </el-form-item>
                <el-form-item prop="production" label-width="">
                  <span>产地</span>
                  <p :title="projectManagementDate.cardRecord.originPlaceName">
                    {{ projectManagementDate.cardRecord.originPlaceName }}
                  </p>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <!-- 除刷卡以外溯源信息 -->
          <div v-if="projectManagementDate.recordType !== 'CARD_ENTER' && projectManagementDate.tenantGoods && projectManagementDate.tenantGoods.goodsDepot && projectManagementDate.tenantGoods.goodsDepot.goodsType.id">
            <div
              class="half_page_title"
              style="width: 100%"
            >
              <!-- v-if="projectManagementDate.recordType !== 'CARD_ENTER'" -->
              <div><i></i>溯源信息</div>
            </div>
            <div
              class="contentItem"
              style="min-height: 400px"
            >
              <!-- v-if="projectManagementDate.recordType !== 'CARD_ENTER'" -->
              <el-form
                :rules="wareHouseRules"
                ref="editData"
                :model="wareHouseData"
              >
                <el-form-item
                  prop="supplierName"
                  label-width="30px"
                  v-if="show.supplierName"
                >
                  <span
                    >供应商名称<i class="required" v-if="required.supplierName"
                      >*</i
                    ></span
                  >
                  <p v-if="readOnly" :title="wareHouseData.supplierName">
                    {{ wareHouseData.supplierName }}
                  </p>
                  <el-select
                    v-model="wareHouseData.supplierId"
                    v-else
                    style="width: 100%"
                    @change="selectSupplier"
                    @focus="searchSupplier"
                    size="small"
                  >
                    <el-option
                      v-for="(item, index) in supplierData"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="supplierAddress" label-width="100%">
                  <span>供应商联系地址</span>
                  <p v-if="readOnly" :title="wareHouseData.supplierAddress">
                    {{ wareHouseData.supplierAddress }}
                  </p>
                  <el-input
                    v-else
                    size="small"
                    placeholder="请输入内容"
                    v-model="wareHouseData.supplierAddress"
                    :disabled="true"
                  >
                  </el-input>
                </el-form-item>
                <!-- </div> -->
                <!-- <div class="item"> -->
                <el-form-item prop="supplierTelphone" label-width="100%">
                  <span>供应商联系方式</span>
                  <p v-if="readOnly">{{ wareHouseData.supplierTelphone }}</p>
                  <el-input
                    v-else
                    size="small"
                    placeholder="请输入内容"
                    v-model="wareHouseData.supplierTelphone"
                    :disabled="true"
                  >
                  </el-input>
                </el-form-item>
                <!-- </div> -->
                <!-- <div class="item"> -->
                <el-form-item
                  prop="recordDate"
                  label-width="30%"
                  v-if="show.recordDate"
                >
                  <span
                    >入库时间<i class="required" v-if="required.recordDate"
                      >*</i
                    ></span
                  >
                  <p v-if="readOnly">{{ recordDate }}</p>
                  <el-date-picker
                    v-else
                    v-model="recordDate"
                    type="datetime"
                    size="small"
                    :clearable="false"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    @change="changerecordDate"
                    placeholder="选择入库时间"
                  >
                  </el-date-picker>
                </el-form-item>
                <!-- </div> -->
                <!-- <div class="item"> -->
                <el-form-item
                  prop="manufacturer"
                  label-width="30%"
                  v-if="show.manufacturer"
                >
                  <span
                    >生产厂商<i class="required" v-if="required.manufacturer"
                      >*</i
                    ></span
                  >
                  <p v-if="readOnly" :title="wareHouseData.manufacturer">
                    {{ wareHouseData.manufacturer }}
                  </p>
                  <el-input
                    v-else
                    size="small"
                    placeholder="请输入内容"
                    v-model.trim="wareHouseData.manufacturer"
                  >
                  </el-input>
                </el-form-item>
                <!-- </div> -->
                <!-- <div class="item"> -->
                <el-form-item
                  prop="manufactureDate"
                  label-width="30%"
                  v-if="show.manufactureDate"
                >
                  <span
                    >生产日期<i class="required" v-if="required.manufactureDate"
                      >*</i
                    ></span
                  >
                  <p v-if="readOnly">{{ wareHouseData.manufactureDate }}</p>
                  <el-date-picker
                    type="date"
                    v-else
                    :editable="false"
                    :clearable="false"
                    size="small"
                    value-format="yyyy-MM-dd"
                    v-model="wareHouseData.manufactureDate"
                    :picker-options="pickerBeginDayBefore"
                    placeholder="生产日期"
                    style="margin-right: 0"
                  >
                  </el-date-picker>
                    <!-- @change="changeManufactureDate" -->
                </el-form-item>
                <!-- </div> -->
                <!-- <div class="item"> -->
                <el-form-item
                  prop="productionBatch"
                  label-width="30%"
                  v-if="show.productionBatch"
                >
                  <span
                    >生产批次号<i class="required" v-if="required.productionBatch"
                      >*</i
                    ></span
                  >
                  <p v-if="readOnly" :title="wareHouseData.productionBatch">
                    {{ wareHouseData.productionBatch }}
                  </p>
                  <el-input
                    v-else
                    size="small"
                    placeholder="请输入内容"
                    v-model.trim="wareHouseData.productionBatch"
                  >
                  </el-input>
                </el-form-item>
                <!-- </div> -->
                <!-- <div class="item"> -->
                <el-form-item
                  prop="production"
                  label-width=""
                  v-if="show.productionCode"
                >
                  <span
                    >产地<i class="required" v-if="required.productionCode"
                      >*</i
                    ></span
                  >
                  <p v-if="readOnly">
                    {{ wareHouseData.production }}
                  </p>
                  <el-cascader
                    v-model="areaOptions"
                    v-else
                    :options="dataOptions"
                    placeholder="请选择产地"
                    separator=""
                    @change="addHandleItemChange"
                    @expand-change="handleItemChange"
                    ref="cascaderAddr"
                    :props="{
                      value: 'id',
                      label: 'name',
                      children: 'cities',
                    }"
                    size="small"
                  ></el-cascader>
                </el-form-item>
                <!-- </div> -->
                <!-- <div class="item"> -->
                <el-form-item
                  prop="testQuarantineNumber"
                  label-width="30%"
                  v-if="show.testQuarantineNumber"
                >
                  <span
                    >动物检疫合格证明编号<i
                      class="required"
                      v-if="required.testQuarantineNumber"
                      >*</i
                    ></span
                  >
                  <p v-if="readOnly" :title="wareHouseData.testQuarantineNumber">
                    {{ wareHouseData.testQuarantineNumber }}
                  </p>
                  <el-input
                    v-else
                    size="small"
                    placeholder="请输入内容"
                    v-model.trim="wareHouseData.testQuarantineNumber"
                  >
                  </el-input>
                </el-form-item>
                <!-- </div> -->
                <!-- <div class="item"> -->
                <el-form-item
                  prop="meatQuarantineNumber"
                  label-width="30%"
                  v-if="show.meatQuarantineNumber"
                >
                  <span
                    >肉品品质检验合格证号<i
                      class="required"
                      v-if="required.meatQuarantineNumber"
                      >*</i
                    ></span
                  >
                  <p v-if="readOnly" :title="wareHouseData.meatQuarantineNumber">
                    {{ wareHouseData.meatQuarantineNumber }}
                  </p>
                  <el-input
                    v-else
                    size="small"
                    placeholder="请输入内容"
                    v-model.trim="wareHouseData.meatQuarantineNumber"
                  >
                  </el-input>
                </el-form-item>
                <br />
                <div class="item" style="width: 100%" v-if="show.imageUrl">
                  <el-form-item prop="imageUrl">
                    <span style="width: 400px"
                      >{{ show.imageTitle
                      }}<i class="required" v-if="required.imageTitle">*</i></span
                    >
                    <br />
                    <div style="display: flex; flex-wrap: wrap; width: 700px">
                      <i
                        v-for="(item, index) in imageUrl"
                        :key="index"
                        style="display: flex; width: 150px; margin-top: 10px"
                      >
                        <div
                          class="imgBox imgBoxModel"
                          style="width: 140px; height: 120px"
                        >
                          <img
                            :src="item"
                            @click="showImg(item, index)"
                            class="logoImg"
                          />
                          <div @click="showImg(item, index)" class="bottomTips">
                            预览图片
                          </div>
                          <div
                            class="iconfont icon-cms_cuowu deleteImg"
                            v-if="!readOnly"
                            @click="deleLogo(index)"
                          ></div>
                          <!-- </div> -->
                        </div>
                        <span class="tips" v-if="showTips" style="color: #e0434e"
                          >请上传商品图片</span
                        >
                      </i>
                      <div style="margin-top: 10px">
                        <aliUpload
                          class="aliUpload deviceDetails aliUpload_new"
                          :upLoadText="upLoadText_cost"
                          :fileType="fileType_cost"
                          :iconShow="false"
                          :fileSize="fileSize"
                          :iconImg="iconImg"
                          :uploadIcon="true"
                          v-if="!readOnly"
                          @setAnnex="setAnnex"
                        >
                        </aliUpload>
                      </div>
                    </div>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" v-if="!readOnly" class="dialog-footer">
        <span @click="onHide" class="details_cannelBtn" style="background: none"
          >取消</span
        >
        <span class="saveSubmit" @click="save('editData')">保存</span>
      </div>
    </drawer>
    <picturePrevie
      v-if="showPicture"
      :imgList="imgArr"
      :num="num"
      @pictureClose="pictureClose"
    ></picturePrevie>
  </div>
</template>

<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
export default {
  name: 'wareHousingDetails',
  components: {
    Drawer,
    aliUpload,
    picturePrevie
  },
  props: {
    detailsWareHouseshow: {
      type: Boolean,
      default: false
    },
    uploadStatus: {
      type: Boolean,
      default: true
    },
    projectManagementDate: {
      type: Object,
      default: () => {
        return {}
      }
    },
    wareHouseItem: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      num: 0,
      tableData: [],
      projectManagementId: '',
      value: '',
      options1: [],
      drawerTitle: '入库详情',
      readOnly: true,
      upLoadText_cost: '上传图片',
      fileType_cost: ['png', 'jpg'],
      fileSize: 2,
      iconImg: 'icon-shangchuantupianicon',
      showTips: false,
      pickerBeginDayBefore: {
        disabledDate: time => {
          let temp = new Date().getTime() - 365 * 24 * 60 * 60 * 1000
          return time.getTime() < new Date(temp).getTime()
        }
      },
      statusSList: [],
      options: [],
      wareHouseRules: {
        supplierName: [
          { required: true, message: '请选择供应商名称', trigger: 'select' }
        ],
        recordDate: [
          { required: true, message: '请选择入库时间', trigger: 'blur' }
        ],
        manufacturer: [
          { required: true, message: '请选择生产厂商', trigger: 'blur' }
        ],
        manufactureDate: [
          { required: true, message: '请选择生产日期', trigger: 'blur' }
        ],
        productionBatch: [
          { required: true, message: '请选择生产批次号', trigger: 'blur' }
        ],
        production: [
          { required: true, message: '请选择产地', trigger: 'change' }
        ],
        testQuarantineNumber: [
          { required: true, message: '请输入动物检疫合格证明', trigger: 'blur' }
        ],
        meatQuarantineNumber: [
          { required: true, message: '请输入肉品品质检验合格证号', trigger: 'blur' }
        ],
        imageUrl: [
          { required: true, message: '请上传附件', trigger: 'blur' }
        ]
      },
      areaOptions: [],
      supplierData: {
        supplierTelphone: '',
        supplierName: '',
        supplierAddress: ''
      },
      dataId: null,
      dataOptions: [],
      editData: {},
      show: {
        supplierName: false,
        supplierAddress: true,
        supplierTelphone: true,
        recordDate: false,
        manufacturer: false,
        manufactureDate: false,
        productionBatch: false,
        productionCode: false,
        testQuarantineNumber: false,
        meatQuarantineNumber: false,
        imageUrl: false,
        imageTitle: null
      },
      required: {
        supplierName: false,
        supplierAddress: false,
        supplierTelphone: false,
        recordDate: false,
        manufacturer: false,
        manufactureDate: false,
        productionBatch: false,
        productionCode: false,
        testQuarantineNumber: false,
        meatQuarantineNumber: false,
        imageUrl: false
      },
      imageUrl: [],
      addimage: false,
      recordDate: '',
      recordCardDate: '',
      wareHouseData: {
        orderTime: ''
      },
      imgArr: [],
      showPicture: false,
      province: '', // 省
      city: '', // 市
      district: '' // 区
    }
  },
  watch: {
    detailsWareHouseshow: {
      handler (newValue, oldValue) {
        if (!newValue) {
          this.readOnly = true
          // this.$emit('changeuploadStatus')
          // this.$emit('queryInfo')
        } else if (newValue) {
          this.init()
          // this.addimage = false
          this.searchSupplier()
          // this.getDataOptions()
          this.wareHouseData = this.$store.state.wareHouseData
          if (this.projectManagementDate.recordType !== 'CARD_ENTER') {
            this.recordDate = this.wareHouseData.recordDate.replace('T', ' ')
          } else if (this.projectManagementDate.recordType === 'CARD_ENTER') {
            this.recordCardDate = this.projectManagementDate.recordDate.replace('T', ' ')
          }
          if (this.projectManagementDate.tenantGoods && this.projectManagementDate.tenantGoods.goodsDepot) {
            setTimeout(() => { this.$refs.editData.clearValidate() }, 800)
            this.filterInfo(this.wareHouseItem)
          }
          if (this.wareHouseData.imageUrl) {
            this.imageUrl = this.wareHouseData.imageUrl.split(',')
            this.imageUrl.map((item, index) => {
              if (!item) {
                this.imageUrl.splice(index, 1)
              }
            })
          } else {
            this.imageUrl = []
          }
        }
      },
      immediate: true
    }
  },
  mounted () {
  },
  methods: {
    init () {
      this.province = ''
      this.city = ''
      this.district = ''
      this.areaOptions = []
      this.addimage = false
    },
    changerecordDate (val) {
      if (val) {
        this.wareHouseData.recordDate = val.replace(' ', 'T')
      }
    },
    tracedStatusFormat (tracedStatus) {
      // SUCCESS("成功"), FAIL("失败"), NOT_UPLOAD("未上传"), NO("不需要溯源")
      if (tracedStatus === 'SUCCESS') {
        return '成功'
      } else if (tracedStatus === 'FAIL') {
        return '失败'
      } else if (tracedStatus === 'NOT_UPLOAD') {
        return '未上传'
      } else if (tracedStatus === 'NO') {
        return '不需要溯源'
      }
    },
    tracedFormat (tracedStatus) {
      switch (tracedStatus) {
        case 'PURCHASE_ENTER':
          return '自主'
        case 'CARD_ENTER':
          return '刷卡'
      }
    },
    showImg (item, index) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(item)
    },
    filterInfo (item) {
      item.map(v => {
        if (v.fixedCode === 'supplierId') {
          this.required.supplierName = v.onRequired
        }
        if (v.fixedCode === 'supplierAddress') {
          this.required.supplierAddress = v.onRequired
        }
        if (v.fixedCode === 'supplierTelphone') {
          this.required.supplierTelphone = v.onRequired
        }
        if (v.fixedCode === 'recordDate') {
          this.required.recordDate = v.onRequired
        }
        if (v.fixedCode === 'manufacturer') {
          this.required.manufacturer = v.onRequired
        }
        if (v.fixedCode === 'manufactureDate') {
          this.required.manufactureDate = v.onRequired
        }
        if (v.fixedCode === 'productionBatch') {
          this.required.productionBatch = v.onRequired
        }
        if (v.fixedCode === 'productionCode') {
          this.required.productionCode = v.onRequired
        }
        if (v.fixedCode === 'testQuarantineNumber') {
          this.required.testQuarantineNumber = v.onRequired
        }
        if (v.fixedCode === 'meatQuarantineNumber') {
          this.required.meatQuarantineNumber = v.onRequired
        }
        if (v.fixedCode === 'imageUrl') {
          this.required.imageUrl = v.onRequired
        }
      })
      this.show.supplierName = item.some(v => {
        return v.fixedCode === 'supplierId'
      })
      this.show.supplierAddress = item.some(v => {
        return v.fixedCode === 'supplierAddress'
      })
      this.show.supplierTelphone = item.some(v => {
        return v.fixedCode === 'supplierTelphone'
      })
      this.show.recordDate = item.some(v => {
        return v.fixedCode === 'recordDate'
      })
      this.show.manufacturer = item.some(v => {
        return v.fixedCode === 'manufacturer'
      })
      this.show.manufactureDate = item.some(v => {
        return v.fixedCode === 'manufactureDate'
      })
      this.show.productionBatch = item.some(v => {
        return v.fixedCode === 'productionBatch'
      })
      this.show.productionCode = item.some(v => {
        return v.fixedCode === 'productionCode'
      })
      this.show.testQuarantineNumber = item.some(v => {
        return v.fixedCode === 'testQuarantineNumber'
      })
      this.show.meatQuarantineNumber = item.some(v => {
        return v.fixedCode === 'meatQuarantineNumber'
      })
      this.show.imageUrl = item.some(v => {
        return v.fixedCode === 'imageUrl'
      })
      item.forEach(v => {
        if (v.fixedCode === 'imageUrl') {
          this.show.imageTitle = v.fixedName
        }
      })
      this.wareHouseRules = {
        supplierName: [
          { required: this.required.supplierName, message: '请选择供应商名称', trigger: 'select' }
        ],
        recordDate: [
          { required: this.required.recordDate, message: '请选择入库时间', trigger: 'blur' }
        ],
        manufacturer: [
          { required: this.required.manufacturer, message: '请选择生产厂商', trigger: 'blur' }
        ],
        manufactureDate: [
          { required: this.required.manufactureDate, message: '请选择生产日期', trigger: 'blur' }
        ],
        productionBatch: [
          { required: this.required.productionBatch, message: '请选择生产批次号', trigger: 'blur' }
        ],
        production: [
          { required: this.required.productionBatch, message: '请选择产地', trigger: 'change' }
        ],
        testQuarantineNumber: [
          { required: this.required.testQuarantineNumber, message: '请输入动物检疫合格证明', trigger: 'blur' }
        ],
        meatQuarantineNumber: [
          { required: this.required.meatQuarantineNumber, message: '请输入肉品品质检验合格证号', trigger: 'blur' }
        ],
        imageUrl: [
          { required: this.required.imageUrl, message: '请上传附件', trigger: 'blur' }
        ]
      }
    },
    onHide () {
      if (this.projectManagementDate.tenantGoods && this.projectManagementDate.tenantGoods.goodsDepot) {
        this.$refs.editData.clearValidate()
      }
      // this.getDataOptions()
      this.$emit('wareHouseClose')
    },
    pictureClose () {
      this.showPicture = false
    },
    setAnnex (annexURL, annexName) {
      this.imageUrl.push(annexURL)
      this.showTips = false
      this.addimage = true
    },
    async onEdit () {
      this.readOnly = false
      this.setAreaOptionsDefault()
    },
    async save () {
      await this.getAdress(this.areaOptions, 0)
      await this.getAdress(this.areaOptions, 1)
      await this.getAdress(this.areaOptions, 2)
      this.$refs.editData.validate((valid) => {
        if (valid) {
          if (this.addimage) {
            this.wareHouseData.imageUrl = this.imageUrl.toString()
          }
          this.wareHouseData.productionCode = this.wareHouseData.productionCode.toString()
          if (!this.wareHouseData.orderNumber) {
            this.wareHouseData.orderNumber = this.projectManagementDate.orderNumber
          }
          context.http.put('/gos/api/purchaseGoods', this.wareHouseData).then(res => {
            if (res.status === 200 || res.status === 201) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.readOnly = true
              this.$emit('wareHouseClose', false)
            }
          })
        } else {
          console.log('error save!!')
          return false
        }
      })
    },
    deleLogo (index) {
      this.imageUrl.splice(index, 1)
    },
    async searchSupplier () {
      let tenantId = this.projectManagementDate.tenantId
      if (tenantId) {
        let result = await context.http.get(`/gos/api/supplier/list/${tenantId}`)
        if (result.status === 200) {
          this.supplierData = result.data
        }
      }
    },
    selectSupplier (val) {
      let correctData = this.supplierData.filter((v, i) => {
        return v.id === val
      })
      this.wareHouseData.supplierTelphone = correctData[0].telphone
      this.wareHouseData.supplierName = correctData[0].name
      this.wareHouseData.supplierAddress = correctData[0].address
    },
    handleItemChange (val) {
      this.getDataOptions(val)
    },
    async getDataOptions (val) {
      let idArea
      let sizeArea
      if (!val) {
        idArea = null
        sizeArea = 0
      } else if (val.length === 1) {
        idArea = val[0]
        sizeArea = val.length // 3:一级 4:二级 6:三级
      } else if (val.length === 2) {
        idArea = val[1]
        sizeArea = val.length // 3:一级 4:二级 6:三级
      }
      let response = await context.http.get('/ywm/api/district-codes/parentId', { parentId: idArea })
      if (response.status === 200) {
        if (response.data) {
          let Items = response.data
          if (sizeArea === 0) { // 初始化 加载一级 省
            this.dataOptions = Items.map((value, i) => {
              return {
                id: value.id,
                name: value.name,
                cities: []
              }
            })
          } else if (sizeArea === 1) { // 点击一级 加载二级 市
            this.dataOptions.map((value, i) => {
              if (value.id === val[0]) {
                if (!value.cities.length) {
                  value.cities = Items.map((value, i) => {
                    return {
                      id: value.id,
                      name: value.name,
                      cities: []
                    }
                  })
                }
              }
            })
          } else if (sizeArea === 2) { // 点击二级 加载三级 区
            this.dataOptions.map((value, i) => {
              if (value.id === val[0]) {
                value.cities.map((value, i) => {
                  if (value.id === val[1]) {
                    if (!value.cities.length) {
                      value.cities = Items.map((value, i) => {
                        return {
                          id: value.id,
                          name: value.name
                        }
                      })
                    }
                  }
                })
              }
            })
          }
          this.$forceUpdate()
        } else {
          console.log(response.data.msg)
        }
      }
    },
    async addHandleItemChange () { // 获取productionCoded
      this.wareHouseData.productionCode = this.areaOptions.toString()
    },
    async getAdress (itemer, index) { // 获取production
      let temp
      let itemId
      if (index === 0) {
        itemId = null
      } else {
        itemId = itemer[index - 1]
      }
      let res = await context.http.get('/ywm/api/district-codes/parentId', { parentId: itemId })
      res.data.map(v => {
        if (v.id === itemer[index]) {
          if (index === 0) {
            this.province = v.name
          } else if (index === 1) {
            this.city = v.name
          } else if (index === 2) {
            this.district = v.name
          }
        }
      })
      if (this.province && this.city && this.district) {
        this.wareHouseData.production = this.province + ' ' + this.city + ' ' + this.district
      } else {
        this.wareHouseData.production = ''
      }
    },
    async setAreaOptionsDefault () { // 获取productionCode
      let temp = this.wareHouseData.productionCode.split(',').map(item => {
        return Number(item)
      })
      await this.getDataOptions()
      await this.getDataOptions([temp[0]])
      await this.getDataOptions([temp[0], temp[1]])
      this.areaOptions = temp
    }
  }
}
</script>
<style lang="scss" >
.orderBillDetails {
  .el-table::before {
    height: 0;
  }
}
</style>
<style lang="scss" scoped>
.orderBillDetails {
  .main_content {
    .contentItem {
      padding: 15px;
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      background-color: #fff;
      margin-bottom: 15px;
      min-height: 200px;
      overflow-y: auto;
      > .item {
        width: 220px;
        font-size: 14px;
        margin-left: 10px;
        margin-bottom: 20px;
        > span {
          color: #777777;
          padding-bottom: 10px;
        }
        > p {
          color: #262626;
          word-break: break-word;
        }
      }
      > .el-form {
        justify-content: flex-start !important;
        > .el-form-item {
          width: 220px !important;
          font-size: 14px;
          margin-bottom: 20px;
          margin-right: 10px;
          > .el-form-item__content {
            > span {
              color: #777777;
              padding-bottom: 10px;
              // background-color: pink;
            }
            > p {
              color: #262626;
              word-break: break-word;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .deviceDetails {
              width: 140px;
              height: 120px;
              margin-right: 0px !important;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.orderBillDetails {
  .dialog-footer {
    > span {
      display: inline-block;
      color: #777777;
      height: 34px;
      line-height: 34px;
      text-align: center;
      padding: 0 21px;
      cursor: pointer;
      background: rgba(243, 244, 250, 1);
      border-radius: 4px;
      margin-left: 10px;
      &.closeBtn {
      }
      &.saveBtn {
        border: 1px solid rgba(53, 117, 246, 1);
        color: #3575f6;
      }
      &.saveSubmit,
      &.passBtn {
        background: rgba(53, 117, 246, 1);
        color: #fff;
      }
      &.rejectBtn {
        color: #e0434e;
        background: rgba(253, 235, 237, 1);
        border: 1px solid #c1bdbd;
      }
    }
  }
  .details_content {
    width: 750px;
    height: calc(100% - 80px) !important;
  }
}
</style>
