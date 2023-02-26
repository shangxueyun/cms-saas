<template>
  <div class="DetailsSet">
    <el-form>
      <div class="DetailsSetHtml">
        <div class="item">
          <span>项目简称</span>
          <p>{{detailsData.projectReferred}}</p>
        </div>
        <div class="item">
          <span>大类</span>
          <p>{{detailsData.goodsClassification.parent.name}}</p>
        </div>
        <div class="item">
          <span>小类</span>
          <p>{{detailsData.goodsClassification.name}}</p>
        </div>
        <div class="item">
          <span>食品溯源规范<i class="required">*</i></span>
          <el-select v-model="tracedStandardsItem"
                     value-key="id"
                     placeholder="食品溯源规范"
                     size="small"
                     @change="changeValue"
                     style="width:200px;margin-top:10px">
            <el-option v-for="item in tracedStandardsList"
                       :key="item.id"
                       :label="item.name"
                       :value="item">
            </el-option>
          </el-select>
        </div>
        <div class="item"
             style="width:100%">
          <span>{{tracedStandardsItem.remark}}</span>
          <p class="itemList">
            <el-checkbox v-for="(item,index) in tracedStandardsItem.tracedStandardFixeds"
                         disabled
                         :key="item.id"
                         v-model="item.onRequired">{{item.fixedName}}</el-checkbox>
          </p>
        </div>
      </div>
    </el-form>
    <div class="slotfooter"
         style="box-shadow: 0px -15px 0px 0px #f7f7f7;">
      <span @click="detailsSetClose()"
            class="details_cannelBtn">取消</span>
      <span @click="saveData()"
            class="details_submitBtn">确定</span>
    </div>
  </div>
</template>

<script>
import context from '@/service'
import * as JSOG from 'jsog'
import axios from 'axios'
export default {
  name: 'DetailsSet',
  components: {},
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    detailsData: {
      type: Object,
      default: {
        goodsClassification: { id: null, name: '', parent: { id: null, name: '', parent: null, child: [] }, child: [] },
        id: null,
        projectId: null,
        projectReferred: '',
        tracedStandard: null
      }
    }
  },
  watch: {
    detailsdrawershow: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.getTracedStandardsList()
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
      tracedStandardsItem: {},
      tracedStandardsList: [] // 食品溯源规范下拉列表

    }
  },
  methods: {
    changeValue (item) {
    },
    async getTracedStandardsList () {
      let result = await context.http.get(`gos/api/tracedStandards/list`)
      this.tracedStandardsList = result.data
      // this.tracedStandardsItem = this.tracedStandardsList[0]
      this.tracedStandardsItem = this.detailsData.tracedStandard || this.tracedStandardsList[0]
    },
    detailsSetClose () {
      this.$emit('detailsSetClose')
    },
    saveData (formName) {
      let params = {}
      params.projectId = this.detailsData.projectId
      params.goodsClassification = this.detailsData.goodsClassification
      params.tracedStandard = this.tracedStandardsItem
      console.log(params)
      context.http.post('/gos/api/tracedStandards', params).then(res => {
        if (res) {
          this.$message({
            type: 'success',
            message: '配置成功'
          })
          this.$emit('refresh')
          this.detailsSetClose()
        }
      })
    }
  }
}
</script>
<style lang="scss">
.traceabilitySet {
  .el-dialog__wrapper.el_dialog_new .el-dialog {
    background-color: #f7f7f7;
  }
}
.DetailsSet {
  .DetailsSetHtml {
    > .item {
      .itemList {
        .el-checkbox {
          min-width: 31%;
          margin-right: 10px;
          margin-bottom: 10px;
          white-space: break-spaces;
          display: flex;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.DetailsSet {
  .DetailsSetHtml {
    display: flex;
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: space-between;
    > .item {
      width: 45%;
      margin-left: 20px;
      margin-top: 15px;
      display: flex;
      flex-direction: column;
      > span {
        color: #777;
      }
      > p {
        color: #262626;
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
      }
      > .el-form-item {
        margin-top: 10px;
      }
    }
  }
}
</style>

