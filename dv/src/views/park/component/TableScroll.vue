<template>
  <div class="TableScroll">
    <!--滚动表格-->
    <section style="height: 100%;overflow: hidden;">
      <!--增加一个表头-->
      <el-table  class="hidden-tbody"  style="width: 100%;margina-top: 15px;">
        <el-table-column prop="organizeName" label="管理企业"></el-table-column>
        <el-table-column prop="buildingAmount" label="楼宇数量"></el-table-column>
        <el-table-column prop="area" label="总面积(㎡)"></el-table-column>
        <el-table-column prop="tatolAmount" label="企业数"></el-table-column>
      </el-table>
      <!--滚动的列表-->
      <vue-seamless-scroll v-if="optionSingleDis" :data="tableData"  class="auto-scorll-table" :class-option="optionSingleHeight">
        <el-table :data="tableData" :show-header="false" class="custom-table-2 hidden-thead mytable_header_no scrollColor">
          <el-table-column prop="organizeName" label="管理企业"></el-table-column>
          <el-table-column prop="buildingAmount" label="楼宇数量" ></el-table-column>
          <el-table-column prop="area" label="总面积(㎡)" ></el-table-column>
          <el-table-column prop="tatolAmount" label="企业数"></el-table-column>
        </el-table>
      </vue-seamless-scroll>
    </section>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        // 表格数据
        optionSingleDis: true,
        optionSingle: {
          step: 1, // 数值越大速度滚动越快
          autoPlay: false,
          limitMoveNum: 1, // 开始无缝滚动的数据量 this.dataList.length
          hoverStop: true, // 是否开启鼠标悬停stop
          direction: 1, // 0向下 1向上 2向左 3向右
          openWatch: false, // 开启数据实时监控刷新dom
          singleHeight: 34, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1 这里要变成你的一行表格的高度 可以审查元素
          waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
        }
      }
    },
    // 表格高度设置
    computed: {
      optionSingleHeight () {
        this.optionSingleDis = false
        let vm = this
        setTimeout(() => {
          vm.optionSingleDis = true
        }, 200)
        if (this.tableData.length >= 5) {
          this.optionSingle.autoPlay = true
        } else {
          this.optionSingle.autoPlay = false
        }
        return this.optionSingle
      }
    },
    props: {
      tableData: {
        type: Array,
        default: []
      }
    },
    // 加载滚动方法
    created () {
      this.fetchData()
    },
    methods: {
      // 滚动插件方法
      async fetchData () {
        // const resstep2 = await getLatestBlocksInfoJsonStr()
        // let jsonlist = JSON.parse(resstep2.data.blockHeight)
        // console.log(jsonlist)
        // this.listData = jsonlist
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "../../../style/config.scss";
@import "../../../style/mixins.scss";
  .hidden-tbody.el-table {
    height: px2rem(64);
    box-sizing: border-box;
    tbody { //隐藏上面表格的tbody
      display: none;
      overflow: hidden;
    }
  }
  .auto-scorll-table {
    height: calc(100% - px2rem(64));
    overflow: hidden;
  }
  .hidden-thead.el-table {
    border-top: none; //防止边框重叠
    thead { //隐藏下面表格的thead
      display: none;
      overflow: hidden;
    }
  }
  .mytable_header .el-table__empty-block{
    display: none;
  }
  .mytable_header_no .has-gutter{
    display: none;
  }
</style>
<style lang="scss">
@import "../../../style/config.scss";
@import "../../../style/mixins.scss";
.TableScroll{
  .el-table__empty-text {
    color: #fff;
  }
  .el-table{
    background: transparent;
  }
  .el-table tr{
    background: transparent;
    border: none;
  }
  .el-table__header{
    border: none;
  }
  .el-table thead{
    border: none;
  }
  .el-table td{
    border: none;
  }
  .el-table--enable-row-hover .el-table__body tr:hover>td{
    background: transparent;
  }
  .auto-scorll-table .el-table tr:nth-child(even){
    background: rgba(77,163,198,0.4);
  }
  .auto-scorll-table .el-table tr td{
    border: none;
    padding: 0px 0 !important;
    line-height: px2rem(66);
    text-align: center;
    background: transparent;
    color: #fff;
    font-size: px2rem(24);
  }
  .auto-scorll-table .el-table tr td div{
    line-height: px2rem(68);
  }
  .auto-scorll-table .el-table tr td:last-child div{
    color: #F2B46D;
  }
  
  .el-table__header thead tr th{
    border: none;
    padding: 0px 0 !important;
    line-height: px2rem(60);
    text-align: center;
    background: rgba(72,103,157,0.4);
    color: #66DEF9;
    font-size: px2rem(12);
  }
  .el-table th>.cell{
    line-height: px2rem(60);
    border: none;
  }
  .el-table::before{
    display: none;
  }
  .auto-scorll-table>div>div:last-child .el-table tr:nth-child(odd){
    background: rgba(77,163,198,0.4);
  }
  .auto-scorll-table>div>div:last-child .el-table tr:nth-child(even){
    background: transparent;
  }
}
</style>
