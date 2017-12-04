- [简体中文介绍](README.zh-CN.md)

## Introduction
flowci 前端项目

## Quick Start
### Require
Node > 6
### Install
```
$ git clone git@github.com:FlowCI/flow-web.git
$ cd flow-web
$ npm install
```
### Configuration
Find config/index.js to overwrite some configuration.

> Modify the API address to use the FLOW_WEB_API environment variable directly


### Start
#### develop
```
$ npm start
```
#### production
In production mode, please compile. After compiling, all static files will be generated under dist folder. You can use the server to make it accessible.
```
$ npm run build
```

## License

flow-web is an open source project, sponsored by https://www.fir.im/ under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).
