const getCurrentTime = require('./timeHandle');
const { notice, stress } = require("./log");

const command = (envConfig, devType) => {
  // 生成备份文件名
  const backupFileName = `${devType}_${getCurrentTime()}`;
  // 备份目录
  const backupDir = envConfig.bakDir;
  // 源目录
  const sourceDir = envConfig.remoteDir;
  // 返回备份命令
  return `
    if [ -d "${sourceDir}" ]; then
        [ -d "${backupDir}" ] || mkdir -p "${backupDir}"
          [ -d "${backupDir}/${devType}/${backupFileName}" ] || mkdir -p "${backupDir}/${devType}/${backupFileName}"
        cp -r "${sourceDir}" "${backupDir}/${devType}/${backupFileName}"
        tar -czf "${backupDir}/${devType}/${backupFileName}.tar.gz" -C "${backupDir}/${devType}" "${backupFileName}"
        rm -r "${backupDir}/${devType}/${backupFileName}"
    else
        echo "源目录不存在: ${sourceDir}"
    fi
    `;
}

/**
 * 运行命令
 * 
 * @param {object} ssh - SSH连接对象
 * @param {string} command - 待执行的命令
 * @param {string} path - 执行命令的路径
 * @param {string} bakDir - 备份文件保存的目录
 * @returns {Promise} - Promise对象，成功时返回备份完成的提示信息，失败时返回错误信息
 */
function runCommand(ssh, command, path, bakDir) {
  return new Promise((resolve, reject) => {
    ssh.execCommand(command, {
      cwd: path
    }).then((res) => {
      if (res.stderr) {
        reject(console.error('命令执行发生错误:' + res.stderr))
        process.exit()
      } else {
        resolve(console.log(notice('✨ 备份完成 备份至 ' + bakDir)))
      }
    })
  })
}
/**
 * 异步函数，用于文件备份
 * @param {*} ssh ssh对象
 * @param {*} envConfig 环境配置信息
 * @param {*} devType 环境
 */
async function handleSourceFile(ssh, envConfig, devType) {
  // 如果开启了远端备份
  if (envConfig.bakDir) {
    // 打印日志提示已开启远端备份
    console.log(stress('已开启远端备份!'));
    // 执行命令将文件备份到远端
    await runCommand(
      ssh,
      command(envConfig, devType),
      envConfig.remoteDir,
      envConfig.bakDir,
    )
  } else {
    // 打印日志提醒未开启远端备份
    console.log(stress('提醒：本次部署未开启远端备份!'));
  }
}

module.exports = { handleSourceFile }