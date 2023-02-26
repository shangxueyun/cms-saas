<template>
    <div :class="[hourseList === 'on' ? 'hourseList marginLeft' : 'hourseList', hourseList === 'off' ? 'hourseList marginRight' : 'hourseList']">
      <div @click="changeHourse" class="closeHourse" v-if="!isHomeReference">
        <span v-if="hourseList !== 'on' " class="iconfont icon-rili"></span>
        <span v-if="hourseList === 'on' " class="iconfont icon-cha"></span>
      </div>
      <div class="content">
      	<div class="list">
      		<dl v-for="(item, i) in fieldsList" :key="i">
      			<dt :class="item.show ? 'act' : ''" @click="spread(i)">
      			  <img v-if="!item.show" :src="item.previewImage"/>
      			  <span class="over-hiden">{{item.projectName}}</span>
      			  <span v-if="!item.show" class="iconfont icon-bottom"></span>
      			  <span v-if="item.show" class="iconfont icon-top"></span>
      			</dt>
      			<dd v-if="item.show">
      			  <div class="ddbox" @click="chooseSoread(i, inx)" v-for="(items, inx) in item.buildingListDTOSet" :class="[items.choose ? 'active' : '', item.show ? 'animateDown' : '']" :key="inx">
      			  	<img :src="items.buildingImage"/>
                <p>
                  <span>{{items.buildingName}}</span>
                  <span>面积：{{items.managerArea}}㎡</span>
                </p>
      			  </div>
      			</dd>
      		</dl>
      	</div>
      </div>
    </div>  
</template>
<script>
import context from '@/service'
export default {
  name: 'projectSidebar',
  props: ['isHomeReference'], // 是否被首页当子组件引用
  data () {
    return {
      hourseList: '',
      fieldsList: [],
      buildsList: [],
      ids: []
    }
  },
  created () {

  },
  mounted () {
    this.loadProject()
  },
  methods: {
    loadProject () {
      context.http.get('/cms/api/project-managements/listBar').then(res => {
        res.data.forEach(item => {
          item.show = false
          res.data[0].show = true
          if (item.buildingListDTOSet) {
            item.buildingListDTOSet.forEach(items => {
              items.choose = false
            })
          }
        })
        this.fieldsList = res.data
      })
    },
    changeHourse () {
      if (this.hourseList === '') {
        this.hourseList = 'on'
      } else if (this.hourseList === 'on') {
        this.hourseList = 'off'
      } else {
        this.hourseList = 'on'
      }
      this.$emit('hourseList', this.hourseList)
    },
    spread (inx) {
      this.fieldsList.forEach((item, index) => {
        if (inx !== index) {
          item.show = false
        }
      })
      this.fieldsList[inx].show = !this.fieldsList[inx].show
    },
    chooseSoread (i, inx) {
      this.fieldsList[i].buildingListDTOSet[inx].choose = !this.fieldsList[i].buildingListDTOSet[inx].choose
      if (this.fieldsList[i].buildingListDTOSet[inx].choose) {
        this.buildsList.push(this.fieldsList[i].buildingListDTOSet[inx])
      } else {
        this.buildsList.splice(this.buildsList.indexOf(this.fieldsList[i].buildingListDTOSet[inx]), 1)
      }
      let arr = []
      this.buildsList.forEach(item => {
        arr.push(item.id)
      })
      this.ids = arr
      this.$emit('query', this.ids)
      this.$emit('buildsList', this.buildsList)
    },
    deleBuild (index) {
      if (this.buildsList[index].id) {
        this.fieldsList.forEach(item => {
          if (item.buildingListDTOSet) {
            item.buildingListDTOSet.forEach(items => {
              if (items.id === this.buildsList[index].id) {
                items.choose = false
              }
            })
          }
        })
      }
      this.buildsList.splice(index, 1)
      let arr = []
      this.buildsList.forEach(item => {
        arr.push(item.id)
      })
      this.ids = arr
      this.$emit('query', this.ids)
      this.$emit('buildsList', this.buildsList)
    }
  }
}
</script>
<style lang="scss" scoped>
.hourseList{
    position: fixed;
    right:-350px;
    top:50px;
    z-index:10;
    width:350px;
    height:100%;
    background: #fff;
    box-shadow:-5px 0 20px -5px #ddd;
    .closeHourse{
      position: absolute;
      left:-40px;
      top:50%;
      margin-top:-60px;
      width:40px;
      height:50px;
      background: #5482f7;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      cursor:pointer;
      z-index: 10;
      line-height: 50px;
      text-align: center;
      font-size: 18px;
      color:#fff;
    }
    .content{
      position: relative;
      width:100%;
      height:100%;
      overflow-y: auto;
      .list{
        dl{
          dt{
            border-bottom: 1px solid #efefef;
            height:90px;
            padding:20px 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            &.act{
              height:50px;
              padding:0px 16px;
              span{
                &.over-hiden{
                  width:280px;
                  white-space: nowrap;
                  word-break: break-all;
                  text-overflow:ellipsis;
                  overflow:hidden;
                }
                margin-left:0;
              }
            }
            img{
              display: block;
              width: 100px;
              height: 50px;
              float: left;
            }
            span{
              float: left;
              display: block;
              // line-height: 50px;
              color:#333;
              margin-left:16px;
              &.over-hiden{
                width:180px;
                white-space: nowrap;
                word-break: break-all;
                text-overflow:ellipsis;
                overflow:hidden;
              }
              &:last-child{
                float: right;
                color: #6473cb;
                margin-left:0;
              }
            }
          }
          dd{
            overflow: hidden;
            .ddbox{
              width:315px;
              border:1px solid #efefef;
              border-radius: 6px;
              margin:0 auto;
              padding:15px;
              display: flex;
              margin-top:16px;
              cursor: pointer;
              &.active{
                border:1px solid #6473cb;
                background: #f7f7f7;
              }
              &.animateDown{
                animation: slideInDown .4s 0s ease-out forwards;
              }
              &.animateUp{
                animation: slideInUp .4s 0s ease-out forwards;
              }
              img{
                width:100px;
                height:50px;
              }
              p{
                margin-left:14px;
                span{
                  display: block;
                  color:#737373;
                  font-size: 14px;
                  line-height: 14px;
                  &:first-child{
                    margin-top:16px;
                    margin-bottom:6px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .marginLeft{
    animation: cloud-on .2s 0s ease-out forwards;
  }
  .marginRight{
    animation: cloud-on2 .2s 0s ease-out forwards;
  }
  @keyframes cloud-in{
    0% {
      padding-right:0;
    }
    100%{
      padding-right:350px;
    }
  }
  @keyframes cloud-in2{
    0%{
      padding-right:350px;
    }
    100%{
      padding-right:0;
    }
  }
  @keyframes cloud-on{
    0%{
      right:-350px;
    }
    100%{
      right:0;
    }
  }
  @keyframes cloud-on2{
    0%{
      right:0;
    }
    100%{
      right:-350px;
    }
  }
  @-webkit-keyframes slideInDown {
    0% {
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
      visibility: visible;
    }

    100% {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes slideInDown {
    0% {
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
      visibility: visible;
    }

    100% {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }
  @-webkit-keyframes slideInUp {
    0% {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
     
    }
    100% {
       -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
      visibility: hidden;
    }
  }

  @keyframes slideInUp {
    0% {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }

    100% {
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
      visibility: hidden;
    }
  }
  
</style>
