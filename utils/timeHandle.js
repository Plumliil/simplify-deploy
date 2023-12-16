// 获取当前时间
function getCurrentTime() {
  // 创建一个 Date 对象，将时间戳传递给构造函数
  const date = new Date();
  // 从 Date 对象中提取年、月、日、小时、分钟和秒
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是从 0 开始的，因此要加 1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  // 返回格式化后的日期和时间字符串
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

module.exports = getCurrentTime
