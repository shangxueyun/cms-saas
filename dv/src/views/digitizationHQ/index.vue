/* eslint-disable no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
<template>
  <div class="digitizationHQ">
    <div id="container1"></div>
    <!-- <div class="mask">
      <div class="light"></div>
    </div> -->
    <audio loop
           autoplay
           id="audio">
      <source :src="musicSource"
              type="audio/mp3">
    </audio>
  </div>
</template>
<script>
import AMap from 'AMap'
// eslint-disable-next-line no-unused-vars
import service from '@/service'
import markericon from '../../assets/new/marker.png'
import musicSource from '../../assets/new/OvertheRainbow-DannyWright.mp3'
import hqJson from './data'
export default {
  name: 'park',
  props: {
    // coordsPATHData: {
    //   type: Array,
    //   default: () => {
    //     return [
    //       {
    //         center: [121.38083, 31.182773],
    //         name: '虹桥总部2号',
    //         path: [[121.380584, 31.183292], [121.38053, 31.183053], [121.38046, 31.182879], [121.379543, 31.1827], [121.379747, 31.182159], [121.380905, 31.182333], [121.382311, 31.183049], [121.381919, 31.183476], [121.38061, 31.183292]]
    //       }
    //     ]
    //   }
    // }
  },
  watch: {
    // coordsPATHData: {
    //   handler (newValue, oldValue) {
    //     console.log('watch')
    //     this.switchUpdateCoords()
    //   },
    //   deep: true
    // }
  },
  data () {
    return {
      coordsPATHData: [],
      icon1: markericon,
      map: null,
      mapAnimateControl: false,
      musicSource: musicSource
    }
  },
  created () {

  },
  mounted () {
    // this.switchUpdateCoords()
    // this.toggleSound()
  },
  methods: {
    // initMap (data) {
    //   let _this = this
    //   if (_this.map) {
    //     _this.map.destroy()
    //   }
    //   // console.log(hqJson.hongqiao)
    //   let features = data.map((item, index) => {
    //     if (item.path.length) {
    //       let obj = {
    //         'type': 'Feature',
    //         'geometry': {
    //           'type': 'Point',
    //           'coordinates': item.center
    //         },
    //         'properties': {
    //           'name': item.name,
    //           'price': 65000,
    //           'count': 92
    //         }
    //       }
    //       return obj
    //     }
    //   }).filter(item => item)
    //   _this.map = new AMap.Map('container1', {
    //     zoom: 15.3,
    //     center: [121.386406, 31.176968],
    //     pitch: 80,
    //     rotation: 270,
    //     showLabel: true,
    //     showBuildingBlock: true,
    //     mapStyle: 'amap://styles/4f6e68a68f401629b2324bd7aa9a42ae',
    //     features: ['bg', 'point', 'road'],
    //     viewMode: '3D'
    //   })
    //   let map = _this.map
    //   // eslint-disable-next-line no-undef
    //   var loca = new Loca.Container({
    //     map
    //   })
    //   // eslint-disable-next-line no-undef
    //   var geo = new Loca.GeoJSONSource({
    //     data: {
    //       'type': 'FeatureCollection',
    //       'features': features
    //     }
    //   })
    //   // eslint-disable-next-line no-undef
    //   var geoLine = new Loca.GeoJSONSource({
    //     url: 'https://dev-obs-yunwu.oss-cn-shanghai.aliyuncs.com/hongqiaoconvermap.json'
    //   })
    //   // eslint-disable-next-line no-undef
    //   var layerLine = new Loca.PulseLineLayer({
    //     loca: loca,
    //     zIndex: 10,
    //     opacity: 1,
    //     visible: true,
    //     zooms: [2, 22]
    //   })
    //   var headColors = ['#EFBB51', '#7F3CFF', '#4CC19B', '#0B5D74', '#E06AC4', '#223F9B', '#F15C1A', '#7A0FA6']
    //   layerLine.setSource(geoLine)
    //   layerLine.setStyle({
    //     altitude: 0,
    //     lineWidth: 2,
    //     // 脉冲头颜色
    //     headColor: (_, feature) => {
    //       return headColors[feature.properties.type - 1]
    //     },
    //     // 脉冲尾颜色
    //     trailColor: 'rgba(128, 128, 128, 0.5)',
    //     // 脉冲长度，0.25 表示一段脉冲占整条路的 1/4
    //     interval: 0.25,
    //     // 脉冲线的速度，几秒钟跑完整段路
    //     duration: 8000
    //   })

    //   // 文字主体图层
    //   // eslint-disable-next-line no-undef
    //   var zMarker = new Loca.ZMarkerLayer({
    //     loca: loca,
    //     zIndex: 120
    //   })
    //   zMarker.setSource(geo)
    //   zMarker.setStyle({
    //     content: (i, feat) => {
    //       var props = feat.properties
    //       var leftColor = props.price < 60000 ? 'rgba(0, 28, 52, 0.6)' : 'rgba(33,33,33,0.6)'
    //       var rightColor = props.price < 60000 ? '#038684' : 'rgba(172, 137, 51, 0.3)'
    //       var borderColor = props.price < 60000 ? '#038684' : 'rgba(172, 137, 51, 1)'
    //       return (
    //         '<div style="min-width: 200px; padding: 0 0;">' +
    //         '<p style="display: block; font-size: 28px;background-image: linear-gradient(to right, ' +
    //         leftColor + ',' + leftColor + ',' + rightColor + ',rgba(0,0,0,0.4)); border:4px solid ' +
    //         borderColor + '; color:#fff; border-radius: 15px; text-align:center; margin:0; padding:20px;">' +
    //         props['name'] +
    //         '</p><span style="width: 0px; height: 90px; margin: 0 auto; display: block;"></span></div>'
    //       )
    //     },
    //     unit: 'meter',
    //     rotation: 0,
    //     alwaysFront: true,
    //     size: [490 / 2, 222 / 2],
    //     altitude: 0
    //   })

    //   // 浮动三角
    //   // eslint-disable-next-line no-undef
    //   var triangleZMarker = new Loca.ZMarkerLayer({
    //     loca: loca,
    //     zIndex: 119
    //   })
    //   triangleZMarker.setSource(geo)
    //   triangleZMarker.setStyle({
    //     content: (i, feat) => {
    //       return (
    //         '<div style="width: 120px; height: 120px; background: url(https://a.amap.com/Loca/static/loca-v2/demos/images/triangle_' +
    //         (feat.properties.price < 60000 ? 'yellow' : 'blue') +
    //         '.png);"></div>'
    //       )
    //     },
    //     unit: 'meter',
    //     rotation: 0,
    //     alwaysFront: true,
    //     size: [60, 60],
    //     altitude: 15
    //   })
    //   triangleZMarker.addAnimate({
    //     key: 'altitude',
    //     value: [0, 1],
    //     random: true,
    //     transform: 1000,
    //     delay: 2000,
    //     yoyo: true,
    //     repeat: 999999
    //   })

    //   // 呼吸点 蓝色
    //   // eslint-disable-next-line no-undef
    //   var scatterBlue = new Loca.ScatterLayer({
    //     loca,
    //     zIndex: 110,
    //     opacity: 1,
    //     visible: true,
    //     zooms: [2, 26],
    //     depth: false
    //   })

    //   scatterBlue.setSource(geo)
    //   scatterBlue.setStyle({
    //     unit: 'meter',
    //     size: function (i, feat) {
    //       return feat.properties.price < 60000 ? [90, 90] : [0, 0]
    //     },
    //     texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/scan_blue.png',
    //     altitude: 20,
    //     duration: 2000,
    //     animate: true
    //   })

    //   // 呼吸点 金色
    //   // eslint-disable-next-line no-undef
    //   var scatterYellow = new Loca.ScatterLayer({
    //     loca,
    //     zIndex: 110,
    //     opacity: 1,
    //     visible: true,
    //     zooms: [2, 26],
    //     depth: false
    //   })

    //   scatterYellow.setSource(geo)
    //   scatterYellow.setStyle({
    //     unit: 'meter',
    //     size: function (i, feat) {
    //       return feat.properties.price > 60000 ? [90, 90] : [0, 0]
    //     },
    //     texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/scan_yellow.png',
    //     altitude: 20,
    //     duration: 2000,
    //     animate: true
    //   })
    //   map.on('complete', function () {
    //     _this.$emit('afterRender')
    //     // 地图图块加载完成后触发
    //   })
    //   // 启动帧
    //   loca.animate.start()
    // },
    initMap () {
      var map = new AMap.Map('container1', {
        viewMode: '3D',
        zoom: 10,
        center: [121.523357, 31.280539],
        pitch: 0,
        mapStyle: 'amap://styles/2661d06c978f0fc6666b904ac762ce74',
        showBuildingBlock: false,
        buildingAnimation: false,
        showLabel: true
      })
      // eslint-disable-next-line no-undef
      var loca = window.loca = new Loca.Container({
        map
      })
      // 环境光
      loca.ambLight = {
        intensity: 0.4,
        color: '#fff'
      }

      // 平行光
      loca.dirLight = {
        intensity: 0.5,
        color: '#fff',
        target: [0, 0, 0],
        position: [0, -1, 10000]
      }
      // eslint-disable-next-line no-undef
      var geo = new Loca.GeoJSONSource({ data: hqJson.HongQiaoGeoJSON })
      // eslint-disable-next-line no-undef
      var pl = window.pl = new Loca.PolygonLayer({
        zIndex: 120,
        shininess: 30,
        hasSide: true,
        cullface: 'back',
        depth: true
      })

      pl.setSource(geo)

      var colortown = 'rgba(101, 166, 109, 0.2)'
      var colorbuildingtop = 'rgba(183, 195, 205, 1)'
      var colorbuildingside = 'rgba(65, 81, 108, 1)'
      let _this = this
      pl.setStyle(
        {
          topColor: function (index, feature) {
            if (feature.properties.mainKey === 'Town_Hongqiao') {
              return colortown
            } else {
              return colorbuildingtop
            }
          },
          sideTopColor: function (index, feature) {
            if (feature.properties.mainKey === 'Town_Hongqiao') {
              return colortown
            } else {
              return colorbuildingtop
            }
          },
          sideBottomColor: function (index, feature) {
            if (feature.properties.mainKey === 'Town_Hongqiao') {
              return colortown
            } else {
              return colorbuildingside
            }
          },
          height: function (index, feature) {
            if (feature.properties.mainKey === 'Town_Hongqiao') {
              return 1
            } else {
              return feature.properties.h * 3
            }
          },
          textureSize: [1000, 820],
          texture: require('@/assets/texture2.jpg')
        })

      pl.setLoca(loca)

      // 动画
      map.on('complete', function () {
        loca.animate.start()
        setTimeout(_this.animate(), 2000)
      })

      // 创建纯文本标记
      var text = new AMap.Text({
        text: '纯文本标记',
        anchor: 'center', // 设置文本标记锚点
        draggable: true,
        cursor: 'pointer',
        angle: 0,
        visible: false,
        offset: [0, -25],
        style: {
          'padding': '5px 10px',
          'margin-bottom': '1rem',
          'border-radius': '.25rem',
          'background-color': 'rgba(0,0,0,0.5)',
          // 'width': '12rem',
          'border-width': 0,
          'box-shadow': '0 2px 6px 0 rgba(255, 255, 255, .3)',
          'text-align': 'center',
          'font-size': '16px',
          'color': '#fff'
        }
      })
      text.setMap(map)

      // 拾取
      map.on('mousemove', (e) => {
        var feat = pl.queryFeature(e.pixel.toArray())

        if (feat && feat.properties.mainKey !== 'Town_Hongqiao') {
          text.show()
          text.setText(feat.properties.mainKey)
          text.setPosition(e.lnglat)
        } else {
          text.hide()
        }
      })

      // 省份图层
      var disProvince = new AMap.DistrictLayer.Province({
        zIndex: 12,
        adcode: 310000,
        depth: 2,
        styles: {
          'fill': 'rgba(0,0,0,0)',
          'province-stroke': 'cornflowerblue',
          'city-stroke': 'white', // 中国地级市边界
          'county-stroke': 'rgba(255,255,255,0.5)' // 中国区县边界
        }
      })

      disProvince.setMap(map)
    },
    animate () {
      var speed = 1
      // eslint-disable-next-line no-undef
      loca.viewControl.addAnimates([
        // 下钻
        {
          center: {
            value: [121.38102, 31.178648],
            control: [[121.474232, 31.229901],
            [121.386743, 31.13684]],
            timing: [0, 0, 0.58, 1.0],
            duration: 5000 / speed
          },
          pitch: {
            value: 72,
            control: [[0, 0], [1, 72]],
            timing: [0.42, 0, 1.0, 1.0],
            duration: 5000 / speed
          },
          zoom: {
            value: 15.6,
            control: [[0, 7], [1, 15.6]],
            timing: [0.42, 0, 0.58, 1.0],
            duration: 5000 / speed
          }
        },
        // 环绕
        {
          rotation: {
            value: 360,
            control: [[0, 0], [1, 360]],
            timing: [0, 0, 1, 1],
            duration: 60000 / speed
          }
        }])
    },
    switchUpdateCoords (data) { // 地图初始化
      this.coordsPATHData = data
      let _this = this
      if (_this.map) {
        _this.map.destroy()
      }
      // var centerpose = [121.38083, 31.182773]
      var buildingLayer = new AMap.Buildings({ zIndex: 130, zooms: [16, 20] })
      var zoomStyleMapping2 = {
        16: 0,
        17: 0,
        18: 0,
        19: 0,
        20: 0
      }
      var areasArr = []
      var markerArr = []
      for (let i = 0; i < this.coordsPATHData.length; i++) {
        var marker = new AMap.ElasticMarker({
          position: this.coordsPATHData[i].center,
          zooms: [14, 20],
          // offset: [-30, -10],
          styles: [{
            icon: {
              img: this.icon1,
              size: [32, 32], // 可见区域的大小
              anchor: 'bottom-center', // 锚点
              fitZoom: 16.8, // 最合适的级别
              scaleFactor: 1, // 地图放大一级的缩放比例系数
              maxScale: 3, // 最大放大比例
              minScale: 1 // 最小放大比例
            },
            label: {
              content: this.coordsPATHData[i].name,
              position: 'TM', // 居中顶部
              minZoom: 16.8
            }
          }],
          zoomStyleMapping: zoomStyleMapping2
        })
        if (this.coordsPATHData[i].path.length) {
          var obj = {
            // 围栏1
            // visible: false, // 是否可见
            rejectTexture: false, // 是否屏蔽自定义地图的纹理
            color1: '#7CB2E8', // 楼顶颜色
            color2: '#4882DA', // 楼面颜色
            path: this.coordsPATHData[i].path
          }
          areasArr.push(obj)
          markerArr.push(marker)
        }
      }
      var options = {
        hideWithoutStyle: false, // 是否隐藏设定区域外的楼块
        areas: areasArr
      }
      buildingLayer.setStyle(options) // 此配色优先级高于自定义mapStyle
      this.map = new AMap.Map('container1', {
        zoom: 16.8,
        zooms: [16.8, 20],
        pitch: 70,
        terrain: true, // 开启地形图
        showBuildingBlock: true,
        showIndoorMap: false,
        showLabel: true,
        mapStyle: 'amap://styles/2661d06c978f0fc6666b904ac762ce74',
        center: _this.coordsPATHData[0].center,
        features: ['bg', 'road'],
        viewMode: '3D',
        layers: [
          AMap.createDefaultLayer(),
          buildingLayer
        ]
      })
      this.map.add(markerArr)
      this.map.on('complete', function () {
        _this.$emit('afterRender')
        // 地图图块加载完成后触发
      })
      // map.addControl(new AMap.Scale())
      // eslint-disable-next-line no-new
      // new AMap.Polygon({
      //   bubble: true,
      //   fillOpacity: 0.01,
      //   strokeWeight: 0,
      //   path: options.areas[0].path,
      //   map: this.map
      // })
      this.mapAnimateControl = true
      // this.rotate()
    },
    rotate () {
      window.requestAnimationFrame(() => {
        if (this.mapAnimateControl === true) {
          let rota = this.map.getRotation() + 0.02
          this.map.setRotation(rota)
        }
        this.rotate()
      })
    },
    toggleSound () {
      var music = document.getElementById('audio')// 获取ID
      console.log(music)
      console.log(music.paused)
      if (music.paused) { // 判读是否播放
        music.paused = false
        music.play() // 没有就播放
      }
    }
  }
}
</script>
<style lang="scss">
@import "../../style/config.scss";
.digitizationHQ {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .mask {
    width: 100px;
    height: 100px;
    background-color: black;
    position: absolute;
    top: 0;
    left: 0;
    mask: url(../../assets/buildingactive.png) no-repeat;

    .light {
      width: 10%;
      height: 100%;
      background-color: #fff;
      transition: width 1s ease;
      position: absolute;
      &:hover {
        width: 100%;
      }
    }
  }
  .amap-marker-label {
    // width: 90px;
    font-size: px2rem(26);
    //line-height: 22px;
    text-align: center;
    //height: 22px;
    // font-family: STLiti;
    color: rgb(126, 158, 157);
    border-radius: 15px;
    // background-color: rgba(255, 255, 255, 0);
    background-color: rgba(26, 47, 86, 0.8);
    border: solid 1px rgba(73, 143, 233, 0.8);
    padding: px2rem(12) px2rem(18);
    writing-mode: vertical-lr;
    text-orientation: upright;
  }
}
#container1 {
  height: 100%;
  margin: 0;
}
</style>
