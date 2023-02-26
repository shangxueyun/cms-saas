<template>
  <!-- <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :page-sizes="pageSizes"
      :layout="layout"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>
  </div> -->
  <div class="cms-pagination">
    <div class="pagingnum">
      显示 <select v-model="pageSize"
              @change="handleSizeChange">
        <option v-for="item in pageSizesList"
                :key="item"
                :label="item"
                :value="item">
        </option>
      </select>
      条目
    </div>
    <el-pagination v-if="total > 0"
                    background
                    layout="prev, pager, next"
                    :total="total"
                    :current-page.sync="currentPage"
                    :page-size.sync="pageSize"
                    @current-change="handleCurrentChange">
    </el-pagination>
    <span><span style="margin-right:10px">{{currentPage}}/{{totalPages}}页</span> 共{{total}}条记录</span>
  </div>
</template>
<script>
export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    pgSize: {
      type: Number,
      default: 15
    },
    pageSizesList: {
      type: Array,
      default () {
        return [15, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: { // 当前页
      get () {
        return this.page
      },
      set (val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: { // 每页显示多少条
      get () {
        return this.pgSize
      },
      set (val) {
        this.$emit('update:pgSize', val)
      }
    },
    totalPages () {
      return Math.ceil(this.total / this.pgSize)
    }
  },
  created () {
    console.log('page', this.page)
  },
  methods: {
    handleSizeChange (val) { // 改变每页展示条数
      this.$emit('pagination', { page: this.currentPage, pgSize: this.pageSize })
    },
    handleCurrentChange (val) { // 改变页数
      this.$emit('pagination', { page: val, pgSize: this.pageSize })
    }
  }
}
</script>
<style lang="scss">
// .pagination-container {
//   background: #fff;
//   padding: 32px 16px;
// }
// .pagination-container.hidden {
//   display: none;
// }
.cms-pagination {
  display: flex;
  justify-content: normal;
  // flex-direction: row-reverse;
  align-items: center;
  color: #3f5fbf;
  font-size: 12px;
  padding: 60px 20px 30px 20px;
  .pagingnum {
    color: #3f5fbf;
    font-size: 12px;
    select {
      width: 65px;
      height: 28px;
      border-radius: 2px;
      border-color: #f6f6f7;
      color: #3577f6;
    }
  }
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    margin: 0 5px;
    background-color: transparent;
    color: #3f5fbf;
    min-width: 30px;
    border-radius: 2px;
    font-size: 14px;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    border-radius: 50%;
    background-color: #3f5fbf !important;
    color: #fff !important;
  }
}
</style>
