module.exports = {
  option: {
    host: "0.0.0.0",
    port: "22",
    username: "root",
    password: "root",
    dev: {
      remoteDir: "/home/nginx/html",
      localDir: "C:/Users/22584/Desktop/Linmon/dist/dev/dist",
    },
    uat: {
      bakDir: "/home/nginx/bak",
      remoteDir: "/home/nginx/html",
      localDir: "C:/Users/22584/Desktop/Linmon/dist/uat/dist",
    },
    prod: {
      bakDir: "/home/nginx/bak",
      remoteDir: "/home/nginx/html",
      localDir: "C:/Users/22584/Desktop/Linmon/dist/prod/dist",
    },
  },
};