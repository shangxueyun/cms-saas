<template>
  <div class="tenantGoods">
    <drawer class="drawer_new"
            :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="details_content drawer-body"
           slot="drawer">
        <div class="main_content"
             style="height:100%">
          <el-form :model="draweDetaileData"
                   :rules="addFlowRules"
                   ref="draweDetaileData">
            <div class="half_page_title"
                 style="width:100%">
              <div><i></i>线下商品信息</div>
            </div>
            <div class="part1">
              <el-form-item>
                <span>项目简称<i class="required">*</i></span>
                <!-- <el-select v-model="draweDetaileData.projectManagementId"
                         disabled
                         size="small"
                         style="width:100%">
                <el-option v-for="item in options1"
                           :key="item.id"
                           :label="item.referred"
                           :value="item.id">
                </el-option>
              </el-select> -->
                <el-input size="small"
                          v-model="draweDetaileData.projectManagementName"
                          disabled></el-input>
              </el-form-item>
              <el-form-item>
                <span>品牌名称<i class="required">*</i></span>
                <el-input size="small"
                          v-model="draweDetaileData.tenantName"
                          disabled></el-input>
              </el-form-item>
              <el-form-item>
                <span>大类<i class="required">*</i></span>
                <el-input v-if="draweDetaileData.goodsDepot.goodsType"
                          size="small"
                          v-model="draweDetaileData.goodsDepot.goodsType.parent.name"
                          disabled></el-input>
              </el-form-item>
              <el-form-item>
                <span>小类<i class="required">*</i></span>
                <el-input v-if="draweDetaileData.goodsDepot.goodsType"
                          size="small"
                          v-model="draweDetaileData.goodsDepot.goodsType.name"
                          disabled></el-input>
              </el-form-item>
              <el-form-item>
                <span>商品种类<i class="required">*</i></span>
                <el-input size="small"
                          v-model="draweDetaileData.goodsDepot.goodsKind"
                          disabled></el-input>
              </el-form-item>
              <el-form-item>
                <span>商品名称<i class="required">*</i></span>
                <el-input size="small"
                          v-model="draweDetaileData.name"
                          disabled></el-input>
              </el-form-item>
              <el-form-item>
                <span>自定义分类</span>
                <el-select size="small"
                           v-model="draweDetaileData.groupNumber">
                  <el-option v-for="(item,index) in groupNumberOptions"
                             :key="index"
                             :value="item.groupNumber"
                             :label="item.name"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <span>产品代码</span>
                <el-input size="small"
                          disabled
                          v-model="draweDetaileData.produceNumber" />
              </el-form-item>
              <el-form-item>
                <span>计价类型<i class="required">*</i></span>
                <el-input size="small"
                          v-model="draweDetaileData.priceTypeName"
                          disabled></el-input>
              </el-form-item>
              <el-form-item>
                <span>单位<i class="required">*</i></span>
                <el-input size="small"
                          v-model="draweDetaileData.unitName"
                          disabled></el-input>
              </el-form-item>
              <el-form-item prop="unitPrice">
                <span>单价<i class="required">*</i></span>
                <!-- <el-input size="small"
                        v-model="draweDetaileData.unitPrice"
                        @keyup="clearNoNum(value,'unitPrice')"> <template slot="append">元</template></el-input> -->
                <div class="el-input el-input--small el-input-group el-input-group--append">
                  <input type="text"
                         v-model="draweDetaileData.unitPrice"
                         @input="clearNoNum('unitPrice')"
                         class="el-input__inner">
                  <div class="el-input-group__append">元</div>
                </div>
              </el-form-item>
              <el-form-item>
                <span>是否线上出售<i class="required">*</i></span>
                <el-select v-model="draweDetaileData.onLine"
                           @change="onLineChange"
                           style="width:100%"
                           size="small">
                  <el-option label="是"
                             :value="true"></el-option>
                  <el-option label="否"
                             :value="false"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <span>是否加入平价菜<i class="required">*</i></span>
                <el-select v-model="draweDetaileData.havePar"
                           style="width:100%"
                           size="small">
                  <el-option label="是"
                             :value="true"></el-option>
                  <el-option label="否"
                             :value="false"></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item>
              <span>成本价</span>
              <div class="el-input el-input--small el-input-group el-input-group--append">
                <input type="text"
                       v-model="draweDetaileData.costPrice"
                       @input="clearNoNum('costPrice')"
                       class="el-input__inner">
                <div class="el-input-group__append">元</div>
              </div>
            </el-form-item>
            <el-form-item>
              <span>皮重</span>
              <div class="el-input el-input--small el-input-group el-input-group--append">
                <input type="text"
                       v-model="draweDetaileData.tare"
                       @input="clearNoNum('tare')"
                       class="el-input__inner">
                <div class="el-input-group__append">kg</div>
              </div>
            </el-form-item> -->
              <el-form-item></el-form-item>
              <el-form-item prop="imgUrl"
                            style="width:100%;">
                <span>商品图片<i class="required">*</i></span>
                <el-input v-model="draweDetaileData.imgUrl"
                          style="display:none"></el-input>
                <aliUpload class="aliUpload deviceDetails aliUpload_new"
                           :upLoadText="upLoadText_cost"
                           :fileType="fileType_cost"
                           :iconShow="false"
                           :fileSize="fileSize"
                           :iconImg="iconImg"
                           :uploadIcon="true"
                           v-if="!draweDetaileData.imgUrl"
                           @setAnnex="setAnnex" />
                <div v-else
                     class="imgBox imgBoxModel"
                     style="width: 140px; height: 120px;">
                  <img :src="draweDetaileData.imgUrl"
                       @click="showImg(draweDetaileData.imgUrl)"
                       class="logoImg">
                  <div @click="showImg(draweDetaileData.imgUrl)"
                       class="bottomTips">预览图片</div>
                  <div class="iconfont icon-cms_cuowu deleteImg"
                       @click="deleLogo"></div>
                </div>
                <div class="tips">（建议尺寸：<i class="required">800＊800</i>像素；支持格式JPG,PNG，大不于2M）</div>
              </el-form-item>
            </div>
            <div class="shadow"
                 v-if="draweDetaileData.onLine"></div>
            <div class="half_page_title"
                 v-if="draweDetaileData.onLine"
                 style="width:100%">
              <div><i></i>线上商品信息</div>
            </div>
            <div class="part2"
                 v-if="draweDetaileData.onLine">
              <el-form-item prop="lineName">
                <span>商品名称<i class="required">*</i></span>
                <el-input size="small"
                          v-model="draweDetaileData.lineName"></el-input>
              </el-form-item>
              <el-form-item v-if="draweDetaileData.priceTypeName === '计重'"
                            prop="specification">
                <span>规格<i class="required">*</i></span>
                <el-input v-model="draweDetaileData.specification"
                          oninput="value=value.replace(/[^\d.]/g,'')"
                          @input="specificationChange"
                          size="small">
                  <template slot="suffix">g</template>
                </el-input>
              </el-form-item>
              <el-form-item prop="price">
                <span>售价（元）<i class="required">*</i></span>
                <el-input v-model="draweDetaileData.price"
                          type="number"
                          @input="clearNoNum('price')"
                          size="small">
                  <!-- <template slot="suffix">元</template> -->
                </el-input>
              </el-form-item>
              <el-form-item>
                <span>是否限时优惠<i class="required">*</i></span>
                <el-select v-model="draweDetaileData.haveDiscount"
                           style="width:100%"
                           size="small">
                  <el-option label="是"
                             :value="true"></el-option>
                  <el-option label="否"
                             :value="false"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="discountPrice"
                            v-if="draweDetaileData.haveDiscount">
                <span>优惠价（元）<i class="required">*</i></span>
                <el-input v-model="draweDetaileData.discountPrice"
                          type="number"
                          @input="clearNoNum('discountPrice')"
                          size="small">
                  <!-- <template slot="suffix">元</template> -->
                </el-input>
              </el-form-item>
              <el-form-item v-if="draweDetaileData.priceTypeName !== '计重'||draweDetaileData.haveDiscount"></el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <span @click="onHide"
              class="details_cannelBtn"
              style="background:none">取消</span>
        <span class="saveSubmit"
              @click="save('draweDetaileData')">保存</span>
      </div>
    </drawer>
    <picturePrevie v-if="showPicture"
                   :imgList="imgArr"
                   :num="num"
                   @pictureClose="pictureClose"></picturePrevie>
  </div>
