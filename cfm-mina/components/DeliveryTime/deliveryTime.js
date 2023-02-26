import HttpService from '../../utils/http.js'
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {

  },
  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    projectManagementId: wx.getStorageSync('projectManagementId'),
    showModalStatus: false,
    currentDate: 0,
    dateList: [],
    animationData: {},
    currentTime: {
      parentIndex: -1,
      index: -1
    }
  },
  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function () {
      this.setData({
        projectManagementId: wx.getStorageSync('projectManagementId')
      })
      // 在组件实例进入页面节点树时执行
      // if (wx.getStorageSync('currentTime')) {
      //   let currentTime = wx.getStorageSync('currentTime')
      //   this.setData({currentTime})
      // } else {
      // 默认选择第一个配送时间
      // wx.setStorageSync('currentTime', {
      //   index: 0,
      //   parentIndex: 0
      // })
      // this.setData({
      //   currentTime: {
      //     index: 0,
      //     parentIndex: 0
      //   }
      // })
      // }
      // wx.setStorageSync('dateList', this.data.dateList)

    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  pageLifetimes: {
    show: function() {
      // 页面被展示
      // if (wx.getStorageSync('currentTime')) {
      //   let currentTime = wx.getStorageSync('currentTime')
      //   this.setData({currentTime})
      // }
    },
    hide: function() {
      // 页面被隐藏
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  },
  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    _getDateList (item) {
      let startTime = item.planDeliveryTime
      let endTime = item.planLastDeliveryTime
      HttpService.get('/ord/api/marketConfigs/deliverys',{
        projectManagementId: this.data.projectManagementId
      }
      ).then(res => {
        if (res.statusCode === 200) {
          let currentTime = {index: -1,parentIndex: -1}
          let query = false
          res.data.map((item,index) => {
            item.child.map((e,ind) => {
              e.planDeliveryTime = e.startTime.substring(e.startTime.indexOf('T')+1,e.startTime.lastIndexOf(':'))
              e.planLastDeliveryTime = e.endTime.substring(e.endTime.indexOf('T')+1,e.startTime.lastIndexOf(':'))
              let estartTime = e.startTime.substring(0,19)
              let eendTime = e.endTime.substring(0,19)
              if (startTime === estartTime && endTime === eendTime) {
                currentTime.index = ind
              }
            })
            if (query) {
              return
            } else if (currentTime.index !== -1){
              query = true
              currentTime.parentIndex = index
            }
          })
          if (currentTime.index === -1 &&currentTime.parentIndex === -1) {
            currentTime = {index: 0,parentIndex: 0}
          }
          this.setData({
            dateList: res.data,
            currentTime: currentTime
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    _hideModal() {
      // 隐藏遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus: false
        })
      }.bind(this), 100)
    },
    _showModal: function (item) {
      // 回显选中的时间段
      // let parentindex = item.parentindex || item.order.parentindex
      // let index = item.index || item.order.index
      // this.setData({
      //   currentTime: {
      //     index: index,
      //     parentIndex: parentindex
      //   }
      // })
      this._getDateList(item)
      
      this.data.orderId = item.id
      // 显示遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 100)
    },
    _tabChange(e) {
      this.setData({
        currentDate: e.currentTarget.dataset.index
      })
    },
    _chooseDate: function (e) {
      this.setData({
        currentTime: {
          index: e.currentTarget.dataset.index,
          parentIndex: e.currentTarget.dataset.parentindex
        }
      })
      wx.setStorageSync('currentTime',this.data.currentTime)
      this._hideModal()

      var dateList = this.data.dateList
      var currentTime = this.data.currentTime
      let planDeliveryTime = dateList[currentTime.parentIndex].child[currentTime.index].startTime.substring(0,19)
      let planLastDeliveryTime = dateList[currentTime.parentIndex].child[currentTime.index].endTime.substring(0,19)
      var postData = {
        id: this.data.orderId,
        planDeliveryTime: planDeliveryTime,
        planLastDeliveryTime: planLastDeliveryTime
      }

      HttpService.put(`/ord/api/orders`, postData).then(res => {
        if (res.statusCode === 200) {
          // this.triggerEvent('backTime', res)
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
          //触发回调
          this.triggerEvent("querylEvent")
        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'error',
            duration: 2000
          })
        }
      })
    },
  }
})