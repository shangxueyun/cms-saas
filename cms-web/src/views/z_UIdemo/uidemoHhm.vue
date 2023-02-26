<template>
  <!-- uidemoHhm -->
  <div id="uidemo_hhm">
    <p>标准按钮 —— 使用任何可用的按钮类快速创建样式按钮，常用于一级功能</p>
    <p><i style="color:#f00">对应类名 ‘bzan bzan1--8’</i></p>
    <div class="normalBtn">
      <el-button class="bzan bzan1">新增账单</el-button>
      <el-button class="bzan bzan2">生成通知单</el-button>
      <el-button class="bzan bzan3">导出excel</el-button>
      <el-button class="bzan bzan4">下载模版</el-button>
      <el-button class="bzan bzan5">批量操作</el-button>
      <el-button class="bzan bzan6">配置权限</el-button>
      <el-button class="bzan bzan7">删除账单</el-button>
      <el-button class="bzan bzan8">维修完成</el-button>
    </div>
    <p>图标按钮 —— 默认引导按钮带有图标，一级功能按钮常用于增删改查</p>
    <p><i style="color:#f00">对应类名 ‘tban tban1--8’</i></p>
    <div class="normalBtn">
      <el-button class="tban tban1"><i class="iconfont icon-crm_xinzeng-"></i> 新增账单</el-button>
      <el-button class="tban tban2"><i class="iconfont icon-xiazai1"></i> 下载模版</el-button>
      <el-button class="tban tban3"><i class="iconfont icon-cms_shengcheng-"></i> 生成通知单</el-button>
      <el-button class="tban tban4"><i class="iconfont icon-cms_piliangcaozuo-1"></i> 批量操作</el-button>
      <el-button class="tban tban5"><i class="iconfont icon-cms_daorushuju-"></i> 导入账单</el-button>
      <el-button class="tban tban6"><i class="iconfont icon-cms_daochushuju-"></i> 导出excel</el-button>
      <el-button class="tban tban7"><i class="iconfont icon-bianji-"></i> 编辑</el-button>
      <el-button class="tban tban8"><i class="iconfont icon-shanchu-"></i> 删除</el-button>
    </div>
    <p>下拉菜单(拆分按钮) —— 使用于主功能模块按钮延伸收起的下拉二级功能及非重点下的三级文字类型下拉样式</p>
    <p><i style="color:#f00">对应类名 ‘dropdownBtn dropdownBtn1--9’</i></p>
    <div class="normalBtn">
      <el-dropdown class="dropdownBtn dropdownBtn1">
        <el-button>
          新增 &nbsp;&nbsp;<i class="iconfont icon-zelvxuanzefeiyongdaosanjiaoxingfandui"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 222222222222222 -->
      <el-dropdown class="dropdownBtn dropdownBtn2">
        <el-button>
          新增 &nbsp;&nbsp;<i class="iconfont icon-zelvxuanzefeiyongdaosanjiaoxingfandui"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 33333333333 -->
      <el-dropdown class="dropdownBtn dropdownBtn3">
        <el-button>
          新增 &nbsp;&nbsp;<i class="iconfont icon-zelvxuanzefeiyongdaosanjiaoxingfandui"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 4 -->
      <el-dropdown class="dropdownBtn dropdownBtn4">
        <el-button>
          新增 &nbsp;&nbsp;<i class="iconfont icon-zelvxuanzefeiyongdaosanjiaoxingfandui"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 5 -->
      <el-dropdown class="dropdownBtn dropdownBtn5">
        <el-button>
          新增 &nbsp;&nbsp;<i class="iconfont icon-zelvxuanzefeiyongdaosanjiaoxingfandui"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 6 -->
      <el-dropdown class="dropdownBtn dropdownBtn6"
                   split-button>
        新增
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 7 -->
      <el-dropdown class="dropdownBtn dropdownBtn7"
                   split-button>
        新增
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 8 -->
      <el-dropdown class="dropdownBtn dropdownBtn8">
        <el-button>
          新增 &nbsp;&nbsp;<i class="iconfont icon-zelvxuanzefeiyongdaosanjiaoxingfandui"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 9 -->
      <el-dropdown class="dropdownBtn dropdownBtn9">
        <el-button>
          新增 &nbsp;&nbsp;<i class="iconfont icon-zelvxuanzefeiyongdaosanjiaoxingfandui"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
