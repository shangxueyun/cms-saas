<!--
 * @Description: 
 * @verbose: 
 * @Author: shangXueYun
 * @Date: 2021-07-23 16:26:22
 * @LastEditors: shangXueYun
 * @LastEditTime: 2021-08-02 11:59:50
-->
## 安装 ##
 初始化执行以下指令，一路回车   完成后根目录会生成package.json文件
 ```
 npm init
 ```

安装vant-weapp 完成后根目录出现node_modules目录里面有vant-weapp算成功
```
npm i @vant/weapp -S --production  
```
打开微信开发者工具，点击 工具 -> 构建 npm，并勾选 使用 npm 模块 选项，构建完成后，即可引入组件

修改 project.config.json
需要手动在 project.config.json 内添加如下配置，使开发者工具可以正确索引到 npm 依赖的位置
```
{
  ...
  "setting": {
    ...
    //修改以下内容
    "packNpmManually": true,
    "packNpmRelationList": [
      {
        "packageJsonPath": "./package.json",
        "miniprogramNpmDistDir": "./"
      }
    ]
  }
}
```

vant-weapp 都是px， 现在要转rpx

用gulp、gulp-postcss、postcss-pxtransform 对miniprogram_npm/vant-weapp下面的wxss进行转换
```
npm install gulp gulp-postcss postcss-pxtransform --save-dev
```
*这个步骤要等一会儿 因为在小程序目录下添加文件会重新编译 电脑有点卡，目录下生成node_modules/postcss-pxtransform算成功*


一切准备就绪 根目录打开命令行 输入 gulp css 因为没有全局安装gulp 所以我们需要在package.json 下面的script添加一个执行命令
```
"scripts": {
  "build": "gulp css",  //需要增加这行
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

执行 npm run build
这样当然会6s模拟器下缩小了2倍
方法 找到node_modules/postcss-pxtransform/index.js

```
//修改 
const deviceRatio = {
'640': 2.34 / 2,
'750': 1,
'828': 1.81 / 2
}
 
//成
 
const deviceRatio = {
640: 2.34 / 4,
750: 2,
828: 1.81 / 4
}

```
重新打开微信开发者工具，点击 工具 -> 构建 npm 
再次执行 npm run build



## 使用vant weapp组件 ##

引入组件

以 Button 组件为例，只需要在app.json或index.json中配置 Button 对应的路径即可

```
// 通过 npm 安装
// app.json
"usingComponents": {
  "van-button": "@vant/weapp/button/index"
}
```