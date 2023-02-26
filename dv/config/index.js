// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/dv/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist/dv'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 9999,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/uaa': {
        target: 'http://192.168.1.154',
        secure: false
      },
      '/rts': {
        target: 'http://192.168.1.154',
        secure: false
      },
      '/rms': {
        target: 'http://192.168.1.154',
        secure: false
      },
      '/saa': {
        target: 'http://192.168.1.154',
        secure: false
      },
      '/mps': {
        target: 'http://192.168.1.154',
        secure: false
      },
      '/ywm': {
        target: 'http://192.168.1.154',
        secure: false
      },
      '/cms': {
        target: 'http://192.168.1.154',
        secure: false
      },
      '/crm': {
        target: 'http://192.168.1.154',
        secure: false
      },
      '/tmg': {
        target: 'http://xxsc.njdtwise.com',
        secure: false,
        changeOrigin: true,
        pathRewrite: { //路径重写
          '^/tmg': '/' //这里理解成用‘/api'代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://localhost:3002/user/add'，直接写‘/api/goods/add'即可
        }
      },
      '/gos': {
        target: 'http://192.168.1.154',
        secure: false
      },
      '/qichacha': {
        target: 'http://api.qichacha.com',
        secure: false,
        changeOrigin: true,
        pathRewrite: { //路径重写
          '^/qichacha': '/' //这里理解成用‘/api'代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://localhost:3002/user/add'，直接写‘/api/goods/add'即可
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
