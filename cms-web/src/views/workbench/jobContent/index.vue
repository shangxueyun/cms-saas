<template>
    <div class="jobContent" id="jobContent">
      <div class="contentInner">
        <!-- <div id="anchor-1" class="anchorItem d_jump">工作台</div> -->
        <div class="OPMLList" v-if="anchorList.length>0">
          <span class="titleText">订阅列表</span>
          <span class="opmlBtn" @click="openDialog"></span>
        </div>
        <div  class="anchorItem anchorItem1 d_jump" v-if="isOnSubscribe('1')">
          <p  class="moduleTitle">项目管理核心数据</p>
          <div style="margin-top:25px">
            <span>项目选择：</span>
            <el-select v-model="partOne.projectManagementId" placeholder="项目" @change='projectChanged'>
              <el-option
                v-for="item in partOne.options2"
                :key="item.id"
                :label="item.projectName"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="tableName">项目楼宇统计</div>
          <div class="tableContent">
            <el-table :data="partOne.tableData" style="border:1px solid #eee">
              <el-table-column  prop="name" label="项目与楼宇" align="center"></el-table-column>
              <el-table-column  prop="areaRate" label="面积出租率" align="center"></el-table-column>
              <el-table-column  label="实时均价 元/m²·天" align="center">
                <template slot-scope="scope">
                  {{scope.row.price | toLocaleString}}
                </template>
              </el-table-column>
              <el-table-column  label="管理面积 m²" align="center" >
                <template slot-scope="scope">
                  {{scope.row.area | toLocaleFixed}}
                </template>
              </el-table-column>
              <el-table-column label="已租面积　m²" align="center" >
                <template slot-scope="scope">
                  {{scope.row.yzArea | toLocaleFixed}}
                </template>
              </el-table-column>
              <el-table-column  label="未租面积　m²" align="center" >
                <template slot-scope="scope">
                  {{scope.row.wzArea | toLocaleFixed}}
                </template>
              </el-table-column>
              <el-table-column  prop="rooms" label="全部房源数" align="center" ></el-table-column>
              <el-table-column  prop="yzRooms" label="已租房源数" align="center" ></el-table-column>
              <el-table-column  prop="wzRooms" label="未租房源数" align="center" ></el-table-column>
            </el-table>
          </div>
        </div>
        <div  class="anchorItem anchorItem2 d_jump" v-if="isOnSubscribe('2')">
          <p  class="moduleTitle">招商管理核心数据</p>
          <div class="tableName">招商平面图</div>
          <attractCAD :homeReference="homeReference"/>
        </div>
        <div  class="anchorItem anchorItem3" v-if="isOnSubscribe('2')">
          <p  class="moduleTitle" style="margin-bottom:20px">我的客户跟踪进度</p>
          <potlClients :homeReference="homeReference"/>
        </div>
        <div  class="anchorItem anchorItem4 d_jump" v-if="isOnSubscribe('3')">
          <p  class="moduleTitle">合同管理核心数据</p>
          <p style="padding: 20px 0 0 5px;">快到期与已到期合同</p>
          <contractExpiration :homeReference="homeReference"/>
        </div>
        <div  class="anchorItem anchorItem4 d_jump" v-if="isOnSubscribe('4')">
          <p  class="moduleTitle">财务管理核心数据</p>
          <p style="padding: 20px 0 0 5px;">到期账单提醒</p>
          <billMaturity :homeReference="homeReference"/>
        </div>
      </div>
      <el-dialog title="订阅管理" :visible.sync="dialogVisible" width="50%" >
        <span>订阅列表</span>
        <div style="margin-top: 20px;">
          <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="(item,index) in anchorList" :key="index" :label="item.subscribeId">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="subscription">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import context from '@/service'
