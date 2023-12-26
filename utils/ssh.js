// ssh.js
const { handleSourceFile } = require('./operationServer')
const { NodeSSH } = require("node-ssh");
const ssh = new NodeSSH();
const process = require("process");
const { notice, pending } = require("./log");

/**
 * 连接服务器并上传文件
 * 
 * @param {Object} envInfo - 环境信息对象
 * @param {string} devType - 项目环境类型
 * @returns {Promise} - 返回一个Promise对象，表示连接服务器并上传文件的操作
 */
function connectServe( envInfo, devType) {
  return new Promise((resolve, reject) => {
    ssh.connect({
      host: envInfo.host,
      port: envInfo.port || 22,
      username: envInfo.username,
      password: envInfo.password,
      tryKeyboard: true
    }).then(() => {
      console.log(notice('连接服务器成功!'));
      handleSourceFile(ssh, envInfo, devType)
      console.log(notice('开始上传文件~'));
      ssh
        .putDirectory(envInfo.localDir, envInfo.remoteDir, {
          // 文件上传回调
          tick: (localPath, remotePath, error) => {
            if (error) {
              reject(console.log(error('⚠️ ', error, "error")))
            } else {
              resolve(console.log(pending(`🚀 传输：${localPath} - > ${remotePath}`)));
            }
          },
        })
        .then(() => {
          resolve(console.log(notice(`✨ 上传成功 项目已部署至 ${devType} 环境`)));
          process.exit(0);
        });
    })
  })
}

module.exports = connectServe
