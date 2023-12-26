#!/usr/bin/env node
const { program } = require("commander");
const inquirer = require("inquirer");
const process = require("process");
const connectServe = require('./utils/ssh')
const { warn ,notice} = require("./utils/log");
const { getConf, optionsCheck, getTargetEnvName } = require('./utils/configHandle')
const { types, config } = getConf();
const env = getTargetEnvName(config);


for (const key in env) {
  const targetENV = env[key];
  const targetENVConfig = config[targetENV];
  program
    .command(targetENV)
    .description(`发布项目到 ${targetENV} 环境 ` + targetENVConfig.host + ' -> ' + targetENVConfig.remoteDir)
    .action(() => {
      connectServe(targetENVConfig, targetENV)
    })
}
program
  .command("publish")
  .description("发布项目")
  .action(() => {
    if (!optionsCheck(config)) return;
    (async () => {
      const { devType, confirm } = await inquirer.prompt([
        {
          name: "devType",
          type: "list",
          message: `请选择发布的环境`,
          choices: types.filter((e) => {
            return { name: e, value: e };
          }),
          default: types[0],
        },
        {
          type: 'confirm',
          name: 'confirm',
          message: (answers) => {
            const commonMsg = `是否确认发布 ${warn(answers.devType)}`;
            if (config[answers.devType]?.bakDir) {
              return `${commonMsg} ( 已开启远端备份:${config[answers.devType]?.bakDir} )!`;
            } else {
              return `${commonMsg} ( 未开启远端备份 )!`;
            }

          },
        }
      ]);
      if (confirm) {
        const envConfig = config[devType];
        connectServe(envConfig, devType);
      } else {
        console.log(notice(`取消发布 ${devType} !`));
      }
    })()
  })
// 注册 -h
program.on("--help", () => { });

// 解析用户执行命令传入参数
program.parse(process.argv);