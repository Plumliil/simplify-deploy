const { NodeSSH } = require("node-ssh");
const { getCurrentTime } = require('./timeHandle');
const log = require('./log')

// if [ -d ${envConfig.remoteDir} ];
// then mv ${envConfig.remoteDir} ${envConfig.bakDir}/${devType}/${devType}_${getCurrentTime()}
// fi

const command = (envConfig, devType) => {
  // 构建备份目录和文件名
  const backupDir = `${envConfig.bakDir}/${devType}`;
  const backupFileName = `${devType}_${getCurrentTime()}`;
  return `
  if [ -d "${envConfig.remoteDir}" ]; then
      # 创建备份目录
      mkdir -p "${backupDir}"
  
      # 移动文件到备份目录
      mv "${envConfig.remoteDir}" "${backupDir}/${backupFileName}"
  
      # 压缩备份文件
      tar -czf "${backupDir}/${backupFileName}.tar.gz" -C "${backupDir}" "${backupFileName}"
  
      # 验证压缩成功后删除原始文件
      if [ $? -eq 0 ]; then
          rm -rf "${backupDir}/${backupFileName}"
          echo "Backup completed and original files removed successfully."
      else
          echo "Error: Compression failed. Original files were not removed."
      fi
  fi
  `
}

function runCommand(ssh, command, path, bakDir) {
  return new Promise((resolve, reject) => {
    ssh.execCommand(command, {
      cwd: path
    }).then((res) => {
      if (res.stderr) {
        reject(console.error('命令执行发生错误:' + res.stderr))
        process.exit()
      } else {
        resolve(console.log('✨ 备份完成 备份至 ' + bakDir))
      }
    })
  })
}

// 处理源文件(ssh对象、配置信息)
async function handleSourceFile(ssh, envConfig, devType) {
  if (envConfig.bakDir) {
    log('已开启远端备份!', 'GBG')
    await runCommand(
      ssh,
      // `
      // if [ -d ${envConfig.remoteDir} ];
      // then mv ${envConfig.remoteDir} ${envConfig.bakDir}/${devType}/${devType}_${getCurrentTime()}
      // fi
      // `,
      command(envConfig, devType),
      envConfig.remoteDir,
      envConfig.bakDir,
    )
  } else {
    log('提醒：未开启远端备份!', 'PBG')
  }
}


module.exports = { handleSourceFile }