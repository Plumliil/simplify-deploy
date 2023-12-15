// index.js
const process = require("process");
const { program } = require("commander");
const glob = require("glob");
const inquirer = require("inquirer");
const dirArr = glob.sync(`${process.cwd()}/deploy.config.js`); // 加载工作目录的配置文件
const package = require("./package.json");
const log = require('./utils/log')
const connectServe = require('./utils/ssh')

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
      connectServe(config, envConfig, devType)
    })()
  })
// 注册 -h
program.on("--help", () => { });

// 解析用户执行命令传入参数
program.parse(process.argv);
