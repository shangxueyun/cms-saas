<template>
  <div class="messageManagement">
    <p class="page_head_title">发版公告</p>
    <div class="hourse_container">
      <ul class="default_tab_block">
        <li @click="changeNav(index)"
            v-for="(item, index) in navList"
            :key="index"
            :class="item.actived ? 'active' : ''">
          <el-badge :value="item.unReadCount"
                    :max="99"
                    class="item"
                    :hidden="item.unReadCount===0"
                    style="height: 26px;line-height: 26px;">
            {{item.label}}
          </el-badge>
        </li>
      </ul>
      <div class="hourse_search">
        <div class="search-top clearing">
          <div class="date-select">
            <el-date-picker v-model="startDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="开始时间">
            </el-date-picker>
          </div>
          <span class="split">-</span>
          <div class="marginRights">
            <el-date-picker v-model="endDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="结束时间">
            </el-date-picker>
          </div>
          <div @click="search"
               class="query-btn tenant-btn">查询</div>
        </div>
      </div>
      <div class="hourse-table">
        <div class="table">
          <el-table :data="tableData"
                    style="width: 100%">
            <el-table-column label="标题"
                             align="center">
              <template slot-scope="scope">
                <p class="messsagePoint"><span>{{scope.row.message.title}}</span><span class="curcle"
                        v-if="!scope.row.readed"></span></p>
              </template>
            </el-table-column>
            <el-table-column prop="message.overview"
                             label="概览"
                             align="center"></el-table-column>
            <el-table-column prop="message.sendTime"
                             label="时间"
                             :formatter="formatDate"
                             align="center"></el-table-column>
            <el-table-column label="操作"
                             align="center">
              <template slot-scope="scope">
                <el-button @click="handleEdit(scope.row.id)"
                           class="el-button--primary operation-btn"
                           size="mini">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="ctc-foot">
        <div class="page">
          <div class="pagingnum">显示
            <select v-model="pager.pgSize"
                    @change="currentSel">
              <option v-for="item in pager.pgNumoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </option>
            </select>
            条目 <span style="padding-left: 30px">显示从{{pager.pgSize*(pager.currentPage - 1) + 1}}到{{pager.pgSize*pager.currentPage}}项结果，共<span class="style: red">{{pager.total}}</span>条</span>
          </div>
          <el-pagination v-if="pager.total > 0"
                         background
                         layout="prev, pager, next"
                         :page-size=pager.pgSize
                         :total="pager.total"
                         :current-page="pager.currentPage"
                         @current-change="current_change">
          </el-pagination>
        </div>
      </div>

      <el-drawer title="发版公告"
                 :visible.sync="drawer"
                 direction="rtl"
                 class="messageDrawer">
        <div v-if="messageDetail.message"
             class="message-head">
          <p>{{messageDetail.message.title}}</p>
          <p v-if="messageDetail.message.sendTime">{{messageDetail.message.sendTime.substring(0, 16).replace('T', ' ')}}</p>
        </div>
        <div v-if="messageDetail.message"
             class="message-body">
          <div v-if="messageDetail.message.messageContent"
               v-html="messageDetail.message.messageContent"></div>
        </div>
        <div class="dialog-footer message-foot">
          <el-button @click="drawer=false"
                     class="close-button">关 闭</el-button>
        </div>
      </el-drawer>

    </div>
  </div>