import attractCAD from '../../financialManagement/mnangement/attractCAD'
import potlClients from '../../financialManagement/mnangement/potlClientsList/potlClients'
import contractExpiration from '../contractExpiration/index'
import billMaturity from '../billMaturity/index'
export default {
  name: 'jobContent',
  props: ['anchorList'],
  components: {
    attractCAD,
    billMaturity,
    potlClients,
    contractExpiration
  },
  data () {
    return {
      partOne: {
        projectManagementId: '',
        options2: [],
        tableData: []
      },
      homeReference: true, // 招商平面图是否是首页引用
      dialogVisible: false,
      checkList: []
    }
  },
  created () {
    this.getCheackedList()
  },
  mounted () {
    this.getOffsetTop()
    this.partOne.options2 = this.$store.state.projectManagementsList
    this.partOne.projectManagementId = this.$store.state.projectManagementsList[0].id
    this.projectChanged()
  },
  methods: {
    getCheackedList () { // 获取默认选中数据
      this.checkList = []
      for (var i = 0; i < this.anchorList.length; i++) {
        if (this.anchorList[i].onSubscribe) {
          // this.checkList[i] = this.anchorList[i].subscribeId
          this.checkList.push(this.anchorList[i].subscribeId)
        }
      }
    },
    isOnSubscribe (id) { // 模块是否订阅
      for (var i = 0; i < this.anchorList.length; i++) {
        if (Number(this.anchorList[i].subscribeId) === Number(id)) {
          return this.anchorList[i].onSubscribe
        }
      }
    },
    openDialog () {
      this.dialogVisible = true
    },
    subscription () { // 订阅
      context.http.post('/cms/api/userSubscribe', {subscribeIds: this.checkList}).then(res => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.dialogVisible = false
        this.$emit('subscriptionSuc', true)
      })
    },
    projectChanged () {
      this.projectData()
    },
    async projectData () {
      let result = await context.http.get('cms/api/buildings/projectManagement', { projectManagementId: this.partOne.projectManagementId })
      this.partOne.tableData = result.data
    },
    getOffsetTop () {
      let arr = [0]
      let djump = document.querySelectorAll('.d_jump')
      djump.forEach((item, index) => {
        arr.push(item.offsetTop)
      })
      this.$emit('targetOffTopArr', arr)
      // console.log(arr)
    }
  }
}
</script>

<style lang="scss">
.jobContent{
  .el-dialog__body{
    padding: 30px 20px!important;
  }
  min-height: 500px;
  display: flex;
  .sidebar{
    width: 230px;
    height: 100%;
    background-color: #ffffff;
    box-shadow: 0px 4px 12px 1px rgba(158, 162, 166, 0.2);
    position: fixed;
    top: 50px;
    left: 0;
    background: #333e5f;
    p{
      color: #fff !important;
      height: 40px;
      line-height: 40px;
      background-color: #333e5f !important;
      color: #fff !important;
      font-size: 14px;
      padding-left: 35px !important;
      cursor: pointer;
      .icon{
        font-size: 20px;
        margin-right: 10px;
      }
      &.active{
        background-color: #3e4c76!important ;
      }
    }
  }
  .contentInner{
    width: 100%;
    padding-left: 0px;
    padding-bottom: 320px;
    .titleText{
      font-size: 20px;
    }
    .OPMLList{
      height: 60px;
      line-height: 60px;
      background-color: #ffffff;
      padding: 0 15px;
      box-shadow: 0px 4px 12px 1px rgba(158, 162, 166, 0.2);
      display: flex;
      justify-content:space-between;
      align-items:center;
      .opmlBtn{
        display: inline-block;
        background-image: url(../../../assets/OPMLBtn.png);
        width: 134px;
        height: 42px;
        cursor: pointer;
      }
    }
  }
  .el-step__title{
    font-size:12px; 
  }
  .anchorItem{
    // height: 550px;
    background-color: #fff;
    margin-top: 20px;
    box-shadow: 0px 4px 12px 1px rgba(158, 162, 166, 0.2);
    padding: 15px 15px 50px 15px;
    .moduleTitle{
      font-weight: 700;
      font-size: 18px;
    }
    .tableName{
      margin: 15px 0;
    }
  }
}
</style>
