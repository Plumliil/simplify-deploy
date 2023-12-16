# simplify-deploy
simplify-deploy 部署工具是一个模块，旨在通过 SSH 简化到不同环境的部署过程。它利用 Node.js 和提供的配置来将文件部署到远程服务器。

## 配置
部署工具通过 module.exports 对象在 deploy-config.js 文件中进行配置。以下是一个示例配置：

```javascript
module.exports = {
  option: {
    host: "0.0.0.0",
    port: "22",
    username: "root",
    password: "root",
    sit: {
      remoteDir: "/home/nginx/html",
      localDir: "C:/Users/simplify/Desktop/app/dist/dev/dist",
    },
    uat: {
      bakDir: "/bakup/nginx/bak",
      remoteDir: "/home/nginx/html",
      localDir: "C:/Users/simplify/Desktop/app/dist/uat/dist",
    },
    prod: {
      bakDir: "/bakup/nginx/bak",
      remoteDir: "/home/nginx/html",
      localDir: "C:/Users/simplify/Desktop/app/dist/prod/dist",
    },
  },
};
```
## 使用
要使用 simplify-deploy 部署工具，请按照以下步骤进行：

如果尚未安装，请安装 Node.js 和 npm。
+ 克隆存储库：git clone git@github.com:Plumliil/simplify-deploy.git
+ 安装依赖项：npm install
+ 查看可执行命令: npm run deploy --help
+ 运行部署脚本: 根据提示命令行参数来运行部署脚本。
确保根据您的特定部署要求调整 deploy-config.js 中的配置。

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