const process = require("process");
const glob = require("glob");
const rootPath = process.cwd();
const dirArr = glob.sync(`${rootPath}/.deploy.config.js`); // 加载工作目录的配置文件
const { error } = require("./log");

/**
 * 检查配置文件
 * @param {*} config 配置文件
 * @returns 配置文件正确标识
 */
function optionsCheck(config) {
  if (!dirArr.length) {
    console.log(error(`${process.cwd()} 中没有 .deploy.config.js`));
    return;
  }
  // 检查配置对象是否包含必需的属性
  const requiredProperties = ['host', 'port', 'username', 'password'];
  for (const property of requiredProperties) {
    if (!(property in config)) {
      console.log(error(`错误：属性 '${property}'不存在于配置对象中。`));
      return false;
    }
  }
  const targetEnv = Object.keys(config)?.filter(item => {
    return typeof config[item] === 'object'
  })
  // 检查嵌套的环境对象
  for (const key of targetEnv) {
    const nestedObject = config[key];
    if (nestedObject && typeof nestedObject === 'object') {
      // 检查嵌套对象是否包含必需的嵌套属性
      const requiredNestedProperties = ['remoteDir', 'localDir'];
      for (const nestedProperty of requiredNestedProperties) {
        if (!(nestedProperty in nestedObject)) {
          console.log(`错误：环境属性 '${nestedProperty}' 不存在于 ${key} 配置对象中。`)
          return false;
        }
      }
    } else {
      console.log(error(`错误：嵌套属性 '${key}' 不存在或不是对象。`));
      return false;
    }
  }

  return true;
}

/**
 * 获取配置信息
 * @param {*} types 发布环境
 * @param {*} config 基本配置
 * @returns 
 */
function getConf(types = [], config = []) {
  if (!dirArr.length) return console.log(error(`${process.cwd()} 中没有 .deploy.config.js`));
  const src = dirArr[0];
  const { option } = require(`${rootPath}/` + src);
  // 如果option存在
  if (option) {
    config = option;
    // 过滤出有效的类型
    types = Object.keys(option)?.filter(item => {
      return typeof config[item] === 'object'
    })
  }
  // 返回有效的类型和配置信息
  return { types, config };
};

/**
 * 获取目标环境的名称
 * @param {object} config - 配置对象
 * @returns {string[]} - 目标环境名称数组
 */
function getTargetEnvName(config) {
  const exclud = ['host', 'port', 'username', 'password']
  return Object.keys(config).filter(key => {
    // 判断属性是否为对象，且不包含在排除列表中
    return typeof config[key] === 'object' && !exclud.includes(key)
  })
}
module.exports = { getConf, optionsCheck, getTargetEnvName };