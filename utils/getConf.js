const process = require("process");
const glob = require("glob");
const rootPath = process.cwd();
const dirArr = glob.sync(`${rootPath}/deploy.config.js`); // 加载工作目录的配置文件
/**
 * 检查配置文件
 * @param {*} config 配置文件
 * @returns 配置文件正确标识
 */
function optionsCheck(config) {
  // 检查配置对象是否包含必需的属性
  const requiredProperties = ['host', 'port', 'username', 'password'];
  for (const property of requiredProperties) {
    if (!(property in config)) {
      log(`错误：属性 '${property}'不存在于配置对象中。`, 'error');
      return false;
    }
  }
  // 检查嵌套的dev、uat、prod对象
  for (const key of ['dev', 'uat', 'prod']) {
    const nestedObject = config[key];
    if (nestedObject && typeof nestedObject === 'object') {
      // 检查嵌套对象是否包含必需的嵌套属性
      const requiredNestedProperties = ['remoteDir', 'localDir'];

      for (const nestedProperty of requiredNestedProperties) {
        if (!(nestedProperty in nestedObject)) {
          log(`错误：环境属性 '${nestedProperty}' 不存在于 ${key} 配置对象中。`, 'error');
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

/**
 * 获取配置信息
 * @param {*} types 发布环境
 * @param {*} config 基本配置
 * @returns 
 */
const getConf = (types = [], config = []) => {
  if (dirArr.length) {
    const src = dirArr[0];
    const { option } = require(`${rootPath}/` + src);

    // 如果option存在
    if (option) {
      config = option;
      // 过滤出有效的类型
      types = Object.keys(option).filter(item => ['dev', 'uat', 'prod'].includes(item));
    }
  }

  // 返回有效的类型和配置信息
  return { types, config };
};

// 检查配置文件
const confCheck = (config) => {
  if (!dirArr.length) {
    log(`${process.cwd()} 中没有 deploy.config.js`, 'error');
    return;
  }
  return optionsCheck(config);
};

module.exports = { getConf, confCheck, optionsCheck };