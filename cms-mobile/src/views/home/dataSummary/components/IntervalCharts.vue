<template>
  <div>
    <canvas :id="chartsConfig.id"
            class="myChart"></canvas>
  </div>
</template>
<script>
export default {
  name: 'interval',
  props: {
    chartsConfig: {
      type: Object,
      default: () => {
        return {
          id: '',
          data: {},
          defs: {},
          textContent: '',
          color: []
        }
      }
    }
  },
  watch: {
    chartsConfig: function () {
      this.$nextTick(() => {
        this.initChar()
      })
    }
  },
  data () {
    return {

    }
  },
  mounted () {
  },
  methods: {
    initChar () {
      // const data = [
      //   { projectName: '马桥', collectionRate: 0 },
      // ]
      // Step 1: 创建 Chart 对象
      const data = this.chartsConfig.data
      const textContent = this.chartsConfig.textContent
      const chart = new this.$F2.Chart({
        id: this.chartsConfig.id,
        pixelRatio: window.devicePixelRatio // 指定分辨率
      })
      // Step 2: 载入数据源
      const defs = {
        x: {
          // tickCount: 6 // 区间，写几个就有几个区间
        },
        y: {
          alias: 'x轴说明' // x轴说明
        }
      }
      data.forEach(v => {
        v.y = Number(v.y)
      })
      const asDefs = Object.assign({}, defs, this.chartsConfig.defs)
      chart.source(data, asDefs)
      // Tooltip 配置
      chart.tooltip({
        // alwaysShow: true,
        showTitle: true, // 展示  tooltip 的标题
        layout: 'vertical',
        offsetY: 20,
        background: {
          radius: 2,
          fill: '#656464',
          opacity: 0.1,
          padding: [6, 10]
        },
        onShow: function onShow (ev) {
          let items = ev.items
          // let { name, title } = ev.items[0]
          // items[0].name = title
          // items[0].title = name
          items[0].value = items[0].value + textContent
        },
        titleStyle: {
          fill: '#656464'
        }, // tooltip 标题的文本样式配置，showTitle 为 false 时不生效
        nameStyle: {
          fill: '#656464'
        }, // tooltip name 项的文本样式配置
        valueStyle: {
          fill: '#656464'
        } // tooltip value 项的文本样式配置
      })
      // 辅助标记
      chart.guide().text({
        position: ['min', 'max'],
        content: this.chartsConfig.textContent, // 标记内容
        style: {
          fill: '#858C94', // 文本颜色
          textBaseline: 'middle',
          textAlign: 'start'
        },
        offsetY: -23,
        offsetX: -25
      })
      chart.axis('x', {
        label: {
          rotate: -Math.PI / 3,
          textAlign: 'end',
          textBaseline: 'middle'
        }
      })
      // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
      chart.interval().position('x*y').style({
        radius: [2, 2, 0, 0]
      }).size(12).color(`l(90) 0:${this.chartsConfig.color[0]} 1:${this.chartsConfig.color[1]}`)
      // Step 4: 渲染图表
      chart.render()
    },
    initChar11 (data) {
      // const data = [
      //   { projectName: '马桥', collectionRate: 0 },
      // ]
      // Step 1: 创建 Chart 对象
      const chart = new this.$F2.Chart({
        id: 'myChartForSJL',
        pixelRatio: window.devicePixelRatio // 指定分辨率
      })
      // Step 2: 载入数据源
      chart.source(data, {
        projectName: {
          tickCount: 6 // 区间，写几个就有几个区间
        },
        collectionRate: {
          alias: '收缴率%' // x轴说明
        }
      })
      // Tooltip 配置
      chart.tooltip({
        showTitle: true, // 展示  tooltip 的标题
        layout: 'vertical',
        offsetY: 20,
        background: {
          radius: 2,
          fill: '#656464',
          opacity: 0.1,
          padding: [6, 10]
        },
        titleStyle: {
          fill: '#656464'
        }, // tooltip 标题的文本样式配置，showTitle 为 false 时不生效
        nameStyle: {
          fill: '#656464'
        }, // tooltip name 项的文本样式配置
        valueStyle: {
          fill: '#656464'
        } // tooltip value 项的文本样式配置
      })
      // 辅助标记
      chart.guide().text({
        position: ['min', 'max'],
        content: '单位：%',
        style: {
          fill: '#858C94', // 文本颜色
          textBaseline: 'middle',
          textAlign: 'start'
        },
        offsetY: -23,
        offsetX: -25
      })
      // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
      chart.interval().position('projectName*collectionRate').style({
        radius: [2, 2, 0, 0]
      }).size(12).color('l(90) 0:#68D0FB 1:#1552FF')
      // Step 4: 渲染图表
      chart.render()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../../style/config";
.myChart {
  width: 100%;
  height: rem(190);
}
</style>
