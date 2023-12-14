// config.js
module.exports = {
  option: {
    host: "0.0.0.0",
    port: "22",
    username: "root",
    password: "root",
    dev: {
      remoteDir: "/home/nginx/html",
      localDir: "./dist/dev",
    },
    uat: {
      remoteDir: "/home/nginx/html",
      localDir: "./dist/uat",
    },
    prod: {
      remoteDir: "/home/nginx/html",
      localDir: "./dist/prod",
    },
  },
};
