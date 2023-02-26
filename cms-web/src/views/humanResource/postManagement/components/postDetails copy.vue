<template>
  <div>
    <drawer :show="detailsdrawershow"
            :title="drawerTitle"
            @on-hide="onHide">
      <div class="post-details details-content"
           slot="drawer">
        <div class="main-content">
          <div class="editbtnwarp">
            <div class="dweditbtn"
                 v-if="hasAuthority('01010203') && readonly"
                 @click="readonly = false"><i aria-hidden="true"
                 class="icon icon-edits"></i>编辑</div>
          </div>
          <div class="drawer-content">
            <el-form :model="detailData"
                     ref="detailData"
                     :rules="detailDataRules">
              <el-form-item :label-width="formLabelWidth"
                            prop="name"
                            style="margin-bottom: 20px;">
                <div class="cttitle">岗位名称<i class="required">*</i></div>
                <span v-if="readonly">{{detailData.name}}</span>
                <el-input v-model="detailData.name"
                          maxlength="20"
                          placeholder="请输入内容"
                          v-else></el-input>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;">
                <div class="cttitle">岗位代码</div>
                <span v-if="readonly">{{detailData.code}}</span>
                <el-input v-model="detailData.code"
                          maxlength="30"
                          placeholder="请输入内容"
                          v-else></el-input>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;">
                <div class="cttitle">职级</div>
                <span v-if="readonly">{{detailData.rankValue}}</span>
                <el-select v-model="detailData.rank"
                           placeholder="请选择"
                           v-else>
                  <el-option v-for="item in rankOptions"
                             :key="item.id"
                             :label="item.value"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;">
                <div class="cttitle">所属组织<i class="required">*</i></div>
                <span v-if="readonly">{{detailData.organizeName}}</span>
                <el-select v-model="detailData.organizeId"
                           placeholder="请选择"
                           v-else>
                  <el-option v-for="item in organizationOptions"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;">
                <div class="cttitle">直属领导</div>
                <span v-if="readonly">{{formatViewLeaderName(detailData.parentName)}}</span>
                <el-select v-model="detailData.parentIds"
                           placeholder="请选择"
                           multiple
                           filterable
                           v-else>
                  <el-option v-for="item in leadershipOptions"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;">
                <div class="cttitle">岗位属性<i class="required">*</i></div>
                <span v-if="readonly">{{TransAttribute(detailData.onOnly)}}</span>
                <el-radio-group v-model="detailData.onOnly"
                                v-else>
                  <el-radio :label='true'>单人岗</el-radio>
                  <el-radio :label='false'>多人岗</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth"
                            style="margin-bottom: 20px;">
                <div class="cttitle">岗位状态</div>
                <span v-if="readonly">{{fromatUseStatus(detailData.useStatus)}}</span>
                <el-select v-model="detailData.useStatus"
                           placeholder="请选择"
                           v-else>
                  <el-option v-for="item in stateOptions"
                             :key="item.value"
                             :label="item.name"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="margin-bottom: 20px;">
                <div class="cttitle">岗位排序</div>
                <span v-if="readonly">{{detailData.sortNumber}}</span>
                <el-input v-model="detailData.sortNumber"
                          v-else
                          maxlength="30"
                          type="number"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-form>
            <div class="cttitle">岗位职责</div>
            <span v-if="readonly"
                  style="color: #666;font-size:12px;">{{detailData.description}}</span>
            <el-input v-else
                      style="margin-bottom: 20px;"
                      type="textarea"
                      resize='none'
                      maxlength="100"
                      placeholder="请输入岗位职责（100字以内）"
                      v-model="detailData.description">
            </el-input>
          </div>
        </div>
      </div>
      <div slot="footer"
           v-if="!readonly"
           class="dialog-footer">
        <el-button @click="onHide"
                   class="close-button">关闭</el-button>
        <el-button type="primary"
                   @click="confirm('detailData')"
                   class="defaultbtn dialog-confirmBtn">保 存</el-button>
      </div>
    </drawer>
  </div>
