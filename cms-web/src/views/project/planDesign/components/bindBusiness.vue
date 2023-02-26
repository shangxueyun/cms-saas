<template>
  <div class="tenant-details bindTenant">
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div style="width: 500px;background:#fff;margin-top:10px;padding-bottom:20px;"
           class="tenant-details details-content bindStore"
           slot="drawer">
        <div class="bussiness-type">
          <el-radio v-model="bussinessType" @change="industry('业态')"
                              label="SHOP">商铺</el-radio>
          <el-radio v-model="bussinessType" @change="industry('行业')"
                              label="WORK">办公</el-radio>
          <el-radio v-model="bussinessType" @change="industry('菜场业态')"
                              label="MARKET">菜场</el-radio>
        </div>
        <div class="ctc-table details_table" style="border:none">
          <el-table :data="tableData"
                    ref="multipleTable">
            <el-table-column label=""
                             width="65">
              <template slot-scope="scope">
                <el-radio :label="scope.row.id"
                          v-model="templateRadio"
                          @change.native="getTemplateRow(scope.$index,scope.row)">&nbsp</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="value"
                             label="业态"
                             align="center"></el-table-column>
            <el-table-column prop="teantName"
                             label="业态颜色"
                             align="center">
              <template slot-scope="scope">
                <div>
                  <span class="colorBox"
                        :style="{backgroundColor:scope.row.description}"></span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="onHide"
                   class="close-button" style="background:#fff!important;border:0">关闭</el-button>
        <el-button type="primary"
                   @click="bindFun" style="margin-left:0;width:90px!important"
                   class="defaultbtn dialog-confirmBtn">确 定</el-button>
      </div>
    </drawer>
  </div>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
