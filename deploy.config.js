module.exports = {
  option: {
    host: "0.0.0.0",
    port: "22",
    username: "root",
    password: "root",
    sit: {
      remoteDir: "/home/nginx/html",
      localDir: "C:/Users/22584/Desktop/Linmon/dist/dev/dist",
    },
    uat: {
      bakDir: "/bakup/nginx",
      remoteDir: "/home/nginx/html",
      localDir: "C:/Users/22584/Desktop/Linmon/dist/uat/dist",
    },
    prod: {
      bakDir: "/bakup/nginx",
      remoteDir: "/home/nginx/html",
      localDir: "C:/Users/22584/Desktop/Linmon/dist/prod/dist",
    },
  },
};