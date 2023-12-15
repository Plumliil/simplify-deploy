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
    case 'GBG':
      console.log('\x1B[42m%s\x1B[0m', msg)
      break;
    case 'error':
      console.log('\x1B[31m%s\x1B[0m', msg)
      break;
    case 'PBG':
      console.log('\x1B[45m%s\x1B[0m', msg)
      break;
    case 'warn':
      console.log('\x1B[45m%s\x1B[0m', msg)
      break;
    default:
      console.log('\x1B[32m%s\x1B[0m', msg)
      break;
  }
}

module.exports = log