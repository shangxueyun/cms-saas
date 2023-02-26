<template>
    <div class="tenant-details">
      <drawer :show="openEngModelShow"
        :title="drawerTitle"
        @on-hide="onHide">
        <div class="tenant-details details-content store-details" slot="drawer">
          <div class="main-content clearfix" style="width:100%;padding:0 20px">
            <div class="seachBtn">
              <div style="width:250px">
                <el-select style="width:250px" v-model="buildingNameId2" v-if="planeType==='FLOOR'" @change="refreshGetFloorAndProjcet">
                  <el-option  v-for="(item,index) in hourList"  :key="index" :label="item.buildingName" :value="item.id"></el-option>
                </el-select>
                <div v-else>{{buildingNameText}}</div>
              </div>
              <div style="line-height:40px;cursor:pointer" @click="projectEdit=true" v-if="hasAuthority('02010303')">
                <i aria-hidden="true" class="icon icon-edit2"></i>编辑
              </div>
            </div>
            <div class="itemContent">
              <div class="item" v-for="(item,index) in engList" :key="index" v-show="item.isChecked||projectEdit">
                <el-checkbox style="margin-right:15px" @change="(value) => changeHandler(value,item,index)" :checked="item.isChecked" :disabled="!projectEdit"></el-checkbox>
                <span style="display:inline-block;width:100px;margin-right:15px">{{item.value}}</span>
                <el-input v-if="projectEdit" v-model="item.needValue" :disabled="!item.isChecked"  style="width:150px;margin-right:15px"></el-input>
                <span v-else style="display:inline-block;width:150px;text-align:center">{{(item.needValue!==""||!item.needValue)?item.needValue:'-'}}</span>
                <span>{{item.description}}</span>
              </div>
            </div>
            <div v-if="projectConditions.length===0 && !projectEdit" style="padding: 20px;">暂无数据</div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer" v-if="projectEdit">
          <el-button @click="onHide" class="close-button">关闭</el-button>
          <el-button type="primary"  class="defaultbtn dialog-confirmBtn" @click="submit">确 定</el-button>
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
      openEngModelShow: {
        type: Boolean,
        default: false
      },
      engData: {
        type: Array,
        default: []
      },
      hourList: {
        type: Array,
        default: []
      },
      projectConditions: {
        type: Array,
        default: []
      },
      buildingNameId: {
        type: Number,
        default: 0
      },
      floorName: {

      },
      planeType: {
        type: String,
        default: 'FLOOR'
      },
      buildingNameText: {
  
      }
    },
    watch: {
      projectConditions: {
        handler (newValue, oldValue) {
          this.projectConditions = newValue
          this.updateData()
        },
        deep: true
      },
      buildingNameId: {
        handler (newValue, oldValue) {
          this.buildingNameId2 = newValue
        }
      }
    },
    data () {
      return {
        buildingNameId2: '',
        engList: null,
        projectEdit: false,
        drawerTitle: '查看工程条件',
        addPamams: {
          buildingId: '',
          name: '',
          projectConditions: []
        }
      }
    },
    created () {
      this.buildingNameId2 = this.buildingNameId
    },
    mounted () {

    },
    methods: {
      hasAuthority (code) {
        return context.user.hasAuthority(code)
      },
      updateData () {
        this.engList = this.engData
        for (let i = 0; i < this.projectConditions.length; i++) {
          for (let j = 0; j < this.engData.length; j++) {
            if (Number(this.projectConditions[i].projectType) === this.engData[j].id) {
              this.$set(this.engList[j], 'needValue', this.projectConditions[i].needValue ? this.projectConditions[i].needValue : '')
              this.$set(this.engList[j], 'isChecked', true)
            }
          }
        }
        this.$forceUpdate()
        // console.log(this.engList)
      },
      refreshGetFloorAndProjcet () {
        this.projectEdit = false
        this.$emit('updateTimeKey')
        this.$emit('refreshGetFloorAndProjcet', this.buildingNameId2)
      },
      changeHandler (value, item, index) {
        if (!value) {
          this.$set(this.engList[index], 'needValue', null)
          this.$set(this.engList[index], 'isChecked', false)
        } else {
          this.$set(this.engList[index], 'needValue', '')
          this.$set(this.engList[index], 'isChecked', true)
        }
        this.$forceUpdate()
      },
      addPamamsFormat () {
        this.addPamams.buildingId = this.buildingNameId
        this.addPamams.name = this.floorName
        this.addPamams.projectConditions = []
        for (let i = 0; i < this.engList.length; i++) {
          if (this.engList[i].needValue || this.engList[i].needValue === '') {
            this.addPamams.projectConditions.push({
              projectType: this.engList[i].id,
              needValue: this.engList[i].needValue
            })
          }
        }
      },
      submit () {
        this.addPamamsFormat()
        context.http.put('cms/api/floors/condition?buildingId', this.addPamams).then(res => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.projectEdit = false
          this.onHide()
        }).catch(error => {
          console.info(error)
        })
      },
      onHide () {
        this.projectEdit = false
        this.$emit('updateTimeKey')
        this.$emit('openEngModelClose', false)
      }
    }
  }
</script>
<style lang="scss" scoped>
.tenant-details {
  width: 720px;
  .details-content .main-content{
    display: block;
  }
  .seachBtn{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-content: center;
  }
  .itemContent{
    padding: 30px 15px 15px 15px;
    .checkIcon{
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 1px solid #eeeeee;
      &.checked{
        background-color: #ff0000;
      }
    }
    .item{
      display: flex;
      min-height: 40px;
      // line-height: 50px;
      align-items: center;
      margin-bottom: 10px;
      padding-left: 150px;
      >span{
        display: inline-block;
        width: 150px;
        >i{
          color: #ff0000;
          font-style: normal;
        }
      }
      >div{
        >span{

        }
      }
    }
    .itemEdit{
      margin-bottom: 15px;
    }
  }
  .icon-edit2 {
    width: 15px;
    height: 20px;
    margin-right: 4px;
    background: url(../../../../assets/edit.png) no-repeat;
    background-size: contain;
  }
}
</style>
