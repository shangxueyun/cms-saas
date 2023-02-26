<template>
  <div class="orderBillDetails">
    <drawer
      class="drawer_new"
      :show="detailsdrawershow"
      :showEditBtn="readOnly && hasAuthority('02050103')"
      @on-edit="onEdit"
      :title="drawerTitle"
      @on-hide="onHide">
      <div class="details_content drawer-body" slot="drawer">
        <div class="main_content" style="height:100%;padding:0;background-color: #F7F7F7;">
          <div class="half_page_title" style="width:100%">
            <div><i></i>基本信息</div>
          </div>
          <div class="contentItem">
            <div class="item">
              <span>大类<i class="required">*</i></span>
              <p v-if="draweDetaileData.goodsType">{{draweDetaileData.goodsType.parent.name}}</p>
            </div>

            <div class="item">
              <span>小类<i class="required">*</i></span>
              <p v-if="draweDetaileData.goodsType">{{draweDetaileData.goodsType.name}}</p>
            </div>

            <div class="item">
              <span>商品种类<i class="required">*</i></span>
              <p>{{draweDetaileData.goodsKind}}</p>
            </div>

            <div class="item">
              <span>Saas品类编码<i class="required">*</i></span>
              <p>{{draweDetaileData.goodsDepotCode}}</p>
            </div>

            <div class="item">
              <span>保质期天数<i class="required">*</i></span>
              <p v-if="readOnly">{{draweDetaileData.shelfLife}}</p>
              <el-input v-else type="number" v-model="draweDetaileData.shelfLife"  size="small">
                <template slot="suffix">天</template>
              </el-input>
              <span class="tips"
                    v-if="showshelfLife"
                    style="color: #e0434e;">请输入保质期天数</span>
            </div>

            <div class="item">
              <span>状态<i class="required">*</i></span>
              <p v-if="readOnly">{{useStatusFormat(draweDetaileData.useStatus)}}</p>
              <el-select
                v-model="draweDetaileData.useStatus"
                v-else
                style="width:100%"
                size="small">
                <el-option
                  v-for="(item,index) in statusSList"
                  :key="index"
                  :label="item.referred"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>

            <!-- <div class="item">
              <span>限制超卖<i class="required">*</i></span>
              <p v-if="readOnly">{{draweDetaileData.saleLimit ? '是' : '否'}}</p>
              <el-select
                v-model="draweDetaileData.saleLimit"
                v-else
                style="width:100%"
                size="small">
                <el-option
                  v-for="(item,index) in saleOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div> -->

            <br>
            <div class="item" style="width: 45%">
              <span>商品图片<i class="required">*</i></span>
              <el-input v-model="draweDetaileData.imgUrl" style="display:none"></el-input>
              <aliUpload
                class="aliUpload deviceDetails aliUpload_new"
                :upLoadText="upLoadText_cost"
                :fileType="fileType_cost"
                :iconShow="false"
                :fileSize="fileSize"
                :iconImg="iconImg"
                :uploadIcon="true"
                v-if="!draweDetaileData.imgUrl"
                @setAnnex="setAnnex" >
              </aliUpload>
              <div v-else
                   class="imgBox imgBoxModel"
                   style="width: 140px; height: 120px;">
                <img :src="draweDetaileData.imgUrl"
                     @click="showImg(draweDetaileData.imgUrl)"
                     class="logoImg">
                <div @click="showImg(draweDetaileData.imgUrl)"
                     class="bottomTips">预览图片</div>
                <div class="iconfont icon-cms_cuowu deleteImg"
                     v-if="!readOnly"
                     @click="deleLogo"></div>
              </div>
              <span class="tips"
                    v-if="showTips"
                    style="color: #e0434e;">请上传商品图片</span>
              <!-- <div class="tips">（建议尺寸：<i class="required">800＊800</i>像素；支持格式JPG,PNG，大不于2M）</div> -->
            </div>
            
            <div class="item-attribute">
              <span>超卖配置（勾选后该项目下此商品种类会限制库存超卖）</span>
              <el-checkbox-group v-model="draweDetaileData.saleLimitList">
                <el-checkbox :label="item.id" v-for="item in projectOptions" :key="item.id" :disabled="readOnly">{{item.referred}}</el-checkbox>
              </el-checkbox-group>
            </div>
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
export default {
  name: 'TenantGoods',
  components: {
    Drawer,
    aliUpload,
    picturePrevie
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
  created () {
    this.projectOptions = this.$store.state.projectManagementsList
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
  data () {
    return {
      showTips: false,
      readOnly: true,
      readOnlyImg: false, // 做编辑图片回显
      fileSize: 2,
      tableData: [],
      projectManagementId: '',
      value: '',
      projectOptions: [],
      drawerTitle: '商品种类详情',
      iconImg: 'icon-shangchuantupianicon',
      upLoadText_cost: '上传图片',
      fileType_cost: ['png', 'jpg'],
      imgArr: [],
      num: 0,
      showPicture: false,
      showshelfLife: false,
      statusSList: [
        { referred: '启用', value: 'USING' },
        { referred: '禁用', value: 'DISABLE' }
      ],
      saleOptions: [
        { label: '是', value: true },
        { label: '否', value: false }
      ],
      checkList: []
    }
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
    onHide () {
      this.readOnly = true
      this.showshelfLife = false
      this.showTips = false
      this.$emit('drawerClose', false)
    },
    oninput (e) {
      let value = e
      this.$nextTick((e) => {
        if (Number(value) > 0 && Number(value) && value.indexOf('.') === -1) {
          this.draweDetaileData.shelfLife = value
        } else {
          this.draweDetaileData.shelfLife = 1
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
    setAnnex (annexURL, annexName) {
      this.$set(this.draweDetaileData, 'imgUrl', annexURL)
      this.showTips = false
      this.readOnlyImg = true
    },
    deleLogo () {
      this.readOnly = false
      this.readOnlyImg = false
      this.draweDetaileData.imgUrl = ''
    },
    onEdit () {
      this.readOnly = false
    },
    save () {
      if (!this.draweDetaileData.imgUrl) {
        this.showTips = true
        return
      }
      if (this.draweDetaileData.shelfLife === '') {
        this.showshelfLife = true
        return
      }

      this.showshelfLife = false
      if (Number(this.draweDetaileData.shelfLife) > 0 && Number(this.draweDetaileData.shelfLife) && this.draweDetaileData.shelfLife.indexOf('.') === -1) {
      } else {
        this.$message.error('保质期天数必须是大于0的正整数')
        return
      }
      context.http.put('/gos/api/goods-depots', this.draweDetaileData).then(res => {
        if (res.status === 201 || res.status === 200) {
          this.$message.success('修改成功')
          this.$emit('query')
          this.onHide()
        }
      }).catch(error => {
        console.info(error)
      })
    },
    formatEntryList (list) {
      if (!list) return
      const mapa = list.map(item => {
        return this.fmList(item)
      })
      const mapb = mapa.join('、')
      return mapb
    },
    fmList (item) {
      let val = ''
      switch (item) {
        case 'traceabilityCode':
          val = '追溯码'
          break
        case 'productionNumber':
          val = '产地证明编号'
          break
        case 'production':
          val = '产地'
          break
        case 'testQuarantineNumber':
          val = '检验检疫证书编号'
          break
        case 'manufacture':
          val = '生产厂商'
          break
        case 'manufactureDate':
          val = '生产日期'
          break
        case 'qualitySafetyMonitoring':
          val = '质量安全监测'
          break
        case 'productionBatch':
          val = '生产批次'
          break
        default:
          break
      }
      return val
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
      justify-content: end;
      background-color: #fff;
      margin-bottom: 15px;
      min-height: 200px;
      overflow-y: auto;
      > .item {
        width: 30%;
        font-size: 14px;
        margin-bottom: 20px;
        margin-right: 14px;
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
