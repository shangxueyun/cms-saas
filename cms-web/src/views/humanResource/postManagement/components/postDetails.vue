<template>
  <div>
    <!-- 查看岗位信息 -->
    <drawer :show="detailsdrawershow"
            :append-to-body="true"
            :wrapperClosable="false"
            :title="drawerTitle"
            class="drawer_new"
            :showEditBtn="readOnly"
            @on-edit="onEdit"
            @on-hide="onHide">
      <div class="details_content drawer-body postDetails"
           slot="drawer">
        <div class="main_content">
          <div class="el_drawer_body"
               style="height:auto;padding-bottom:50px">
            <div class="title">
              <i></i>
              <span>房源基本信息</span>
            </div>
            <div class="min_content">
              <el-form :model="detailData"
                       :rules="detailDataRules"
                       ref="detailData">
                <div class="item">
                  <span>所属组织<i class="required">*</i></span>
                  <el-form-item prop="organizeId">
                    <p class="readOnlyTxt">{{detailData.organizeName}}</p>
                  </el-form-item>
                </div>
                <div class="item">
                  <span>岗位名称<i class="required">*</i></span>
                  <el-form-item prop="name">
                    <el-input v-model="detailData.name"
                              style="width:200px"
                              maxlength="20"
                              placeholder="请输入内容"
                              v-if="!readOnly"></el-input>
                    <p class="readOnlyTxt"
                       v-else>{{detailData.name}}</p>
                  </el-form-item>
                </div>
                <div class="item">
                  <span>上级岗位</span>
                  <el-form-item prop="parentId">
                    <el-select v-model="detailData.parentIds[0]"
                               placeholder="请选择"
                               style="width:200px"
                               v-if="!readOnly">
                      <el-option v-for="item in leadershipOptions"
                                 :key="item.id"
                                 :label="item.name"
                                 :value="item.id">
                      </el-option>
                    </el-select>
                    <p class="readOnlyTxt"
                       v-else>{{formatViewLeaderName(detailData.parentName)}}</p>
                  </el-form-item>
                </div>
                <div class="item">
                  <span>岗位属性<i class="required">*</i></span>
                  <el-form-item prop="onOnly">
                    <el-radio-group v-model="detailData.onOnly"
                                    style="width:200px"
                                    v-if="!readOnly">
                      <el-radio label='true'>单人岗</el-radio>
                      <el-radio label='false'>多人岗</el-radio>
                    </el-radio-group>
                    <p class="readOnlyTxt"
                       v-else>{{TransAttribute(detailData.onOnly)}}</p>
                  </el-form-item>
                </div>
                <div class="item">
                  <span>状态</span>
                  <el-form-item prop="useStatus">
                    <el-select v-model="detailData.useStatus"
                               placeholder="请选择"
                               style="width:200px"
                               v-if="!readOnly">
                      <el-option v-for="item in stateOptions"
                                 :key="item.value"
                                 :label="item.name"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                    <p class="readOnlyTxt"
                       v-else>{{fromatUseStatus(detailData.useStatus)}}</p>
                  </el-form-item>
                </div>
                <div class="item">
                  <span>排序</span>
                  <el-form-item prop="sortNumber">
                    <el-input v-model="detailData.sortNumber"
                              maxlength="30"
                              type="number"
                              placeholder="请输入内容"
                              style="width:200px"
                              v-if="!readOnly"></el-input>
                    <p class="readOnlyTxt"
                       v-else>{{detailData.sortNumber}}</p>
                  </el-form-item>
                </div>
              </el-form>
            </div>
            <div class="boxshdow"></div>
            <div class="title">
              <i></i>
              <span>岗位职责</span>
            </div>
            <div class="min_content min_content1"
                 style="padding:5px 0 5px 15px">
              <el-form :model="detailData"
                       :rules="detailDataRules">
                <el-form-item prop="description"
                              style="width:100%">
                  <el-input v-if="!readOnly"
                            type="textarea"
                            resize='none'
                            maxlength="10000"
                            :rows='8'
                            placeholder="请输入岗位职责（10000字以内）"
                            v-model="detailData.description">
                  </el-input>
                  <div class="readOnlyTxt readOnlyTxt1"
                       v-else
                       style="width:100%;word-wrap: break-word;word-break: normal;height: 200px;overflow-y: auto;"
                       v-html="formatreplace(detailData.description)"></div>
                </el-form-item>
              </el-form>
            </div>
            <div class="boxshdow"></div>
            <div class="title">
              <i></i>
              <span>员工信息</span>
            </div>
            <div>
              <div class="min_content min_content1"
                   style="min-height:auto">
                <el-table :data="detailData.users"
                          style="width: 100%">
                  <el-table-column label="员工姓名"
                                   prop="name"
                                   align="center"></el-table-column>
                  <el-table-column label="性别"
                                   align="center">
                    <template slot-scope="scope">
                      <span>{{scope.row.sex === 'WOMAN' ? '女' : '男'}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="年龄"
                                   prop="age"
                                   align="center"></el-table-column>
                  <el-table-column label="手机号"
                                   prop="telephone"
                                   align="center"></el-table-column>
                  <el-table-column label="操作"
                                   align="center">
                    <template slot-scope="scope">
                      <el-button @click="getStaffDetails(scope.row.id)"
                                 class="el-button--primary operation-btn"
                                 size="mini">查看</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer"
           v-if="!readOnly"
           class="dialog-footer">
        <span class="details_cannelBtn"
              @click="onHide">取消</span>
        <span class="details_submitBtn"
              @click="confirm('detailData')">保存</span>
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
      leadershipOptions: [],
      drawer: false,
      readOnly: true,
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
      },
      // ---------------
      drawerTitle: '岗位详情',
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
      rankOptions: [],
      viewLeaderName: ''
    }
  },
  watch: {
    detailData: {
      handler: function () {
        // this.rank()
        this.detailData.onOnly = JSON.stringify(this.detailData.onOnly)
      }
    }
  },
  methods: {
    async confirm (formName) { // 编辑提交岗位信息
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.detailData.onOnly = JSON.parse(this.detailData.onOnly)
          if (this.detailData.parentIds === '' || this.detailData.parentIds.length === 0) {
            this.detailData.parentIds = []
          } else if (Array.isArray(this.detailData.parentIds)) {
            this.detailData.parentIds = this.detailData.parentIds
          } else {
            this.detailData.parentIds = [this.detailData.parentIds]
          }
          context.http.put('uaa/api/user-posts', this.detailData).then(res => {
            if (res.status === 200) {
              _this.$message({
                type: 'success',
                message: '保存成功'
              })
              // _this.onHide()
              _this.$refs['detailData'].resetFields()
              _this.readOnly = true
              _this.$emit('query')
              _this.$emit('updateDetails', res.data.id)
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
    },
    getStaffDetails (id) { // 查看员工详情
      this.$emit('getStaffDetails', id)
    },
    async leadership (organizeId, postId) {
      this.leadershipOptions = []
      let result = await context.http.get('/uaa/api/user-posts/parent', { useStatus: 'USING', organizeId: organizeId, postId: postId })
      this.leadershipOptions = result.data
      if (!this.leadershipOptions.length) {
        this.detailData.parentIds = []
      }
    },
    onEdit () {
      this.readOnly = false
      this.leadership(this.detailData.organizeId, this.detailData.id)
    },
    onHide () {
      this.$refs['detailData'].resetFields()
      this.readOnly = true
      this.$emit('drawerClose', false)
    },
    formatViewLeaderName (arr) { // 详情接口遍历
      return arr && arr.join(' ，')
    },
    TransAttribute (val) {
      if (val === 'false' || !val) {
        return '多人岗'
      } else {
        return '单人岗'
      }
    },
    fromatUseStatus (val) {
      return val === 'USING' ? '使用中' : '已停用'
    },
    formatreplace (description) {
      if (!description) {
        return
      }
      let html = description.replace(/\n/g, '<br/>')
      return html
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    // -------------------------------------
    async rank () {
      let result = await context.http.get('/uaa/api/paramet-managements/name?name=对应职级')
      this.rankOptions = result.data
    }
  }
}
</script>
<style lang="scss" scoped>
.postDetails {
  width: 800px;
  .main_content {
    padding: 0 !important;
    .min_content {
      padding: 15px;
      .el-form {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .item {
          width: 32%;
          flex-direction: column;
          margin-bottom: 22px;
          > span {
            display: block;
            margin-bottom: 5px;
          }
          .readOnlyTxt {
            width: 200px;
            font-size: 14px;
            color: #999;
            padding: 8px;
          }
        }
      }
    }
    .title {
      height: 45px;
      padding-left: 15px;
      font-size: 16px;
      font-weight: bold;
      color: #262626;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f6f6f6;

      > i {
        display: inline-block;
        width: 4px;
        height: 16px;
        background: rgba(53, 117, 246, 1);
        border-radius: 2px;
        margin-right: 5px;
      }
    }
  }
}
</style>
