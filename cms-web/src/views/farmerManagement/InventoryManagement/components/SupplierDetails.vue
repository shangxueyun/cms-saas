<template>
  <div class="SupplierDetails">
    <drawer class="drawer_new"
            :show="detailsdrawershow"
            :showEditBtn="readOnly && hasAuthority('02050403')"
            @on-edit="onEdit"
            title="供应商详情"
            @on-hide="onHide">
      <div class="details_content drawer-body"
           slot="drawer">
        <div class="main_content"
             style="height:100%;padding:0;background-color: #F7F7F7;">
          <div class="half_page_title"
               style="width:100%">
            <div><i></i>基本信息</div>
          </div>
          <div class="contentItem">
            <el-form :model="draweDetaileData"
                     :rules="addFlowRules"
                     style="padding-top: 0"
                     ref="addData">
              <div class="item">
                <span>项目简称</span>
                <p>{{draweDetaileData.projectName}}</p>
              </div>
              <div class="item">
                <span>品牌名称</span>
                <p>{{draweDetaileData.tenantName}}</p>
              </div>
              <div class="item">
                <span>供应商名称</span>
                <p>{{draweDetaileData.name}}</p>
              </div>
              <!-- <div class="item"> -->
              <el-form-item prop="contacts">
                <span>联系人<i class="required">*</i></span>
                <p v-if="readOnly">{{draweDetaileData.contacts}}</p>
                <el-input v-else
                          v-model.trim="draweDetaileData.contacts"
                          placeholder="联系人"></el-input>
              </el-form-item>
              <!-- </div> -->
              <!-- <div class="item"> -->
              <el-form-item prop="telphone">
                <span>联系电话<i class="required">*</i></span>
                <p v-if="readOnly">{{draweDetaileData.telphone}}</p>
                <el-input v-else
                          v-model.trim="draweDetaileData.telphone"
                          placeholder="联系电话"></el-input>
              </el-form-item>
              <!-- </div> -->
              <!-- <div class="item"> -->
              <el-form-item prop="address">
                <span>联系地址<i class="required">*</i></span>
                <p v-if="readOnly">{{draweDetaileData.address}}</p>
                <el-input v-else
                          v-model.trim="draweDetaileData.address"
                          placeholder="联系地址"></el-input>
              </el-form-item>
              <!-- </div> -->
              <el-form-item prop="supplierType">
                <span>节点类型<i class="required">*</i></span>
                <p v-if="readOnly">{{supplierTypeFormat(draweDetaileData.supplierType)}}</p>
                <el-select v-model="draweDetaileData.supplierType"
                           v-else
                           style="width:100%"
                           size="small">
                  <el-option v-for="(item,index) in supplierTypeList"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <div class="item">
                <span>状态<i class="required">*</i></span>
                <p v-if="readOnly">{{useStatusFormat(draweDetaileData.useStatus)}}</p>
                <el-select v-model="draweDetaileData.useStatus"
                           v-else
                           style="width:100%"
                           size="small">
                  <el-option v-for="(item,index) in statusSList"
                             :key="index"
                             :label="item.referred"
                             :value="item.value"></el-option>
                </el-select>
              </div>
              <div class="item"></div>
            </el-form>
          </div>
          <div class="half_page_title"
               style="width:100%">
            <div><i></i>企业信息</div>
          </div>
          <div class="contentItem">
            <div class="item">
              <span>统一社会信用代码</span>
              <p v-if="readOnly">{{draweDetaileData.creditCode}}</p>
              <el-input v-else
                        v-model="draweDetaileData.creditCode"
                        placeholder="统一社会信用代码"></el-input>
            </div>
            <div class="item">
              <span>企业名称</span>
              <p v-if="readOnly">{{draweDetaileData.companyName}}</p>
              <el-input v-else
                        v-model="draweDetaileData.companyName"
                        placeholder="企业名称"></el-input>
            </div>
            <div class="item">
              <span>公司地址</span>
              <p v-if="readOnly">{{draweDetaileData.companyAddress}}</p>
              <el-input v-else
                        v-model="draweDetaileData.companyAddress"
                        placeholder="公司地址"></el-input>
            </div>
            <div class="item">
              <span>法人名字</span>
              <p v-if="readOnly">{{draweDetaileData.operName}}</p>
              <el-input v-else
                        v-model="draweDetaileData.operName"
                        placeholder="法人名字"></el-input>
            </div>
            <div class="item">
              <span>法人身份证</span>
              <p v-if="readOnly">{{draweDetaileData.iDNumber}}</p>
              <el-input v-else
                        v-model="draweDetaileData.iDNumber"
                        placeholder="法人身份证"></el-input>
            </div>
            <div class="item"></div>
          </div>
        </div>
      </div>
      <div slot="footer"
           v-if="!readOnly"
           class="dialog-footer">
        <span @click="onHide"
              class="details_cannelBtn"
              style="background:none">取消</span>
        <span class="saveSubmit"
              @click="save()">保存</span>
      </div>
    </drawer>
  </div>
</template>