</template>

<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
import aliUpload from '@/components/aliUpload.vue'
import picturePrevie from '@/components/picturePrevie.vue'
import axios from 'axios'
import * as JSOG from 'jsog'
let price, DiscountPrice
export default {
  name: 'TenantGoods',
  components: {
    Drawer,
    picturePrevie,
    aliUpload
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    draweDetaileData: {
      type: Object,
      default: {
        goodsDepot: {

        }
      }
    }
  },
  created () {
    this.options1 = this.$store.state.projectManagementsList
  },
  watch: {
    detailsdrawershow: {
      handler (newValue, oldValue) {
        if (newValue) {
          price = this.draweDetaileData.price
          DiscountPrice = this.draweDetaileData.discountPrice
          this.getGoodsGroup(this.draweDetaileData.tenantId)
          // 重置
          this.uploadImgSwi = false
        }
      },
      deep: true,
      immediate: true
    },
    draweDetaileData: {
      handler (newValue, oldValue) {
        price = newValue.price
        DiscountPrice = newValue.discountPrice
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    var checkDiscount = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入优惠价'))
      } else if (price < value || Number(price) === Number(value)) {
        return callback(new Error('优惠价必须大于等于0且小于售价！'))
      } else {
        callback()
      }
    }
    var checkPrice = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请填写售价'))
      } else if (value < DiscountPrice || Number(value) === Number(DiscountPrice)) {
        return callback(new Error('优惠价必须大于等于0且小于售价！'))
      } else {
        callback()
      }
    }
    return {
      groupNumberOptions: [], // 自定义分类
      projectManagementId: '',
      value: '',
      fileSize: 2,
      showPicture: false,
      imgArr: [],
      num: 0,
      uploadImgSwi: false,
      iconImg: 'icon-shangchuantupianicon',
      upLoadText_cost: '上传图片',
      fileType_cost: ['png', 'jpg'],
      options1: [],
      addFlowRules: {
        imgUrl: [
          { required: true, message: '请上传商品图片', trigger: 'blur' }
        ],
        unitPrice: [
          { required: true, message: '请填写单价', trigger: 'blur' }
        ],
        lineName: [
          { required: true, message: '请填写商品名称', trigger: 'blur' }
        ],
        specification: [
          { required: true, message: '请填写规格', trigger: 'blur' }
        ],
        price: [
          { required: true, validator: checkPrice, trigger: 'blur' }
        ],
        discountPrice: [
          { required: true, validator: checkDiscount, trigger: 'blur' }
        ]
      },
      drawerTitle: '编辑客户商品'
    }
  },
  mounted () {

  },
  methods: {
    specificationChange () { // 改变规格
      this.draweDetaileData.price = (this.draweDetaileData.unitPrice / 1000 * this.draweDetaileData.specification).toFixed(2)
    },
    onLineChange (online) {
      if (online) {
        if (this.draweDetaileData.priceTypeName === '计重') {
          this.draweDetaileData.lineName = this.draweDetaileData.name
        } else {
          this.draweDetaileData.lineName = this.draweDetaileData.name
          this.draweDetaileData.price = this.draweDetaileData.unitPrice
        }
      }
    },
    async getGoodsGroup (tenantId) { // 自定义分类下拉
      let result = await context.http.get(`gos/api/goodsGroup/list?tenantId=${tenantId}`)
      this.groupNumberOptions = result.data
    },
    clearNoNum (key) {
      this.$nextTick(() => {
        let obj = this.draweDetaileData[key]
        obj = obj.replace(/[^\d.]/g, '')  // 清除“数字”和“.”以外的字符
        obj = obj.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        obj = obj.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        // eslint-disable-next-line no-useless-escape
        obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')// 只能输入两个小数
        if (obj.indexOf('.') < 0 && obj !== '') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          obj = parseFloat(obj)
        }
        this.draweDetaileData[key] = obj
      })

      // this.value = obj
    },
    save (fromName) {
      this.$refs[fromName].validate((valid) => {
        if (valid) {
          context.http.put(`gos/api/tenant-goods`, this.draweDetaileData).then(res => {
            if (res) {
              this.$message.success('保存成功')
              this.$emit('edit')
              this.onHide()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    pictureClose () {
      this.showPicture = false
    },
    showImg (url) {
      this.imgArr = []
      this.showPicture = true
      this.imgArr.push(url)
    },
    deleLogo () {
      this.uploadImgSwi = true
      this.draweDetaileData.imgUrl = ''
    },
    setAnnex (annexURL, annexName) {
      this.draweDetaileData.goodsDepot.imgUrl = annexURL
      this.draweDetaileData.imgUrl = annexURL
      this.uploadImgSwi = false
      // this.$set(this.draweDetaileData.goodsDepot, 'imgUrl', annexURL)
    },
    tabChange (n) {
      this.tab = n
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onHide () {
      this.$emit('drawerClose', false)
      this.$refs['draweDetaileData'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.tenantGoods {
  .main_content {
    padding: 0px !important;
    .shadow {
      width: 100%;
      height: 15px;
      background-color: #f7f7f7;
    }
  }
}
</style>
<style lang="scss">
.tenantGoods {
  .el-input__prefix,
  .el-input__suffix {
    top: 5px;
  }
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
      .part1,
      .part2 {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 0 20px;
        .el-form-item {
          width: 30%;
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
  }
}
</style>