export default {
  components: {

  },
  data () {
    return {

    }
  },

  created () {

  },
  methods: {
  }
}
</script>
<style lang="scss" scope>
.normalBtn {
  padding: 20px;
}
// 标准按钮
.el-button.bzan {
  padding: 0 27px;
  height:32px;
  line-height: 32px;
  font-size: 14px !important;
  color: #ffffff;
  &:hover {
    color: #ffffff;
    opacity: 0.8;
  }
  &.bzan1 {
    background: #44af69;
    &:active {
      border-color: #44af69;
    }
  }
  &.bzan2 {
    background: #3575f6;
    &:active {
      border-color: #3575f6;
    }
  }
  &.bzan3 {
    background: #91cf48;
    &:active {
      border-color: #91cf48;
    }
  }
  &.bzan4 {
    background: #6b69d6;
    &:active {
      border-color: #6b69d6;
    }
  }
  &.bzan5 {
    background: #e08545;
    &:active {
      border-color: #e08545;
    }
  }
  &.bzan6 {
    background: #303d72;
    &:active {
      border-color: #303d72;
    }
  }
  &.bzan7 {
    background: #e2434d;
    &:active {
      border-color: #e2434d;
    }
  }
  &.bzan8 {
    background: #d69c7c;
    &:active {
      border-color: #d69c7c;
    }
  }
}
// 图标按钮
.el-button.tban {
  padding: 0px 10px;
  height:32px;
  font-size: 14px !important;
  &.tban1 {
    color: #44af69;
    border: 1px solid #44af69;
  }
  &.tban2 {
    color: #3575f6;
    border: 1px solid #3575f6;
  }
  &.tban3 {
    color: #455aec;
    border: 1px solid #455aec;
  }
  &.tban4 {
    color: #df8544;
    border: 1px solid #df8544;
    &:hover {
      background-color: rgba(223, 133, 68, 0.1);
    }
  }
  &.tban5 {
    color: #f3af2c;
    border: 1px solid #f3af2c;
    &:hover {
      background-color: rgba(243, 175, 44, 0.1);
    }
  }
  &.tban6 {
    color: #6b69d6;
    border: 1px solid #6b69d6;
  }
  &.tban7 {
    color: #465dce;
    border: 1px solid #455aec;
  }
  &.tban8 {
    color: #e53854;
    border: 1px solid #e53854;
    &:hover {
      background-color: rgba(229, 56, 84, 0.1);
    }
  }
}
// 下来菜单按钮
.el-dropdown {
  span{
    font-size: 14px;
  }
  .icon-zelvxuanzefeiyongdaosanjiaoxingfandui {
    font-size: 14px;
  }
  &.dropdownBtn {
    > button {
      color: #ffffff;
      padding: 0 20px;
      height:32px;
    }
    &.dropdownBtn1 {
      > button {
        background-color: #3575f6;
      }
    }
    &.dropdownBtn2 {
      > button {
        background-color: #44af69;
      }
    }
    &.dropdownBtn3 {
      > button {
        background-color: #91cf48;
      }
    }
    &.dropdownBtn4 {
      > button {
        background-color: #ffb300;
      }
    }
    &.dropdownBtn5 {
      > button {
        background-color: #e2434d;
      }
    }
    &.dropdownBtn7 {
      vertical-align: top;
      .el-button-group {
        height:32px;
        padding:0;
        display: flex;
        .el-button{
          display: block;
        }
        .el-button--default {
          background-color: #fdbab1;
          color: #ffffff;
          height:32px;
          padding:0 20px;
        }
        .el-dropdown__caret-button {
          background-color: #ffffff;
          color: #fdbab1;
          border-color: #fdbab1;
          padding: 0px 5px;
          height:32px;
          .el-dropdown__icon {
            &.el-icon-arrow-down {
              color: #fdbab1;
            }
          }
        }
      }
    }
    &.dropdownBtn6 {
      vertical-align: top;
      .el-button-group {
        height:32px;
        padding:0;
        display: flex;
        .el-button{
          display: block;
        }
        .el-button--default {
          background-color: #6b69d6;
          color: #ffffff;
          height:32px;
          padding:0 20px;
        }
        .el-dropdown__caret-button {
          background-color: #ffffff;
          color: #6b69d6;
          border-color: #6b69d6;
          padding: 0px 5px;
          height:32px;
          .el-dropdown__icon {
            &.el-icon-arrow-down {
              color: #6b69d6;
            }
          }
        }
      }
    }
    &.dropdownBtn8 {
      > button {
        border: none;
        color: #3575f6;
        &:hover {
          background-color: #ffffff;
        }
      }
    }
    &.dropdownBtn9 {
      > button {
        border: none;
        color: #44af69;
        &:hover {
          background-color: #ffffff;
        }
      }
    }
  }
}
</style>