<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import axios from 'axios'
import * as JSOG from 'jsog'
export default {
  name: 'SupplierDetails',
  components: {
    Drawer
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    draweDetaileData: {
      type: Object,
      default: {

      }
    }
  },
  data () {
    return {
      supplierTypeList: [
        { label: '屠宰场', value: 'SLAUGHTERHOUSE' },
        { label: '批发市场', value: 'WHOLESALE_MARKET' },
        { label: '标准化菜市场', value: 'STANDARDIZATION_FOOD' },
        { label: '标准化超市', value: 'SUPERMARKET_STORE' },
        { label: '配送中心', value: 'Distribution_Centre' },
        { label: '加工企业', value: 'PROCESSING_ENTERPRISES' },
        { label: '种植企业', value: 'PLANTING_ENTERPRISES' },
        { label: '团体采购', value: 'CATERING_GROUPS' },
        { label: '大卖场', value: 'HYPERMARKET' },
        { label: '养殖企业', value: 'BREEDING_ENTERPRISES' },
        { label: '餐饮企业', value: 'CATERING_ENTERPRISES' },
        { label: '其他', value: 'OTHER' }
      ],
      showTips: false,
      readOnly: true,
      fileSize: 2,
      tableData: [],
      projectManagementId: '',
      value: '',
      options1: [],
      iconImg: 'icon-shangchuantupianicon',
      upLoadText_cost: '上传图片',
      fileType_cost: ['png', 'jpg'],
      imgArr: [],
      num: 0,
      showPicture: false,
      statusSList: [
        { referred: '启用', value: 'USING' },
        { referred: '禁用', value: 'DISABLE' }
      ],
      checkList: [],
      addFlowRules: {
        contacts: [
          { required: true, message: '请输入联系人', trigger: 'change' }
        ],
        supplierType: [
          { required: true, message: '请选择节点类型', trigger: 'change' }
        ],
        telphone: [
          { required: true, pattern: /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/, message: '请输入联系电话', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入联系地址', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    detailsdrawershow: {
      handler (newValue, oldValue) {
        if (newValue) {

        }
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
  },
  mounted () {

  },
  methods: {
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    useStatusFormat (val) {
      return val === 'USING' ? '使用中' : '已停用'
    },
    supplierTypeFormat (val) {
      switch (val) {
        case 'SLAUGHTERHOUSE':
          return '屠宰场'
        case 'WHOLESALE_MARKET':
          return '批发市场'
        case 'STANDARDIZATION_FOOD':
          return '标准化菜市场'
        case 'SUPERMARKET_STORE':
          return '标准化超市'
        case 'Distribution_Centre':
          return '配送中心'
        case 'PROCESSING_ENTERPRISES':
          return '加工企业'
        case 'PLANTING_ENTERPRISES':
          return '种植企业'
        case 'CATERING_GROUPS':
          return '团体采购'
        case 'HYPERMARKET':
          return '大卖场'
        case 'BREEDING_ENTERPRISES':
          return '养殖企业'
        case 'CATERING_ENTERPRISES':
          return '餐饮企业'
        case 'OTHER':
          return '其他'
      }
    },
    onHide () {
      this.readOnly = true
      this.showTips = false
      this.$refs['addData'].resetFields()
      this.$emit('drawerClose', false)
    },
    pictureClose () {
      this.showPicture = false
    },
    showImg (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    setAnnex (annexURL, annexName) {
      this.$set(this.draweDetaileData, 'imgUrl', annexURL)
      this.showTips = false
    },
    deleLogo () {
      this.draweDetaileData.imgUrl = ''
    },
    onEdit () {
      this.readOnly = false
    },
    save () {
      this.$refs['addData'].validate((valid) => {
        if (valid) {
          context.http.put('/gos/api/supplier', this.draweDetaileData).then(res => {
            if (res.status === 201 || res.status === 200) {
              this.$message.success('修改成功')
              this.$emit('query')
              this.onHide()
            }
          }).catch(error => {
            console.info(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" >
.SupplierDetails {
  .el-table::before {
    height: 0;
  }
}
</style>
<style lang="scss" scoped>
.SupplierDetails {
  .main_content {
    .contentItem {
      padding: 15px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      background-color: #fff;
      margin-bottom: 15px;
      min-height: 200px;
      overflow-y: auto;
      .el-form {
        width: 100%;
      }
      .item {
        width: 31%;
        font-size: 14px;
        margin-bottom: 20px;
        > span {
          display: inline-block;
          color: #777777;
          margin-bottom: 10px;
        }
        > p {
          color: #262626;
          word-break: break-word;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.SupplierDetails {
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
    .el-form {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .el-form-item {
        width: 31%;
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
            color: #262626;
            font-size: 14px;
            height: 40px;
            line-height: 40px;
          }
          .tips {
            font-size: 12px;
            color: #999999;
            margin-top: 10px;
          }
        }
        .deviceDetails {
          width: 140px;
          height: 120px;
          margin-right: 0px !important;
        }
      }
    }
  }
  .item-attribute {
    width: 100%;
    margin-bottom: 20px;
    p {
      margin: 10px 0;
    }
    .el-checkbox {
      margin-top: 8px;
      width: 20%;
    }
  }
}
</style>
