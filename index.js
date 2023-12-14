// index.js
const process = require("process");
const { program } = require("commander");
const glob = require("glob");
const inquirer = require("inquirer");
const dirArr = glob.sync(`${process.cwd()}/config.js`); // 加载工作目录的配置文件
const package = require("./package.json");

const { NodeSSH } = require("node-ssh");
const ssh = new NodeSSH();

const log = (msg, type) => {
  switch (type) {
    case 'common':
      console.log('\x1B[36m%s\x1B[0m', msg)
      break;
    case 'success':
      console.log('\x1B[32m%s\x1B[0m', msg)
      break;
    case 'CBG':
      console.log('\x1B[44m%s\x1B[0m', msg)
      break;
    case 'error':
      console.log('\x1B[31m%s\x1B[0m', msg)
      // console.log('\x1B[41m%s\x1B[0m', msg)
      break;
    default:
      console.log('\x1B[32m%s\x1B[0m', msg)
      break;
  }

}

// 获取配置文件
const getConf = (types = [], config = []) => {
  if (dirArr.length) {
    const src = dirArr[0];
    const { option } = require("./" + src);
    if (option) {
      config = option;
      types = Object.keys(option).filter(item => ['dev', 'uat', 'prod'].includes(item));
    }
  }
  return { types, config };
};


function checkRequiredProperties(obj) {
  const requiredProperties = ['host', 'port', 'username', 'password'];

  for (const property of requiredProperties) {
    if (!(property in obj)) {
      log(`错误：属性 '${property}' 不存在于配置对象中。`, 'error');
      return false;
    }
  }

  // 检查嵌套的 dev、uat、prod 对象
  for (const key of ['dev', 'uat', 'prod']) {
    const nestedObject = obj[key];

    if (nestedObject && typeof nestedObject === 'object') {
      // 检查嵌套对象是否包含 requiredNestedProperties
      const requiredNestedProperties = ['remoteDir', 'localDir'];

      for (const nestedProperty of requiredNestedProperties) {
        if (!(nestedProperty in nestedObject)) {
          log(`错误：环境属性 '${nestedProperty}' 不存在于${key}配置对象中。`, 'error');
          return false;
        }
      }
    } else {
      log(`错误：嵌套属性 '${key}' 不存在或不是对象。`, 'error');
      return false;
    }
  }

  return true;
}


// 检查配置文件
const checkConf = (flag = true) => {
  if (!dirArr.length) {
    log(`${process.cwd()} 中没有 config.js`, 'error');
    return;
  }
  return checkRequiredProperties(config);
};
const { types, config } = getConf();


// 定义当前版本
program.option("-v, --version")
  .action(() => {
    console.log('当前版本:', `v${package.version}`);
  });

program
  .command("publish")
  .description("发布项目")
  .action(() => {
    if (!checkConf()) return;
    (async () => {
      const { devType } = await inquirer.prompt([
        {
          name: "devType",
          type: "list",
          message: `请选择发布的环境`,
          choices: types.filter((e) => {
            return { name: e, value: e };
          }),
          default: types[0],
        },
      ]);
      const envConfig = config[devType];
      ssh.connect({
        host: config.host,
        port: config.port || 22,
        username: config.username,
        password: config.password,
        tryKeyboard: true
      }).then(() => {
        log('连接服务器成功', 'success')
        log('开始上传文件', 'success')
        ssh
          .putDirectory(envConfig.localDir, envConfig.remoteDir, {
            // 文件上传回调
            tick: (localPath, remotePath, error) => {
              if (error) {
                log('⚠️ ', error, "error");
              } else {
                log(`🚀 传输：${localPath} - >${remotePath}`, "common");
              }
            },
          })
          .then(() => {
            log(`✨ 上传成功 项目已部署至 ${devType} 环境`, "common");
            process.exit(0);
          });
      })
    })()
  })
// 注册 -h
program.on("--help", () => { });

// 解析用户执行命令传入参数
program.parse(process.argv);
