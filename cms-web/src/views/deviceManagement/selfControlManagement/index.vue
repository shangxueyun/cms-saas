<template>
  <div id="energySystem"
       class="energySystem">
    <span class="page_head_title">自控管理</span>
    <div class="search-bar">
      <div class="searbar-left">
        <el-select v-model="equipmentType"
                   placeholder="照明系统"
                   clearable
                   @change="handleChange">
          <el-option v-for="(item,index) in getEquirementTypes4List"
                     :key="index"
                     :value="item.id"
                     :label="item.name"></el-option>
        </el-select>
        <el-select v-model="projectManagementId"
                   placeholder="项目"
                   @change='handleChange(projectManagementId)'>
          <el-option v-for="item in projectManagementsList"
                     :key="item.id"
                     :label="item.referred"
                     :value="item.id">
          </el-option>
        </el-select>
      </div>
    </div>
    <ul class="default_tab_block">
      <li v-for="(item, index) in liList"
          v-if="hasAuthority(item.authorities)"
          :class="{'active': activeIndex === index}"
          @click="selectLi(item, index)">
        {{item.name}}
      </li>
    </ul>
    <div class="content">
      <components :is="componentName"
                  :projectId="projectManagementId"
                  :equipmentType="equipmentType"
                  ref="dynamicComponents" />
    </div>
  </div>
</template>