export default {
  components: {
    Drawer
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    defaultScale: {
    },
    bindParams: {
      type: Object,
      default: {
        id: '', // 平面图id
        svgId: '', // svgId
        roomId: '', // 房源id
        tenantId: '', // 客户id
        file: '' // svg文件
      }
    },
    pevDocmentObj: {
      type: Object,
      default: {
        target: null,
        style: null
      }
    }
  },
  created () {
  },
  mounted () {
  },
  data () {
    return {
      drawerTitle: '关联业态',
      querySearch: '',
      tableData: [],
      pager: {
        currentPage: 1,
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
        ]
      },
      templateColor: '',
      templateRadio: '',
      newShopNbTxt: '',
      bussinessType: 'SHOP'
    }
  },
  computed: {
  },
  watch: {
    detailsdrawershow: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.bussinessType = 'SHOP'
          this.industry('业态')
        }
      }
    }
  },
  methods: {
    async industry (name) {
      let result = await context.http.get(`/uaa/api/paramet-managements/name?name=${name}`)
      this.tableData = result.data
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onHide () {
      this.templateRadio = null
      this.$emit('drawerClose', false)
    },
    bindFun () { // 参数判断是否是创建完直接绑定
      if (this.pevDocmentObj.target) { // 绑定前    去掉默认样式
        $(this.pevDocmentObj.target).attr(this.pevDocmentObj.style)
      }
      if (this.templateRadio === '' || !this.templateRadio) {
        this.$message.error('请选择关联业态')
        return
      }
      $(this.pevDocmentObj.target).attr({
        'fill': this.templateColor
      })
      // $(this.pevDocmentObj.target).attr('fill', this.templateColor)  //绑定区域颜色不提交给服务器改为动态渲染
      $('#svgHtml svg').css('transform', `scale(${this.defaultScale})`)
      let myFile = new File([$('#svgHtml').html()], 'test.svg', { type: 'image/svg+xml' })
      this.bindParams.file = myFile
      this.bindParams.tenantId = this.templateRadio
      let form = new FormData()
      form.append('file', myFile)
      form.append('id', this.bindParams.id)
      form.append('industryId', this.bindParams.tenantId)
      form.append('svgId', this.bindParams.svgId)
      context.http.post('cms/api/plan/binding', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '绑定成功',
            type: 'success'
          })
          this.$emit('drawerClose', false)
          this.$emit('bindBindBusinessSuccess', res.data)
        }
      }).catch(error => {
        $(this.pevDocmentObj.target).attr(this.pevDocmentObj.style)
        console.info(error)
      })
    },
    getTemplateRow (index, row) {
      this.templateRadio = row.id
      // this.newShopNbTxt = row.referred
      this.templateColor = row.description
    }
  }
}
</script>
<style lang="scss">
.bindTenant .page {
  display: flex;
  justify-content: space-between;
}
.bindTenant .dialog-footer {
  margin-top: -70px;
}
.bindTenant{
  .drawer-head{
    background: #ffffff;
    padding:15px 20px;
    margin:0;
    .dweditbtn{
      right:20px;
      top:16px;
    }
  }
  .wrap{
    min-height: calc(100% - 65px);
    background: #F7F7F7;
  }
  .dialog-footer {
    height:65px;
    background: #fff;
    text-align: right;
    margin:0;
    height:65px;
    width:100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right:20px;
    button{
      display: block;
    }
  }
} 
</style>
<style lang="scss" scoped>
.colorBox {
  display: inline-block;
  width: 50px;
  height: 8px;
  border-radius: 5px;
}
.addDevicDialog {
  .headTab {
    height: 60px;
    line-height: 60px;
    box-shadow: 0px 1px 5px #eeeeee;
    > span {
      display: inline-block;
      width: 120px;
      text-align: center;
      cursor: pointer;
      &.active {
        color: #3175f6ff;
        border-bottom: 2px solid #3175f6ff;
      }
    }
  }
  .part {
    border: 1px solid #eeeeee;
    min-height: 200px;
    margin: 20px 0;
    .title {
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding-left: 15px;
      background-color: #fafafaff;
      margin-bottom: 20px;
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 30%;
        margin-left: 20px;
        .el-form-item__content {
          > span {
            margin-bottom: 5px;
            display: inline-block;
          }
          .el-textarea__inner {
            resize: none !important;
          }
        }
      }
    }
  }
}
.bindStore {
  padding: 0 30px;
  box-sizing: border-box;
  .tower {
    margin-top: 15px;
  }
  .bindType {
    height: 60px;
    line-height: 60px;
    margin: 0 30px;
    box-shadow: 0px 1px 1px #eeeeee;
    padding-left: 15px;
    > span {
      display: inline-block;
      width: 140px;
      text-align: center;
      cursor: pointer;
      &.active {
        color: #3175f6ff;
        border-bottom: 2px solid #3175f6ff;
      }
    }
  }
  .bindName {
    margin: 15px 0;
  }
  .addDevice {
    width: 120px;
    height: 40px;
    background-color: #49af61ff;
    color: #ffffff;
    display: flex;
    align-items: center;
    position: relative;
    top: -56px;
    right: -720px;
    justify-content: center;
    border-radius: 5px;
    cursor: pointer;
    .addIcon {
      display: inline-block;
      width: 26px;
      height: 27px;
      background: url(../../../../assets/add.png) no-repeat;
    }
  }
  .deviceList {
    min-height: 200px;
    .seachDiv {
      display: flex;
      > div {
        margin-right: 15px;
        .caption {
          display: inline-block;
          margin-bottom: 5px;
        }
      }
      .seachBtn {
        display: inline-block;
        width: 120px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background-color: #3175f6ff;
        color: #fff;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 22px;
      }
    }
    .binded {
      color: #f00;
    }
  }
}
.details-content {
  display: block !important;
  margin-top: 0px;
}
.addHourse {
  .upload {
    position: relative;
    .uploadbtn {
      display: inline-block;
      width: 66px;
      height: 24px;
      line-height: 20px;
      text-align: center;
      border: 1px solid #5e72e4;
      border-radius: 4px;
      color: #5e72e4;
      margin-top: 14px;
      cursor: pointer;
      font-size: 12px;
    }
    input {
      position: absolute;
      top: 15px;
      left: 0;
      width: 66px;
      height: 24px;
      opacity: 0;
      cursor: pointer;
    }
  }
  .bl-picture {
    width: 66px;
    height: 66px;
    display: inline-block;
    margin-right: 10px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .icon-shanchu {
      position: absolute;
      top: -9px;
      right: -10px;
      color: #ccc;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      line-height: 18px;
      text-align: center;
      font-size: 16px;
      z-index: 1;
      background-size: contain;
      border: 1px solid #dadadd;
      cursor: pointer;
      background: url(../../../../assets/closed.png) no-repeat;
      background-size: contain;
    }
  }
  .condition-content {
    .el-checkbox-group {
      margin: 0 auto;
    }
    .el-input {
      margin: 0 10px;
      width: 270px;
    }
    .el-checkbox {
      display: block;
      margin-bottom: 10px;
    }
    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }
  }
  .el-form-item {
    margin-bottom: 20px !important;
  }
}
ul,
li {
  list-style: none;
}
.hourse_search .el-input .el-input__inner {
  width: 180px;
  height: 32px;
  line-height: 32px;
  position: absolute;
  left: 0;
  top: 0;
}
.houring {
  font-size: 16px;
  background-color: #f9f9f9;
  .menu {
    height: 62px;
    line-height: 62px;
    border-bottom: 1px solid #eeeeee;
    margin-top: 15px;
    background-color: #ffffff;
    // padding-left: 20px;
    span {
      display: inline-block;
      width: 200px;
      height: 62px;
      text-align: center;
      cursor: pointer;
      font-size: 14px;
      &.active {
        border-bottom: 3px solid #3577f6;
        color: #3577f6;
      }
    }
  }
  .hourse_container {
    background-color: #f9f9f9;
    .hourse_search {
      background-color: #fff;
      margin: 20px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      .search-top {
        border-bottom: 1px solid #ecedef;
        padding-bottom: 18px;
        padding-left: 18px;
        .el-input {
          width: 180px;
          height: 32px;
          display: block;
          margin-top: 18px;
        }
        div {
          float: left;
          display: inline-block;
        }
        div {
          cursor: pointer;
        }
      }
      .search-bottom {
        padding-left: 18px;
        padding: 20px 18px 20px;
        dl {
          display: flex;
          font-size: 12px;
          line-height: 18px;
          dt {
            color: #333333;
          }
          dd {
            display: flex;
            color: #666;
            margin-right: 16px;
            span {
              display: block;
              &:first-child {
                margin-right: 5px;
              }
              &:last-child {
                font-size: 18px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
    .hourse_statistical {
      background-color: #fff;
      margin: 15px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      .statistical_top {
        padding: 15px 30px;
        font-size: 15px;
        color: #747474;
        line-height: 15px;
        border-bottom: 1px solid #ecedef;
      }
      .statistical_bot {
        padding: 32px 30px 40px;
        display: flex;
        li {
          list-style: none;
          padding-right: 45px;
          padding-left: 20px;
          height: 45px;
          border-right: 2px solid #ecedef;
          &:first-child {
            padding-left: 0;
          }
          &:last-child {
            border-right: 0;
          }
          &:nth-child(3) {
            border-right: 0;
            margin-right: 115px;
          }
          p {
            color: #adadad;
            font-size: 14px;
            line-height: 14px;
            margin-top: -8px;
            &:last-child {
              color: #333;
              font-size: 20px;
              margin-top: 30px;
            }
          }
        }
      }
    }
    .hourse_tab {
      height: 60px;
      display: flex;
      background-color: #fff;
      margin: 10px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      justify-content: space-between;
      align-items: center;
      padding-right: 44px;
      border-bottom: 1px solid #ecedef;
      .nav {
        display: flex;
        li {
          width: 160px;
          text-align: center;
          font-size: 14px;
          color: #666;
          height: 58px;
          line-height: 58px;
          border-bottom: 2px solid #fff;
          cursor: pointer;
          &.select_active {
            border-bottom: 2px solid #3175d2;
            color: #3175d2;
            font-weight: bolder;
          }
        }
      }
    }
    .hourse-table {
      background-color: #fff;
      margin: 10px 0 0px 0;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      .page {
        background-color: #ffffff;
        display: flex;
        justify-content: space-between;
        padding: 60px 30px 30px 30px;
        .el-pagination.is-background .el-pager li:not(.disabled).active {
          background-color: #2f3f48;
          color: #fff;
        }
        .el-pagination.is-background .el-pager li:not(.disabled):hover {
          color: #999;
        }
        .pagingnum {
          font-size: 14px;
          text-align: center;
          color: #777;
          select {
            width: 70px;
            height: 28px;
            border-radius: 2px;
          }
        }
      }
    }
  }
  .addHourse {
    .el-dialog {
      width: 700px;
      margin-top: 8vh !important;
    }
    .basicInfo {
      border: 1px solid #f1f1f1;
      margin: 15px 0;
      h5 {
        height: 40px;
        background: #fafafa;
        line-height: 40px;
        padding: 0 15px;
        font-size: 14px;
        color: #666666;
      }
      .basic-content {
        display: flex;
        justify-content: space-between;
        padding: 15px;
        .basic-item {
          width: 46%;
          p {
            font-size: 14px;
            color: #333;
            line-height: 14px;
            margin-bottom: 15px;
          }
          .basic-select {
            position: relative;
            cursor: pointer;
            .selectInput {
              height: 110px;
              border: 1px solid #e7e7e7;
              border-radius: 5px;
              padding: 0 15px;
              &.selectActive {
                border: 1px solid #6473cb;
              }
              img {
                float: left;
                display: block;
                width: 150px;
                height: 80px;
                margin-right: 10px;
                margin-top: 15px;
              }
              span {
                float: left;
                color: #666666;
                display: block;
                line-height: 110px;
                &.over-hiden {
                  width: 180px;
                  white-space: nowrap;
                  word-break: break-all;
                  text-overflow: ellipsis;
                  overflow: hidden;
                }
                &:last-child {
                  float: right;
                  color: #6473cb;
                }
              }
            }
            .selectBox {
              width: 100%;
              border: 1px solid #e7e7e7;
              border-radius: 3px;
              background: #fff;
              position: absolute;
              left: 0;
              top: 115px;
              z-index: 9;
              padding: 15px 0px;
              box-shadow: 1px 2px 5px #ddd;
              height: 210px;
              overflow-y: auto;
              li {
                border-bottom: 1px solid #e7e7e7;
                padding: 10px 15px;
                display: flex;
                &:hover {
                  background: #eee;
                }
                img {
                  display: block;
                  width: 50px;
                  height: 21.3px;
                  margin-right: 20px;
                }
                span {
                  display: block;
                  line-height: 20px;
                  font-size: 14px;
                }
              }
            }
          }
        }
      }
    }
    .associatedInfo {
      border: 1px solid #f1f1f1;
      margin: 15px 0;
      h5 {
        height: 40px;
        background: #fafafa;
        line-height: 40px;
        padding: 0 15px;
        font-size: 14px;
        color: #666666;
      }
      .form {
        padding: 10px 0px 10px 15px;
        .el-form-item {
          width: 385px;
          margin-right: 30px;
          margin-bottom: 10px;
          display: inline-block;
          &:nth-child(4),
          &:nth-child(5),
          &:nth-child(6),
          &:nth-child(7),
          &:nth-child(8),
          &:nth-child(9) {
            // width:415px;
          }
          .el-form-item__content {
            line-height: 30px;
            margin-left: 146px !important;
          }
          .el-form-item__label {
            width: 140px !important;
          }
          .el-select {
            width: 100%;
          }
          .form-box {
            display: flex;
            justify-content: flex-start;
            .el-input {
              width: 300px;
            }
            .el-select {
              width: 100px;
              .el-input {
                width: 100px;
              }
            }
          }
        }
        .addLabel {
          border: 1px solid #dcdfe6;
          padding: 10px;
          border-radius: 4px;
          input {
            width: 100px;
            height: 25px;
            display: block;
            float: left;
          }
          p {
            float: left;
            margin-right: 15px;
            margin-bottom: 20px;
            height: 25px;
            padding: 0 0px 0 6px;
            background: #3577f6;
            color: #fff;
            line-height: 25px;
            display: flex;
            border-radius: 4px;
            span {
              display: block;
              font-size: 12px;
              &:last-child {
                width: 25px;
                height: 25px;
                text-align: center;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
}
@keyframes cloud-in {
  0% {
    padding-right: 0;
  }
  100% {
    padding-right: 350px;
  }
}
@keyframes cloud-in2 {
  0% {
    padding-right: 350px;
  }
  100% {
    padding-right: 0;
  }
}
.paddingLeft {
  animation: cloud-in 0.2s 0s ease-out forwards;
}
.paddingRight {
  animation: cloud-in2 0.2s 0s ease-out forwards;
}
.creatStore {
  width: 110px;
  height: 40px;
  display: inline-block;
  color: #3577F6;
  border: 1px solid #3577F6;
  border-radius: 5px;
  line-height: 40px;
  text-align: center;
  position: absolute;
  top: 8px;
  right: 25px;
  cursor: pointer;
}
.tips {
  padding-left: 35px;
  margin-top: 15px;
  font-size: 10px;
  span {
    &:first-child {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #f00;
    }
  }
}
.binded {
  color: #f00;
}
.tenant-details {
  width: 900px;
  .main-content {
    padding: 0 30px;
  }
}
.tower {
  span {
    display: inline-block;
    width: 165px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border: 1px solid #cecece;
    cursor: pointer;
    &.active {
      color: #ffffff;
      background-color: #3175f6;
    }
  }
}
.floor {
  display: flex;
  align-items: center;
  margin-top: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #cecece;
  .floorName {
    width: 10%;
    font-size: 18px;
    font-weight: 600;
  }
  .floorDtl {
    span {
      display: inline-block;
      width: 90px;
      height: 90px;
      text-align: center;
      border: 1px solid #cecece;
      border-radius: 5px;
      margin-right: 20px;
      margin-bottom: 20px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      .innerContent {
        width: 100%;
        height: 100%;
        i {
          font-style: normal;
          display: inline-block;
          width: 100%;
          height: 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &:first-child {
            margin-top: 20px;
          }
        }
      }
      &.active {
        border: 1px solid #3175f6;
        .iconCheack {
          display: inline-block;
          width: 40px;
          height: 40px;
          background: url(../../../../assets/iconCheack.png) no-repeat;
          position: absolute;
          right: 0;
          bottom: 0;
        }
      }
    }
  }
}
.ctc-foot {
  padding-left: 0;
  padding: 0 0 30px 0px;
}
.page {
  padding: 60px 0 30px;
  margin-bottom: 30px;
}
.bussiness-type{
  padding: 20px 0;
}
</style>