</template>
<script>
import context from '@/service'
import * as hub from '@/service/eventHub'
export default {
  name: 'messageManagement',
  data () {
    return {
      navList: [
        { label: '消息', value: 'MESSAGE', unReadCount: '', actived: false },
        { label: '通知', value: 'NOTIFY', unReadCount: '', actived: false },
        { label: '发版公告', value: '', unReadCount: '', actived: true }
      ],
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
      tableData: [],
      startDate: '',
      endDate: '',
      drawer: false,
      messageDetail: ''
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  mounted () {
    this.queryInfo()
    if (this.id) {
      this.handleEdit(this.id)
    }
    hub.eventHub.$on('handleEdit', id => {
      this.handleEdit(id)
    })
  },
  beforeDestroy () {
    hub.eventHub.$off('handleEdit')
  },
  methods: {
    notReadCount (messageCenterType) {
      context.http.get('/mps/api/messageCenters/notReadCount', { messageCenterType: messageCenterType }).then(res => {
        if (res.status === 200) {
          if (messageCenterType === 'MESSAGE' && res.data !== '0') this.navList[0].unReadCount = res.data
          if (messageCenterType === 'NOTIFY' && res.data !== '0') this.navList[1].unReadCount = res.data
        }
      }).catch(error => {
        console.info(error)
      })
    },
    queryInfo () {
      this.query()
      this.notReadCount('MESSAGE')
      this.notReadCount('NOTIFY')
    },
    changeNav (inx) {
      if (inx === 0) {
        this.$router.push({ name: 'messageCenter', query: { messageCenterType: 'MESSAGE', changeTab: true } })
      } else if (inx === 1) {
        this.$router.push({ name: 'messageCenter', query: { messageCenterType: 'NOTIFY', changeTab: true } })
      }
    },
    formatDate (row, column) {
      if (row.message.sendTime) {
        return row.message.sendTime.substring(0, 16).replace('T', ' ')
      }
    },
    search () {
      this.pager.currentPage = 1
      this.query()
    },
    handleEdit (id) {
      context.http.get('mps/api/messageUsers/' + id).then(res => {
        hub.eventHub.$emit('getMessage')
        this.query()
        this.messageDetail = res.data
        this.drawer = true
      })
    },
    current_change (currentPage) {
      this.pager.currentPage = currentPage
      this.query()
    },
    currentSel () {
      this.pager.currentPage = 1
      this.query()
    },
    async query () {
      let result = await context.http.get('mps/api/messageUsers?sort=message.sendTime,desc&sort=createdDate,desc', { page: (this.pager.currentPage - 1), size: this.pager.pgSize, startDate: this.startDate, endDate: this.endDate })
      let all = (this.pager.currentPage - 1) * this.pager.pgSize
      this.tableData = result.data
      this.pager.total = Number(result.headers['x-total-count'])
    }
  }
}
</script>
<style lang="scss">
.messageDrawer {
  .rtl {
    width: 740px !important;
  }
}
</style>
<style scope lang="scss">
@import "../../../style/config";
.messsagePoint {
  position: relative;
  height: 24px;
  display: flex;
  justify-content: center;
  span {
    display: block;
    height: 24px;
    line-height: 24px;
  }
  .curcle {
    width: 7px;
    height: 7px;
    background: rgba(182, 1, 1, 1);
    border-radius: 50%;
    margin-top: 4px;
    margin-left: 1px;
  }
}
.message-foot {
  border-top: 1px solid #e5e5e5;
  padding: 20px 0;
  text-align: right;
  margin-top: 100px;
}
.message-head {
  border-bottom: 1px solid #e5e5e5;
  padding: 10px 0 15px;
  p {
    text-align: center;
    font-size: 14px;
    &:last-child {
      font-size: 12px;
      color: #666666;
      margin-top: 6px;
    }
  }
}
.message-body {
  padding: 20px 10px;
  min-height: 600px;
  ul {
    list-style: disc;
    li {
      list-style: disc;
    }
  }
  ol {
    list-style: decimal;
    li {
      list-style: decimal;
    }
  }
}
.messageManagement {
  font-size: 16px;
  background-color: #f9f9f9;
  .page {
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    padding: 0px 30px 30px 30px;
    padding-top: 0 !important;
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
  .hourse_container {
    background-color: #f9f9f9;
    .default_tab_block {
      font-size: 14px;
    }
    .typeTab {
      height: 50px;
      line-height: 50px;
      background-color: #ffffff;
      margin-top: 15px;
      box-shadow: 4px 4px 4px 1px #eee;
      display: flex;
      > span {
        display: block;
        width: 120px;
        text-align: center;
        cursor: pointer;
        font-size: 14px;
        &.active {
          color: #3175d2;
          border-bottom: 2px solid #3175d2;
        }
      }
    }
    .hourse_search {
      background-color: #fff;
      margin: 20px 0 10px 0px;
      box-shadow: 1px 2px 5px #eee;
      border-radius: 3px;
      .search-top {
        border-bottom: 1px solid #ecedef;
        padding-bottom: 18px;
        padding-left: 18px;
        .tenant-btn {
          width: 120px;
          height: 32px;
          line-height: 32px;
          margin-left: 20px;
          margin-top: 22px;
        }
        .el-input {
          width: 230px;
          height: 40px;
          display: block;
          margin-top: 18px;
          input {
            width: 230px;
            height: 40px;
          }
        }
        div {
          float: left;
          display: inline-block;
        }
        div {
          cursor: pointer;
        }
        .split {
          color: rgba(229, 229, 229, 1);
          width: 30px;
          height: 40px;
          margin-top: 18px;
          line-height: 40px;
          text-align: center;
          display: block;
          float: left;
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
  }
}
</style>
