// index.js
const { program } = require("commander");
const inquirer = require("inquirer");
const process = require("process");
const connectServe = require('./utils/ssh')
const { getConf, optionsCheck, getTargetEnvName } = require('./utils/configHandle')
const { types, config } = getConf();
const env = getTargetEnvName(config);


for (const key in env) {
  const targetENV = env[key];
  program
    .command(targetENV)
    .description(`发布项目到 ${targetENV} 环境 ` + config.host + ' -> ' + config[targetENV].remoteDir)
    .action(() => {
      connectServe(config, config[targetENV], targetENV)
    })
}
program
  .command("publish")
  .description("发布项目")
  .action(() => {
    if (!optionsCheck(config)) return;
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