<script>
import context from '@/service'
import axios from 'axios'
import GatewayConfiguration from './GatewayConfiguration'
import Loop from './Loop'
import Group from './Group'
import PlanConfiguration from './PlanConfiguration'
import LightingPlan from './LightingPlan'
export default {
  name: 'selfControlManagement',
  components: {
    GatewayConfiguration,
    Loop,
    Group,
    PlanConfiguration,
    LightingPlan
  },
  data () {
    return {
      equipmentType: '',
      getEquirementTypes4List: [
        {
          id: '',
          name: '照明系统'
        }
      ],
      projectManagementsList: [],
      buildingName: '',
      options1: [
        { label: '楼平面图', value: 'BUILDING' }
      ],
      liList: [
        { name: '网关配置', value: 'GatewayConfiguration', authorities: '03080101' },
        { name: '回路', value: 'Loop', authorities: '03080106' },
        { name: '群组', value: 'Group', authorities: '03080111' },
        { name: '计划配置', value: 'PlanConfiguration', authorities: '03080116' },
        { name: '照明计划', value: 'LightingPlan', authorities: '03080121' }
      ],
      activeIndex: 0,
      componentName: 'GatewayConfiguration',
      total: 0,
      pgSize: 15,
      projectManagementId: ''
    }
  },
  created () {
    this.projectManagementsList = this.$store.state.projectManagementsList
    this.projectManagementId = this.projectManagementsList[0].id
    this.mathIndex()
  },
  mounted () {
  },
  methods: {
    mathIndex () {
      for (let i = 0; i < this.liList.length; i++) {
        if (this.hasAuthority(this.liList[i].authorities)) {
          this.activeIndex = i
          this.componentName = this.liList[i].value
          break
        }
      }
      // console.log(this.activeIndex)
    },
    hasAuthority (code) {
      return context.user.hasAuthority(code)
    },
    handleChange (id) {
      // this.$refs.dynamicComponents.query()
    },
    selectLi (item, index) {
      this.activeIndex = index
      this.componentName = item.value
    }
  }
}
</script>
<style lang="scss">
.firecontrolChart {
  .el-table__header thead tr th {
    background-color: #ffffff;
  }
}
.energyDataDetailShow {
  .el-drawer .el-drawer__header {
    margin: 20px 20px 0px 20px;
  }
}
</style>
<style lang="scss" scoped>
svg polygon.bind,
svg path.bind,
svg rect.bind {
  stroke-width: "2px" !important;
  stroke: "#00ff00" !important;
  fill: "rgba(0,0,0,0.2)" !important;
}
.conDetail {
  border: 1px solid #ebebeb;
  .normal {
    color: #49af61;
  }
  .abnormal {
    color: #ff6665;
  }
}
.dc-right {
  width: 100%;
  margin-top: 20px;
  .dr-head {
    background-color: #fafafa;
    height: 40px;
    line-height: 40px;
    padding-left: 12px;
    font-size: 14px;
    margin-bottom: 20px;
  }
  .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item__content {
      span {
        color: #888;
        font-size: 12px;
      }
    }
    .enclosure-list {
      .el-item {
        > span {
          color: #888;
          font-size: 12px;
        }
      }
    }
  }
  .contract-rules {
    span {
      display: inline-block;
      background-color: #fff;
      color: #0f75ff;
      border: 1px solid #0f75ff;
      cursor: pointer;
      height: 24px;
      line-height: 23px;
      border-radius: 4px;
      font-size: 12px;
      padding: 0 4px;
      float: right;
      margin: 7px 10px 0 0;
      &:hover {
        background-color: #0f75ff;
        color: #fff;
      }
    }
  }

  .el-form-item {
    display: inline-block;
    width: 29%;
    margin-left: 16px;
    margin-right: 10px;

    &:nth-of-type(2n) {
      margin-right: 0;
    }
  }

  .dc-right_div {
    border: 1px solid #e7e7e7;
    margin-top: 20px;

    .cttitle span:nth-of-type(2) {
      color: #0f75ff;
      font-size: 12px;
      float: right;
      cursor: pointer;
    }

    .psotmaster span {
      color: #666 !important;
    }
  }
}
.energySystem {
  .query-btn {
    display: inline-block;
    width: 120px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
    color: #fff;
    border-radius: 3px;
    background-color: #3577f6;
  }
  .query-btn:hover {
    background-color: #2a6ef0;
  }
  .menuTab {
    height: 60px;
    margin-top: 15px;
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 4px 4px 4px 1px #eee;
    > span {
      position: relative;
      display: inline-block;
      width: 120px;
      text-align: center;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
      font-size: 14px;
      &.active {
        color: #3577f6;
        border-bottom: 2px solid #3577f6;
      }
      > span {
        display: block;
        position: absolute;
        top: 20px;
        right: 6px;
        min-width: 16px;
        height: 16px;
        line-height: 16px;
        padding: 0 3px;
        font-weight: normal;
        color: white;
        text-align: center;
        text-shadow: 0 1px rgba(0, 0, 0, 0.2);
        border-radius: 16px;
        background: #cb444a;
        font-size: 12px;
      }
    }
  }
}
.seachDiv {
  height: 80px;
  background-color: #ffffff;
  margin-top: 15px;
  border-radius: 5px;
  box-shadow: 4px 4px 4px 1px #eee;
  display: flex;
  align-items: center;
  padding-left: 20px;
  span {
    margin-right: 40px;
  }
}
.content {
  min-height: 720px;
  background-color: #ffffff;
  position: relative;
  padding-bottom: 20px;
  padding-top: 10px;
  box-shadow: 0px 2px 3px 0px rgba(190, 199, 208, 0.2);
  .saclBtn {
    display: flex;
    padding: 10px 20px 10px 0;
    align-items: center;
    justify-content: space-between;

    .tips {
      display: flex;
      color: #666666;
      width: 70%;
      span {
        display: inline-block;
        // width: 50%;
        height: 46px;
        line-height: 46px;
        padding: 0 10px;
        i {
          margin-right: 10px;
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
      }
    }
  }
  #svgDiv {
    height: 750px;
    position: relative;
    overflow: auto;
    display: flex;
    justify-content: center;
    // align-items: center;
  }
  #svgDiv::-webkit-scrollbar {
    width: 4px !important;
    height: 4px !important;
  }
  #svgDiv::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px #ffffff;
    background-color: #ffffff;
  }
  #svgDiv::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px #cccccc;
  }
  #svgDiv > span {
    // position: absolute;
    // left: 0;
    // right: 0;
    // top: 0;
    // bottom: 0;
    // margin: auto;
    display: inline-block;
  }
  .noData {
    background-color: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 150px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 5px;
  }
}
svg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
svg path:hover {
  fill: #000;
  fill-opacity: 0.1;
}
svg polygon:hover {
  fill: #000;
  fill-opacity: 0.1;
}
svg rect:hover {
  fill: #000;
  fill-opacity: 0.1;
}
.upload {
  position: relative;
  display: inline-block;
  border-radius: 2px;
  cursor: pointer;
  margin-left: 20px;
  input {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}
</style>
<style>
#projectId .el-dialog__body {
  border-bottom: none;
  padding: 25px 25px 30px !important;
}
</style>

