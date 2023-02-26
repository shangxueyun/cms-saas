/* eslint-disable indent */
const EquipmentConfigJSON = [
  // ----------------------
  {
    label: '建筑系统',
    value: 1,
    children: [{
      label: '电梯',
      value: 7,
      key: ['电梯']
    }, {
      label: '自动扶梯',
      value: 8,
      key: ['自动扶梯']
    }, {
      label: '卫生间',
      value: 9,
      key: ['卫生间']
    }, {
      label: '机械车位',
      value: 10,
      key: ['机械车位']
    }]
  },
  // ----------------------
  {
    label: '消防系统',
    value: 2,
    children: [{
      label: '灭火系统',
      value: 11,
      key: ['消防泵房', '室内消火栓箱', '手提式灭火器', '阀门', '喷淋', '排烟机房', '消火栓']
    }, {
      label: '报警系统',
      value: 12,
      key: ['火警报警按钮', '烟感探测器', '火警报警装置']
    }, {
      label: '联动分区系统',
      value: 13,
      key: ['消防控制室', '防火卷帘门']
    }]
  },
  // ----------------------
  {
    label: '强电系统',
    value: 3,
    children: [{
      label: '照明子系统',
      value: 14,
      key: ['照明设备']
    }]
  },
  // ----------------------
  {
    label: '弱电系统',
    value: 4,
    children: [{
      label: '闭路监控子系统',
      value: 17,
      key: ['监控室']
    }, {
      label: '车辆管理系统',
      value: 18,
      key: ['车辆管理设备']
    }, {
      label: '门禁管理系统',
      value: 19,
      key: ['道闸']
    }, {
      label: '网络系统',
      value: 20,
      key: ['网络机房']
    }, {
      label: '背景音乐系统',
      value: 21,
      key: ['音乐设备']
    }, {
      label: '设备间',
      value: 29,
      key: ['弱电间', '弱电机房']
    }]
  },
  // ----------------------
  {
    label: '暖通系统',
    value: 5,
    children: [{
      label: '空调系统',
      value: 22,
      key: ['空调机房', '空调室内机', '空调室外机']
    }]
  },
  // ----------------------
  {
    label: '能耗系统',
    value: 25,
    children: [{
      label: '水',
      value: 26,
      key: ['水表', '水阀门开关', '生活水箱', '水泵房']
    }, {
      label: '电',
      value: 27,
      key: ['电表', '电箱控制柜', '高配间', '强电间', '配电柜', '空调机房', '空调室内机', '空调室外机', '照明设备'] // 需求迭代 暖通强电类下 设备名移到 电
    }, {
      label: '燃气',
      value: 28,
      key: ['燃气阀门', '燃气表', '燃气设备']
    }]
  }
]
export default EquipmentConfigJSON
