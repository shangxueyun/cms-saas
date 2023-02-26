var EARTH_RADIUS = 6378.1370;    //单位KM
var PI = Math.PI;

function getRad(d) {
  return d * PI / 180.0;
}
class Util {
  formatTime (date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  // p是否包含在points内
  isInside(p, points) {
    var count = points.length;
    if (count < 3) {
      return false;
    }
    var  result = false;
    for (var i = 0, j = count - 1; i < count; i++){
      var p1 = points[i];
      var p2 = points[j];
      if (p1.lat <= p.lat && p2.lat >= p.lat || p2.lat <= p.lat && p1.lat >= p.lat) {
        if (p1.lng + (p.lat - p1.lat) / (p2.lat - p1.lat) * (p2.lng - p1.lng) <= p.lng) {
          result = !result;
        }
      }
      j = i;
    }
    return result;
  }
  // 计算经纬度之间的距离(基于假设地球是椭圆)
  getFlatternDistance (lat1, lng1, lat2, lng2) {
    var f = getRad((lat1 + lat2) / 2);
    var g = getRad((lat1 - lat2) / 2);
    var l = getRad((lng1 - lng2) / 2);

    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f);

    var s, c, w, r, d, h1, h2;
    var a = EARTH_RADIUS;
    var fl = 1 / 298.257;

    sg = sg * sg;
    sl = sl * sl;
    sf = sf * sf;

    s = sg * (1 - sl) + (1 - sf) * sl;
    c = (1 - sg) * (1 - sl) + sf * sl;

    w = Math.atan(Math.sqrt(s / c));
    r = Math.sqrt(s * c) / w;
    d = 2 * w * a;
    h1 = (3 * r - 1) / 2 / c;
    h2 = (3 * r + 1) / 2 / s;

    return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
  }
}
export default new Util()