</template>
<script>
import context from '@/service'
import Drawer from '@/components/drawer.vue'
export default {
  name: 'postdetails',
  components: {
    Drawer
  },
  props: {
    detailsdrawershow: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object
    }
  },
  created () {
  },
  data () {
    return {
      drawerTitle: '查看岗位',
      options: [],
      formOpenact: {},
      formLabelWidth: '120px',
      organizationName: '',
      organizationType: '',
      textarea: '',
      readonly: true,
      stateOptions: [{
        name: '使用中',
        value: 'USING'
      }, {
        name: '已停用',
        value: 'DISABLE'
      }],
      organizationOptions: [],
      leadershipOptions: [],
      rankOptions: [],
      viewLeaderName: '',
      detailDataRules: {
        name: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
        ],
        code: [
          { required: false, message: '请输入岗位代码', trigger: 'blur' }
        ],
        organize: [
          { required: true, message: '请选择所属组织', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    detailData: {
      handler: function () {
        this.getOrganization()
        this.rank()
        // this.getLeaderName()
        this.leadership()
        this.detailData.onOnly = JSON.stringify(this.detailData.onOnly)
      }
    }
  },
  methods: {
    formatViewLeaderName (arr) { // 详情接口遍历
      return arr && arr.join(' ，')
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    onHide () {
      this.$emit('drawerClose', false)
      this.readonly = true
    },
    TransAttribute (val) {
      return val ? '单人岗' : '多人岗'
    },
    fromatUseStatus (val) {
      return val === 'USING' ? '使用中' : '已停用'
    },
    newlystepNoe () {
      this.newlystep1 = false
      this.newlystep2 = true
    },
    previousStep () {
      this.newlystep1 = true
      this.newlystep2 = false
    },
    async rank () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=对应职级')
      this.rankOptions = result.data
    },
    async leadership () {
      // let organizeId = this.detailData.organizeId
      let postId = this.detailData.id
      // let result = await context.http.get('uaa/api/user-posts/parent', { useStatus: 'USING', organizeId: organizeId })
      let result = await context.http.get(`uaa/api/user-posts/leadPost?postId=${postId}`, { useStatus: 'USING' })
      this.leadershipOptions = result.data
    },
    async getLeaderName () {
      if (!this.detailData.parentIds) {
        this.viewLeaderName = ''
        return false
      }
      let result = await context.http.get(`uaa/api/user-posts/${this.detailData.parentIds}`)
      this.viewLeaderName = result.data.name
    },
    async getOrganization () {
      let result = await context.http.get('uaa/api/organizes/all/simple')
      this.organizationOptions = result.data
    },
    async confirm (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.detailData.onOnly = JSON.parse(this.detailData.onOnly)
          context.http.put('uaa/api/user-posts', this.detailData).then(res => {
            if (res) {
              this.$emit('drawerClose', false)
              this.$emit('query')
            }
          }).catch(err => {
            if (err) {
              _this.detailData.onOnly = 'true'
            }
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
<style lang="scss">
.post-details {
  width: 600px;
  .main-content {
    border-top: 1px solid #dadada;
    margin: 0 40px;
    .editbtnwarp {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
      .dweditbtn {
        width: 88px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        background-color: #ebebeb;
        border-radius: 4px;
        cursor: pointer;
        right: 0;
        .icon-edits {
          width: 15px;
          height: 20px;
          margin-right: 4px;
          background: url(../../../../assets/edit.png) no-repeat;
          background-size: contain;
        }
      }
    }
    .dl-head {
      display: flex;
      justify-content: space-between;
    }
    .step {
      display: inline-block;
      width: 218px;
      height: 50px;
      line-height: 50px;
      padding-left: 14px;
      font-size: 16px;
      background-color: #f9f9f9;
      color: #777;
      border-radius: 6px;
    }
    .stepActive {
      color: #fff;
      background-color: #3175d2;
    }
    .stepActivePast {
      color: #fff;
      background-color: #789ed2;
    }
    .drawer-content {
      margin-top: 10px;
    }
    .el-dialog__header,
    .el-dialog__body {
      border-bottom: none;
    }
    .el-textarea__inner {
      height: 100px;
    }
    .checkAll {
      font-size: 16px;
      .el-checkbox__label {
        font-size: 16px;
      }
    }
    .cttitle {
      margin-bottom: 10px;
      font-size: 14px;
    }
    .el-select {
      width: 100%;
    }
    .el-form-item__content {
      span {
        color: #666;
        font-size: 12px;
      }
    }
  }
}
</style>
