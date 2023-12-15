// ssh.js
const { handleSourceFile } = require('./operationServer')
const { NodeSSH } = require("node-ssh");
const ssh = new NodeSSH();
const process = require("process");
const log = require('./log')

function connectServe(sshInfo, envInfo, devType) {
  return new Promise((resolve, reject) => {
    ssh.connect({
      host: sshInfo.host,
      port: sshInfo.port || 22,
      username: sshInfo.username,
      password: sshInfo.password,
      tryKeyboard: true
    }).then(() => {
      log('连接服务器成功', 'success')
      log('开始上传文件', 'success')
      handleSourceFile(ssh, envInfo, devType)
      ssh
        .putDirectory(envInfo.localDir, envInfo.remoteDir, {
          // 文件上传回调
          tick: (localPath, remotePath, error) => {
            if (error) {
              reject(log('⚠️ ', error, "error"))
            } else {
              resolve(log(`🚀 传输：${localPath} - > ${remotePath}`, "common"));
            }
          },
        })
        .then(() => {
          resolve(log(`✨ 上传成功 项目已部署至 ${devType} 环境`, "common"));
          process.exit(0);
        });
    })

  })
}

module.exports = connectServe
