<template>
  <div>
    <div class="btc-title">用户数据</div>
    <div class="user-content content-bg">
      <div class="uc-item">
        <div class="item-title">下单用户男女比例占比</div>
        <div id="MWProportion" style="width: 100%;height:100%;"></div>
      </div>
      <div class="uc-item">
        <div class="item-title">下单用户职业比例占比</div>
        <div id="occupation" style="width: 100%;height:100%;"></div>
      </div>
      <div class="uc-item">
        <div class="item-title">下单用户年龄占比</div>
        <div id="Age" style="width: 90%;height:90%;"></div>
      </div>
      <div class="uc-item">
        <div class="item-title">下单用户收入占比</div>
        <div id="income" style="width: 80%;height:90%;"></div>
      </div>
    </div>
  </div>
</template>
<script>
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
export default {
  name: 'userData',
  mounted () {
    this.MWProportion()
    this.occupation()
    this.Age()
    this.income()
  },
  methods: {
    MWProportion () {
      let myChart = echarts.init(document.getElementById('MWProportion'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '男女占比',
            type: 'pie',
            center: ['50%', '55%'],
            radius: ['50%', '60%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                color: '#c1cce2',
                fontSize: '10',
                formatter: '{b}: {d}%'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              show: true,
              length: 20,
              length2: 20
            },
            data: [
              {value: 30,
                name: '男',
                itemStyle: {
                  color: {
                    colorStops: [{
                      offset: 0, color: '#068cff' // 0% 处的颜色
                    }, {
                      offset: 1, color: '#4549ff' // 100% 处的颜色
                    }]
                  }
                }},
              {value: 70,
                name: '女',
                itemStyle: {
                  color: {
                    colorStops: [{
                      offset: 0, color: '#702ffe' // 0% 处的颜色
                    }, {
                      offset: 1, color: '#b611e9' // 100% 处的颜色
                    }]
                  }
                }}
            ]
            // color: {
            //   colorStops: [{
            //     offset: 0, color: '#068cff' // 0% 处的颜色
            //   }, {
            //     offset: 1, color: '#4549ff' // 100% 处的颜色
            //   }]
            // }
          }
        ]
      }
      myChart.setOption(option)
    },
    occupation () {
      let myChart = echarts.init(document.getElementById('occupation'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '职业占比',
            type: 'pie',
            center: ['50%', '55%'],
            radius: ['50%', '60%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                color: '#c1cce2',
                fontSize: '10',
                formatter: '{b}: {d}%'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '18',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 20
            },
            data: [
              {value: 5,
                name: '政府机构',
                itemStyle: {
                  color: {
                    colorStops: [{
                      offset: 0, color: '#ff754f' // 0% 处的颜色
                    }, {
                      offset: 1, color: '#ffaa3c' // 100% 处的颜色
                    }]
                  }
                }},
              {value: 15,
                name: '教育',
                itemStyle: {
                  color: {
                    colorStops: [{
                      offset: 0, color: '#42d9a6' // 0% 处的颜色
                    }, {
                      offset: 1, color: '#21d3b3' // 100% 处的颜色
                    }]
                  }
                }},
              {value: 12,
                name: '制造业',
                itemStyle: {
                  color: {
                    colorStops: [{
                      offset: 0, color: '#04e0f9' // 0% 处的颜色
                    }, {
                      offset: 1, color: '#04e0f9' // 100% 处的颜色
                    }]
                  }
                }},
              {value: 8,
                name: '医疗行业',
                itemStyle: {
                  color: {
                    colorStops: [{
                      offset: 0, color: '#f9387f' // 0% 处的颜色
                    }, {
                      offset: 1, color: '#f9387f' // 100% 处的颜色
                    }]
                  }
                }},
              {value: 8,
                name: '金融',
                itemStyle: {
                  color: {
                    colorStops: [{
                      offset: 0, color: '#4748ff' // 0% 处的颜色
                    }, {
                      offset: 1, color: '#3f50ff' // 100% 处的颜色
                    }]
                  }
                }},
              {value: 24,
                name: '服务业',
                itemStyle: {
                  color: {
                    colorStops: [{
                      offset: 0, color: '#57b5fc' // 0% 处的颜色
                    }, {
                      offset: 1, color: '#3d8ffd' // 100% 处的颜色
                    }]
                  }
                }},
              {value: 22,
                name: '互联网',
                itemStyle: {
                  color: {
                    colorStops: [{
                      offset: 0, color: '#b11bd5' // 0% 处的颜色
                    }, {
                      offset: 1, color: '#8f26fa' // 100% 处的颜色
                    }]
                  }
                }},
              {value: 6,
                name: '其他',
                itemStyle: {
                  color: {
                    colorStops: [{
                      offset: 0, color: '#fec100' // 0% 处的颜色
                    }, {
                      offset: 1, color: '#dfb60e' // 100% 处的颜色
                    }]
                  }
                }}
            ]
          }
        ]
      }
      myChart.setOption(option)
    },
    Age () {
      let myChart = echarts.init(document.getElementById('Age'))
      let option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '40%',
          top: 45,
          bottom: '15%'
        },
        xAxis: [
          {
            type: 'category',
            data: ['0-18', '18-25', '25-30', '30-40', '40-50', '50-60', '60以上'],
             // data: daysArr,
            axisPointer: {
              type: 'shadow'
            },
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              textStyle: {
                color: '#c1cce2',  // 更改坐标轴文字颜色
                fontSize: 10      // 更改坐标轴文字大小
              }
            },
            axisLine: {
              lineStyle: {
                color: '#c1cce2'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            // min: 0,
            // max: 3456,
            minInterval: 1,
            axisLabel: {
              formatter: '{value}',
              textStyle: {
                color: '#c1cce2',  // 更改坐标轴文字颜色
                fontSize: 10      // 更改坐标轴文字大小
              }
            },
            axisLine: {
              lineStyle: {
                color: '#c1cce2'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: ['#c1cce2']
              }
            }
          }
        ],
        series: [
          {
            name: '年龄占比',
            type: 'bar',
            barWidth: '20%',
            itemStyle: {
              normal: {
                barBorderRadius: [2, 2, 0, 0],
                color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                  [
                            {offset: 0, color: '#95f3d1'},
                            {offset: 1, color: '#3eb7f3'}
                  ]
                    )
              }
            },
            label: { show: false, color: '#fff' },
            data: [144, 648, 936, 3456, 1296, 576, 144]
             // data: perCustomer
          }
        ]
      }
      myChart.setOption(option)
    },
    income () {
      let myChart = echarts.init(document.getElementById('income'))
      let option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '20%',
          top: 45,
          bottom: '15%'
        },
        xAxis: [
          {
            type: 'category',
            data: ['0.3以下', '0.3-0.5', '0.5-0.8', '0.8-1', '1-2', '2以上'],
             // data: daysArr,
            axisPointer: {
              type: 'shadow'
            },
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              textStyle: {
                color: '#c1cce2',  // 更改坐标轴文字颜色
                fontSize: 10      // 更改坐标轴文字大小
              }
            },
            axisLine: {
              lineStyle: {
                color: '#c1cce2'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            // max: 2808,
            minInterval: 1,
            axisLabel: {
              formatter: '{value}',
              textStyle: {
                color: '#c1cce2',  // 更改坐标轴文字颜色
                fontSize: 10      // 更改坐标轴文字大小
              }
            },
            axisLine: {
              lineStyle: {
                color: '#c1cce2'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: ['#c1cce2']
              }
            }
          }
        ],
        series: [
          {
            name: '年龄占比',
            type: 'bar',
            barWidth: '20%',
            itemStyle: {
              normal: {
                barBorderRadius: [2, 2, 0, 0],
                color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                  [
                            {offset: 0, color: '#f0c19e'},
                            {offset: 1, color: '#fc7f85'}
                  ]
                    )
              }
            },
            label: { show: false, color: '#fff' },
            data: [72, 432, 1728, 2808, 1584, 576]
             // data: perCustomer
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../../style/config.scss";
  .btc-title{
    font-size: px2rem(48);
    color: #fff;
  }
  .user-content{
    width: px2rem(1655);
    height: px2rem(730);
    margin-top: px2rem(30);
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .content-bg{
    border-radius: px2rem(10);
    background-color: #354068;
    opacity: 0.7;
  }
  .uc-item{
    width: px2rem(800);
    height: px2rem(360);
  }
  .uc-item .item-title{
    position: relative;
    top: px2rem(20);
    font-size: px2rem(18);
    color: #c0cde2;
    text-align: center;
  }
</style>

