<template>
  <div class="ui_zk">
    <div class="item_box">
      <p>默认Tab</p>
      <ul class="default_tab_block">
        <li @click="changeDefaultTab('1')" :class="{'active': defaultTabState === '1'}">
          <span>默认Tab1</span>
        </li>
        <li @click="changeDefaultTab('2')" :class="{'active': defaultTabState === '2'}">
          <div class="tab_badge">
            <span>默认Tab2</span>
            <span v-if="count > 0">{{count}}</span>
          </div>
        </li>
        <li @click="changeDefaultTab('3')" :class="{'active': defaultTabState === '3'}">
          <span>默认Tab3</span>
        </li>
        <li @click="changeDefaultTab('4')" :class="{'active': defaultTabState === '4'}">
          <span>默认Tab4</span>
        </li>
      </ul>
    </div>
    <div class="item_box">
      <p>二级Tab</p>
      <ul class="second_tab_block">
        <li @click="changeSecondTab('1')" :class="{'active': secondTabState === '1'}">二级Tab1</li>
        <li @click="changeSecondTab('2')" :class="{'active': secondTabState === '2'}">二级Tab2</li>
        <li @click="changeSecondTab('3')" :class="{'active': secondTabState === '3'}">二级Tab3</li>
        <li @click="changeSecondTab('4')" :class="{'active': secondTabState === '4'}">二级Tab4</li>
      </ul>
    </div>
    <div class="item_box">
      <p>临近Tab</p>
      <ul class="Lj_tab_block">
        <li @click="changeLjTab('1')" :class="{'active': LjTabState === '1'}">临近Tab1</li>
        <li @click="changeLjTab('2')" :class="{'active': LjTabState === '2'}">临近Tab2</li>
        <li @click="changeLjTab('3')" :class="{'active': LjTabState === '3'}">临近Tab3</li>
        <li @click="changeLjTab('4')" :class="{'active': LjTabState === '4'}">临近Tab4</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      defaultTabState: '1', // 默认Tab
      secondTabState: '1', // 二级Tab
      LjTabState: '1', // 临近Tab
      count: 5
    }
  },
  created () {

  },
  methods: {
    // 默认Tab
    changeDefaultTab (state) {
      this.defaultTabState = state
    },
    // 二级Tab
    changeSecondTab (state) {
      this.secondTabState = state
    },
    // 临近Tab
    changeLjTab (state) {
      this.LjTabState = state
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./css/zk.scss";
.ui_zk{
    width:100%;
    margin: 0px auto 30px;
    .item_box{
      margin-bottom:30px;
      p{
        line-height: 50px;
        font-size: 18px;
      }
    }
}
</style>
