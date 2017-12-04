## 介绍
flowci 前端项目

## 快速开始
### 依赖
Node > 6
### 安装
```
$ git clone git@github.com:FlowCI/flow-web.git
$ cd flow-web
$ npm install
```

部分库安装需要访问国外下载，如果装不上可使用 taobao 源
```
# 设置 taobao 源
$ npm config set registry https://registry.npm.taobao.org/

# 设置 node-sass 所需要包地址
$ npm config set sass-binary-site https://npm.taobao.org/mirrors/node-sass

# 设置模拟器下载地址并安装依赖包
$ PHANTOMJS_CDNURL https://npm.taobao.org/dist/phantomjs npm install
```
### 配置文件
找到 config/index.js 将需要替换的字段换成自己的配置的配置即可
>可使用 `FLOW_WEB_API` 环境变量 设置 api 地址

### 启动
#### 本地 develop 模式
```
$ npm start
```
#### 生产模式
生产模式下请先编译，编译后将生成全静态文件，请使用服务器让其能够访问，并且将所有未匹配到的地址都指向 dist 目录下的 index.html
```
# 编译
$ npm run build
```

## License

flow-web is an open source project, sponsored by https://www.fir.im/ under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).
