
// 按需引入
const F2 = require('@antv/f2/lib/core') // 必须引入
require('@antv/f2/lib/geom/line') // 只加载折线图
require('@antv/f2/lib/geom/interval') // 只加载柱状图
require('@antv/f2/lib/geom/point') // 只加载点图

// 坐标系类型
require('@antv/f2/lib/coord/polar') // 极坐标
require('@antv/f2/lib/coord/cartesian') // 直角坐标系（已经在 core 核心包中）
// Axis 坐标轴类型
require('@antv/f2/lib/component/axis/circle') // 弧长坐标轴（用于极坐标）

// adjust 数据调整类型
require('@antv/f2/lib/geom/adjust/dodge') // 只加载分组类型

// 精细的动画模块（包含入场、更新以及销毁动画
const Animation = require('@antv/f2/lib/animation/detail')
F2.Chart.plugins.register(Animation) // 这里进行全局注册，也可以给 chart 的实例注册

require('@antv/f2/lib/geom/adjust/stack') // 引入数据层叠调整类型

// 第一步：加载需要的 guide 组件
require('@antv/f2/lib/component/guide') // 加载全部的 guide 组件
// 第二步：加载插件 Guide
const Guide = require('@antv/f2/lib/plugin/guide')
// 第三步：注册插件 Guide
F2.Chart.plugins.register(Guide) // 这里进行全局注册，也可以给 chart 的实例注册
// 第一步：加载插件 Tooltip
const Tooltip = require('@antv/f2/lib/plugin/tooltip')
// 第二步：注册插件 Tooltip
F2.Chart.plugins.register(Tooltip) // 这里进行全局注册，也可以给 chart 的实例注册
// 第一步：加载插件 Legend
const Legend = require('@antv/f2/lib/plugin/legend')
// 第二步：注册插件 Legend
F2.Chart.plugins.register(Legend) // 这里进行全局注册，也可以给 chart的实例注册

export default F2
