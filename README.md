# simplify-deploy
simplify-deploy 部署工具是一个模块，旨在通过 SSH 简化到不同环境的部署过程。它利用 Node.js 和提供的配置来将文件部署到远程服务器。

## 配置
部署工具通过 module.exports 对象在 .deploy.config.cjs 文件中进行配置。以下是一个示例配置：

```javascript
module.exports = {
  option: {
    sit: {
      host: "0.0.0.0",
      port: "22",
      username: "root",
      password: "root",
      bakDir: "Backup file directory",
      remoteDir: "Remote server directory",
      localDir: "Local packaged directory",
    },
    uat: {
      host: "0.0.0.0",
      port: "22",
      username: "root",
      password: "root",
      bakDir: "Backup file directory",
      remoteDir: "Remote server directory",
      localDir: "Local packaged directory",
    },
    prod: {
      host: "0.0.0.0",
      port: "22",
      username: "root",
      password: "root",
      bakDir: "Backup file directory",
      remoteDir: "Remote server directory",
      localDir: "Local packaged directory",
    },
  },
};
```
## 使用
要使用 simplify-deploy 部署工具，请按照以下步骤进行：

### 安装
可使用一下命令在项目中安装:
```shell
npm i simplify-deploy -D
# 或
yarn add -D simplify-deploy
```
### 配置
在项目的根目录下创建.deploy.config.cjs文件

确保根据您的特定部署要求调整 .deploy.config.cjs 中的配置。

并且在package.json中添加命令:
```json
  "scripts": {
    "deploy": "simplifyd publish"
  },
```
如果想要在打包后就执行部署命令可进行一下配置:
```json
  "scripts": {
    "deploy": "npm run build && simplifyd publish"
  },
```
### 发布

```shell
npm run deploy
# 或
yarn deploy
```

## 配置

### 基础配置
- host：远程服务器的 IP 地址或主机名。
- port：SSH 端口号。
- username：用于身份验证的 SSH 用户名。
- password：用于身份验证的 SSH 密码。
### 环境配置
- bakDir：远程服务器上的备份目录。(非必填,如服务器不存在该目录则自动创建) 
- remoteDir：将要部署文件的远程目录。
- localDir：包含要部署文件的本地目录。

## 版本记录
### TODO
- 
### 已更新
- v1.0.0: 基本功能
- v1.0.1: 上传服务器后进行文件备份
- v1.0.2: 实现一个项目部署多个服务器多个环境
- v1.0.3: 版本同步依赖修改 无功能修改
- v1.0.4: module模式下require引入问题修复