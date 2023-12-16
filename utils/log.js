const clc = require("cli-color");
const error = clc.red.bold;
const warn = clc.yellow;
const notice = clc.blue;
const pending = clc.cyan;
const stress = clc.xterm(195).bgXterm(201)

module.exports = { clc, error, warn, notice, pending, stress }